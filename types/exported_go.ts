/**
 * Contains the built-in factory functions of every exported Go type.
 *
 * Example usage:
 * ```typescript
 * interface KeyStoreFunctions extends FactoryFuncs<KeyStore> {
 * 	new(): KeyStore; //This is the default constructor
 * }
 * ```
 */
export interface FactoryFuncs<T> {
	fromGob64(json: string): T;
	fromJson(json: string): T;
}

/**
 * Contains the built-methods of every exported Go type.
 */
export interface ExportedGo {
	equals<T extends ExportedGo>(other: T): boolean;
	hashcode(): string;
	toString(): string;

	toGob64(): string;
	toJson(): string;
}
