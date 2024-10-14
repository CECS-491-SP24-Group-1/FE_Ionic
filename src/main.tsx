import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { IonApp, setupIonicReact, IonSpinner } from "@ionic/react";
import { ToastContainer } from "react-toastify";

import App from "./App";
import useWasm from "./wasm_util/use_wasm";

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

/* Run init stuff here */
setupIonicReact();

/** Sets up the entire React application. */
export function Root() {
	//Setup the WASM loader for vaultlib
	const { loaded: wasmLoaded, error: wasmError } = useWasm("/vaultlib.wasm");
	const [vaultExists, setVaultExists] = useState<boolean | null>(null);
	//Listen for state changes to the loader,
	useEffect(() => {
		if (wasmLoaded) {
			console.log("WebAssembly module loaded successfully");
			//Perform any actions that depend on the WebAssembly module being loaded

			// Session storage key
			const SS_VAULT_KEY = "user_vault_key" //Placeholder

			if (Vault.inSStore(SS_VAULT_KEY)){
				const vault = Vault.fromSStore(SS_VAULT_KEY);
				if (vault){
					console.log("Vault deseraialized successfuly", vault)
					setVaultExists(true);
				}
				else{
					setVaultExists(false);
				}
			} else{
				setVaultExists(false);
			}
		}
	}, [wasmLoaded]);

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
	if (!wasmLoaded || vaultExists === null) {
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
	if (!vaultExists) {
        return (
            <IonApp>
                <div className="registrationGate">
                    <h1>Please Register or Log In</h1>
                    {/* Registration/Login form can go here */}
                </div>
            </IonApp>
        );
    }

	//Render the component when vaultlib loads successfully
	//TODO: add registration and login stuff here
	return (
		<IonApp>
			<App />
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
		<Root />
	</React.StrictMode>
);
