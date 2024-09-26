import { KeyStore } from "./keystore";
import { FactoryFuncs } from "../exported_go";

declare global {
	/*
	export namespace vaultlib {
		const HKDF_SALT: string;
		function HKDF(password: string): string;
		// Add any other functions exported by your WASM module here
		// For example:
		// function someOtherFunction(arg: number): boolean;
	}*/

	/*
	interface KeyStore {
		sk: Uint8Array;
		pk: Uint8Array;
		fingerprint: string;
	}
	*/

	interface KeyStoreFunctions extends FactoryFuncs<KeyStore> {
		new (): KeyStore;
	}
	const KeyStore: KeyStoreFunctions;
}

//This empty export is necessary to make this a module
export {};
