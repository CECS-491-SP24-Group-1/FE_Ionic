import create from "zustand";
import { LS_EVAULT_KEY, SS_VAULT_KEY } from "@/constants/WebStorageKeys"; // Adjust imports as necessary

interface VaultState {
	hasEVault: boolean;
	hasVault: boolean;
	vaultFile: File | null;
	evault: typeof EVault | null; // Replace with the actual type of EVault if known
	vault: typeof Vault | null; // Replace with the actual type of Vault if known
	setHasEVault: (value: boolean) => void;
	setHasVault: (value: boolean) => void;
	setVaultFile: (file: File | null) => void;
}

const useVaultStore = create<VaultState>((set: any) => ({
	hasEVault: EVault.inLStore(LS_EVAULT_KEY),
	hasVault: Vault.inLStore(SS_VAULT_KEY),
	vaultFile: null,
	evault: null,
	vault: null,
	setHasEVault: (value: boolean) => set({ hasEVault: value }),
	setHasVault: (value: boolean) => set({ hasVault: value }),
	setVaultFile: (file: File | null) => set({ vaultFile: file }) // Explicitly typed
}));

export default useVaultStore;
