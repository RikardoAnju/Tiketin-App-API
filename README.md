# Tiketin Backend API

Next.js API backend for the Tiketin ticketing app, using Prisma ORM against a Supabase PostgreSQL database.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Create `.env` (used by Prisma for database connections):
```
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:5432/postgres"
```

Create `.env.local` (used by the app at runtime):
```
JWT_SECRET=your_jwt_secret_here
```

Both connection strings are found in Supabase: **Settings → Database → Connection string**. `DATABASE_URL` is the pooled connection (used at runtime); `DIRECT_URL` is the direct connection (used only by Prisma Migrate).

### 3. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the API dashboard.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (protected)
- `GET /api/events/[id]` - Get event by ID

### Tickets
- `GET /api/tickets` - Get user's tickets (protected)
- `POST /api/tickets` - Purchase ticket (protected)

### Health Check
- `GET /api/health` - Health check

---

## 🗄️ Database & Migrations

Schema is defined in `prisma/schema.prisma` and managed by Prisma Migrate — no manual SQL needed.

To change the schema:
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate + apply a new migration
npx prisma migrate dev --name describe_your_change
```

This auto-generates a versioned SQL file in `prisma/migrations/` and applies it to the database.

---

## 🚢 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Your message"
git push origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Click "New Project" → import this GitHub repository
3. Set environment variables in Vercel dashboard (Project Settings → Environment Variables):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
4. Click "Deploy"

Vercel runs `prisma generate` automatically via the `postinstall` hook. Migrations are NOT run automatically on deploy — run `npx prisma migrate deploy` manually (or via CI) against production whenever the schema changes.

Your backend is now live! 🎉

---

## 📱 Flutter Integration

Update your Flutter API base URL:

```dart
const String API_URL = "https://your-vercel-url.vercel.app";
```

---

## 🔑 Authentication Flow

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "data": {
    "token": "eyJhbGc..."
  }
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Using Token
```bash
GET /api/tickets
Authorization: Bearer eyJhbGc...
```

---

## 📊 Project Structure

```
app/
└── api/                      Routes (thin, delegate to controllers)
    ├── auth/{register,login}/route.ts
    ├── events/{route.ts, [id]/route.ts}
    ├── tickets/route.ts
    └── health/route.ts

src/
├── controllers/              Parse request, format response
├── services/                 Business logic
├── repositories/             Prisma queries
├── middleware/                Auth check (JWT)
├── validators/                 Zod schemas
├── utils/                      jwt, response helpers, prisma client
├── types/                      Shared TypeScript types
└── generated/prisma/          Auto-generated Prisma Client (gitignored)

prisma/
├── schema.prisma              Data model
└── migrations/                 Versioned SQL migrations
```

---

## 🔧 Tech Stack

- **Framework**: Next.js 16
- **ORM**: Prisma 7 (with `@prisma/adapter-pg` driver adapter)
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + Bcrypt
- **Validation**: Zod
- **Deployment**: Vercel (FREE)
- **Language**: TypeScript

---

## 📝 Environment Variables

| Variable | File | Description |
|----------|------|-------------|
| `DATABASE_URL` | `.env` | Pooled Postgres connection (runtime queries) |
| `DIRECT_URL` | `.env` | Direct Postgres connection (Prisma Migrate only) |
| `JWT_SECRET` | `.env.local` | Secret for JWT signing |

---

## 🎯 Cost

- **Vercel**: FREE (unlimited requests, 100GB bandwidth)
- **Supabase**: FREE tier (500K requests/month, 1GB storage)

**Total Monthly Cost**: $0 ✅

---

## 📞 Support

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Supabase Docs: https://supabase.com/docs
