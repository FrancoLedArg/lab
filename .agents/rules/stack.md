# Stack rules

The wall between labs and the stack it runs on. The reasons live in
[ADR 0004](../../docs/adr/0004-rls-wiring.md) and [ADR 0005](../../docs/adr/0005-stack.md); read the
one a change touches before making it.

## TypeScript, end to end

App code, scripts, migrations, one-off helpers: all TypeScript on Node. Write each line in the idiom of
the TypeScript beside it and the repo's ESLint and Prettier config.

## The wall

- **Every table ships with its `pgPolicy`** in the Drizzle schema, in the same change that creates it.
- **Every lab procedure is a `labProcedure`.** It alone runs `set_config`, and the `labId` comes from
  the procedure's input.
- **Our frontend calls tRPC. Outside callers** (WhatsApp webhooks, health checks) **hit plain Express
  routes.**

## Docs first

Before writing Drizzle, Better Auth, tRPC or TanStack code, read that library's docs for the installed
version through Context7.

## Done

Done means the whole repo typechecks and the tests pass against Docker Compose's Postgres.
