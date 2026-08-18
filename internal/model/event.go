package model

import "time"

type Event struct {
	ID          string    `json:"id" db:"id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Location    string    `json:"location" db:"location"`
	Date        time.Time `json:"date" db:"date"`
	Price       float64   `json:"price" db:"price"`
	Quota       int       `json:"quota" db:"quota"`
	ImageURL    string    `json:"image_url" db:"image_url"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
