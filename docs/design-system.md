# Vaneco Design System

**Version:** 0.3.0 — In use across the full public site (8 pages)  
**Stack:** Astro + React + Tailwind v4 + custom components  
**Last updated:** July 2026

> **Update (July 2026):** the system is now implemented across the public site
> (landing, gallery + detail, materials, about, FAQ, booking/quote, privacy).
> Notable changes from the original spec, reflected below:
> - **Logotype is a single color** (`--text-primary`) — the "co" is **never**
>   tinted veta (earlier drafts colored it; that is now a hard rule).
> - Navbar drops the settings dropdown in favor of an inline **ES/EN segmented
>   pill + fixed theme button + CTA**; a compact **MobileTopBar** carries logo +
>   controls on small screens.
> - Nav grew to **five links** — `Inicio · Proyectos · Materiales · Nosotros ·
>   FAQ` — and every footer now links **Privacidad**.
> - New content-page primitives shipped: a no-JS **FAQ accordion** (`<details>`),
>   a **consent checkbox**, **material spec tables**, **service-area cards**, and
>   a **document layout** (`/privacidad`). See §2.7.
> - Added the **inverse token pair** `--invert-bg` / `--invert-fg` for primary
>   buttons, active pills/chips and inverted cards.
> - Franchise now falls back to **'Anton'** while it loads.
> - Buttons ship as simple `PrimaryBtn` / `SecondaryBtn` (§2.1); the fuller
>   CVA multi-variant remains the target API.

---

## Table of Contents

