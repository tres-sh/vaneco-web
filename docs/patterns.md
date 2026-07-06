# Vaneco — Patterns

**Version:** 0.3.0  
**Last updated:** July 2026

> **Update (July 2026):** §1 now documents the patterns actually in use on the
> public site (island i18n/theme sync, colocated bilingual copy, URL-synced
> filters, local mock data). The React Query / RHF+Zod / Zustand sections
> (§2–§4) describe the **target** once the pages wire to `api.pvane.co`; today
> the shipped islands use plain `useState` + local data.

---

## Table of Contents

1. [Frontend — React patterns](#1-frontend--react-patterns)
2. [Data fetching — React Query](#2-data-fetching--react-query)
3. [Forms — React Hook Form + Zod](#3-forms--react-hook-form--zod)
4. [Global state](#4-global-state)
5. [Backend — NestJS patterns](#5-backend--nestjs-patterns)
6. [Error handling](#6-error-handling)
7. [Naming conventions](#7-naming-conventions)

---

## 1. Frontend — React patterns

### Cross-island state via CustomEvents + hooks *(shipped)*

Astro islands are independent React roots — they don't share a provider. Vaneco
keeps **language** and **theme** in sync across every island (Navbar,
MobileTopBar, Home, ProjectGallery, CitaFlow, Footer) with a tiny event bus:
`localStorage` for persistence + a `window` CustomEvent for live broadcast.

```ts
// src/lib/useLang.ts — same shape as useTheme.ts
export function useLang(initial: Lang = "es") {
  const [lang, setLangState] = useState<Lang>(initial);

  useEffect(() => {
    const stored = localStorage.getItem("vaneco-lang") as Lang | null;
    if (stored) setLangState(stored);
    const onLang = (e: Event) => setLangState((e as CustomEvent).detail.lang);
    window.addEventListener("vaneco:lang-change", onLang);
    return () => window.removeEventListener("vaneco:lang-change", onLang);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem("vaneco-lang", next);
    window.dispatchEvent(new CustomEvent("vaneco:lang-change", { detail: { lang: next } }));
  }
  return [lang, setLang] as const;
}
```

- One island calls `setLang`/`toggle`; **all** islands re-render in the new
  language/theme — no context, no Zustand, no prop drilling across islands.
- Theme persistence + the `light`/`dark` class on `<html>` are owned by an
  inline flash-guard script in `BaseLayout.astro`; `useTheme` only reads and
  broadcasts. Dark is the default (class set before first paint → no flash).
- Rule of thumb: reach for this bus **only** for cross-island global UI state
  (lang, theme). Everything else stays local (`useState`).

### Colocated bilingual copy *(shipped)*

Each island owns a `copy` / `ui` dictionary keyed by `es`/`en`; the component
reads `copy[lang]`. Copy lives next to the component that uses it, not in a
central i18n bundle — islands are few and self-contained.

```tsx
const copy = { es: { cta: "Agendar visita" }, en: { cta: "Book a visit" } } as const;
function Hero() { const [lang] = useLang(); const t = copy[lang]; return <a>{t.cta}</a>; }
```

### Filters synced to the URL *(shipped)*

`/proyectos` mirrors its material/color/finish filters into the query string with
`history.replaceState` (no new history entries). Opening a project and pressing
**back** restores the exact filter set — the gallery re-hydrates from the URL on
mount. AND-combined; `todos` = no constraint.

### Local mock data layer *(shipped, temporary)*

`src/data/projects.ts` is the single source for the gallery until the API lands.
Filter option lists are **derived from the data** (never hardcoded in markup) so
materials/finishes stay extensible. The quote lookup uses a small in-island map
(`COT-YNG-2606` + any `COT-VNC-####`). Swapping to `api.pvane.co` is a
data-source change, not a UI change.

### One data source → HTML + JSON-LD *(shipped)*

SEO pages render their content **and** their structured data from the same
array, so the schema can never drift from what's on screen (spec rule). `/faq`
maps `data/faq.ts` into the accordion and into `faqJsonLd()` (FAQPage);
`/materiales` maps `data/materials.ts` into the sections and into an `ItemList`.
`BaseLayout` takes a `jsonLd` prop and always prepends a global `LocalBusiness`.

```astro
---
import { faqGroups, faqJsonLd } from "../data/faq";
---
<BaseLayout jsonLd={[faqJsonLd()]}>
  {faqGroups.map((g) => /* same source renders the accordion */)}
</BaseLayout>
```

### No-JS accordion via native `<details>` *(shipped)*

`/faq` uses `<details name="faq">` — the browser gives exclusive open (one at a
time) and the answers are in the served HTML (crawlable, works with JS off). A
`+`/`−` sign is pure CSS off `details[open]`; no island. Reach for an island
only when the interaction can't be expressed declaratively.

### Consent-gated submit *(shipped)*

`/cita` keeps a `consent: boolean` and renders the submit button `disabled`
until it's true (LFPDPPP). The gate is **UX only** — the server must re-validate
consent and persist `consent_accepted_at` + the accepted notice version. Never
trust a front-end gate for a legal requirement.

### Custom hooks — encapsulate logic

All reusable logic lives in a hook, never inline in the component.

```ts
// ✅ Correct — logic in hook
function useQuote(id: string) {
  return useQuery({
    queryKey: ['quote', id],
    queryFn: () => api.quotes.getById(id),
  })
}

function QuoteView({ id }: { id: string }) {
  const { data, isLoading } = useQuote(id)
  if (isLoading) return <Spinner />
  return <QuoteDetail quote={data} />
}

// ❌ Wrong — inline fetch
function QuoteView({ id }: { id: string }) {
  const [quote, setQuote] = useState(null)
  useEffect(() => {
    fetch(`/api/quotes/${id}`).then(r => r.json()).then(setQuote)
  }, [id])
}
```

### Compound components — complex components

For components with multiple related parts (Card, Form, Modal).

```tsx
// Usage
<QuoteCard>
  <QuoteCard.Header title="Nero Eclisse" zone="Tijuana" />
  <QuoteCard.LineItems items={quote.lines} />
  <QuoteCard.Total amount={quote.total} currency="MXN" />
  <QuoteCard.Actions onApprove={handleApprove} />
</QuoteCard>

// Implementation
const QuoteCardContext = createContext<QuoteCardContextType>(null)

function QuoteCard({ children }: { children: React.ReactNode }) {
  return (
    <QuoteCardContext.Provider value={{}}>
      <div className="card">{children}</div>
    </QuoteCardContext.Provider>
  )
}

QuoteCard.Header    = QuoteCardHeader
QuoteCard.LineItems = QuoteCardLineItems
QuoteCard.Total     = QuoteCardTotal
QuoteCard.Actions   = QuoteCardActions

export { QuoteCard }
```

### Render props — configurable components

```tsx
// For cases where the parent needs to control the render
<DataTable
  data={tickets}
  renderRow={(ticket) => (
    <TicketRow
      key={ticket.id}
      ticket={ticket}
      onStatusChange={handleStatusChange}
    />
  )}
/>
```

### Component colocation

Components live close to where they are used. Only promoted to `ui/` when genuinely reusable.

```
components/
├── ui/                    ← design system — Button, Footer, Navbar, Controls...
│   └── Button.tsx         ← used across the entire project
├── home/                  ← landing island + StonePlaceholder
│   └── Home.tsx           ← only in index
├── projects/              ← ProjectGallery, ProjectDetail
│   └── ProjectDetail.tsx  ← only in /proyectos/[id]
└── cita/                  ← booking + quote flow
    └── CitaFlow.tsx       ← only in /cita
```

---

## 2. Data fetching — React Query

### Setup

```ts
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### API client — fetch wrapper

```ts
// src/lib/api.ts
const BASE_URL = import.meta.env.PUBLIC_API_URL // https://api.pvane.co/v1

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken() // from cookie or localStorage

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new ApiError(error.message, res.status)
  }

  return res.json()
}

// API modules
export const api = {
  tickets: {
    getAll:  (params?: TicketFilters) => request<Ticket[]>(`/tickets?${qs(params)}`),
    getById: (id: string)             => request<Ticket>(`/tickets/${id}`),
    create:  (data: CreateTicketDto)  => request<Ticket>('/tickets', { method: 'POST', body: JSON.stringify(data) }),
    update:  (id: string, data: UpdateTicketDto) => request<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  quotes: {
    getById:    (id: string)           => request<Quote>(`/quotes/${id}`),
    getByToken: (token: string)        => request<Quote>(`/quotes/token/${token}`),
    create:     (data: CreateQuoteDto) => request<Quote>('/quotes', { method: 'POST', body: JSON.stringify(data) }),
    approve:    (id: string)           => request<Quote>(`/quotes/${id}/approve`, { method: 'POST' }),
    sendPdf:    (id: string)           => request<void>(`/quotes/${id}/send`, { method: 'POST' }),
  },
  appointments: {
    create: (data: CreateAppointmentDto) => request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    getAll: ()                           => request<Appointment[]>('/appointments'),
  },
  links: {
    getAll:   ()                          => request<Link[]>('/links'),
    getStats: (slug: string)              => request<LinkStats>(`/links/${slug}/stats`),
    create:   (data: CreateLinkDto)       => request<Link>('/links', { method: 'POST', body: JSON.stringify(data) }),
    update:   (slug: string, url: string) => request<Link>(`/links/${slug}`, { method: 'PATCH', body: JSON.stringify({ url }) }),
  },
}
```

### Query keys — convention

```ts
// src/lib/query-keys.ts
export const queryKeys = {
  tickets: {
    all:    ()           => ['tickets'] as const,
    list:   (f: any)     => ['tickets', 'list', f] as const,
    detail: (id: string) => ['tickets', 'detail', id] as const,
  },
  quotes: {
    all:    ()           => ['quotes'] as const,
    detail: (id: string) => ['quotes', 'detail', id] as const,
    token:  (t: string)  => ['quotes', 'token', t] as const,
  },
  links: {
    all:   ()             => ['links'] as const,
    stats: (slug: string) => ['links', 'stats', slug] as const,
  },
}
```

### Hooks per entity

```ts
// src/hooks/use-tickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: queryKeys.tickets.list(filters),
    queryFn:  () => api.tickets.getAll(filters),
  })
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn:  () => api.tickets.getById(id),
    enabled:  !!id,
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      api.tickets.update(id, { status }),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.tickets.detail(updated.id), updated)
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all() })
    },
  })
}
```

### Optimistic updates — for ticket status changes

```ts
export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      api.tickets.update(id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tickets.detail(id) })
      const previous = queryClient.getQueryData(queryKeys.tickets.detail(id))

      queryClient.setQueryData(queryKeys.tickets.detail(id), (old: Ticket) => ({
        ...old,
        status,
      }))

      return { previous }
    },

    onError: (err, { id }, context) => {
      queryClient.setQueryData(queryKeys.tickets.detail(id), context?.previous)
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.detail(id) })
    },
  })
}
```

---

## 3. Forms — React Hook Form + Zod

### Setup

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Validation schema with Zod

```ts
// src/schemas/appointment.schema.ts
import { z } from 'zod'

