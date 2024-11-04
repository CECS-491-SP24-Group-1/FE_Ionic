passphrase = "testing123";
salt = vaultlib.argonSalt();

vaultlib.argon2id(passphrase, salt)
	.then(result => console.log(`Argon2id result: ${result}`))
	.catch(err => console.error("Argon2id error:", err));