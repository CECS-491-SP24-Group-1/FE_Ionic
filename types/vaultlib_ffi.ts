/**
 * Contains the built-in factory functions of every exported Go type.
 *
 * Example usage:
 * ```typescript
 * interface KeyStoreFunctions extends FFIFactories<KeyStore> {
 * 	new(): KeyStore; //This is the default constructor
 * }
 * ```
 */
export interface FFIFactories<T> {
	/** Deserializes a struct from GOB base64. */
	fromGob64(gob64: string): T;
	/** Deserializes a struct from JSON. */
	fromJson(json: string): T;

	/** Deserializes a struct from `localStorage` that was encoded using Gob64. */
	fromLStore(key: string): T;
	/** Deserializes a struct from `sessionStorage` that was encoded using Gob64. */
	fromSStore(key: string): T;

	/** Deserializes a struct from `localStorage` that was encoded using JSON. */
	fromJLStore(key: string): T;
	/** Deserializes a struct from `sessionStorage` that was encoded using JSON. */
	fromJSStore(key: string): T;
}

/**
 * Contains the built-methods of every exported Go type.
 */
export interface FFIMethods {
	/** Serializes a struct to GOB base64. */
	toGob64(): string;
	/** Serializes a struct to JSON. */
	toJson(): string;

	/** Checks if this object is equal to another. */
	equals<T extends FFIMethods>(other: T): boolean;
	/** Generates the SHA256 hash equivalent of this object via digesting its JSON. */
	hashcode(): string;
	/** Generates the string equivalent of this object. */
	toString(): string;

	/** Serializes a struct to `localStorage` using Gob64 encoding. */
	toLStore(key: string): void;
	/** Serializes a struct to `sessionStorage` using Gob64 encoding. */
	toSStore(key: string): void;

	/** Serializes a struct to `localStorage` using JSON encoding. */
	toJLStore(key: string): void;
	/** Serializes a struct to `sessionStorage` using JSON encoding. */
	toJSStore(key: string): void;
}
