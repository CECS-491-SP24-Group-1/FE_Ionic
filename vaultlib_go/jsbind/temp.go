//go:build js && wasm

package jsbind

import (
	"fmt"
	"syscall/js"

	"wraith.me/vaultlib/vaultlib"
)

// Ed25519Keygen() -> string
func Ed25519Keygen(_ js.Value, _ []js.Value) interface{} {
	//Create the Go object and marshal to JSON
	///json :=

	//Call `JSON.parse()` on the string to derive an object usable in JS
	//return js.Global().Get("JSON").Call("parse", json)

	fmt.Println("running the jsbind.Ed25519Keygen file")
	return vaultlib.Ed25519SK()
}

// HKDF(password: string) -> string
func HKDF(this js.Value, args []js.Value) interface{} {
	//password := Val2Any[string](args[0])
	//key, err := crypto.Ed25519HKDF(password, nil, nil)

	println("Button clicked!")
	return nil
}
