package handler

import (
	"encoding/json"
	"net/http"

	"github.com/tiketin/backend/internal/dto"
	"github.com/tiketin/backend/internal/service"
	"github.com/tiketin/backend/pkg/response"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req dto.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	result, err := h.authService.Register(req)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusCreated, result)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	result, err := h.authService.Login(req)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, result)
}