export const appointmentSchema = z.object({
  name:        z.string().min(2, 'Minimum 2 characters'),
  phone:       z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  zone:        z.enum(['TIJUANA', 'ROSARITO', 'TECATE']),
  projectType: z.enum(['KITCHEN', 'BATHROOM', 'COMMERCIAL', 'OUTDOOR', 'OTHER']),
  notes:       z.string().max(300).optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>
```

### Form component

```tsx
// Target for src/components/cita/CitaFlow.tsx (schedule tab) — RHF + Zod.
// Shipped today with plain useState; this is the shape it migrates to.
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appointmentSchema, AppointmentFormData } from '@/schemas/appointment.schema'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function BookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: api.appointments.create,
    onSuccess: () => reset(),
  })

  const onSubmit = (data: AppointmentFormData) => mutate(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Full name"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Phone"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Select
        label="Zone"
        error={errors.zone?.message}
        options={ZONE_OPTIONS}
        {...register('zone')}
      />
      <Button
        type="submit"
        variant="primary"
        loading={isPending}
        disabled={isPending}
      >
        {isSuccess ? 'Visit requested ✓' : 'Book a visit'}
      </Button>
    </form>
  )
}
```

### Input pattern with forwardRef for React Hook Form

```tsx
// src/components/ui/Input.tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="field">
        <input
          ref={ref}          // ← required for React Hook Form
          className={cn('v-input', error && 'error', props.value && 'has-value')}
          {...props}
        />
        <label className="v-label">{label}</label>
        <div className="v-line" />
        {error && <span className="v-error">{error}</span>}
      </div>
    )
  }
)
```

---

## 4. Global state

### Golden rule

> Server data → React Query.  
> Local UI state → useState / useReducer.  
> Shared state across many routes → Zustand.

### When to use each

| State type | Solution | Example |
|---|---|---|
| API data | React Query *(when API lands)* | Ticket list, order detail |
| Form state | useState / RHF | `/cita` fields (useState today; RHF+Zod target) |
| Local UI | useState | Active tab (`/cita`), confirmation state, quote result |
| Cross-island UI | CustomEvents + `useLang`/`useTheme` (§1) | Language, theme |
| Auth / user | Zustand *(Phase 2)* | JWT token, user data |
| Gallery filters | useState + URL query params | material / color / finish |

> **Preferences note:** language and theme are shared across islands with the
> lightweight event bus (§1), **not** Zustand — islands are separate React roots,
> so a `window` event + `localStorage` is simpler than mounting a store in each.
> Zustand enters in Phase 2 for auth/portal state that spans a single SPA-like tree.

### Zustand — only for auth and preferences

```ts
// src/stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  token: string | null
  user:  User | null
  setAuth:   (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user:  null,
      setAuth:   (token, user) => set({ token, user }),
      clearAuth: ()            => set({ token: null, user: null }),
    }),
    { name: 'vaneco-auth' }
  )
)
```

---

## 5. Backend — NestJS patterns

### Module structure — each feature is a module

```ts
// tickets/tickets.module.ts
@Module({
  imports:     [PrismaModule, NotificationsModule],
  providers:   [TicketsService],
  controllers: [TicketsController],
  exports:     [TicketsService], // only if another module needs it
})
export class TicketsModule {}
```

### DTO pattern — input validation

```ts
// tickets/dto/create-ticket.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { Zone, ProjectType } from '@prisma/client'

