# E-Commerce Backend API

Secure and scalable REST APIs for e-commerce workloads built with Node.js, Express, and MySQL.

## About

Designed secure REST APIs with pagination, indexing, and optimized queries for transactional workloads.

## Features

- JWT authentication with role-based authorization (`admin`, `customer`)
- Product APIs with:
  - pagination (`page`, `limit`)
  - filtering (`search`, `category`)
  - sorting (`sortBy`, `sortDir`)
- Optimized MySQL access using pooled connections and prepared statements
- Indexed schema for high-frequency query patterns
- Transaction-safe order placement:
  - row-level locking (`FOR UPDATE`)
  - stock validation
  - rollback on failure
- Security middleware:
  - `helmet`
  - rate limiting
  - CORS

## Tech Stack

- Node.js
- Express.js
- MySQL (`mysql2/promise`)
- JWT (`jsonwebtoken`)
- bcryptjs

## Project Structure

- `server.js` - app bootstrap and middleware
- `app/controllers/` - route handlers
- `app/models/` - SQL model access layer
- `app/routes/` - API routing
- `app/middleware/` - auth and RBAC middleware
- `app/sql/schema.sql` - database schema and indexes

## API Overview

Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

Orders
- `POST /api/orders` (authenticated customer)
- `GET /api/orders/my` (authenticated customer)

Health
- `GET /healthz`

## Query Params (Products)

- `page` default `1`
- `limit` default `10`, max `100`
- `search` by product name
- `category` exact match
- `sortBy` in `id|name|price|created_at`
- `sortDir` in `asc|desc`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure env:
```bash
cp .env.example .env
```

3. Create DB schema:
- Run `app/sql/schema.sql` in MySQL.

4. Start server:
```bash
npm run dev
```

## Vercel Deployment

`vercel.json` is included for deployment routing. Use a hosted MySQL database for production.

## License

ISC
