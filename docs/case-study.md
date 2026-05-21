# Vaneco — Case Study

**Type:** Founder-built product · Family business digitalization  
**Role:** Founder, Full-Stack Developer, UI/UX Designer  
**Status:** 🚧 In progress — documented in real time  
**Timeline:** 2016 (business founded) · 2025 (digitalization started)  
**Domain:** tres.sh/work/vaneco *(coming soon)*

---

## 1. Context

Vaneco is a natural stone and granite workshop based in Tijuana, Baja California — operating across Tijuana, Rosarito, and Tecate. The business was founded in 2016, though its roots go back further: my father has over 20 years of experience fabricating granite and stone surfaces.

The origin story is a pattern my father lived more than once. He is an exceptional fabricator — but not a salesperson. Throughout his career he attempted to partner with vendors who could handle sales while he handled production. Each time, the vendor eventually went independent, taking the clients and leaving him with just the craft. The lesson was clear: **the sale is as valuable as the product.**

In 2016, at 20 years old and with zero sales experience, I created the Facebook page and started posting in local groups. By 2019–2020 I had built a Python/Selenium bot to automate posting across Facebook groups — an early signal of how I think about solving operational problems with code.

Despite no formal advertising, Vaneco has completed **500+ projects** — residential and commercial — including multi-unit residential towers with 20+ apartments. Growth has been driven almost entirely by word-of-mouth from early clients. Today the core team is 4 family members: my father (fabrication), my brother (sales and operations, recently graduated in architecture), my cousin, and myself. On high-demand weeks we scale to 8 people through subcontracting.

### The problem in one sentence

> A business with 500+ completed projects and zero administration — everything lives in WhatsApp chats and in one person's memory.

Specific pain points:

- **No quote system** — estimates are sent as WhatsApp messages, no record, no follow-up
- **No client tracking** — contacts live in a phone, not a CRM
- **No financial visibility** — no trazability of income, costs, or margins
- **No pipeline** — no way to know what's coming next week
- **Dormant referral channels** — carpenters we collaborate with on job sites are a natural B2B referral source, but there's no system to activate or track them
- **No digital presence strategy** — clients find us despite the absence of one, not because of it

---

## 2. Challenge

### Why this is harder than it looks

Vaneco doesn't fit neatly into existing service business software. The quoting process is complex: pricing depends on square footage, material type, USD exchange rate fluctuations, zone-based labor costs, and per-project variables that live in the founder's head. A generic CRM doesn't understand that.

### Why not use an existing tool?

The obvious alternatives were considered:

| Tool | Why it didn't fit |
|---|---|
| Excel / Google Sheets | Manual, not scalable, doesn't connect to client flow |
| Jobber / ServiceTitan | Designed for US market, pricing in USD, no bilingual support, monthly cost with no ownership |
| HubSpot CRM | Overkill for pipeline, doesn't solve the quoting problem |
| WhatsApp + memory | The current state — and the problem itself |

The decision to build rather than buy was deliberate and has three motivations:

1. **No existing tool solves the full flow** — appointment → ticket → quote → payment → production tracking — for a cross-border stone workshop
2. **Technical capability** — my stack (NestJS, React, MongoDB, Prisma) allows building something more powerful and owned
3. **Strategic double value** — Vaneco is a real business and a real portfolio case study simultaneously. Building it myself generates proof of work that no off-the-shelf tool can provide

---

## 3. Process

### How the scope was defined

The starting point wasn't a feature list — it was mapping the current manual flow and finding where friction was highest:

```
Client contacts via WhatsApp
→ Roman responds manually
→ Visit is scheduled (no system)
→ Measurements taken on site
→ Quote calculated mentally
→ Price sent via WhatsApp message
→ Client says yes or negotiates
→ Work happens
→ Payment collected informally
→ No record of any of it
```

Every step is a leak. But not all leaks are equal. The highest-friction points for the business right now are:

1. **Quoting** — no PDF, no record, no professional presentation
2. **Appointment scheduling** — no system, fully manual coordination
3. **Client follow-up** — lost leads with no visibility

That defined the MVP scope: build the quoting tool first, then appointments, then the client portal.

### What was deprioritized (and why)

- **Inventory management** — not the bottleneck yet
- **Accounting integration** — future phase, needs cost model defined first
- **Public pricing** — pricing is too variable (USD/MXN rate, zone, material) to show publicly

### The cost model problem

Before building the quoter, the underlying pricing logic needed to exist. This required a structured exercise with the team to define:

