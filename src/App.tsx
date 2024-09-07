import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { IonButton, IonContent, IonInput, IonItem, IonPage } from "@ionic/react";

import "./App.css";
import useWasm from "./wasm_util/use_wasm";

export default function App() {
	const [count, setCount] = useState(0);
	const [key, setKey] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState<string>("");
	const wasmLoaded = useWasm("/vaultlib.wasm");

	const callWasmFunction = () => {
		if (wasmLoaded) {
			setKey(ed25519Keygen());
		}
		else {
			console.error("WASM not loaded or function not available");
		}
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault(); // Prevent the default form submission
		console.log('Submitted value:', inputValue);
		// Add your submission logic here
		setInputValue(""); // Clear the input field after submission
	};

	return (
		<IonPage>
			<IonContent>
				<div className="App">
					<div className="logoContainer">
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
						<p>Password HKDF Test</p>
						<form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
							<IonItem style={{ flex: 1 }}>
								<IonInput
									value={inputValue}
									onIonChange={(e) => setInputValue(e.detail.value!)}
									placeholder="Enter text"
									required
								/>
							</IonItem>
							<IonButton type="submit" expand="full">Submit</IonButton>
						</form>
					</div>
				</div>
			</IonContent>
		</IonPage>
	);
}
