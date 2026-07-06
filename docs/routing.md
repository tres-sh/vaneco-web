# Vaneco — Routing

**Version:** 0.3.0  
**Last updated:** July 2026

> **Update (July 2026):** The public site is implemented — `/` (landing),
> `/proyectos` + `/proyectos/[id]` (gallery), `/materiales`, `/nosotros`, `/faq`,
> `/cita` (booking + quote lookup) and `/privacidad`. Route names are resolved:
> **`/proyectos`** (not `/galeria`), **`/cita`** (not `/book`), **`/nosotros`**
> (not `/about`); the project detail is its own SEO route **`/proyectos/[id]`**
> (not a modal). Quote consultation is keyed by **folio**, not by a one-time
> token. SEO structured data (LocalBusiness / ItemList / FAQPage) ships with the
> pages.

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

**Stack:** Astro 6 · React islands · Tailwind v4 · custom design-system components  
**Repo:** `tres-sh/vaneco-web`  
**Adapter:** `@astrojs/vercel` — deploys to Vercel (Build Output API). Pages are
SSG today; `/cita` flips to SSR once wired to `api.pvane.co`.

### Public routes

| Route | Type | Status | Description |
|---|---|---|---|
| `/` | SSG | ✅ Built | Landing — hero, stats, project teaser, process, CTA |
| `/proyectos` | SSG | ✅ Built | Full gallery + material/color/finish filters (island) |
| `/proyectos/[id]` | SSG | ✅ Built | Individual project detail (own route for SEO/sharing) |
| `/materiales` | SSG | ✅ Built | Materials guide — 5 anchored sections + ItemList schema |
| `/nosotros` | SSG | ✅ Built | About the workshop — history, stats, service area |
| `/faq` | SSG | ✅ Built | FAQ accordion (`<details>`) + FAQPage schema |
| `/cita` | SSG + island | ✅ Built | Book a visit (creates folio) + quote lookup by folio |
| `/privacidad` | SSG | ✅ Built | Privacy notice (LFPDPPP), linked from the `/cita` consent |

> **Navigation:** the navbar now carries `Inicio · Proyectos · Materiales ·
> Nosotros · FAQ` (active state by route) + the ES/EN pill, theme button and
> `Agendar visita` CTA. Every footer links **Privacidad**. The mobile
> FloatingBottomNav still shows 5 fixed items (Inicio · Galería · Agendar ·
> Contacto · Ajustes) — Materiales/Nosotros/FAQ are reached via the desktop nav
> or the footer for now.

> **SEO / structured data:** a global **`LocalBusiness`** JSON-LD (NAP +
> `areaServed`: Tijuana, Playas de Rosarito, Tecate, Ensenada) is emitted from
> `BaseLayout` on every page; `/faq` adds **`FAQPage`** and `/materiales` adds
> **`ItemList`**, each generated from the same data that renders the page
> (single source of truth). FAQ answers render in the served HTML — the
> accordion only collapses them.

> **Current data source:** the gallery and quote lookup run on **local mock
> data** (`src/data/projects.ts` and an in-island quote map that accepts
> `COT-YNG-2606` and any `COT-VNC-####`). They swap to `api.pvane.co` when the
> tickets/quotes/appointments modules ship. `/cita` becomes SSR at that point
> (it needs to create folios and read quotes).

> **Bilingual + theme:** every public page is fully ES/EN and dark/light. The
> language and theme are shared across React islands through `window`
> CustomEvents + `localStorage` (`vaneco-lang`, `vaneco-theme`) — see
> `patterns.md` §1.

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

### Quote lookup by folio (no login required)

The **folio** is the client's only key. It is generated when they book a visit
(`Agendar cita`) and, with it, they consult and pay their quote — no account.

Implemented today as the **second tab of `/cita`** ("Consultar cotización"):
enter the folio → see line items, subtotal, IVA (8%), total, status badge, and
payment (transfer/cash). A dedicated shareable route is planned:

| Route | Type | Auth | Status | Description |
|---|---|---|---|---|
| `/cita` (tab) | island | folio | ✅ Built | Quote lookup by folio + payment |
| `/cotizacion/[folio]` | SSR | folio | ⏳ Planned | Optional dedicated shareable page |

```
Example:
pvane.co/cita → "Consultar cotización" → COT-YNG-2606 → quote + payment
Folios are not guessable; lookup is public but the folio acts as the key.
```

