//go:build js && wasm

package main

import (
	"fmt"

	"wraith.me/vaultlib/jsbind"
)

func main() {
	//Instantiate a channel, 'ch', with no buffer, acting as a synchronization point for the goroutine.
	ch := make(chan struct{})

	//Quick sanity check
	fmt.Println("heelo worl")
	//js.Global().Call("alert", "Hello from Golang!")

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT BELOW THIS BLOCK
	//

	jsbind.ExportF(
		jsbind.Ed25519Keygen,
		jsbind.HKDF,
	)
	jsbind.ExportV(
		jsbind.NV("HKDF_SALT", jsbind.HKDF_SALT),
	)

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT ABOVE THIS BLOCK
	//

	//Utilize a channel receive expression to halt the 'main' goroutine, preventing the program from terminating.
	<-ch
}
