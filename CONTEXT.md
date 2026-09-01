# CONTEXT

Domain model and ubiquitous language for the lab SaaS.

Written lazily, as tickets resolve. Each section names the ticket that settled it. Sections not
present yet are not yet decided — do not invent them.

**Language rule**: the domain is Argentine. Spanish terms staff actually say are kept as-is
(*Bioquímico*, *muestra*, *orden*, *práctica*, *obra social*). Everything else is English.
*Cargar* means **enter / load data**, never money — use *register* / *enter* for data entry and
reserve *charge* / *bill* for money.

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
| **drawn_at** | When the draw was recorded. |
| **drawn_by** | The logged-in user. Staff log in and record their own draws — the *collected* actor Ley 17.132 wants recorded apart from whoever runs the assay. |
| **state** | `usable` or `rejected`. There is no third state. |
| **rejection_reason** | From a **lab-editable list** (hemolizada, insuficiente, coagulada, contaminada, mal rotulada), or free text. |
| **quality_note** | Free text, **independent of state**, printing beside results — the *calidad inadecuada* caveat MERCOSUR §4.7.3 requires. Usually added by the Bioquímico at approval, when they can tell whether the haemolysis actually mattered. |

**A muestra carries no number.** The one thing the lab writes on a tube is the **orden's** number, and
it goes on every container from that visit — it identifies the patient, not the tube. Two containers
with the same number are told apart by their type, exactly as they are on the bench by cap colour.

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
all. ⚠️ **This depends on a legal answer** — whether Dto. 1089/2012 art. 15 binds at the endorsement
or at the emission. The question is open on
[#5](https://github.com/FrancoLedArg/lab/issues/5#issuecomment-5494499919). If it binds at approval,
this decision reverses.

### The rule this ticket generalised

**The app ships a suggestion; the lab owns it; nothing is definitive.** Reference ranges (#20), sample
instructions and rejection reasons all landed here independently. It is rule 1 (*no setup phase*) seen
from the other end: the app may not demand knowledge up front, so it must supply a starting guess the
lab is free to overwrite.

### Deliberate v1 cuts

| Cut | Why |
|---|---|
| `received_at` and a `received` state | Nobody records that a tube reached the bench. The field would be a timestamp the app invented. |
| A number on the muestra | The orden's number is what the lab writes, on every container. |
| `replaces` on a re-drawn muestra | The append-only list already holds it, in date order — and art. 16 forces us to keep that link anyway. Two mechanisms, one job. |
| Aliquot lineage, chain of custody | The placeholder tube has no number and no life after the split. `ponytail:` a muestra records the container the analysis used, not where the material came from. One field to add later, not a redesign. |
| Barcodes, storage location, centrifugation steps, stability clocks, volume tracking | None of it happens on paper today. The lab writes a number on a tube and the tube is walked to the bench. |
| *Aceptada con reparos* as a third state | The note is what the law wants printed, not the category. A third state makes staff classify a judgement call before they can move, and changes nothing downstream. |
