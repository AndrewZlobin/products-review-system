# Product Review System

A full-stack product review platform (Amazon/Alza-style) built with Angular 21, NestJS, PostgreSQL, and Redis. Users can browse products, submit star-rated reviews, and see aggregated rating breakdowns — all behind JWT authentication.

---

## Architecture

The system is split into two services. The **backend** is a NestJS REST API (TypeScript) that uses Prisma ORM to talk to PostgreSQL 15. The **frontend** is an Angular 21 SPA (standalone components, Signals). Auth is handled with JWT access tokens; no refresh tokens are issued to keep the implementation lean.

---

## Current Status

### Backend
| Feature | Status |
|---|---|
| Auth (`POST /auth/register`, `POST /auth/login`) | Done |
| `JwtAuthGuard` + JWT strategy (Passport) | Done |
| `GET /products` (paginated, category filter, avg rating) | Done |
| `GET /products/:id` (rating stats + review list) | Done |
| `POST /products` (create product) | Not started |
| `POST /products/:id/reviews` (one per user, 409 on duplicate) | Done |
| `GET /products/:id/reviews` (separate paginated endpoint) | Not started |
| `PATCH /reviews/:id` (edit own review) | Not started |
| `DELETE /reviews/:id` (delete own review) | Not started |
| Redis caching for product ratings | Not started |
| Prisma seed script (15 products — beauty, fragrances, furniture) | Done |
| Unit tests | Not started |

### Frontend
| Feature | Status |
|---|---|
| Product list page (`/products`) — paginated grid + category filter | Done |
| `<app-product-card>` component | Done |
| Login page (`/login`) — UI only, auth call stubbed | Done |
| Login / Register modal dialog — fully wired to `AuthService` | Done |
| Register page (`/register`) — dedicated route | Not started |
| Product detail page (`/products/:id`) — ratings, breakdown, reviews | Done |
| `<app-star-rating>` standalone component | Not started |
| `<app-rating-breakdown>` standalone component | Not started |
| `<app-review-list>` standalone component | Not started |
| `<app-review-form>` component (dialog, wired to API) | Done |
| Navbar | Not started |
| Auth service + JWT storage (`localStorage`) | Done |
| HTTP interceptor (automatic `Authorization` header) | Not started |
| Loading skeletons (product list + detail) | Done |
| Optimistic UI for review submission | Not started |

---

## Running Locally

```bash
git clone https://github.com/AndrewZlobin/products-review-system.git && cd products-review-system
cp server/.env.example server/.env
```

**Start Postgres** (requires Docker):
```bash
docker compose up -d postgres
```

**Backend** (terminal 1):
```bash
cd server && npm install
npx prisma migrate deploy
npx prisma db seed   # loads 15 products (beauty, fragrances, furniture)
npm run start:dev
```

**Frontend** (terminal 2):
```bash
cd client && npm install && npm start
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:4200 |
| Backend  | http://localhost:3000 |

> A full Docker Compose setup (backend + frontend containers) is planned but not yet implemented. Currently only the Postgres service is containerised.

---

## Environment Variables

See `server/.env.example`:

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: `3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |

---

## API Reference

### Auth

| Method | Path           | Auth | Description         |
|--------|----------------|------|---------------------|
| POST   | /auth/register | —    | Register a new user |
| POST   | /auth/login    | —    | Returns a JWT token |

### Products

| Method | Path          | Auth     | Description                                       |
|--------|---------------|----------|---------------------------------------------------|
| GET    | /products     | —        | List all products (paginated, filter by category) |
| GET    | /products/:id | —        | Product detail with aggregated rating stats       |
| POST   | /products     | Required | Create a product *(not yet implemented)*          |

Query params for `GET /products`: `page`, `limit`, `category`.

**`GET /products` response:**
```json
{
  "items": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

**`GET /products/:id` response:**
```json
{
  "id": "uuid",
  "name": "Product Name",
  "averageRating": 4.3,
  "reviewCount": 127,
  "ratingDistribution": { "1": 5, "2": 8, "3": 20, "4": 40, "5": 54 },
  "reviews": []
}
```

### Reviews *(not yet implemented)*

| Method | Path                    | Auth     | Description                     |
|--------|-------------------------|----------|---------------------------------|
| GET    | /products/:id/reviews   | —        | Paginated reviews for a product |
| POST   | /products/:id/reviews   | Required | Submit a review (one per user)  |
| PATCH  | /reviews/:id            | Required | Edit own review                 |
| DELETE | /reviews/:id            | Required | Delete own review               |

---

## Design Decisions & Trade-offs

**Why NestJS over Express**
NestJS provides a structured, module-based architecture with first-class TypeScript support, built-in dependency injection, and decorators for guards, interceptors, and pipes. For a project with multiple bounded contexts (Auth, Products, Reviews), this structure keeps concerns separated cleanly. Plain Express would have required manually wiring the same conventions.

**Why PostgreSQL + Prisma**
The data model has clear relational structure (Users → Reviews → Products) and a hard uniqueness constraint (`@@unique([userId, productId])`). PostgreSQL enforces this at the database level, which no application-layer check can fully replace. Prisma provides type-safe query building, auto-generated migrations, and a seed API — making local setup and schema evolution straightforward.

**Redis caching strategy** *(planned)*
`GET /products` and `GET /products/:id` are the hottest read paths. Aggregated rating stats (`averageRating`, `ratingDistribution`) are expensive to recompute on every request. These will be cached in Redis under keys `product:<id>` and `products:list:<hash-of-query>` with a 60 s TTL. Any write to the Reviews table for a given product (create/update/delete) will immediately invalidate that product's cache entry rather than waiting for TTL expiry.

**One-review-per-user constraint**
Enforced at two layers: a `@@unique([userId, productId])` constraint in the Prisma schema (backed by a PostgreSQL unique index) and a guard in `ReviewsService` that returns a `409 Conflict` before attempting the insert. The database constraint is the authoritative safeguard; the service-layer check produces a cleaner error message.

---

## What Would Be Improved With More Time

- **Refresh tokens** — current JWTs are long-lived; a refresh/revocation flow would be the first security improvement.
- **Cursor-based pagination** — offset pagination is simple but degrades on large tables; keyset/cursor pagination would scale better.
- **Image upload** — product images currently accept a URL string; real upload to S3/R2 with presigned URLs would be more practical.
- **Full-text search** — product search is currently a simple `ILIKE` filter; Postgres full-text search or an Elasticsearch integration would improve relevance.
- **E2E test coverage** — only one happy-path e2e test exists; covering edge cases (duplicate review, invalid JWT, race conditions) would meaningfully raise confidence.
- **Rate limiting** — no per-IP or per-user rate limits on review submission or auth endpoints.
