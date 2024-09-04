import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { IonButton, IonContent, IonPage } from "@ionic/react";

import "./App.css";
import useWasm from "./wasm_util/use_wasm";

export default function App() {
	const [count, setCount] = useState(0);
	const [key, setKey] = useState<string | null>(null);

	const wasmLoaded = useWasm("/vaultlib.wasm");

	const callWasmFunction = () => {
		if (wasmLoaded) {
			setKey(ed25519Keygen());
		}
		else {
			console.error("WASM not loaded or function not available");
		}
	};

	return (
		<IonPage>
			<IonContent>
				<div className="App">
					<div>
						<a href="https://vitejs.dev" target="_blank">
							<img src="/vite.svg" className="logo" alt="Vite logo" />
						</a>
						<a href="https://reactjs.org" target="_blank">
							<img src={reactLogo} className="logo react" alt="React logo" />
						</a>
					</div>
					<h1>Vite + React + Ionic</h1>
					<div className="card">
						<IonButton onClick={() => setCount((count) => count + 1)}>
							count is {count}
						</IonButton>
						<p>Edit <code>src/App.tsx</code> and save to test HMR</p>

						<p>{wasmLoaded ? "WASM Loaded!" : "Loading WASM..."}</p>
						<IonButton onClick={callWasmFunction} disabled={!wasmLoaded}>Call WASM function</IonButton>
						<pre style={{ fontSize: "10px" }}>{key ? key : "<no key yet>"}</pre>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
}
