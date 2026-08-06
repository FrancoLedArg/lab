# PostgreSQL with shared-schema Lab tenancy

Lab Management is a subscribed multi-tenant product (each Lab is one site). We store the system of record in **PostgreSQL** and isolate tenants with a **shared schema** and a **tenancy foreign key on every tenant-owned row**, enforced in queries (and optionally RLS later)—not schema-per-Lab or database-per-Lab. That key is the Better Auth **organization id** (see ADR-0004); domain language remains **Lab**, not “organization.”

Postgres fits Visit → Medical Order → Practice Line → Charge / Specimen / Result relationships. Shared-schema tenancy matches “we operate one cloud SaaS” and keeps solo ops simple; stronger isolation can be revisited if a Lab or compliance requirement forces it. Managed provider (Neon preferred for bootstrap; vendor still soft for long-term lock-in) is intentionally soft; the engine and tenancy model are not.

## Considered Options

- **Schema-per-Lab or DB-per-Lab** — stronger isolation, much heavier migrations and ops for a solo maintainer.
- **SQLite first** — fine for prototypes; poor fit for multi-tenant SaaS and concurrent Lab desk use.
