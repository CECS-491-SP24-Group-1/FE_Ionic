//go:build js && wasm

package jsbind

import (
	"strings"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault"
)

// New(subject: string, devIdent: string): Vault
func New(this js.Value, args []js.Value) interface{} {
	//Get the arguments from the function
	subject := util.UUIDFromString(jsutil.Val2Any[string](args[0]))
	devIdent := strings.TrimSpace(jsutil.Val2Any[string](args[1]))

	//Construct and return the vault
	return vault.New(subject, devIdent)
}
