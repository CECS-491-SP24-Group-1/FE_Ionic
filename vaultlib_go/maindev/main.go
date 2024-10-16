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
	evaultStr := "Wv+NAwEBBkVWYXVsdAH/jgABBgECSUQB/4IAAQdTdWJqZWN0Af+CAAEHU2VjVHlwZQEEAAEEU2FsdAEMAAELUGF5bG9hZFNpemUBBgABB1BheWxvYWQBCgAAABD/gQYBAQRVVUlEAf+CAAAAEP+LBgEBBFVVSUQB/4wAAAD+Aor/jgEQAZKTDcS3cAGR+ebfw7uyeQEQAZKTDc4rcm2GvCB3C4FQ/AEEARg3RTRnSm9wNW14MUQzSWRWL3EvSDN3PT0B/gI/Af4CP6qrc8seEvvHbollqzhUd0n219FSn9j0NZqL85AdbULQupc/EY/iaAR8bP1Gi7XlMcuy5l6xmsW3qshJM1sW555chPIdOoVdXA8qrFhM/caWYu0Ofu3pnf9zh1vHyxu692ktY5CFM4cAY4g/T86dKjSi8UqmbAbjIO7VwkfPfT/v/MUvA4F3hUAvrtgcMBY9lnUdHL5VsnZ24yMnGXtUUW5C6K34IdDnXIbdT8E2G/51r1nOk/726wqTIAI9h9MAV4ufcpJrOhE3N1vuFDA7leIwDdExCAp3Vwkh0FOiYmqAK/YerhAJp+C7GLiQWfFeoYh/oKkiQ0N3D7OGUqmUUJVe/kr95ETdJINtEVP6CwChDvlowUyL95Udhlx4fQiRNiCR8oE5snBYWLtOy6Z7RhdqF6LZHvC5wceJ06DukHrqRa1ybezBO/7bylYRJ7DwqLKRIj61eXvLgj4GafB1YF/Sh93nY71oiujvzQCYWbBDrmBPb3AiazV+B15txm13yEvLe++lu+5kLvruHybrKPGHM3MXP+jDGnPySVwa1yEEN/CAAKIwc1R3WpWRM0a77qbvwQn79L5SaWkdbSigKQcZKKGwHzB0C90V/Ik1h1dF19FiR5dpSetyf1ZLP6SBttKgPVJisoA3Cm+OsF/KsaxtQgvTcMDl/yuD/09sFwvHb41LgjsG9jIzW348eWvV1UdEgJojscovg7+fiL4Z2WzBU8IE0gVIxs5mdfAEyoVG+QcTuS9ZjS4ZFQeBiLHBAA=="

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
