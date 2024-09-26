//go:build js && wasm

package ffi

import (
	"reflect"
	"unicode"
)

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
