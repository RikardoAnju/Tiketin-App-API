package repository

import (
	"database/sql"

	"github.com/tiketin/backend/internal/model"
)

type EventRepository struct {
	db *sql.DB
}

func NewEventRepository(db *sql.DB) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) FindAll() ([]model.Event, error) {
	query := `SELECT id, title, description, location, date, price, quota, image_url, created_at, updated_at FROM events ORDER BY date ASC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []model.Event
	for rows.Next() {
		var e model.Event
		if err := rows.Scan(&e.ID, &e.Title, &e.Description, &e.Location, &e.Date, &e.Price, &e.Quota, &e.ImageURL, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	return events, nil
}

func (r *EventRepository) FindByID(id string) (*model.Event, error) {
	query := `SELECT id, title, description, location, date, price, quota, image_url, created_at, updated_at FROM events WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var e model.Event
	if err := row.Scan(&e.ID, &e.Title, &e.Description, &e.Location, &e.Date, &e.Price, &e.Quota, &e.ImageURL, &e.CreatedAt, &e.UpdatedAt); err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *EventRepository) Create(e *model.Event) error {
	query := `INSERT INTO events (id, title, description, location, date, price, quota, image_url, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), now())`
	_, err := r.db.Exec(query, e.ID, e.Title, e.Description, e.Location, e.Date, e.Price, e.Quota, e.ImageURL)
	return err
}
