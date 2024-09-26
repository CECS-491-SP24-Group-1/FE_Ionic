//go:build js && wasm

package jsbind

import (
	"syscall/js"

	"wraith.me/vaultlib/vaultlib/crypto"

	"wraith.me/vaultlib/vaultlib/keystore"
)

//-- Constructors and static factories

// new(): KeyStore
func KS_new([]js.Value) (*keystore.KeyStore, error) {
	return keystore.New(), nil
}

// fromSK(sk: string): KeyStore
func KS_fromSK(args []js.Value) (*keystore.KeyStore, error) {
	sk, err := crypto.ParsePrivkey(args[0].String())
	if err != nil {
		return nil, err
	}
	return keystore.FromSK(sk[:]), nil
}

//-- Methods

// sign(message: string): string
func KS_sign(obj *keystore.KeyStore, args []js.Value) (js.Value, error) {
	return js.ValueOf(obj.String()), nil
}
