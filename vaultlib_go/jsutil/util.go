//go:build js && wasm

package jsutil

import (
	"encoding/json"
	"fmt"
	"runtime"
	"strings"
	"syscall/js"

	"github.com/norunners/vert"
)

var (
	// Represents a nil value.
	Nil = js.ValueOf(nil)
)

// Converts a JS object to a Go object using Vert.
func Cast[T any](val js.Value) T {
	v := vert.ValueOf(val)
	var out T
	v.AssignTo(&out)
	return out
}

// Creates a generic array from a given array.
func GenerifyArray[T any](arr []T) []interface{} {
	out := make([]interface{}, len(arr))
	for i := 0; i < len(arr); i++ {
		out[i] = interface{}(arr[i])
	}
	return out
}

// Checks if a JS value has a specific property.
func HasProperty(obj js.Value, prop string) bool {
	return !obj.Get(prop).IsUndefined()
}

// Checks if a JS value has a specific property, catching any panics that may occur.
func HasPropertySafe(obj js.Value, prop string) (has bool, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic occurred: %v", r)
		}
	}()
	has = !obj.Get(prop).IsUndefined()
	return
}

// Mimics a ternary operator found in other languages.
func If[T any](cond bool, tval, fval T) T {
	if cond {
		return tval
	} else {
		return fval
	}
}

// Creates a Golang array from a JS array.
func JSArray2GoArray[T any](jsa js.Value, maxlen int, convFunc func(v js.Value) T) []T {
	//Allocate the output array
	arr := make([]T, maxlen)

	//Loop over the JS array and copy the values
	for i := 0; i < min(jsa.Length(), maxlen); i++ {
		arr[i] = convFunc(jsa.Index(i)) //Dynamically calling the correct conversion function
	}

	//Return the array
	return arr
}

// Creates a Golang byte array from a JS array.
func JSArray2GoByteArray(jsa js.Value, maxlen int) []byte {
	return JSArray2GoArray[byte](jsa, maxlen, Cast)
}

// Emits errors to the JS console if any occur and calls `Throw()` after.
func JSErr(errs ...error) {
	strErrs := make([]string, len(errs))
	for i, err := range errs {
		strErrs[i] = err.Error()
	}
	jsLog("error", strErrs...)
	Throw(strings.Join(strErrs, ", "))
}

// Emits errors to the JS console if any occur and calls `panic()` after.
func JSFatal(errs ...error) {
	strErrs := make([]string, len(errs))
	for i, err := range errs {
		strErrs[i] = err.Error()
	}
	jsLog("error", strErrs...)
	panic(strErrs)
}

// Emits a string or series of strings to the console.
func jsLog(typ string, msgs ...string) {
	//Get the name of the caller
	var caller string
	pc, _, _, ok := runtime.Caller(2)
	if !ok {
		caller = "<Unknown Function>"
	} else {
		caller = runtime.FuncForPC(pc).Name()
	}

	//Format the output string
	out := fmt.Sprintf(
		"---|/!\\| vaultlib::%s with function %s |/!\\|---\n%v\n",
		typ,
		caller,
		strings.Join(msgs, "\n"),
	)

	//Call `console.error`
	js.Global().Get("console").Call(typ, out)
}

// Emits warnings to the JS console if any occur.
func JSWarn(warns ...string) {
	jsLog("warn", warns...)
}

// Calls `JSON.parse()` on a given string.
func Parse[T js.Value | string](val T) js.Value {
	return js.Global().Get("JSON").Call("parse", val)
}

// Returns a JSON object, given a generic object.
func RetJObj[T any](v T) js.Value {
	//Marshal to JSON
	jsonb, err := json.Marshal(v)
	if err != nil {
		JSErr(err)
		return js.ValueOf(nil)
	}

	//Parse to a JSON object
	jsons := string(jsonb)
	return Parse(jsons)
}

// Calls `JSON.stringify()` on a given JS val.
func Stringify(val js.Value) string {
	return js.Global().Get("JSON").Call("stringify", val).String()
}

// Throws a JS exception. Requires backing support from `wasm_exec.js` via a patch.
//
//go:wasmimport gojs wraith.me/vaultlib/jsutil.Throw
func Throw(message string)
