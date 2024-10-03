//go:build js && wasm

package ffi

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/io"
)

var (
	FGobName      = "fromGob64"
	TGobName      = "toGob64"
	FJsonName     = "fromJson"
	TJsonName     = "toJson"
	TJSObjectName = "toJSObject"
	FJSObjectName = "fromJSObject"

	EqualsName   = "equals"
	HashcodeName = "hashcode"
	ToStringName = "toString"

	FLSName = "fromLStore"
	TLSName = "toLStore"

	FSSName = "fromSStore"
	TSSName = "toSStore"

	FJLSName = "fromJLStore"
	TJLSName = "toJLStore"

	FJSSName = "fromJSStore"
	TJSSName = "toJSStore"

	ILSName = "inLStore"
	ISSName = "inSStore"

	IJLSName = "inJLStore"
	IJSSName = "inJSStore"
)

var (
	localstorage   = jsutil.NewLocalStorage()
	sessionstorage = jsutil.NewSessionStorage()
)

//-- Basic (de)serializers

// Deserializes a struct from GOB base64.
//
// SigN: fromGob64(gob64: string): T
// Type: built-in factory; takes `string`, returns `T`
func (se StructExporter[T]) fromGob64(args []js.Value) (*T, error) {
	str := args[0].String()
	obj := new(T)
	err := io.GString2Obj([]byte(str), obj)
	return obj, err
}

// Serializes a struct to GOB base64.
//
// SigN: toGob64(): string
// Type: built-in method; returns `string`
func (se StructExporter[T]) toGob64(obj *T, _ js.Value, _ []js.Value) (js.Value, error) {
	str, err := io.Obj2GString(obj)
	return js.ValueOf(string(str)), err
}

// Deserializes a struct from JSON.
//
// SigN: fromJson(json: string): T
// Type: built-in factory; takes `string`, returns `T`
func (se StructExporter[T]) fromJson(args []js.Value) (*T, error) {
	//Get the 1st and only argument as a string
	jsons := args[0].String()

	//Unmarshal the target object from JSON
	obj := new(T)
	err := json.Unmarshal([]byte(jsons), obj)
	return obj, err
}

// Serializes a struct to JSON.
//
// SigN: toJson(): string
// Type: built-in method; returns `string`
func (se StructExporter[T]) toJson(obj *T, _ js.Value, _ []js.Value) (js.Value, error) {
	//Marshal the target object to JSON
	jsons, err := json.Marshal(obj)
	if err != nil {
		return js.ValueOf(nil), err
	}

	//Emit the JSON as a string
	return js.ValueOf(string(jsons)), nil
}

// Serializes a struct to JSON and then creates a plain JS object.
//
// SigN: toJSObject(): object
// Type: built-in method; returns `object`
func (se StructExporter[T]) toJSObject(obj *T, this js.Value, args []js.Value) (js.Value, error) {
	//Marshal the target object to JSON
	jsons, err := se.toJson(obj, this, args)
	if err != nil {
		return js.ValueOf(nil), err
	}

	//Convert to a JS Object via `JSON.parse()`
	return jsutil.Parse(jsons), nil
}

// Deserializes a struct from a plain JS object.
//
// SigN: fromJSObject(jsobj: object): T
// Type: built-in factory; takes `object`, returns `T`
func (se StructExporter[T]) fromJSObject(args []js.Value) (*T, error) {
	//Get the 1st and only argument as an object and derive its JSON string form with `JSON.stringify()`
	jsobj := args[0]
	jsons := jsutil.Stringify(jsobj)

	return se.fromJson([]js.Value{js.ValueOf(jsons)})
}

//-- Object essential methods

