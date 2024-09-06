package vault

import (
	"bytes"
	"encoding/base64"
	"encoding/gob"
	"fmt"

	"wraith.me/vaultlib/vaultlib/crypto"
)

// Encrypts a vault using the passphrase method.
func (v Vault) EncryptPassphrase(passphrase string) (*EVault, error) {
	//Derive a symmetric key via HKDF on the passphrase
	idBytes := v.ID.Bytes()
	keyb, err := crypto.HKDF([]byte(passphrase), nil, idBytes[:], crypto.PRIVKEY_SEED_SIZE)
	if err != nil {
		return nil, err
	}
	key := crypto.Privseed(keyb[:crypto.PRIVKEY_SEED_SIZE])

	v.Encrypt(key)

	return nil, nil
}

// Encrypts a vault object using XChaCha20-Poly1305, given a symmetric key.
func (v Vault) Encrypt(key crypto.Privseed) (*EVault, error) {
	//Serialize the vault to a GOB stream
	var vbytes bytes.Buffer
	enc := gob.NewEncoder(&vbytes)
	if err := enc.Encode(v); err != nil {
		return nil, err
	}

	/*
			aead, err := chacha20poly1305.NewX(key)
		    if err != nil {
		        log.Println("Error when creating cipher.")
		        panic(err)
		    }
	*/

	s := base64.StdEncoding.EncodeToString(vbytes.Bytes())
	fmt.Printf("gob: %s\n", s)

	return nil, nil
}
