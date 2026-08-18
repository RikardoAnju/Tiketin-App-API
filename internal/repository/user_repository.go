package repository

import (
	"database/sql"

	"github.com/tiketin/backend/internal/model"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *model.User) error {
	query := `INSERT INTO users (id, name, email, password, created_at, updated_at)
		VALUES ($1, $2, $3, $4, now(), now())`
	_, err := r.db.Exec(query, user.ID, user.Name, user.Email, user.Password)
	return err
}

func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	query := `SELECT id, name, email, password, created_at, updated_at FROM users WHERE email = $1`
	row := r.db.QueryRow(query, email)

	var user model.User
	if err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt); err != nil {
		return nil, err
	}
	return &user, nil
}
