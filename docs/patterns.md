# Vaneco — Patterns

**Version:** 0.1.0  
**Last updated:** May 2025

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
├── ui/                    ← design system — Button, Input, Card
│   └── Button.tsx         ← used across the entire project
├── sections/              ← landing sections
│   ├── Hero.tsx           ← only in index
│   └── Gallery.tsx        ← only in index and /work
└── portal/                ← client portal components
    ├── OrderTimeline.tsx   ← only in /portal/orders/[id]
    └── QuoteView.tsx       ← only in /portal/quotes/[id]
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
// src/components/sections/BookForm.tsx
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
| API data | React Query | Ticket list, order detail |
| Form state | useState / RHF | Form fields |
| Local UI | useState | Modal open/closed, active tab |
| Auth / user | Zustand | JWT token, user data |
| Preferences | Zustand + localStorage | Theme, language |
| Table filters | useState | Zone, status, date |

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