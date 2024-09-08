// use_wasm.ts
import {useEffect, useState} from "react"
import Go from "./go_wasm"

const useWasm = (wasmPath: string): boolean => {
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const loadWasm = async (): Promise<void> => {
			try {
				const go = new Go()
				const result = await WebAssembly.instantiateStreaming(
					fetch(wasmPath),
					go.importObject
				)
				go.run(result.instance)
				setLoaded(true)
			} catch (err) {
				console.error("Failed to load WASM:", err)
			}
		}

		loadWasm()
	}, [wasmPath])

	return loaded
}

export default useWasm
