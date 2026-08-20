1. System Architecture
1.1 Overview

The system is a full-stack jewelry e-commerce application consisting of:

Customer storefront
Customer authentication
Product catalog
Product variants
Cart
Wishlist
Checkout
Razorpay payments
Order management
Reviews
Admin panel
Inventory management
1.2 High-Level Architecture
                         ┌──────────────────────┐
                         │      Customer        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ React + Tailwind CSS │
                         │    Customer Store    │
                         └──────────┬───────────┘
                                    │
                                 REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Node.js + Express.js │
                         │      Backend API     │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌────────────┐        ┌──────────────┐       ┌─────────────┐
      │  MongoDB   │        │   Razorpay   │       │   Services  │
      │ + Mongoose │        │   Payments   │       │ Email/OAuth │
      └────────────┘        └──────────────┘       └─────────────┘
             ▲
             │
      ┌──────┴──────────┐
      │   Admin Panel   │
      │ React Interface │
      └─────────────────┘
1.3 Technology Stack
Frontend
- React
- Tailwind CSS


Backend
- Node.js
- Express.js


Database
- MongoDB
- Mongoose


Authentication
- Email/Password
- Google OAuth


Payment
- Razorpay


Backend Hosting
- Railway

Frontend hosting and file/media storage are TBD.

2. Modules

The system is divided into the following modules.

1. Authentication
2. User Management
3. Product Management
4. Category Management
5. Variant Management
6. Inventory Management
7. Cart
8. Wishlist
9. Address Management
10. Checkout
11. Payment
12. Order Management
13. Review Management
14. Coupon Management
15. Admin Panel
16. Notifications
17. Search / Filter / Sort
18. SEO
3. Major Flows
3.1 Customer Shopping Flow
Home
 ↓
Shop
 ↓
Search / Filter / Sort
 ↓
Product Details
 ↓
Select Variant
 ↓
Add to Cart
 ↓
Cart
 ↓
Checkout
 ↓
Login Required
 ↓
Address
 ↓
Payment
 ↓
Order Confirmation
3.2 Authentication Flow
User
 │
 ├── Email + Password
 │
 └── Google Login
        │
        ▼
   Authentication
        │
        ▼
     Customer

Guest checkout is not supported.

3.3 Admin Flow
Admin Login
    ↓
Role Verification
    ↓
Admin Dashboard
    ↓
┌────────────────────────────┐
│ Products                   │
│ Categories                 │
│ Variants                   │
│ Inventory                  │
│ Orders                     │
│ Customers                  │
│ Reviews                    │
│ Coupons                    │
│ Settings                   │
└────────────────────────────┘
4. Database Relationships

The primary database entities are:

User
Product
ProductVariant
Category
Cart
CartItem
Wishlist
WishlistItem
Address
Order
OrderItem
Payment
Review
Coupon
4.1 User Relationships
User
 │
 ├── Addresses
 ├── Cart
 ├── Wishlist
 ├── Orders
 └── Reviews
4.2 Product Relationships
Category
    │
    └──── Products
             │
             └──── ProductVariants
4.3 Order Relationships
User
 │
 └── Order
       │
       ├── OrderItems
       │      │
       │      └── Product / Variant reference
       │
       └── Payment
4.4 Cart
User
 │
 └── Cart
       │
       └── CartItems
              │
              └── ProductVariant
4.5 Wishlist
User
 │
 └── Wishlist
       │
       └── WishlistItems
              │
              └── Product

Exact MongoDB schema and embedding/reference decisions will be finalized separately.

5. API Architecture

The backend will expose REST APIs.

Base path:

/api
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/logout
GET  /api/auth/me
Products
GET    /api/products
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id

Product creation/update/deletion will require admin authorization.

Categories
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
Cart
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart
Wishlist
GET    /api/wishlist
POST   /api/wishlist/items
DELETE /api/wishlist/items/:id
Orders
POST /api/orders
GET  /api/orders
GET  /api/orders/:id

Admin:

GET   /api/admin/orders
PATCH /api/admin/orders/:id/status
Payments
POST /api/payments/create
POST /api/payments/verify

Exact endpoint structure may change during implementation.

6. Authentication Flow
6.1 Email/Password
Register
   ↓
Validate Input
   ↓
Hash Password
   ↓
Create User
   ↓
Login
   ↓
Issue Authentication Credential
   ↓
Authenticated User

Passwords will never be stored in plain text.

6.2 Google Login
User
 ↓
Google
 ↓
Google Authentication
 ↓
Backend Verification
 ↓
Find/Create User
 ↓
Authenticated Session
6.3 Authorization

Two roles:

customer
admin

Protected API:

Request
 ↓
Authentication Middleware
 ↓
Authenticated?
 ├── No → 401
 └── Yes
       ↓
Role Middleware
       ↓
Permission Check

