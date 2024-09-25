//go:build js && wasm

package jsbind

import (
	"fmt"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
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

// equals(other: KeyStore): boolean
//TODO: equals but first serialize to json; then deserialize in here and compare
func KS_equals(obj *keystore.KeyStore, args []js.Value) (js.Value, error) {
	fmt.Println("inside of equals")
	other := jsutil.Val2Any[keystore.KeyStore](args[0])
	fmt.Println(other.String())
	return js.ValueOf(false), nil
}

// sign(message: string): string
func KS_sign(obj *keystore.KeyStore, args []js.Value) (js.Value, error) {
	return js.ValueOf(obj.String()), nil
}

// toString(): string
func KS_toString(obj *keystore.KeyStore, args []js.Value) (js.Value, error) {
	return js.ValueOf(obj.String()), nil
}

//-- Static functions