export class CreateTicketDto {
  @IsEnum(Zone)
  zone: Zone

  @IsEnum(ProjectType)
  projectType: ProjectType

  @IsOptional()
  @IsString()
  notes?: string
}
```

### Service pattern — business logic

```ts
// tickets/tickets.service.ts
@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(userId: string, dto: CreateTicketDto): Promise<Ticket> {
    const ticket = await this.prisma.ticket.create({
      data: { ...dto, userId },
    })

    await this.notifications.sendWhatsApp({
      to:      process.env.ADMIN_WHATSAPP,
      message: `New appointment requested — ${ticket.zone} · ${ticket.projectType}`,
    })

    return ticket
  }

  async updateStatus(id: string, status: TicketStatus): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { id },
      data:  { status },
    })
  }

  async findAllForUser(userId: string, role: Role): Promise<Ticket[]> {
    // ADMIN sees all, CLIENT sees only their own
    const where = role === 'ADMIN' ? {} : { userId }
    return this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { quote: true },
    })
  }
}
```

### Guard pattern — protect routes

```ts
// auth/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler())
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.includes(user.role)
  }
}

// Decorator
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)

// Usage in controller
@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
findAll() {
  return this.ticketsService.findAllForUser(...)
}
```

### Response interceptor — consistent format

```ts
// common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({ data }))
    )
  }
}

