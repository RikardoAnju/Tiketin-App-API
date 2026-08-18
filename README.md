# Tiketin Backend

Go REST API for the Tiketin ticketing app.

## Structure

```
backend/
  cmd/api/           entrypoint (main.go)
  internal/
    config/           env config loading
    model/            db entities
    dto/              request/response payloads
    repository/       data access (database/sql)
    service/          business logic
    handler/          HTTP handlers
    middleware/        auth (JWT) and CORS
    router/           route registration
  pkg/
    database/         db connection helper
    response/         JSON response helpers
    utils/            JWT helpers
  migrations/         SQL schema migrations
```

## Getting started

```bash
cp .env.example .env
go run ./cmd/api
```

Server starts on `:8080` (configurable via `APP_PORT`).

## Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET  /api/v1/events`
- `GET  /api/v1/events/{id}`
- `POST /api/v1/events`
- `POST /api/v1/tickets` (auth required)
- `GET  /api/v1/tickets` (auth required)
