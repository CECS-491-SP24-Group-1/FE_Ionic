//go:build js && wasm

package main

import (
	"fmt"

	"wraith.me/vaultlib/jsbind"
	"wraith.me/vaultlib/jsutil"
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

	jsutil.ExportF("",
		jsbind.HKDF,
	)
	jsutil.ExportV("",
		jsutil.NV("HKDF_SALT", jsbind.HKDF_SALT),
	)

	//Vaultlib stuff
	jsbind.ExportKS()
	jsbind.ExportVault()

	//wasm.Alert("eee")

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT ABOVE THIS BLOCK
	//

	//Utilize a channel receive expression to halt the 'main' goroutine, preventing the program from terminating.
	<-ch
}
