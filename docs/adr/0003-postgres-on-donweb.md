# Plain Postgres on a DonWeb Cloud Server, not Supabase

**Status**: accepted. Settled by [#14](https://github.com/FrancoLedArg/lab/issues/14).

Hosting is **DonWeb**, on a Cloud Server, with **plain PostgreSQL in Docker** and tenant isolation via
RLS driven by per-transaction session settings. One deployable, server-rendered. Postgres itself was
not a choice here — [#11](https://github.com/FrancoLedArg/lab/issues/11) locked it for RLS.

DonWeb was the operator's call; the decision recorded here is **what we run on it**, because DonWeb
offers a one-click Supabase image and the obvious reading is that we should have taken it.

---

## Why not Supabase

DonWeb's Click&Go catalogue includes Supabase, which would give Postgres, Auth, RLS, Realtime, Storage
and Edge Functions preinstalled — and RLS is Supabase's native idiom, which is exactly what
[#11](https://github.com/FrancoLedArg/lab/issues/11) asks for. It is a genuinely reasonable choice and
was close.

Against it:

- Of the six things it brings, we need **one** (auth). It is ladder rung 5 — a new dependency — where
  rung 4, a native Postgres feature, already covers the job.
- DonWeb manages the **infrastructure**, described as fully managed. The **Supabase stack itself runs on
  your own instance with root**, so you install, configure and upgrade it. Self-hosted Supabase is
  roughly ten containers, and its upgrades are recurring work for the one person who also runs the lab.
- [#29](https://github.com/FrancoLedArg/lab/issues/29) already closed teaching the plain mechanism —
  connections, pooling, transactions and Postgres session settings. The RLS wiring without Supabase is
  understood, which is worth more than the wiring being pre-installed.

With two labs, six screens and one operator, the smaller surface wins. If auth becomes real work, that
is the moment to revisit — not before.

## Constraints that came with DonWeb

- **Nodes are in Argentina**, across four datacenters, which avoids the cross-border paperwork
  [#5](https://github.com/FrancoLedArg/lab/issues/5) found (the US is not an *adequate country* under
  Ley 25.326 art. 12). **But the location cannot be chosen and the IPs may be Argentine or US.** An IP
  block is not where data rests, so this is probably fine — and it is cheap to get DonWeb to say so in
  writing, which is the open item below.
- **Backups are the real gap.** Weekly automatic backups are included, daily ones cost extra, and the
  free snapshots are deleted after ~28 days. Against the ≥10-year retention of *historia clínica*, that
  is not enough. So: **daily backups paid for, plus an automatic dump off DonWeb entirely**, from day
  one. A backup living beside the server is not a backup, and losing approved results is the one
  mistake in this project that cannot be repaired afterwards.
- Resources are configured rather than tiered; ~2 vCPU / 2 GB is the floor for a web app.

## Open

Get DonWeb to state **in writing** that the data rests in Argentina. It is one support ticket, and it is
the difference between a fact and an assumption on the only question
[#5](https://github.com/FrancoLedArg/lab/issues/5) left on the table.
