# Argentina's standard laboratory study catalog (nomenclador)

Research for issue [#2](https://github.com/FrancoLedArg/lab/issues/2). Investigated 2026-08-31.

**Question:** which nomenclador do Argentine clinical labs work from, what does a row contain, can we
get it as data, may we redistribute it in a commercial SaaS, how often does it change, and does it
carry reference ranges?

**Short answer:** the standard is the **NBU (Nomenclador Bioquímico Único)**, maintained by CUBRA and
made mandatory nationwide by **Ley 27232**. It is ~1,349 rows of `código + nombre + flags + Unidad
Bioquímica`. It is distributed only as PDF, but the PDF is text-extractable and parses cleanly, so
"machine-readable" is a two-hour scraping job, not a blocker. It contains **no units, no sample type
and no reference ranges** — those are legally the lab's own responsibility. So the seeded catalog is
a naming + billing skeleton, which is still the 90% of onboarding pain.

---

## 1. Which standard is it?

**NBU — Nomenclador Bioquímico Único.** The assumption in the ticket is correct, and it is stronger
than "industry convention": it is national law.

- **[Ley 27232](https://www.argentina.gob.ar/normativa/nacional/ley-27232-257440/texto)** (sanctioned
  2015-11-26, published in the Boletín Oficial 2016-01-04, No 33288 p. 2). Art. 1: *"Establécese el
  Nomenclador Bioquímico Único, integrado por las prácticas bioquímicas que se enumeran en el Anexo
  que forma parte de la presente ley, el que será de aplicación obligatoria en todo el territorio
  nacional para el sector público, privado y de la seguridad social."*
- Art. 2 creates the **Comisión Asesora para la Evaluación y Actualización del NBU** inside the
  **Superintendencia de Servicios de Salud**: 2 SSS + 2 CUBRA + 1 obras sociales (leyes 23.660/23.661)
  + 1 prepagas (ley 26.682). Art. 3 makes SSS the enforcement body.
- The law's **Anexo is the CUBRA NBU table verbatim** — I rendered page 5 of the official annex
  ([PDF](https://www.argentina.gob.ar/normativa/257440_ley27232_pdf/archivo), 65 pp., Congress
  letterhead "27232 / 65-S-14 / OD 1427") and it is the same `CODIGO | DETERMINACIONES | Urgencia |
  Ref. | U.B.` grid, same codes (660264 DMC, 660300 ESTRADIOL, 660345 FIBRINOGENO...), same UB values
  as the CUBRA/COBICO document.

**Who maintains what:**

| Body | Artifact | Role |
|---|---|---|
| **CUBRA** (Confederación Unificada Bioquímica de la República Argentina) | NBU Versión 2012, Actualización 2016, + dated *Anexos* | Authors and updates the list, via its **Comisión Técnica Permanente**. |
| **Congreso / SSS** | Ley 27232 + its Anexo | Makes it mandatory; SSS hosts the update commission and enforces. |
| **FABA** (Fed. Bioquímica de la Prov. de Bs As) | NBU re-published with an added **`CODIGO FABA`** column, plus a per-obra-social nomenclador for each financiador | Billing intermediary for Buenos Aires labs. Adds its own code alongside the NBU code. |
| **Provincial colegios** (COBICO/Córdoba, COFyBCF/Capital, COBITUC, CB Distrito 1, ...) | Mirrors of the CUBRA PDFs + local arancel circulars | Redistribute; negotiate the UB peso value locally. |
| **PAMI (INSSJP)** | Its own *Nomenclador Común*, module 5 = laboratorio | Uses NBU practice numbers but re-prefixes per module (`660xxx` module 5, `770xxx` module 9, `880xxx` module 34). |
| **Provincial obras sociales** (e.g. **APROSS** Córdoba) | Own resolución + annex | Same practice numbers stripped of the `66` prefix (`000174 COLESTEROL TOTAL` = NBU `660174`), own UB values and coverage flags. |

**So it is not "NBU *or* FABA *or* PAMI".** There is one list (NBU) and a layer of per-financiador
*re-codings and re-valuations* of it. The catalog we seed should be NBU; the per-obra-social code
mapping is a separate, per-tenant, per-contract concern.

Sources: [FABA NBU with CODIGO FABA](http://www.faba.org.ar/nomencladores/nbu2010codigo.pdf) ·
[FABA NBU PMOe CUBRA V3](http://www.faba.org.ar/Nomencladores/NBU%20PMOe%20CUBRA%20VER3%20CODIGO.pdf) ·
[FABA nomenclador IOMA](http://www.faba.org.ar/Nomencladores/NomencladorIomaCodigo.pdf) ·
[PAMI Nomenclador Común](https://datos.pami.org.ar/dataset/nomenclador) ·
[APROSS Res. 369/22](https://www.apross.gov.ar/wp-content/uploads/2022/09/369-22-NOMENCLADOR-Practicas-Bioquimicas.pdf)

---

## 2. What is in a row?

Five columns, and that is all:

```
CODIGO   D E T E R M I N A C I O N E S                         Urgencia  Ref.  U. B.
660001   ACTO BIOQUÍMICO.                                                 N     3,0
660005   ÁCIDO BASE , Estado Ácido Base (EAB).                     U      N    10,0
660015   ALBUMINA (sérica o urinaria - c/u)                        U            1,5
660051   ANTIESTREPTOLISINAS "O" (ASO / ASTO / AELO), cuantitativa              6,0
660058   ANTITROMBINA III - con calibración de tres (3) puntos.               15,0
```

The *Prácticas Especiales* table adds a sixth column, `Frecuencia` (AF = alta frecuencia / BF = baja):

```
CODIGO   D E T E R M I N A C I O N E S                    Ref.  U. B.  Frecuencia
662001   ABC - ACTO BIOQUÍMICO COMPLEMENTARIO              N      3,0   AF
662034   ACETILCOLINESTERASA ERITROCITARIA (CHE eritroc)          12,0   AF
662307   ÁCIDO PERCLÓRICO                                  (#)      -    BF
```

Field meanings, from the NBU's own **REFERENCIAS** page:

- **CODIGO** — 6 digits. `660xxx`/`661xxx` = PMO practices; `662xxx`–`669xxx` = Prácticas Especiales.
- **DETERMINACIONES** — the billing name. Uppercase, with synonyms/acronyms in parentheses and the
  specimen sometimes glued into the name (`- sérica`, `- urinaria`, `- LCR`). Not a normalized field.
- **Urgencia** — `U` = billable as urgent, which requires adding code `661200` to the prescription.
- **Ref.** — `N` = has a companion entry in *Normas Específicas e Interpretaciones*; `(*)` = very low
  frequency, being phased out; `(#)` = obsolete, quoted case by case, has no UB value.
- **U. B.** — **Unidad Bioquímica**, the pricing multiplier. It is *not* a price.
  *"El arancel se obtiene multiplicando el valor asignado a la Unidad Bioquímica (U.B.) por el número
  de unidades que corresponde a cada práctica."*

**No units of measure. No sample/specimen field. No reference ranges. No method. No LOINC/SNOMED
mapping.** The one piece of extra semantics is the separate *Normas Específicas e Interpretaciones*
section — prose per code describing the minimum work included (e.g. code 660001 ACTO BIOQUÍMICO is
defined as covering the whole pre- and post-analytical stage, one per prescription regardless of how
many analyses).

**Counts I measured** by parsing the 2012 PDF:

| Section | Pages | Codes |
|---|---|---|
| NBU – PMO | 7–20 | **433** (391 × `660xxx`, 42 × `661xxx`) |
| NBU – Prácticas Especiales (alta y baja frecuencia) | 37–65 | **916** (`662xxx`–`669xxx`) |
| **Total** | | **1,349** |

Plus an *Anexo de Prácticas – Nomenclatura Alternativa – Sinonimias* (pp. 21–23), i.e. an official
alias list — useful for a search box.

### The gap that matters for the product

An NBU row is a **billable practice**, not a **reportable analyte**. `660475 HEMOGRAMA`, `660170
COAGULOGRAMA BÁSICO` and `668298 PERFIL LIPÍDICO` are each one row but each yields many result lines
on a report. The NBU gives you the billing catalog and the ordering menu; it does not give you the
result schema. That is a second, unresolved modeling question (see "Open questions").

---

## 3. Can we get it as data?

**No API, no CSV, no XLSX from CUBRA. PDF only — but the PDF extracts cleanly.** I verified this end
to end.

- **CUBRA NBU Versión 2012** (the base document, 74 pp.), mirrored by Colegio Bioquímico de Córdoba:
  <https://cobico.com.ar/wp-content/archivos/2013/07/N.B.U.-Version-2.012.pdf>
  I downloaded it and ran `pypdf` over it: **133,772 characters of real text**, ~1,700–2,200 chars per
  page, zero OCR needed. Rows come out as `660002  ACETONURIA.     1,0` and parse with one regex.
  Another mirror: <http://www.cbdistrito1.org.ar/ObrasSociales/N.B.U.pdf> (66 pp., also text).
- **The official Ley 27232 annex is a scan** —
  <https://www.argentina.gob.ar/normativa/257440_ley27232_pdf/archivo> is 65 pages of **images, 0
  characters of text**. So the legally authoritative copy needs OCR; the CUBRA/colegio copy of the
  same content does not. Parse the colegio PDF, spot-check against the annex images.
- **FABA's variants are the cleanest tables** and already carry the FABA↔NBU code mapping:
  <http://www.faba.org.ar/nomencladores/nbu2010codigo.pdf> (16 pp., extracts as
  `2 660002 ACETONURIA 1,00`). Note FABA's *nomencladores por obra social* index page is
  member-gated — `http://www.faba.org.ar/nomencladoresYListas.asp` returns *"Acceso Denegado. Esta
  opción es exclusiva para USUARIOS REGISTRADOS"* — although individual PDFs under
  `/Nomencladores/` are directly fetchable.
- **PAMI publishes an overlapping list as open data** —
  <https://datos.pami.org.ar/dataset/nomenclador> — CKAN, with CSV and XLS resources and a live
  `datastore_search` API. I downloaded the CSV: 4,760 lines, `;`-separated, ISO-8859-1, columns
  `Módulo;Código de práctica;Descripción de práctica;Valor resultante unidades`. **Module 5** is the
  laboratory module: **338 rows on NBU `660xxx` codes**. Caveats: it is a subset (338 of 433 PMO
  codes, none of the 916 Prácticas Especiales), the values are **February 2019 pesos**, and the
  dataset was last modified **2022-08-03**. Useful as a cross-check and as a licence-clean seed for
  the common tests; not sufficient on its own.
- **No community dataset exists.** GitHub code search for `"660002 ACETONURIA"` and repo search for
  `nomenclador bioquimico` both return nothing.
- ⚠️ **Unverified:** several colegio pages are said to offer the NBU "en formato Excel a pedido por
  mail". I could not confirm this — the COFyBCF page cited for it 404s, and **cubra.org.ar was
  unreachable from my network for the whole session** (connection refused on both HTTPS and HEAD), so
  every CUBRA-hosted URL below is cited from search indexes and verified only via colegio mirrors.
  **One email to CUBRA (`nbucubra@speedy.com.ar`) or to a provincial colegio is worth sending before
  writing any scraper** — an official XLSX would remove the parsing step entirely.

---

## 4. Licensing

Honest answer: **there is no explicit licence, and no explicit statutory carve-out either.** The
practical position is good but it deserves a lawyer's five minutes before launch.

What I can verify:

- **The list is the annex to a national law**, published by the State in the Boletín Oficial. It is a
  legal text of general obligatory application, not a commercial product.
- **The CUBRA/COBICO PDF carries no copyright notice at all.** I grepped the full 74-page text for
  `copyright`, `©`, `derechos reservados`, `propiedad intelectual`, `prohibida`, `registro de la
  propiedad` — **zero hits**. The back cover is just CUBRA's address and phone number.
- **PAMI's overlapping table is explicitly `CC-BY-4.0`** — the CKAN API returns
  `"license_id": "CC-BY-4.0"`, `"license_url": "https://creativecommons.org/licenses/by/4.0/"`,
  `"isopen": true`. That subset is unambiguously redistributable with attribution.
- **Nobody sells it as a licence.** It is handed out free by CUBRA and by every provincial colegio.
- ⚠️ **But Argentina's copyright law has no "official texts" exception.** I read
  [Ley 11.723](https://www.oas.org/juridico/PDFs/arg_ley11723.pdf) end to end: there is no article
  excluding laws, decrees or official acts from protection (unlike many jurisdictions). Art. 27 even
  restricts publishing *discursos parlamentarios* for profit. So "it's law, therefore public domain"
  is an inference, not a citation.

**Assessment:** redistributing a ~1,349-row list of practice codes and names inside a SaaS is very
low risk — it is a mandatory legal standard, given away free by its author, with no notice and no
licence fee, and a large overlapping slice is CC-BY. There is no realistic party with both standing
and motive to object; CUBRA's interest is adoption. **Recommended posture:** attribute CUBRA and Ley
27232 visibly in the app, cite the PAMI CC-BY dataset where it is the source, and get a one-paragraph
sign-off from counsel rather than a full opinion. Do **not** resell the catalog as a standalone data
product — that is a different risk profile from seeding a tenant's editable catalog.

---

## 5. Update cadence and versioning

Two clocks, and they are easy to confuse:

**(a) The list of practices — slow, delta-published, no version API.**

The base is *"NBU Versión 2012 – Actualización 2016"*. On top of it CUBRA's Comisión Técnica
Permanente issues dated **Anexos** containing **only changed or new rows**. The November 2023 anexo
says so explicitly:

> *"Nota: Las normas que figuran en el presente Anexo son aquellas que contienen alguna modificación
> o son nuevas incorporaciones. Las restantes que permanecen sin cambios, se encuentran vigentes en
> NBU Versión 2012 Actualización 2016."*

That anexo is **9 pages / ~60 rows** ([COBICO
mirror](https://cobico.ar/wp-content/uploads/2023/12/Anexo-Noviembre-2023-de-Practicas-normas-e-interpretaciones.pdf)),
and it does three things: re-values UB (`660001 ACTO BIOQUÍMICO` 3,0 → 6,0), renames practices
(`660058 ANTITROMBINA III` → `ANTITROMBINA FUNCIONAL`), and adds new ones (`661040 COLESTEROL LDL`).
Known anexos: **Nov 2023**, **Jan 2024** (`Anexo-01.2024-NBU-2012.pdf`), earlier ones referenced from
CUBRA's *Actualización NBU* page. **Cadence is roughly annual and irregular — call it a handful of
rows changing per year.** Practically: re-scrape once a year, diff, done. There is no feed, no
changelog format, no version identifier beyond the anexo's filename date.

Note the legal freeze: Ley 27232's annex is the 2015 snapshot. CUBRA's later anexos are the
profession's living version; they do not amend the law's annex. Nobody appears to treat this as a
problem in practice, but it means "the legally mandatory list" and "the list labs actually bill from"
have drifted slightly.

**(b) The peso value of the UB — fast, monthly, and NOT part of the catalog.**

CUBRA publishes a **monthly** suggested minimum/ethical UB value, redistributed by the colegios —
e.g. COFyBCF, 2025-07-16: *"valor mínimo, ético y de referencia"* of **$2.355** for July 2025
([source](https://www.cofybcf.org.ar/noticia.php?n=3429)). Each obra social then negotiates its own
actual UB per region and contract, which is exactly what the Ley 27232 Comisión Asesora was supposed
to unify.

**Design consequence:** the UB *coefficient* belongs in the seeded catalog (it is stable for years).
The UB *peso value* does not — it belongs to the tenant's obra-social contract, and it changes
monthly. Never bake a price into a seeded study row.

---

## 6. Reference ranges — no, and this is settled by regulation

**The NBU carries no reference ranges.** I grepped the full 2012 text for `valores de referencia`,
`rango de referencia`, `valor normal`, `unidad de medida`, `tipo de muestra` — **zero hits.** There is
no column for them and no annex containing them.

That is not an omission; it is the correct design, because **Argentine regulation puts reference
intervals on the individual lab.** From
[Resolución 594/2023 (MSAL)](https://www.argentina.gob.ar/normativa/nacional/norma-381466/texto),
*"DOCUMENTO MARCO: Recomendaciones Paso a Paso para el Desarrollo de Buenas Prácticas en el
Laboratorio de Análisis Clínicos"* ([full PDF](https://www.mendoza.gov.ar/wp-content/uploads/sites/7/2024/10/RES.-594-23-BUENAS-PRACTICAS-LABORATORIOS.pdf)):

> *"B - Documentar los intervalos de referencia biológicos/valores para toma de decisiones de todos
> los análisis realizados. […] Estos valores deben ser representativos de la población que atiende el
> laboratorio y, en caso necesario, deben tener en cuenta factores como la edad, el sexo, etnia, etc.
> […] se recomienda verificar y demostrar que los valores de referencia utilizados son aplicables a
> la población en estudio."*
>
> *"Verificar o determinar según corresponda el intervalo de referencia biológico […] para cada
> análisis que realice el laboratorio."*
>
> *"Si se ha introducido algún cambio en la metodología de los análisis, compruebe que los intervalos
> de referencia biológicos […] sigan siendo correctos."*

Its checklist annex is explicit about the granularity: **"Definir, verificar y documentar —
Intervalos de referencia según metodología, sexo, edad"**, and the result-report format must carry
them. The same requirement arrives via MERCOSUR GMC 30/20, incorporated by
[Resolución 1514/2021](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1514-2021-350267/texto).

**So: ranges are per-lab, per-analyzer, per-method, per-sex, per-age, and legally the lab's own to
define and re-verify whenever it changes methodology.** A shipped range set would be, at best, a
starting draft the lab must validate anyway — and at worst a liability. Ship the fields and the
sex/age stratification structure; ship the ranges empty or as clearly-labelled unvalidated
suggestions the lab must confirm before first use.

---

## What this means for the v1 spec

1. **Seed from NBU.** ~1,349 rows, one scrape of the COBICO/FABA PDF. This is a two-hour job, not a
   month. Onboarding takes an afternoon.
2. **A seeded row can carry:** `codigo_nbu`, `nombre`, `seccion` (PMO vs Práctica Especial),
   `unidades_bioquimicas`, `urgencia` flag, `ref` flag, `frecuencia` (AF/BF), `sinonimias`. That is
   the whole honest payload.
3. **A seeded row cannot carry:** unit, specimen type, method, reference range, result schema. Leave
   those as tenant-owned fields the lab fills as it activates each study. Most labs activate 200–400
   of the 1,349, so the real onboarding flow is *"pick your menu from the list"*, not *"type your
   menu"* — and that alone is the win.
4. **Keep pricing out of the catalog.** UB coefficient in; peso value in the obra-social contract.
5. **Per-obra-social codes are a mapping table, not the catalog.** FABA, PAMI and APROSS all re-code
   the same practices. Model `estudio ↔ (financiador, código)` as many-to-many from day one; it is
   cheap now and expensive later.

---

## Open questions this raised

- **NBU practice ≠ reportable analyte.** `660475 HEMOGRAMA` is one billable row and ~20 result lines.
  The catalog seeds the *ordering/billing* menu; the *result* schema is unseeded and unstandardized.
  Is there a second catalog (LOINC? SNOMED CT Argentine Edition — Argentina has been a SNOMED
  International member since Jan 2018 and the **Centro Nacional de Terminología en Salud** issues free
  national licences and semi-annual Argentine-edition releases,
  <https://www.argentina.gob.ar/salud/terminologia>) that could seed analytes with units? Worth its
  own ticket.
- **Does CUBRA have an XLSX?** One email removes the parser. Ask before building.
- **cubra.org.ar was unreachable all session** — re-verify the anexo list and check for anything newer
  than Jan 2024 from a working network before freezing the scraper's source URLs.

---

## Sources

**Primary — legal**
- Ley 27232, full text · <https://www.argentina.gob.ar/normativa/nacional/ley-27232-257440/texto>
- Ley 27232, Boletín Oficial 2016-01-04 · <https://www.boletinoficial.gob.ar/detalleAviso/primera/139391/20160104>
- Ley 27232, official Anexo (scanned, 65 pp.) · <https://www.argentina.gob.ar/normativa/257440_ley27232_pdf/archivo>
- Resolución 594/2023 MSAL, Buenas Prácticas · <https://www.argentina.gob.ar/normativa/nacional/norma-381466/texto> · [full PDF](https://www.mendoza.gov.ar/wp-content/uploads/sites/7/2024/10/RES.-594-23-BUENAS-PRACTICAS-LABORATORIOS.pdf)
- Resolución 1514/2021 MSAL (MERCOSUR GMC 30/20) · <https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1514-2021-350267/texto>
- Ley 11.723, Régimen Legal de la Propiedad Intelectual · <https://www.oas.org/juridico/PDFs/arg_ley11723.pdf>

**Primary — the nomenclador itself**
- NBU Versión 2012, 74 pp., text-extractable (COBICO mirror) · <https://cobico.com.ar/wp-content/archivos/2013/07/N.B.U.-Version-2.012.pdf>
- NBU (CB Distrito 1 mirror, 66 pp.) · <http://www.cbdistrito1.org.ar/ObrasSociales/N.B.U.pdf>
- Anexo Noviembre 2023 de prácticas, normas e interpretaciones (COBICO) · <https://cobico.ar/wp-content/uploads/2023/12/Anexo-Noviembre-2023-de-Practicas-normas-e-interpretaciones.pdf>
- CUBRA *Actualización NBU* index · <https://cubra.org.ar/actualizacion-nbu/> *(unreachable from my network)*
- CUBRA Anexo 01.2024 · <https://cubra.org.ar/wp-content/uploads/2024/02/Anexo-01.2024-NBU-2012.pdf> *(unreachable)*
- CUBRA NBU 2012 Act. 2016 · <https://cubra.org.ar/wp-content/uploads/2024/07/NBU-Version-2012-Act.-2016.pdf> *(unreachable)*

**Primary — the financiador layer**
- FABA, NBU with CODIGO FABA · <http://www.faba.org.ar/nomencladores/nbu2010codigo.pdf>
- FABA, NBU PMOe CUBRA V3 · <http://www.faba.org.ar/Nomencladores/NBU%20PMOe%20CUBRA%20VER3%20CODIGO.pdf>
- FABA, Nomenclador IOMA · <http://www.faba.org.ar/Nomencladores/NomencladorIomaCodigo.pdf>
- FABA, Nomencladores y Listas (member-gated) · <http://www.faba.org.ar/nomencladoresYListas.asp>
- PAMI, Nomenclador Común, CKAN dataset (CC-BY-4.0, CSV/XLS + API) · <https://datos.pami.org.ar/dataset/nomenclador>
- APROSS Córdoba, Res. 369/22, nomenclador de prácticas bioquímicas · <https://www.apross.gov.ar/wp-content/uploads/2022/09/369-22-NOMENCLADOR-Practicas-Bioquimicas.pdf>
- COFyBCF, valor referencial de la Unidad Bioquímica (jul-2025) · <https://www.cofybcf.org.ar/noticia.php?n=3429>

**Adjacent**
- Centro Nacional de Terminología en Salud (SNOMED CT Argentina) · <https://www.argentina.gob.ar/salud/terminologia>
