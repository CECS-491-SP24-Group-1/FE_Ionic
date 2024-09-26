//go:build js && wasm

//TODO: make variant of this that supports marshalling via TextMarshaller or function mapper
//TODO: static functions
//TODO: attempt localstorage saving/loading

package ffi

import (
	"encoding/json"
	"fmt"
	"reflect"
	"syscall/js"

	"github.com/creasty/defaults"
	"wraith.me/vaultlib/jsutil"
)

var (
	GSTagName    = "js"
	GetterPrefix = "get"
	SetterPrefix = "get"

	FJsonName = "fromJson"
	TJsonName = "toJson"
	FGobName  = "fromGob64"
	TGobName  = "toGob64"

	EqualsName   = "equals"
	HashcodeName = "hashcode"
	ToStringName = "toString"
)

// Acts as a NOP for a setter that isn't necessary.
func SNOP[T any](_ *T, _ js.Value) error {
	return nil
}

// Wraps an existing struct in preparation for exportation to JS.
type StructExporter[T any] struct {
	//The target struct to export. The actual value of this struct is not used.
	v T

	//The export name of the struct. By default, this will be the name of the struct itself.
	name string

	//The options flags for this struct wrapper.
	flags Flags

	//The struct's fields, including name and kind.
	fields []structfield

	//The struct's primary constructor.
	constructor Factory[T]

	//Holds the static factory functions for the struct.
	factories []FWrapper[T] //factory type

	//Holds the getters for the struct; the length must match up with `fieldNames`.
	getters []Getter[T]

	//Holds the methods for the struct.
	methods []FWrapper[T] //method type

	//Holds the setters for the struct; the length must match up with `fieldNames`.
	setters []Setter[T]
}

// Creates a new struct exporter around a given struct.
func NewStructExporter[T any](v T, constructor Factory[T]) *StructExporter[T] {
	//Get the struct's info and ensure it really is a struct
	val := reflect.ValueOf(v)
	if val.Kind() != reflect.Struct {
		jsutil.JSFatal(fmt.Errorf("expected a struct; got '%s'", val.Type().Name()))
		return nil
	}

	//Get the struct's exported fields
	fields := make([]structfield, val.NumField())
	for i := 0; i < val.NumField(); i++ {
		//Get the current field and its name
		field := val.Type().Field(i)
		name := field.Name
		kind := field.Type.Kind()

		//Check if the field has a `js` tag; overwrite the name if so
		tagValue := field.Tag.Get(GSTagName)
		if tagValue != "" {
			name = tagValue
		}

		//Add the field to the list
		fields[i] = structfield{n: name, t: kind}
	}

	//Set the flags of the exporter
	flags := Flags{}
	defaults.Set(&flags)

	//Construct and return the struct exporter
	return &StructExporter[T]{
		v:           v,
		name:        val.Type().Name(),
		flags:       flags,
		fields:      fields,
		constructor: constructor,
	}
}

// Overrides the current settings of the exporter.
func (se *StructExporter[T]) WithFlags(flags Flags) *StructExporter[T] {
	se.flags = flags
	return se
}

// Adds static factory functions to the struct.
func (se *StructExporter[T]) WithFactories(factories ...FWrapper[T]) *StructExporter[T] {
	se.factories = factories
	return se
}

// Adds getters to the struct.
func (se *StructExporter[T]) WithGetters(getters ...Getter[T]) *StructExporter[T] {
	//Ensure there are enough getters available to cover all fields
	if len(getters) != len(se.fields) {
		jsutil.JSFatal(fmt.Errorf("%w %d", NotEnoughGettersError, len(se.fields)))
		return nil
	}

	//Assign the getters
	se.getters = getters
	return se
}

// Adds instance functions (methods) to the struct.
func (se *StructExporter[T]) WithMethods(methods ...FWrapper[T]) *StructExporter[T] {
	se.methods = methods
	return se
}

// Adds setters to the struct.
func (se *StructExporter[T]) WithSetters(setters ...Setter[T]) *StructExporter[T] {
	//Ensure there are enough setters available to cover all fields
	if len(setters) != len(se.fields) {
		jsutil.JSFatal(fmt.Errorf("%w %d", NotEnoughSettersError, len(se.fields)))
		return nil
	}

	//Assign the getters
	se.setters = setters
	return se
}

