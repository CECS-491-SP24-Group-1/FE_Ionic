//go:build js && wasm

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
	TagName      = "js"
	GetterPrefix = "get"
	SetterPrefix = "set"
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
	//fields []structfield
	fields []string

	//The struct's primary constructor.
	constructor Factory[T]

	//Holds the static factory functions for the struct.
	factories map[string]FWrapper[T] //factory type

	//Holds the getters for the struct; the length must match up with `fieldNames`.
	getters []Getter[T]

	//Holds the methods for the struct.
	methods map[string]FWrapper[T] //method type

	//Holds the setters for the struct; the length must match up with `fieldNames`.
	setters []Setter[T]

	//Holds the static functions for the struct.
	statics map[string]FWrapper[T] //static type

	//Holds the function to call when a setter is invoked.
	setterHook Hook[T]
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
	//fields := make([]structfield, val.NumField())
	fields := make([]string, val.NumField())
	for i := 0; i < val.NumField(); i++ {
		//Get the current field and its name
		field := val.Type().Field(i)
		name := field.Name
		//kind := field.Type.Kind()

		//Check if the field has a `js` tag; overwrite the name if so
		tagValue := field.Tag.Get(TagName)
		if tagValue != "" {
			name = tagValue
		}

		//Add the field to the list
		//fields[i] = structfield{n: name, t: kind}
		fields[i] = name
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

		//Initialize maps
		factories: make(map[string]FWrapper[T]),
		methods:   make(map[string]FWrapper[T]),
		statics:   make(map[string]FWrapper[T]),
	}
}

// Overrides the current settings of the exporter.
func (se *StructExporter[T]) WithFlags(flags Flags) *StructExporter[T] {
	se.flags = flags
	return se
}

