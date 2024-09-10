package vault

import (
	"bytes"
	"crypto/rand"
	"crypto/subtle"

	"golang.org/x/crypto/chacha20poly1305"
	"wraith.me/vaultlib/vaultlib/crypto"
	"wraith.me/vaultlib/vaultlib/io"
)

// Encrypts a vault using the passphrase method.
func (v Vault) EncryptPassphrase(passphrase string) (*EVault, error) {
	//Derive a symmetric key via Argon2id on the passphrase
	keyb, err := crypto.Argon([]byte(passphrase), nil, crypto.PRIVKEY_SEED_SIZE)
	if err != nil {
		return nil, err
	}
	key := crypto.Privseed(keyb[:crypto.PRIVKEY_SEED_SIZE])

	//Encrypt the vault
	return v.Encrypt(key)
}

// Decrypts an encrypted vault object using XChaCha20-Poly1305, given a symmetric key.
func (ev EVault) Decrypt(key crypto.Privseed) (*Vault, error) {
	//Extract the nonce and ciphertext from the payload; arrays are pre-alloced
	nonce := make([]byte, chacha20poly1305.NonceSizeX)
	ciph := make([]byte, ev.PayloadSize-chacha20poly1305.NonceSizeX)
	subtle.ConstantTimeCopy(1, nonce, ev.Payload[:chacha20poly1305.NonceSizeX])
	subtle.ConstantTimeCopy(1, ciph, ev.Payload[chacha20poly1305.NonceSizeX:])

	//Decrypt the vault using XChaCha20-Poly1305; the vault ID is checked as AEAD
	//TODO: prealloc the output array
	aead, err := chacha20poly1305.NewX(key[:])
	if err != nil {
		return nil, err
	}
	plain, err := aead.Open(nil, nonce, ciph, ev.ID.UUID[:])
	if err != nil {
		return nil, err
	}

	//Deserialize the vault from a GOB stream
	var vault Vault
	if err := io.Bytes2Obj(&vault, bytes.NewBuffer(plain)); err != nil {
		return nil, err
	}

	//Return the decrypted vault object
	return &vault, nil
}

// Encrypts a vault object using XChaCha20-Poly1305, given a symmetric key.
func (v Vault) Encrypt(key crypto.Privseed) (*EVault, error) {
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

	//Encrypt the vault using XChaCha20-Poly1305; the vault ID is added as AEAD
	//The first 24 bytes of the encrypted vault are reserved for the nonce
	//TODO: prealloc the output array
	aead, err := chacha20poly1305.NewX(key[:])
	if err != nil {
		return nil, err
	}
	ciph := aead.Seal(nil, nonce, vbytes.Bytes(), v.ID.UUID[:])
	encrypted := append(nonce, ciph...)

	//Construct the encrypted vault object and return it
	evault := EVault{
		ID:          v.ID,
		Subject:     v.Subject,
		PayloadSize: uint64(len(encrypted)),
		Payload:     encrypted,
	}
	return &evault, nil
}