// main.ts
app.useGlobalInterceptors(new ResponseInterceptor())
```

### Cost engine — service pattern

```ts
// quotes/cost-engine.service.ts
@Injectable()
export class CostEngineService {

  calculate(input: CostInput): CostResult {
    const { sqft, materialUsdPerSqft, exchangeRate, workers, dailyWage, sqftPerDay, gasExpense, consumables } = input

    const materialMxn  = materialUsdPerSqft * exchangeRate
    const laborPerSqft = (workers * dailyWage) / sqftPerDay
    const opsPerSqft   = (gasExpense + consumables) / sqft
    const costPerSqft  = materialMxn + laborPerSqft + opsPerSqft

    return {
      materialPerSqft: materialMxn,
      laborPerSqft,
      opsPerSqft,
      costPerSqft,
      total: costPerSqft * sqft,
    }
  }

  applyMargin(cost: number, marginPercent: number): number {
    return cost / (1 - marginPercent / 100)
  }
}
```

---

## 6. Error handling

### Frontend — API errors

```ts
// src/lib/api.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// In components — React Query handles errors
const { data, error } = useTicket(id)

if (error instanceof ApiError) {
  if (error.statusCode === 401) redirect('/login')
  if (error.statusCode === 404) return <NotFound />
  return <ErrorMessage message={error.message} />
}
```

### Frontend — Error Boundary

```tsx
// src/components/ui/ErrorBoundary.tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error) => console.error(error)}
    >
      {children}
    </ReactErrorBoundary>
  )
}
```

### Backend — global exception filter

```ts
// common/filters/http-exception.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx    = host.switchToHttp()
    const res    = ctx.getResponse()
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal server error'

    res.status(status).json({ statusCode: status, message })
  }
}

