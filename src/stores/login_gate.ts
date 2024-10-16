import { createWithEqualityFn as create } from "zustand/traditional";

interface LoginGateStore {
	shouldLogin: boolean;
	setShouldLogin: (val: boolean) => void;
	toggleShouldLogin: () => void;
}

/**
 * Declares a Zustand store for the login gate of the app.
 */
const useLoginGateStore = create<LoginGateStore>((set: any) => ({
	shouldLogin: true,
	setShouldLogin: (val: boolean) => set({ shouldLogin: val }),
	toggleShouldLogin: () =>
		set((state: LoginGateStore) => ({ shouldLogin: !state.shouldLogin }))
}));

export default useLoginGateStore;
