//go:build js && wasm

package jsutil

import "syscall/js"

// Storage represents a Web Storage object (either localStorage or sessionStorage).
// See: https://html.spec.whatwg.org/multipage/webstorage.html#the-storage-interface
type Storage struct {
	jsStorage js.Value
}

// NewLocalStorage creates and returns a new Storage instance for localStorage.
func NewLocalStorage() *Storage {
	return &Storage{jsStorage: getLocalstorage()}
}

// NewSessionStorage creates and returns a new Storage instance for sessionStorage.
func NewSessionStorage() *Storage {
	return &Storage{jsStorage: getSessionstorage()}
}

// Tests if the selected web storage API can be used to persist data.
func (s *Storage) CanStore() bool {
	//Undefined or nil stores cannot store data
	if s.jsStorage.IsUndefined() || s.jsStorage.IsNull() {
		return false
	}

	//Create test data
	testKey := "__storage_test__"
	testValue := "test"

	//Store the test item and defer its removal
	s.Set(testKey, testValue)
	defer func() {
		s.Remove(testKey)
	}()

	//Ensure the item that was stored actually exists
	result := s.jsStorage.Call("getItem", testKey)
	if result.IsNull() {
		return false
	}
	return result.String() == testValue
}

// Clear removes all key/value pairs from the storage.
func (s *Storage) Clear() {
	s.jsStorage.Call("clear")
}

// GetItem returns the current value associated with the given key.
// If the given key does not exist, an empty string is returned.
func (s *Storage) Get(key string) string {
	obj := s.jsStorage.Call("getItem", key)
	if obj.IsNull() {
		return ""
	}
	return obj.String()
}

// HasItem checks if an item with the given key exists in the storage.
// It returns true if the item exists, and false otherwise.
func (s *Storage) Has(key string) bool {
	return !s.jsStorage.Call("getItem", key).IsNull()
}

// Length returns the number of key/value pairs currently present in the storage.
func (s *Storage) Length() int {
	return s.jsStorage.Get("length").Int()
}

// RemoveItem removes the key/value pair with the given key from the storage.
func (s *Storage) Remove(key string) {
	s.jsStorage.Call("removeItem", key)
}

// SetItem sets the value of the pair identified by key to value.
func (s *Storage) Set(key, value string) {
	s.jsStorage.Call("setItem", key, value)
}

//
//-- Private utilities
//

// Gets the localStorage API from the browser.
func getLocalstorage() js.Value {
	return getWebStorageBackend("localStorage")
}

// Gets the sessionStorage API from the browser.
func getSessionstorage() js.Value {
	return getWebStorageBackend("localStorage")
}

// Gets the specified API for webStorage.
func getWebStorageBackend(key string) js.Value {
	//Try accessing directly first
	global := js.Global()
	if HasProperty(global, key) {
		return global.Get(key)
	}

	//Fallback to `window.`
	return global.Get("window").Get(key)
}
