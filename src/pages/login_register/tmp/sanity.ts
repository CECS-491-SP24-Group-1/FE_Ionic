//import { Vault, EVault, KeyStore } from "@ptypes/vaultlib/vaultlib";

const pass = "testing123";
const v = new Vault("018b6e56-1c3f-7000-8000-7b9d8f9b5c1a", "vault for testing stuff");
console.log(v.toString());
const ev = EVault.fromJSObject(v.encryptPassphrase(pass));
console.log(ev.toString());
const v2 = Vault.fromJSObject(ev.decryptPassphrase(pass));
console.log(v2.toString());
console.log("v = v2 ?", v.equals(v2));

const ks = new KeyStore();
ks.sign("xgzg");
ks.sk;
KeyStore.inJSStore("");

const w = Vault.fromKS(ks);
const x = w.kstore;
