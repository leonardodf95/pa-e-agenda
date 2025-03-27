package auth

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/leonardodf95/pa-e-agenda/config"
	"github.com/leonardodf95/pa-e-agenda/types"
	"github.com/leonardodf95/pa-e-agenda/utils"
)

const UserContextKey = types.ContextKey("user")

func CreateJWT(secret []byte, user types.User) (string, error) {
	expiration := time.Second * time.Duration(config.Envs.JWTExpiration)

	tokenFb := *user.Token

	role := *user.Role

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":        user.ID,
		"email":     user.Email,
		"name":      user.Name,
		"role":      role,
		"token":     tokenFb,
		"expiredAt": expiration,
	})

	tokenString, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func WithJWTAuth(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := getTokenFromRequest(r)

		if tokenString == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		token, err := validateToken(tokenString)
		if err != nil {
			log.Printf("error validating token: %v", err)
			PermissionDenied(w)
			return
		}

		if !token.Valid {
			log.Printf("invalid token")
			PermissionDenied(w)
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		role := int64(claims["role"].(float64))
		if role == 0 {
			PermissionDenied(w)
			return
		}
		tokenFb := claims["token"].(string)

		user := types.UserPayloadAuth{
			ID:    int(claims["id"].(float64)),
			Name:  claims["name"].(string),
			Email: claims["email"].(string),
			Role:  role,
			Token: tokenFb,
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, UserContextKey, user)

		r = r.WithContext(ctx)

		handler(w, r)
	}
}

func getTokenFromRequest(r *http.Request) string {
	tokenAuth := r.Header.Get("Authorization")

	if tokenAuth == "" {
		return ""
	}

	splitToken := strings.Split(tokenAuth, "Bearer ")
	if len(splitToken) != 2 {
		return ""
	}

	return strings.TrimSpace(splitToken[1])
}

func validateToken(t string) (*jwt.Token, error) {
	return jwt.Parse(t, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}

		return []byte(config.Envs.JWTSecret), nil
	})
}

func PermissionDenied(w http.ResponseWriter) {
	utils.WriteError(w, http.StatusForbidden, fmt.Errorf("permission denied"))
}

func GetUserFromContext(ctx context.Context) types.UserPayloadAuth {
	user, ok := ctx.Value(UserContextKey).(types.UserPayloadAuth)
	if !ok {
		return types.UserPayloadAuth{}
	}

	return user
}
