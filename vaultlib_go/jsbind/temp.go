//go:build js && wasm

package jsbind

import (
	"encoding/base64"
	"fmt"
	"strings"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib"
	"wraith.me/vaultlib/vaultlib/crypto"
)

const HKDF_SALT = "0UsWeiCtpBO3N1sNnCyR/Q=="

// Ed25519Keygen() -> string
func Ed25519Keygen(_ js.Value, _ []js.Value) interface{} {
	//Create the Go object and marshal to JSON
	///json :=

	//Call `JSON.parse()` on the string to derive an object usable in JS
	//return js.Global().Get("JSON").Call("parse", json)

	fmt.Println("running the jsbind.Ed25519Keygen file")
	return vaultlib.Ed25519SK()
}

// HKDF(password: string): string
func HKDF(this js.Value, args []js.Value) interface{} {
	password := strings.TrimSpace(jsutil.Val2Any[string](args[0]))
	salt, _ := base64.StdEncoding.DecodeString(HKDF_SALT)
	key, err := crypto.Ed25519Argon(password, salt)
	if err != nil {
		jsutil.JSErr(err)
		return nil
	}
	return base64.StdEncoding.EncodeToString(key[:])
}
