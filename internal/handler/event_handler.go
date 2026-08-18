package handler

import (
	"encoding/json"
	"net/http"

	"github.com/tiketin/backend/internal/dto"
	"github.com/tiketin/backend/internal/service"
	"github.com/tiketin/backend/pkg/response"
)

type EventHandler struct {
	eventService *service.EventService
}

func NewEventHandler(eventService *service.EventService) *EventHandler {
	return &EventHandler{eventService: eventService}
}

func (h *EventHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	events, err := h.eventService.GetAll()
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.JSON(w, http.StatusOK, events)
}

func (h *EventHandler) GetByID(w http.ResponseWriter, r *http.Request, id string) {
	event, err := h.eventService.GetByID(id)
	if err != nil {
		response.Error(w, http.StatusNotFound, "event not found")
		return
	}
	response.JSON(w, http.StatusOK, event)
}

func (h *EventHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req dto.CreateEventRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	event, err := h.eventService.Create(req)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.JSON(w, http.StatusCreated, event)
}
