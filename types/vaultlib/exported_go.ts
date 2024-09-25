export interface ExportedGo {
	fromGob64<T extends ExportedGo>(json: string): T; //Should be implemented as static
	fromJson<T extends ExportedGo>(json: string): T; //Should be implemented as static

	equals<T extends ExportedGo>(other: T): boolean;
	hashcode(): string;
	toString(): string;

	toGob64(): string;
	toJson(): string;
}
