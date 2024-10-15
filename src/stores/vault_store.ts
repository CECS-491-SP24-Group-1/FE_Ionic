import { createWithEqualityFn as create } from "zustand/traditional";

interface VaultStore {
	vault: typeof Vault | null;
	setVault: (ev: typeof Vault) => void;
}

const useVaultStore = create<VaultStore>((set: any) => ({
	vault: null,
	setVault: (v: typeof Vault) => set({ vault: v })
}));

export default useVaultStore;
