//go:build js && wasm

package main

import (
	"fmt"

	"wraith.me/vaultlib/jsbind"
	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/keystore"
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

	//Export keystore
	exp := jsutil.NewStructExporter(
		keystore.KeyStore{}, jsbind.KS_new,
	).WithGetters(
		jsbind.KS_getSK,
		jsbind.KS_getPK,
		jsbind.KS_getFingerprint,
	).WithSetters(
		jsbind.KS_setSK,
		jsutil.SNOP,
		jsutil.SNOP,
	).WithFactories(
		jsutil.NewFactory("fromSK", jsbind.KS_fromSK),
	).WithMethods(
	//jsutil.NewMethod("equals", jsbind.KS_equals),
	)
	exp.Export("KeyStore")

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
