//go:build js && wasm

package ffi

// Contains the options for the struct exporter.
type Flags struct {
	//Whether getter/setter functions should be generated.
	EmitGetterSetterFuncs bool `default:"false"`

	//Whether user provided getters and setters should be ignored when generating them.
	IgnoreGettersSetters bool `default:"false"`
}
