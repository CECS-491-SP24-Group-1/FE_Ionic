//go:build js && wasm

package jsbind

import (
	"syscall/js"

	"wraith.me/vaultlib/vaultlib/crypto"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/vaultlib/keystore"
)

// -- Exporter
func ExportKS() {
	//Export keystore
	exp := ffi.NewStructExporter(
		keystore.KeyStore{}, ks_new,
	).WithFactories(nil,
		ffi.NewFactory("fromSK", ks_fromSK),
	).WithMethods(nil,
		ffi.NewMethod("sign", ks_sign),
		ffi.NewMethod("verify", ks_verify),
	)
	exp.Export("KeyStore")
}

//-- Constructors and static factories

// new(): KeyStore
func ks_new([]js.Value) (*keystore.KeyStore, error) {
	return keystore.New(), nil
}

// fromSK(sk: string): KeyStore
func ks_fromSK(args []js.Value) (*keystore.KeyStore, error) {
	sk, err := crypto.ParsePrivkey(args[0].String())
	if err != nil {
		return nil, err
	}
	return keystore.FromSK(sk[:]), nil
}

//-- Methods

// sign(message: string): string
func ks_sign(obj *keystore.KeyStore, _ js.Value, args []js.Value) (js.Value, error) {
	//Get the target message to sign as a string
	msg := args[0].String()

	//Sign with the keystore's private key and emit the signature as a b64 string
	signature := obj.Sign([]byte(msg))
	return js.ValueOf(signature.String()), nil
}

// verify(message: string, signature: string): boolean
func ks_verify(obj *keystore.KeyStore, _ js.Value, args []js.Value) (js.Value, error) {
	//Get the target message to verify and the signature as strings
	msg := args[0].String()
	sig := args[1].String()

	//Derive a signature object from the signature string
	sigObj, err := crypto.ParseSignature(sig)
	if err != nil {
		return js.ValueOf(nil), err
	}

	//Verify that the message was signed with the signature using the keystore's public key
	valid := obj.Verify([]byte(msg), sigObj)
	return js.ValueOf(valid), nil
}
