import { createWithEqualityFn as create } from "zustand/traditional";

// TEMP
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
const useVaultStore = create<VaultStore>((set: any) => ({
	vault: null,
	hasVault: false,
	setVault: (v: typeof Vault) => {
		console.log("vualtwkagn", typeof Vault)
		set({
			vault: v,
			hasVault: true,
			keystore: KeyStore.fromJSObject(v.kstore),
			myID: v.subject
		});
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

export default useVaultStore;
