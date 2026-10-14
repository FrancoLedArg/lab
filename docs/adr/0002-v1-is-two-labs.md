# v1 is two labs, not a product

**Status**: accepted. Settled by [#1](https://github.com/FrancoLedArg/lab/issues/1).

The effort was chartered as a multi-tenant SaaS for Argentine clinical labs, with self-serve signup
and subscription billing in v1. **It is now software for two specific laboratories**, and whether it
is ever sold to anyone is an open question rather than a plan.

The two labs are real and both exist today: two bioquímicas, two matrículas, two habilitaciones, one
of them a partner in both. One of the authors is staff at one of them.

---

## What this does not change

**Almost nothing structural**, which is the surprising part and the reason this is written down.

Two labs with two matrículas and two habilitaciones **are two tenants**. `lab_id` on every row, RLS,
and the lab switcher are not SaaS machinery — they are this owner's actual situation, and they would
exist if we swore never to sell a licence. [#11](https://github.com/FrancoLedArg/lab/issues/11) stands
unchanged, including *the habilitación is the tenant*: a report's letterhead, address, matrícula and
habilitación number are per-site, so one lab per habilitación is the shape either way.

One of #11's supporting arguments **does** weaken: shared tables were partly justified by dead tenants
being guaranteed over a 10-year retention, so they had to cost rows rather than infrastructure. With
two labs that argument carries little weight. The decision survives on the simpler ground that one
database and one column is the least machinery that works.

## What it does change

Everything addressed at strangers:

- **Self-serve signup, subscription plans, and both MercadoPago flows** — cut. Two users are created by
  hand. [#13](https://github.com/FrancoLedArg/lab/issues/13),
  [#15](https://github.com/FrancoLedArg/lab/issues/15) and
  [#25](https://github.com/FrancoLedArg/lab/issues/25) close unbuilt.
- **Per-lab branding** — two letterheads written by hand, not a template system
  ([#12](https://github.com/FrancoLedArg/lab/issues/12)).
- **Configuration screens** — a setting becomes a baked-in decision. `CONTEXT.md` rule 1 already said
  *no setup phase*; this doubles it. **Configuration exists to serve strangers, and there are none.**
- **Half of the legal review** ([#16](https://github.com/FrancoLedArg/lab/issues/16)) — *responsable vs
  encargado del tratamiento* and advertising law were vendor questions. Software that is the lab's own
  tool, used by its own staff, has no third party processing the data. ADR 0001's section on
  advertising goes dormant; it wakes up the day anything is sold.

## The risk, named

"Personalised" turns very easily into "whatever occurs to us". What protects this codebase is not that
the software is generic — it is still asking whether each thing has to exist at all. The ponytail
ladder applies unchanged, and arguably harder: there is no customer to blame a feature on.

## What keeps the door open, for free

Only the things that cost nothing: `lab_id` and RLS (required by the two labs anyway), and *copy, never
point* (`CONTEXT.md` rule 3, required by law anyway). Nothing is being built against a hypothetical
third customer, and nothing needs to be.
