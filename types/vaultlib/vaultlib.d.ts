import { KeyStore } from "./keystore";
import { FFIFactories } from "../vaultlib_ffi";

declare global {
	/*
	export namespace vaultlib {
		const HKDF_SALT: string;
		function HKDF(password: string): string;
		// Add any other functions exported by your WASM module here
		// For example:
		// function someOtherFunction(arg: number): boolean;
	}*/

	/** Represents a keystore, which contains a public and private Ed25519 key. */
	interface KeyStoreFunctions extends FFIFactories<KeyStore> {
		/** Creates a new keystore object. */
		new(): KeyStore;
		/** Signs a given message with the private key of the keystore. */
		sign(message: string): string;
		/** Verifies that a given message and signature were signed by this keystore's private key. */
		verify(message: string, signature: string): boolean;
	}
	/** Use `InstanceType<typeof KeyStore>` to use this as a type in TS. */
	const KeyStore: KeyStoreFunctions;

	/** Represents a vault, which contains a keystore, conversations, sessions, etc. */
	interface VaultFunctions extends FFIFactories<Vault> {
		/** Creates a new vault object. */
		new(): Vault;

		/** Creates a new vault object out of an existing keystore. */
		fromKS(ks: KeyStore): Vault;
	}
	/** Use `InstanceType<typeof Vault>` to use this as a type in TS. */
	const Vault: VaultFunctions;
}

//This empty export is necessary to make this a module
export { };
