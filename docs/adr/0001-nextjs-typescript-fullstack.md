# Next.js TypeScript fullstack for the Lab staff app

We are a solo TypeScript shop shipping a multi-tenant SaaS Lab desk app. We chose a single **Next.js (App Router)** deployable over a Vite SPA + separate API so UI, server actions, and shared types stay in one place with less ops surface.

Scaffold defaults that go with that shape: **Drizzle** on Postgres, **Tailwind CSS + shadcn/ui**, **Zod + react-hook-form**, **next-safe-action** for all server actions (one seam for auth context, typed errors, and later Sentry/PostHog-style instrumentation), **Vitest** first then **Playwright** for critical flows, server-side **PDF** generation for Result Delivery (prefer pure-JS on Vercel), and **Vercel Blob** or S3-compatible object storage for Result PDFs and Proof Documents. App hosting target: **Vercel**; managed Postgres vendor is soft (see ADR-0002).

## Considered Options

- **Remix** — same “one app” idea; skipped to stay on the more common solo-SaaS path and ecosystem.
- **Vite React SPA + Hono/Nest/Fastify API** — clearer FE/BE split, but two processes and more glue for one developer.
