# AGENTS.md
# 1. Core Architecture

## Primary rule

**Use Next.js as the full-stack application.**

The intended architecture is:

```text
Browser
   │
   ▼
Next.js
├── React UI
├── Server Components
├── Server Actions
├── Route Handlers
└── Server-side application logic
   │
   ├───────────────┬────────────────┐
   ▼               ▼                ▼
Supabase         Mailgun          Google
PostgreSQL       Email            OAuth
Auth
Storage
```

### Responsibilities

| Concern                  | Technology          |
| ------------------------ | ------------------- |
| UI                       | React + Next.js     |
| Application/server logic | Next.js             |
| Database                 | Supabase PostgreSQL |
| Authentication           | Supabase Auth       |
| OAuth                    | Google              |
| File storage             | Supabase Storage    |
| Email                    | Mailgun             |
| Validation               | Zod                 |
| Styling                  | Tailwind CSS        |
| Hosting                  | Vercel              |

---

# 2. Development Philosophy

Prioritize:

1. Correctness
2. Security
3. Maintainability
4. Simplicity
5. User experience
6. Performance

Avoid premature abstraction and unnecessary infrastructure.

Prefer a simple solution that works correctly over a sophisticated solution that introduces unnecessary complexity.

---

# 3. Before Making Changes

Before modifying the codebase:

1. Inspect the repository structure.
2. Inspect `package.json`.
3. Inspect existing Supabase integration.
4. Inspect existing database migrations.
5. Inspect existing environment-variable usage.
6. Determine whether the requested functionality already partially exists.
7. Reuse existing patterns where they are sound.
8. Identify affected files.
9. Make the smallest coherent change necessary.

Do not rewrite working parts of the application without a clear reason.

---

# 4. Follow Existing Project Conventions

Before introducing a new pattern:

* Look for an existing implementation of the same pattern.
* Reuse existing utilities.
* Reuse existing components.
* Follow existing naming conventions.
* Follow existing import conventions.
* Follow existing folder structure.
* Follow existing styling conventions.

Consistency with the existing codebase takes precedence over personal preference.

---

# 5. Next.js Rules

Use the Next.js App Router.

Prefer Server Components by default.

Only use `"use client"` when client-side functionality actually requires it, such as:

* React state
* Event handlers
* Browser APIs
* Interactive components
* Client-side authentication state where necessary

Do not make entire pages Client Components simply because one child component needs interactivity.

Prefer:

```text
Server Component
    │
    ├── Server-rendered content
    │
    └── Small Client Component
```

over:

```text
Entire page → Client Component
```

---

# 6. Server Actions and Route Handlers

Use Server Actions for mutations that naturally belong to application workflows.

Examples:

* Creating orders
* Updating customer information
* Adding/removing cart items where appropriate
* Admin product mutations
* Inventory mutations

Use Route Handlers when an actual HTTP endpoint is appropriate.

Do not create API endpoints simply because an operation can technically be exposed as an API.

---

# 7. Server/Client Boundary

Never expose server secrets to client code.

Client-side code must never contain:

* Supabase service-role keys
* Mailgun API keys
* Google client secrets
* Private API keys
* Database credentials

Use server-side modules for privileged operations.

---

# 8. Supabase Rules

Supabase is the application's primary database, authentication, and storage infrastructure.

Use:

* Supabase PostgreSQL
* Supabase Auth
* Supabase Storage
* Row Level Security

Do not introduce another database unless explicitly required.

---

# 9. Database Changes

All database schema changes must be represented as Supabase migrations.

Never silently modify the production schema.

For schema changes:

```text
Create migration
       ↓
Review migration
       ↓
Apply migration
       ↓
Verify schema
```

Do not manually modify production tables and leave the repository without a corresponding migration.

---

# 10. Database Design

The primary entities include:

```text
profiles
categories
products
product_variants
product_images
inventory
addresses
orders
order_items
fabrication_requests
cart_items
```

Maintain proper:

* Primary keys
* Foreign keys
* Unique constraints
* Indexes
* Timestamps
* RLS policies

Avoid unnecessary tables and abstractions.

---

# 11. RLS Is Mandatory

Supabase Row Level Security must remain enabled for sensitive application data.

Never disable RLS merely to make a feature work.

Customers must not be able to access another customer's:

* Profile
* Addresses
* Orders
* Order items
* Private information

Administrative access must be explicitly authorized.

---

# 12. Authentication

Direct Google OAuth 2.0 (user-selected preference over Supabase Auth):