// Exports a struct for use in JS, given a name to bind it to.
func (se StructExporter[T]) Export(name string) {
	//Export the type for JS
	if name == "" {
		name = se.name
	}
	js.Global().Set(name, js.FuncOf(se.exportBackend))

	//Add the built-in factory functions to the list
	se.factories = append(se.factories,
		NewFactory(FJsonName, se.jsonDeserial),
		NewFactory(FGobName, se.gobDeserial),
	)

	//Register every static factory functions
	for _, f := range se.factories {
		//Capture current field information for closure
		factory := f

		//Create a wrapper function for the factory function
		factWrapper := func(_ js.Value, args []js.Value) interface{} {
			//Call the factory function
			obj, err := factory.CallFactory(args)
			if err != nil {
				jsutil.JSFatal(fmt.Errorf("error while running %s::%s(); %s", se.name, factory.Name, err))
				return nil
			}

			//Emit a new object
			return se.wrapperBackend(obj)
		}

		//Register the factory wrapper with the object
		js.Global().Get(name).Set(factory.Name, js.FuncOf(factWrapper))
	}
}

/*
Generates a new struct object and adds a constructor, static factory
functions, and instance methods.
*/
func (se *StructExporter[T]) exportBackend(_ js.Value, args []js.Value) any {
	//Invoke the constructor and replace the object with this one
	obj, err := se.constructor(args)
	if err != nil {
		jsutil.JSFatal(fmt.Errorf("error while calling constructor for symbol %s: %s", se.name, err))
	}

	//Acquire a backend wrapper
	wrapper := se.wrapperBackend(obj)

	//Return the wrapper
	return wrapper
}

/*
Generates a new object of the struct and adds its attributes via getters
and setters along with their function equivalents.
*/
func (se StructExporter[T]) wrapperBackend(obj *T) js.Value {
	//Create a new JS wrapper object
	wrapper := js.Global().Get("Object").New()

	//Get the struct info using reflection
	reflected := reflect.ValueOf(*obj)

	//Loop over the fields of the struct
	for i, f := range se.fields {
		//Capture current field information for closure
		fname := f.n
		fval := reflected.Field(i).Interface()
		//fkind := f.t
		idx := i

		//Generate the getter and setter names
		getterName := GetterPrefix + upperFirst(fname)
		setterName := SetterPrefix + upperFirst(fname)

		//Define the getter and setter functions; temp
		getter := func(this js.Value, args []js.Value) interface{} {
			//Check if the getter array has the necessary function
			var val js.Value = js.ValueOf(nil)
			var err error
			if !se.flags.IgnoreGettersSetters && len(se.getters) >= idx {
				//Call the getter
				val, err = se.getters[idx](obj)
			} else {
				//Marshal the current field to JSON
				var jsonb []byte
				jsonb, err = json.Marshal(fval)

				//If the kind of the field is not struct, then strip away quotes

				fmt.Printf("json out: '%s'\n", string(jsonb))
			}

			//Handle any errors that occurred
			if err != nil {
				jsutil.JSFatal(fmt.Errorf("error while running %s() getter for symbol %s: %s", getterName, se.name, err))
				return js.ValueOf(nil)
			}

			//Emit the value as a JS type
			return js.ValueOf(val)
		}
		setter := func(this js.Value, args []js.Value) interface{} {
			//Check if the setter array has the necessary function
			var err error
			input := args[0]
			if !se.flags.IgnoreGettersSetters && len(se.setters) >= idx {
				//Call the setter
				err = se.setters[idx](obj, input)
			}
			//TODO: handle assignment here

			//Handle any errors that occurred
			if err != nil {
				jsutil.JSFatal(fmt.Errorf("error while running %s() setter for symbol %s: %s", setterName, se.name, err))
				return js.ValueOf(nil)
			}

			return js.ValueOf(nil)
		}

		//Add property-style getter and setter
		js.Global().Get("Object").Call(
			"defineProperty", wrapper, fname,
			js.ValueOf(map[string]interface{}{
				"get": js.FuncOf(getter),
				"set": js.FuncOf(setter),
			}),
		)

		//Add function-style getter and setter, if enabled
		if se.flags.EmitGetterSetterFuncs {
			wrapper.Set(getterName, js.FuncOf(getter))
			wrapper.Set(setterName, js.FuncOf(setter))
		}
	}

	//Add the built-in instance methods to the list
	se.methods = append(se.methods,
		NewMethod(TJsonName, se.jsonSerial),
		NewMethod(TGobName, se.gobSerial),
		NewMethod(EqualsName, se.equals),
		NewMethod(HashcodeName, se.hashcode),
		NewMethod(ToStringName, se.toString),
	)

	//Register every instance method
	for _, m := range se.methods {
		//Capture current field information for closure
		method := m

		//Create a wrapper function for the instance function
		methWrapper := func(this js.Value, args []js.Value) interface{} {
			//Call the instance function
			val, err := method.CallMethod(obj, this, args)
			if err != nil {
				jsutil.JSFatal(fmt.Errorf("error while running %s.%s(); %s", se.name, method.Name, err))
				return nil
			}
			return val
		}

		//Register the method with the wrapper
		wrapper.Set(method.Name, js.FuncOf(methWrapper))
	}

	//Return the wrapper
	return wrapper
}
