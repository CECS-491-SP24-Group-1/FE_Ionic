package tests

import (
	"fmt"
	"reflect"
	"runtime"
	"strings"
	"testing"

	"wraith.me/vaultlib/vaultlib/crypto"
)

func TestGetName(t *testing.T) {
	fmt.Println("Function name:", GetFunctionName(crypto.HKDF))
}

func GetFunctionName(f interface{}) string {
	pc := reflect.ValueOf(f).Pointer()
	parts := strings.Split(runtime.FuncForPC(pc).Name(), ".")
	return parts[len(parts)-1]
}
