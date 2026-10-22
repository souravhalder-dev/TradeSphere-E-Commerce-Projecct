# TradeSphere — Enterprise-Grade Global E-commerce Marketplace

[![GitHub Repository](https://img.shields.io/badge/GitHub-TradeSphere-181717?style=flat&logo=github)](https://github.com/souravhalder-dev/TradeSphere-E-Commerce-Projecct)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Vitest-Passing-success?style=flat&logo=vitest)](https://vitest.dev/)

TradeSphere is a production-oriented, multi-vendor B2B and B2C global e-commerce marketplace engineered for high-volume wholesale trading, verified factory sourcing, and multi-tenant seller commerce. Inspired by platforms such as Alibaba, Amazon Business, and modern global trading platforms.

---

## Key Capabilities & Architecture

- **Modular Monolith**: Organized into clean domain services with strict separation of concerns (Core Commerce, Multi-Vendor Seller Center, B2B Tender RFQ Engine, Financial Ledger, Shipping & Logistics, Trust & Moderation).
- **Multi-Role RBAC**: Resource-level server authorization (`GUEST`, `BUYER`, `BUSINESS_BUYER`, `SELLER`, `SELLER_STAFF`, `ADMIN`, `SUPER_ADMIN`).
- **Wholesale Tiered Pricing**: Volume quantity discount breaks with Minimum Order Quantity (MOQ) validation. Server-side recalculation ensures client prices are never trusted.
- **B2B Wholesale Tender Engine (RFQ)**: Formal tender publishing, supplier quotation submissions, lead times, payment terms, and auditable counteroffer negotiation state machines.
- **Trade Assurance Escrow**: Buyer payment protection held in escrow until Bill of Lading (BL) inspection or verified carrier delivery.
- **Multi-Vendor Data Isolation**: Strict tenant checks ensuring sellers can never access another seller's private orders, customers, or financial records.
- **Pluggable Payment Layer**: Extensible provider architecture with adapters for Stripe, SSLCOMMERZ, Bank Wire (Purchase Orders), and a clearly labeled development sandbox mock adapter.
- **Double-Entry Financial Ledger**: Balanced ledger records for marketplace commissions, seller net earnings, and payout wire settlements.
- **Carrier Logistics Abstraction**: Automated package splitting, rate computation, and waybill tracking simulator (`TS-EXP-XXXXXX`).

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 App Router, React 18, Server Components |
| **Language** | TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Custom Design System |
| **Database** | PostgreSQL 16+ via Prisma ORM (24+ Models & Relations) |
| **Caching & Queues** | Redis 7 & BullMQ asynchronous job scaffolding |
| **Security & Auth** | Bcrypt password hashing (12 rounds), JWT sessions, RBAC guards |
| **Validation** | Zod v3 schemas (Client & Server) |
| **Testing** | Vitest (Automated unit & domain integration test suite) |
| **Containerization** | Docker Compose (`postgres:16-alpine`, `redis:7-alpine`) |

---

## Directory Structure

```
TradeSphere/
├── prisma/
│   ├── schema.prisma            # 24+ domain models, enums, indexes, and relations
│   └── seed.ts                  # Seed script with verified suppliers, catalog, and RFQs
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login and Register with fast 1-click demo fillers
│   │   ├── (storefront)/
│   │   │   ├── products/        # Sourcing catalog, search, and dynamic PDP
│   │   │   ├── cart/            # Multi-seller cart with live volume-tier recalibration
│   │   │   ├── checkout/        # Trade Assurance checkout with server-side validation
│   │   │   ├── orders/          # Immutable order confirmation & carrier tracking
│   │   │   ├── rfq/             # B2B Tender marketplace & quotation workbench
│   │   │   └── sellers/         # Public supplier storefronts
│   │   ├── seller/              # Multi-tenant Seller Center (KPIs, Products, Orders, Finance)
│   │   ├── admin/               # Admin Control Center (GMV, Verification Queue, Audit Trail)
│   │   ├── api/                 # Secure Route Handlers (Checkout, RFQs, Fulfillment, etc.)
│   │   ├── layout.tsx           # Global responsive layout with Navigation & Footer
│   │   └── page.tsx             # High-converting B2B & B2C marketplace homepage
│   ├── components/              # Modular UI components (ProductCard, Navbar, Footer, etc.)
│   └── lib/
│       ├── adapters/            # Pluggable Payment & Shipping Logistics Adapters
│       ├── data/                # Data repository with graceful offline/sandbox fallback
│       ├── services/            # Domain business logic (Pricing, Inventory, Orders, RFQ, Ledger)
│       ├── validations/         # Zod schemas for input validation
│       ├── auth.ts              # Password hashing, JWT token verification & RBAC guards
│       ├── db.ts                # Prisma client singleton
│       └── utils.ts             # Currency and datetime formatting utilities
├── docker-compose.yml           # PostgreSQL 16 & Redis 7 Docker services
├── vitest.config.ts             # Vitest test runner configuration
└── package.json
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm**
- **Docker** (Optional for local PostgreSQL and Redis containerization)

### 2. Installation
Clone the repository and install dependencies:
```bash
cd TradeSphere
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Default `.env` configuration works out-of-the-box for local testing with the Development Mock Payment Adapter and Sandbox Logistics Simulator.

### 4. Database Setup (PostgreSQL)

#### With Docker:
Start PostgreSQL 16 and Redis 7:
```bash
docker compose up -d
```
Push the schema and seed demo records:
```bash
npm run prisma:push
npm run prisma:seed
```

#### Zero-Setup Sandbox Mode:
If Docker or a local PostgreSQL server is not currently running, TradeSphere's resilient repository layer automatically loads the comprehensive seeded dataset into an in-memory development datastore. This allows testing all catalog, purchasing, RFQ, seller dashboard, and admin features immediately without database setup.

### 5. Running the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Running Automated Tests
Execute the Vitest domain test suite:
```bash
npm test
```

### 7. Production Build Verification
To compile and verify the optimized production build:
```bash
npm run build
npm start
```

---

## Test Accounts & Credentials

For fast evaluation, 1-click account fill buttons are integrated directly into the `/login` page:

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Super Administrator** | `admin@tradesphere.com` | `AdminPass123!` | `/admin` Platform Control Center |
| **Verified Supplier** | `sales@apexmachinery.com` | `SupplierPass123!` | `/seller` Apex Industrial Technologies Dashboard |
| **Business Buyer** | `buyer@acmecorp.com` | `BuyerPass123!` | `/cart`, `/checkout`, `/rfq` Acme Procurement |

---

## Core Workflows Verification

### 1. Wholesale Tiered Purchasing Flow
1. Browse to `/products` and select a product (e.g., *Industrial Precision 5-Axis CNC Milling Center V850*).
2. On the Product Detail Page, view the Volume Wholesale Pricing table.
3. Increment the order quantity: observe the unit price automatically decrease as quantity breaks are crossed.
4. Add to cart: open `/cart` to verify that multi-seller items are grouped and subtotaled.
5. Proceed to `/checkout`: complete the shipping consignee form, select **Development Mock Sandbox**, and submit.
6. View `/orders/[id]`: review the immutable snapshot, freight tracking number (`TS-EXP-XXXXXX`), and Trade Assurance escrow status.

### 2. Multi-Vendor Seller Fulfillment Flow
1. Navigate to `/seller` to review the supplier dashboard (GMV, Available Balance, Escrow Hold).
2. Go to `/seller/products/new`: create a new product with custom MOQ, lead times, and multiple volume price tiers.
3. Open `/seller/orders`: click **Dispatch Cargo** on a confirmed order to assign a carrier and generate a live waybill.
4. Visit `/seller/finance`: view the balanced double-entry ledger entries (platform commission splits and seller net earnings) and request a payout settlement.

### 3. B2B Sourcing Tender (RFQ) Flow
1. Navigate to `/rfq` and click **Submit New RFQ**.
2. Fill in required volume, target unit price, destination country, and technical specifications.
3. Open the newly published RFQ: click **Submit Formal Supplier Quotation** to submit a formal price offer, lead time, and payment terms.

### 4. Admin Verification & Governance Flow
1. Navigate to `/admin` to review the platform health monitor, total GMV, and platform revenue.
2. Visit `/admin/sellers` to inspect the supplier compliance queue and approve or reject verified seller applications.
3. Visit `/admin/audit-logs` to review the tamper-evident security audit trail.

---

## License
Proprietary — Enterprise-Grade Global E-commerce Platform. Built for production scalability.
