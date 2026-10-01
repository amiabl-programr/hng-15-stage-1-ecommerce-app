# Roofing Construction Shop — Full-Stack E-Commerce Platform

A production-ready, full-stack architectural roofing and metal fabrication e-commerce platform built with **Next.js 16 (App Router)**, **Supabase PostgreSQL (RLS, Auth, Storage)**, **Google OAuth**, and **Mailgun Transactional Email**.

---

## 🏗️ Features

### 🛒 Customer Storefront
* **Architectural & Industrial Roofing**: Longspan aluminium, Metcopo, Classic Step Tiles, Stone-Coated Shingles, Ridge Caps, Valley Trimmers, Parapet Copings, and Corrugated Sheets.
* **Cut-to-Length Calculator**: Interactive sheet length calculator for dimensioned roofing sheets (calculates linear metres × gauge rate × quantity in real-time).
* **Bespoke Fabrication Inquiries**: Direct contractor submission portal for on-site continuous roll-forming rigs (up to 30 metres unbroken), CNC press brake sheet bending, and radius arch curving.
* **Persistent Shopping Cart**: Zustand client store synchronized with `localStorage` for offline persistence and hydration safety.
* **Authoritative Server Checkout**: Server actions independently recalculate all line totals, enforce minimum order quantities, verify stock, and compute site delivery fees.

### 🔐 Authentication & Accounts
* **Supabase Auth + Google OAuth**: Secure single-click sign-in for contractors and homeowners.
* **Role-Based Access Control (RBAC)**: Distinguishes `customer` and `admin` roles, backed by PostgreSQL Row Level Security (RLS) policies.
* **Customer Account Dashboard**: View profile details, track order progress via a 6-step dispatch pipeline, and review cutting specifications.

### ✉️ Transactional Notifications
* **Mailgun Email Integration**: High-deliverability HTML order confirmation invoices dispatched asynchronously upon order placement.
* **Fault-Tolerant Checkout**: Mailgun delivery failures are safely caught and logged without aborting or corrupting valid database transactions.

### 🛡️ Admin Operations Portal
* **Operations Dashboard**: Gross revenue tracking, total order volume, active catalogue items, and low-stock threshold alerts.
* **Order & Dispatch Fulfillment**: Review cutting specifications, customer contacts, site destinations, and advance statuses (`pending`, `paid`, `processing`, `ready_for_delivery`, `shipped`, `completed`, `cancelled`).
* **Inventory Control**: Real-time stock view with inline stock replenishment adjustments.
* **Product Catalogue Management**: Create and manage products, set pricing units (`metre`, `piece`, `bundle`, etc.), and upload product photography to Supabase Storage.
* **Categories Management**: Organize materials into taxonomy collections with cover imagery.
* **Customer CRM**: Directory of registered contractors and clients with lifetime order values.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (Turbopack, Server Components, Server Actions) |
| **UI Library** | React 19, Tailwind CSS v4, Lucide React, clsx, tailwind-merge |
| **Database & Auth** | Supabase PostgreSQL 15, Row Level Security (RLS), Supabase Auth |
| **Asset Storage** | Supabase Storage (`products` bucket) |
| **State & Forms** | Zustand (`persist`), React Hook Form, Zod validation |
| **Transactional Email** | Mailgun (`mailgun.js`, `form-data`) |
| **Language** | TypeScript (Strict Mode) |

---

## 📁 Project Structure