// Checks if this object is equal to another.
//
// SigN: equals(other: T): boolean
// Type: built-in method; takes `object`, returns `boolean`
func (se StructExporter[T]) equals(_ *T, this js.Value, args []js.Value) (val js.Value, err error) {
	//Catch any panic() that may occur
	defer func() {
		if r := recover(); r != nil {
			//Simply return false instead of panicking
			val, err = js.ValueOf(false), nil
			//log.Println("Recovered from panic:", r)
		}
	}()

	//Get the other item from the args
	other := args[0]

	//Immediately return false if this is not an object
	if other.Type() != js.TypeObject {
		val, err = js.ValueOf(false), nil
		return
	}

	//Attempt to serialize the incoming object to JSON
	//If this fails, then a `panic()` will be thrown, but caught by `defer()`
	//This converts the failing state to a falsy output
	jsonUs := this.Call(TJsonName).String()
	jsonThem := args[0].Call(TJsonName).String()

	//Do a string comparison to determine the equality of the 2 objects
	equals := jsonUs == jsonThem
	val, err = js.ValueOf(equals), nil
	return
}

// Generates the SHA256 hash equivalent of this object via digesting its JSON.
//
// SigN: hashcode(): string
// Type: built-in method; returns `string`
func (se StructExporter[T]) hashcode(_ *T, this js.Value, _ []js.Value) (js.Value, error) {
	//Serialize this object to JSON
	jsons := this.Call(TJsonName).String()

	//Digest the JSON with SHA256
	h := sha256.New()
	_, err := h.Write([]byte(jsons))
	if err != nil {
		return js.ValueOf(""), err
	}

	//Get the final hash as a hex string
	hash := hex.EncodeToString(h.Sum(nil))
	return js.ValueOf(hash), nil
}

// Generates the string equivalent of this object.
//
// SigN: toString(): string
// Type: built-in method; returns `string`
func (se StructExporter[T]) toString(_ *T, this js.Value, _ []js.Value) (js.Value, error) {
	//Serialize this object to JSON
	jsons := this.Call(TJsonName).String()

	//Add extra stuff and return the final string
	jsons = se.name + jsons
	return js.ValueOf(jsons), nil
}

//-- Web storage (de)serializers

// Deserializes a struct from `localStorage` that was encoded using Gob64.
//
// SigN: fromLStore(key: string): T
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) fromLStore(args []js.Value) (*T, error) {
	key := args[0].String()
	return se.fromWebStorage(localstorage, io.GStringUnmarshal[T], key)
}

// Serializes a struct to `localStorage` using Gob64 encoding.
//
// SigN: toLStore(key: string): void
// Type: built-in method; takes `string`, returns `void`
func (se StructExporter[T]) toLStore(obj *T, _ js.Value, args []js.Value) (js.Value, error) {
	key := args[0].String()
	err := se.toWebStorage(localstorage, obj, io.GStringMarshal[T], key)
	return js.ValueOf(nil), err
}

// Deserializes a struct from `sessionStorage` that was encoded using Gob64.
//
// SigN: fromSStore(key: string): T
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) fromSStore(args []js.Value) (*T, error) {
	key := args[0].String()
	return se.fromWebStorage(sessionstorage, io.GStringUnmarshal[T], key)
}

// Serializes a struct to `sessionStorage` using Gob64 encoding.
//
// SigN: toSStore(key: string): void
// Type: built-in method; takes `string`, returns `void`
func (se StructExporter[T]) toSStore(obj *T, _ js.Value, args []js.Value) (js.Value, error) {
	key := args[0].String()
	err := se.toWebStorage(sessionstorage, obj, io.GStringMarshal[T], key)
	return js.ValueOf(nil), err
}

// Deserializes a struct from `localStorage` that was encoded using JSON.
//
// SigN: fromJLStore(key: string): T
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) fromJLStore(args []js.Value) (*T, error) {
	key := args[0].String()
	return se.fromWebStorage(localstorage, json.Unmarshal, key)
}

// Serializes a struct to `localStorage` using JSON encoding.
//
// SigN: toJLStore(key: string): void
// Type: built-in method; takes `string`, returns `void`
func (se StructExporter[T]) toJLStore(obj *T, _ js.Value, args []js.Value) (js.Value, error) {
	key := args[0].String()
	err := se.toWebStorage(localstorage, obj, json.Marshal, key)
	return js.ValueOf(nil), err
}