```text
User
 ↓
Google OAuth 2.0 Consent
 ↓
Next.js Callback Route (/api/auth/callback/google & /callback)
 ↓
Exchange Code & Fetch Userinfo (Google API)
 ↓
Persist / Update User in Database (public.profiles)
 ↓
Signed HTTP-Only Session Cookie
```

Authentication credentials must never be committed to the repository.

---

# 13. Authorization

There are at least two application roles:

```text
customer
admin
```

Never trust a role sent by the browser.

Authorization must be enforced server-side.

Hiding an admin button is not authorization.

An unauthorized user must still be prevented from directly accessing the protected operation.

---

# 14. Environment Variables

Use environment variables for secrets and environment-specific configuration.

Expected variables may include:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

MAILGUN_API_KEY=
MAILGUN_DOMAIN=
MAILGUN_FROM_EMAIL=
```

Only expose variables prefixed with `NEXT_PUBLIC_` when they are genuinely safe for browser exposure.

Never commit:

```text
.env
.env.local
.env.production
```

when they contain secrets.

Maintain:

```text
.env.example
```

with placeholder values.

---

# 15. Supabase Service Role

The Supabase service-role key bypasses RLS and is highly privileged.

Rules:

* Never expose it to the browser.
* Never import it into Client Components.
* Never put it in `NEXT_PUBLIC_*`.
* Use it only in trusted server-side contexts.
* Minimize its use where normal RLS-authorized access is sufficient.

Prefer normal Supabase authentication/RLS over privileged access.

---

# 16. Product Architecture

The application supports both physical products and services.

Do not assume every catalogue item has the same purchasing model.

Examples:

```text
Physical product
Longspan roofing
Quantity: 20 pieces
```

```text
Service
Sheet bending
Quantity: 45 metres
```

```text
Custom product/service
Custom roofing sheet
Length
Width
Thickness
Colour
Quantity
```

Model product behavior explicitly rather than filling every product with irrelevant fields.

---

# 17. Money and Pricing

Treat pricing as security-sensitive.

Never trust the following values from the browser:

* Product price
* Discount
* Quantity
* Subtotal
* Delivery fee
* Total

The server must retrieve authoritative pricing and calculate the final order total.

Example:

```text
Client request
     ↓
Validate product
     ↓
Validate variant
     ↓
Validate quantity
     ↓
Fetch authoritative price
     ↓
Validate inventory
     ↓
Calculate subtotal
     ↓
Calculate delivery
     ↓
Calculate final total
     ↓
Create order
```

---

# 18. Checkout

Checkout is a security-sensitive workflow.

The server must validate:

* Authenticated user where required
* Product existence
* Product availability
* Variant validity
* Quantity
* Minimum order quantity
* Inventory
* Current price
* Delivery information
* Final order total

Never use client-calculated totals as the authoritative order total.

---

# 19. Orders

Orders must persist in Supabase.

A typical lifecycle may include:

```text
pending
payment_pending
paid
processing
ready_for_delivery
shipped
completed
cancelled
refunded
```

Do not hard-code assumptions about the final payment workflow if payment processing has not yet been selected.

Keep payment handling extensible.

---

# 20. Inventory

Inventory must be validated server-side.

Avoid race conditions when multiple customers attempt to purchase limited stock.

Inventory changes should be designed so that an order cannot accidentally create negative inventory.

When modifying inventory logic, consider transaction safety and concurrent requests.

---

# 21. Email / Mailgun

Mailgun is responsible for transactional email.

Email must be sent server-side.

At minimum, implement order confirmation emails.

The email should include:

* Customer name
* Order number
* Order date
* Items
* Quantities
* Prices
* Subtotal
* Delivery fee
* Total
* Delivery address
* Business contact information

Mailgun failure must not corrupt an otherwise valid database order.

Prefer:

```text
Create valid order
       ↓
Persist order
       ↓