Admin APIs must never be accessible to regular customers.

7. Cart & Inventory Consistency

This is an important part of the system because multiple customers may attempt to purchase the same limited-stock jewelry item.

7.1 Cart

Cart stores:

User
 └── Cart
      └── CartItem
           ├── Product
           ├── ProductVariant
           └── Quantity

The cart should reference the product/variant rather than permanently trusting price or stock values from the client.

7.2 Stock Validation

When adding to cart:

Request
 ↓
Find Variant
 ↓
Check Availability
 ↓
Quantity <= Available Stock?
 ├── No → Error
 └── Yes → Add to Cart

But cart validation alone is not enough.

Stock must be checked again during checkout/order creation.

Checkout
   ↓
Fetch current product/variant data
   ↓
Validate stock
   ↓
Validate current price
   ↓
Create order/payment

The server is the source of truth for price and inventory.

7.3 Inventory Update

After successful payment/order confirmation:

Available Stock
      ↓
Subtract Purchased Quantity
      ↓
Updated Stock

The exact point at which stock is reserved/deducted will be finalized with the detailed payment flow.

8. Order & Payment Flow
8.1 Checkout
Cart
 ↓
Checkout
 ↓
Authentication Check
 ↓
Address Selection
 ↓
Server validates:
 ├── Product exists
 ├── Variant exists
 ├── Price
 ├── Stock
 └── Quantity
 ↓
Create Razorpay Order
 ↓
Razorpay Checkout
8.2 Payment
Customer
 ↓
Razorpay
 ↓
Payment
 ↓
Razorpay Response
 ↓
Backend Verification
 ↓
Payment Verified?
 ├── No → Failed
 └── Yes
       ↓
    Confirm Order
       ↓
    Update Inventory
       ↓
    Send Confirmation

The frontend response alone must not be treated as proof of successful payment.

8.3 Order Status

Initial order statuses:

Pending
Confirmed
Processing
Shipped
Delivered
Cancelled

Return/refund workflow will be defined separately.

8.4 Payment Status

Potential states:

Pending
Paid
Failed
Refunded

Exact state transitions will be finalized during implementation.

9. Admin System

The admin panel will provide centralized management of the store.

9.1 Dashboard

Possible information:

Total Sales
Total Orders
Pending Orders
Total Customers
Products
Low Stock Products
Recent Orders
9.2 Product Management

Admin can:

Create Product
Edit Product
Delete/Archive Product
Manage Images
Manage Categories
Manage Tags
Manage Variants
Manage Pricing
Manage Inventory
Manage SEO
Change Product Status
Product information

The product system should support Shopify-style product information relevant to the jewelry store:

Basic Information
├── Title
├── Description
├── Media
├── Product Type
├── Vendor / Brand
├── Collections
└── Tags


Pricing
├── Price
├── Compare-at Price
├── Cost
└── Tax information


Inventory
├── SKU
├── Barcode
├── Quantity
└── Inventory tracking


Shipping
├── Physical product
├── Weight
├── Country of origin
└── HS Code


Variants
├── Dynamic options
├── Variant combinations
├── Variant price
├── Variant SKU
├── Variant stock
├── Variant image
└── Variant weight


SEO
├── Meta title
├── Meta description
└── URL handle


Status
├── Active
├── Draft
└── Archived
9.3 Order Management

Admin can:

View orders
View order details
View customer information
Update order status
View payment status
Process cancellation
Handle returns/refunds when supported
9.4 Customer Management

Admin can:

View customers
View customer profile
View customer orders
View customer activity where supported
9.5 Inventory

Admin can:

View stock
Update stock
View SKU
View low-stock products
Manage variant-level inventory
10. Security & Failure Handling
10.1 Security

The system will implement:

Password hashing
Protected authentication routes
Role-based authorization
Input validation
API validation
Secure environment variables
CORS configuration
Rate limiting where appropriate
Secure HTTP configuration
Payment signature verification
Server-side price validation
Server-side inventory validation
10.2 Never Trust Client Data

The backend must not trust:

Price
Stock
Discount
Payment Status
User Role
Order Total

coming directly from the frontend.

For example:

Frontend says:
Price = ₹999


Backend:
Fetch actual product price
        ↓
₹1,499
        ↓
Use ₹1,499
10.3 Failure Handling
Payment Failure
Payment Failed
 ↓
Order not marked as paid
 ↓
Inventory not incorrectly reduced
 ↓
Customer can retry
Product Out of Stock
Checkout
 ↓
Stock Check
 ↓
Unavailable
 ↓
Stop Order
 ↓
Show Updated Availability
Invalid Authentication
Unauthorized → 401
Insufficient Permissions
Forbidden → 403
Invalid Request
Validation Error → 400
Server Error
Unexpected Error → 500

Errors should be logged server-side without exposing sensitive internal information to customers.