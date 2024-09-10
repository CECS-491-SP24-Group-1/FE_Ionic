package tests

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"wraith.me/vaultlib/vaultlib/crypto"
	"wraith.me/vaultlib/vaultlib/io"
	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault"
)

// Tests if the vault encryption routine is working.
func TestVaultCrypt(t *testing.T) {
	//Generate a new crypto key
	_, sk, err := crypto.NewKeypair(nil)
	if err != nil {
		t.Fatal(err)
	}

	//Set paths
	vpath := "./vault.bin"
	vdepath := "./vault_denc.bin"

	//Create a test vault obj and serialize it
	devIdent := "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko"
	vt := vault.New(util.MustNewUUID7(), devIdent)
	if err := io.Obj2File(vpath, vt); err != nil {
		t.Fatal(err)
	}
	vjson, err := json.Marshal(vt)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("vault in:   %s\n", vjson)

	//Encrypt the vault
	evt, err := vt.Encrypt(sk.Seed())
	if err != nil {
		t.Fatal(err)
	}
	evjson, err := json.Marshal(evt)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("vault enc:  %s\n", evjson)

	//Decrypt the vault and write it to a file
	dvt, err := evt.Decrypt(sk.Seed())
	if err != nil {
		t.Fatal(err)
	}
	if err := io.Obj2File(vdepath, vt); err != nil {
		t.Fatal(err)
	}
	dvjson, err := json.Marshal(dvt)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("vault denc: %s\n", dvjson)

	//Compare the hashes of the vault files; they should match
	hashExp, err := digestFile(vpath)
	if err != nil {
		t.Fatal(err)
	}
	hashAct, err := digestFile(vdepath)
	if err != nil {
		t.Fatal(err)
	}
	if hashAct != hashExp {
		t.Fatalf("mismatched hashes;\ngot: %s\nexpected: %s\n", hashAct, hashExp)
	}
	fmt.Printf("hash in:  %s\nhash out: %s\n", hashExp, hashAct)

	//Cleanup
	if err := os.Remove(vpath); err != nil {
		t.Fatal(err)
	}
	if err := os.Remove(vdepath); err != nil {
		t.Fatal(err)
	}
}

// Gets the SHA256 checksum of a file.
func digestFile(path string) (string, error) {
	//Read the bytes of the file
	fb, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}

	//Setup the hasher and digest the file bytes
	hash := sha256.New()
	if _, err := hash.Write(fb); err != nil {
		return "", err
	}
	return hex.EncodeToString(hash.Sum(nil)), nil
}
