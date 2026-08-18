package model

import "time"

type TicketStatus string

const (
	TicketStatusPending  TicketStatus = "pending"
	TicketStatusPaid     TicketStatus = "paid"
	TicketStatusCanceled TicketStatus = "canceled"
)

type Ticket struct {
	ID          string       `json:"id" db:"id"`
	EventID     string       `json:"event_id" db:"event_id"`
	UserID      string       `json:"user_id" db:"user_id"`
	Status      TicketStatus `json:"status" db:"status"`
	PurchasedAt time.Time    `json:"purchased_at" db:"purchased_at"`
}
