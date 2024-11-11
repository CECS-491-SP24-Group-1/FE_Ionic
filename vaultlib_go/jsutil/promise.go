//go:build js && wasm

package jsutil

import "syscall/js"

// Defines a promise function.
type PromiseFunc func() (js.Value, error)

// Constructs a `Promise` value for async Go functions.
func Promise(fun PromiseFunc) js.Value {
	//Create the promise
	promiseConstructor := js.Global().Get("Promise")

	//Create the promise function and return it
	return promiseConstructor.New(js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		//Setup the resolve and reject functions
		resolve := args[0]
		reject := args[1]

		//Define the async function to run
		go func() {
			//Invoke the function that was passed in
			val, err := fun()

			//Reject the promise if an error occurred
			if err != nil {
				reject.Invoke(err.Error())
				return //Stop execution here
			}

			//Resolve the promise with the returned value
			resolve.Invoke(val)
		}()

		//Don't return anything
		return nil
	}))
}
