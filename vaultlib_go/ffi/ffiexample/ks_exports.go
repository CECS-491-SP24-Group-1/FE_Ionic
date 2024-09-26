//go:build js && wasm

package ffiexample

import (
	"fmt"
	"syscall/js"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/vaultlib/crypto"

	"wraith.me/vaultlib/vaultlib/keystore"
)

// -- Exporter
func ExportKS() {
	//Export keystore
	exp := ffi.NewStructExporter(
		keystore.KeyStore{}, ks_new,
	).WithGetters(
		ks_getSK,
		nil,
		ks_getFingerprint,
	).WithSetters(
		ks_setSK,
		ffi.SNOP,
		nil,
		//jsbind.KS_setFingerprint,
	).WithFactories(
		ffi.NewFactory("fromSK", ks_fromSK),
	).WithMethods(
		ffi.NewMethod("sign", ks_sign),
		ffi.NewMethod("verify", ks_verify),
	).WithFlags(
		ffi.Flags{
			EmitGetterSetterFuncs: true,
			IgnoreGettersSetters:  false,
		},
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

//-- Getters

func ks_getSK(obj *keystore.KeyStore) (js.Value, error) {
	fmt.Println("using user defined getter for sk")
	return js.ValueOf(obj.SK.String()), nil
}

func ks_getPK(obj *keystore.KeyStore) (js.Value, error) {
	fmt.Println("using user defined getter for pk")
	return js.ValueOf(obj.PK.String()), nil
}

func ks_getFingerprint(obj *keystore.KeyStore) (js.Value, error) {
	fmt.Println("using user defined getter for fingerprint")
	return js.ValueOf(obj.Fingerprint), nil
}

//-- Setters

func ks_setSK(obj *keystore.KeyStore, arg js.Value) error {
	fmt.Println("using user defined setter for sk")
	sk, err := crypto.ParsePrivkey(arg.String())
	if err != nil {
		return err
	}
	obj = keystore.FromSK(sk[:])
	return nil
}

// tmp
func ks_setFingerprint(obj *keystore.KeyStore, arg js.Value) error {
	fmt.Println("using user defined setter for fingerprint")
	obj.Fingerprint = arg.String()
	return nil
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

//-- Static functions
