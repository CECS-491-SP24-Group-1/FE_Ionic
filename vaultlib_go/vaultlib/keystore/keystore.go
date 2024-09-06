package keystore

import (
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"

	"wraith.me/vaultlib/vaultlib/crypto"
)

const (
	ED25519_LEN = crypto.PUBKEY_SIZE
)

// Represents an Ed25519 keypair inside a keystore.
type KeyStore struct {
	SK          crypto.Privseed `json:"sk"`          //Holds the private key.
	PK          crypto.Pubkey   `json:"pk"`          //Holds the public key.
	Fingerprint string           `json:"fingerprint"` //Holds the fingerprint of the public key as a SHA-256 hash.
}

// Generates a new keystore.
func NewKeyStore() KeyStore {
	//Generate a new keypair
	pk, sk, err := crypto.NewKeypair(nil)
	if err != nil {
		panic(err)
	}

	//Create the resultant object
	seed := sk.Seed()
	return FromBytes(seed[:], pk[:])
}

// Derives a keystore object from raw bytes.
func FromBytes(sk []byte, pk []byte) KeyStore {
	//Get the key objects
	sko := crypto.MustFromBytes(crypto.PrivkeyFromBytes, sk)
	pko := crypto.MustFromBytes(crypto.PubkeyFromBytes, pk)

	//Ensure the input PK corresponds to the SK
	if !pko.Equal(sko.Public()) {
		panic("non-correspondent public & private keys")
	}

	//Assign the public and private key bytes to a new object
	out := KeyStore{
		SK: sko.Seed(),
		PK: pko,
	}

	//Hash the public key
	h := sha256.Sum256(pk)
	out.Fingerprint = hex.EncodeToString(h[:])

	//Return the object
	return out
}

// Derives a keystore object from a JSON string.
func FromJSON(jsons string) (KeyStore, error) {
	//Create an intermediate struct
	type intermediate struct {
		SK crypto.Privseed `json:"sk"`
		PK crypto.Pubkey   `json:"pk"`
	}

	//Attempt to unmarshal an object from the JSON
	obj := intermediate{}
	err := json.Unmarshal([]byte(jsons), &obj)

	//Create a new Ed25519 keypair object and return it
	return FromBytes(obj.SK[:], obj.PK[:]), err
}

// Derives a keystore object from a private key via `scalar_mult()“.
func FromSK(sk []byte) KeyStore {
	//Get the public key equivalent via `scalar_mult()`
	pubSmult := crypto.MustFromBytes(crypto.PrivkeyFromBytes, sk).Public()

	//Return the object
	return FromBytes(sk, pubSmult[:])
}

// Derives a `Privkey` object from this object.
func (kp KeyStore) Amalgamate() crypto.Privkey {
	bytes := [crypto.PRIVKEY_SIZE]byte{}
	copy(bytes[:crypto.PRIVKEY_SEED_SIZE], kp.SK[:])
	copy(bytes[crypto.PRIVKEY_SEED_SIZE:], kp.PK[:])
	return bytes
}

// Checks if this keystore object is equal to another.
func (kp KeyStore) Equal(other KeyStore) bool {
	return subtle.ConstantTimeCompare(kp.SK[:], other.SK[:]) == 1 && 
	subtle.ConstantTimeCompare(kp.PK[:], other.PK[:]) == 1 && 
	subtle.ConstantTimeCompare([]byte(kp.Fingerprint), []byte(other.Fingerprint)) == 1
}

// Returns the JSON representation of the object.
func (kp KeyStore) JSON() string {
	json, _ := json.Marshal(kp)
	return string(json)
}

// Signs a message with this key store's private key.
func (kp KeyStore) Sign(msg []byte) crypto.Signature {
	return crypto.Sign(kp.Amalgamate(), msg)
}

// Returns the string representation of the object.
func (kp KeyStore) String() string {
	return fmt.Sprintf("Ed25519KP{sk=%s, pk=%s}", 
	base64.StdEncoding.EncodeToString(kp.SK[:]),
	 base64.StdEncoding.EncodeToString(kp.PK[:]),
	)
}

// Verifies a message and signature with this key store's public key.
func (kp KeyStore) Verify(msg []byte, sig crypto.Signature) bool {
	return crypto.Verify(kp.PK, msg, sig)
}
