package service

import (
	"github.com/google/uuid"

	"github.com/tiketin/backend/internal/dto"
	"github.com/tiketin/backend/internal/model"
	"github.com/tiketin/backend/internal/repository"
)

type EventService struct {
	eventRepo *repository.EventRepository
}

func NewEventService(eventRepo *repository.EventRepository) *EventService {
	return &EventService{eventRepo: eventRepo}
}

func (s *EventService) GetAll() ([]model.Event, error) {
	return s.eventRepo.FindAll()
}

func (s *EventService) GetByID(id string) (*model.Event, error) {
	return s.eventRepo.FindByID(id)
}

func (s *EventService) Create(req dto.CreateEventRequest) (*model.Event, error) {
	event := &model.Event{
		ID:          uuid.NewString(),
		Title:       req.Title,
		Description: req.Description,
		Location:    req.Location,
		Date:        req.Date,
		Price:       req.Price,
		Quota:       req.Quota,
		ImageURL:    req.ImageURL,
	}

	if err := s.eventRepo.Create(event); err != nil {
		return nil, err
	}
	return event, nil
}
