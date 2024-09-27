package io

import (
	"bytes"
	"encoding/base64"
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

// Deserializes a given object from a base64 GOB string.
func GString2Obj[T any](gs []byte, obj *T) error {
	byt, err := base64.StdEncoding.DecodeString(string(gs))
	if err != nil {
		return err
	}
	buf := bytes.NewBuffer(byt)
	return Bytes2Obj(obj, buf)
}

// Serializes a given object to a base64 GOB string.
func Obj2GString[T any](obj *T) ([]byte, error) {
	buf := bytes.Buffer{}
	if err := Obj2Bytes(&buf, obj); err != nil {
		return nil, err
	}
	gs := base64.StdEncoding.EncodeToString(buf.Bytes())
	return []byte(gs), nil
}
