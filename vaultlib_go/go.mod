module wraith.me/vaultlib

go 1.21.0

toolchain go1.21.1

require wraith.me/message_server v0.0.0

require (
	github.com/norunners/vert v0.0.0-20221203075838-106a353d42dd // indirect
	golang.org/x/crypto v0.26.0 // indirect
)

replace wraith.me/message_server v0.0.0 => "../../SMS/message_server"