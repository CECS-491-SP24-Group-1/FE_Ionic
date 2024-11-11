//go:build js && wasm

package jsbind

import (
	"syscall/js"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/crypto"
	"wraith.me/vaultlib/vaultlib/vault"
)

// -- Exporter
func ExportEVault() {
	//Export vault
	exp := ffi.NewStructExporter(
		vault.EVault{}, nil,
	).WithFactories(
		nil, //Nada
	).WithMethods(nil,
		ffi.NewMethod("decryptPassphrase", evault_dcrypt_pass),
		ffi.NewMethod("decryptPassphrasePrecomp", evault_dcrypt_pass_precomp),
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

// async decryptPassphrasePrecomp(key: string): Promise<Vault>
func evault_dcrypt_pass_precomp(obj *vault.EVault, _ js.Value, args []js.Value) (js.Value, error) {
	//Get the encryption key from the arguments
	keyStr := args[0].String()

	//Setup the promise action to run
	fun := func() (js.Value, error) {
		//Derive a crypto key the arguments
		key, err := crypto.ParsePrivseedBytes(keyStr)
		if err != nil {
			return jsutil.Nil, err
		}

		//Decrypt the vault
		v, err := obj.DecryptPassphrasePrecomp(key)
		if err != nil {
			return jsutil.Nil, err
		}

		//Return the decrypted vault as JSON
		vjson, err := v.JSON()
		if err != nil {
			return jsutil.Nil, err
		}
		return jsutil.Parse(vjson), nil
	}

	//Construct and return the promise
	return jsutil.Promise(fun), nil
}
