import FFI from "../vaultlib_ffi";
import { IKeyStore } from "./keystore";
import { IEVault, IVault } from "./vault";

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
	interface MKeyStore extends FFI<KeyStore>, IKeyStore {
		/** Creates a new keystore object. */
		new (): MKeyStore;

		/** Signs a given message with the private key of the keystore. */
		sign(message: string): string;

		/** Verifies that a given message and signature were signed by this keystore's private key. */
		verify(message: string, signature: string): boolean;
	}
	/** Use `InstanceType<typeof KeyStore>` to use this as a type in TS. */
	const KeyStore: MKeyStore;

	/** Represents a vault, which contains a keystore, conversations, sessions, etc. */
	interface MVault extends FFI<Vault>, IVault<KeyStore> {
		/** Creates a new vault object. */
		new (subject: string, devIdent: string): MVault;

		/** Creates a new vault object out of an existing keystore. */
		fromKS(ks: KeyStore): MVault;

		/** Creates a new blank vault object. */
		newBlank(): MVault;

		/** Encrypts a vault using a given passphrase. */
		encryptPassphrase(pass: string): EVault;
	}
	/** Use `InstanceType<typeof Vault>` to use this as a type in TS. */
	const Vault: MVault;

	/** Represents an encrypted vault. */
	interface MEVault extends FFI<EVault>, IEVault {
		/** Decrypts a vault using a given passphrase. */
		decryptPassphrase(pass: string): Vault;
	}
	/** Use `InstanceType<typeof EVault>` to use this as a type in TS. */
	const EVault: MEVault;
}

//This empty export is necessary to make this a module
export {};
