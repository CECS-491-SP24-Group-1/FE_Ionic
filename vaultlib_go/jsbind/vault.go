//go:build js && wasm

package jsbind

import (
	"encoding/base64"
	"strings"
	"syscall/js"
	"time"

	"wraith.me/vaultlib/ffi"
	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/crypto"
	"wraith.me/vaultlib/vaultlib/keystore"
	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault"
)

// -- Exporter
func ExportVault() {
	//Export vault
	exp := ffi.NewStructExporter(
		vault.Vault{}, vault_new,
	).WithFactories(nil,
		ffi.NewFactory("fromKS", vault_fromKS),
		ffi.NewFactory("newBlank", vault_newBlank),
	).WithMethods(nil,
		ffi.NewMethod("encryptPassphrase", vault_ecrypt_pass),
		ffi.FWrapper[vault.Vault](ffi.NewMethod("encryptPassphrasePrecomp", vault_ecrypt_pass_precomp)),
		ffi.NewMethod("hashcode", vault_hashcode),
	//ffi.NewMethod("sign", ks_sign),
	//ffi.NewMethod("verify", ks_verify),
	).WithSetterHook(vault_setterHook)
	exp.Export("Vault")
}

//-- Constructors and static factories

// new(subject: string, devIdent: string): Vault
func vault_new(args []js.Value) (*vault.Vault, error) {
	//Get the arguments from the function
	subject := util.UUIDFromString(jsutil.Cast[string](args[0]))
	devIdent := strings.TrimSpace(jsutil.Cast[string](args[1]))

	//Construct and return the vault
	return vault.New(subject, devIdent), nil
}

// fromKS(ks: KeyStore): Vault
func vault_fromKS(args []js.Value) (*vault.Vault, error) {
	//Get the argument from the function as a keystore
	ks, err := ffi.Cast[keystore.KeyStore](args[0])
	if err != nil {
		return nil, err
	}

	//Create a new vault from the keystore
	//The other fields are intended to be filled later
	return &vault.Vault{
		ID:     util.MustNewUUID7(),
		KStore: *ks,
	}, nil
}

// newBlank(): Vault
func vault_newBlank(_ []js.Value) (*vault.Vault, error) {
	return &vault.Vault{
		ID:      util.MustNewUUID7(),
		LastMod: time.Now(),
	}, nil
}

//-- Methods

// async encryptPassphrase(pass: string): Promise<EVault>
func vault_ecrypt_pass(obj *vault.Vault, _ js.Value, args []js.Value) (js.Value, error) {
	//Get the passphrase from the arguments
	pass := args[0].String()

	//Setup the promise action to run
	fun := func() (js.Value, error) {
		ev, err := obj.EncryptPassphrase(pass)
		if err != nil {
			return jsutil.Nil, err
		}
		evjson, err := ev.JSON()
		if err != nil {
			return jsutil.Nil, err
		}
		return jsutil.Parse(evjson), nil
	}

	//Construct and return the promise
	return jsutil.Promise(fun), nil
}

// async encryptPassphrasePrecomp(key: string, salt: string): Promise<EVault>
func vault_ecrypt_pass_precomp(obj *vault.Vault, _ js.Value, args []js.Value) (js.Value, error) {
	//Get the key and salt from the arguments
	keyStr := args[0].String()
	saltStr := args[1].String()

	//Setup the promise action to run
	fun := func() (js.Value, error) {
		//Derive a crypto key and salt from the arguments
		key, err := crypto.ParsePrivseedBytes(keyStr)
		if err != nil {
			return jsutil.Nil, err
		}
		salt, err := base64.StdEncoding.DecodeString(saltStr)
		if err != nil {
			return jsutil.Nil, err
		}

		//Encrypt the vault
		ev, err := obj.EncryptPassphrasePrecomp(key, salt)
		if err != nil {
			return jsutil.Nil, err
		}

		//Return the encrypted vault as JSON
		evjson, err := ev.JSON()
		if err != nil {
			return jsutil.Nil, err
		}
		return jsutil.Parse(evjson), nil
	}

	//Construct and return the promise
	return jsutil.Promise(fun), nil
}

// hashcode(): string
func vault_hashcode(obj *vault.Vault, _ js.Value, _ []js.Value) (js.Value, error) {
	//For safety in case built-in is returning the wrong value
	return js.ValueOf(obj.Hash()), nil
}

//-- Hooks

// Updates the `LastMod` field of the vault when the data changes.
func vault_setterHook(obj *vault.Vault, _ js.Value, _ []js.Value) (js.Value, error) {
	obj.LastMod = time.Now()
	return js.ValueOf(nil), nil
}
