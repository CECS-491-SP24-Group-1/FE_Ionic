package vault

import (
	"bytes"
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/chacha20poly1305"
	"wraith.me/vaultlib/vaultlib/crypto"
	"wraith.me/vaultlib/vaultlib/io"
	"wraith.me/vaultlib/vaultlib/vault/sectype"
)

//
//-- Method 1: plain crypto key encryption/decryption
//

// Decrypts a vault using the plain key method.
func (ev EVault) DecryptKey(key crypto.Privseed) (*Vault, error) {
	//Ensure the security type is valid before proceeding
	if err := assertCorrectMethod(ev.SecType, sectype.SecTypeENCKEY); err != nil {
		return nil, err
	}

	//Decrypt the vault
	return ev.decrypt(key)
}

// Encrypts a vault using the plain key method.
func (v Vault) EncryptKey(key crypto.Privseed) (*EVault, error) {
	//Encrypt the vault
	ev, err := v.encrypt(key)
	if err != nil {
		return nil, err
	}

	//Set the correct security type and return the encrypted vault
	ev.SecType = sectype.SecTypeENCKEY
	return ev, nil
}

//
//-- Method 2: encryption via passphrase
//

// Decrypts a vault using the passphrase method.
func (ev EVault) DecryptPassphrase(passphrase string) (*Vault, error) {
	//Ensure the security type is valid before proceeding
	if err := assertCorrectMethod(ev.SecType, sectype.SecTypePASSPHRASE); err != nil {
		return nil, err
	}

	//Get the salt from the encrypted vault
	salt, err := base64.StdEncoding.DecodeString(ev.Salt)
	if err != nil {
		return nil, fmt.Errorf("salt decode error: %s", err)
	}

	//Derive a symmetric key via Argon2id on the passphrase
	keyb, err := crypto.Argon([]byte(passphrase), salt, crypto.PRIVKEY_SEED_SIZE)
	if err != nil {
		return nil, err
	}
	key := crypto.Privseed(keyb[:crypto.PRIVKEY_SEED_SIZE])

	//Decrypt the vault
	return ev.decrypt(key)
}

// Encrypts a vault using the passphrase method.
func (v Vault) EncryptPassphrase(passphrase string) (*EVault, error) {
	//Generate a salt for the passphrase; salt length is set to 16 bytes
	salt := make([]byte, crypto.PRIVKEY_SEED_SIZE/2)
	if _, err := rand.Read(salt); err != nil {
		return nil, err
	}

	//Derive a symmetric key via Argon2id on the passphrase
	keyb, err := crypto.Argon([]byte(passphrase), salt, crypto.PRIVKEY_SEED_SIZE)
	if err != nil {
		return nil, err
	}
	key := crypto.Privseed(keyb[:crypto.PRIVKEY_SEED_SIZE])

	//Encrypt the vault
	ev, err := v.encrypt(key)
	if err != nil {
		return nil, err
	}

	//Set the correct security type plus salt and return the encrypted vault
	ev.SecType = sectype.SecTypePASSPHRASE
	ev.Salt = base64.StdEncoding.EncodeToString(salt)
	return ev, nil
}

//
//-- Backend crypto routines
//

// Decrypts an encrypted vault object using XChaCha20-Poly1305, given a symmetric key.
func (ev EVault) decrypt(key crypto.Privseed) (*Vault, error) {
	//Extract the nonce and ciphertext from the payload; arrays are pre-alloced
	nonce := make([]byte, chacha20poly1305.NonceSizeX)
	ciph := make([]byte, ev.PayloadSize-chacha20poly1305.NonceSizeX)
	subtle.ConstantTimeCopy(1, nonce, ev.Payload[:chacha20poly1305.NonceSizeX])
	subtle.ConstantTimeCopy(1, ciph, ev.Payload[chacha20poly1305.NonceSizeX:])

	//Ensure the ciphertext is long enough
	if len(ciph) < chacha20poly1305.Overhead {
		return nil, fmt.Errorf("ciphertext too short")
	}

	//Preallocate the output array (ciphertext size - AEAD overhead)
	alloc := make([]byte, 0, len(ciph)-chacha20poly1305.Overhead)

	//Decrypt the vault using XChaCha20-Poly1305; the vault ID is checked as AEAD
	//A sub-slice of `alloc` containing just the plaintext is used as the return
	aead, err := chacha20poly1305.NewX(key[:])
	if err != nil {
		return nil, err
	}
	plain, err := aead.Open(alloc, nonce, ciph, ev.ID.UUID[:])
	if err != nil {
		return nil, err
	}

	//Deserialize the vault from a GOB stream
	var vault Vault
	vbytes := bytes.NewBuffer(plain)
	if err := io.Bytes2Obj(&vault, vbytes); err != nil {
		return nil, err
	}

	//fmt.Printf("same mem addr: %v\n", io.SameUnderlyingArray(alloc, plain)) //true

	//Return the decrypted vault object
	return &vault, nil
}

// Encrypts a vault object using XChaCha20-Poly1305, given a symmetric key.
func (v Vault) encrypt(key crypto.Privseed) (*EVault, error) {
	//Serialize the vault to a GOB stream
	var vbytes bytes.Buffer
	if err := io.Obj2Bytes(&vbytes, &v); err != nil {
		return nil, err
	}

	//Create a random nonce for the cipher
	nonce := make([]byte, chacha20poly1305.NonceSizeX)
	if _, err := rand.Read(nonce); err != nil {
		return nil, err
	}

	//Preallocate the output slice (nonce size + ciphertext size + AEAD overhead)
	encrypted := make([]byte, vbytes.Len()+chacha20poly1305.Overhead+chacha20poly1305.NonceSizeX)
	subtle.ConstantTimeCopy(1, encrypted[:chacha20poly1305.NonceSizeX], nonce) //Bytes 0 - 24: nonce

	//Encrypt the vault using XChaCha20-Poly1305; the vault ID is added as AEAD
	//The first 24 bytes of the encrypted vault are reserved for the nonce
	//`Seal` begins writing after the nonce all the way to the capacity of the slice
	aead, err := chacha20poly1305.NewX(key[:])
	if err != nil {
		return nil, err
	}
	aead.Seal(encrypted[chacha20poly1305.NonceSizeX:chacha20poly1305.NonceSizeX], nonce, vbytes.Bytes(), v.ID.UUID[:])

	//Construct the encrypted vault object and return it
	evault := EVault{
		ID:          v.ID,
		Subject:     v.Subject,
		PayloadSize: uint64(len(encrypted)),
		Payload:     encrypted,
	}
	return &evault, nil
}

//
//-- Utils
//

// Ensures that the vault has the correct security type.
func assertCorrectMethod(in, exp sectype.SecType) error {
	if in != exp {
		return fmt.Errorf("invalid security type; got: %s, expected: %s", in.String(), exp.String())
	} else {
		return nil
	}
}
