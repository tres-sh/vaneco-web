# Vaneco — Architecture

**Version:** 0.2.0  
**Last updated:** July 2026  
**Status:** Evolving — vaneco-leads is mutating into vaneco-api; the public
frontend's first three pages (`/`, `/proyectos`, `/cita`) are live on Vercel,
running on local mock data until the API modules ship.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Services and responsibilities](#2-services-and-responsibilities)
3. [Backend — vaneco-api](#3-backend--vaneco-api)
4. [Frontend — pvane.co](#4-frontend--pvaneco)
5. [Infrastructure](#5-infrastructure)
6. [CI/CD](#6-cicd)
7. [Environment variables](#7-environment-variables)
8. [Architecture decisions](#8-architecture-decisions)

---

## 1. Overview

```
                        ┌─────────────────────┐
                        │     pvane.co         │
                        │  Astro + React       │
                        │  Cloudflare CDN      │
                        └──────────┬──────────┘
                                   │ HTTPS
                        ┌──────────▼──────────┐
                        │    api.pvane.co      │
                        │  NestJS 11 + Prisma  │
                        │  AWS Lightsail       │
                        └──┬────┬────┬────┬───┘
                           │    │    │    │
              ┌────────────┘    │    │    └────────────┐
              │                 │    │                  │
    ┌─────────▼──────┐  ┌──────▼──┐ │  ┌──────────────▼──┐
    │  PostgreSQL     │  │ AWS S3  │ │  │  Meta WhatsApp   │
    │  (Prisma 7)     │  │ Images  │ │  │  Cloud API       │
    └────────────────┘  └─────────┘ │  └─────────────────┘
                                    │
                          ┌─────────▼──────┐
                          │  Twilio         │
                          │  Voice / SMS    │
                          └────────────────┘
```

**External integrations:**
- **Stripe** — payments, deposits, quotes *(Phase 2)*
- **Meta WhatsApp Cloud API** — notifications and confirmations
- **Twilio** — inbound call logging
- **AWS S3** — project image storage
- **Cloudflare** — CDN, AVIF/WebP, DNS

---

## 2. Services and responsibilities

### vaneco-api *(formerly vaneco-leads)*

The main backend service. Started as a lead capture service and is evolving into the central business API. **One service that grows** — no premature microservices.

| Current module | Future module | Status |
|---|---|---|
| Leads capture | Leads + CRM | 🔄 In production |
| Projects / images | Public gallery | 🔄 In production |
| Twilio calls | Contact history | 🔄 In production |
| Auth (JWT) | Client + admin auth | 🔄 In production |
| — | Tickets / orders | ⏳ Phase 1 |
| — | Quoter | ⏳ Phase 1 |
| — | Stripe payments | ⏳ Phase 2 |
| — | Carpenter CRM | ⏳ Phase 3 |

### pvane.co *(frontend)*

Public site + client portal. Everything in a single Astro domain and repository.

| Route | Type | Status |
|---|---|---|
| `/` | SSG | ✅ Built |
| `/proyectos` · `/proyectos/[id]` | SSG + React island | ✅ Built |
| `/cita` | SSG + React island | ✅ Built (mock) — SSR when API lands |
| `/portal/*` | SSR + Auth guard | ⏳ Phase 2 |

> Route names resolved: `/proyectos` (gallery), `/proyectos/[id]` (detail),
> `/cita` (booking + quote-by-folio lookup). `/work`, `/book` and `/q/[token]`
> from earlier drafts are superseded.

---

## 3. Backend — vaneco-api

### Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | >=22.12.0 |
| Framework | NestJS | 11 |
| ORM | Prisma | 7 |
| DB Adapter | @prisma/adapter-pg | 7 |
| Database | PostgreSQL | 15+ |
| Auth | JWT + Passport | — |
| Password hashing | bcrypt | 6 |
| Logging | nestjs-pino | 4 |
| Storage | AWS S3 SDK v3 | — |
| Voice | Twilio | 5 |
| Messaging | Meta WhatsApp Cloud API | — |

### Module structure

```
src/
├── main.ts
├── app.module.ts
│
├── auth/                      ← JWT auth, guards, strategies
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── jwt-auth.guard.ts
│
├── users/                     ← Clients and admins
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.controller.ts
│
├── leads/                     ← Lead capture (existing)
│   ├── leads.module.ts
│   ├── leads.service.ts
│   └── leads.controller.ts
│
├── projects/                  ← Project gallery (existing)
│   ├── projects.module.ts
│   ├── projects.service.ts
│   └── projects.controller.ts
│
├── tickets/                   ← Work orders (Phase 1)
│   ├── tickets.module.ts
│   ├── tickets.service.ts
│   └── tickets.controller.ts
│
├── quotes/                    ← Quoter (Phase 1)
│   ├── quotes.module.ts
│   ├── quotes.service.ts
│   ├── quotes.controller.ts
│   └── pdf/
│       └── quote-pdf.service.ts
│
├── appointments/              ← Appointments (Phase 1)
│   ├── appointments.module.ts
│   ├── appointments.service.ts
│   └── appointments.controller.ts
│
├── payments/                  ← Stripe (Phase 2)
│   ├── payments.module.ts
│   └── payments.service.ts
│
├── notifications/             ← WhatsApp + Twilio centralized
│   ├── notifications.module.ts
│   ├── whatsapp.service.ts
│   └── twilio.service.ts
│
├── storage/                   ← S3 wrapper
│   ├── storage.module.ts
│   └── storage.service.ts
│
└── prisma/                    ← Global Prisma service
    └── prisma.service.ts
```

### Authentication

Stateless JWT — no refresh tokens in Phase 1.

```
POST /auth/login
  body: { email, password }
  response: { access_token }

Headers: Authorization: Bearer <token>
```

Two initial roles:
- `ADMIN` — full access (Roman, team)
- `CLIENT` — access only to their own orders and quotes

```ts
// jwt.strategy.ts
payload: {
  sub: string      // user id
  email: string
  role: 'ADMIN' | 'CLIENT'
  iat: number
  exp: number
}
```

### Base Prisma schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String?
  role      Role     @default(CLIENT)
  createdAt DateTime @default(now())

  tickets      Ticket[]
  quotes       Quote[]
  appointments Appointment[]
}

model Ticket {
  id          String       @id @default(cuid())
  status      TicketStatus @default(PENDING_VISIT)
  zone        Zone
  projectType ProjectType
  notes       String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  userId String
  user   User   @relation(fields: [userId], references: [id])
  quote  Quote?
}

model Quote {
  id           String      @id @default(cuid())
  status       QuoteStatus @default(DRAFT)
  sqft         Float
  material     String
  pricePerSqft Float
  laborCost    Float
  opsCost      Float
  exchangeRate Float
  total        Float
  pdfUrl       String?
  publicToken  String?     @unique
  createdAt    DateTime    @default(now())

  ticketId String @unique
  ticket   Ticket @relation(fields: [ticketId], references: [id])
}

model Appointment {
  id        String            @id @default(cuid())
  status    AppointmentStatus @default(PENDING)
  date      DateTime?
  zone      Zone
  notes     String?
  createdAt DateTime          @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id])
}

enum Role              { ADMIN CLIENT }
enum Zone              { TIJUANA ROSARITO TECATE }
enum ProjectType       { KITCHEN BATHROOM COMMERCIAL OUTDOOR OTHER }
enum TicketStatus      { PENDING_VISIT QUOTED APPROVED IN_FABRICATION INSTALLED CANCELLED }
enum QuoteStatus       { DRAFT SENT APPROVED REJECTED }
enum AppointmentStatus { PENDING CONFIRMED COMPLETED CANCELLED }
```

> **Folio — the client's key.** Booking a visit generates a **folio**
> (`COT-…`, backend-assigned; the frontend prototype mocks `COT-VNC-####`). The
> folio is the public, login-less handle a client uses to look up and pay their
> quote. It maps onto the models above (an appointment/ticket carries the folio;
> the quote is read by folio). The four client-facing statuses surfaced in
> `/cita` — `Cita agendada`, `Pendiente de pago`, `En fabricación`,
> `Cancelada` — are a simplified projection of `TicketStatus`/`QuoteStatus`.
> Quote math is fixed: **IVA 8%** (border region) and a **50% deposit** to move
> into fabrication.

---

## 4. Frontend — pvane.co

### Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Astro | 6.3.6 |
| UI Islands | React | 19 |
| Components | Custom design-system (`components/ui`) | — |
| Icons | lucide-react | 1.16 |
| Styles | Tailwind CSS | v4 — config via `@theme` in CSS |
| Tailwind plugin | @tailwindcss/vite | 4.3.0 |
| Images | Cloudflare Images + Astro Image | *(planned; StonePlaceholder for now)* |
| Transitions | Astro View Transitions | native |
| HTTP client | fetch + React Query | TanStack v5 *(installed; wired with API)* |
| Forms | React Hook Form + Zod | RHF 7 / Zod 4 *(installed; `/cita` uses plain `useState` until API)* |
| Cross-island state | Custom hooks over `window` CustomEvents + `localStorage` | `useLang`, `useTheme` |
| Global state | Zustand | *(planned — auth/portal, Phase 2)* |
| Adapter | **@astrojs/vercel** | 10 |

> ⚠️ **Tailwind v4** — no `tailwind.config.mjs`. Tokens live in `src/styles/global.css` inside `@theme { }`. The plugin is registered in `vite.plugins`, not in `integrations`.

### Folder structure

```
src/
├── components/
│   ├── ui/                ← design system — Navbar + MobileTopBar,
│   │                        FloatingBottomNav, Button, Footer, Controls, ThemeToggle
│   ├── home/              ← Home, StonePlaceholder (landing sections)
│   ├── projects/          ← ProjectGallery, ProjectDetail
│   ├── cita/              ← CitaFlow (booking + quote lookup)
│   └── (planned) portal/  ← OrderTimeline, QuoteView
│
├── layouts/
│   └── BaseLayout.astro   ← head, fonts, theme flash-guard inline script
│                            (PortalLayout planned for Phase 2)
│
├── data/
│   └── projects.ts        ← local mock data + derived filter options
│
├── pages/
│   ├── index.astro        ← SSG landing
│   ├── proyectos/
│   │   ├── index.astro    ← SSG gallery
│   │   └── [id].astro     ← SSG project detail
│   └── cita.astro         ← SSG + island (SSR once API-connected)
│
└── lib/
    ├── useLang.ts         ← shared ES/EN state across islands (CustomEvents)
    ├── useTheme.ts        ← shared dark/light state across islands
    └── (planned) api.ts, auth.ts, types
```

### Rendering per route

| Route | Output | Auth | Reason |
|---|---|---|---|
| `/` | SSG | No | SEO, static content |
| `/proyectos` | SSG | No | SEO, public gallery (filters run client-side in an island) |
| `/proyectos/[id]` | SSG | No | SEO per project, shareable URL |
| `/cita` | SSG → SSR | No (folio is the key) | Static now; SSR to create folios + read quotes |
| `/portal` | SSR | Yes | Real-time user data *(Phase 2)* |

### Auth guard in Astro

```ts
// portal/index.astro
---
import { getTokenFromCookie } from '@/lib/auth'

const token = getTokenFromCookie(Astro.cookies)
if (!token) return Astro.redirect('/login')
---
```

---

## 5. Infrastructure

### Current production setup

```
AWS Lightsail (512MB RAM / 1 vCPU)
├── Docker container — vaneco-api (NestJS)
├── nginx — reverse proxy + SSL termination
└── Let's Encrypt — automatic SSL certificate

AWS S3
└── bucket vaneco-projects — project images

DNS → Cloudflare
├── api.pvane.co → Lightsail IP
└── pvane.co    → Cloudflare Pages / Vercel (frontend)
```

### Scaling considerations

The 512MB Lightsail plan was sufficient for vaneco-leads. With the full API (tickets, quotes, Stripe webhooks) it is recommended to scale to **1GB RAM** before the Phase 1 launch.

**Local builds** — the limited server RAM causes Docker builds to fail. The established workflow is:

```bash
# Build locally on Apple Silicon Mac
docker buildx build --platform linux/amd64 -t ghcr.io/user/vaneco-api:latest .

# Push to GitHub Container Registry
docker push ghcr.io/user/vaneco-api:latest

# Pull on Lightsail
docker pull ghcr.io/user/vaneco-api:latest
```

### Critical environment variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/vaneco"

# Auth
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-west-2"
AWS_S3_BUCKET="vaneco-projects"

# WhatsApp
WHATSAPP_TOKEN="..."
WHATSAPP_PHONE_ID="..."
WHATSAPP_VERIFY_TOKEN="..."

# Twilio
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."

# Stripe (Phase 2)
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# App
NODE_ENV="production"
PORT=3000
FRONTEND_URL="https://pvane.co"
```

---

## 6. CI/CD

### Current pipeline — GitHub Actions

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  deploy:
    steps:
      - Build Docker image (local platform linux/amd64)
      - Push to GitHub Container Registry
      - SSH into Lightsail
      - docker pull + docker compose up -d
```

### Frontend deploy

```
pvane.co → Vercel (via @astrojs/vercel adapter)
  - Auto deploy on push to main (repo tres-sh/vaneco-web)
  - Preview deploys on PRs
  - Build Output API (.vercel/output) — static today, SSR functions when /cita connects
```

> **Adapter note:** the project originally used `@astrojs/node` (standalone),
> which produced a self-hosted Node server Vercel could not route (404 on every
> path). Swapped to `@astrojs/vercel@10` (Astro 6-compatible), which emits the
> Vercel Build Output format. Fully static pages ship as static; only
> non-prerendered routes become serverless functions.

---

## 7. Environment variables

### Secrets management

- **Local development** — `.env` (gitignored)
- **Production** — secrets in GitHub Actions + `.env` file on Lightsail
- **Never** — secrets in code or in the Dockerfile

### `.env.example` — always in the repo

```bash
# .env.example — template with no real values
DATABASE_URL=""
JWT_SECRET=""
JWT_EXPIRES_IN="7d"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_S3_BUCKET=""
WHATSAPP_TOKEN=""
WHATSAPP_PHONE_ID=""
WHATSAPP_VERIFY_TOKEN=""
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:4321"
```

---

## 8. Architecture decisions

### One service, not microservices

vaneco-leads mutates into vaneco-api instead of creating separate services. The reason: the team is one person. Microservices have operational overhead (multiple deployments, service discovery, inter-service communication) that is not justified until there are multiple teams. A well-modularized monolith is the right call here.

> "Make it work, make it right, make it fast" — in that order.

### PostgreSQL over MongoDB

Vaneco's data model is inherently relational — a ticket has a quote, a quote has line items, a user has multiple tickets. The relationships are strong and well-defined. PostgreSQL with Prisma is more appropriate than MongoDB for this case.

### Stateless JWT over sessions

No Redis, no server-side state. JWT tokens carry everything needed (id, email, role). Operational simplicity on a resource-constrained server.

### Astro over Next.js

80% of the site is static content (landing, gallery, SEO). Astro ships zero JS by default on static pages, which directly impacts Core Web Vitals and local SEO ("granite countertops Tijuana"). The dynamic 20% (portal) is handled with Astro SSR without needing a separate framework.

### S3 for storage, Cloudflare for delivery

Images are stored in S3 (durability, low cost) but served through Cloudflare (global CDN, automatic AVIF/WebP transformations). Separating storage from delivery is the right call for performance.

---

## Next steps

```
Phase 1 — Backend
[ ] Create tickets module with full CRUD
[ ] Create quotes module with cost engine
[ ] Create appointments module
[ ] PDF generation service (quote PDF)
[ ] Extend Prisma schema with new models

Phase 1 — Frontend
[x] Setup Astro + React + Tailwind (@theme tokens, dark default)
[x] Design-system components (Navbar/MobileTopBar, FloatingBottomNav, Button, Footer, Controls)
[x] Landing page (hero, stats, project teaser, process, CTA) — bilingual ES/EN
[x] Gallery /proyectos + /proyectos/[id] with material/color/finish filters
[x] Booking + quote-lookup /cita (folio flow, IVA 8%, payment UI) — mock data
[x] Deploy to Vercel (@astrojs/vercel adapter)
[ ] Connect gallery → api.pvane.co/projects (replace local mock)
[ ] Connect /cita → POST /appointments (create folio) + GET /cotizaciones/:folio (SSR)
[ ] Migrate /cita form to React Hook Form + Zod with loading/error states
[ ] Real project photography (replace StonePlaceholder)

Phase 2
[ ] Client portal (SSR + auth guard)
[ ] Stripe payment links (transfer/deposit) — folio → En fabricación
[ ] Order tracking timeline
```

---

*Living document — updated with every relevant technical decision.*