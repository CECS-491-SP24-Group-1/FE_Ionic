import { createWithEqualityFn as create } from "zustand/traditional";
import { LS_EVAULT_KEY, SS_VAULT_KEY } from "@/constants/WebStorageKeys";
import Cookies from "js-cookie";
import { setCookie } from "@/util/manage_misc_cookies";

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
	setVault: (v: typeof Vault) => void;
	vaultFromSS: () => boolean;

	//Managed by vault
	keystore: typeof KeyStore | null;
	myID: string; //TODO: use cookies???

	evault: typeof EVault | null;
	hasEVault: boolean;
	setEVault: (ev: typeof EVault) => void;
	evaultFromLS: () => boolean;

	//Re-encryption support
	salt: string;
	setSalt: (salt: string) => void;
	ekey: string;
	setEKey: (ekey: string) => void;
	canReencrypt: boolean;
	setCanReencrypt: (canReencrypt: boolean) => void;

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
const useVaultStore = create<VaultStore>((set: any, get: any) => {
	//Private functions
	const updateVaultState = (v: typeof Vault) => {
		console.log("vualtwkagn");
		set({
			vault: v,
			hasVault: true,
			keystore: KeyStore.fromJSObject(v.kstore),
			myID: v.subject
		});
	};

	const updateEVaultState = (ev: typeof EVault) => {
		console.log("evaultqt");
		set({
			evault: ev,
			hasEVault: true
		});
	};

	//Declare the Zustand component here
	return {
		vault: null,
		hasVault: false,
		setVault: (v: typeof Vault) => {
			//Get the previous value
			//const currentVault = get().vault;

			//Update the component state
			updateVaultState(v);

			//Persist the changes to session storage
			(v as typeof Vault).toSStore(SS_VAULT_KEY);
		},
		vaultFromSS: () => {
			//It is assumed that the vault is already in session storage
			try {
				//Load the vault from Session Storage
				const loadedVault = Vault.fromSStore(SS_VAULT_KEY);

				//Update the vault state
				updateVaultState(loadedVault);

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

		evault: null,
		hasEVault: false,
		setEVault: (ev: typeof EVault) => {
			//Update the component state
			updateEVaultState(ev);

			//Persist the changes to local storage
			(ev as typeof EVault).toLStore(LS_EVAULT_KEY);
		},
		evaultFromLS: () => {
			//It is assumed that the encrypted vault is already in local storage
			try {
				//Load the evault from local storage
				const loadedEVault = EVault.fromLStore(LS_EVAULT_KEY);

				//Update the evault state
				updateEVaultState(loadedEVault);
				console.log(loadedEVault.toString());

				return true;
			} catch (e: any) {
				//Remove invalid local storage key
				console.error("failed to load encrypted vault from local storage", e);
				localStorage.removeItem(LS_EVAULT_KEY);
				return false;
			}
		},

		//Re-encryption support
		canReencrypt: false,
		salt: Cookies.get(import.meta.env.VITE_VSALT_COOKIE_NAME) ?? "",
		setSalt: (salt: string) => {
			setCookie(import.meta.env.VITE_VSALT_COOKIE_NAME, salt);
			set({ salt: salt });
		},
		ekey: Cookies.get(import.meta.env.VITE_VEKEY_COOKIE_NAME) ?? "",
		setEKey: (ekey: string) => {
			setCookie(import.meta.env.VITE_VEKEY_COOKIE_NAME, ekey);
			set({ ekey: ekey });
		},
		setCanReencrypt: (canReencrypt: boolean) => set({ canReencrypt: canReencrypt }),

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
	};
});

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
(window as any).useVaultStore = useVaultStore; //Exports the symbol to the global namespace (for console debugging) `const state = window.useVaultStore.getState();`