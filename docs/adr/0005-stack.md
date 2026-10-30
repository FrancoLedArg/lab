# The stack

**Status**: accepted, except the PDF library (open, decided with
[#12](https://github.com/FrancoLedArg/lab/issues/12)). Settled in conversation on 2026-10-30. Amends
[ADR 0003](0003-postgres-on-donweb.md) and [ADR 0004](0004-rls-wiring.md).

One TypeScript monorepo, one Node process on the DonWeb VPS, one Postgres. The rule behind most picks:
**what the user already knows, unless it costs the RLS wall**. The wall is the only part of this
project that fails silently, so it is the only place a familiar tool lost.

| Piece | Choice |
|---|---|
| Monorepo | **Turborepo**, **pnpm** workspaces, pnpm pinned with `packageManager` |
| Server | **Express**, with **tRPC** mounted at `/trpc` |
| Frontend | React, built with **Vite**, **TanStack Router** + **TanStack Query** |
| Database | Postgres in **Docker Compose** (dev and tests), **Drizzle** + drizzle-kit |
| Login | **Better Auth**, login and sessions only |
| Validation, forms | **Zod** in `packages/shared`, **React Hook Form** |
| UI | **Tailwind** + **shadcn/ui**; React Bits on passing screens only |
| Tests | **Vitest** |
| PDF | *open* — leaning `@react-pdf/renderer` |

---

## One process, no Next.js

Express serves tRPC, the webhooks, and the frontend's built files (`express.static`). That is the whole
deployable. Next.js was turned down: its data loading lives in server components, server actions and
route handlers, and **the RLS transaction would have to be remembered in each of them**. Here every
lab request passes through one middleware. Server rendering buys nothing for an internal app behind a
login.

## tRPC inside Express

**Called by our frontend → tRPC. Called from outside → a plain Express route.** The WhatsApp webhooks
(`/webhooks/whatsapp/<lab>`) and a health check are Express routes. Everything the screens use is a
tRPC procedure.

The RLS transaction and both `set_config` calls live in **one `labProcedure` middleware**. A lab
procedure cannot skip it. This is ADR 0004's *"middleware, never a handler"*, given a single place.

**The `labId` travels in every procedure's input**, taken from the page URL (`/labs/<lab>/...`), never
from the session. ADR 0004's intent holds: the session holds only the person, and each tab is
self-consistent.

tRPC's React integration is built on TanStack Query, so query keys and fetch functions are not written
by hand. Router loaders fill the Query cache, and screens read from it.

## Drizzle, with policies in the schema

The user's long-time tool. **Tables, relations and RLS policies (`pgPolicy`) are declared together in
the schema**, so a table without its policy is hard to write, and drizzle-kit emits plain SQL that can
be read in the migration. What Drizzle cannot express goes in **one hand-written SQL migration**: the
`app.is_member` function, role grants, and `force row level security` if drizzle-kit does not emit it
(to verify).

Kysely was the other candidate: thinner and closer to SQL. Familiarity won, and nothing in the wall
depends on the query builder: `tx.execute(sql\`select set_config(...)\`)` works the same.

Drizzle's API moves between versions. **Check the docs for the installed version before writing schema,
relations or policies.**

## Better Auth, and a fourth role

Better Auth does **login and sessions only**: the WhatsApp code (its phone-number plugin; `sendOTP`
calls our WhatsApp sender), the cookie, expiry, attempt limits, sign-out. It does not replace RLS. It
answers *who*, and RLS answers *which rows*.

The catch: login runs **before anyone is known**. Finding a User by phone, storing the code, and
reading a session all happen with no `app.user_id`, so `app`'s policies would raise. And Better Auth
runs its own queries, outside our `set_config` transaction. So it connects as **its own role, `auth`**:

- `auth` can touch **only** Better Auth's tables. Those tables keep RLS, with a policy `to auth`.
- `app` **cannot read** sessions or codes at all.
- Two small pools, one per role. #29 explains why a pool is per role.

**Lab, Membership and Dueño stay our own tables.** Better Auth's organization plugin was turned down:
it keeps an *active organization* in the session (against the lab in the URL), may delete a removed
member (a Membership is ended, never deleted; to verify), and has its own roles where Dueño is a
mark beside the role ([#8](https://github.com/FrancoLedArg/lab/issues/8)).

To verify in Better Auth's docs before wiring it: whether its user table can be our `users` table
(and what it requires, such as an email), the phone-number plugin's code length and attempt limit (ADR
0004 says 4 digits), and session length (ADR 0004 says 30 days).

## Data on the screen

TanStack Router, because `labId` is in every route and its params are typed: a link to the wrong lab
is a type error before it is a RLS error. TanStack Query from the start, so the pendientes list can
refresh while another user validates.

## Validation and forms

Zod schemas live in `packages/shared`. The same schema checks a form in `web` and rejects the request
in `api`, so one rule is written once. Table-shaped schemas are derived from Drizzle (check the docs
for the current way). Forms use React Hook Form with `zodResolver`. The user knows it, and tRPC and
TanStack Router are already two new things at once.

## UI

Tailwind and shadcn/ui. The components are copied into the repo and built on Radix, so menus,
dialogs and focus work from the keyboard without us writing it. Staff use this all day, often from
the keyboard.

**React Bits only on passing screens**: login, an empty *no hay pendientes*, the first load. Never on
the screens people work in all day. Every animation respects `prefers-reduced-motion`.

## Tests

Vitest across the monorepo. Tests run against **the same Postgres image as the VPS**, through Docker
Compose, with separate dev and test databases. PGlite was turned down: one connection and no login
roles, so it cannot honestly run step 2 of ADR 0004's isolation test (a failed transaction, then the
same connection). Testcontainers can be added later without changing the tests.

The first test is ADR 0004's isolation test.

## Open

**The PDF library.** HTML printed by headless Chrome (Puppeteer) was recommended: the #12 layout will
still change, and with HTML that is CSS. The user leans towards `@react-pdf/renderer`, which is
lighter and needs no Chrome on the server. Decided with #12.
