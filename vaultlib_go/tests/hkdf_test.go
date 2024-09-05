package tests

import (
	"encoding/base64"
	"fmt"
	"testing"

	ccrypto "wraith.me/message_server/crypto"
	"wraith.me/vaultlib/vaultlib/crypto"
)

func TestHKDF(t *testing.T){
	//User-provided passphrase
	passphrase := "ComplexAndSecurePassphrase123!"
	fmt.Printf("pass: %s\n", passphrase)

	//Static salt for this test
	saltBytes := [16]byte{0xb9, 0x19, 0xeb, 0xe7, 0x4a, 0xbd, 0xd6, 0x16, 0x8f, 0xcb, 0x89, 0x64, 0xda, 0x05, 0xeb, 0x1f}
	fmt.Printf("salt: %s\n", base64.StdEncoding.EncodeToString(saltBytes[:]))

	//Optional context info
	//info := []byte("application-specific-context")

	//Get an Ed25519 private key from the HKDF function
	sk, err := crypto.Ed25519HKDF(passphrase, saltBytes[:], nil)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("key:  %s\n", sk.String())

	//Ensure the key is always the same
	expected, err:= ccrypto.ParsePrivkey("tkE0uZP1ccLZsMZu5K0da60tDxD5wW33tGftELfteTPBkNVRKSZWW4PqYLiIFmtvExzMdmtwqNeT3eLtkXaEqA==")
	if err != nil {
		t.Fatal(err)
	}
	if(!expected.Equal(sk)){
		t.Fatalf("mismatched keys; \ngot %s, expected %s\n", sk.Fingerprint(), expected.Fingerprint())
	}
}