// Deserializes a struct from `sessionStorage` that was encoded using JSON.
//
// SigN: fromJSStore(key: string): T
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) fromJSStore(args []js.Value) (*T, error) {
	key := args[0].String()
	return se.fromWebStorage(sessionstorage, json.Unmarshal, key)
}

// Serializes a struct to `sessionStorage` using JSON encoding.
//
// SigN: toJSStore(key: string): void
// Type: built-in method; takes `string`, returns `void`
func (se StructExporter[T]) toJSStore(obj *T, _ js.Value, args []js.Value) (js.Value, error) {
	key := args[0].String()
	err := se.toWebStorage(sessionstorage, obj, json.Marshal, key)
	return js.ValueOf(nil), err
}

//-- Web storage item presence detection

// Checks if a Gob64-encoded struct is present in `localStorage`.
//
// SigN: inLStore(key: string): boolean
// Type: built-in static; takes `string`, returns `boolean`
func (se StructExporter[T]) inLStore(args []js.Value) (js.Value, error) {
	key := args[0].String()
	res := se.inWebStorage(localstorage, key, true)
	return js.ValueOf(res), nil
}

// Checks if a Gob64-encoded struct is present in `sessionStorage`.
//
// SigN: inSStore(key: string): boolean
// Type: built-in static; takes `string`, returns `boolean`
func (se StructExporter[T]) inSStore(args []js.Value) (js.Value, error) {
	key := args[0].String()
	res := se.inWebStorage(sessionstorage, key, true)
	return js.ValueOf(res), nil
}

// Checks if a JSON-encoded struct is present in `localStorage`.
//
// SigN: inJLStore(key: string): boolean
// Type: built-in static; takes `string`, returns `boolean`
func (se StructExporter[T]) inJLStore(args []js.Value) (js.Value, error) {
	key := args[0].String()
	res := se.inWebStorage(localstorage, key, false)
	return js.ValueOf(res), nil
}

// Checks if a JSON-encoded struct is present in `sessionStorage`.
//
// SigN: inJSStore(key: string): boolean
// Type: built-in static; takes `string`, returns `boolean`
func (se StructExporter[T]) inJSStore(args []js.Value) (js.Value, error) {
	key := args[0].String()
	res := se.inWebStorage(sessionstorage, key, false)
	return js.ValueOf(res), nil
}

//
//-- Backends for webstorage stuff
//

// Returns a struct object from webstorage by key using a given deserializer.
func (se StructExporter[T]) fromWebStorage(
	engine *jsutil.Storage,
	deserializer func(data []byte, v any) error,
	key string,
) (*T, error) {
	//Ensure the object exists in storage
	if !engine.Has(key) {
		return nil, fmt.Errorf("%w; key: %s", NotInWebStorageError, key)
	}

	//Retrieve the object from webstorage by its key
	ser := engine.Get(key)

	//Deserialize the object from a `[]byte`
	obj := new(T)
	if err := deserializer([]byte(ser), obj); err != nil {
		return nil, err
	}

	return obj, nil
}

// Checks if a struct object exists in webstorage by its key.
func (se StructExporter[T]) inWebStorage(engine *jsutil.Storage, key string, binary bool) bool {
	//Ensure the object exists in storage
	if !engine.Has(key) {
		return false
	}

	//Retrieve the object from webstorage by its key
	ser := engine.Get(key)

	//Determine if the data is valid, given the requirements
	//`json.Valid()` is used for plain and `io.ValidB64()` is used for binary
	if binary {
		return io.ValidB64(ser)
	} else {
		return json.Valid([]byte(ser))
	}
}

// Persists a struct object to webstorage by key using a given serializer.
func (se StructExporter[T]) toWebStorage(
	engine *jsutil.Storage,
	target *T,
	serializer func(v any) ([]byte, error),
	key string,
) error {
	//Serialize the object to a `[]byte`
	ser, err := serializer(target)
	if err != nil {
		return err
	}

	//Ensure the object can be stored before continuing
	if !engine.CanStore() {
		return fmt.Errorf("%w; engine: %s", jsutil.CannotStoreError, engine.EngineName())
	}

	//Persist the object in webstorage by its key
	engine.Set(key, string(ser))
	return nil
}
