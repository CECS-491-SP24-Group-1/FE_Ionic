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
