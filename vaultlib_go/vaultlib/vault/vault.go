package vault

import (
	"encoding/json"
	"time"

	"wraith.me/vaultlib/vaultlib/io"
	"wraith.me/vaultlib/vaultlib/keystore"
	"wraith.me/vaultlib/vaultlib/util"
)

/*
Represents a chat room that holds the room id, members, and messages if a recipient user is offline.
This struct will be used when storing chat rooms in a user's vault.
*/
type Room struct {
	RoomID   util.UUID   `json:"room_id"`
	Members  []util.UUID `json:"members"`
	Messages []util.UUID `json:"messages"` // Only stores messages when a recipient user is offline.
}

/*
Represents a vault that holds a user's messages and cryptographic keys. This
struct serves as a model for a vault that is decrypted and available for use.
When not in use, objects of this struct should be encrypted to produce an
`EVault` object.
*/
type Vault struct {
	ID       util.UUID          `json:"id"`        //The ID of this vault object.
	Subject  util.UUID          `json:"subject"`   //The ID of the user to whom this vault belongs.
	LastMod  time.Time          `json:"last_mod"`  //The at which this vault was last changed.
	DevIdent string             `json:"dev_ident"` //The user agent of the user that created this vault.
	Note     string             `json:"note"`      //An optional note about the contents of the vault.
	Rooms    map[util.UUID]Room `json:"rooms"`     //Maps room ID to room structs

	KStore keystore.KeyStore `json:"kstore"` //Holds the user's public and private keys.
	//MStore keystore.KeyStore `json:"mstore"` //Holds the user's conversations and associated states.
}

// Creates a new vault object.
func New(sub util.UUID, devIdent string) *Vault {
	//Generate a new key store
	kstore := *keystore.New()

	//Create and return the new vault
	return &Vault{
		ID:       util.MustNewUUID7(),
		Subject:  sub,
		LastMod:  time.Now(),
		DevIdent: devIdent,
		Note:     "",
		KStore:   kstore,
	}
}

// Creates a vault object from a GOB byte string.
func VaultFromGob(gob string) (*Vault, error) {
	obj := Vault{}
	if err := io.GString2Obj([]byte(gob), &obj); err != nil {
		return nil, err
	}
	return &obj, nil
}

// Creates a vault object from a JSON string.
func VaultFromJSON(js string) (*Vault, error) {
	obj := Vault{}
	if err := json.Unmarshal([]byte(js), &obj); err != nil {
		return nil, err
	}
	return &obj, nil
}

// Serializes a vault to a Gob byte string.
func (v Vault) Gob() (string, error) {
	gs, err := io.Obj2GString(&v)
	if err != nil {
		return "", err
	}
	return string(gs), nil
}

// Returns the SHA256 of this vault.
func (v Vault) Hash() string {
	return io.DigestString(v.String())
}

// Serializes a vault to JSON.
func (v Vault) JSON() (string, error) {
	jb, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(jb), nil
}

// Implements the stringer interface; serialization to JSON.
func (v Vault) String() string {
	js, err := v.JSON()
	if err != nil {
		panic(err)
	}
	return js
}

// Adds a new room to the vault
func (v *Vault) addRoom(roomID util.UUID, members []util.UUID, messages []util.UUID) {
	v.Rooms[roomID] = Room{
		RoomID:   roomID,
		Members:  members,
		Messages: messages,
	}
	v.LastMod = time.Now()
}
