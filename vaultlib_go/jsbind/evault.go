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
	).WithFactories(
	//Nada
	).WithMethods(
		ffi.NewMethod("decryptPassphrase", evault_dcrypt_pass),
	)
	exp.Export("EVault")
}

//-- Constructors and static factories

//Nada

//-- Methods

// decryptPassphrase(pass: string): Vault
func evault_dcrypt_pass(obj *vault.EVault, _ js.Value, args []js.Value) (js.Value, error) {
	pass := args[0].String()
	v, err := obj.DecryptPassphrase(pass)
	if err != nil {
		return js.ValueOf(nil), err
	}
	vjson, err := v.JSON()
	if err != nil {
		return js.ValueOf(nil), err
	}
	return jsutil.Parse(vjson), nil
}
