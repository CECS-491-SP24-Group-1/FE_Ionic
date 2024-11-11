//go:build js && wasm

package main

import (
	"fmt"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/ffi/ffiexample"
	"wraith.me/vaultlib/jsbind"
	"wraith.me/vaultlib/jsutil"
)

func main() {
	//Instantiate a channel, 'ch', with no buffer, acting as a synchronization point for the goroutine.
	ch := make(chan struct{})

	//Quick sanity check
	fmt.Println("heelo worl")
	//js.Global().Call("alert", "Hello from Golang!")

	//Configure the FFI
	ffi.TagName = "json"
	//jsutil.PackageName = ""

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT BELOW THIS BLOCK
	//

	jsutil.ExportFN("",
		jsutil.NF("argon2id", jsbind.Argon2id),
		jsutil.NF("argonSalt", jsbind.ArgonSalt),
	)

	//Vaultlib stuff
	jsbind.ExportKS()
	jsbind.ExportVault()
	jsbind.ExportEVault()

	//TEMP: testing
	ffiexample.ExportUser()
	//wasm.Alert("eee")

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT ABOVE THIS BLOCK
	//

	//Utilize a channel receive expression to halt the 'main' goroutine, preventing the program from terminating.
	<-ch
}
