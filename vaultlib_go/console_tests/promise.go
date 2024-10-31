//go:build js && wasm

package consoletests

import (
	"errors"
	"syscall/js"

	"wraith.me/vaultlib/jsutil"
)

// promiseVanilla(x: number, y: number): Promise<number>
func TestPromiseVanilla(this js.Value, args []js.Value) interface{} {
	//Get the input args
	x := int(args[0].Float())
	y := int(args[1].Float())

	promiseConstructor := js.Global().Get("Promise")
	return promiseConstructor.New(js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		//Setup the resolve and reject functions
		resolve := args[0]
		reject := args[1]

		//Define the async function to run
		go func() {
			//Error condition
			if x < 0 || y < 0 {
				errorMsg := js.ValueOf("Input numbers must be non-negative")
				reject.Invoke(errorMsg)
				return
			}

			//Ok condition
			result := x * y
			resolve.Invoke(js.ValueOf(result))
		}()

		//Don't return anything
		return nil
	}))
}

// promise(x: number, y: number): Promise<number>
func TestPromise(this js.Value, args []js.Value) interface{} {
	//Get the input args
	x := int(args[0].Float())
	y := int(args[1].Float())

	//Setup the promise action to run
	fun := func() (js.Value, error) {
		if x < 0 || y < 0 {
			return jsutil.Nil, errors.New("Input numbers must be non-negative")
		}

		//Ok condition
		return js.ValueOf(x * y), nil
	}

	//Construct and return the promise
	return jsutil.Promise(fun)
}
