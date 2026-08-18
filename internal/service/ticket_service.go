package service

import (
	"github.com/google/uuid"

	"github.com/tiketin/backend/internal/dto"
	"github.com/tiketin/backend/internal/model"
	"github.com/tiketin/backend/internal/repository"
)

type TicketService struct {
	ticketRepo *repository.TicketRepository
}

func NewTicketService(ticketRepo *repository.TicketRepository) *TicketService {
	return &TicketService{ticketRepo: ticketRepo}
}

func (s *TicketService) Purchase(userID string, req dto.PurchaseTicketRequest) (*model.Ticket, error) {
	ticket := &model.Ticket{
		ID:      uuid.NewString(),
		EventID: req.EventID,
		UserID:  userID,
		Status:  model.TicketStatusPending,
	}

	if err := s.ticketRepo.Create(ticket); err != nil {
		return nil, err
	}
	return ticket, nil
}

func (s *TicketService) GetMyTickets(userID string) ([]model.Ticket, error) {
	return s.ticketRepo.FindByUserID(userID)
}
