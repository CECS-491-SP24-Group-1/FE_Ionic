package io

import (
	"bytes"
	"os"
)

// Deserializes an object from a file containing GOB bytes.
func File2Obj[T any](obj *T, path string) error {
	//Read the bytes of the file
	fb, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	//Deserialize the GOB stream to an object
	buf := bytes.NewBuffer(fb)
	return Bytes2Obj(obj, buf)
}

// Serializes an object to a file containing GOB bytes.
func Obj2File[T any](path string, obj T) error {
	//Initialize the file writer
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	//Serialize the object to a GOB stream
	var buf bytes.Buffer
	if err := Obj2Bytes(&buf, &obj); err != nil {
		return err
	}

	//Write the GOB bytes to the file
	_, err = file.Write(buf.Bytes())
	if err != nil {
		return err
	}

	//No errors so return nil
	return nil
}
