package main

import (
	"log"
	"net/http"

	"github.com/tiketin/backend/internal/config"
	"github.com/tiketin/backend/internal/handler"
	"github.com/tiketin/backend/internal/repository"
	"github.com/tiketin/backend/internal/router"
	"github.com/tiketin/backend/internal/service"
	"github.com/tiketin/backend/pkg/database"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	userRepo := repository.NewUserRepository(db)
	eventRepo := repository.NewEventRepository(db)
	ticketRepo := repository.NewTicketRepository(db)

	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	eventService := service.NewEventService(eventRepo)
	ticketService := service.NewTicketService(ticketRepo)

	handlers := router.Handlers{
		Auth:   handler.NewAuthHandler(authService),
		Event:  handler.NewEventHandler(eventService),
		Ticket: handler.NewTicketHandler(ticketService),
	}

	r := router.New(cfg, handlers)

	log.Printf("server listening on :%s", cfg.AppPort)
	if err := http.ListenAndServe(":"+cfg.AppPort, r); err != nil {
		log.Fatal(err)
	}
}
