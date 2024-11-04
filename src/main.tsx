import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { IonApp, setupIonicReact, IonSpinner } from "@ionic/react";
import { ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";
import { IonReactRouter } from "@ionic/react-router";

import App from "./App";
import useVaultStore, { evaultInLS, vaultInSS } from "./stores/vault_store";
import useWasm from "./wasm_util/use_wasm";
import usePageTrap from "./hooks/page_trap";
import "./index.scss";

import "react-toastify/dist/ReactToastify.css";
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.always.css";

/* Ionic Theme variables */
import "./variables.scss";
import LRPage from "./pages/login_register/LRPage";
import useLoginGateStore from "./stores/login_gate";

/* Run init stuff here */
setupIonicReact();

/** Sets up the entire React application. */
export function Root() {
	//Page trap
	usePageTrap();

	//Setup the WASM loader for vaultlib
	const { loaded: wasmLoaded, error: wasmError } = useWasm("/vaultlib.wasm");
	const initRef = useRef(false);

	//Set up vault checks and login gates
	const hasVault = useRef(vaultInSS());
	const hasEVault = useRef(evaultInLS());
	const { shouldLogin, setShouldLogin } = useLoginGateStore((state) => ({
		shouldLogin: state.shouldLogin,
		setShouldLogin: state.setShouldLogin
	})); // Login gate, true equals that it needs to login

	//Cookies init
	const [cookies] = useCookies();

	//Vault store access; this makes the store available to all child components
	const { populateVault, populateEVault } = useVaultStore((state) => ({
		populateVault: state.vaultFromSS,
		populateEVault: state.evaultFromLS
	}));

	//Initializes the WASM module
	const initWasm = useCallback(() => {
		if (initRef.current) return;
		initRef.current = true;

		console.log("Initializing WebAssembly");
		if (wasmLoaded) {
			console.log("WebAssembly module loaded successfully");
			// Perform any actions that depend on the WebAssembly module being loaded
		}
	}, []);

	//Initializes the WASM module when the component mounts
	//TODO: add runOnce hook and use that to populate the vault state
	useEffect(() => {
		if (wasmLoaded) {
			initWasm();

			//Load the encrypted vault into the Zustand store
			if (hasEVault.current) {
				console.log("has evault!!!");
				if (!populateEVault()) {
					console.error(
						"Failed to populate the encrypted vault into Zustand. Re-encryption will not succeed!"
					);
				}
			}

			//Vault check
			if (hasVault.current) {
				//Attempt to load the vault
				if (populateVault()) {
					//Check login capability from cookies
					if (cookies[import.meta.env.VITE_ACOOKIE_EXPR_NAME] !== undefined) {
						setShouldLogin(false); //User does not need to login
					} else {
						setShouldLogin(true); // User needs to login, show login page
					}
				} else {
					setShouldLogin(true);
				}
			} else {
				console.log("no vault in sessionstorage");
			}
		}
	}, [wasmLoaded, cookies, initWasm]);

	//Show an error screen if an error occurred
	if (wasmError) {
		return (
			<IonApp>
				<div className="loadPlaceholder">
					<h1 style={{ color: "#FF0000" }}>Error loading Vaultlib</h1>
					<code>{wasmError.message}</code>
				</div>
			</IonApp>
		);
	}

	//Show a placeholder while vaultlib is loading
	if (!wasmLoaded) {
		return (
			<IonApp>
				<div className="loadPlaceholder">
					<div className="flex items-baseline">
						<h1 className="mr-2">Loading Vaultlib module</h1>
						<IonSpinner className="w-5 h-5"></IonSpinner>
					</div>
					<p>Check the console for further details</p>
				</div>
			</IonApp>
		);
	}

	//Render the component when vaultlib loads successfully
	//Passing the login boolean as a prop
	return (
		<IonApp>
			{shouldLogin ? <LRPage /> : <App />}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
			/>
		</IonApp>
	);
}

//Creates the root element in the HTML DOM.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<IonReactRouter>
			<Root />
		</IonReactRouter>
	</React.StrictMode>
);
