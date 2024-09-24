//go:build js && wasm

package jsbind

import (
	"encoding/base64"
	"fmt"
	"syscall/js"
)

type MyObject struct {
	Foo string
}

func (o *MyObject) SetFoo(value string) {
	o.Foo = value
}

func NewMyObject(this js.Value, args []js.Value) interface{} {
	obj := &MyObject{}

	// Set initial Foo value if provided
	if len(args) > 0 && args[0].Type() == js.TypeString {
		obj.SetFoo(args[0].String())
	}

	wrapper := js.Global().Get("Object").New()

	wrapper.Set("setFoo", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) > 0 {
			obj.SetFoo(args[0].String())
		}
		return nil
	}))

	wrapper.Set("getFoo", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return fmt.Sprintf("%s::%s", obj.Foo, base64.StdEncoding.EncodeToString([]byte(obj.Foo)))
	}))

	return wrapper
}
