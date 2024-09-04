declare global {
	function ed25519Keygen(): string;
	// Add any other functions exported by your WASM module here
	// For example:
	// function someOtherFunction(arg: number): boolean;
}

//This empty export is necessary to make this a module
export {};