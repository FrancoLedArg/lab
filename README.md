# Lab

Clinical diagnostic lab desk app (Next.js + Better Auth + Drizzle).

## Stack

- Next.js App Router (`src/app`)
- pnpm
- Postgres on Neon + Drizzle ORM
- Better Auth (email/password + organization plugin = Lab membership)
- Tailwind CSS + shadcn/ui
- Zod + react-hook-form + next-safe-action
- Vitest

See `CONTEXT.md` and `docs/adr/` for domain language and decisions.

## Setup

1. Copy env and fill Neon + auth values:

```bash
cp .env.example .env.local
# DATABASE_URL from Neon
# BETTER_AUTH_SECRET: openssl rand -base64 32
# BETTER_AUTH_URL=http://localhost:3000
```

2. Install (if needed) and generate auth tables, then push schema:

```bash
pnpm install
pnpm auth:generate
pnpm db:push
```

3. Run:

```bash
pnpm dev
```

- `/sign-up` — create account as **Owner** and create a Lab (organization)
- `/sign-in` — sign in (set an active organization before desk work)
- Invite emails log the accept URL to the server console (stub)

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm test` | Vitest |
| `pnpm auth:generate` | Write Better Auth Drizzle schema |
| `pnpm db:generate` / `db:push` | Drizzle migrations / push |
