1. Project Overview

This project is a full-stack e-commerce website for a jewelry brand.

The application will include a customer-facing storefront, customer authentication, product and inventory management, an admin panel, order management, and online payments through Razorpay.

The project is being developed as a complete standalone e-commerce application.

2. Core Requirements

The application will support:

Product browsing
Product categories
Product variants
Product-level and variant-level inventory
Shopping cart
Wishlist
Customer accounts
Customer authentication
Google authentication
Address management
Checkout
Online payments
Order management
Product reviews
Admin panel
Customer management
3. Authentication

The application will support customer and admin authentication.

Customer Authentication

Supported methods:

Email + password
Google login

Customer accounts will contain:

Name
Email
Phone number
Password/authentication credentials
Saved addresses
Orders
Wishlist
Reviews

Additional authentication features:

Forgot password
Reset password
Logout
User Roles

The application will have two primary roles:

customer
admin

Admin-only functionality must be protected from regular customers.

Guest Checkout

Guest checkout will not be supported.

Users must be authenticated before proceeding with checkout.

4. Product Architecture

Products will support variants.

A product can have multiple variants, and variant attributes should be flexible rather than hardcoded to only one type.

Example:

Product
│
├── Variant
│   ├── Size
│   ├── Color
│   ├── Material
│   ├── SKU
│   ├── Price
│   └── Stock
│
├── Variant
│   └── ...
│
└── ...

Variant attributes may include:

Size
Color
Material
Other product-specific attributes

Inventory, SKU, and pricing can be managed at the variant level.

5. Payment

The application will use Razorpay for online payments.

Initial checkout flow:

Cart
 ↓
Checkout
 ↓
Authentication Check
 ↓
Address
 ↓
Order / Payment Creation
 ↓
Razorpay
 ↓
Payment Verification
 ↓
Order Confirmation

Payment implementation details will be finalized when the backend and order architecture are defined.

6. Admin Panel

The application will include a dedicated admin panel.

The admin panel will eventually provide management for:

Products
Product variants
Categories
Inventory
Orders
Customers
Reviews
Coupons
Store settings

The exact admin functionality will be finalized during the architecture discussion.

7. Architecture Decisions
7.1 Tech Stack — ✅ Final

Tumne ye decide kiya hai:

Frontend
├── React
└── Tailwind CSS


Backend
├── Node.js
└── Express.js


Database
└── MongoDB


Database ODM
└── Mongoose


Payment Gateway
└── Razorpay


Backend Hosting
└── Railway

Why this setup?

React frontend ke liye, Express Node.js ke upar API/backend layer ke liye suitable hai. Express specifically web applications aur APIs ke liye designed hai.

MongoDB document-based database hai aur JSON-like documents, arrays aur nested documents support karta hai, jo hamare dynamic jewelry product variants ke liye convenient hai. MongoDB ACID transactions bhi support karta hai.

Railway Node/Express applications ko GitHub se deploy kar sakta hai aur database services bhi provide karta hai, including MongoDB.
7.2 Frontend Architecture — ⏳

Ab decide karna hai React project ko kaise organize karenge.

Main suggest karungi:

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── utils/
│   ├── assets/
│   └── App.jsx
│
├── public/
├── package.json
└── ...
Components

Reusable UI:

components/
├── Navbar
├── Footer
├── ProductCard
├── ProductGrid
├── ProductGallery
├── VariantSelector
├── CartItem
├── ReviewCard
├── Modal
└── ...
Pages

Actual routes:

pages/
├── Home
├── Shop
├── ProductDetails
├── Cart
├── Wishlist
├── Checkout
├── Login
├── Register
├── ForgotPassword
├── Account
└── ...
Services

Backend API calls:

services/
├── authService
├── productService
├── cartService
├── orderService
├── wishlistService
├── reviewService
└── paymentService

Isse React components ke andar directly API logic nahi bharna padega.

7.3 Backend Architecture — ⏳

Express backend ko bhi clean layers mein rakhenge:

backend/
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── app.js
│
├── server.js
└── package.json

Flow:

Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
MongoDB

Example:

GET /api/products
       ↓
productRoutes
       ↓
productController
       ↓
productService
       ↓
Product Model
       ↓
MongoDB

Ye separation baad mein project ko maintain karna much easier banayega.

7.4 Database Architecture — ⏳

MongoDB mein hum collections/models rakhenge.

Abhi proposed:

Users
Products
Categories
Orders
Carts
Wishlists
Reviews
Coupons
Addresses

Possibly:

Payments

Lekin Payments collection actually chahiye ya nahi, ye Razorpay flow discuss karte waqt decide karenge.

Product

Product ke andar variants honge:

Product
├── Basic information
├── Images
├── Category
├── Description
├── Variants
└── SEO information

Variant:

Variant
├── Attributes
├── SKU
├── Price
├── Sale Price
└── Stock

MongoDB documents arrays/nested documents support karta hai, so this model naturally represent ho sakta hai.

7.5 Authentication — ✅ Mostly Final

Already decided:

Email + Password       ✅
Phone Number           ✅
Google Login           ✅
Forgot Password       ✅
Reset Password         ✅
Customer Role          ✅
Admin Role             ✅
Guest Checkout         ❌

Authentication flow:

Register/Login
      ↓
Authentication
      ↓
User
      ↓
Customer Dashboard

Admin:

Admin Login
     ↓
Role Verification
     ↓
Admin Panel
7.6 Admin Architecture — ⏳

Admin panel definitely hoga.

Initial modules:

Admin
├── Dashboard
├── Products
├── Categories
├── Inventory
├── Orders
├── Customers
├── Reviews
├── Coupons
└── Settings

But abhi hum decide karenge har module mein admin kya actions kar sakta hai.

For example Products:

Products
├── View
├── Add
├── Edit
├── Delete
├── Manage Variants
└── Manage Inventory
7.7 E-commerce Flow — ⏳

Basic flow:

Browse Products
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
Address
      ↓
Razorpay
      ↓
Payment Verification
      ↓
Order

Because guest checkout nahi hai:

Checkout
   ↓
Logged in?
   ├── No → Login/Register
   └── Yes
          ↓
       Address
          ↓
       Payment
7.8 Payment Architecture — ⏳

Razorpay final hai.

Lekin important part:

Frontend ko directly "payment successful = order successful" decide nahi karna chahiye.

Backend Razorpay payment ko verify karega.

Conceptually:

Frontend
   ↓
Backend creates payment/order
   ↓
Razorpay
   ↓
User pays
   ↓
Backend verifies payment
   ↓
Order confirmed

Exact Razorpay implementation hum payment section mein decide karenge.

7.9 Deployment — ⏳

Current plan:

Frontend
   ↓
Hosting TBD


Backend
   ↓
Railway


Database
   ↓
MongoDB

Railway backend deployment ke liye suitable hai; its current docs explicitly cover Node.js/Express deployment and GitHub-based deployments.

Railway MongoDB service bhi provide karta hai.

Lekin abhi ye decide nahi karna ki MongoDB Railway par rakhenge ya MongoDB Atlas par. Woh separate decision hai.

7.10 Environment Variables — ⏳

Secrets code mein hardcode nahi honge.

Example:

PORT=
MONGODB_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

Production mein ye deployment environment mein store honge.

7.11 Security — ⏳

At minimum:

Password hashing
Authentication middleware
Role-based authorization
Protected admin routes
Protected customer routes
Input validation
Secure environment variables
Razorpay payment verification
API error handling
Rate limiting where appropriate