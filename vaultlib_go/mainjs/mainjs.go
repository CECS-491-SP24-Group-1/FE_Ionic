//go:build js && wasm

package main

import (
	"fmt"

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

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT BELOW THIS BLOCK
	//

	jsutil.ExportF("",
		jsbind.HKDF,
	)
	jsutil.ExportV("",
		jsutil.NV("HKDF_SALT", jsbind.HKDF_SALT),
	)
	//jsutil.ExportF("vault",)

	//Testing
	//js.Global().Set("NewMyObject", js.FuncOf(jsbind.NewMyObject))

	ffiexample.ExportUser()
	ffiexample.ExportKS()

	/*
		jsutil.ExportObj(,
			jsbind.MakeNewUser,
			//[]jsutil.Factory[jsbind.User]{jsbind.UserFromString},
		)
	*/

	//wasm.Alert("eee")

	//
	// PUT ALL JS FUNCTIONS & VARS TO EXPORT ABOVE THIS BLOCK
	//

	//Utilize a channel receive expression to halt the 'main' goroutine, preventing the program from terminating.
	<-ch
}
