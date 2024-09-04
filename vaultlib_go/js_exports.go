package main

import (
	"crypto/ed25519"
	"encoding/base64"
	"fmt"
	"syscall/js"
)

func main() {
	//Instantiate a channel, 'ch', with no buffer, acting as a synchronization point for the goroutine.
	ch := make(chan struct{})

	//Quick sanity check
	fmt.Println("heelo worl")
	//js.Global().Call("alert", "Hello from Golang!")

	//
	// PUT ALL JS FUNCTIONS TO EXPORT BELOW THIS BLOCK
	//

	js.Global().Set("ed25519Keygen", js.FuncOf(ed25519Keygen))

	//
	// PUT ALL JS FUNCTIONS TO EXPORT ABOVE THIS BLOCK
	//

	//Utilize a channel receive expression to halt the 'main' goroutine, preventing the program from terminating.
	<-ch
}

// ed25519Keygen() -> string
func ed25519Keygen(_ js.Value, _ []js.Value) interface{} {
	//Create the Go object and marshal to JSON
	///json :=

	//Call `JSON.parse()` on the string to derive an object usable in JS
	//return js.Global().Get("JSON").Call("parse", json)

	return Ed25519SK()
}

func Ed25519SK() string {
	_, sk, err := ed25519.GenerateKey(nil)
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString([]byte(sk))
}
