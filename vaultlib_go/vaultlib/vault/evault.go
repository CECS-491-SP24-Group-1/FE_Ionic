package vault

import (
	"encoding/json"

	"wraith.me/vaultlib/vaultlib/io"
	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault/sectype"
)

/*
Represents a vault that holds a user's messages and cryptographic keys. This
struct serves as a model for a vault that is encrypted and at rest. This form
of a vault should be the one stored when the user is not currently using it
to prevent theft of the user's cryptographic keys and other sensitive info.
To derive a `Vault` object, simply decrypt this one with the symmetric key
that was used to encrypt it.
*/
type EVault struct {
	ID      util.UUID `json:"id"`      //The ID of this vault object.
	Subject util.UUID `json:"subject"` //The ID of the user to whom this vault belongs.

	SecType sectype.SecType `json:"sec_type"` //The type of security that this vault has.
	Salt    string          `json:"salt"`     //The salt used when encrypting this vault with passphrase-based methods.

	PayloadSize uint64 `json:"payload_size"` //The size of the encrypted payload in bytes
	Payload     []byte `json:"payload"`      //The actual contents of the encrypted vault, encoded as a Base64 string.
}

// Creates an encrypted vault object from a GOB byte string.
func EVaultFromGob(gob string) (*EVault, error) {
	obj := EVault{}
	if err := io.GString2Obj([]byte(gob), &obj); err != nil {
		return nil, err
	}
	return &obj, nil
}

// Creates an encrypted vault object from a JSON string.
func EVaultFromJSON(js string) (*EVault, error) {
	obj := EVault{}
	if err := json.Unmarshal([]byte(js), &obj); err != nil {
		return nil, err
	}
	return &obj, nil
}

// Serializes an encrypted vault to a Gob byte string.
func (ev EVault) Gob() (string, error) {
	gs, err := io.Obj2GString(&ev)
	if err != nil {
		return "", err
	}
	return string(gs), nil
}

// Serializes an encrypted vault to JSON.
func (ev EVault) JSON() (string, error) {
	jb, err := json.Marshal(ev)
	if err != nil {
		return "", err
	}
	return string(jb), nil
}

// Implements the stringer interface; serialization to JSON.
func (ev EVault) String() string {
	js, err := ev.JSON()
	if err != nil {
		panic(err)
	}
	return js
}
