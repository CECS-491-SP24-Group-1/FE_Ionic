package main

import (
	"fmt"

	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault"
)

func main() {
	uuid := util.MustNewUUID7()
	v := vault.New(uuid, "no_ident")

	fmt.Printf("v = %v\n", v)
	v.EncryptPassphrase("password")
}
