//go:build js && wasm

package jsbind

import (
	"encoding/base64"
	"strings"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
	"wraith.me/vaultlib/vaultlib/crypto"
)

const HKDF_SALT = "0UsWeiCtpBO3N1sNnCyR/Q=="

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
