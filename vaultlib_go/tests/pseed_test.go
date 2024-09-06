package tests

import (
	"crypto/ed25519"
	"encoding/base64"
	"fmt"
	"testing"

	"wraith.me/vaultlib/vaultlib/crypto"
)

func TestPSeed(t *testing.T){
	_, key, err := crypto.NewKeypair(nil)
	if err != nil {
		t.Fatal(err)
	}

	s := key.Seed()
	p := ed25519.NewKeyFromSeed(s[:])
	ss := base64.StdEncoding.EncodeToString(p.Public().(ed25519.PublicKey))

	fmt.Printf("key: %s\n", key)
	fmt.Printf("pkey: %s\n", key.Public())
	fmt.Printf("pkey: %s\n", ss)

	if key.Public().String() != ss {
		t.Fatal("mismatched pubkey and ed25519 seed pubkey")
	}
}