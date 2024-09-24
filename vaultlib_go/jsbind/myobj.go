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

	if len(args) > 0 && args[0].Type() == js.TypeString {
		obj.SetFoo(args[0].String())
	}

	wrapper := js.Global().Get("Object").New()

	// Define getter
	js.Global().Get("Object").Call("defineProperty", wrapper, "foo", js.ValueOf(map[string]interface{}{
		"get": js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			return fmt.Sprintf("%s::%s <via getter>", obj.Foo, base64.StdEncoding.EncodeToString([]byte(obj.Foo)))
		}),
		"set": js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			if len(args) > 0 {
				obj.SetFoo(args[0].String())
			}
			return nil
		}),
	}))

	// Keep the existing methods
	wrapper.Set("setFoo", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) > 0 {
			obj.SetFoo(args[0].String())
		}
		return nil
	}))

	wrapper.Set("getFoo", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return fmt.Sprintf("%s::%s <via get method>", obj.Foo, base64.StdEncoding.EncodeToString([]byte(obj.Foo)))
	}))

	return wrapper
}
