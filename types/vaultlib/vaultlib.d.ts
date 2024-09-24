import { KeyStore } from "./keystore";

declare global {
	export namespace vaultlib {
		const HKDF_SALT: string;
		function Ed25519Keygen(): KeyStore;
		function HKDF(password: string): string;
		// Add any other functions exported by your WASM module here
		// For example:
		// function someOtherFunction(arg: number): boolean;
	}

	export namespace vault {
		//function Test(): string;
	}
}

//This empty export is necessary to make this a module
export {};
