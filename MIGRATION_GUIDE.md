# Migration Guide: Go → Next.js

## 🎯 Summary of Changes

| Aspect | Go | Next.js |
|--------|----|----|
| **Framework** | Standard Go net/http | Next.js 14 |
| **Routing** | Mux (HTTP handler) | File-based routing |
| **Database** | Custom repository pattern | Supabase client |
| **Authentication** | JWT + Bcrypt | JWT + Bcryptjs |
| **Validation** | Manual error handling | Zod schemas |
| **Deployment** | Railway/Oracle VPS | Vercel (FREE) |
| **Development** | `go run cmd/api/main.go` | `npm run dev` |

---

## 📂 Folder Structure Mapping

### Go Structure
```
backend/
├── cmd/api/main.go
├── internal/
│   ├── config/
│   ├── dto/
│   ├── handler/
│   ├── middleware/
│   ├── model/
│   ├── repository/
│   ├── router/
│   └── service/
├── pkg/
│   ├── database/
│   ├── response/
│   └── utils/
```

### Next.js Structure
```
nextjs-version/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── events/
│   │   └── tickets/
│   ├── page.tsx
│   └── layout.tsx
├── lib/
│   ├── supabase.ts (replaces database.go)
│   ├── jwt.ts (replaces utils/jwt.go)
│   ├── validation.ts (replaces dto/)
│   ├── response.ts (replaces pkg/response/)
│   └── types.ts (replaces internal/model/)
```

---

## 🔄 Code Migration Examples

### 1. HTTP Handlers

#### Go
```go
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
    var req dto.RegisterRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "invalid request")
        return
    }
    // ... handler logic
    response.JSON(w, http.StatusCreated, result)
}
```

#### Next.js
```typescript
export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
        return errorResponse(parsed.error.errors[0].message, 400);
    }
    // ... handler logic
    return successResponse(result, 201);
}
```

---

### 2. Database Access

#### Go
```go
func (r *UserRepository) Create(user *model.User) error {
    query := `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)`
    _, err := r.db.Exec(query, user.ID, user.Name, user.Email, user.Password)
    return err
}
```

#### Next.js
```typescript
const { error } = await supabaseAdmin
    .from("users")
    .insert({
        id: userId,
        name: user.name,
        email: user.email,
        password: hashedPassword,
    });
```

---

### 3. Validation

#### Go
```go
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
    var req dto.RegisterRequest
    if req.Email == "" {
        response.Error(w, http.StatusBadRequest, "email required")
        return
    }
    // Manual validation...
}
```

#### Next.js
```typescript
const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    name: z.string().min(3, "Name too short"),
});

const parsed = registerSchema.safeParse(body);
if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, 400);
}
```

---

### 4. Middleware

#### Go
```go
func Auth(secret string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            token := r.Header.Get("Authorization")
            // verify token logic
            next.ServeHTTP(w, r)
        })
    }
}
```

#### Next.js
```typescript
export function authMiddleware(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = verifyToken(token);
    return { userId: payload.userId, email: payload.email };
}
```

---

## 📦 Dependencies Mapping

| Go Package | Next.js Package |
|-----------|-----------------|
| `crypto/bcrypt` | `bcryptjs` |
| `github.com/golang-jwt/jwt` | `jsonwebtoken` |
| `github.com/google/uuid` | `uuid` |
| Custom response helpers | `nextjs/server` |
| Zod (added) | `zod` |

---

## 🔑 Key Differences

### 1. **Error Handling**
- Go: Return `error` explicitly
- Next.js: Throw or return error response

### 2. **Type Safety**
- Go: Type structs
- Next.js: TypeScript + Zod schemas

### 3. **Database**
- Go: Custom SQL queries
- Next.js: Supabase SDK (abstracts SQL)

### 4. **Async Operations**
- Go: Goroutines + channels
- Next.js: Async/await

### 5. **Routing**
- Go: Handler functions + mux
- Next.js: File-based API routes (`app/api/...`)

---

## 🚀 Deployment Differences

### Go Deployment
1. Build binary: `go build -o tiketin cmd/api/main.go`
2. Upload to VPS/Railway
3. Setup systemd/PM2
4. Manual scaling needed

### Next.js Deployment
1. Push to GitHub
2. Connect Vercel
3. Auto-deploy on push
4. Auto-scaling included

---

## ✅ Testing Checklist

After migration, test these endpoints:

- [ ] `POST /api/auth/register` - Create account
- [ ] `POST /api/auth/login` - Login
- [ ] `GET /api/events` - List events
- [ ] `POST /api/events` - Create event
- [ ] `GET /api/events/[id]` - Get event
- [ ] `GET /api/tickets` - Get user tickets
- [ ] `POST /api/tickets` - Purchase ticket
- [ ] `GET /api/health` - Health check

---

## 🎯 Performance Comparison

| Metric | Go | Next.js |
|--------|----|----|
| **Startup** | 50ms | 300ms |
| **Memory** | 30MB | 150MB |
| **Request** | 10-30ms | 30-50ms |
| **Concurrent** | 10K+ | 1K+ |

**Note**: Next.js on Vercel handles auto-scaling, so performance is acceptable.

---

## 💡 Why This Migration?

| Reason | Impact |
|--------|--------|
| **No CC needed** | Can use free Vercel immediately |
| **Easier deploy** | No infrastructure setup |
| **Faster dev** | Less boilerplate code |
| **Community** | Larger ecosystem |
| **Learning** | Better for growth |

**Trade-off**: Slight performance loss, but acceptable for MVP/startup.

---

## 🔗 Database Connection

Both versions use Supabase PostgreSQL:

```
Go → SQL queries → Supabase
Next.js → Supabase client → Supabase
```

No schema changes needed - use the same database!

---

## 📞 Need Help?

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- TypeScript: https://www.typescriptlang.org

Good luck with your migration! 🚀