- Real labor cost per square foot (people × daily wage ÷ sq ft produced per day)
- Material cost per sq ft by type (USD price × exchange rate × waste factor)
- Operational costs per zone (gas, consumables, travel time)
- Target margin per project type

This work was documented in a separate internal worksheet and will feed directly into the quoter's logic.

---

## 4. Solution

### The product: Vaneco Platform

A bilingual (EN/ES) web platform built on Astro + React covering the full quote-to-cash flow. The public site is optimized for performance and SEO — targeting both Spanish and English-speaking clients on the Tijuana/San Diego border. The internal tools digitize a process that previously lived entirely in WhatsApp and memory.

Everything lives under a single domain — `pvane.co` — with no separate subdomains for the portal or quoter.

### Phase 1 — Internal tools *(current focus)*

The highest-friction points in the current workflow are quotation and appointment scheduling.

**Cost model engine** — before writing any UI, the pricing logic had to exist. A structured exercise with the operations team defined the real cost per square foot: labor (people × daily wage ÷ sq ft produced per day), material (USD price × exchange rate × waste factor), and operational costs per zone. This cost model feeds directly into the quoter.

**Quote builder** — the team enters measurements and material selection after a site visit. The system calculates the total automatically, applies the current exchange rate, adjusts for zone, and generates a branded PDF ready to send via WhatsApp in under 5 minutes.

**Appointment request form** — a client-facing form capturing name, phone, zone, and project type. On submission, a ticket is created internally and the client receives a WhatsApp confirmation via the existing Meta Cloud API infrastructure.

### Phase 2 — Client portal

**Client login** — clients view their order status, quote breakdown, and production progress. Status flow: Pending Visit → Quoted → Approved → In Fabrication → Installed.

**Digital quote approval** — instead of a WhatsApp "yes", clients review the full quote online and approve with a click. A Stripe deposit payment link is generated automatically on approval.

**Order tracking** — a timeline view of each project milestone. No more "how is my countertop coming along?" calls.

### Phase 3 — Growth layer

**Carpenter referral network** — carpenters who collaborate on job sites are a natural B2B referral channel. Phase 3 tracks referral partners, their projects, and commissions — activating a channel that currently generates zero tracked revenue.

**Lead capture integration** — Facebook/Instagram inbound messages connect to the internal ticket system, ending the cycle of lost DM conversations.

**Automated follow-up** — quotes that don't convert within 48 hours trigger an automated WhatsApp follow-up via the Meta Cloud API service already in production at `api.pvane.co`.

---

## 4.5 Design System

Building Vaneco as a founder-developer means every decision has a double purpose: it serves the business and demonstrates technical judgment. Rather than using a generic component library, the UI was designed from scratch as a complete design system — documented in parallel with development.

### Design philosophy

> **"Empresa tecnológica de granito"** — the brand positioning drove every visual decision. The aesthetic needed to feel like a precision tech product, not a local contractor website.

The result: a dark-first editorial system inspired by the materials themselves. The color palette is strict black/white/gray. The accent color, **Veta** (`#9BA8B0`), is a cool blue-gray extracted from the veining of Gris Rochelle and Blue Marble — the exact tones that appear in Vaneco's own materials.

### Typefaces

**Franchise** (display) — bold, geometric, all-caps. Hero titles, section headers, logotype. Creates immediate visual authority.

**Chillax** (body/UI) — geometric sans with personality. All UI text, buttons, and body copy. Pairing with Franchise creates contrast between editorial impact and functional clarity.

### Color hierarchy

The system uses a layered depth model — darker backgrounds recede, lighter surfaces come forward.

- Dark mode: Base `#0A0A0A` → Surface `#141414` → Elevated `#1F1F1F` → Text `#F5F5F5`
- Light mode: Base `#EFEFEF` → Surface `#FFFFFF` → Elevated `#F5F5F5` → Text `#0A0A0A`

### Components built

| Component | Variants | Status |
|---|---|---|
| Button | primary, secondary, ghost, destructive · sm/md/lg · loading/disabled · dark mode | ✅ Code complete |
| ThemeToggle | sun/moon animation · localStorage persistence | ✅ Code complete |
| Input | text, select, textarea, phone, date, password, file · floating label · underline style | ✅ Designed |
| Card | sm/md/lg · hover reveal · image + info below | ✅ Designed |
| Badge | simple, dot, icon, action, notification · 6 semantic variants | ✅ Designed |
| Navbar | desktop centered · settings dropdown · EN/ES toggle | ✅ Designed |
| FloatingBottomNav | pill animation · Book CTA always visible · iOS-native feel | ✅ Designed |

