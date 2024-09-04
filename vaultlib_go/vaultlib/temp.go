package vaultlib

import (
	"crypto/ed25519"
	"encoding/base64"
)

func Ed25519SK() string {
	_, sk, err := ed25519.GenerateKey(nil)
	if err != nil {
		panic(err)
	}
	return base64.StdEncoding.EncodeToString([]byte(sk))
}
