//go:build js && wasm

package ffi

import (
	"encoding/json"
	"reflect"
	"syscall/js"
	"unicode"
)

//-- Public utilities

// Casts a JS value to the target type via marshal to JSON and back again.
func Cast[T any](val js.Value) (*T, error) {
	//Marshal to JSON
	jsons := val.Call(TJsonName).String()

	//Unmarshal to the target type
	out := new(T)
	err := json.Unmarshal([]byte(jsons), out)
	return out, err
}

//-- Private types and utilities

// Defines a single struct field.
type structfield struct {
	n string       //The name of the field.
	t reflect.Kind //The type of the field.
}

// Uppercases the first letter in a string.
func upperFirst(s string) string {
	if s == "" {
		return s
	}
	idx := 0
	runes := []rune(s)
	runes[idx] = unicode.ToUpper(runes[idx])
	return string(runes)
}

// Serves as the backend for the factory, method, and static adders.
func withExtraFuncBackend[T any](target map[string]FWrapper[T], opts *FuncOpts, functions ...FWrapper[T]) {
	//Sets the default options if none were provided
	if opts == nil {
		opts = DefaultOpts()
	}

	//Replace or append the new items
	if !opts.Append {
		clear(target)
	}

	/*
		Loop over the functions. The replacement strategy is as follows:

		If the method doesn't exist or if opts.ReplaceExisting is true,
		then the incoming function is set, adding a new one or replacing
		an existing one if allowed to do so.
	*/
	for _, function := range functions {
		if _, exists := target[function.Name]; !exists || opts.ReplaceExisting {
			target[function.Name] = function
		}
	}
}
