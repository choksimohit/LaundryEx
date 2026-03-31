# Laundry Express - E-Commerce Platform PRD

## Problem Statement
Multi-business online laundry order placement platform with postcode-based service availability, categorized product catalog, cart/checkout with Stripe (LIVE) and COD, admin panel, and customer dashboard.

## Core Requirements
- Postcode-based service availability check
- Category > Subcategory > Products catalog with business-specific pricing
- Cart and custom scheduling (pickup/delivery)
- Customer auth (login/register)
- Payments: Cash on Delivery + Stripe (LIVE keys)
- Admin panel: order management, product CRUD, drag-and-drop product & category reordering
- Customer dashboard: order summaries and status
- Email notifications via Resend (order confirmation, status updates, admin alerts)
- Blue & white theme referencing laundry-express.co.uk

## Tech Stack
- Frontend: React, Tailwind CSS, Shadcn/UI, @dnd-kit
- Backend: FastAPI, Python
- Database: MongoDB
- Payments: Stripe (LIVE keys)
- Email: Resend
- Drag & Drop: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities

## What's Been Implemented
- User authentication (JWT)
- Postcode-based service validation
- Categorized product catalog (tabs for categories, collapsible subcategories)
- Cart + Checkout flow (Stripe LIVE + COD)
- 6-digit numeric order IDs
- Order confirmation & admin notification emails via Resend
- Admin panel: stats, order management with status updates, product CRUD
- Drag-and-drop product reordering within subcategories
- Drag-and-drop category reordering (Categories tab in Admin)
- Customer address/postcode + pickup/delivery instructions in Admin order cards
- Professional README.md
- Removed "Made with Emergent" badge
- Contact phone: +44 7777 367076, WhatsApp link fixed

## Completed (This Session - 2026-03-31)
- Fixed P0: SyntaxError in email_service.py (indentation bug crashing backend)
- Added P1: Customer address/postcode display in Admin order summary
- Added P2: Drag-and-drop category reordering in Admin panel (new Categories tab)

## Backlog
- P2: Refactor server.py into routes/ directory for maintainability
- P3: Move hardcoded HTML email templates to dedicated template files

## Key API Endpoints
- POST /api/auth/register, /api/auth/login, GET /api/auth/me
- POST /api/pincode/check
- GET /api/products, /api/categories, /api/service-types
- POST /api/orders, GET /api/orders, GET /api/orders/{id}
- POST /api/payment/create-intent
- GET /api/admin/orders, PATCH /api/admin/orders/{id}/status
- GET /api/admin/products, POST/PUT/DELETE /api/admin/products
- POST /api/admin/products/reorder
- GET /api/admin/categories, POST /api/admin/categories/reorder
- GET /api/admin/businesses, POST /api/admin/businesses
- GET /api/admin/stats

## DB Collections
- users: {id, name, email, password, role, phone, created_at}
- products: {id, name, price, category, subcategory, sort_order, business_id, business_name, service_type}
- categories: {name, sort_order}
- orders: {id, order_number, user_id, user_name, user_email, items, total_amount, status, address, pin_code, pickup_date/time/instruction, delivery_date/time/instruction, payment_method, payment_status}
- businesses: {id, name, owner_email, pin_codes}
