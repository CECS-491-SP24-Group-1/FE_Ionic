package io

import (
	"crypto/sha256"
	"encoding/hex"
	"reflect"
	"regexp"
	"runtime"
	"strings"
)

// Calculates the SHA256 hash of a string.
func DigestString(s string) string {
	sum := sha256.Sum256([]byte(s))
	return hex.EncodeToString(sum[:])
}

// Gets the name of a function.
func GetFunctionName(f interface{}) string {
	//Get the name of the target function, sans the package
	pc := reflect.ValueOf(f).Pointer()
	parts := strings.Split(runtime.FuncForPC(pc).Name(), ".")
	fname := parts[len(parts)-1]
	return fname
}

/*
Checks if 2 slices have the same underlying array. See:
https://www.willem.dev/code-snippets/check-slices-share-same-backing-array/
*/
func SameUnderlyingArray[T any](s1, s2 []T) bool {
	//Get the capacities of both arrays
	cap1 := cap(s1)
	cap2 := cap(s2)

	//nil slices will never have the same array
	if cap1 == 0 || cap2 == 0 {
		return false
	}

	//Compare the address of the last element in each backing array
	return &s1[0:cap1][cap1-1] == &s2[0:cap2][cap2-1]
}

// Checks if a string is valid base64.
func ValidB64(str string) bool {
	//Define the regex pattern for Base64 validation
	base64Regex := `^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$`

	//Compile the regex
	re := regexp.MustCompile(base64Regex)

	//Test the string against the regex
	return re.MatchString(str)
}
