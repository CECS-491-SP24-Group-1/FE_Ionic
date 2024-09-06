package main

import (
	"fmt"

	"wraith.me/vaultlib/vaultlib/vault"
)

func main(){
	fmt.Println("heelo")
	v := vault.Vault{}
	fmt.Printf("v = %v\n", v)
}