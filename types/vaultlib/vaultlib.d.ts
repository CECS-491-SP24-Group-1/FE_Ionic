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
	const KeyStore: KeyStoreFunctions;
}

//This empty export is necessary to make this a module
export { };