// Adds static factory functions to the struct.
func (se *StructExporter[T]) WithFactories(opts *FuncOpts, factories ...FWrapper[T]) *StructExporter[T] {
	withExtraFuncBackend(se.factories, opts, factories...)
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
func (se *StructExporter[T]) WithMethods(opts *FuncOpts, methods ...FWrapper[T]) *StructExporter[T] {
	withExtraFuncBackend(se.methods, opts, methods...)
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

// Adds static functions to the struct.
func (se *StructExporter[T]) WithStatics(opts *FuncOpts, statics ...FWrapper[T]) *StructExporter[T] {
	withExtraFuncBackend(se.statics, opts, statics...)
	return se
}

// Adds a setter hook to the struct.
func (se *StructExporter[T]) WithSetterHook(hook Hook[T]) *StructExporter[T] {
	se.setterHook = hook
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
	se.WithFactories(builtinOpts(),
		//Basic deserializers
		NewFactory(FJsonName, se.fromJson),
		NewFactory(FGobName, se.fromGob64),
		NewFactory(FJSObjectName, se.fromJSObject),
		//Webstorage deserializers: GOB
		NewFactory(FLSName, se.fromLStore),
		NewFactory(FSSName, se.fromSStore),
		//Webstorage deserializers: JSON
		NewFactory(FJLSName, se.fromJLStore),
		NewFactory(FJSSName, se.fromJSStore),
	)

	//Add the built-in static functions to the list
	se.WithStatics(builtinOpts(),
		//Webstorage checkers: GOB
		NewStatic[T](ILSName, se.inLStore),
		NewStatic[T](ISSName, se.inSStore),
		//Webstorage checkers: JSON
		NewStatic[T](IJLSName, se.inJLStore),
		NewStatic[T](IJSSName, se.inJSStore),
	)

	//Register every static factory function
	for _, f := range se.factories {
		//Capture current field information for closure
		factory := f

		//Create a wrapper function for the factory function
		factWrapper := func(_ js.Value, args []js.Value) interface{} {
			//Call the factory function
			obj, err := factory.CallFactory(args)
			if err != nil {
				jsutil.JSErr(fmt.Errorf("error while running %s::%s(); %s", se.name, factory.Name, err))
				return nil
			}

			//Emit a new object
			return se.wrapperBackend(obj)
		}

		//Register the factory wrapper with the object
		js.Global().Get(name).Set(factory.Name, js.FuncOf(factWrapper))
	}

	//Register every static function
	for _, s := range se.statics {
		//Capture current field information for closure
		static := s

		//Create a wrapper function for the static function
		statWrapper := func(_ js.Value, args []js.Value) interface{} {
			//Call the static function
			ret, err := static.CallStatic(args)
			if err != nil {
				jsutil.JSErr(fmt.Errorf("error while running %s::%s(); %s", se.name, static.Name, err))
				return nil
			}
			return ret
		}

		//Register the factory wrapper with the object
		js.Global().Get(name).Set(static.Name, js.FuncOf(statWrapper))
	}
}

/*
Generates a new struct object and adds a constructor, static factory
functions, and instance methods.
*/
func (se *StructExporter[T]) exportBackend(_ js.Value, args []js.Value) any {
	//Create a new object of type `T`
	obj := new(T)

	//Invoke the constructor (if it exists) and replace the object with it
	if se.constructor != nil {
		var err error
		obj, err = se.constructor(args)
		if err != nil {
			jsutil.JSErr(fmt.Errorf("error while calling constructor for symbol %s: %s", se.name, err))
		}
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
	//A pointer to original is fetched and dereferenced
	reflectStruct := reflect.ValueOf(obj).Elem()

	//Loop over the fields of the struct
	for i, f := range se.fields {
		//Capture current field information for closure
		idx := i
		fname := f
		fvalue := reflectStruct.Field(idx)
		ftype := fvalue.Type()

		//Define the getter and setter functions; temp
		getter := func(this js.Value, args []js.Value) interface{} {
			//Check if the getter array has the necessary function and it's non-nil
			var val js.Value = js.ValueOf(nil)
			var err error
			if !se.flags.IgnoreGettersSetters && len(se.getters) > idx {
				//Call the getter if its non-nil
				if se.getters[idx] != nil {
					val, err = se.getters[idx](obj)
				}
			} else {
				//Marshal the current field to JSON and emit it as a JSONObject via `JSON.parse()`
				//fmt.Printf("using built-in getter for symbol %s\n", fname)
				var jsonb []byte
				jsonb, err = json.Marshal(fvalue.Interface())
				val = jsutil.Parse(string(jsonb))
			}

			//Handle any errors that occurred
			if err != nil {
				jsutil.JSErr(fmt.Errorf("error while running %s getter for symbol %s: %s", fname, se.name, err))
				return js.ValueOf(nil)
			}

			//Emit the value as a JS type
			return js.ValueOf(val)
		}
		setter := func(this js.Value, args []js.Value) interface{} {
			//Check if the setter array has the necessary function and it's non-nil
			var err error
			input := args[0]
			if !se.flags.IgnoreGettersSetters && len(se.setters) > idx {
				//Call the setter if its non-nil
				if se.setters[idx] != nil {
					err = se.setters[idx](obj, input)
				}
			} else {
				//fmt.Printf("using built-in setter for symbol %s\n", fname)
				//Determine if initial JSON serialization can be skipped
				//This is the case for the following types: `string<type: json>`
				skipJsonSerial := false
				if input.Type() == js.TypeString &&
					json.Valid([]byte(input.String())) {
					skipJsonSerial = true
				}
				//fmt.Printf("incoming type: %s\n", input.Type().String())

				//Skip 1st pass serialization if requested
				jsons := input.String()
				if !skipJsonSerial {
					//Serialize the input value to JSON via `JSON.stringify()`
					jsons = jsutil.Stringify(input)
				}

				//Using reflection, derive the "zero value" of the field at index i in the struct
				//A new instance is created and dereferenced
				newFVal := reflect.New(ftype).Elem()

				//Unmarshal the value to a generic interface
				err = json.Unmarshal([]byte(jsons), newFVal.Addr().Interface())

				//Only update the object if no errors occurred
				if err == nil {
					//Set the new value in-place into the original struct's field
					//The value is deserialized and set in-place
					fvalue.Set(newFVal)

					//Call the setter hook if one is set
					if se.setterHook != nil {
						se.setterHook(obj, this, args)
					}
				}
			}

			//Handle any errors that occurred
			if err != nil {
				jsutil.JSErr(fmt.Errorf("error while running %s setter for symbol %s: %s", fname, se.name, err))
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
			//Generate the getter and setter names
			getterName := GetterPrefix + upperFirst(fname)
			setterName := SetterPrefix + upperFirst(fname)

			//Create the necessary functions
			wrapper.Set(getterName, js.FuncOf(getter))
			wrapper.Set(setterName, js.FuncOf(setter))
		}
	}

	//Add the built-in instance methods to the list
	se.WithMethods(builtinOpts(),
		//Serializers
		NewMethod(TJsonName, se.toJson),
		NewMethod(TGobName, se.toGob64),
		NewMethod(TJSObjectName, se.toJSObject),
		//Essential object methods
		NewMethod(EqualsName, se.equals),
		NewMethod(HashcodeName, se.hashcode),
		NewMethod(ToStringName, se.toString),
		//Webstorage serializers
		NewMethod(TLSName, se.toLStore),
		NewMethod(TSSName, se.toSStore),
		NewMethod(TJLSName, se.toJLStore),
		NewMethod(TJSSName, se.toJSStore),
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
				jsutil.JSErr(fmt.Errorf("error while running %s.%s(); %s", se.name, method.Name, err))
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
