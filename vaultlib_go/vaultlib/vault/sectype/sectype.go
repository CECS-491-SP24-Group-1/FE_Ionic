//go:generate go-enum --marshal --forceupper --mustparse --nocomments --names --values

package sectype

// The security method that the vault is encrypted with.
/*
ENUM(
	NONE //No encrypted (not recommended).
	PASSPHRASE //Encrypted via a passphrase (most simple).
	QR //Encrypted via a scannable QR code.
	BIOMETRICS //Encrypted via biometrics (fingerprint or face ID).
	SEC_KEY //Encrypted via a hardware security key.
)
*/
type SecType int8