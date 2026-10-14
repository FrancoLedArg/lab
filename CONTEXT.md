# CONTEXT

Domain model and ubiquitous language for the lab SaaS.

Written lazily, as tickets resolve. Each section names the ticket that settled it. Sections not
present yet are not yet decided — do not invent them.

**Language rule**: the domain is Argentine. Spanish terms staff actually say are kept as-is
(*Bioquímico*, *muestra*, *orden*, *práctica*, *obra social*). Everything else is English.
*Cargar* means **enter / load data**, never money — use *register* / *enter* for data entry and
reserve *charge* / *bill* for money.

> **In flight — [#22](https://github.com/FrancoLedArg/lab/issues/22) has overturned parts of what
> follows, and has not resolved yet.** Three things below are now wrong, and the full record is on
> the ticket:
>
> - **An *orden* is the doctor's paper, not the visit.** Everything below uses *orden* for the
>   visit. The visit is a **Ficha** — it holds the patient, the tubes and the money. Several ordens
>   can hang off one Ficha, and the report is **one sheet per orden**.
> - **The word is *validar*, not *approve*.** A result is **cargada** by a Técnico and **validada**
>   by a Bioquímico. Every *approve / approval* below is the wrong word, not a wrong decision.
> - **A muestra carries its own number.** #19's cut is reverted — see the muestra section.
>
> Nothing else below is affected. These get renamed in place when #22 resolves; until then, read
> *orden* as *ficha* and *approve* as *validar*.

---

## The catalog and the result — settled by [#20](https://github.com/FrancoLedArg/lab/issues/20)

### The four nouns

Everyone says **práctica** out loud for two different objects. The glossary names both, and keeps
them apart.

| Term | Definition | Scene |
|---|---|---|
| **Practice** | A line in one lab's menu. What the lab offers. | *"we do hemograma, NBU 660475"* |
| **OrderedPractice** | One Practice placed on one orden. | *"Ana's hemograma, drawn 8am, approved 11am"* |
| **Analyte** | One thing a lab can measure, with its unit and what counts as normal. Belongs to the lab, not to a Practice. | *"hemoglobina, g/dL"* |
| **Measurement** | One measured line, for one patient, under one OrderedPractice. | *"Ana's hemoglobina: 13.2 g/dL"* |

**There is no `Result` entity.** An OrderedPractice together with its Measurements *is* the result.
"Result" stays a word in conversation and never becomes a table.

`Practice : OrderedPractice` and `Analyte : Measurement` are the same relationship twice — a
definition, and an instance of it on a patient.

### The NBU list

One shared, lab-immutable list of 1,349 practices seeded from the NBU (see
`docs/research/ar-study-catalog.md`, [#2](https://github.com/FrancoLedArg/lab/issues/2)).

Each row: `código`, NBU name, PMO or especial, **UB coefficient**, urgencia flag, AF/BF frequency
flag, official synonyms, and **the NBU document it came from** (`NBU 2012 act. 2016`,
`Anexo 11-2023`, …).

**No lab may change any of it.** There are no per-lab overrides of NBU values anywhere in the model,
and therefore **no revert**. An annual anexo (~60 rows) always applies; the lab gets one notice
listing changes to practices it has switched on. Nothing in a notice needs an answer — but a UB
coefficient moving `3,0 → 6,0` moves the lab's price by itself, so it must be visible.

### Practice

Points at an NBU row, or at nothing when the lab invented the práctica itself.

| Field | Notes |
|---|---|
| on / off | the menu. **692 on at signup**: 433 PMO + 259 NBU-flagged *alta frecuencia*. |
| display name | optional; prints on the report; falls back to the NBU name |
| aliases | a list; never printed; seeded from NBU's official synonyms |
| sample types | a list — some practices need two (e.g. blood *and* urine) |
| analytes | which Analytes this práctica measures |

Deletable only if the lab created it **and** it has never been ordered (Ley 26.529 art. 16 retains
every práctica that reached an orden). Otherwise it is switched off, never deleted.

### Analyte

Belongs to the **lab**, and is shared by every Practice that measures it. Glucosa standalone and
glucosa inside a perfil are one Analyte, defined once. (Glucosa in blood and glucosa in LCR are two
different Analytes — different sample, different name, different ranges.)

Name, unit, optional free-text method, premade phrases, and one of three **value types**:

| Value type | What "normal" means | Report |
|---|---|---|
| **number** | a **range set**: a list of `sex, age from, age to, low, high` | prints the whole set |
| **choice** | each option marked normal or abnormal (`positivo` / `negativo`) | prints the normal option |
| **text** | nothing — there is no normal | no reference column |

A range set is **any length**: one line for some analytes, ~20 for inmunoglobulina A including
infants by month of age. **Ages are stored in days**, always — one integer, covers a 4-day-old and a
50-year-old alike. The lab types *"1 a 3 meses"* and the app converts.

Range sets ship **suggested**. The first time a Bioquímico approves a result that uses one, the app
asks them to confirm it — once, at the moment they are already signing by law. Then never again.
What fills them is [#18](https://github.com/FrancoLedArg/lab/issues/18)'s job.

Premade phrases are suggestions, never rules. The list grows from a **save this phrase** button when
a tech types a text result — no seeding, no maintenance.

### OrderedPractice

**Copies at order time**: display name, código NBU, UB coefficient. That is what the patient agreed
to, and it must not move when the catalog changes.

Also carries an observation (free text, required by MERCOSUR §4.7.3), attached files (images, PDFs),
and the link to its muestra ([#19](https://github.com/FrancoLedArg/lab/issues/19)).

### Measurement

Value, value type, unit, optional note, optional method — **and the whole range set exactly as it
stood at entry, with the line that applied marked**.

A pointer would not do. Ranges are stratified by age, so re-deriving Ana's range five years later
would use her age *then*, not her age at the draw, and could print a different range than her
original report. Res. 594/2023 requires the report show the interval actually applied.

**Abnormal is one tier**, shown yellow: a number outside the line that applied, or a choice marked
abnormal. Text is never flagged. No crítico thresholds — see *Deliberate v1 cuts*.

At entry, each line shows **the patient's last value for that Analyte, and its date**. This works
only because an Analyte belongs to the lab rather than to a Practice.

### Rules underneath the model

1. **No setup phase.** A práctica gets its analytes, units and ranges the first time it is actually
   used — never in an onboarding screen. A lab signs up and takes ordens the same hour.
2. **The lab overrides nothing**, so there is no revert and no "store only the diff" machinery.
3. **Copy, never point**, for anything that gets printed.
4. **The compliant path must be the easy path.** Labs will not do extra work to be compliant, so
   compliance has to fall out of work they are already doing. A field nobody fills is worse than no
   field — it looks like safety and is not.
5. **The UB coefficient lives in the catalog. Money never does.** The UB peso value changes monthly.

### Deliberate v1 cuts

Each was considered and cut on purpose. Re-opening one needs a reason, not a preference.

| Cut | Why |
|---|---|
| Machinery / analyzers | Explicitly out of scope. `method` survives as free text on the Analyte. |
| Specialty packs ("plugins") | NBU has **no** grouping — `662`→`669` is one alphabetical sweep, ABC → ZINC. Packs would be our invented taxonomy over 1,349 rows. The AF/BF flag gives most of the benefit for free. |
| Version history on the lab's catalog | The copy on the Measurement already holds what the law needs, and a pointer to a version cannot solve the age problem. Two mechanisms, one job. |
| Crítico thresholds + the call record | MERCOSUR §4.7.5–4.7.6 asks for them, and its in-force date was never confirmed (see `docs/research/ar-health-data-law.md`). Cut on the user's call: the real flow is tech enters → Bioquímico verifies, and nobody calls anybody. A threshold nobody maintains fires never. |
| Flagging large jumps between visits | The previous value is shown; judging it is the Bioquímico's job, not a rule engine's. |
| Re-reading old results under new ranges | An issued report is frozen. A genuinely wrong result is an amendment ([#23](https://github.com/FrancoLedArg/lab/issues/23)). |
| Reverting a whole catalog | Would destroy the lab's own ranges, which the law says are its own work. |

---

## The muestra — settled by [#19](https://github.com/FrancoLedArg/lab/issues/19)

### What a muestra is

One **working container** holding material from one patient. Not a draw, not a visit — the container
an analysis actually runs off.

That distinction is the whole ticket. Ana gives blood once and the lab ends up with an EDTA tube and
a serum tube: **two muestras**. When the centrifuge ruins the plasma, the serum muestra is rejected
and the hemograma on the EDTA tube is untouched. Model the draw instead and that scenario forces the
Bioquímico to judge every value by hand.

| Field | Notes |
|---|---|
| **type** | The container — *suero, EDTA, citrato, orina, hisopado…*, never the coarse *sangre*. **Refinable**: at the chair the nurse may only know *sangre*; it sharpens when the lab knows which tube the analysis ran off. |
| **drawn_at** | When the draw happened, **as staff record it** — typed and editable. A lab entering Saturday's work on Monday must be able to say Saturday. Prints on the report. |
| **recorded_at** | When our server received the entry. **Never editable, never shown.** The pair is the general rule, not a muestra quirk — see the legal posture below. |
| **drawn_by** | The logged-in user. Staff log in and record their own draws — the *collected* actor Ley 17.132 wants recorded apart from whoever runs the assay. |
| **state** | `usable` or `rejected`. There is no third state. |
| **rejection_reason** | From a **lab-editable list** (hemolizada, insuficiente, coagulada, contaminada, mal rotulada), or free text. |
| **quality_note** | Free text, **independent of state**, printing beside results — the *calidad inadecuada* caveat MERCOSUR §4.7.3 requires. Usually added by the Bioquímico at approval, when they can tell whether the haemolysis actually mattered. |

~~**A muestra carries no number.** The one thing the lab writes on a tube is the **orden's** number,
and it goes on every container from that visit — it identifies the patient, not the tube.~~
**Overturned by [#22](https://github.com/FrancoLedArg/lab/issues/22)**: asked with this section's own
centrifuge scene — one draw, an EDTA tube and a serum tube, pick up the fibrón — the answer was *two
different numbers*. **Each container has its own number.**

One counter, not two: the **Ficha** is `0471` for the month, and its tubes are `471-MG-1` and
`471-MG-2`. The initials are the **patient's**, and they are there so a técnico catches a crossed name
by reading the tube — the failure that put this on #22 in the first place was a calcemia entered where
the doctor asked calciuria. **Stickers are out** (*"son muy caros"*), so every number is written by hand
with a fibrón, which is a standing constraint on the length of anything we number. The counter resets
monthly and that is safe because *"nada queda más de una semana."*

The model is better for it: a rejected tube and the one that replaced it are now distinguishable on the
bench without the system.

### The links

- An **OrderedPractice holds a list of muestras** — usually one, two when the práctica needs two
  containers (clearance de creatinina: blood *and* 24h urine). #20 already gave Practice a *list* of
  sample types; a single pointer contradicts it.
- **That list is append-only.** A rejected tube keeps its link to the practices it stranded, and the
  replacement is *added*. The container in use is the last one not rejected.
- **A muestra is created at the draw.** Before that, *having no muestra* is what "not drawn yet"
  means — no placeholder rows, nothing to delete when a patient never gives the sample.
- **One draw can become several muestras.** Staff correct the orden's container list when the blood
  is split. The placeholder tube is never a record.

### Before the draw: sample instructions

The **Practice** carries one **sample instructions** field: the technician's *complete* requirement
for that práctica — sample type, container, medium or additive, and anything else it needs. One
field, read in one place, before the draw rather than during it.

It ships as a **placeholder and is never definitive**. Staff correct it whenever they learn better,
including after phoning a derivation lab — which is the failure it exists to stop. The knowledge
already existed after that call; what was missing was somewhere to put it.

When the container is unknown, the app **does not block the draw**. It learns from what the
technician records and raises a flag for the lab to settle later. A prompt met while a patient waits
gets dismissed with whatever is first in the list, and that answer then poisons every future draw.

### Rejection and re-draw

1. **Any staff member may reject.** Haemolysis is a physical fact, not a professional judgement, and
   a Bioquímico gate stalls a dead tube exactly when they are out. Actor, time and reason recorded.
2. **Rejecting is notifying.** Picking the reason sends the patient a message on the report channel
   (WhatsApp or email, [#4](https://github.com/FrancoLedArg/lab/issues/4)) — editable, not skippable.
   In the alternative the rejection is done and the notice is optional, so the notice is what gets
   skipped on a busy morning, invisibly.
3. **Only the practices attached to that container stop.** Their recorded-but-unapproved values can
   no longer be approved or printed; they stay in the record, because Ley 26.529 art. 16 keeps them.
   If the Bioquímico wants to keep a value, the tube was never rejected — it was usable with a
   quality note.
4. **The orden stays alive and is not billed again.** Ana agreed to five practices and paid once; a
   bad tube does not change what she agreed to.
5. **The orden sits in a waiting-for-re-draw list** until a replacement is drawn — the lab notifies,
   the patient decides, and the list is what stops the case going quiet for two months.
6. **Nothing closes by timer.** If Ana never returns, staff mark the práctica *not done — muestra no
   recibida* by hand. Auto-closing would have the app decide a refund by scheduled job.

### When it is too late to reject

Rejection is free at any moment — at the chair, at the split, mid-processing — up to approval.
**Approval is not only a signature**: the Bioquímico may adjust a value on their own criteria if the
machine looks wrong, so editing before approval is ordinary work.

**The lock starts at delivery, not at approval.** Until the report leaves the lab, un-approve →
correct → re-approve is normal work; nothing has left under a professional's name and nobody has
been misled. Once Ana has the PDF, an amendment
([#23](https://github.com/FrancoLedArg/lab/issues/23)) is the only path.

The driver is adoption, not tidiness: a Bioquímico who cannot fix a two-minute-old mistake without a
permanent mark keeps a paper notebook instead, and an app the professional avoids records nothing at
all. **No longer conditional** ([#26](https://github.com/FrancoLedArg/lab/issues/26)): the record
keeps every version either way, so whether Dto. 1089/2012 art. 15 binds at the endorsement or at the
emission does not change what we build. It changes only what *prints*, and that is the lab's choice.

### The rule this ticket generalised

**The app ships a suggestion; the lab owns it; nothing is definitive.** Reference ranges (#20), sample
instructions and rejection reasons all landed here independently. It is rule 1 (*no setup phase*) seen
from the other end: the app may not demand knowledge up front, so it must supply a starting guess the
lab is free to overwrite.

### Deliberate v1 cuts

| Cut | Why |
|---|---|
| `received_at` and a `received` state | Nobody records that a tube reached the bench. The field would be a timestamp the app invented. |
| ~~A number on the muestra~~ | **Reverted by [#22](https://github.com/FrancoLedArg/lab/issues/22)** — each container has its own number. |
| `replaces` on a re-drawn muestra | The append-only list already holds it, in date order — and art. 16 forces us to keep that link anyway. Two mechanisms, one job. |
| Aliquot lineage, chain of custody | The placeholder tube has no number and no life after the split. `ponytail:` a muestra records the container the analysis used, not where the material came from. One field to add later, not a redesign. |
| Barcodes, storage location, centrifugation steps, stability clocks, volume tracking | None of it happens on paper today. The lab writes a number on a tube and the tube is walked to the bench. |
| *Aceptada con reparos* as a third state | The note is what the law wants printed, not the category. A third state makes staff classify a judgement call before they can move, and changes nothing downstream. |

---

## The legal posture — settled by [#26](https://github.com/FrancoLedArg/lab/issues/26)

Full decision: [`docs/adr/0001-legal-posture.md`](docs/adr/0001-legal-posture.md). **We are not the
regulator and not the guarantor** — the habilitación belongs to the lab, the matrícula to the
professional. Three rules from it govern every other section here.

### 6. A field ships only if the lab would want it with the law repealed

The law alone is never a reason. This stands in front of rule 4: *the compliant path must be the easy
path* says compliance has to fall out of work the lab already does, and this says what to do when it
does not — leave the field out. Técnicos have never heard of Ley 26.529 and still record who drew the
muestra, because the lab needs it.

**No screen shows the name of a law.** No tooltip, no warning, no *required by art. 16*. If a field
cannot be explained in the técnico's own words, it has not earned its place.

### 7. The record never loses a version, and never names the wrong person

Staff **change** anything — a patient's name, a forgotten TSH, a Measurement. Nothing is deleted, and
every change keeps the old value, the person and the time. The reason is not the law: *the fix can
also be wrong*, and then the lab needs the value from before the fix.

We never print a Bioquímico who did not approve. Both rules exist so **the responsible person is
always findable** — which is what makes *we only give the lab a tool* true. The patient talks to the
Bioquímico, not to us, and that only works while the record can name one.

### 8. What goes to the patient is not what the lab holds

The lab decides what prints; the record keeps everything. A corrected report prints clean or prints
*rectificado* — the lab's call, and version 1 survives either way. Staff type `drawn_at`; the server
keeps `recorded_at`.

---

## The lab and its people — settled by [#7](https://github.com/FrancoLedArg/lab/issues/7)

### The lab

A **Lab** is one **habilitación**. Not one owner and not one building — the habilitación, because a
report's letterhead, address, matrícula and habilitación number are all per-site
([#11](https://github.com/FrancoLedArg/lab/issues/11)).

v1 runs **two labs**: two bioquímicas, two matrículas, two habilitaciones, one of them a partner in
both. They share **nothing** — not patients, not catalog, not prices, not ranges. See
[`docs/adr/0002-v1-is-two-labs.md`](docs/adr/0002-v1-is-two-labs.md).

### User and Membership

A **User** is a person, and one person is one User however many labs they work in. A **Membership** is
that person's role at one lab. The bioquímica who works at both has **one login and two memberships**,
and switches labs inside the app.

Two logins for one human would put two names in the record for one person, and the floor of ADR 0001
exists to stop exactly that. Nor would the split survive contact: nobody keeps two passwords, she
would reuse one, and we would have the separation in the schema and not in reality.

### The two roles

| Role | What they do |
|---|---|
| **Técnico** | Registers patients, takes ordens, draws, records and rejects muestras, enters results. **Cannot approve.** |
| **Bioquímico** | Everything a Técnico does, **and approves**. Sets the total on an orden. |

**Approval is the only gate in the product.** Enforced as *product*, not as law — it survives the law's
repeal, so it passes ADR 0001's admission test. It is a **role gate**: we never check a matrícula.

**Any staff member may reject a muestra**, Técnico included — haemolysis is a physical fact, not a
professional judgement, and a Bioquímico gate stalls a dead tube exactly when they are out
([#19](https://github.com/FrancoLedArg/lab/issues/19)).

**Nobody reviews an orden a Técnico entered.** A review step nobody asked for becomes a button pressed
without reading.

### Administrativo is a real role and not a v1 user

The person at the mostrador exists and is **not in the software**. The app has nothing for them yet, so
a login would hand them the Técnico's screens and call it a role. When the mostrador enters, it enters
with its own screens and its own money flow, together.

What that person spends the day on is answering *"¿ya está?"* on the phone. The patient-facing version
— a WhatsApp assistant — is post-v1, and the channel it needs already exists for report delivery.

### A report names two different people

Conflating them breaks the first day a second lab exists:

| | Who | Scope |
|---|---|---|
| **Director técnico** | the lab's director, with **that lab's** matrícula, phone and address | per **lab**, fixed |
| **Approving Bioquímico** | whoever approved **that** result | per **result** |

Usually the same person; sometimes not. When one bioquímica covers for the other over holidays the
lab's director técnico has not changed, and the report may not claim she approved what she did not.
The second column is what ADR 0001's floor — *the record never names the wrong person* — is about.

### Deliberate v1 cuts

| Cut | Why |
|---|---|
| Administrativo as a user | No screens of their own yet, so the login would be a lie about the role. |
| Granular permissions, configurable roles, a roles admin screen | Two roles and one gate. Configuration exists to serve strangers, and ADR 0002 says there are none. |
| A review step before the draw | Nobody asked for it, and it would be clicked through. |
| Patient and referring-doctor logins | Settled before any ticket existed. |

---

## Derivación — settled by [#21](https://github.com/FrancoLedArg/lab/issues/21)

### What it is

A **derivación** is a práctica on an orden that **another lab runs**. In the model it is a **flag and
the other lab's name** on the OrderedPractice, and the value comes back and is **entered by hand**.

That is the whole mechanism, and it is identical whether the other lab runs this software or not.
Bacteriología goes to Gornitz, which has never heard of us; a hormone goes to our own second lab.
Designing the handoff between our two labs *first* and bolting the external case on afterwards gives
two mechanisms for one job — and **the external case is the common one.**

**The two ordens are never linked**, even when both labs run this software. The receiving lab
registers its own work on its own orden and the two records do not know about each other. Nothing
about the patient crosses: *shares nothing* means nothing, not nothing-except.

### What the flag buys

Both pass ADR 0001's admission test — the lab wants them with the law repealed:

1. **The report can name the lab that performed it.** The data is already sitting there.
2. **The pending list stops lying.** A derived práctica is pending for days, and without the flag it is
   indistinguishable from one that was forgotten. *Waiting on Gornitz* and *we dropped this* look the
   same and need opposite actions.

### Its shape

- The derivación hangs off the **OrderedPractice, not the muestra**, so `state` keeps its two values,
  `usable` and `rejected`. A tube that travelled is still usable, just elsewhere.
- The destination is a **list that grows from use**, like rejection reasons. Free text alone leaves
  *Gornitz*, *gornitz* and *Lab Gornitz* across three reports.
- **A derived result is usually text plus an attached file.** A derived práctica is by definition one
  this lab does not run, so it has no Analytes and no ranges in this catalog — and bacteriología comes
  back as a narrative anyway. The model already covers it: value type `text` has no reference range,
  and an OrderedPractice already carries attachments ([#20](https://github.com/FrancoLedArg/lab/issues/20)).
  **Nobody types a reference range that is not theirs.**
- **If the other lab rejects the tube, the lab that drew it notifies the patient.** Ana is their
  patient. That is the existing *rejecting is notifying* mechanism, unchanged.

### Deliberate v1 cuts

| Cut | Why |
|---|---|
| A cross-tenant handoff between our two labs | A tube that travels by car does not need a two-sided protocol, and the bioquímica is in both labs supervising it herself. |
| Sending the patient's sex and age to the receiving lab | Designed, then deleted with the handoff. It was needed only because the receiving lab would interpret the range; with manual entry the lab that ran it marks its own range on its own orden. |
| The inter-lab account | Lab B bills Lab A monthly. Real, and not money the patient pays. |
| A `Derivation` entity | It is a flag and a name on a row that already exists. |

---

## Money — settled by [#9](https://github.com/FrancoLedArg/lab/issues/9)

### Price and Payment are different jobs

**Price** is what Ana owes. **Payment** is what came in. The second is the one that protects the person
holding the money, and it needs none of the first.

A Técnica who takes a 60.000 transfer into the bioquímica's account needs that recorded **under her own
name**, so the day closes and nobody is under suspicion. She would want it with every law repealed —
the strongest pass of ADR 0001's admission test anywhere in this model.

### Payment

| Field | Notes |
|---|---|
| amount | |
| **medio** | *efectivo*, *transferencia* — a list that grows from use |
| received_by | the logged-in user |
| dates | the one staff type and the one the server records, as everywhere |
| comprobante | an optional photo — **stored, never read** |

**An append-only list on the orden.** Ana pays 25.000 at the draw and 40.000 at pickup: two Payments. A
Payment is never edited; a wrong one is corrected by adding the correction.

The photo is **evidence, not data entry**. Typing `25000` takes three seconds, and what protects the
Técnica is the comprobante existing — not having typed it faster. Reading the amount off a photo saves
nothing and fails in the worst way: a misread number that nobody checks. (Same family as
[#10](https://github.com/FrancoLedArg/lab/issues/10); it can earn its place there.)

**There is one bank account**, so a Payment records no destination.

### The total, and the balance

The orden carries a **total**. The **balance is a subtraction** — total minus its Payments, computed and
never stored. 65.000, 25.000 in, 40.000 to go.

**The total is the Bioquímico's number.** The app computes a suggestion; she rounds 62.300 up to 65.000,
or gives a discount, and that is her lab's business.

This is the **third independent landing** of *the app ships a suggestion, the lab owns it, nothing is
definitive* — after reference ranges (#20) and sample instructions (#19), now money, arrived at from a
different direction each time. That is the spine of the product, not a coincidence.

### What the app computes

Each OrderedPractice records whether the obra social **authorized** it — per práctica, not per orden.
Then, against the UB coefficient the catalog already holds:

| | Valued at |
|---|---|
| authorized | the **obra social's** UB value |
| not authorized | the **Colegio de Bioquímicos'** UB value |
| plus | the **copago**, typed off the bono |

There is no price list to maintain and no per-lab *particular* price to invent: the number for
unauthorized work is external and published.

**UB values are per obra social, carry the date they took effect, and are entered by hand.** The UB peso
value moves monthly ([#2](https://github.com/FrancoLedArg/lab/issues/2)) and nobody tells the app. A
stale value **shows as stale, with its date**, and is never silently corrected.

### We never encode an obra social's method

Twenty obras sociales operate twenty ways and change when they like. **A rule we maintain for somebody
else's policy is a rule that is wrong in silence** — and silently wrong is worse than absent, because the
number looks computed. So the copago is a number a person read off the bono in their hand, and **that is
the destination, not a stopgap**.

This is ADR 0001's tier 3 — *nothing: no check, no warning, no block* — pointed at obras sociales
instead of at the law.

### Deliberate v1 cuts

| Cut | Why |
|---|---|
| A price list | The total is the Bioquímico's call and moves per patient. A list would be overridden every time. |
| Coseguro rules per obra social | See above: twenty methods, maintained by us, wrong in silence. |
| **The monthly presentación to obras sociales** | The circuit a lab lives off, and a process of its own — [#8](https://github.com/FrancoLedArg/lab/issues/8). Cheap to defer: everything it needs (obra social, per-práctica authorization, the month's UB value, código NBU) is already recorded for the copago. Same data, another screen. |
| MercadoPago, both flows | We process no money at all. The research stands on [#3](https://github.com/FrancoLedArg/lab/issues/3). |
| Reading the comprobante with AI | See above. |
| A bank-account model | There is one account. |
| The AFIP/ARCA factura | Nobody asked, and no payment processor issues it ([#3](https://github.com/FrancoLedArg/lab/issues/3)). The lab invoices the way it invoices today. |
