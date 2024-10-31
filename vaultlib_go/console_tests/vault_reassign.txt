v = Vault.fromKS(new KeyStore());
console.log(v.toString());
v.dev_ident = "hello world";
v.note = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
v.last_mod = new Date().toISOString();
v.subject = "01926991-bc62-7000-965c-2196809fcd3b";
console.log(v.toString());
