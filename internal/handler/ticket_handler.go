package handler

import (
	"encoding/json"
	"net/http"

	"github.com/tiketin/backend/internal/dto"
	"github.com/tiketin/backend/internal/middleware"
	"github.com/tiketin/backend/internal/service"
	"github.com/tiketin/backend/pkg/response"
)

type TicketHandler struct {
	ticketService *service.TicketService
}

func NewTicketHandler(ticketService *service.TicketService) *TicketHandler {
	return &TicketHandler{ticketService: ticketService}
}

func (h *TicketHandler) Purchase(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req dto.PurchaseTicketRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	ticket, err := h.ticketService.Purchase(userID, req)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusCreated, ticket)
}

func (h *TicketHandler) GetMyTickets(w http.ResponseWriter, r *http.Request) {
	userID, ok := middleware.UserIDFromContext(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	tickets, err := h.ticketService.GetMyTickets(userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, tickets)
}
