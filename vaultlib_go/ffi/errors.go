//go:build js && wasm

package ffi

import "errors"

var (
	NotEnoughGettersError = errors.New("not enough getters provided; expected")
	NotEnoughSettersError = errors.New("not enough setters provided; expected")
	NotInWebStorageError  = errors.New("vault is not present in the selected web storage engine")
)