// main.ts
app.useGlobalFilters(new AllExceptionsFilter())
```

---

## 7. Naming conventions

### Files and folders

```
kebab-case for files:
  use-tickets.ts
  quote-pdf.service.ts
  order-timeline.tsx

PascalCase for React components:
  OrderTimeline.tsx
  QuoteCard.tsx
  BookForm.tsx
```

### Variables and functions

```ts
// camelCase for variables and functions
const ticketStatus = 'PENDING_VISIT'
function calculateTotal(sqft: number, pricePerSqft: number) {}

// PascalCase for types, interfaces and classes
type TicketStatus = 'PENDING_VISIT' | 'QUOTED' | ...
interface CreateTicketDto { zone: Zone; projectType: ProjectType }
class TicketsService {}

// SCREAMING_SNAKE_CASE for global constants
const MAX_QUOTE_VALIDITY_DAYS = 7
const DEFAULT_MARGIN_PERCENT  = 30
```

### Hooks

```ts
// Always start with "use"
useTickets()
useQuote(id)
useUpdateTicketStatus()
useAuthStore()
```

### Query keys

```ts
// Arrays with hierarchy — general to specific
['tickets']                          // all tickets
['tickets', 'list', { zone: 'TJ' }] // filtered list
['tickets', 'detail', 'abc123']      // specific ticket
```

### API endpoints

```
Semantic REST:
GET    /v1/tickets           → list
POST   /v1/tickets           → create
GET    /v1/tickets/:id       → detail
PATCH  /v1/tickets/:id       → partial update (not PUT)
DELETE /v1/tickets/:id       → delete

Non-CRUD actions:
POST   /v1/quotes/:id/approve   → specific action
POST   /v1/quotes/:id/send      → specific action
POST   /v1/quotes/:id/pdf       → generate derived resource
```

---

*Living document — updated with new patterns as the project grows.*