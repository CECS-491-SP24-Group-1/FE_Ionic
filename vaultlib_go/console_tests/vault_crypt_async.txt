v = Vault.fromKS(new KeyStore());
console.log(v.toString());
a = EVault.fromJSObject(await v.encryptPassphrase("tttt"));
console.log(a.toString());
b = Vault.fromJSObject(await a.decryptPassphrase("tttt"));
console.log(b.toString());
console.log(v.equals(b) ? "pass" : "fail");