Trigger email
```

rather than making database integrity dependent on email delivery.

---

# 22. External Services

Keep external integrations isolated.

For example:

```text
lib/
├── mailgun/
├── supabase/
├── auth/
└── ...
```

Do not scatter Mailgun API calls throughout React components.

Do not scatter authentication implementation throughout the application.

Create small integration modules with clear interfaces.

---

# 23. Validation

Use Zod for important external input.

Validate:

* Forms
* Server Action inputs
* Route Handler inputs
* Query parameters where appropriate
* Product creation
* Product updates
* Checkout
* Address information
* Fabrication requests

TypeScript types alone are not runtime validation.

---

# 24. Error Handling

Never expose internal errors or stack traces to users.

Handle expected errors explicitly.

Examples:

```text
Product not found
Insufficient inventory
Invalid quantity
Invalid variant
Unauthorized
Forbidden
Order creation failed
Email delivery failed
Invalid address
```

Provide useful user-facing messages while logging enough server-side information for debugging.

---

# 25. Components

Keep components focused.

Avoid giant components containing:

* UI
* Database queries
* Business rules
* Authentication
* Email logic
* Validation

Instead:

```text
UI
 ↓
Server Action / domain function
 ↓
Validation
 ↓
Database
 ↓
External service
```

Reusable UI components belong in appropriate component directories.

---

# 26. Business Logic

Business logic should not live primarily inside UI components.

Examples of business logic:

* Calculating totals
* Checking inventory
* Determining order status
* Validating product variants
* Creating orders
* Applying discounts
* Determining delivery fees

Keep this logic in server-side/domain modules.

---

# 27. State Management

Use the simplest state solution that works.

Prefer:

* React state for local state
* URL state for shareable filters/search where appropriate
* Server state/data fetching where appropriate

Use Zustand only when global client state provides a meaningful benefit.

A shopping cart may use Zustand if persistent client-side state is useful, but the server remains authoritative during checkout.

---

# 28. Styling

Use Tailwind CSS if already configured.

Follow existing design conventions.

The design should communicate:

* Construction
* Engineering
* Reliability
* Durability
* Professionalism
* Trust

Avoid generic template-like e-commerce styling.

The website should feel appropriate for a real roofing/construction business.

---

# 29. Responsive Design

Every feature must work on:

* Mobile
* Tablet
* Desktop

Do not treat mobile support as an afterthought.

When implementing layouts, verify:

* Navigation
* Product cards
* Product details
* Cart
* Checkout
* Admin tables
* Forms
* Modals/dialogs

on smaller screens.

---

# 30. Accessibility

Use semantic HTML.

Ensure:

* Buttons are actual buttons.
* Links are actual links.
* Form inputs have labels.
* Images have useful alt text.
* Keyboard navigation works.
* Focus states remain visible.
* Error messages are understandable.
* Interactive controls have accessible names.

Do not sacrifice accessibility for visual styling.

---

# 31. Images

Use Supabase Storage for product images.

Validate uploaded files.

Consider:

* File type
* File size
* Image dimensions
* Compression
* Appropriate alt text

Do not store large image binaries directly in PostgreSQL.

Use Next.js image optimization where appropriate.

---

# 32. SEO

Maintain:

* Descriptive page titles
* Metadata
* Product descriptions
* Clean URLs
* Product slugs
* Open Graph metadata
* Sitemap
* Robots configuration
* Structured data where appropriate

Example:

```text
/products/longspan-roofing
/products/metcopo-roofing
/products/ridge-cap
```

Prefer SEO-friendly URLs over ID-based URLs.

---

# 33. Performance

Prefer:

* Server Components
* Efficient queries
* Pagination
* Image optimization
* Appropriate caching
* Lazy loading
* Minimal client-side JavaScript

Do not introduce client-side fetching when server rendering is more appropriate.

Do not add caching without understanding invalidation requirements.

Correctness takes precedence over premature optimization.

---

# 34. Admin Dashboard

Admin functionality must be protected server-side.

Admin capabilities include:

### Products

* Create
* Edit
* Deactivate/delete
* Upload images
* Manage variants
* Manage pricing
* Manage stock
* Feature products

### Categories

* Create
* Edit
* Deactivate/delete

### Inventory

* View inventory
* Adjust inventory
* Identify low stock

### Orders

* View orders
* View order details
* Update order status

### Customers

* View customers
* View customer order history

---

# 35. Database Migration Workflow

When modifying the schema:

1. Create a migration.
2. Review SQL.
3. Check foreign keys.
4. Check indexes.
5. Check RLS implications.
6. Apply locally.
7. Test affected functionality.
8. Update seed data if necessary.
9. Document meaningful changes.

Never make undocumented schema changes.

---

# 36. Seed Data

Development seed data should include realistic examples such as:

```text
Longspan Roofing Sheet
Metcopo Roofing Sheet
Step Tile
Roofing Shingle
Ridge Cap
Upper Trimmer
Lower Trimmer
Parapet
Corrugated Roofing Sheet
Roll Forming Service
Sheet Bending Service
```

Clearly distinguish development/demo data from real business data.

---

# 37. Testing Requirements

At minimum, verify:

## Authentication

* Google login
* Logout
* Session persistence
* Unauthorized access

## Products

* Listing
* Details
* Categories
* Search
* Filters
* Variants

## Cart

* Add
* Remove
* Quantity changes
* Empty cart
* Persistence behavior

## Checkout

* Validation
* Inventory validation
* Price validation
* Correct totals
* Order creation

## Authorization

* Customer cannot access another customer's order.
* Customer cannot access admin functionality.
* Admin can manage authorized resources.

## Email

* Order confirmation is triggered.
* Email failures do not corrupt order data.

---

# 38. Verification After Changes

After meaningful implementation work:

1. Run type checking.
2. Run linting.
3. Run relevant tests.
4. Run the development build when appropriate.
5. Check affected pages manually when possible.
6. Inspect database changes.
7. Verify authentication/authorization boundaries.
8. Verify no secrets were accidentally introduced.

Do not claim a feature works without actually verifying it.

---

# 39. Git and Changes

Keep changes focused.

Prefer small, logically grouped changes.

Do not:

* Modify unrelated files unnecessarily.
* Reformat the entire repository without reason.
* Delete working functionality without justification.
* Commit secrets.
* Commit generated files unless the project requires them.

When a task is complete, summarize:

```text
What changed
Why it changed
Files affected
Database changes
Environment variables required
Tests/checks performed
Known limitations
```

---

# 40. Do Not Over-Engineer

Avoid introducing:

* Microservices
* Separate backend applications
* Message brokers
* Redis
* Kubernetes
* Complex repository patterns
* Heavy ORM layers
* Unnecessary abstractions

unless a concrete project requirement justifies them.

The current architecture is intentionally:

```text
Next.js
+
Supabase
+
Google OAuth
+
Mailgun
```

Keep it that way unless requirements change.

---

# 41. When to Introduce a Separate Backend

A dedicated backend such as NestJS may become justified if the application eventually requires:

* Multiple independent frontend clients
* A mobile application sharing the same API
* A public API
* Complex background processing
* Multiple business systems consuming the same domain API
* Significant third-party integrations
* A substantially more complex domain
* Independent backend deployment/scaling

Until such a requirement exists, do not create one.

---

# 42. Documentation Requirements

Keep these documents up to date:

```text
README.md
AGENTS.md
prompt.md
.env.example
```

`prompt.md` describes the product requirements.

`AGENTS.md` describes how an AI coding agent should work on the repository.

`README.md` describes how humans set up, run, test, and deploy the project.

---

# 43. Definition of Done

A feature is not complete merely because its UI exists.

A feature is complete when:

```text
UI
 ↓
