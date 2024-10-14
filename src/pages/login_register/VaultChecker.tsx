import React, { useEffect, useState } from "react";
import { IonApp, IonSpinner } from "@ionic/react";
//import App from "./App";
import Home from "../Home"
/** Props interface for VaultChecker */
interface VaultCheckerProps {
    SS_VAULT_KEY: string;
}

/** VaultChecker component to check for vault existence and load the app or login gate */
export default function VaultChecker({ SS_VAULT_KEY }: VaultCheckerProps) {
    const [vaultExists, setVaultExists] = useState<boolean | null>(null);

    useEffect(() => {
        // Perform the vault check after WebAssembly is loaded
        if (Vault.inSStore(SS_VAULT_KEY)) {
            const vault = Vault.fromSStore(SS_VAULT_KEY);
            if (vault) {
                console.log("Vault deserialized successfully", vault);
                setVaultExists(true); // Vault exists and is valid
            } else {
                setVaultExists(false); // Vault not found or invalid
            }
        } else {
            setVaultExists(false); // Vault not found in sessionStorage
        }
    }, [SS_VAULT_KEY]);

    // Show a loading screen while the vault check is in progress
    if (vaultExists === null) {
        return (
            <IonApp>
                <div className="loadPlaceholder">
                    <div className="flex items-baseline">
                        <h1 className="mr-2">Checking Vault Status...</h1>
                        <IonSpinner className="w-5 h-5"></IonSpinner>
                    </div>
                </div>
            </IonApp>
        );
    }

    // Show registration/login gate if vault does not exist
    if (!vaultExists) {
        return (
            <IonApp>
                <div className="registrationGate">
                    <h1>Please Register or Log In</h1>
                    {/* You can add your registration/login form here */}
                </div>
            </IonApp>
        );
    }

    // Render Home app if the vault exists
    return <Home />;
}
