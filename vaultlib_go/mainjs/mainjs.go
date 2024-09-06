//go:build wasm

package main

import (
	"fmt"
	"syscall/js"

	"wraith.me/vaultlib/jsbind"
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

	js.Global().Set("ed25519Keygen", js.FuncOf(jsbind.Ed25519Keygen))

	//
	// PUT ALL JS FUNCTIONS TO EXPORT ABOVE THIS BLOCK
	//

	//Utilize a channel receive expression to halt the 'main' goroutine, preventing the program from terminating.
	<-ch
}