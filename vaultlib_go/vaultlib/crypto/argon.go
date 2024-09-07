package crypto

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/subtle"
	"fmt"

	"golang.org/x/crypto/argon2"
)

// Sets the minimum the salt and destination buffers must be for an Argon2id operation.
const _ARGON_MIN_BUF_SIZE = 8

var (
	//The number of Argon iterations to use.
	ArgonTime uint32 = 1

	//The memory to use for Argon (in kilobytes).
	ArgonMem uint32 = 64 * 1024

	//The number of threads to use for Argon.
	ArgonThread uint8 = 1
)


// Derives an Ed25519 private key from a passphrase and salt using Argon2id.
func Ed25519Argon(passphrase string, salt []byte) (Privkey, error) {
	//Create the output Ed25519 buffer
	privkey := make([]byte, ed25519.SeedSize)

	//Perform HKDF
	err := argonHelper(&privkey, []byte(passphrase), salt)
	if err != nil {
		return NilPrivkey(), err
	}

	//Construct the private key object
	return PrivkeyFromBytes(privkey)
}

// Generates n Argon2id bytes from a given secret, salt, and info.
func Argon(in, salt []byte, outlen uint) ([]byte, error) {
	buf := make([]byte, outlen)
	err := argonHelper(&buf, in, salt)
	if err != nil {
		return nil, err
	}
	return buf, nil
}

// Derives x random bytes from input data and salt using Argon2id.
func argonHelper(dest *[]byte, in, salt []byte) error {
	//Ensure the destination pointer is sufficiently large
	if subtle.ConstantTimeLessOrEq(_ARGON_MIN_BUF_SIZE, len(*dest)) == 0 {
		return fmt.Errorf("destination buffer too small; minimum size is %d bytes", _ARGON_MIN_BUF_SIZE)
	}

	//Populate the salt with random bytes if its nil
	minSaltLen := len(*dest) / 2
	if salt == nil {
		salt = make([]byte, minSaltLen)
		if _, err := rand.Read(salt); err != nil {
			return err
		}
	} else {
		//Ensure the salt is at least half the length of the output buffer
		if subtle.ConstantTimeLessOrEq(minSaltLen, len(salt)) == 0 {
			return fmt.Errorf("salt too small; minimum size is %d bytes", minSaltLen)
		}
	}

	//Run Argon2id
	*dest = argon2.IDKey(in, salt, ArgonTime, ArgonMem, ArgonThread, uint32(len(*dest)))
	return nil
}