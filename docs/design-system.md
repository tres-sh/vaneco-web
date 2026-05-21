# Vaneco Design System

**Version:** 0.1.0 — Work in progress  
**Stack:** Astro + React + Tailwind v4 + shadcn/ui  
**Last updated:** May 2025

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
  --font-franchise: 'Franchise', 'Arial Black', sans-serif;
  --font-chillax:   'Chillax', 'DM Sans', sans-serif;
}
```

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
**Dependencies:** `class-variance-authority`, `lucide-react`

#### Variants

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

Toggle component for dark/light mode. Persists preference in `localStorage` and respects the system `prefers-color-scheme` on first visit.

#### Behavior

- First render → reads `localStorage` → if not found, reads `prefers-color-scheme`
- On click → toggles `dark` class on `document.documentElement`
- Saves preference in `localStorage` as `"vaneco-theme"`

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

**File:** `src/components/ui/Input.tsx` *(code pending)*  
**Style:** Underline — bottom border only, no lateral border

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

**File:** `src/components/ui/Card.tsx` *(code pending)*

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

**File:** `src/components/ui/Badge.tsx` *(code pending)*  
**Shape:** `border-radius: 10px` — consistent with buttons

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

**Files:** `src/components/ui/Navbar.tsx` + `src/components/ui/FloatingBottomNav.tsx` *(code pending)*

#### Desktop layout

```
vaneco    Home  Our Work  Process  About    [⚙]  [Book a visit ↗]
```

- Logo left — Franchise, `span` with Veta color on "co"
- Links centered — absolute position `left: 50%`
- Active link — `#9BA8B0` underline with animated `scaleX`
- Settings icon — dropdown with Language + Theme + contact
- CTA right — `Book a visit ↗` / `Agendar visita ↗`
- Scrolled state — `backdrop-filter: blur(12px)` + `background: rgba(10,10,10,0.85)`

#### Settings dropdown

Lives inside the `⚙` button next to the CTA. Contains:
- EN/ES Language toggle
- Dark/Light Theme toggle
- Direct WhatsApp link
- Email hola@pvane.co

Principle: configuration for power users, non-invasive for first-time visitors.

#### Mobile — Floating Bottom Nav

```
[Home] [Work] [Book] [About] [Settings]
```

- **Floating** — not full width, centered, `border-radius: 18px`
- **Blur backdrop** — `backdrop-filter: blur(16px)`
- **Animated pill** — active item expands with label + spring bounce
- **Book always visible** — Veta background `rgba(155,168,176,0.12)`, doesn't compete with active
- **Inactive items** — icon only, no label
- **Animation** — `cubic-bezier(0.34,1.2,0.64,1)` — native iOS-like bounce

#### Active pill behavior

```
Inactive: [icon]        ← padding: 8px, no text
Active:   [icon] Label  ← padding: 8px 12px, text appears with max-width transition
```

---

## 3. Project Architecture

```
pvane.co/              ← Astro SSG — landing, gallery, SEO
pvane.co/book          ← SSG + React island — appointment form
pvane.co/portal/*      ← Astro SSR — client portal
pvane.co/quote/*       ← Astro SSR — quoter

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
| Components | shadcn/ui + custom | Owned components, no version dependency |
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
| Typography | ✅ Defined |
| Color System | ✅ Defined |
| Spacing | ✅ Defined |
| Border Radius | ✅ Defined |
| Button | ✅ Complete (v3) — dark mode, inverse hover, radius 10px |
| ThemeToggle | ✅ Complete |
| Input / Form fields | ✅ Designed — code pending |
| Card | ✅ Designed — code pending |
| Badge / Chip | ✅ Designed — code pending |
| Navbar desktop | ✅ Designed — code pending |
| FloatingBottomNav | ✅ Designed — code pending |
| Modal / Drawer | ⏳ Pending |
| Toast / Notification | ⏳ Pending |

---

*Documentation generated in parallel with development — updated with each component.*