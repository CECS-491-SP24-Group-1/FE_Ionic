package main

import (
	"fmt"

	"wraith.me/vaultlib/vaultlib/vault"
)

func main() {
	/*
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
	*/

	testVault()
}

func testVault() {
	evaultStr := "Y/+TAwEBBkVWYXVsdAH/lAABBwECSUQB/4IAAQdTdWJqZWN0Af+CAAEESGFzaAEMAAEHU2VjVHlwZQEEAAEEU2FsdAEMAAELUGF5bG9hZFNpemUBBgABB1BheWxvYWQBCgAAABD/gQYBAQRVVUlEAf+CAAAAEP+RBgEBBFVVSUQB/5IAAAD+A2//lAEQAZL4wxa2cACE7ZfdW+B8KwEQAZL4wx8uesyDHwnsPMuxAwFANzcwMjkxOTI1MjY4NzQ2N2U5YjIxOWRlNGI4MzczMWE3NTMyNDFhNDFkM2I2NzIzMjJmNWY1ZWM4YWExNzI3ZAEEARhFTFlRTEFYUTFxcnN2aEpIZ0pqeEJ3PT0B/gLiAf4C4rRpdPVq8eITAlWsHsqwo4VPuJ2SK2HxK5a/dVmijJC1DIDz/jh+vQ/vWaQ3nCjgr9PtwEsljAKsyFiat8vtKmhUvkHO7IYJQnHpGelu0omCeHQtDI6JufcS/B2XISpQXo9W191ehtfJtma6oSs8h/YsSGB7EVUJ4EY2szv+jHZJSCNtQ4SFjwxes/HWS03JM5jIncOt04eENemDyvpUNJQihZ5vPRCiD9kpBCTWdLdr4WqP5YETEWlaelmKc/c8hP0+yrDbQ7z5UCRx7J9BrgwMx6czzzqDrdR2bvCfXBU0gaMqISqd+dnrr7udFp4u4B/ho+56pvA5CUb5/wqBGfBacz+gxXuq03xSalcOTBVZNpHfKRyzsKEJTIyb5NRqTay0ex6hsL8IQLTkIYD7YJ0a2GTgMRF7UV0ei9oW6n0ZfvF/mB2nYBHgXad5S0CUBJ2XlyvLVUvyssjqRxGFPLZDkP2rm/WzWgSeCW42VxJAWQM+3NuHCay37hxPGCRdziM/ddpGG0WWlwmp3gSTwwjugdord9uodU5c03mMJQw9WJLv+RHv7/MfiMrMpNyNZ0pLPwuknyUe0GxwCpL+P74F4wzSt6OfUwcUVkhycrnPhalOL6KDVe99J9G0xuR3Dn6e8x/cyYnH6L3fOCuZMtc6Md2JtEXB0qEaWZDrSnI1YLrD3gejvoNG6qsMf0uh4Eztq81FqZSWVlubHDTDfRcrOjyv0Jakg9i7cney/ZbmgHE6iuDoW4fdVtai1jLuwarraK7EPRWAC+bBJ4qg26cIuEJnzCuphyVqXPBP2h1sgr5xs56eU6SkOs3WQEZNHcdRxKR+0h3k7kVWmAZqDL+Iz6WUTcTj6KmbVF3ygeueTqaX/xib6xY4bZ+E3i9yG+PLBvbJbUj/rGG3TIlXv1OCCYUwI8TJnFvax9hP50uTAgEz9jX8hA9jO5agNzNf2g0CZaGQMJcUYuqqPgFeWMx0BAA="

	evault, err := vault.EVaultFromGob(evaultStr)
	if err != nil {
		panic(err)
	}

	vault, err := evault.DecryptPassphrase("12345")
	if err != nil {
		panic(err)
	}

	fmt.Println(vault.String())
}
