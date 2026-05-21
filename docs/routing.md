# Vaneco — Routing

**Version:** 0.1.0  
**Last updated:** May 2025

---

## Table of Contents

1. [Domains and responsibilities](#1-domains-and-responsibilities)
2. [pvane.co — public site](#2-pvaneco--public-site)
3. [dashboard.pvane.co — internal panel](#3-dashboardpvaneco--internal-panel)
4. [api.pvane.co — NestJS API](#4-apipvaneco--nestjs-api)
5. [Short URLs](#5-short-urls)
6. [Auth flow per domain](#6-auth-flow-per-domain)
7. [Folder structure per repo](#7-folder-structure-per-repo)

---

## 1. Domains and responsibilities

```
pvane.co                ← public — clients, SEO, conversion
  └── /portal/*         ← authenticated clients — orders, quotes

dashboard.pvane.co      ← internal — Vaneco team (ADMIN only)
  └── /*                ← all routes protected

api.pvane.co            ← NestJS REST API
  └── /v1/*             ← all endpoints
```

### Intentional separation

The client portal lives at `pvane.co/portal` — same brand, same domain. The internal dashboard lives at `dashboard.pvane.co` — separate, more functional, no premium design concerns. This separation allows fast iteration on the dashboard without affecting the public experience.

---

## 2. pvane.co — public site

**Stack:** Astro 6 · React islands · Tailwind v4 · shadcn/ui  
**Repo:** `tres-sh/vaneco-web`

### Public routes (SSG)

| Route | Type | Description |
|---|---|---|
| `/` | SSG | Landing — hero, gallery preview, process, CTA |
| `/work` | SSG | Full project gallery |
| `/work/[slug]` | SSG | Individual project detail |
| `/book` | SSG + island | Appointment request form |
| `/about` | SSG | Vaneco story |

### Client portal routes (SSR)

All require a valid JWT token with role `CLIENT` or `ADMIN`. No token → redirect to `/login`.

| Route | Type | Auth | Description |
|---|---|---|---|
| `/login` | SSG + island | No | Client login |
| `/portal` | SSR | CLIENT | Dashboard — order summary |
| `/portal/orders` | SSR | CLIENT | Order list |
| `/portal/orders/[id]` | SSR | CLIENT | Order detail + timeline |
| `/portal/quotes/[id]` | SSR | CLIENT | View assigned quote |
| `/portal/quotes/[id]/approve` | SSR | CLIENT | Approve quote + payment |

### Quote by token routes (no login required)

The client receives a unique link via WhatsApp with a one-time token. No account needed.

| Route | Type | Auth | Description |
|---|---|---|---|
| `/q/[token]` | SSR | URL token | View public quote |
| `/q/[token]/approve` | SSR | URL token | Approve + pay without login |

```
Example:
pvane.co/q/eyJhbGc... → client views their quote without an account
```

### SSG route generation

```ts
// src/pages/work/[slug].astro
export async function getStaticPaths() {
  const projects = await fetch('https://api.pvane.co/v1/projects/public')
  return projects.map(p => ({ params: { slug: p.slug } }))
}
```

---

## 3. dashboard.pvane.co — internal panel

**Stack:** Astro + Vite · React islands · Tailwind v4  
**Repo:** `tres-sh/vaneco-dashboard`  
**Access:** ADMIN role only — Roman and team

All routes require auth. No token → redirect to `/login`.

### Authentication

```
/login     ← only public route in the dashboard
/*         ← everything else requires ADMIN JWT
```

### Dashboard routes

| Route | Description |
|---|---|
| `/` | Overview — daily metrics, pending tickets |
| `/tickets` | Work order list |
| `/tickets/[id]` | Order detail + status change |
| `/tickets/new` | Create ticket manually |
| `/quotes` | Quote list |
| `/quotes/new` | Quoter — create new quote |
| `/quotes/[id]` | Edit existing quote |
| `/appointments` | Scheduled appointments — calendar |
| `/appointments/[id]` | Appointment detail |
| `/clients` | CRM — clients and carpenters |
| `/clients/[id]` | Client profile + history |
| `/projects` | Gallery management — upload photos |
| `/projects/new` | Upload new project |
| `/projects/[id]` | Edit existing project |
| `/links` | Short URLs + metrics |
| `/links/new` | Create short link |
| `/links/[slug]` | Link metrics detail |

### Quoter flow

```
/quotes/new
  1. Select client or create new one
  2. Enter project data
     - Zone (Tijuana / Rosarito / Tecate)
     - Type (Kitchen / Bathroom / Commercial / Outdoor)
     - Material + USD price per sq ft
     - Measured sq ft
     - Extras (sink cutout, edge profiles, installation)
     - Current exchange rate (editable)
  3. Real-time cost preview
  4. Generate PDF → download or send via WhatsApp
  5. Ticket is updated with the quote
```

### Links module `/links`

```
/links
  ├── All short links list
  │   slug | destination | total clicks | last click
  │
  ├── /links/new
  │   Create: custom slug + destination URL
  │
  └── /links/[slug]
      Detailed metrics:
        - Clicks per day (chart)
        - Device (mobile / desktop)
        - Country / city
        - Referrer
        - Recent clicks (table)
```

---

## 4. api.pvane.co — NestJS API

**Global prefix:** `/v1`  
**Auth:** JWT Bearer token in headers

### Endpoints per module

#### Auth
```
POST   /v1/auth/login          ← user login
POST   /v1/auth/register       ← client registration
POST   /v1/auth/refresh        ← refresh token (Phase 2)
GET    /v1/auth/me             ← authenticated user profile
```

#### Users
```
GET    /v1/users               ← user list [ADMIN]
GET    /v1/users/:id           ← user profile [ADMIN]
PATCH  /v1/users/:id           ← update user [ADMIN]
DELETE /v1/users/:id           ← delete user [ADMIN]
```

#### Tickets
```
POST   /v1/tickets             ← create ticket [ADMIN]
GET    /v1/tickets             ← ticket list [ADMIN]
GET    /v1/tickets/:id         ← ticket detail [ADMIN | CLIENT own]
PATCH  /v1/tickets/:id         ← update status [ADMIN]
DELETE /v1/tickets/:id         ← delete ticket [ADMIN]
```

#### Quotes
```
POST   /v1/quotes              ← create quote [ADMIN]
GET    /v1/quotes              ← quote list [ADMIN]
GET    /v1/quotes/:id          ← detail [ADMIN | CLIENT own]
PATCH  /v1/quotes/:id          ← update [ADMIN]
POST   /v1/quotes/:id/pdf      ← generate PDF [ADMIN]
POST   /v1/quotes/:id/send     ← send via WhatsApp [ADMIN]
POST   /v1/quotes/:id/approve  ← approve quote [CLIENT]
GET    /v1/quotes/token/:token ← view quote by public token
```

#### Appointments
```
POST   /v1/appointments        ← create appointment (public form)
GET    /v1/appointments        ← appointment list [ADMIN]
GET    /v1/appointments/:id    ← appointment detail [ADMIN]
PATCH  /v1/appointments/:id    ← confirm / cancel [ADMIN]
```

#### Projects (public gallery)
```
POST   /v1/projects            ← create project [ADMIN]
GET    /v1/projects/public     ← public list (SSG)
GET    /v1/projects/:slug      ← detail by slug (SSG)
PATCH  /v1/projects/:id        ← edit [ADMIN]
DELETE /v1/projects/:id        ← delete [ADMIN]
POST   /v1/projects/:id/images ← upload images to S3 [ADMIN]
```

#### Links (short URLs)
```
POST   /v1/links               ← create short link [ADMIN]
GET    /v1/links               ← link list [ADMIN]
GET    /v1/links/:slug/stats   ← metrics [ADMIN]
PATCH  /v1/links/:slug         ← edit destination [ADMIN]
DELETE /v1/links/:slug         ← delete [ADMIN]
GET    /v1/links/:slug/redirect ← redirect + track click (public)
```

#### Leads (existing)
```
POST   /v1/leads               ← capture lead
GET    /v1/leads               ← lead list [ADMIN]
```

#### Notifications
```
POST   /v1/notifications/whatsapp  ← send WhatsApp message [ADMIN]
POST   /v1/webhooks/whatsapp       ← Meta webhook (public)
POST   /v1/webhooks/twilio         ← Twilio webhook (public)
POST   /v1/webhooks/stripe         ← Stripe webhook (public)
```

### Response conventions

```ts
// Success
{
  data: T,
  meta?: { total, page, limit }  // for paginated lists
}

// Error
{
  statusCode: number,
  message: string,
  error: string
}
```

### Pagination

```
GET /v1/tickets?page=1&limit=20&status=PENDING_VISIT&zone=TIJUANA
```

---

## 5. Short URLs

### How the redirect works

```
pvane.co/whats
  → Astro SSR fetches api.pvane.co/v1/links/whats/redirect
  → API logs the click (IP, user-agent, referer, timestamp)
  → API responds with { url: 'https://wa.me/...' }
  → Astro performs 302 redirect
```

### Planned initial links

| Short URL | Destination | Purpose |
|---|---|---|
| `pvane.co/whats` | `https://wa.me/526640000000` | Direct WhatsApp |
| `pvane.co/cotiza` | `piedrasvaneco.com/contacto` | Quote funnel |
| `pvane.co/aura` | `piedrasvaneco.com/gallery/calacatta-aura-...` | Specific campaign |
| `pvane.co/ig` | Vaneco Instagram | Instagram bio |
| `pvane.co/fb` | Vaneco Facebook | Facebook campaigns |

### Links module schema

```prisma
model Link {
  id        String   @id @default(cuid())
  slug      String   @unique
  url       String
  title     String?
  active    Boolean  @default(true)
  createdAt DateTime @default(now())

  clicks Click[]
}

model Click {
  id        String   @id @default(cuid())
  linkId    String
  ip        String?
  userAgent String?
  referer   String?
  country   String?
  city      String?
  device    String?  // mobile | desktop | tablet
  createdAt DateTime @default(now())

  link Link @relation(fields: [linkId], references: [id])
}
```

---

## 6. Auth flow per domain

### pvane.co — client

```
1. Client lands on pvane.co/login
2. POST api.pvane.co/v1/auth/login → { access_token }
3. Token stored in httpOnly cookie
4. Astro SSR reads cookie on every /portal/* request
5. No token → redirect /login
6. With token → fetch user data and render
```

### pvane.co — quote by token (no login)

```
1. Admin generates quote in dashboard
2. API creates a unique token (cuid) in Quote.publicToken
3. Admin sends link via WhatsApp: pvane.co/q/[token]
4. Client opens link → SSR verifies token in DB
5. Valid token → display quote
6. Client approves → POST /v1/quotes/token/:token/approve
7. Token expires or is invalidated after approval
```

### dashboard.pvane.co — admin

```
1. Admin goes to dashboard.pvane.co/login
2. POST api.pvane.co/v1/auth/login → { access_token }
3. Token in localStorage (internal-only dashboard)
4. React Query / fetch with Authorization header on every call
5. No token or expired token → redirect /login
6. CLIENT role → redirect /login (ADMIN only)
```

---

## 7. Folder structure per repo

### vaneco-web (pvane.co)

```
src/
├── pages/
│   ├── index.astro
│   ├── work/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── book.astro
│   ├── login.astro
│   ├── q/
│   │   └── [token].astro     ← public quote by token
│   ├── [slug].astro          ← short URL redirect
│   └── portal/
│       ├── index.astro
│       ├── orders/
│       │   └── [id].astro
│       └── quotes/
│           └── [id].astro
├── components/
│   ├── ui/                   ← design system
│   ├── sections/             ← Hero, Gallery, Process
│   └── portal/               ← OrderTimeline, QuoteView
├── layouts/
│   ├── BaseLayout.astro
│   └── PortalLayout.astro
└── lib/
    ├── api.ts
    └── auth.ts
```

### vaneco-dashboard

```
src/
├── pages/
│   ├── index.astro           ← overview
│   ├── login.astro
│   ├── tickets/
│   │   ├── index.astro
│   │   ├── new.astro
│   │   └── [id].astro
│   ├── quotes/
│   │   ├── index.astro
│   │   ├── new.astro         ← quoter
│   │   └── [id].astro
│   ├── appointments/
│   │   ├── index.astro
│   │   └── [id].astro
│   ├── clients/
│   │   ├── index.astro
│   │   └── [id].astro
│   ├── projects/
│   │   ├── index.astro
│   │   ├── new.astro
│   │   └── [id].astro
│   └── links/
│       ├── index.astro
│       ├── new.astro
│       └── [slug].astro
├── components/
│   ├── ui/                   ← design system
│   ├── quoter/               ← quoter components
│   └── charts/               ← link metrics
├── layouts/
│   └── DashboardLayout.astro
└── lib/
    ├── api.ts
    └── auth.ts
```

### vaneco-api

```
src/
├── auth/
├── users/
├── leads/
├── tickets/
├── quotes/
├── appointments/
├── projects/
├── links/
├── notifications/
├── storage/
└── prisma/
```

---

*Living document — updated with every new route or endpoint.*