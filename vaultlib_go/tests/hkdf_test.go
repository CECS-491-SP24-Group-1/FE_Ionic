package tests

import (
	"encoding/base64"
	"fmt"
	"testing"

	"github.com/google/uuid"
	"golang.org/x/crypto/sha3"
	"wraith.me/vaultlib/vaultlib/crypto"
)

func TestEd25519HKDF(t *testing.T) {
	//Define the passphrase, salt, and ctx
	passphrase := "password12345"
	salt := uuid.MustParse("a91742ba-8771-45f2-92b4-e233d4615438")

	//Set a custom hash function
	//cc.HKDFHashFunc = md5.New
	crypto.HKDFHashFunc = sha3.New512
	//crypto.HKDFHashFunc = func() hash.Hash { b, _ := blake2b.New384(nil); return b }

	//Run HKDF
	privkey, err := crypto.Ed25519HKDF(passphrase, salt[:], nil)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Printf("pass: %s\n", passphrase)
	fmt.Printf("salt: %s\n", base64.StdEncoding.EncodeToString(salt[:]))
	fmt.Printf("priv: %s\n", privkey.String())
}
