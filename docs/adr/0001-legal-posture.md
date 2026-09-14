# Legal posture: how much of the law the software enforces

**Status**: accepted. Settled by [#26](https://github.com/FrancoLedArg/lab/issues/26).

Legal research ([#5](https://github.com/FrancoLedArg/lab/issues/5),
[#11](https://github.com/FrancoLedArg/lab/issues/11)) had begun to shape the model harder than the
law itself requires. What settled it was not more reading. It was field evidence: técnicos who draw
blood and enter results every day have **never heard** of Ley 26.529, Dto. 1089/2012 or MERCOSUR
Res. 30/20 — and they still record who drew the muestra, still write the observation, still note
that the tube looked hemolizada. They do it because the lab needs it, not because a norm says so.

**We are not the regulator and not the guarantor.** The habilitación belongs to the lab. The
matrícula belongs to the professional. If a lab runs a site its province would not habilitate, that
is between the lab and the province.

---

## Two tests, in this order

### 1. Admission — would the lab want this with the law repealed?

A field ships only if it earns its place on the bench. **The law alone is never a reason.** This is
`CONTEXT.md` rule 4 (*the compliant path must be the easy path*) turned into an admission rule: a
field nobody fills looks like safety and is not.

### 2. Tier — who gets sanctioned?

For whatever passes admission:

| Tier | Who is exposed | What we do |
|---|---|---|
| **1** | us | Non-negotiable. The lab cannot waive our exposure. |
| **2** | the lab, and the document comes out invalid | The model must be able to *express* it. Provide the field; never validate it. |
| **3** | the lab's licence | Nothing. No check, no warning, no block. |

Tier 3 is not new. It is *the app ships a suggestion, the lab owns it, nothing is definitive*
([#19](https://github.com/FrancoLedArg/lab/issues/19),
[#20](https://github.com/FrancoLedArg/lab/issues/20)) applied to law instead of reference ranges.
It covers how many labs one Bioquímico may direct, whether a sucursal is lawful in PBA, whether a
draw-only site is allowed, who may own a lab, and whether a habilitación number is real.

---

## The floor

Two rules sit **outside** the tiers. The tiers are built on exposure; these are not.

1. **The record never loses a version.** Every change keeps the old value, the person, and the time.
   Nothing is deleted. Staff change a patient's name, add a forgotten TSH, correct a Measurement —
   freely, because *the fix can also be wrong*, and then the lab needs the value from before the fix.
2. **The record never names the wrong person.** We never print a Bioquímico who did not approve.

**The reason for both: the responsible person must always be findable.** This is what makes *we only
give the lab a tool* true. We did not put the number on the screen — the Bioquímico did, and the
patient talks to them. If the record cannot name a person, the patient has nobody to talk to and
comes to us instead.

The floor holds regardless of tier, and regardless of what a lab asks for.

---

## What goes to the patient is not what the lab holds

The lab decides what prints. The record keeps everything. The same split, three times:

- A corrected report prints clean, or prints *rectificado*. **The lab chooses.** Version 1 survives
  either way.
- Before delivery, un-approve → correct → re-approve leaves no mark on the paper. The record still
  keeps every version.
- Staff **type** the date of the draw — a lab entering Saturday's work on Monday must be able to say
  Saturday. Our server separately records when they typed it.

---

## No law appears on a screen or in an advertisement

If we cannot explain a field in the técnico's own words, we have not earned the field. No tooltip,
no warning, no *required by Ley 26.529*.

The same holds publicly. We claim what is true and specific — *records kept ten years*, *every change
keeps who and when*, *only the Bioquímico approves* — and we name no norm. **We never say "compliant
with Ley 26.529."** When a lab asks directly, the answer is written down in advance: we do not make
that claim; here is what the software does; whether the lab complies depends on its habilitación, its
director técnico, and how it uses the tool. The contract with each lab says the same, so the sales
call is not the only record of what we promised.

---

## Consequences worth calling out

- **Users are free and unlimited.** Priced seats make labs share one account, and a shared account
  deletes the name from the record — which is the one thing the floor exists to protect. This is a
  constraint on [#13](https://github.com/FrancoLedArg/lab/issues/13), not a pricing preference.
- **Only the Bioquímico role approves, and it is not a setting.** The single rule we enforce, and we
  enforce it as *product* — software without a validate step is part of the problem this product
  exists to fix. It would survive the law's repeal, so it passes admission. It is a **role gate**: we
  never check a matrícula. A lab that hands a técnico the Bioquímico role gets a truthful record and
  its own lawsuit.
- **Every event carries two dates** — the one staff type, and the one our server records. The second
  is never editable and never shown to the lab.

---

## Deliberately open

- **Are we *responsable* or *encargado del tratamiento* under Ley 25.326?** Not ours to decide; on
  [#16](https://github.com/FrancoLedArg/lab/issues/16). It settles whether a lab can ever ask us to
  erase, whether a dark lab keeps one login
  ([#25](https://github.com/FrancoLedArg/lab/issues/25)), and who registers with the AAIP.
- **Advertising law is unresearched.** A promise in advertising can become a contract term in
  Argentina (the idea in CCyC art. 1103 and Ley 24.240 art. 8), but the exact rule is unchecked.
  Also on #16.
