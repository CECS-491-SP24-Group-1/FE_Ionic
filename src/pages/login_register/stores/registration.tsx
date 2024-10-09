import { create } from "zustand";
import { produce } from "immer";

interface VaultState {
	vault: typeof Vault;

	updateVault: (newVaultData: Partial<typeof Vault>) => void;
	updateSubject: (subject: string) => void;
	updateDevIdent: (devIdent: string) => void;
	updateKstore: (keystore: typeof KeyStore) => void;
}

/** Helps to manage the state of a vault across multiple pages. */
const createVaultStore = () => create<VaultState>((set) => ({
	//Holds the current vault object
	vault: Vault.fromJson("{}"),

	//Allows the vault to accept partial updates
	updateVault: (newVaultData) =>
		set(
			produce((state) => {
				state.vault = { ...state.vault, ...newVaultData };
			})
		),

	//Updates the vault subject
	updateSubject: (subject) =>
		set(
			produce((state) => {
				state.vault.subject = subject;
			})
		),

	//Updates the vault device identifier
	updateDevIdent: (devIdent) =>
		set(
			produce((state) => {
				state.vault.dev_ident = devIdent;
			})
		),

	//Updates the keystore in a vault
	updateKstore: (keystore) =>
		set(
			produce((state) => {
				state.vault.kstore = { ...state.vault.kstore, ...keystore };
			})
		)
}));

import React, { createContext, useRef, useContext } from 'react';

const VaultStoreContext = createContext<ReturnType<typeof createVaultStore> | null>(null);

export const VaultStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const storeRef = useRef<ReturnType<typeof createVaultStore> | null>(null);
	if (!storeRef.current) {
		storeRef.current = createVaultStore();
	}

	return (
		<VaultStoreContext.Provider value={storeRef.current}>
			{children}
		</VaultStoreContext.Provider>
	);
};

export const useVaultStore = () => {
	const store = useContext(VaultStoreContext);
	if (!store) {
		throw new Error('useVaultStore must be used within VaultStoreProvider');
	}
	return store;
};

export default useVaultStore;
