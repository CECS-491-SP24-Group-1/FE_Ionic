import {useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import "./App.scss";
import {IonButton, IonContent, IonInput, IonItem, IonPage} from "@ionic/react";

import "./App.scss";
import useWasm from "./wasm_util/use_wasm";

// Import the components from the components/navigation folder
import {TabBarIcon} from "./components/navigation/TabBarIcon";
import {Collapsible} from "./components/Collapsible";
import {ExternalLink} from "./components/ExternalLink";
import ParallaxScrollView from "./components/ParallaxScrollView";
import {ThemedText} from "./components/ThemedText";
import {ThemedView} from "./components/ThemedView";
import TabBar from "./components/navigation/TabBar";
import HomePage from "./components/pages/HomePage";

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
				<TabBar />
				<HomePage />
			</IonContent>
		</IonPage>
	);
}
