package main

import (
	"fmt"

	"wraith.me/vaultlib/vaultlib/util"
	"wraith.me/vaultlib/vaultlib/vault"
)

func main() {
	uuid := util.MustNewUUID7()
	v := vault.New(uuid, "no_ident")

	fmt.Printf("v = %s\n\n", v)
	ev, _ := v.EncryptPassphrase("password")

	g, _ := ev.Gob()
	j, _ := ev.JSON()
	fmt.Printf("gob: %s\n\n", g)
	fmt.Printf("json: %s\n\n", j)

	v2, _ := vault.EVaultFromGob(g)
	fmt.Printf("v = %s\n\n", v2)
}