Validation
 ↓
Server logic
 ↓
Database
 ↓
Authorization
 ↓
Error handling
 ↓
Loading/empty states
 ↓
Testing
```

have been appropriately addressed.

For database-backed features, verify persistence.

For authenticated features, verify authorization.

For financial/order features, verify server-side calculations.

For external integrations, verify failure behavior.

---

# 44. Agent Decision Rules

When uncertain:

### If the decision affects money:

Ask before making a business-rule assumption.

### If the decision affects database structure:

Prefer a deliberate schema decision and migration.

### If the decision affects security:

Choose the more secure design and explain it.

### If the decision affects only UI:

Use a reasonable professional default.

### If an existing project pattern exists:

Follow it.

### If a new dependency is being considered:

First determine whether the existing stack can solve the problem.

### If a separate service is being considered:

First determine whether Next.js can handle the requirement cleanly.

---

# 45. Primary Principle

Build the simplest architecture that can safely support the business.

The target architecture is:

```text
                    ┌──────────────────┐
                    │     Next.js      │
                    │   Full Stack     │
                    └────────┬─────────┘
                             │
               ┌─────────────┼─────────────┐
               │             │             │
               ▼             ▼             ▼
          ┌─────────┐   ┌─────────┐   ┌─────────┐
          │Supabase │   │ Mailgun │   │ Google  │
          │         │   │         │   │  OAuth  │
          │ DB      │   │ Email   │   │         │
          │ Auth    │   │         │   │         │
          │ Storage │   │         │   │         │
          └─────────┘   └─────────┘   └─────────┘
```

Keep the system modular internally, but avoid unnecessary distributed architecture.

The goal is a **production-quality roofing construction e-commerce application**, not an architecture demonstration.
