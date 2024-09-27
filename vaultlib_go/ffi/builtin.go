//go:build js && wasm

package ffi

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/io"
)

//TODO: test to see if the item is in local/session storage

var (
	FGobName  = "fromGob64"
	TGobName  = "toGob64"
	FJsonName = "fromJson"
	TJsonName = "toJson"

	EqualsName   = "equals"
	HashcodeName = "hashcode"
	ToStringName = "toString"

	FLSName = "fromLStore"
	ILSName = "inLStore"
	TLSName = "toLStore"

	FSSName = "fromSStore"
	ISSName = "inSStore"
	TSSName = "toSStore"

	FJLSName = "fromJLStore"
	IJLSName = "inJLStore"
	TJLSName = "toJLStore"

	FJSSName = "fromJSStore"
	IJSSName = "inJSStore"
	TJSSName = "toJSStore"
)

var (
	localstorage   = jsutil.NewLocalStorage()
	sessionstorage = jsutil.NewSessionStorage()
)

//-- Basic (de)serializers

// Deserializes a struct from GOB base64.
//
// SigN: fromGob64(gob64: string): T
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) fromGob64(args []js.Value) (*T, error) {
	str := args[0].String()
	obj := new(T)
	err := io.GString2Obj(obj, &str)
	return obj, err
}

// Serializes a struct to GOB base64.
//
// SigN: toGob64(): string
// Type: built-in method; returns `string`
func (se StructExporter[T]) toGob64(obj *T, _ js.Value, _ []js.Value) (js.Value, error) {
	str := ""
	err := io.Obj2GString(&str, obj)
	return js.ValueOf(str), err
}

// Deserializes a struct from JSON
//
// SigN: fromJson(json: string): T
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) fromJson(args []js.Value) (*T, error) {
	//Get the 1st and only argument as a string
	jsons := args[0].String()

	//Unmarshal the target object from JSON
	obj := new(T)
	err := json.Unmarshal([]byte(jsons), obj)
	return obj, err
}

// Serializes a struct to JSON
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
	return se.fromWebStorage(localstorage, key)
}

//
//-- Backends for webstorage stuff
//

func (se StructExporter[T]) fromWebStorage(engine *jsutil.Storage, key string) (*T, error) {
	//Ensure the vault exists in storage
	/*
		if !engine.Has(key){
			return nil, fmt.Errorf("%w; key: %s", NotInWebStorageError, key)
		}
	*/

	return new(T), nil
}

func (se StructExporter[T]) toWebStorage(engine *jsutil.Storage, target *T, key string) error {
	return nil
}
