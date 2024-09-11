import {useEffect, useState} from "react";
//import reactLogo from "../assets/react.svg";
import "./App.scss";
import {IonButton, IonContent, IonInput, IonItem, IonPage} from "@ionic/react";

//import "./App.scss";
import useWasm from "../../wasm_util/use_wasm";

// Import the components from the components/navigation folder
import {TabBarIcon} from "../../components/navigation/TabBarIcon";
import {Collapsible} from "../../components/Collapsible";
import {ExternalLink} from "../../components/ExternalLink";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import {ThemedText} from "../../components/ThemedText";
import {ThemedView} from "../../components/ThemedView";
import TabBar from "../navigation/TabBar";

export default function App() {
	const [count, setCount] = useState(0);
	const [key, setKey] = useState<string | null>(null);
	const [salt, setSalt] = useState<string | null>(null);
	const [hkdf, setHkdf] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState<string>("");
	const wasmLoaded = useWasm("/vaultlib.wasm");

	useEffect(() => {
		if (wasmLoaded) setSalt(vaultlib.HKDF_SALT);
	}, [wasmLoaded]);

	const callWasmFunction = () => {
		if (wasmLoaded) {
			setKey(vaultlib.Ed25519Keygen());
		} else {
			console.error("WASM not loaded or function not available");
		}
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (wasmLoaded) setHkdf(vaultlib.HKDF(inputValue));
	};

	return (
		<IonPage>
			<IonContent>
				<div className="App">
					<div className="logoContainer">
						<a href="https://vitejs.dev" target="_blank">
							<img src="/vite.svg" className="logo" alt="Vite logo" />
						</a>
					</div>
					<h1>Vite + React + Ionic</h1>
					<div className="card">
						<IonButton onClick={() => setCount((count) => count + 1)}>
							count is {count}
						</IonButton>
						<p>
							Edit <code>src/App.tsx</code> and save to test HMR
						</p>

						<p>{wasmLoaded ? "WASM Loaded!" : "Loading WASM..."}</p>
						<IonButton onClick={callWasmFunction} disabled={!wasmLoaded}>
							Call WASM function
						</IonButton>
						<pre className="text-2xs mt-1">{key ? key : "<no key yet>"}</pre>
						<div className="h-20"></div>
						<p>Password HKDF Test</p>
						<form
							className="mx-auto max-w-screen-sm"
							onSubmit={handleSubmit}
							style={{display: "flex", alignItems: "center"}}>
							<IonItem style={{flex: 1}}>
								{/* <IonInput
									value={inputValue}
									onIonChange={(e) => setInputValue(e.detail.value!)}
									placeholder="Enter a passphrase"
									required
								/> */}
							</IonItem>
							<IonButton type="submit">Submit</IonButton>
						</form>
						<pre className="text-2xs mt-2">
							<strong>salt:</strong> {salt}
						</pre>
						<pre className="text-2xs mt-1">{hkdf ? hkdf : "<no hkdf key yet>"}</pre>
					</div>
				</div>
			</IonContent>
			<TabBar />
		</IonPage>
	);
}
