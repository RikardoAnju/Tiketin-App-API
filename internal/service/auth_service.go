package service

import (
	"errors"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/tiketin/backend/internal/dto"
	"github.com/tiketin/backend/internal/model"
	"github.com/tiketin/backend/internal/repository"
	"github.com/tiketin/backend/pkg/utils"
)

type AuthService struct {
	userRepo  *repository.UserRepository
	jwtSecret string
}

func NewAuthService(userRepo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{userRepo: userRepo, jwtSecret: jwtSecret}
}

func (s *AuthService) Register(req dto.RegisterRequest) (*dto.AuthResponse, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		ID:       uuid.NewString(),
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashed),
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	token, err := utils.GenerateJWT(user.ID, s.jwtSecret)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{Token: token}, nil
}

func (s *AuthService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	token, err := utils.GenerateJWT(user.ID, s.jwtSecret)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{Token: token}, nil
}
