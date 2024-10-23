import { createWithEqualityFn as create } from "zustand/traditional";
import { LS_EVAULT_KEY, SS_VAULT_KEY } from "@/constants/WebStorageKeys";

//TODO: move this elsewhere; separate concerns
interface ChatRoom {
	id: string;
	name: string;
	avatar: string;
	lastMessage: string;
	time: string;
}

interface VaultStore {
	vault: typeof Vault | null;
	hasVault: boolean;
	setVault: (ev: typeof Vault) => void;
	vaultFromSS: () => boolean;

	//Managed by vault
	keystore: typeof KeyStore | null;
	myID: string;

	salt: string;
	setSalt: (salt: string) => void;

	vaultEKey: string;
	setVaultEKey: (key: string) => void;

	dummy: string;
	setDummy: (str: string) => void;

	dummy2: string;
	setDummy2: (str: string) => void;

	// TEMP Map of UUIDs to ChatRoom objects
	chatRooms: Record<string, ChatRoom>;
	addChatRoom: (newRoom: ChatRoom) => void;
	getChatRoom: (id: string) => ChatRoom | undefined;
}

/**
 * Declares a Zustand store for a vault. See the following for usage
 * instructions:
 * https://www.perplexity.ai/search/how-do-i-use-this-zustand-stor-mha_ERBLTB.IUQy8ZXXY0g
 */
const useVaultStore = create<VaultStore>((set: any, get: any) => ({
	vault: null,
	hasVault: false,
	setVault: (v: typeof Vault) => {
		console.log("vualtwkagn", typeof Vault);

		//Get the previous value
		//const currentVault = get().vault;

		//Update the component state
		set({
			vault: v,
			hasVault: true,
			keystore: KeyStore.fromJSObject(v.kstore),
			myID: v.subject
		});

		//Persist the changes to session storage
		(v as typeof Vault).toSStore(SS_VAULT_KEY);
	},
	vaultFromSS: () => {
		//It is assumed that the vault is already in session storage
		try {
			console.log("populating vault from session storage");
			//Load the vault from Session Storage
			const loadedVault = Vault.fromSStore(SS_VAULT_KEY);

			//Update the component state
			//This must match what is in the setter
			//TODO: investigate way to dedupe
			set({
				vault: v,
				hasVault: true,
				keystore: KeyStore.fromJSObject(v.kstore),
				myID: v.subject
			});

			return true;
		} catch (e: any) {
			//Remove invalid session storage key
			console.error("failed to load vault from session storage", e);
			sessionStorage.removeItem(SS_VAULT_KEY);
			return false;
		}
	},

	//Managed by vault
	keystore: null,
	myID: "",

	salt: "",
	setSalt: (salt: string) => set({ salt: salt }),

	vaultEKey: "",
	setVaultEKey: (key: string) => set({ vaultEKey: key }),

	dummy: "",
	setDummy: (str: string) => set({ dummy: str }),

	dummy2: "",
	setDummy2: (str: string) => set({ dummy2: str }),

	// Initialize chatRooms as an empty map
	chatRooms: {},

	// Add the new room to the chatRooms map
	addChatRoom: (newRoom: ChatRoom) =>
		set((state: VaultStore) => ({
			chatRooms: {
				...state.chatRooms,
				[newRoom.id]: newRoom // Add new room with UUID as key
			}
		})),

	// Get a chat room by its UUID
	getChatRoom: (id: string) => set((state: VaultStore) => state.chatRooms[id])
}));

/**
 * Checks if a vault is in session storage. This function does NOT check if
 * the value at the expected ss key is valid. It is up to the programmer to
 * check for validity before loading the vault.
 */
export function vaultInSS(): boolean {
	return SS_VAULT_KEY in sessionStorage;
}

/**
 * Checks if an encrypted vault is in local storage. This function does NOT
 * check if the value at the expected ls key is valid. It is up to the
 * programmer to check for validity before loading the encrypted vault.
 */
export function evaultInLS(): boolean {
	return LS_EVAULT_KEY in localStorage;
}

export default useVaultStore;
