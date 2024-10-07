pass = "testing123";
v = new Vault("018b6e56-1c3f-7000-8000-7b9d8f9b5c1a", "vault for testing stuff");
console.log(v.toString());
ev = EVault.fromJSObject(v.encryptPassphrase(pass));
console.log(ev.toString());
v2 = Vault.fromJSObject(ev.decryptPassphrase(pass));
console.log(v2.toString());
console.log("v = v2 ?", v.equals(v2));
