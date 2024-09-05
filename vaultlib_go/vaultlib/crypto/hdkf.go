package crypto

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"hash"
	"io"

	"golang.org/x/crypto/hkdf"
	"wraith.me/vaultlib/vaultlib/keystore"

	ccrypto "wraith.me/message_server/crypto"
)

// Sets the minimum the salt and destination buffers must be for an HKDF operation.
const _HKDF_MIN_BUF_SIZE = 8
const _DEFAULT_SALT_SIZE = 16

var (
	//Sets the hash function for the HKDF operation. Uses SHA-2 256 by default.
	HKDFHashFunc func() hash.Hash = sha256.New
)

// Derives an Ed25519 private key from a passphrase, salt, and optional info.
func Ed25519HKDF(passphrase string, salt, info []byte) (ccrypto.Privkey, error) {
	//Create the output Ed25519 buffer
	privkey := make([]byte, keystore.ED25519_LEN)

	//Populate the salt with random bytes if its nil
	if salt == nil {
		salt = make([]byte, _DEFAULT_SALT_SIZE)
		if _, err := rand.Read(salt); err != nil {
			return ccrypto.NilPrivkey(), err
		}
	}

	//Perform HKDF
	err := hkdfHelper(&privkey, passphrase, salt, info)
	if err != nil {
		return ccrypto.NilPrivkey(), err
	}

	//Construct the private key object
	return ccrypto.PrivkeyFromBytes(privkey)
}

// Derives x random bytes from a passphrase, salt, and optional info.
func hkdfHelper(dest *[]byte, passphrase string, salt, info []byte) error {
	//Ensure the destination pointer and salt are sufficiently large
	if subtle.ConstantTimeLessOrEq(_HKDF_MIN_BUF_SIZE, len(*dest)) == 0 ||
	subtle.ConstantTimeLessOrEq(_HKDF_MIN_BUF_SIZE, len(salt)) == 0 {
    return fmt.Errorf("destination or salt buffers too small; minimum size is %d bytes", _HKDF_MIN_BUF_SIZE)
}

	//Create a new HKDF instance and read x bytes into the destination buffer
	hkdfReader := hkdf.New(HKDFHashFunc, []byte(passphrase), salt, info)
	if _, err := io.ReadFull(hkdfReader, *dest); err != nil {
		return err
	}
	return nil
}
