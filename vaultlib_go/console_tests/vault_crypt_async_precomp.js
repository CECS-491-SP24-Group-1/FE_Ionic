v = Vault.fromKS(new KeyStore());
console.log(v.toString());

p = "12345";
s = vaultlib.argonSalt();
k = await vaultlib.argon2id(p, s);
console.log("pass: ", p);
console.log("salt: ", s);
console.log("key:  ", k);

a = EVault.fromJSObject(await v.encryptPassphrasePrecomp(k, s));
console.log(a.toString());

b = Vault.fromJSObject(await a.decryptPassphrasePrecomp(k));
console.log(b.toString());
console.log(v.equals(b) ? "pass" : "fail");