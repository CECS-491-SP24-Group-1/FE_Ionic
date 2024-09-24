//go:build js && wasm

package jsbind

import (
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/keystore"
)

// NewKeyStore(): KeyStore
func NewKeyStore(_ js.Value, _ []js.Value) interface{} {
	return jsutil.RetJObj(keystore.New())
}
