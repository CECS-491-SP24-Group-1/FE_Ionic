//go:build js && wasm

package ffiexample

// User represents a user with various fields.
type User struct {
	// Basic user fields
	ID        int
	FirstName string
	LastName  string
	Email     string
	Age       int

	// Embedded struct for address information
	Address Address

	// Slice of strings for hobbies
	Hobbies []string

	// Slice of integers for favorite numbers
	FavoriteNumbers []int

	// Slice of custom structs for social media accounts
	SocialMediaAccounts []SocialMediaAccount
}

// Address represents the user's address details.
type Address struct {
	Street  string
	City    string
	State   string
	ZipCode uint
}

// SocialMediaAccount represents a user's social media account details.
type SocialMediaAccount struct {
	Platform string // e.g., "Facebook", "Twitter"
	Username string // Username on the platform
}

// Creates a default user object.
func DefaultUser() User {
	//Create social media accounts
	sma1 := SocialMediaAccount{
		Platform: "Instagram",
		Username: "jdoe",
	}
	sma2 := SocialMediaAccount{
		Platform: "Twitter",
		Username: "jdoe123",
	}
	sma3 := SocialMediaAccount{
		Platform: "TikTok",
		Username: "mynamejohn",
	}

	//Create an address
	addr := Address{
		Street:  "123 No Name Lane",
		City:    "Nowhereville",
		State:   "Nobodyfornia",
		ZipCode: 12345,
	}

	//Create the user
	user := User{
		ID:        123456,
		FirstName: "John",
		LastName:  "Doe",
		Email:     "jdoe@example.com",
		Age:       21,

		Address: addr,

		Hobbies:             []string{"gaming", "watching Netflix", "sleeping", "playing Genshin Impact"},
		FavoriteNumbers:     []int{21, 69, 420, 1337, 32767},
		SocialMediaAccounts: []SocialMediaAccount{sma1, sma2, sma3},
	}
	return user
}
