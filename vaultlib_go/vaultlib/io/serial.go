package io

import (
	"bytes"
	"encoding/gob"
)

// Deserializes a given object from a bytes buffer. Uses GOB in the backend.
func Bytes2Obj[T any](obj *T, buf *bytes.Buffer) error {
	dec := gob.NewDecoder(buf)
	return dec.Decode(obj)
}

// Serializes a given object to a bytes buffer. Uses GOB in the backend.
func Obj2Bytes[T any](buf *bytes.Buffer, obj *T) error {
	enc := gob.NewEncoder(buf)
	return enc.Encode(obj)
}