### Folio status flow

A folio advances through these statuses (badge colors from the design system):

| Status | Color | Meaning |
|---|---|---|
| `Cita agendada` | veta `#9BA8B0` | Visit booked, quote pending |
| `Pendiente de pago` | warning `#FCD34D` | Quote issued, awaiting payment |
| `En fabricación` | success `#4ADE80` | Paid (50% deposit), in production |
| `Cancelada` | danger `#FCA5A5` | Cancelled |

### SSG route generation

```ts
// src/pages/proyectos/[id].astro — currently from local data
import { projects } from '../../data/projects'
export function getStaticPaths() {
  return projects.map((p) => ({ params: { id: p.id }, props: { project: p } }))
}

// When the API is live, the same shape is fetched instead:
// const projects = await fetch('https://api.pvane.co/v1/projects/public')
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

#### Appointments / Citas
```
POST   /v1/appointments        ← create appointment (public /cita form) → returns folio
GET    /v1/appointments        ← appointment list [ADMIN]
GET    /v1/appointments/:id    ← appointment detail [ADMIN]
PATCH  /v1/appointments/:id    ← confirm / cancel [ADMIN]
```
The public `/cita` form calls `POST /v1/appointments`; the response carries the
generated **folio** (backend-assigned; the prototype mocks `COT-VNC-####`). The
form requires **privacy consent** (LFPDPPP): the request must persist
`consent_accepted_at` (timestamp) + the accepted notice version, and the server
must re-validate consent — never trust the front-end gate alone.

#### Cotizaciones (quote lookup by folio)
```
GET    /v1/cotizaciones/:folio ← public quote by folio (line items, IVA 8%, total, status)
```
Public route — no auth — but the folio is the key and is not guessable. IVA is a
fixed **8%** (border region); a **50% deposit** moves the folio to
`En fabricación`.

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
| `pvane.co/cotiza` | `pvane.co/cita` | Quote / booking funnel |
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

### pvane.co — quote lookup by folio (no login)

```
1. Client books a visit at /cita → API creates ticket + folio (COT-…)
2. Client receives the folio (on-screen confirmation + WhatsApp)
3. Client returns to /cita → "Consultar cotización" → enters the folio
4. SSR reads GET /v1/cotizaciones/:folio → line items, IVA 8%, total, status
5. Client pays (Stripe transfer/deposit or cash at workshop)
6. On confirmed payment (50% deposit) the folio → "En fabricación"
```
The folio is the login-less key: public lookup, but the folio itself is not
guessable (backend-assigned).

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

### vaneco-web (pvane.co) — as built (July 2026)

```
src/
├── pages/
│   ├── index.astro            ← landing (SSG)
│   ├── proyectos/
│   │   ├── index.astro        ← gallery (SSG)
│   │   └── [id].astro         ← project detail (SSG, getStaticPaths)
│   ├── materiales.astro       ← materials guide (SSG + ItemList schema)
│   ├── nosotros.astro         ← about the workshop (SSG)
│   ├── faq.astro              ← FAQ accordion (SSG + FAQPage schema)
│   ├── cita.astro             ← booking + quote lookup (SSG + island)
│   ├── privacidad.astro       ← privacy notice (SSG)
│   └── (planned) login, portal/*, cotizacion/[folio]
├── components/
│   ├── ui/                    ← Navbar + MobileTopBar, FloatingBottomNav,
│   │                            Button (Primary/Secondary), Footer,
│   │                            Controls (LangToggle, ThemeButton), ThemeToggle
│   ├── home/                  ← Home, StonePlaceholder
│   ├── projects/              ← ProjectGallery, ProjectDetail
│   └── cita/                  ← CitaFlow (with LFPDPPP consent checkbox)
├── data/
│   ├── projects.ts            ← local mock data + derived filter options
│   ├── materials.ts           ← 5 materials (drives /materiales + ItemList)
│   └── faq.ts                 ← FAQ groups (drives /faq + FAQPage schema)
├── layouts/
│   └── BaseLayout.astro       ← head, fonts, theme flash-guard script
└── lib/
    ├── useLang.ts             ← shared ES/EN state across islands (events)
    └── useTheme.ts            ← shared dark/light state across islands
    └── (planned) api.ts, auth.ts
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