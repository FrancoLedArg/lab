# How row-level security is wired

**Status**: accepted. Settled by [#28](https://github.com/FrancoLedArg/lab/issues/28), on the mechanics
taught in [#29](https://github.com/FrancoLedArg/lab/issues/29). Amended by
[ADR 0005](0005-stack.md): the lab travels in the tRPC input, and a fourth role, `auth`, serves login.

Two labs share one set of tables, and RLS is the wall between them
([#11](https://github.com/FrancoLedArg/lab/issues/11)). This records how the wall is wired. Several
parts look odd without the reason, and the reason is always the same: **a mistake in our code must
return nothing, never the other lab's patients.** RLS protects against our own bugs, not against an
intruder — anyone running code inside the app can set the context.

## The request

- **The lab is in the page URL** (`/labs/<lab>/...`), and every request carries it from there — as
  the `labId` in each tRPC procedure's input ([ADR 0005](0005-stack.md)). The session holds only the
  person. Each browser tab is self-consistent, and *switch lab* is a link.
- Middleware — the tRPC `labProcedure` — runs, inside the request's transaction,
  `set_config('app.lab_id', $1, true)` and the same for `app.user_id` — never a handler. The `true` makes Postgres undo both at every exit from the
  transaction, so no cleanup code exists to be forgotten, and transaction-mode pooling stays safe.
- **The database judges membership**: every lab policy is
  `lab_id = current_setting('app.lab_id')::uuid and app.is_member(lab_id)`, with `is_member` a
  `stable security definer` function. The app's own check exists only to produce a 404.
- **Missing context raises.** Zero rows looks like a quiet day and ships; an error is found in a minute.

## Four Postgres roles, and `force`

| Role | Used by | RLS |
|---|---|---|
| `owner` | migrations only; owns every table | applies, through `force row level security` |
| `app` | the app; owns nothing, no `BYPASSRLS` | applies |
| `auth` | Better Auth only ([ADR 0005](0005-stack.md)); touches only its tables | applies: a `to auth` policy on those tables |
| `backup` | the daily dump ([ADR 0003](0003-postgres-on-donweb.md)); read-only | **bypassed** |

Postgres skips policies for a table's owner, so an app connected as the owner has RLS that does
nothing, silently. `force` is the second fence for the day someone points the app at `owner`. Its cost:
a data fix across both labs runs one lab at a time. `backup` bypasses because `pg_dump` refuses to
dump a table that RLS would filter — without it, the ≥10-year backup does not run.

## Every table has RLS

So nobody ever asks whether a table is protected. Three kinds of policy:

- **Lab** — the rule above.
- **Shared** — the NBU list. Everyone reads; nothing writes from the app; the annual anexo is a migration.
- **Person** — `users` and `memberships`. A User is visible to members of a lab where that person
  works **or worked**, because the record must keep naming who validated after they leave
  ([ADR 0001](0001-legal-posture.md)'s floor). So a Membership is **ended, never deleted**.

## Nobody logged in

WhatsApp webhooks ([#17](https://github.com/FrancoLedArg/lab/issues/17)) arrive with no person and no
lab URL.

- **One webhook address per lab number**, `/webhooks/whatsapp/<lab>`, set through Meta's per-number
  webhook override during the lab's onboarding. The lab comes from the URL, like every other request,
  and nothing searches across labs. Verify Meta's signature before trusting the URL.
- These requests run as the User **Sistema**, a member of both labs that no person uses. Policies are
  unchanged. Sistema authors only what nobody did — the automatic reply; Ana's message is recorded
  as coming from her phone.

**Rejected for v1: one address for every number**, which is Meta's default. It needs a function that
finds a number's lab by reading across labs — a deliberate hole in the wall. It is the path if the
number of labs ever makes per-number setup a burden; switching is adding that function, nothing else.

## Login has no password

Staff log in with a 4-digit code sent by WhatsApp from a lab number — the same mechanism as the code
confirmed at the counter ([#6](https://github.com/FrancoLedArg/lab/issues/6)). Sessions last 30 days.
Users and Memberships are created by hand ([ADR 0002](0002-v1-is-two-labs.md)), and **nobody ever
knows another person's credential**: if whoever creates the account sets the password, they can
validate under the Bioquímico's name. No password also means no reset flow. Finding the User by phone
before anyone is logged in is done by Better Auth connected as the `auth` role, not by a policy on
`app` ([ADR 0005](0005-stack.md); this was a `security definer` function before).

The risk, accepted: while WhatsApp is down nobody can start a new session. Open sessions keep working.

## Owed by the implementation

The isolation test: connect as `app`, set lab A, read every table, see nothing of lab B. It must
include the failure path — a transaction that throws, then a new one on the **same** connection that
reads without setting the lab, and must raise. That assertion fails if `true` becomes `false`. And
`app` reading Better Auth's session table must fail.
