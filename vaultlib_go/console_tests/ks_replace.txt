v = new Vault("7c1e2d3e-7f6b-4c8d-b1a5-3f8f0d1e2b7f", "test");
console.log(v.toString());
console.log(v.kstore);
ks = new KeyStore();
console.log(ks.toString());
v.kstore = ks.toJson();
console.log(v.toString());
console.log(v.kstore);
