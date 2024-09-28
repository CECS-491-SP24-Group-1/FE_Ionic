//go:build js && wasm

package jsbind

import (
	"strings"
	"syscall/js"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault"
)

// -- Exporter
func ExportVault() {
	//Export vault
	exp := ffi.NewStructExporter(
		vault.Vault{}, vault_new,
	).WithFactories(
	//ffi.NewFactory("fromSK", ks_fromSK),
	).WithMethods(
	//ffi.NewMethod("sign", ks_sign),
	//ffi.NewMethod("verify", ks_verify),
	)
	exp.Export("Vault")
}

//-- Constructors and static factories

// new(subject: string, devIdent: string): Vault
func vault_new(args []js.Value) (*vault.Vault, error) {
	//Get the arguments from the function
	subject := util.UUIDFromString(jsutil.Val2Any[string](args[0]))
	devIdent := strings.TrimSpace(jsutil.Val2Any[string](args[1]))

	//Construct and return the vault
	return vault.New(subject, devIdent), nil
}

//-- Methods
