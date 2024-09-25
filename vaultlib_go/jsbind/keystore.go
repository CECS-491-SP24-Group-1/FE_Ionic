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

//-- Getters

func KS_getSK(obj *keystore.KeyStore) (js.Value, error) {
	return js.ValueOf(obj.SK.String()), nil
}

func KS_getPK(obj *keystore.KeyStore) (js.Value, error) {
	return js.ValueOf(obj.PK.String()), nil
}

func KS_getFingerprint(obj *keystore.KeyStore) (js.Value, error) {
	return js.ValueOf(obj.Fingerprint), nil
}

//-- Setters

func KS_setSK(obj *keystore.KeyStore, arg js.Value) error {
	sk, err := crypto.ParsePrivkey(arg.String())
	if err != nil {
		return err
	}
	obj = keystore.FromSK(sk[:])
	return nil
}

//-- Methods

// sign(message: string): string
func KS_sign(obj *keystore.KeyStore, args []js.Value) (js.Value, error) {
	return js.ValueOf(obj.String()), nil
}

//-- Static functions