### Key design decisions

**Underline inputs over outlined** — floating label + underline removes visual noise. On dark backgrounds, outlined inputs create too many rectangular shapes competing with stone photography.

**Floating bottom nav over hamburger** — a floating pill nav with a persistent Book CTA keeps the primary conversion action always one tap away on mobile.

**Settings in a dropdown** — language and theme preferences are power-user features. A gear icon keeps the nav clean for first-time visitors while remaining accessible for returning clients.

**Hover reveal gallery** — the photography is the product. Cards show only the image at rest; metadata appears on hover. The stone work sells itself before any text intervenes.

---

## 5. Stack

### Architecture

Everything lives under a single domain — `pvane.co`. No separate subdomains for the portal or quoter. Astro handles both static and dynamic routes in the same project.

```
pvane.co/              ← static (Astro SSG) — landing, gallery, SEO
pvane.co/book          ← static + React island — appointment form
pvane.co/portal/*      ← server rendered (Astro SSR) — client portal
pvane.co/quote/*       ← server rendered (Astro SSR) — quoter

api.pvane.co           ← NestJS API (already in production)
```

### Why Astro over Next.js

The decision came down to the nature of the product — 80% content (landing, gallery, SEO) and 20% app (portal, quoter). Astro ships zero JavaScript by default on static pages, which directly impacts Core Web Vitals and Google ranking. For a business where clients search "granite countertops Tijuana", that matters.

Next.js would have been the safer choice for the portal, but Astro SSR handles the complexity without the overhead. One framework, one domain, one deployment.

### Tech stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Astro | SSG + SSR hybrid, View Transitions native, zero JS by default |
| UI Islands | React | Daily expertise at G-WMS, stronger in remote job market |
| Components | shadcn/ui | Owned components, no version dependency, adapts to design system |
| Styling | Tailwind CSS | Utility-first, consistent with shadcn/ui |
| Transitions | Astro View Transitions | Native, no extra libraries, premium feel on gallery navigation |
| Images | Cloudflare Images | CDN nodes in Tijuana/LA/SD, AVIF + WebP auto-conversion, ~$5/mo |
| Backend | NestJS + Prisma | Already in production at api.pvane.co |
| Database | PostgreSQL | Relational model fits quote/order/client structure |
| Payments | Stripe | Payment links, deposit flows, quote approval |
| Notifications | Meta WhatsApp Cloud API | Already built in vaneco-leads service |
| Auth | JWT (TBD) | Simple client auth |
| Hosting | AWS Lightsail + Docker | Existing infra, consistent with api.pvane.co |
| PDF | react-pdf (TBD) | Quote PDF generation |

### Design system

- **Typefaces:** Franchise (display/headings) + Chillax (body/UI)
- **Palette:** Pure white / black / grays — no accent color, the stone speaks in photos
- **Tokens:** Defined as Figma local variables, mirrored in Tailwind config
- **Language:** Bilingual EN/ES — toggle in nav, full content switch

---

## 6. Results

> 🚧 *To be completed as the system ships.*

### Baseline (before system)

| Metric | Current state |
|---|---|
| Time to generate a quote | 24–48 hrs (manual WhatsApp) |
| Quote format | Plain text message |
| Client records | Phone contacts + chat history |
| Financial visibility | None |
| Active pipeline | None — reactive only |
| Referral channel activation | 0 carpenters tracked |

### Target (post-system)

| Metric | Goal |
|---|---|
| Time to generate a quote | < 5 minutes |
| Quote format | Branded PDF with line items |
| Client records | CRM with full history |
| Financial visibility | Revenue per project, per month |
| Active pipeline | Visible, manageable |
| Referral channel | Carpenter network tracked and activated |

---

## 7. Learnings

> 🚧 *To be written at the end of Phase 1.*

*Planned topics:*
- What it's like to be the client, the developer, and the salesperson simultaneously
- Why defining the cost model before writing code was the right call
- What building for your own family teaches you about requirements gathering
- The double-edged sword of being a technical founder in a non-technical business

---

## About the author

**Roman Tercero** — Full-Stack Developer based in Tijuana, México.  
Currently building Vaneco while working as a developer at G-Global (3PL warehouse management systems).  
Interested in the intersection of software, small business, and the US-Mexico border economy.

[tres.sh](https://tres.sh) · [GitHub](#) · [LinkedIn](#)

---

*This case study is documented in real time as the product is built. Last updated: 2025.*