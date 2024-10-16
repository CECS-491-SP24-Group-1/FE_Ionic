import { createWithEqualityFn as create } from "zustand/traditional";

interface VaultStore {
	vault: typeof Vault | null;
	setVault: (ev: typeof Vault) => void;

	dummy: string;
	setDummy: (str: string) => void;

	dummy2: string;
	setDummy2: (str: string) => void;
}

/**
 * Declares a Zustand store for a vault. See the following for usage
 * instructions:
 * https://www.perplexity.ai/search/how-do-i-use-this-zustand-stor-mha_ERBLTB.IUQy8ZXXY0g
 */
const useVaultStore = create<VaultStore>((set: any) => ({
	vault: null,
	setVault: (v: typeof Vault) => set({ vault: v }),

	dummy: "",
	setDummy: (str: string) => set({ dummy: str }),

	dummy2: "",
	setDummy2: (str: string) => set({ dummy2: str })
}));

export default useVaultStore;
