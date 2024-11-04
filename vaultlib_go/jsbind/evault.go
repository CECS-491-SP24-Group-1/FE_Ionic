//go:build js && wasm

package jsbind

import (
	"syscall/js"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/vault"
)

// -- Exporter
func ExportEVault() {
	//Export vault
	exp := ffi.NewStructExporter(
		vault.EVault{}, nil,
	).WithFactories(nil). //Nada
				WithMethods(nil,
			ffi.NewMethod("decryptPassphrase", evault_dcrypt_pass),
		)
	exp.Export("EVault")
}

//-- Constructors and static factories

//Nada

//-- Methods

// async decryptPassphrase(pass: string): Promise<Vault>
func evault_dcrypt_pass(obj *vault.EVault, _ js.Value, args []js.Value) (js.Value, error) {
	//Get the passphrase from the arguments
	pass := args[0].String()

	//Setup the promise action to run
	fun := func() (js.Value, error) {
		v, err := obj.DecryptPassphrase(pass)
		if err != nil {
			return jsutil.Nil, err
		}
		vjson, err := v.JSON()
		if err != nil {
			return jsutil.Nil, err
		}
		return jsutil.Parse(vjson), nil
	}

	//Construct and return the promise
	return jsutil.Promise(fun), nil
}