1. [Foundations](#1-foundations)
   - [Typography](#11-typography)
   - [Color System](#12-color-system)
   - [Spacing](#13-spacing)
   - [Border Radius](#14-border-radius)
2. [Components](#2-components)
   - [Button](#21-button)
   - [ThemeToggle](#22-themetoggle)
   - [Input](#23-input)
   - [Card](#24-card)
   - [Badge / Chip](#25-badge--chip)
   - [Navbar](#26-navbar)
3. [Project Architecture](#3-project-architecture)
4. [Figma Notes](#4-figma-notes)

---

## 1. Foundations

### 1.1 Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / Headings | Franchise | Regular | Hero titles, section headers, logo |
| Body / UI | Chillax | 300–600 | Body text, buttons, labels, inputs |

**Type scale:**

| Token | Font | Size | Usage |
|---|---|---|---|
| `display` | Franchise | 48px | Main hero |
| `heading-1` | Franchise | 32px | Section titles |
| `heading-2` | Chillax 600 | 20px | Subtitles, card titles |
| `body` | Chillax 400 | 15px | Body text |
| `caption` | Chillax 300 | 12px | Labels, metadata |

**Installation:**
- Franchise → [fontsquirrel.com](https://www.fontsquirrel.com) — free
- Chillax → [fontshare.com](https://www.fontshare.com) — free

**Tailwind v4 — fonts in global.css:**
```css
@theme {
  /* 'Anton' is the loading/fallback face for Franchise (same condensed all-caps feel) */
  --font-franchise: 'Franchise', 'Anton', 'Arial Black', sans-serif;
  --font-chillax:   'Chillax', 'DM Sans', sans-serif;
}
```

> **Franchise fallback:** Anton is imported alongside Franchise so headings and
> figures keep their condensed all-caps silhouette before Franchise finishes
> loading (avoids a layout/serif flash).

Usage in components:
```html
<h1 class="font-franchise">VANECO</h1>
<p class="font-chillax">Natural stone workshop</p>
```

---

### 1.2 Color System

#### Base palette

| Token | HEX | Usage |
|---|---|---|
| `black` | `#0A0A0A` | Primary text light, primary buttons |
| `gray-950` | `#141414` | Dark surface |
| `gray-900` | `#1F1F1F` | Dark elevated |
| `gray-800` | `#2E2E2E` | Dark borders |
| `gray-700` | `#4A4A4A` | Ghost text dark |
| `gray-500` | `#6B6B6B` | Icons, secondary text |
| `gray-400` | `#9B9B9B` | Muted text |
| `gray-300` | `#5A5A5A` | Labels, captions |
| `gray-100` | `#E0E0E0` | Light borders |
| `gray-50` | `#F5F5F5` | Light elevated |
| `white` | `#FFFFFF` | Light surface |
| `off-white` | `#EFEFEF` | Light base (page background) |

#### Accent — Veta

Inspired by the veining of blue-gray marble (Gris Rochelle, Blue Marble).

| Token | HEX | Usage |
|---|---|---|
| `veta` | `#9BA8B0` | Primary accent |
| `veta-light` | `#DCE3E7` | Hover states, soft backgrounds |
| `veta-dark` | `#5C6B73` | Active / pressed |

#### Dark mode (default)

```
Base       #0A0A0A   ← page background (darkest)
Surface    #141414   ← cards, nav (one step lighter)
Elevated   #1F1F1F   ← elements on top of cards
Border     #2E2E2E   ← separators, card borders
```

#### Light mode

```
Base       #EFEFEF   ← page background (lightest)
Surface    #FFFFFF   ← cards, nav (pure white, they stand out)
Elevated   #F5F5F5   ← elements on top of cards
Border     #E0E0E0   ← separators
```

#### Visual hierarchy rule

> **Lighter = closer = more hierarchy**

In dark mode, lighter elements have more visual hierarchy — the eye reads them as closer. In light mode the inverse applies: higher contrast with the background = higher hierarchy.

```
Dark:  Base (#0A0A0A) → Surface (#141414) → Elevated (#1F1F1F) → Text (#F5F5F5)
Light: Base (#EFEFEF) → Surface (#FFFFFF) → Elevated (#F5F5F5) → Text (#0A0A0A)
```

#### Semantic colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `text-primary` | `#0A0A0A` | `#F5F5F5` | Primary text |
| `text-secondary` | `#6B6B6B` | `#9B9B9B` | Secondary text |
| `text-muted` | `#9B9B9B` | `#5A5A5A` | Labels, captions |
| `bg-base` | `#EFEFEF` | `#0A0A0A` | Page background |
| `bg-surface` | `#FFFFFF` | `#141414` | Cards, nav |
| `bg-elevated` | `#F5F5F5` | `#1F1F1F` | On top of cards |
| `border-default` | `#E0E0E0` | `#2E2E2E` | General borders |
| `border-strong` | `#B0B0B0` | `#4A4A4A` | Emphasis borders, hover |
| `invert-bg` | `#0A0A0A` | `#F5F5F5` | **Inverse fill** — primary buttons, active pills |
| `invert-fg` | `#F5F5F5` | `#0A0A0A` | **Inverse text** — on top of `invert-bg` |

#### Inverse pair — the "flip" primitive

`--invert-bg` / `--invert-fg` are the opposite of the current mode's
base/text. They power everything that must read as *the primary action*:
primary buttons, the active segment of the ES/EN pill, active filter chips, and
inverted cards. Because they flip with the theme, a primary button is a black
pill on light mode and a white pill on dark — always maximum contrast. Hover on
primary/secondary buttons swaps between the inverse fill and an outline (the
"color inversion on hover" rule), both directions.

```css
:root  { --invert-bg: #F5F5F5; --invert-fg: #0A0A0A; } /* dark mode */
.light { --invert-bg: #0A0A0A; --invert-fg: #F5F5F5; }
```

#### Tailwind v4 — tokens in global.css

> ⚠️ **Tailwind v4** — no `tailwind.config.mjs`. All tokens live in `src/styles/global.css` with `@theme`.

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-veta:       #9BA8B0;
  --color-veta-light: #DCE3E7;
  --color-veta-dark:  #5C6B73;

  --color-gray-950: #141414;
  --color-gray-900: #1F1F1F;
  --color-gray-800: #2E2E2E;
  /* ... rest of tokens */
}

/* Semantic CSS variables per mode */
:root {
  --bg-base:     #0A0A0A;
  --bg-surface:  #141414;
  /* ... dark mode defaults */
}

.light {
  --bg-base:     #EFEFEF;
  --bg-surface:  #FFFFFF;
  /* ... light mode overrides */
}
```

Tokens work the same in classes:
```html
<div class="bg-veta text-gray-950 font-franchise">
```

The plugin goes in `vite.plugins`, not in `integrations`:
```js
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: { plugins: [tailwindcss()] }
})
```

---

### 1.3 Spacing

4px base system.

| Token | Value | Tailwind |
|---|---|---|
| `--space-1` | 4px | `p-1` |
| `--space-2` | 8px | `p-2` |
| `--space-3` | 12px | `p-3` |
| `--space-4` | 16px | `p-4` |
| `--space-6` | 24px | `p-6` |
| `--space-8` | 32px | `p-8` |
| `--space-12` | 48px | `p-12` |
| `--space-16` | 64px | `p-16` |
| `--space-20` | 80px | `p-20` |

---

### 1.4 Border Radius

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `--radius-none` | 0px | `rounded-none` | Dividers |
| `--radius-sm` | 4px | `rounded-sm` | Small badges |
| `--radius-md` | 8px | `rounded-md` | Internal inputs |
| `--radius-lg` | 10px | `rounded-[10px]` | **Buttons, badges** |
| `--radius-xl` | 12px | `rounded-xl` | Cards, modals |
| `--radius-2xl` | 16px | `rounded-2xl` | Large cards |
| `--radius-pill` | 999px | `rounded-full` | Tags, avatars |

> **Note:** Buttons use `10px` — visibly rectangular with rounded corners. Not pill.

---

## 2. Components

### 2.1 Button

**File:** `src/components/ui/Button.tsx`  
**Dependencies:** `lucide-react`

> **Shipped today:** two link-style components — `PrimaryBtn` (inverse fill,
> trailing `↗`) and `SecondaryBtn` (outline). Both are radius 10, `active:scale(0.96)`,
> and invert colors on hover in 200ms. `/cita`'s submit is a matching native
> `<button>`. The full CVA `Button` API below (variants/sizes/loading) is the
> target once forms wire to the API and need loading/disabled states.

```tsx
import { PrimaryBtn, SecondaryBtn } from "@/components/ui/Button"

<PrimaryBtn href="/cita">Agendar visita</PrimaryBtn>          {/* → text + ↗ */}
<SecondaryBtn href="/proyectos">Ver proyectos</SecondaryBtn>
<PrimaryBtn href="/cita" full>Quiero algo así</PrimaryBtn>    {/* full-width */}
```

#### Variants *(target CVA API)*

| Variant | Description | Usage |
|---|---|---|
| `primary` | Black background, white text. Inverts on hover. | Main CTA — "Book a visit" |
| `secondary` | Black outlined. Fills on hover. | Secondary CTA — "See our work" |
| `ghost` | Light gray border. Subtle fill on hover. | Tertiary actions — "Back", "Learn more" |
| `destructive` | Soft red. Intense red fill on hover. | Dangerous actions — "Cancel", "Delete" |

#### Sizes

| Size | Font | Padding | Usage |
|---|---|---|---|
| `sm` | 12px | `7px 13px` | Table actions, badges with action |
| `md` | 14px | `10px 18px` | **Default** — general use |
| `lg` | 16px | `13px 24px` | Hero CTAs, main sections |

#### States

| State | Implementation |
|---|---|
| `default` | Variant base style |
| `hover` | Color inversion (primary/secondary) or subtle fill (ghost) |
| `loading` | Spinner + text, auto `disabled` |
| `disabled` | `opacity: 0.38`, `cursor: not-allowed` |
| `active` | `scale(0.96)` |
| `focus-visible` | 2px ring for accessibility |

#### Animations

- Hover → color inversion in `200ms`
- `btn-icon-right` → `translateX(2px)` on hover
- Destructive `btn-icon` → `scale(1.1)` on hover
- Active → `scale(0.96)`

#### Dark mode

All buttons have a defined dark version via `dark:` classes:

- `primary dark` → white background, black text. Hover to dark background.
- `secondary dark` → white outlined. Hover fills white.
- `ghost dark` → dark gray border. Subtle hover.
- `destructive dark` → desaturated red. Hover fills red.

#### Props

```ts
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   'primary' | 'secondary' | 'ghost' | 'destructive'
  size?:      'sm' | 'md' | 'lg'
  loading?:   boolean
  leftIcon?:  React.ReactNode
  rightIcon?: React.ReactNode
}
```

#### Usage

```tsx
import { Button } from "@/components/ui/Button"
import { ArrowRight, Calendar, Trash2 } from "lucide-react"

// Main CTA
<Button variant="primary" rightIcon={<ArrowRight size={15} />}>
  Book a visit
</Button>

// With left icon
<Button variant="secondary" leftIcon={<Calendar size={16} />}>
  Schedule visit
</Button>

// Loading
<Button variant="primary" loading>
  Sending...
</Button>

// Icon only
<Button variant="ghost" className="px-3" aria-label="Delete">
  <Trash2 size={16} />
</Button>
```

#### Installation

```bash
npm install class-variance-authority lucide-react
```

---

### 2.2 ThemeToggle

**File:** `src/components/ui/ThemeToggle.tsx`  
**Dependencies:** `lucide-react`

Toggle component for dark/light mode. **Dark is the product default.**

> In the shipped nav, the toggle is the `ThemeButton` from `Controls.tsx`
> (§2.6). `ThemeToggle.tsx` remains as a standalone design-system component. The
> `light`/`dark` class on `<html>` and `localStorage` (`vaneco-theme`) are owned
> by an inline flash-guard script in `BaseLayout.astro`; islands only read the
> current value and broadcast `vaneco:theme-change` (see `useTheme`).

#### Behavior

- First paint → inline script in `BaseLayout` sets `dark` unless `vaneco-theme`
  is explicitly `light` (dark-first product default; no theme flash).
- On click → dispatches `vaneco:theme-change`; the layout syncs the class + `localStorage`.
- Islands stay in sync via the shared `useTheme` hook.

#### Visual

- Background always `#1A1A1A` — does not invert with mode
- White sun/moon icon — rotation + scale spring bounce animation
- `border-radius: 10px` — consistent with buttons

#### Usage in Astro

```astro
---
import { ThemeToggle } from "@/components/ui/ThemeToggle"
---

<nav>
  <ThemeToggle client:load />
</nav>
```

> `client:load` is required because the component accesses `localStorage` and `window`.

---

### 2.3 Input

**Style:** Underline — bottom border only, no lateral border

> **Shipped in `/cita`** (`components/cita/CitaFlow.tsx`): underline inputs with
> an uppercase 11px `--text-muted` label and veta focus border — text, email,
> `select` (tipo de trabajo, horario), native `date`, and the **`+52` fixed
> phone prefix**. The folio lookup uses an uppercase, letter-spaced variant. A
> reusable `Input.tsx` with floating labels + RHF `forwardRef` is still pending;
> the built fields are plain controlled inputs sharing an `inputCls` string.

#### Available types

| Type | Description |
|---|---|
| `text` | Text input with floating label |
| `email` | Email input with optional icon |
| `password` | Show/hide toggle + strength indicator |
| `select` | Dropdown with animated chevron |
| `textarea` | Multiline with character counter |
| `phone` | Fixed MX prefix + input |
| `date` | Native date picker with color-scheme |
| `file` | Upload with empty and selected states |

#### States

| State | Behavior |
|---|---|
| `default` | Gray line `#2E2E2E`, label centered inside |
| `focus` | Animated Veta line `#9BA8B0`, label floats up |
| `filled` | Label small at top `11px`, value visible |
| `error` | Red line `#EF4444`, red label, message below |
| `disabled` | `opacity: 0.38`, `cursor: not-allowed` |

#### Floating label

The label floats up on focus or when there is a value (`has-value`). Transition `cubic-bezier(0.4, 0, 0.2, 1)` in 200ms.

#### Focus accent

All inputs use `#9BA8B0` (Veta) as the focus color — bottom line and label.

---

### 2.4 Card

> **Shipped as the project card** (`components/projects/ProjectGallery.tsx`):
> clickable `--bg-surface` card, radius 16, image + floating material/type chips,
> optional "📍 Público" badge, and a footer with title / ft² / `colorName ·
> finishName`. Until real photography lands, the image slot renders
> **`StonePlaceholder`** — a marked stone-textured placeholder with the Vaneco
> watermark and a "demo" tag (`components/home/StonePlaceholder.tsx`). A generic
> `Card.tsx` primitive is not yet extracted.

#### Anatomy

```
[project image]                ← 100% width
 [Material badge] [Type badge] ← floating top left
                 [View project →] ← appears on hover, bottom right

Project title                  ← below image, Franchise bold
Material · Zone                ← muted meta with dot separator
```

#### Sizes

| Size | Image height | Usage |
|---|---|---|
| `sm` | 200px | Compact gallery, sidebar |
| `md` | 240px | **Default** — gallery grid |
| `lg` | 300px | Featured card, hero card |

#### Hover behavior

- Image does subtle `scale(1.04)` — `500ms`
- Gradient overlay appears from bottom — `opacity 0.3s`
- `View project →` CTA does `translateY(-6px) → 0` — slide-up
- Card does `translateY(-5px)` with elevated `box-shadow`
- `border-radius: 16px`

#### Badges on the card

Use Badge component variants — `badge-material` (Veta) for stone type, `badge-type` (neutral) for work type, `badge-zone` for zone.

---

### 2.5 Badge / Chip

**Shape:** `border-radius: 10px` — consistent with buttons

> **Shipped in use, not yet a shared component.** The four semantic variants
> below drive the **folio status badges** in `/cita` (`Cita agendada` = veta,
> `Pendiente de pago` = warning, `En fabricación` = success, `Cancelada` =
> danger — with a leading status dot). Chips also appear as the **filter chips**
> in `/proyectos` (active = inverse pair, color group with a swatch dot) and the
> **material/type chips** over project images. A single `Badge.tsx` primitive is
> still pending; the styles live inline in each island (`StatusBadge`, `Chip`).

#### Simple variants

| Variant | Background | Text color | Usage |
|---|---|---|---|
| `default` | `#1F1F1F` | `#9B9B9B` | Generic tags |
| `veta` | `rgba(155,168,176,0.12)` | `#9BA8B0` | Material, accent |
| `success` | `rgba(34,197,94,0.1)` | `#4ADE80` | Installed |
| `warning` | `rgba(245,158,11,0.1)` | `#FCD34D` | In fabrication |
| `danger` | `rgba(239,68,68,0.1)` | `#FCA5A5` | Cancelled |
| `solid` | `#F5F5F5` | `#0A0A0A` | Featured |

#### Sizes

| Size | Font | Padding |
|---|---|---|
| `sm` | 10px | `3px 8px` |
| `md` | 12px | `5px 10px` |
| `lg` | 13px | `7px 13px` |

#### Variants with accessories

- **With dot** — circular status indicator on the left
- **With icon** — any icon to the left of the text
- **Action badge** — label + separator + action button (two parts)
- **Notification badge** — boxed icon + text + animated arrow

#### Usage in orders (work statuses)

```tsx
<Badge variant="success" dot>Installed</Badge>
<Badge variant="warning" dot>In fabrication</Badge>
<Badge variant="veta" dot>Pending visit</Badge>
<Badge variant="danger" dot>Cancelled</Badge>
<Badge variant="default" dot>Draft</Badge>
```

#### Action badge in hero

```tsx
<BadgeAction
  label="Available this week"
  icon={<Calendar size={12} />}
  action="3 slots →"
/>
```

---

### 2.6 Navbar

**Files:** `src/components/ui/Navbar.tsx` (exports `Navbar` + `MobileTopBar`) ·
`src/components/ui/FloatingBottomNav.tsx` · `src/components/ui/Controls.tsx`
(`LangToggle`, `ThemeButton`) — **✅ code complete.**

#### Desktop layout (`Navbar`, hidden < md)

```
vaneco   Inicio Proyectos Materiales Nosotros FAQ    [ES|EN]  [☾]  [Agendar visita ↗]
```

- **Logo left** — Franchise 28px, **single color** `--text-primary`. The "co" is
  never tinted (hard rule — see the July 2026 note at the top).
- **Links centered** — `Inicio · Proyectos · Materiales · Nosotros · FAQ`,
  absolute `left: 50%`. Active link → `--text-primary` + animated `scaleX` veta
  underline (2px). The active page is set per-route via a `currentPath` prop.
- **Right cluster** (gap 12): **ES/EN segmented pill** → **theme button** → CTA.
- **CTA** — `Agendar visita ↗` / `Book a visit ↗` → `/cita`, inverse-fill, radius 10.
- **Scrolled state** — `backdrop-filter: blur` + translucent base background.

#### ES/EN pill + theme button (`Controls.tsx`)

- **`LangToggle`** — segmented pill, radius 10. Active segment uses the inverse
  pair (`--invert-bg`/`--invert-fg`); persists to `localStorage` and broadcasts
  `vaneco:lang-change` so every island switches copy at once.
- **`ThemeButton`** — fixed `#1A1A1A` background with a **white** sun/moon icon.
  It does **not** invert with the theme (deliberate constant), radius 10,
  spring press. Broadcasts `vaneco:theme-change`.

> The earlier `⚙` settings-dropdown (language + theme + WhatsApp/email) is
> **superseded** by the inline pill + theme button. Contact now lives in the
> footer and the WhatsApp card in `/cita`.

#### Mobile top bar (`MobileTopBar`, hidden ≥ md)

```
vaneco                               [ES|EN]  [☾]
```

Logo + compact `LangToggle` + `ThemeButton` only. No links or CTA — primary
navigation lives in the floating bottom nav.

#### Mobile — Floating Bottom Nav

```
[Inicio] [Galería] [Agendar] [Contacto] [Ajustes]
```

- **Floating** — not full width, centered, `border-radius: 18px`, ~20px off bottom.
- **Glass** — `background: rgba(20,20,20,0.85)` + `backdrop-filter: blur(16px)` + 1px `#2E2E2E`.
- **Animated pill** — active item expands to `[icon] Label` with a max-width transition.
- **Agendar always highlighted** — veta tint background, veta icon → `/cita`; it
  sits outside the active-pill system so it never competes with the active item.
- **Inactive items** — icon only (`#9B9B9B`).
- **Animation** — `cubic-bezier(0.34,1.2,0.64,1)` — native iOS-like bounce.
- **Active resolution** — from `currentPath`: `/` → Inicio, `/proyectos` →
  Galería; on `/cita` no pill is active (the highlighted Agendar carries context).
- Icons: `lucide-react`, 18px.

#### Active pill behavior

```
Inactive: [icon]        ← padding ~10px, no text
Active:   [icon] Label  ← text appears with a max-width transition, bg #2E2E2E
```

---

### 2.7 Content-page primitives (July 2026)

Shipped for `/materiales`, `/nosotros`, `/faq`, `/privacidad`. All are SSG
markup (no islands beyond the shared nav/footer), so the content is in the HTML
for SEO.

**FAQ accordion** (`/faq`) — native `<details name="faq">` per item so exactly
one is open at a time and the first is `open` by default, **no JavaScript
required**. The native marker is hidden; a `+`/`−` sign is driven purely by
`details[open]` in CSS. Group titles are Franchise 26px uppercase `veta-dark`;
rows separated by `--border-default`. Answers live in the served HTML — the
`FAQPage` JSON-LD is generated from the same `data/faq.ts` source.

**Consent checkbox** (`/cita`, LFPDPPP) — custom 20×20 box, radius 6: unchecked =
`--border-default` outline on transparent; checked = veta fill + border with a
`#0A0A0A` check. The whole row (box + text) is one `<label>`; the "Aviso de
Privacidad" link opens `/privacidad` in a new tab. The submit button is
`disabled` (opacity 0.4, `cursor-not-allowed`) until checked, with microcopy
below. State: `consent: boolean` in the `/cita` island; `submitForm` requires it.

**Material spec table** (`/materiales`) — `dl` with rows `grid [220px | 1fr]`,
border-top, label `--text-muted` 13px / value 500 14px. Generated by mapping
`data/materials.ts`; each section links `/proyectos?material=…` (the gallery
reads that param).

**Service-area cards** (`/nosotros`) — surface cards, radius 16: city name in
Franchise 30px + optional veta "Taller" badge + a short note.

**Document layout** (`/privacidad`) — centered `max-w-[760px]` article; H1
Franchise, section headings as `h3` (Chillax 600 — `h3` avoids the global
`h1,h2 → Franchise` rule), body Chillax 300.

---

## 3. Project Architecture

```
pvane.co/              ← Astro SSG — landing (hero, stats, teaser, process, CTA)
pvane.co/proyectos     ← SSG + island — gallery + filters
pvane.co/proyectos/[id]← SSG — project detail
pvane.co/materiales    ← SSG — materials guide (ItemList schema)
pvane.co/nosotros      ← SSG — about the workshop
pvane.co/faq           ← SSG — FAQ accordion (FAQPage schema)
pvane.co/cita          ← SSG + island — booking + quote lookup by folio
pvane.co/privacidad    ← SSG — privacy notice (LFPDPPP)
pvane.co/portal/*      ← Astro SSR — client portal (Phase 2)

api.pvane.co           ← NestJS API (in production)
```

### Why Astro over Next.js

- Zero JavaScript by default on static pages
- Native View Transitions — no extra libraries
- SSG + SSR hybrid in the same project and domain
- Better Core Web Vitals for visual content pages (project gallery)
- 80% of the site is static content — Astro wins clearly

### Full stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Astro 6 | SSG+SSR hybrid, View Transitions, zero JS default |
| UI Islands | React 19 | Daily expertise at G-WMS, job market strength |
| Components | Custom design system | Owned components (`components/ui`), no library dependency |
| Styles | Tailwind CSS v4 | Utility-first, tokens in `@theme` |
| Transitions | Astro View Transitions | Native, premium feel on gallery |
| Images | Cloudflare Images | CDN in TJ/LA/SD, AVIF+WebP auto |
| Backend | NestJS + Prisma | Already in production at api.pvane.co |
| Database | PostgreSQL | Relational model for quote/order/client |
| Payments | Stripe | Payment links, deposits, quote approval |
| Notifications | Meta WhatsApp Cloud API | Already built in vaneco-leads |

---

## 4. Figma Notes

### Initial setup

1. Install **Franchise** (fontsquirrel.com) and **Chillax** (fontshare.com)
2. Create a **Local variable collection** called `Vaneco Tokens`
3. Add the colors from section [Color System](#12-color-system) as variables
4. Create two modes: `Dark` (default) and `Light`
5. Create **Text Styles**: `Display/Franchise`, `Heading-1`, `Heading-2`, `Body`, `Caption`

### Base grid

- Desktop: 12 columns, 24px gutter, 80px margin
- Tablet: 8 columns, 16px gutter, 40px margin
- Mobile: 4 columns, 16px gutter, 20px margin

### Brand Guide — Figma documentation order

```
1. Moodboard        ← visual feeling (stone, texture, border)
2. Color Palette    ← swatches with HEX/RGB/CMYK
3. Typography       ← Franchise + Chillax in scale
4. Spacing + Grid   ← spacing tokens
5. Components       ← buttons, inputs, cards, badges, nav
6. Brand Guidelines ← everything together as final document
```

---

## Progress

| Section | Status |
|---|---|
| Typography | ✅ Defined (Franchise + Anton fallback) |
| Color System | ✅ Defined (+ inverse pair `--invert-bg`/`--invert-fg`) |
| Spacing | ✅ Defined |
| Border Radius | ✅ Defined |
| Button | ✅ Shipped as `PrimaryBtn`/`SecondaryBtn` · CVA multi-variant pending |
| ThemeToggle / ThemeButton | ✅ Complete (shared `useTheme`) |
| ES/EN LangToggle | ✅ Complete (shared `useLang`) |
| Input / Form fields | ✅ Shipped inline in `/cita` · reusable `Input.tsx` pending |
| Card | ✅ Shipped as project card + `StonePlaceholder` · generic `Card.tsx` pending |
| Badge / Chip | ✅ Shipped as `StatusBadge` + filter `Chip` · shared `Badge.tsx` pending |
| Navbar desktop + MobileTopBar | ✅ Code complete (5 links) |
| FloatingBottomNav | ✅ Code complete |
| FAQ accordion (`<details>`, no-JS) | ✅ Code complete |
| Consent checkbox (LFPDPPP) | ✅ Code complete |
| Material spec table · Service-area cards · Document layout | ✅ Code complete |
| Modal / Drawer | ⏳ Pending |
| Toast / Notification | ⏳ Pending |

---

*Documentation generated in parallel with development — updated with each component.*