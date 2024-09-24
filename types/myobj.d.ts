declare global {
	interface MyObject {
		// Getter and setter for foo
		get foo(): string;
		set foo(value: string);

		// Methods
		setFoo(value: string): void;
		getFoo(): string;
	}

	function NewMyObject(initialFoo?: string): MyObject;
}

export {};
