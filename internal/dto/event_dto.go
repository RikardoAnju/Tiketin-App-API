package dto

import "time"

type CreateEventRequest struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Location    string    `json:"location"`
	Date        time.Time `json:"date"`
	Price       float64   `json:"price"`
	Quota       int       `json:"quota"`
	ImageURL    string    `json:"image_url"`
}
