// go-wasm.ts
import "./wasm_exec.js"

// Declare the global Go constructor
declare global {
	interface Window {
		Go: {
			new (): Go
		}
	}
}

interface Go {
	importObject: WebAssembly.Imports
	run(instance: WebAssembly.Instance): Promise<void>
}

export default window.Go
