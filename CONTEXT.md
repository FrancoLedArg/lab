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
