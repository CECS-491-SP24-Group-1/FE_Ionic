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
	FJsonName = "fromJson"
	TJsonName = "toJson"
	FGobName  = "fromGob64"
	TGobName  = "toGob64"

	EqualsName   = "equals"
	HashcodeName = "hashcode"
	ToStringName = "toString"

	FLSName = "fromLStore"
	ILSName = "inLStore"
	TLSName = "toLStore"

	FSSName = "fromSStore"
	ISSName = "inSStore"
	TSSName = "toSStore"
)

var (
	localstorage = jsutil.NewLocalStorage()
	sessionstorage = jsutil.NewSessionStorage()
)

// Deserializes a struct from JSON
//
// Name: fromJson()
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) jsonDeserial(args []js.Value) (*T, error) {
	//Get the 1st and only argument as a string
	jsons := args[0].String()

	//Unmarshal the target object from JSON
	obj := new(T)
	err := json.Unmarshal([]byte(jsons), obj)
	return obj, err
}

// Serializes a struct to JSON
//
// Name: toJson()
// Type: built-in method; returns `string`
func (se StructExporter[T]) jsonSerial(obj *T, _ js.Value, _ []js.Value) (js.Value, error) {
	//Marshal the target object to JSON
	jsons, err := json.Marshal(obj)
	if err != nil {
		return js.ValueOf(nil), err
	}

	//Emit the JSON as a string
	return js.ValueOf(string(jsons)), nil
}

// Deserializes a struct from GOB base64.
//
// Name: fromGob64()
// Type: built-in factory; takes `string`, returns `object`
func (se StructExporter[T]) gobDeserial(args []js.Value) (*T, error) {
	str := args[0].String()
	obj := new(T)
	err := io.GString2Obj(obj, &str)
	return obj, err
}

// Serializes a struct to GOB base64.
//
// Name: toGob64()
// Type: built-in method; returns `string`
func (se StructExporter[T]) gobSerial(obj *T, _ js.Value, _ []js.Value) (js.Value, error) {
	str := ""
	err := io.Obj2GString(&str, obj)
	return js.ValueOf(str), err
}

// Checks if this object is equal to another.
//
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
// Type: built-in method; returns `string`
func (se StructExporter[T]) toString(_ *T, this js.Value, _ []js.Value) (js.Value, error) {
	//Serialize this object to JSON
	jsons := this.Call(TJsonName).String()

	//Add extra stuff and return the final string
	jsons = se.name + jsons
	return js.ValueOf(jsons), nil
}


//
//-- Backends for webstorage stuff
//