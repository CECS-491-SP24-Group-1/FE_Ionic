package vault

import (
	"time"

	"wraith.me/vaultlib/vaultlib/keystore"
	"wraith.me/vaultlib/vaultlib/util"
)

/*
Represents a vault that holds a user's messages and cryptographic keys. This
struct serves as a model for a vault that is decrypted and available for use.
When not in use, objects of this struct should be encrypted to produce an
`EVault` object.
*/
type Vault struct {
	ID util.UUID `json:"id"` //The ID of this vault object.
	Subject util.UUID `json:"subject"` //The ID of the user to whom this vault belongs.
	LastMod time.Time `json:"last_mod"` //The at which this vault was last changed.
	DevIdent string `json:"dev_ident"` //The user agent of the user that created this vault.
	Note string `json:"note"` //An optional note about the contents of the vault.

	KStore keystore.KeyStore `json:"kstore"` //Holds the user's public and private keys.
	//MStore keystore.KeyStore `json:"mstore"` //Holds the user's conversations and associated states.
}

//Creates a new vault object.
func New(sub util.UUID, devIdent string) *Vault {
	//Generate a new key store
	kstore := *keystore.New()

	//Create and return the new vault
	return &Vault{
		ID: util.MustNewUUID7(),
		Subject: sub,
		LastMod: time.Now(),
		DevIdent: devIdent,
		Note: "",
		KStore: kstore,
	}
}