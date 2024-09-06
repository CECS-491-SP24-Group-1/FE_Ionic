package tests

import (
	"fmt"
	"runtime"
	"testing"
)

func GetCallerFunctionName() string {
	pc, _, _, ok := runtime.Caller(1)
	if !ok {
		return "Unknown Caller"
	}
	fn := runtime.FuncForPC(pc)
	return fn.Name()
}

func TestGetCaller(t *testing.T) {
	fmt.Println("Caller function:", GetCallerFunctionName())
}
