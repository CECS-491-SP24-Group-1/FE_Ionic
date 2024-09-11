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
	"wraith.me/vaultlib/vaultlib/vault/sectype"
)

// Tests if the vault key encryption routine is working.
func TestVaultKeyCrypt(t *testing.T) {
	//Generate a new crypto key
	_, sk, err := crypto.NewKeypair(nil)
	if err != nil {
		t.Fatal(err)
	}

	//Run tests
	runVCTest(t, sectype.SecTypeENCKEY, sk.Seed(), sk.Seed())
}

// Tests if the vault passphrase encryption routine is working.
func TestVaultPassCrypt(t *testing.T) {
	//Generate a new passphrase
	password := "password12345"

	//Run tests
	runVCTest(t, sectype.SecTypePASSPHRASE, password, password)
}

// Runs the vault crypto tests in a method-independent way.
func runVCTest(t *testing.T, typ sectype.SecType, earg, darg interface{}) {
	//Select the appropriate functions for encryption and decryption
	var eFunc func(*vault.Vault, interface{}) (*vault.EVault, error)
	var dFunc func(*vault.EVault, interface{}) (*vault.Vault, error)
	switch typ {
	//Select crypto key as the type to use for crypto
	case sectype.SecTypeENCKEY:
		eFunc = func(v *vault.Vault, arg interface{}) (*vault.EVault, error) {
			return (*vault.Vault).EncryptKey(v, arg.(crypto.Privseed))
		}
		dFunc = func(v *vault.EVault, arg interface{}) (*vault.Vault, error) {
			return (*vault.EVault).DecryptKey(v, arg.(crypto.Privseed))
		}
	//Select passphrase as the type to use for crypto
	case sectype.SecTypePASSPHRASE:
		eFunc = func(v *vault.Vault, arg interface{}) (*vault.EVault, error) {
			return (*vault.Vault).EncryptPassphrase(v, arg.(string))
		}
		dFunc = func(v *vault.EVault, arg interface{}) (*vault.Vault, error) {
			return (*vault.EVault).DecryptPassphrase(v, arg.(string))
		}
	default:
		t.Fatalf("unsupported encryption type %s", typ.String())
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
	evt, err := eFunc(vt, earg)
	if err != nil {
		t.Fatal(err)
	}
	evjson, err := json.Marshal(evt)
	if err != nil {
		t.Fatal(err)
	}
	fmt.Printf("vault enc:  %s\n", evjson)

	//Decrypt the vault and write it to a file
	dvt, err := dFunc(evt, darg)
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
