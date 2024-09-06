package crypto

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"hash"
	"io"

	"golang.org/x/crypto/hkdf"
)

// Sets the minimum the salt and destination buffers must be for an HKDF operation.
const _HKDF_MIN_BUF_SIZE = 8

var (
	//Sets the hash function for the HKDF operation. Uses SHA-2 256 by default.
	HKDFHashFunc func() hash.Hash = sha256.New
)

// Derives an Ed25519 private key from a passphrase, salt, and optional info.
func Ed25519HKDF(passphrase string, salt, info []byte) (Privkey, error) {
	//Create the output Ed25519 buffer
	privkey := make([]byte, ed25519.SeedSize)

	//Perform HKDF
	err := hkdfHelper(&privkey, []byte(passphrase), salt, info)
	if err != nil {
		return NilPrivkey(), err
	}

	//Construct the private key object
	return PrivkeyFromBytes(privkey)
}

//Generates n HKDF bytes from a given secret, salt, and info.
func HKDF(in, salt, info []byte, outlen uint) ([]byte, error){
	buf := make([]byte, outlen)
	err := hkdfHelper(&buf, in, salt, nil)
	if err != nil {
		return nil, err
	}
	return buf, nil
}

// Derives x random bytes from input data, salt, and optional info.
func hkdfHelper(dest *[]byte, in []byte, salt, info []byte) error {
	//Ensure the destination pointer is sufficiently large
	if subtle.ConstantTimeLessOrEq(_HKDF_MIN_BUF_SIZE, len(*dest)) == 0  {
    	return fmt.Errorf("destination buffer too small; minimum size is %d bytes", _HKDF_MIN_BUF_SIZE)
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

	//Create a new HKDF instance and read x bytes into the destination buffer
	hkdfReader := hkdf.New(HKDFHashFunc, in, salt, info)
	if _, err := io.ReadFull(hkdfReader, *dest); err != nil {
		return err
	}
	return nil
}
