# Jewelry Store API

## Run locally

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Run `npm run dev` from this folder.

The API starts at `http://localhost:5000`. Check `GET /api/health`.

## Available endpoints

- `GET /api/products` — supports `page`, `limit`, `category`, `search`, `minPrice`, and `maxPrice`.
- `GET /api/products/:id` — accepts a MongoDB id or product slug.
- `POST`, `PATCH`, `DELETE /api/products`
- `GET /api/categories`
- `POST`, `PATCH`, `DELETE /api/categories`

## Authentication

- `POST /api/auth/register` with `name`, `email`, and an 8+ character `password`
- `POST /api/auth/login` with `email` and `password`
- `GET /api/auth/me` with `Authorization: Bearer <token>`
- `POST /api/auth/logout`
- `POST /api/auth/google` with a Google ID-token `credential`
- `POST /api/auth/forgot-password` and `POST /api/auth/reset-password`

Product and category writes require a signed-in user with the `admin` role. Public registration can only create customer accounts; promote the first store administrator directly in MongoDB.

## Cart

All cart routes require `Authorization: Bearer <token>`.

- `GET /api/cart`
- `POST /api/cart/items` with `productId`, optional `variantId`, and `quantity`
- `PATCH /api/cart/items/:id` with `quantity`
- `DELETE /api/cart/items/:id`
- `DELETE /api/cart`

Cart totals and availability are calculated from the current product data. Stock is verified whenever an item is added or its quantity changes.

## Wishlist and addresses

All routes below require `Authorization: Bearer <token>`.

- `GET /api/wishlist`, `POST /api/wishlist/items`, `DELETE /api/wishlist/items/:id`
- `GET /api/addresses`, `POST /api/addresses`
- `PATCH /api/addresses/:id`, `DELETE /api/addresses/:id`

Addresses are owned by the signed-in user. The first saved address becomes the default; setting another address as default clears the previous one.

## Orders

- `POST /api/orders` with an `addressId` creates a pending-payment order from the current cart.
- `GET /api/orders` and `GET /api/orders/:id` return the signed-in customer's orders.
- `GET /api/admin/orders` and `PATCH /api/admin/orders/:id/status` require an admin token.

Checkout re-reads the product price and stock from MongoDB and saves immutable product and delivery-address snapshots in the order. Payment verification and inventory deduction are added with the Razorpay integration.

## Razorpay payments

Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (test-mode keys for local development) in `.env`.

- `POST /api/payments/create` with an `orderId` creates or returns the Razorpay order details.
- `POST /api/payments/verify` verifies `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` after checkout.

After a valid signature is verified, the API atomically deducts the selected product or variant stock, marks payment as `paid`, and confirms the order. Never mark an order as paid from a frontend response alone.

## Security

The API uses Helmet security headers, a 1 MB JSON body limit, restrictive CORS for `CLIENT_URL`, password hashing, JWT authorization, and a 300-request-per-15-minute rate limit. Configure production secrets only through environment variables.

## Reviews

- `GET /api/products/:productId/reviews` lists approved reviews.
- `POST /api/products/:productId/reviews` requires a customer with a delivered order containing the product.
- Admins can moderate with `GET /api/admin/reviews` and `PATCH /api/admin/reviews/:id/status`.

## Deployment and admin operations

Railway is configured through `railway.json` and `Procfile`; set the same environment variables in Railway's service settings. Admins can view `GET /api/admin/dashboard`, inventory via `GET /api/admin/inventory?lowStock=true`, and adjust product stock with `PATCH /api/admin/inventory/:id` using `{ "quantity": 5 }`.
