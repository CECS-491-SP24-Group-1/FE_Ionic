// use_wasm.ts
import { useEffect, useState } from "react";
import Go from "./go_wasm";

interface WasmState {
	loaded: boolean;
	error: Error | null;
}

const useWasm = (wasmPath: string): WasmState => {
	const [state, setState] = useState<WasmState>({ loaded: false, error: null });

	useEffect(() => {
		const loadWasm = async (): Promise<void> => {
			try {
				console.log("Starting to load WASM");
				const go = new Go();

				const loadingPromise = WebAssembly.instantiateStreaming(
					fetch(wasmPath),
					go.importObject
				).then((result) => {
					console.log("WASM instantiated");
					go.run(result.instance);
					console.log("WASM running");
					setState({ loaded: true, error: null });
					console.log("State set to loaded");
				});

				const timeoutPromise = new Promise<never>((_, reject) => {
					setTimeout(() => {
						reject(new Error("WASM loading timed out after 5 seconds"));
					}, 5000);
				});

				await Promise.race([loadingPromise, timeoutPromise]);
			} catch (err) {
				console.error("Failed to load WASM:", err);
				setState({
					loaded: false,
					error: err instanceof Error ? err : new Error(String(err))
				});
			}
		};

		loadWasm();
	}, [wasmPath]);

	return state;
};

export default useWasm;
