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
	fromGob64(gob64: string): T;
	fromJson(json: string): T;

	fromLStore(key: string): string;
}

/**
 * Contains the built-methods of every exported Go type.
 */
export interface FFIMethods {
	toGob64(): string;
	toJson(): string;

	equals<T extends FFIMethods>(other: T): boolean;
	hashcode(): string;
	toString(): string;
}
