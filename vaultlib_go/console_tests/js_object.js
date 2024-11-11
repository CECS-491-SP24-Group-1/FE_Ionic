u = new User();
console.log(u.toJSObject());
v = User.fromJSObject(u.toJSObject());
console.log(u.equals(v));
