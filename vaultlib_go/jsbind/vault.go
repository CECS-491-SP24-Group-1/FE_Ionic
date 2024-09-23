//go:build js && wasm

package jsbind

import "syscall/js"

func Test(_ js.Value, _ []js.Value) interface{} {
	return "goofagiaj"
}