```text
app/
├── (store)/               # Public storefront routes
│   ├── page.tsx           # Industrial homepage with hero, categories, and roll-forming banner
│   ├── products/          # Search, category faceted filtering, and catalog grid
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx# Product details with interactive cut-to-length configurator
│   ├── categories/        # Categories lineup
│   ├── cart/              # Persistent shopping cart
│   ├── checkout/          # Server-validated checkout and payment method selection
│   │   └── success/       # Order confirmation invoice & bank wire instructions
│   ├── fabrication/       # Custom fabrication & roll-forming quote request form
│   └── layout.tsx         # Storefront layout (Navbar + Footer)
│
├── (auth)/
│   ├── login/page.tsx     # Google OAuth sign-in portal
│   └── callback/route.ts  # OAuth code exchange & auto-admin assignment
│
├── account/               # Customer account area
│   ├── page.tsx           # Profile overview & recent orders
│   ├── orders/page.tsx    # Complete order history
│   └── orders/[id]/page.tsx# Dynamic order dispatch progress stepper
│
├── admin/                 # Protected operations portal
│   ├── page.tsx           # KPI metrics & recent activity
│   ├── products/          # Product catalogue table & new product form
│   ├── categories/        # Category directory & creation
│   ├── inventory/         # Stock replenishment table
│   ├── orders/            # Order fulfillment and status updater
│   ├── customers/         # Customer CRM directory
│   └── layout.tsx         # Admin sidebar and RBAC guard
│
components/
├── navigation/            # Navbar with live cart badge, Footer
├── products/              # ProductCard, ProductConfigurator
├── cart/                  # CartView
├── checkout/              # CheckoutForm
├── fabrication/           # FabricationForm
└── admin/                 # OrderStatusDropdown, StockAdjuster, ProductCreateForm

lib/
├── supabase/              # client.ts, server.ts, admin.ts, proxy.ts
├── cart/                  # Zustand persistent cart store
├── orders/                # Checkout and fabrication Server Actions
├── admin/                 # Admin operations Server Actions
├── mailgun/               # Transactional email service & HTML templates
├── storage/               # Supabase Storage client uploader
├── validation/            # Zod validation schemas
└── utils.ts               # Currency (NGN ₦), date formatting, order numbers

supabase/
├── migrations/            # 20261001000001_init_roofing_schema.sql (RLS, tables, triggers)
└── seed.sql               # Realistic roofing materials, variants, inventory SQL
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd hng15-stage1-ecommerce
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Populate `.env` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Direct Google OAuth 2.0 Credentials (Google Cloud Console)
# In Google Cloud Console -> APIs & Services -> Credentials -> OAuth 2.0 Client IDs
# Authorized JavaScript origins: http://localhost:3000
# Authorized redirect URIs:
#   http://localhost:3000/api/auth/callback/google
#   http://localhost:3000/callback
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application Session Secret (Optional - defaults to GOOGLE_CLIENT_SECRET)
SESSION_SECRET=your-random-32-byte-hex-or-phrase

# Designate Administrator Email(s)
# Users signing in with these emails will be automatically elevated to 'admin'
ADMIN_EMAILS="admin@yourroofingco.com,manager@yourroofingco.com"

# Mailgun Transactional Email Configuration
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_FROM_EMAIL="Roofing Construction Shop <orders@yourdomain.com>"

# App URL (For OAuth callbacks & sitemap)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Database Setup & Migrations

### Run Migrations in Supabase

1. Open your **Supabase Project Dashboard**.
2. Navigate to the **SQL Editor**.
3. Open `supabase/migrations/20261001000001_init_roofing_schema.sql`, paste its content into the editor, and click **Run**.
   * This creates all enums, tables (`profiles`, `categories`, `products`, `product_variants`, `product_images`, `inventory`, `addresses`, `orders`, `order_items`, `fabrication_requests`), sets up RLS policies, auto-profile triggers, and initializes the `products` storage bucket.

### Seed Initial Catalogue Data

You can seed realistic roofing materials (Longspan aluminium, Metcopo, Step tiles, Shingles, Ridge caps, Trimmers, Roll-forming services) with variants and initial stock using either method:

* **Option A (SQL Editor)**: Open `supabase/seed.sql`, paste into the SQL Editor, and click **Run**.
* **Option B (CLI / Programmatic)**: Once `.env` is configured with your Supabase credentials, execute:
  ```bash
  pnpm db:seed
  ```

---

## 🔑 Authentication & Google Cloud Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project, then navigate to **APIs & Services > Credentials**.
3. Create an **OAuth 2.0 Client ID** (Application type: *Web application*).
4. Add Authorized Redirect URI:
   ```text
   https://<your-supabase-project-id>.supabase.co/auth/v1/callback
   ```
5. In your **Supabase Dashboard**, go to **Authentication > Providers > Google**:
   * Enable Google.
   * Paste your `Client ID` and `Client Secret`.
6. Add your application callback URL under Supabase **Authentication > URL Configuration**:
   ```text
   http://localhost:3000/callback
   https://your-production-domain.com/callback
   ```

---

## 📦 Supabase Storage Setup

The migration script creates a public storage bucket named `products`.

To verify:
1. Go to **Storage > Buckets** in Supabase.
2. Ensure `products` bucket is present with **Public** access enabled.
3. Products created in `/admin/products/new` will upload images directly to `products/...`.

---

## 📧 Mailgun Setup

1. Create a free or production domain in [Mailgun](https://www.mailgun.com/).
2. Copy your **Private API Key** and **Domain**.
3. Set `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and `MAILGUN_FROM_EMAIL` in `.env`.
4. When orders are created via the checkout flow, an itemized invoice is dispatched automatically to the customer's email.

---

## 💻 Local Development & Production Build

### Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Run Production Build & Typecheck

```bash
pnpm build
pnpm start
```

---

## 🚢 Deployment (Vercel)

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `ADMIN_EMAILS`
   * `MAILGUN_API_KEY`
   * `MAILGUN_DOMAIN`
   * `MAILGUN_FROM_EMAIL`
   * `NEXT_PUBLIC_APP_URL` (set to your Vercel production domain)
4. Deploy!

---

## 🛡️ Security & Integrity Checklist

- [x] **Zero Client Trust Pricing**: Order totals calculated server-side against database records.
- [x] **Inventory Protection**: Atomic inventory deduction on verified variant stock.
- [x] **Row Level Security (RLS)**: Enforced across all tables; customers cannot inspect other users' orders.
- [x] **Server-Side Admin Verification**: Protected layout and server actions verify `profiles.role === 'admin'`.
- [x] **Decoupled Transactions**: Mailgun email failures never abort valid orders.
- [x] **No Secrets Leaked**: Private keys isolated to server modules and environment variables.
