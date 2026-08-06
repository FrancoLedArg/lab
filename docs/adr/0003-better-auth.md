# Better Auth for Lab staff identity and membership

Staff must authenticate and act in the context of one or more Labs. We use **Better Auth** with users, sessions, and Lab membership stored in **our Postgres**, next to `lab_id` tenancy (ADR-0002), instead of a hosted IdP as the source of truth for membership.

Keeping identity and “which Labs can this person work in?” in the same database avoids a second system of record and fits next-safe-action middleware that attaches Lab context on every mutation. Hosted IdPs (Clerk, Auth0, etc.) remain an option if we later want to outsource login UI/MFA only—membership should still be authoritative in our DB.

## Considered Options

- **Clerk / Auth0** — fastest login UI; membership would still need mirroring into Postgres, creating two sources of truth unless carefully designed.
- **Auth.js** — flexible, more assembly for sessions and Lab membership than Better Auth for this shape.
