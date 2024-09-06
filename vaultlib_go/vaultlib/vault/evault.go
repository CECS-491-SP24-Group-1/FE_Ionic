package vault

import "wraith.me/vaultlib/vaultlib/util"

/*
Represents a vault that holds a user's messages and cryptographic keys. This
struct serves as a model for a vault that is encrypted and at rest. This form
of a vault should be the one stored when the user is not currently using it
to prevent theft of the user's cryptographic keys and other sensitive info.
To derive a `Vault` object, simply decrypt this one with the symmetric key
that was used to encrypt it.
*/
type EVault struct {
	ID util.UUID `json:"id"` //The ID of this vault object.
	Subject util.UUID `json:"subject"` //The ID of the user to whom this vault belongs.

	PayloadSize uint64 `json:"payload_size"` //The size of the encrypted payload in bytes
	Payload []byte `json:"payload"` //The actual contents of the encrypted vault, encoded as a Base64 string.
}