# Sample instructions: is there a seed keyed to NBU código?

Research for issue [#24](https://github.com/FrancoLedArg/lab/issues/24). Investigated 2026-10-16.

**Question:** is there a source that maps Argentine prácticas to their sample requirements (sample
type, container, additive or medium, patient preparation, transport), that we can get as data, and
that is **keyed to NBU código**?

**Short answer: no. Don't seed.** No source keys sample requirements to NBU código. The NBU and its
re-codings (FABA, PAMI, APROSS) have no preanalytical column. The labs that do publish requirements
key them to **their own internal codes**. One lab even serves its whole manual as clean JSON. Those
internal codes come from the same old 3-digit numbering the NBU inherited, so they *look* like NBU
codes, and for routine prácticas they often match. But every lab reuses spare numbers for its own
tests. Manlab's `010` is 25-OH vitamina D; NBU `660010` is adrenalina urinaria. A join on código
would therefore attach confidently wrong containers to real prácticas. That is the failure the
ticket ranks as worse than an empty field. On top of that, every one of these manuals is "todos los
derechos reservados".

---

## 1. The nomenclador layer: no preanalytical column anywhere

#2 found this for the 2012 NBU. I re-checked it on the newer edition and on the financiador
re-codings, since a re-coding that added a sample column would have been the ideal find.

| Source | What a row holds | Sample / container / prep? |
|---|---|---|
| **NBU 2012 Act. 2016** (CUBRA, 97 pp., text-extractable) | código, nombre, Urgencia, Ref., UB | **None.** In the full text, `tubo`, `EDTA`, `citrato`, `ayuno`, `conservación`, `transporte` and `tipo de muestra` get zero hits each. `heparina` hits only as an analyte name (`660480 HEPARINA, RESISTENCIA A LA`). |
| **FABA, NBU con CODIGO FABA** | `CODIGO FABA · CODIGO NBU · PRACTICA · U.B.` | **None.** The 4 hits for `muestra` are inside practice names (`BACILOSCOPIA ... (POR MUESTRA)`). |
| **APROSS Res. 369/22** | código, descripción, UB, complexity tick-columns | **None.** The PDF is a **scan** (9 pages, 8 characters of text). I rendered page 3: columns are `000138 CALCULO URINARIO... 8,0 x`, with no sample column. |
| **PAMI Nomenclador Común** (CKAN, CC-BY-4.0) | `Módulo; Código; Descripción; Valor` | **None.** Columns as measured in #2. |

Sources: [NBU 2012 Act. 2016](https://cubra.org.ar/wp-content/uploads/2024/07/NBU-Version-2012-Act.-2016.pdf)
· [FABA NBU con código](http://www.faba.org.ar/nomencladores/nbu2010codigo.pdf)
· [APROSS Res. 369/22](https://www.apross.gov.ar/wp-content/uploads/2022/09/369-22-NOMENCLADOR-Practicas-Bioquimicas.pdf)
· [PAMI dataset](https://datos.pami.org.ar/dataset/nomenclador)

Note: **cubra.org.ar answered this time.** #2 could not reach it. The 2016 PDF downloaded directly
(4.0 MB, 97 pp.; metadata title *"NBU 2017 - Practicas en desuso (A4) Completo"*). My parse finds
1,445 distinct `66xxxx` codes. That is more than #2's 1,349 because this edition includes the
*prácticas en desuso*.

---

## 2. Professional bodies: guidance in prose, not a per-práctica table

- **FBA, Grupo de Trabajo Fase Preanalítica y Postanalítica (GTFPYPA)**, whose chair is listed as
  *"Buenos Aires - FBA- CUBRA"*. Its #03, *"Preparación del paciente para la toma de muestras de
  sangre: recomendaciones basadas en evidencia"* (*"PUBLICADA: febrero/2026"*), is a general rule
  with no per-práctica rows and no NBU codes. Its summary reads: *"como criterio general para la
  mayoría de los estudios bioquímicos de rutina, la toma de muestras de sangre se realice en horario
  matutino (07:00–09:00 h), luego del reposo nocturno, con 8 horas de ayuno"*. It also gives
  pediatric fasting times by age. This is good general guidance, and it is **not** a seed.
  ([PDF](https://www.fba.org.ar/wp-content/uploads/2026/02/AVANCE-3-GTFPYPA.pdf))
- The same group's #01, on the urine sample for *orina completa*, is also prose on a single
  práctica. ([PDF](https://www.fba.org.ar/wp-content/uploads/2025/06/AVANCE-GTFPYPA-2025.pdf))
  ⚠️ *Seen only through a search-index summary; I did not open it.*
- ⚠️ *Search-index only, not opened:* CRELAB Córdoba has a guide for collecting urine for
  urocultivo ([PDF](https://www.fcq.unc.edu.ar/wp-content/uploads/2024/11/toma-de-muestra-para-urocultivo.pdf)),
  and ANLIS has one for Chagas serology
  ([PDF](https://www.argentina.gob.ar/sites/default/files/manual_-_toma_de_muestra.pdf)). Each covers
  one práctica, in prose, by name.

No colegio or federation publishes a sample-requirements table alongside the nomenclador. The
profession treats preanalytics as each lab's own procedure. That is the same posture #2 found for
reference ranges.

---

## 3. Derivation labs: where the data actually lives

| Lab | What is public | Format | Size | Keyed by | Notice |
|---|---|---|---|---|---|
| **CIBIC** (Rosario) | *Manual de Prestaciones* for derivating labs | **JSON**, one unauthenticated GET | 1,758 rows / 1,660 codes | **internal `codigo`** (integer) | *"Cibic © Todos los derechos reservados."* |
| **Manlab** (CABA) | *Prestaciones* list + one *Ficha* per práctica | HTML, paginated (17 pages × 50) | 849 prácticas | **internal `Código`** | *"© 2026 MANLAB - Todos los Derechos Reservados"* |
| **IACA** (Bahía Blanca) | *Directorio de Análisis*, "más de 2.500 prácticas" (Shift LIS) | dynamic InterSystems Zen app, with an *Exportar* button | — | ⚠️ not verified | *"IACA LABORATORIOS S.A. :: © 2019 - 2026"* |
| **Fares Taie** (Mar del Plata) | *Catálogo de prácticas* | **behind login** (*"con su clave y usuario provista por el Laboratorio"*) | — | — | *"© 2026 \| Laboratorio Farestaie. Todos los derechos reservados."* |
| **Stamboulian** | *"más de 1.100 análisis"* with preparation | searchable web pages | — | by name (⚠️ only the landing page checked) | *"© 2026 Stamboulian Servicios de Salud. Todos los derechos reservados."* |
| **Hidalgo** | ⚠️ none found. `hidalgo.com.ar` is a customs broker; I found no public site for the lab. | | | | |

**CIBIC is the best-formed source that exists.** Its public page
`cibic.com.ar/Micibic/#/manualPrestaciones` is a Vue app that fetches
`https://wh.cibic.com.ar/api/getManualPrestaciones`: 520 KB of JSON with `Access-Control-Allow-Origin: *`.
Each row has `codigo, denominacion, metodo, tipoMuestra, cantidadMinima, unidad, envio, diasProceso,
diasPromesa`. Some examples, verbatim:

```
6    ACTH (ADENOCORTICOTROFINA)  PLASMA CON EDTA               Remitir el plasma congelado a -20°C
3003 FLUJO VAGINAL               FLUJO VAGINAL                 Envío en tubo de solución fisiológica estéril a 15° -25°C con porta asociado ...
475  HEMOGRAMA                   SANGRE + EDTA (HEMATOLOGIA)   REFRIGERADA (2 - 8C)
```

`tipoMuestra` is lab shorthand with 333 distinct values (`SUERO**`, `MO o SP c/EDTA.`, `PORTA CFV`).
`envio` is blank in 295 of the 1,758 rows.

**Manlab's fichas** have clean labelled fields: *Muestra, Conservación y transporte, Indicaciones al
paciente, Interferencias, Método, Valor de Referencia*. For example, ficha 006 (ACTH): *"Plasma con
EDTA. Recolectar en tubos enfriados, centrifugar, separar el plasma y congelar inmediatamente.
Utilizar únicamente tubos plásticos."* Some fichas are empty (049: every field *"Sin información"*).
Some say *"No se recibe por derivación"* (170).

So the content exists, and for CIBIC it is already machine-readable. **The problem is the key.**

---

## 4. How these codes key to NBU código: they look like they do, and they don't

**Where the 3-digit codes come from.** The NBU's own introduction says it replaced the *"reconocido
Nomenclador I.N.O.S."* and refers to practices by 3-digit numbers (*"el Acto Bioquímico (001)"*,
*"los códigos 677 y 998"*). FABA's `CODIGO FABA` column is the NBU code without its `660` prefix
(`2 → 660002`). APROSS does the same (`000174` = `660174`). The labs use this same old numbering
for routine prácticas. **Then each lab adds its own numbers for everything else, and sometimes
reuses a number the NBU gives to a different práctica.**

I parsed both labs' code lists and set each 3-digit code `NNN` against NBU `660NNN`:

| | CIBIC | Manlab |
|---|---|---|
| distinct codes | 1,660 | 849 |
| 3-digit (old-numbering style) | 296 | 684 |
| …of which `660NNN` exists in the NBU | 190 | 268 |
| …of those, **a different práctica** under the same number | **at least 12 (≈6%)** | **≈110–120 (over 40%)** |
| 4-digit or other in-house codes, no NBU counterpart at all | 1,364 | 165 (`053SC`, `17OH`, `1P36`…) |

*Method:* an automatic word-stem overlap between the two names, then a manual read of every pair
that failed it, and of the CIBIC pairs that passed. These counts are approximate, not audited. The
direction is not in doubt.

The collisions are the dangerous part. A sample:

| Code | NBU says | The lab means |
|---|---|---|
| `010` | `660010` ADRENALINA, urinaria | Manlab: 25-HIDROXI VITAMINA D |
| `053` | `660053` ANTIFÚNGICOS - PRUEBA DE SENSIBILIDAD | Manlab: HEPATITIS B - HBsAg |
| `121` | `660121` C4 - COMPLEMENTO | CIBIC: SUB UNIDAD BETA (HCG) · Manlab: HEPATITIS B GENOMA |
| `417` | `660417` GLUCOSA en orina | CIBIC: GLUCOSA-6-FOSFATO DEHIDROGENASA ERITROCITARIA |
| **`307`** | `660307` ETANOL - **urinario** (ALCOLURIA) | CIBIC: ALCOHOLEMIA (ETANOL **EN SANGRE**) |
| **`835`** | `660835` SEROTONINA - **sérica** | CIBIC: SEROTONINA **EN ORINA 24 HS** |

The last two are the worst kind. The names match closely enough to pass a check by eye, yet the
**specimen is different**: blood instead of urine, a 24 h urine instead of serum. Joining on código
would tell a technician to draw blood for a urine test.

**The ticket's own case doesn't key at all.** The vaginal-mucus práctica is NBU `660931 VAGINAL,
EXUDADO o FLUJO (Directo y Cultivo)`. CIBIC files it under internal code **`3003` FLUJO VAGINAL**.
Manlab has no entry for it. This is the general pattern. The rows that do share a number with the
NBU are routine PMO tests (hemograma, glucemia, TSH), which a lab already runs in-house and already
knows the tube for. The esoteric prácticas, the ones that actually trigger a call to the derivation
lab, carry in-house 4-digit codes. Reaching them would take the name-matching project the ticket
told us to stop at.

---

## 5. Even a correctly keyed row is one lab's shipping instruction

A derivation lab's manual says how to send a sample **to that lab**. It does not say what a
práctica needs in general.

- Manlab, hemograma (475): *"Remitir únicamente en tubo con EDTA enviado por MANLAB."*
- ACTH is *"congelado a -20 °C"* in both manuals. That is a transport condition for a courier trip.
  A lab running ACTH in-house wouldn't freeze it.
- The two labs disagree on the same práctica. For 25-OH vitamina D, Manlab (010) says *"Suero o
  plasma con EDTA ... Conservar protegido de la luz"* and CIBIC (1698) says *"SUERO"*. Neither is
  wrong. Each is describing its own method.

So the content is only correct for prácticas that the two labs derive **to that particular lab**.
That set is small, and staff know it, but the software doesn't.

---

## 6. A third-party "NBU + preanalítica" tool exists, and it confirms the problem

*NBU Conecta* ([site](https://consulta-nbu-2026.pickylopezz.chatgpt.site/)) is published as *"Por
Bioq. María Cecilia López"*. It presents NBU 2012/2016/2023/2024/2026 with *"Requisitos de
laboratorios ... (LAHT, Gornitz, IACA, CIBIC, Turner, GENDA, Labmedicina, MANLAB, Qualium Lab,
Mega Laboratorios)"*. It is not a primary source, and it is not a seed:

- Its NBU list (`nbu-data.json`) has `code, determination, ub, frequency`, with no sample field.
- The sample requirements are about **49 entries hard-coded in `app.js`**, attached to NBU rows
  **by regex on the practice name**. For example: `test: /^KPTT$|^APTT$|TROMBOPLASTINA PARCIAL ACTIVADA/, code: '887', ... sample: 'Plasma citratado en tubo de derivación MANLAB.'`
- The text is copied from the labs' public pages, and I found no licence or terms on the site.

So the only tool that presents sample requirements next to NBU codes gets them there by name
matching. The page itself warns that lab requirements must be checked before each shipment.

---

## 7. Licensing

**What the sources say:** every lab page carries "todos los derechos reservados" (quoted in §3). None
publishes terms of use or a licence for reuse. CIBIC's JSON endpoint is open to anyone technically
(no auth, CORS `*`), but nothing grants permission to reuse it. ⚠️ *Not legal advice. These are the
texts; the conclusions below are an inference.*

**The law:** [Ley 11.723 art. 1](https://www.argentina.gob.ar/normativa/nacional/ley-11723-42755/actualizacion)
(text per Ley 25.036) protects *"las compilaciones de datos o de otros materiales"*. It covers *"la
expresión de ideas, procedimientos, métodos de operación"* but *"no esas ideas, procedimientos,
métodos y conceptos en sí"*. So a single fact, such as *ACTH needs EDTA plasma, frozen*, belongs to
nobody. A lab's compiled table is protected as a compilation.

**For v1, two labs ([ADR 0002](../adr/0002-v1-is-two-labs.md)):** a lab reading its derivation
lab's manual and typing the answer into the field is what the manual exists for. It is also #19's
flow exactly, and it reuses facts, not the compilation. Bulk-importing the whole JSON into our
software is a different act: copying the compilation, with no licence. The practical risk is low
for a customer lab. It is still unlicensed, and one email to the derivation lab would settle it.

**If it is ever sold:** shipping CIBIC's or Manlab's compilation inside a commercial product, to
labs that may never derive to them, is redistribution of a protected compilation without
permission. **No**, unless there is a written licence from that lab.

---

## Recommendation

**Do not seed. The sample-instructions field ships empty for all 1,349 prácticas.**

Why:

1. **Nothing is keyed to NBU código.** The nomenclador layer has no sample column (§1). The bodies
   publish prose (§2). The labs key to their own codes (§3).
2. **The near-miss is a trap.** The labs' 3-digit codes match NBU numbers often enough to tempt a
   join, and wrong often enough (≈6% at CIBIC, over 40% at Manlab) to poison it. Some collisions
   swap the specimen while the names still look alike (§4). Under the ticket's rule that *a wrong
   seed is worse than an empty one*, this ends the question.
3. **Coverage falls where it is least needed.** The rows that do key are in-house routine tests.
   The derived esoterica, including the ticket's own vaginal-mucus case, don't key (§4).
4. **Even correct rows are one lab's courier instructions** (§5), and they are all rights reserved
   (§7).

**What covers the first occurrence instead (no code):** the derivation lab's online manual. If the
two labs derive to CIBIC or Manlab, the answer to "which container?" is one search away rather than
one phone call, and staff type it into the field as #19 already intends. A browser bookmark does
this job. It does not need a feature.

**If a seed is ever wanted anyway,** the only defensible form is small and slow: the ~180 CIBIC
3-digit rows that agree with the NBU, each read by a bioquímico against its NBU row, with CIBIC's
written permission, and only if the two labs derive to CIBIC. It would cover tests the labs mostly
run in-house. It is not worth doing in v1.

---

## Needs a human decision

- **Which lab(s) do the two labs derive to?** This decides whether §5's "one lab's instructions"
  concern applies, and which manual staff should bookmark.
- **If a seed is ever revisited:** someone emails that derivation lab to ask for (a) permission and
  (b) a mapping from its codes to NBU. Only the lab can produce (b) reliably.

## Not verified

- IACA's directory keys and export format (dynamic app, not driven). Fares Taie's catalog (login).
  Stamboulian's per-test fields (landing page only). Laboratorio Hidalgo (no public site found).
- The CIBIC and Manlab collision counts are by heuristic plus a manual read, not a full audit.

---

## Sources

**Nomenclador layer**
- NBU Versión 2012 Act. 2016 (CUBRA) · <https://cubra.org.ar/wp-content/uploads/2024/07/NBU-Version-2012-Act.-2016.pdf>
- FABA, NBU con CODIGO FABA · <http://www.faba.org.ar/nomencladores/nbu2010codigo.pdf>
- APROSS Res. 369/22 (scanned) · <https://www.apross.gov.ar/wp-content/uploads/2022/09/369-22-NOMENCLADOR-Practicas-Bioquimicas.pdf>
- PAMI Nomenclador Común (CKAN) · <https://datos.pami.org.ar/dataset/nomenclador>
- Prior research, #2 · [`ar-study-catalog.md`](ar-study-catalog.md)

**Professional bodies**
- FBA GTFPYPA #03, preparación del paciente (feb-2026) · <https://www.fba.org.ar/wp-content/uploads/2026/02/AVANCE-3-GTFPYPA.pdf>
- FBA GTFPYPA #01, orina completa (2025) · <https://www.fba.org.ar/wp-content/uploads/2025/06/AVANCE-GTFPYPA-2025.pdf> *(not opened)*
- CRELAB Córdoba, toma de muestra para urocultivo · <https://www.fcq.unc.edu.ar/wp-content/uploads/2024/11/toma-de-muestra-para-urocultivo.pdf> *(not opened)*
- ANLIS, toma de muestra para diagnóstico serológico · <https://www.argentina.gob.ar/sites/default/files/manual_-_toma_de_muestra.pdf> *(not opened)*

**Derivation labs**
- CIBIC, laboratorios derivantes · <https://www.cibic.com.ar/laboratorios-derivantes/#manual_de_prestaciones>
- CIBIC, Manual de Prestaciones (app) · <https://www.cibic.com.ar/Micibic/#/manualPrestaciones>
- CIBIC, Manual de Prestaciones (JSON) · <https://wh.cibic.com.ar/api/getManualPrestaciones>
- Manlab, Prestaciones · <https://derivaciones.manlab.com.ar/derivaciones/prestaciones.php>
- Manlab, fichas cited · [006](https://derivaciones.manlab.com.ar/derivaciones/ficha.php?codigo=006) · [010](https://derivaciones.manlab.com.ar/derivaciones/ficha.php?codigo=010) · [049](https://derivaciones.manlab.com.ar/derivaciones/ficha.php?codigo=049) · [051](https://derivaciones.manlab.com.ar/derivaciones/ficha.php?codigo=051) · [170](https://derivaciones.manlab.com.ar/derivaciones/ficha.php?codigo=170) · [475](https://derivaciones.manlab.com.ar/derivaciones/ficha.php?codigo=475)
- Manlab, home (copyright notice) · <https://www.manlab.com.ar>
- IACA, derivaciones · <https://iaca.com.ar/derivaciones/> · indicaciones · <https://iaca.com.ar/indicaciones-para-analisis/> · directorio · <https://shift.iaca.com.ar/shift/lis/iaca/elis/s01.iu.interface.web.consulta.Procedimento.cls?config=UNICO&sigla=>
- Fares Taie, colegas (login) · <https://farestaie.com.ar/colegas/>
- Stamboulian, análisis sin ayuno · <https://stamboulian.com.ar/laboratorio/analisis-sin-ayuno/>

**Third party**
- NBU Conecta · <https://consulta-nbu-2026.pickylopezz.chatgpt.site/> · data `nbu-data.json`, rules in `app.js`

**Law**
- Ley 11.723, texto actualizado · <https://www.argentina.gob.ar/normativa/nacional/ley-11723-42755/actualizacion>
