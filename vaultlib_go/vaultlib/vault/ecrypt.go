package vault

import (
	"fmt"

	"wraith.me/vaultlib/vaultlib/crypto"
)

const _OPT_INFO = "__wraith-vaultlib-v1.0__"

//Encrypts a vault using the passphrase method.
func (v Vault) EncryptPassphrase(passphrase string) (*EVault, error){
	//Derive a symmetric key via HKDF on the passphrase
	key, err := crypto.HKDF([]byte(passphrase), nil, []byte(_OPT_INFO), crypto.PRIVKEY_SEED_SIZE)
	if err != nil {
		return nil, err
	}

	fmt.Println(key)

	return nil, nil
}

//Encrypts a vault object using XChaCha20-Poly1305, given a symmetric key.
func (v Vault) Encrypt(key crypto.Privseed) (*EVault, error){
	return nil, nil
}