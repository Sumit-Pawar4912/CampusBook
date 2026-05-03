# CampusBook

CampusBook is a MERN-stack marketplace for college students to buy, sell, exchange, or donate books within their campus community.

## Structure

- `server/` — Node.js + Express backend
- `client/` — React + Vite frontend

## Backend setup

1. Copy `server/.env.example` to `server/.env`
2. Set `MONGO_URI`, `JWT_SECRET`, and Cloudinary credentials
3. Run `npm install` inside `server/`
4. Start server with `npm run dev`

## Frontend setup

1. Copy `client/.env.example` to `client/.env`
2. Update `VITE_API_URL` if backend runs on a different host
3. Run `npm install` inside `client/`
4. Start app with `npm run dev`

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/profile`
- `POST /api/books`
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/wishlist`
- `POST /api/wishlist`
- `DELETE /api/wishlist/:bookId`
- `POST /api/transactions`
- `GET /api/transactions`
- `PATCH /api/transactions/:id`
- `GET /api/admin/pending-listings`
- `PATCH /api/admin/books/:id/approve`
- `PATCH /api/admin/books/:id/reject`
- `PATCH /api/admin/users/:id/verify`
- `POST /api/ai/ocr-scan`
- `POST /api/ai/price-suggestion`
- `GET /api/ai/trending`
