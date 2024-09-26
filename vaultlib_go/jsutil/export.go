//go:build js && wasm

package jsutil

import (
	"strings"
	"syscall/js"

	"wraith.me/vaultlib/vaultlib/io"
)

// Controls the namespace of the exported JS functions and variables.
var PackageName = "vaultlib"

// Defines the expected structure of an exportable JS bridge function.
type Func func(this js.Value, args []js.Value) any

// Contains a value to export and its name.
type V struct {
	N string
	V interface{}
}

// Creates a new "V" wrapper for a variable and its name.
func NV(n string, v interface{}) V {
	return V{N: n, V: v}
}

// Utility function to export Go functions to JS.
func ExportF(namespace string, targets ...Func) {
	//Get the namespace to export to
	if namespace == "" {
		namespace = PackageName
	}
	ns := exportLoc(namespace)

	//Loop over the functions to export
	for _, target := range targets {
		ns.Set(io.GetFunctionName(target), js.FuncOf(target))
	}
}

// Utility function to export Go values to JS.
func ExportV(namespace string, targets ...V) {
	//Get the namespace to export to
	if namespace == "" {
		namespace = PackageName
	}
	ns := exportLoc(namespace)

	//Loop over the variables to export
	for _, target := range targets {
		ns.Set(target.N, js.ValueOf(target.V))
	}
}

// Gets the export location for a given package name, setting it to `global` if empty.
func exportLoc(packageName string) js.Value {
	//Set the location to be "global" if the name is empty
	if packageName == "" {
		return js.Global()
	}

	//Split the package name by periods
	parts := strings.Split(packageName, ".")

	//Start with the global object
	current := js.Global()

	//Iterate through each part of the package name
	for _, part := range parts {
		//Check if this part of the namespace exists
		next := current.Get(part)
		if next.IsUndefined() {
			//Create a new object for this part of the namespace
			current.Set(part, js.Global().Get("Object").New())
			next = current.Get(part) //Re-fetch the newly created object
		}
		//Move to the next level
		current = next
	}

	//Return the built path
	return current
}
