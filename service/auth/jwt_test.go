package auth

import (
	"testing"

	"github.com/leonardodf95/pa-e-agenda/types"
)

func TestCreateJWT(t *testing.T) {
	secret := []byte("secret")

	user := types.User{
		ID:    1,
		Name:  "Test Name",
		Email: "test@mail.com",
		Role:  1,
	}

	token, err := CreateJWT(secret, user)
	if err != nil {
		t.Errorf("error creating JWT: %v", err)
	}

	if token == "" {
		t.Error("expected token to be not empty")
	}
}
