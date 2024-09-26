//go:build js && wasm

package ffiexample

import (
	"syscall/js"

	"wraith.me/vaultlib/ffi"
)

// Exports the user object for use in JS.
func Export() {
	//No getters, setters, factories, or methods
	exp := ffi.NewStructExporter(
		User{}, construct,
	).WithFlags(
		ffi.Flags{
			IgnoreGettersSetters: true,
		},
	)
	exp.Export("KeyStore")
}

func construct([]js.Value) (*User, error) {
	u := DefaultUser()
	return &u, nil
}
