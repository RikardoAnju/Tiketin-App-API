package repository

import (
	"database/sql"

	"github.com/tiketin/backend/internal/model"
)

type TicketRepository struct {
	db *sql.DB
}

func NewTicketRepository(db *sql.DB) *TicketRepository {
	return &TicketRepository{db: db}
}

func (r *TicketRepository) Create(t *model.Ticket) error {
	query := `INSERT INTO tickets (id, event_id, user_id, status, purchased_at)
		VALUES ($1, $2, $3, $4, now())`
	_, err := r.db.Exec(query, t.ID, t.EventID, t.UserID, t.Status)
	return err
}

func (r *TicketRepository) FindByUserID(userID string) ([]model.Ticket, error) {
	query := `SELECT id, event_id, user_id, status, purchased_at FROM tickets WHERE user_id = $1 ORDER BY purchased_at DESC`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tickets []model.Ticket
	for rows.Next() {
		var t model.Ticket
		if err := rows.Scan(&t.ID, &t.EventID, &t.UserID, &t.Status, &t.PurchasedAt); err != nil {
			return nil, err
		}
		tickets = append(tickets, t)
	}
	return tickets, nil
}
