package router

import (
	"net/http"

	"github.com/tiketin/backend/internal/config"
	"github.com/tiketin/backend/internal/handler"
	"github.com/tiketin/backend/internal/middleware"
)

type Handlers struct {
	Auth   *handler.AuthHandler
	Event  *handler.EventHandler
	Ticket *handler.TicketHandler
}

func New(cfg *config.Config, h Handlers) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	// Auth
	mux.HandleFunc("POST /api/v1/auth/register", h.Auth.Register)
	mux.HandleFunc("POST /api/v1/auth/login", h.Auth.Login)

	// Events
	mux.HandleFunc("GET /api/v1/events", h.Event.GetAll)
	mux.HandleFunc("GET /api/v1/events/{id}", func(w http.ResponseWriter, r *http.Request) {
		h.Event.GetByID(w, r, r.PathValue("id"))
	})
	mux.HandleFunc("POST /api/v1/events", h.Event.Create)

	// Tickets (protected)
	authMw := middleware.Auth(cfg.JWTSecret)
	mux.Handle("POST /api/v1/tickets", authMw(http.HandlerFunc(h.Ticket.Purchase)))
	mux.Handle("GET /api/v1/tickets", authMw(http.HandlerFunc(h.Ticket.GetMyTickets)))

	return middleware.CORS(mux)
}
