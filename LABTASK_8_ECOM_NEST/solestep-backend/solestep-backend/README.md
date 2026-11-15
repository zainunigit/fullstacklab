# SoleStep NestJS backend (demonstration)

This project provides a NestJS API structure for the SoleStep shoe-store frontend.

## Included modules

- Products: shoe catalogue and product CRUD operations
- Reviews: customer reviews
- Users: customer registration and user information
- Auth: demonstration login/logout/password-recovery endpoints
- Cart: add, update, remove and summarize cart items
- Orders: checkout and order management

Each feature has a module, controller and service. The root `AppModule` imports all six feature modules.

## Run locally

1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run start:dev`.
5. Visit `http://localhost:3000`.

The API is in-memory only. Data resets when the server restarts. No database, real payment gateway, password hashing, JWT, session handling, or frontend connection is configured. The auth endpoints are for demonstrating the controller/module/service structure only and are not production-ready.

## Main routes

- `GET /products`, `GET /products/:id`, `GET /products/category/:category`
- `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`
- `GET /reviews`, `GET /reviews/:id`, `POST /reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id`
- `POST /users/register`, `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`
- `POST /auth/login`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /cart`, `GET /cart/summary`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart`
- `POST /orders`, `GET /orders`, `GET /orders/:id`, `PATCH /orders/:id`, `PATCH /orders/:id/status`, `DELETE /orders/:id`

For POST/PATCH requests, send JSON in the request body.
