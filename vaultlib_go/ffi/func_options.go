package ffi

// Options used when adding methods, statics, and factories.
type FuncOpts struct {
	//Whether the incoming function list should be added onto the existing one or replace it.
	Append bool

	//Whether to replace an existing function if a name clash occurs.
	ReplaceExisting bool
}

// Returns the default options: append and replace existing.
func DefaultOpts() *FuncOpts {
	return &FuncOpts{
		Append:          true,
		ReplaceExisting: true,
	}
}

// Returns the options suitable for adding built-ins: append and do not replace existing.
func builtinOpts() *FuncOpts {
	return &FuncOpts{
		Append:          true,
		ReplaceExisting: false,
	}
}
