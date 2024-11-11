//go:build js && wasm

package jsbind

import (
	"crypto/rand"
	"encoding/base64"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/crypto"
)

// async argon2id(passphrase: string, salt: string): Promise<string>
func Argon2id(_ js.Value, args []js.Value) interface{} {
	//Get the input args
	passphrase := args[0].String()
	salt := args[1].String()

	//Setup the promise action to run
	fun := func() (js.Value, error) {
		//Decode the salt to a byte array
		saltBytes, err := base64.StdEncoding.DecodeString(salt)
		if err != nil {
			return jsutil.Nil, err
		}

		//Perform argon2id
		keyb, err := crypto.Argon([]byte(passphrase), saltBytes, crypto.PRIVKEY_SEED_SIZE)
		if err != nil {
			return jsutil.Nil, err
		}

		//Base64 encode the key and return it
		key := base64.StdEncoding.EncodeToString(keyb)
		return js.ValueOf(key), nil
	}

	//Construct and return the promise
	return jsutil.Promise(fun)
}

// argonSalt(): string
func ArgonSalt(_ js.Value, args []js.Value) interface{} {
	salt := make([]byte, crypto.ARGON_SALT_SIZE)
	if _, err := rand.Read(salt); err != nil {
		jsutil.Throw(err.Error())
	}
	return base64.StdEncoding.EncodeToString(salt)
}
