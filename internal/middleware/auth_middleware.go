package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/tiketin/backend/pkg/response"
	"github.com/tiketin/backend/pkg/utils"
)

type contextKey string

const userIDKey contextKey = "user_id"

func Auth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if header == "" || !strings.HasPrefix(header, "Bearer ") {
				response.Error(w, http.StatusUnauthorized, "missing or invalid authorization header")
				return
			}

			tokenString := strings.TrimPrefix(header, "Bearer ")
			claims, err := utils.ParseJWT(tokenString, jwtSecret)
			if err != nil {
				response.Error(w, http.StatusUnauthorized, "invalid token")
				return
			}

			userID, ok := claims["user_id"].(string)
			if !ok {
				response.Error(w, http.StatusUnauthorized, "invalid token claims")
				return
			}

			ctx := context.WithValue(r.Context(), userIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func UserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(userIDKey).(string)
	return userID, ok
}
