//go:build js && wasm

package ffi

import (
	"fmt"
	"syscall/js"

	"wraith.me/vaultlib/vaultlib/io"
)

// GenericFunc represents any function type.
type GenericFunc interface{}

// FuncWrapper wraps a function with its name and type information.
type FWrapper[T any] struct {
	Name string
	Func GenericFunc
	Type FuncType
}

// FuncType represents different function types.
type FuncType int

const (
	FactoryFunc FuncType = iota
	GetterFunc
	SetterFunc
	MethodFunc
	StaticFunc
)

// NewFunc creates a new FuncWrapper.
func NewFunc[T any](name string, f GenericFunc, funcType FuncType) FWrapper[T] {
	return FWrapper[T]{
		Name: name,
		Func: f,
		Type: funcType,
	}
}

// Type-specific function signatures.
type (
	// Defines the expected structure of a constructor or static factory function.
	Factory[T any] func([]js.Value) (*T, error)

	// Defines the expected structure of a getter function.
	Getter[T any] func(*T) (js.Value, error)

	// Defines the expected structure of a setter function.
	Setter[T any] func(*T, js.Value) error

	// Defines the expected structure of an instance function, aka: a method.
	Method[T any] func(*T, js.Value, []js.Value) (js.Value, error)

	// Defines the expected structure of a static function.
	Static[T any] func([]js.Value) (js.Value, error)
)

// Helper functions to create specific function wrappers.

// Creates a new factory function wrapper with name `n`.
func NewFactory[T any](n string, f Factory[T]) FWrapper[T] {
	fname := n
	if fname == "" {
		fname = io.GetFunctionName(f)
	}
	return NewFunc[T](fname, f, FactoryFunc)
}

// Creates a new getter function wrapper with name `n`.
func NewGetter[T any](n string, f Getter[T]) FWrapper[T] {
	fname := n
	if fname == "" {
		fname = io.GetFunctionName(f)
	}
	return NewFunc[T](fname, f, GetterFunc)
}

// Creates a new setter function wrapper with name `n`.
func NewSetter[T any](n string, f Setter[T]) FWrapper[T] {
	fname := n
	if fname == "" {
		fname = io.GetFunctionName(f)
	}
	return NewFunc[T](fname, f, SetterFunc)
}

// Creates a new method function wrapper with name `n`.
func NewMethod[T any](n string, f Method[T]) FWrapper[T] {
	fname := n
	if fname == "" {
		fname = io.GetFunctionName(f)
	}
	return NewFunc[T](fname, f, MethodFunc)
}

// Creates a new static function wrapper with name `n`.
func NewStatic[T any](n string, f Static[T]) FWrapper[T] {
	fname := n
	if fname == "" {
		fname = io.GetFunctionName(f)
	}
	return NewFunc[T](fname, f, StaticFunc)
}

// CallFactory calls a factory function.
func (fw FWrapper[T]) CallFactory(args []js.Value) (*T, error) {
	if fw.Type != FactoryFunc {
		return nil, fmt.Errorf("expected FactoryFunc, got %v", fw.Type)
	}

	if f, ok := fw.Func.(Factory[T]); ok {
		return f(args)
	}

	return nil, fmt.Errorf("invalid factory function")
}

// CallGetter calls a getter function.
func (fw FWrapper[T]) CallGetter(instance *T) (js.Value, error) {
	if fw.Type != GetterFunc {
		return js.Undefined(), fmt.Errorf("expected GetterFunc, got %v", fw.Type)
	}

	if g, ok := fw.Func.(Getter[T]); ok {
		return g(instance)
	}

	return js.Undefined(), fmt.Errorf("invalid getter function")
}

// CallSetter calls a setter function.
func (fw FWrapper[T]) CallSetter(instance *T, value js.Value) error {
	if fw.Type != SetterFunc {
		return fmt.Errorf("expected SetterFunc, got %v", fw.Type)
	}

	if s, ok := fw.Func.(Setter[T]); ok {
		return s(instance, value)
	}

	return fmt.Errorf("invalid setter function")
}

// CallMethod calls a method function.
func (fw FWrapper[T]) CallMethod(instance *T, this js.Value, args []js.Value) (js.Value, error) {
	if fw.Type != MethodFunc {
		return js.Undefined(), fmt.Errorf("expected MethodFunc, got %v", fw.Type)
	}

	if m, ok := fw.Func.(Method[T]); ok {
		return m(instance, this, args)
	}

	return js.Undefined(), fmt.Errorf("invalid method function")
}

// CallStatic calls a static function.
func (fw FWrapper[T]) CallStatic(args []js.Value) (js.Value, error) {
	if fw.Type != StaticFunc {
		return js.Undefined(), fmt.Errorf("expected StaticFunc, got %v", fw.Type)
	}

	if m, ok := fw.Func.(Static[T]); ok {
		return m(args)
	}

	return js.Undefined(), fmt.Errorf("invalid static function")
}
