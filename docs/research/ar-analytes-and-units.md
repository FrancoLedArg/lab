# Reportable analytes and units: SNOMED CT AR, LOINC, or a curated seed?

Research for issue [#18](https://github.com/FrancoLedArg/lab/issues/18). Investigated 2026-10-16.

**Question:** when a técnico enters a hemograma, what are the ~20 lines, what unit does each carry,
and where does that structure come from on day one: SNOMED CT Argentine Edition, LOINC, or a list we
write by hand?

**Short answer: a hand-written seed, and no standard in v1.** No Argentine rule requires either
standard inside a private lab's own catalog. **SNOMED CT does not carry what we need**: it does not
list which lines make up a panel, and it does not attach units to lab tests. **LOINC does carry it**:
its panel file lists the CBC's members, each with an example unit. But its Argentine Spanish names
are six-part technical strings nobody would print. Its units are US units (`mg/dL`) where Argentine
labs write `g/L` or `mg%`. And its licence attaches obligations to every row we copy. So LOINC would
pre-fill only the list of members, the one part a bioquímico already knows by heart, and every
name, unit and range would still be written by hand. No Argentine lab product I could inspect
publishes LOINC or SNOMED codes on its analytes. They all ship editable, lab-defined determinaciones
with free-text units. For two labs that already print reports today, the cheapest day-one schema is
**their own current report formats, written down once as a seed file**. The unit is a free-text
string, printed exactly as the lab prints it now.

---

## 1. SNOMED CT Argentine Edition

### Licence: free in Argentina, including for a product

- **Who can get it.** *"Cualquier usuario del territorio argentino puede aplicar a una licencia de
  SNOMED CT. La misma es gratuita y será aprobada desde el Centro Nacional de Terminología en Salud de
  Argentina."* The application form is SNOMED's MLDS, Argentine landing page
  ([argentina.gob.ar/salud/terminologia](https://www.argentina.gob.ar/salud/terminologia),
  [MLDS AR](https://mlds.ihtsdotools.org/#/landing/AR?lang=es)).
- **Argentina is still a member.** It is listed under *Americas* on
  [snomed.org/members](https://www.snomed.org/members). It has been a member since January 2018
  ([CNTS](https://www.argentina.gob.ar/salud/terminologia)).
- **No fee in a member country.** *"SNOMED International does not charge for Affiliate Licensing or
  for use of SNOMED CT in Member countries."* Vendors deploying in a member country *"register [their]
  use with the National Release Center (NRC) of that country (unless your country has MLDS access, when
  this service should instead be used)"* ([get-snomed](https://www.snomed.org/get-snomed)).
- **Commercial use is allowed by the Affiliate Licence itself**
  ([PDF, version April 2023](https://www.snomed.org/_files/ugd/b17a0e_eb9ad064a1774ccaa7e53000b108afd5.pdf)).
  Clause 2.1.3 lets the licensee *"incorporate the International Release into Licensee Products, and
  distribute Licensee Products under a sub-license"*, and 2.1.5 lets it sub-license end users *"to the
  extent necessary for the End Users to use the Licensee Products"*. Clause 2.2.4 forbids public-facing
  systems from letting users *"extract any substantial portion of SNOMED CT"*. Clause 9.1 subjects use in
  a member territory to *"such conditions as the Member for that Member Territory"* sets.
  ⚠️ **Unverified:** I found no published statement of Argentina's own conditions. None of the CNTS
  pages (main page, FAQ, *SNOMED CT*, *Herramientas*) mentions companies, vendors or sub-licensing.
- **For v1 (two labs, ADR 0002):** free, one MLDS registration. **If it is ever sold inside Argentina:**
  still free, with the unverified local conditions above. **Outside Argentina:** fees by territory
  ([get-snomed](https://www.snomed.org/get-snomed)).

### Distribution: semi-annual, through MLDS, as RF2

- *"Cada 6 meses actualizamos y publicamos la extensión nacional"*
  ([FAQ](https://www.argentina.gob.ar/salud/terminologia/preguntas-frecuentes-de-snomed-argentina)).
  The edition is the Spanish edition plus local content
  ([SNOMED CT AR](https://www.argentina.gob.ar/salud/terminologia/snomed-ct)).
- Download is through MLDS after approval. ⚠️ **I did not download it.** It needs an approved account,
  so I cannot say from the files whether the Argentine extension adds any lab content.
- The ministry's public tools list a SNOMED↔CIE-10 map, Postman collections (HCE, medications,
  NOMIVAC, vaccines…) and a test Snowstorm server. **Nothing about laboratory, LOINC or units**
  ([Herramientas](https://www.argentina.gob.ar/salud/terminologia/herramientas-para-la-implementacion-de-snomed-ct),
  [Repositorio](https://www.argentina.gob.ar/salud/digital/terminologia/repositorio-mesa-de-estandares-de-terminologia)).
  The test server `snowstorm-test.msal.gob.ar` answered *"No Mapping Rule matched"* on every path I
  tried, so I could not search the edition through it.

### Are observable entities usable as a result schema? No.

- SNOMED's observable model **has** a `Units` attribute: *"used to specify the units used in assigning a
  value to an observation"*. The guide's only example is *Basophils per 100 leukocytes → Percentage
  unit* ([Editorial Guide, defining attributes](https://docs.snomed.org/education/snomed-ct-education-editorial-guide/readme/authoring/domain-specific-modeling/observable-entity/observable-entity-defining-attributes)).
  It does not say lab observables routinely carry it.
- **SNOMED has no panel membership.** Even inside the LOINC Ontology, SNOMED's own release notes say:
  *"There is no connection between a LOINC panel and its constituents"*
  ([LOINC Ontology release notes](https://loincsnomed.org/notes)). So SNOMED cannot answer *"what are
  the twenty lines of a hemograma"*.
- **SNOMED is handing lab observables to LOINC.** The joint ontology site says *"SNOMED CT provides
  the computable framework and LOINC provides laboratory and pathology content"*. Only *"general content
  such as 'Sodium in blood (observable entity)'"* will be added to the International Release
  ([loincsnomed.org](https://loincsnomed.org/), [FAQ](https://loincsnomed.org/faq)).

**Verdict:** SNOMED CT AR is the right tool for diagnoses, procedures, specimens, organisms and coded
answers. It is the wrong tool for the result schema. It has no panel structure, no bound units, and
it points at LOINC for lab content.

---

## 2. LOINC

### Licence: free, commercial use allowed, with strings attached

Read from the [LOINC License](https://loinc.org/license) (loinc.org returns HTTP 403 to automated
fetches; I read the [2026-09-29 Wayback snapshot](https://web.archive.org/web/20260929231741/https://loinc.org/kb/license),
*"Last updated on August 6, 2026"*):

- *"Permission is hereby granted in perpetuity, without payment of license fees or royalties, to use,
  copy, or distribute the Licensed Materials for any commercial or non-commercial purpose"*.
- **Copying rows into our product has conditions.** Portions may go into *"software programs"* only if
  the product shows the fixed LOINC notice. Also *"Any information that is extracted from the Licensed
  Material must always be associated with the corresponding identifier from LOINC … and include the
  corresponding LOINC display name"*. **So every seeded analyte that came from LOINC must keep its LOINC
  code and a LOINC name next to it**, even if we never print them.
- **Fields may not be edited.** *"The contents of any fields in the Group 3 Artifacts shall not be
  changed."* Group 3 includes the *Panels and Forms File*, the *Linguistic Variants Files* and the
  *Common UCUM Codes File*. Local additions need an `X`-prefixed code.
- **Section 1** forbids using LOINC *"for the purpose of developing or promulgating a different standard
  for identifying patient observations"*. A private seed for two labs is not that. Publishing our list
  as a reusable code system might be.
- **Download needs a free account.** *"You must be logged in with your LOINC username and password to
  download this file."* Current: **2.83, released 2026-08-19, `Loinc_2.83.zip`, 88.52 MB**. Releases
  are *"every six months, in February and August. This cadence will be changing to monthly in 2027"*
  ([downloads, snapshot 2026-09-18](https://web.archive.org/web/20260918072127/https://loinc.org/downloads)).
  It is CSV data that can be parsed once. No runtime dependency is needed.

### It does carry panel structure and units

LOINC is the only source I found that ships *"the lines of a hemograma"* as data:

- **57021-8 *CBC W Auto Differential panel – Blood*** lists, with an example UCUM unit for each:
  leucocitos `10*3/uL`, eritrocitos `10*6/uL`, hemoglobina `g/dL`, hematocrito `%`, VCM `fL`, HCM `pg`,
  CHCM `g/dL`, RDW `%`, plaquetas `10*3/uL`, PDW, VPM. It then lists the differential (neutrófilos,
  cayados, linfocitos, monocitos, eosinófilos, basófilos…) both as `%` and as `10*3/uL`. That is 30
  child rows marked Required / Optional / Conditional
  ([57021-8, snapshot](https://web.archive.org/web/20260922114140/https://loinc.org/57021-8),
  [58410-2](https://web.archive.org/web/20251231150127/https://loinc.org/58410-2/)).
- A **Top 20,000 results** list, a **Universal Lab Order Codes** list and a **Common UCUM Codes** list
  exist to *"jump start your standardization effort"*
  ([usage, snapshot](https://web.archive.org/web/20260506045842/https://loinc.org/usage/)).

### But the Spanish is not printable, and the units are not Argentine

- **There is a Spanish (Argentina) variant.** It was made by *"Guillermo Reynoso, MD, MBA from the
  International Medical Terminology Research Center in Argentina"* (Conceptum) and ships in the
  Complete LOINC File ([Spanish translations, snapshot](https://web.archive.org/web/20260208044833/https://loinc.org/international/spanish/),
  [International](https://web.archive.org/web/20260310134537/https://loinc.org/international/)).
- **What it actually says** for the lines that matter:
  - 718-7: `hemoglobina:concentración de masa:punto en el tiempo:sangre:cuantitativo:`
  - 2345-7: `glucosa:concentración de masa:punto en el tiempo:suero/plasma:cuantitativo:`
  - 6690-2: `leucocitos:concentración de número:punto en el tiempo:sangre:cuantitativo:recuento automático`

  ([718-7](https://web.archive.org/web/20250813074427/https://loinc.org/718-7/),
  [2345-7](https://web.archive.org/web/20250413170420/https://loinc.org/2345-7/),
  [6690-2](https://web.archive.org/web/20250421050321/https://loinc.org/6690-2)). These are the six
  LOINC axes, translated and joined with colons. A lab prints *Glucemia*, *Hemoglobina*, *Glóbulos
  blancos*. The CBC panel pages showed no es-AR name at all. ⚠️ **Unverified:** how many terms the
  es-AR variant covers, and whether it fills any short or display-name field. The file needs a login.
- **Example units are US/Canadian:** glucose and cholesterol `mg/dL`, leukocytes `10^9/L` (source
  *eCHN*) ([2345-7](https://web.archive.org/web/20250413170420/https://loinc.org/2345-7/),
  [2093-3](https://web.archive.org/web/20250414111913/https://loinc.org/2093-3/),
  [6690-2](https://web.archive.org/web/20250421050321/https://loinc.org/6690-2)). Argentine labs
  write other units (see §4).

### Do Argentine labs recognise the codes?

**I found no evidence that they do.** No Argentine lab product I could read mentions LOINC on its
catalog (§6). Searches for LOINC adoption by Argentine labs returned nothing specific. The only
Argentine code I found that mentions LOINC is ANDES (Neuquén). There LOINC tags *document types*
(`loinc: '60591-5'` for the IPS), not analytes, and ANDES's own lab system has no LOINC column (§6).
⚠️ Absence of evidence, not proof. Large hospitals (e.g. Hospital Italiano) may map internally. I
found nothing published.

**Mapping is error-prone even where it is mandatory.** McDonald et al. (JAMIA 2022) looked at 179
million results. They found a **4.6 %** mis-mapping rate overall: **0.4 % in chemistry and 7.5 % in
hematology**. About half the errors were in the *property* axis
([NLM LHC](https://lhncbc.nlm.nih.gov/LHC-publications/pubs/MismappingsbetweenaproducersquantitativetestcodesandLOINCcodesandanalgorithmforcorrectingthem.html)).
A code nobody on the bench reads is a code nobody notices is wrong.

---

## 3. How the two relate: LOINC is the spine, SNOMED annotates

- Regenstrief and SNOMED International signed a cooperative agreement in **October 2022**, renewed in
  **2025**, *"to minimize duplication between LOINC and SNOMED CT"*. The product is the **LOINC
  Ontology**, a SNOMED CT extension that gives LOINC lab terms SNOMED observable-entity identifiers.
  Version 2.82 (March 2026) has *"more than 45,000 concepts, including 78% of the top 20,000 most used
  LOINC concepts"* ([loincsnomed.org](https://loincsnomed.org/)). Regenstrief *"continues to own and
  manage the ontology"* ([SNOMED news](https://www.snomed.org/news/snomed-international-and-loinc%C2%AE-announce-renewed-collaboration-agreement-and-upcoming-production-release-of-the-loinc-ontology)).
  The CNTS FAQ confirms each organisation *"mantiene el control editorial de su respectivo estándar"*
  ([FAQ](https://www.argentina.gob.ar/salud/terminologia/preguntas-frecuentes-de-snomed-argentina)).
- **So:** the *question* (what was measured) is LOINC. SNOMED supplies coded *answers*, specimens and
  organisms, and a computable hierarchy over LOINC through the ontology.
- **The ontology carries no Spanish yet.** *"We are working on a process to handle translations"*
  ([FAQ](https://loincsnomed.org/faq)).
- ⚠️ **The licence story for the ontology contradicts itself.** SNOMED's guide says users need *"a valid
  Affiliate License for SNOMED CT"* ([docs.snomed.org](https://docs.snomed.org/implementation-guides/loinc-implementation-guide/technical-application/6.2-accessing-the-loinc-ontology)).
  The ontology FAQ says *"You do not need a SNOMED CT license to use the LOINC Ontology"*
  ([FAQ](https://loincsnomed.org/faq)). This does not matter for v1. In Argentina both licences are
  free anyway.

---

## 4. Units: free text, and it is ours to seed

**UCUM** is free: *"worldwide, non-exclusive, no-charge, royalty-free, revocable license … for the
purposes of developing and commercializing Software Applications"* ([ucum.org/license](https://ucum.org/license),
v1.1 June 2024). LOINC carries example UCUM units per term (§2). SNOMED does not carry units for lab
tests in any usable way (§1).

**What Argentine labs actually print:**

| Source | Glucosa | Urea | Colesterol | Counts |
|---|---|---|---|---|
| Hospital de Trelew, *Acta Bioquím Clín Latinoam* 46(1), 2012 ([SciELO](https://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S0325-29572012000100003)) | `g/L` (0,74–1,07) | `g/L` | `g/L` | — (Hb `g/dL`, creatinina `mg/dL`, ácido úrico `mg/L`) |
| IBC Rosario, *Valores de referencia, vigencia 02/2020* ([PDF](https://ibcrosario.com.ar/recursos/ValoresdeReferencia_202002.pdf)) | `mg%` (70–110) | `mg%` | `mg%` | `meq/l`, `gr/24 hs`, `ug/g de creatinina` |
| IBC Rosario, *Hemograma automatizado* ([page](https://www.ibcrosario.com.ar/articulos/HemogramaAutomatizadoValoresDeReferencia.html)) | | | | leucocitos and plaquetas `/ul`, fórmula `%`, VCM `fl` |
| LOINC example UCUM | `mg/dL` | | `mg/dL` | `10*3/uL` |

Two Argentine labs use **three different units for glucose**, and neither uses LOINC's. `mg%` is not
valid UCUM at all. The NBU carries no units either. The 2026 update still has none: I grepped it for
`mg/dl`, `g/dl` and `unidad de medida` and got zero hits
([NBU act. 2026](https://cubra.org.ar/wp-content/uploads/2026/09/NBU-actualizacion-2026-final-sept.pdf)).

**Conclusion:** the unit is what the lab prints, so it is a **free-text string on the Analyte**, copied
onto the Measurement (already the shape in `CONTEXT.md`). A separate UCUM code column would be *"a
field nobody fills"* (CONTEXT rule 4) until something machine-reads our results. Nothing does in v1.

---

## 5. Does any Argentine rule require one of them? No, not for this.

- **Res. 680/2018** (MSyDS) approves the *Estándares* annex. It proposes *"SNOMED para la terminología
  del registro de información en documentos clínicos, y estándares de HL7 para la estructuración y
  comunicación"*, plus CIE-10/11 for statistics. It applies *"a todas las comunicaciones de información
  clínica entre la Secretaría de Gobierno de Salud de la Nación y todas las jurisdicciones, y a los
  intercambios inter-jurisdiccionales mediados por una estructura nacional de interoperabilidad"*.
  Adoption is *"de manera paulatina"*. **LOINC and UCUM are not mentioned**
  ([text](https://www.argentina.gob.ar/normativa/nacional/317230/texto),
  [annex PDF](https://www.argentina.gob.ar/normativa/317230_RES680_pdf/archivo), which I extracted and read in full).
- **Red de Salud Digital, *Estándares* page:** HL7 FHIR, SNOMED CT, CIE-10→11, REFES/REFEPS, MPI. *"La
  adherencia a estos estándares es un requisito ineludible para la participación en la Red."* **No
  LOINC, no UCUM, no laboratory**
  ([estandares](https://www.argentina.gob.ar/salud/digital/estandares)).
- **AR.FHIR.CORE** (MSAL + HL7 Argentina, v0.5.0): profiles for Patient, Practitioner, Organization,
  IPS Bundle/Composition, DocumentReference, Consent, Immunization. **No Observation or DiagnosticReport
  profile**, and no LOINC/UCUM binding ([guias.hl7.org.ar](https://guias.hl7.org.ar/site/index.html)).
  ⚠️ The ministry's newer guides live at `openrsd.msal.gov.ar`. It refused connections all session
  (`ECONNREFUSED`), so a newer lab profile there is **unverified**.
- **Ley 27.706 / Decreto 393/2023:** the Ministry must *"establecer los estándares técnicos de
  comunicación y terminologías clínicas necesarias para la interoperabilidad"*. HCE systems must be
  registered in the *Registro de Dominios de Interoperabilidad* (Res. 115/19) *"para su
  interoperabilidad"* ([Ley](https://www.argentina.gob.ar/normativa/nacional/ley-27706-380710/texto),
  [Decreto 393/2023](https://www.argentina.gob.ar/normativa/nacional/decreto-393-2023-387475/texto)).
  This delegates the choice. I found no instrument that has picked a lab-result terminology.
- **Res. 189/2018** (Estrategia de Salud Digital) names no terminology in its articles
  ([text](https://www.argentina.gob.ar/normativa/nacional/315832/texto)).

**For v1:** nothing binds a private lab's internal analyte catalog. The obligations attach to
exchanging data on the national Red, which this product does not do. **If it ever joins the Red:**
SNOMED CT AR + FHIR are the named standards. A lab-result binding would then be the ministry's call,
and it has not made one yet.

---

## 6. What Argentine lab software does

Every product below is Argentine and publishes something about its catalog. **None mentions LOINC,
SNOMED or UCUM for analytes.** The ones that mention HL7 or FHIR mean interfaces to analysers and
derivación labs.

| Product | What it publishes |
|---|---|
| **Ibis** (cloud LIS) | *"Incluye cientos de prácticas preconfiguradas, y además ofrece la posibilidad de personalizarlas integralmente"*. *"Sencilla configuración de prácticas, valores de referencia y métodos"*. Search by *"código FABA, código NBU CUBRA"*. HL7 FHIR *"certified"* for integration with MANLAB, IACA… ([ibis-lis.com](https://ibis-lis.com/)) |
| **MaiLab** | *"Es usted el que puede diseñar sus análisis, sus determinaciones, sus valores de referencia, su estética, sus métodos, su orden"*. Ranges by age/sex. *"Puede cambiar valores de referencia sin afectar informes previos"*. Reports *"con los códigos que comienzan con 66 del NBU"* ([mailab.com.ar](https://www.mailab.com.ar/detalle-de-posibilidades.html)) |
| **ANALIS.ar** | *"Los rangos se cargan por práctica, edad y sexo, con los métodos y unidades que usa el laboratorio"*. *"se adapta a cada laboratorio: sus prácticas, sus unidades, sus valores de referencia"*. *"Habla el estándar HL7 FHIR"* ([analis.ar](https://analis.ar/)) |
| **LABO DATA2000** | *"Todos los análisis nomenclados, no nomenclados y todas las versiones de NBU"* ([sistemasdata2000.com.ar](http://www.sistemasdata2000.com.ar/labodata.html)) |
| **Analisys** | HL7 and analyser links, *"enlace con facturadores como SUAP"* ([analisys.com.ar](https://analisys.com.ar/web/)) |
| **Labim** (Dimsoft, San Juan) | *"resultados precargados"*, customisable reports ([dim-soft.com](https://dim-soft.com/)) |
| **InterPracsys** (Bariloche) | *"estándares ASTM y HL7"* for analysers ([interpracsys.com](https://interpracsys.com/)) |
| **ReporteWeb** | *"valores de referencia automáticos"* ([reporteweb.com.ar](https://reporteweb.com.ar/)) |

**The one schema I could read: SIL2, the public lab system of Neuquén's ANDES platform**
([github.com/andes/SIL2](https://github.com/andes/SIL2), GPL-3.0, last commit 2026-10-15). ANDES
advertises itself as *"basado en estándares internacionales tales como HL7/FHIR, SNOMED, LOINC y
DICOM"* ([README](https://github.com/andes/andes)). Even so, its analyte table `LAB_Item` has `codigo`
(local), `nombre`, `codigoNomenclador` (NBU), `idUnidadMedida`, `valorMinimo/valorMaximo`,
`idTipoResultado`, `formatoDecimal`, and **no LOINC or SNOMED column**
([Item.hbm.xml](https://github.com/andes/SIL2/blob/main/Business/Data/Laboratorio/Item.hbm.xml)). Its
unit table `LAB_UnidadMedida` is **a 50-character free-text `nombre`, per efector**
([UnidadMedida.hbm.xml](https://github.com/andes/SIL2/blob/main/Business/Data/Laboratorio/UnidadMedida.hbm.xml)).

**What labs tolerate:** an editable, lab-owned list of determinaciones, keyed to NBU, with free-text
units and the lab's own ranges. The commercial ones ship a pre-filled starting set (*"cientos de
prácticas preconfiguradas"*). Nobody advertises a terminology. ⚠️ I saw no product's actual seed
data, only their claims.

---

## 7. The curated seed, costed honestly

### What the NBU already gives us for free

The **NBU 2012 – Actualización 2026** (CUBRA, September 2026; text-extractable, 131 pp.) has *Normas
Específicas e Interpretaciones*. They spell out what a composite práctica includes, **by NBU code**
([PDF](https://cubra.org.ar/wp-content/uploads/2026/09/NBU-actualizacion-2026-final-sept.pdf)):

> `660475 HEMOGRAMA` — *"Comprende la realización de Hematocrito, recuento de glóbulos blancos y
> glóbulos rojos; dosaje de hemoglobina; fórmula leucocitaria; caracteres morfológicos e índices
> hematimétricos y recuento de plaquetas. Incluye los códigos: 660354, 660409, 660410, 660466, 660470 y
> 660746."*
>
> `660481 HEPATOGRAMA` — *"GOT, GPT, Fosfatasa Alcalina, Bilirrubina Total, Directa e Indirecta.
> Incluye los códigos: 660110, 660357, 660873 y 660874."*
>
> `668298 PERFIL LIPÍDICO` — *"Colesterol Total - HDL-Colesterol - LDL Colesterol - Triglicéridos.
> Incluye los códigos: 660174, 661035, 661040, 660876."*

I parsed the norms and found **~37 composite prácticas with an *"Incluye … códigos"* line**:
coagulograma, ionograma sérico/urinario, ácido base, LCR, líquido de punción, proteinograma, espermograma
(módulos I/II), urocultivo, coprocultivo, TORCH, exudados, and so on. This is the **checklist of which
practices need a multi-line schema**, in the vocabulary the lab already bills in. It stops one level
short: `660354 FORMULA LEUCOCITARIA` is one code but 5–10 printed lines, and `660110 BILIRRUBINEMIA
TOTAL, DIRECTA E INDIRECTA` is one code but three lines. Some practices with many lines have no
composition norm at all, e.g. `660711 ORINA COMPLETA`. Everything else is **one práctica = one analyte**
(glucemia, urea, TSH…). For those the default is the NBU name with the unit left blank. It is filled in
the first time the práctica is used (CONTEXT rule 1).

### Option A: hand-written seed from the two labs' current reports (recommended)

- **Scope:** the composite prácticas the two labs actually run. That is the ~37 from the NBU norms
  plus the few with many lines but no norm, such as orina completa. The issue
  guessed *"~50 panels"*, and that holds. Rough size, my estimate: hemograma ~20 lines, orina
  completa ~20–25, hepatograma 6–9, coagulograma 4–5, EAB ~8, perfil lipídico 4–6, ionograma 2–3,
  espermograma ~20. **A few hundred Analyte rows in total**, and fewer once shared analytes are
  counted once (plaquetas, Na/K, glucosa). That is one CSV or SQL seed file.
- **Source:** the two labs already print these reports today, with their own names, units, method and
  ranges. Copying them gives the *lab's own* units (`mg%` or `g/L`, whichever they use) and ranges they
  already stand behind. A generic standard cannot give either.
- **Effort, estimated:** one to two working days for a bioquímico, plus a developer turning it into a
  seed. Less if the labs' current system can export its determinaciones (see *Open questions*).
- **Licence:** none. It is the labs' own work.
- **Maintenance:** none from upstream. The labs edit their own Analytes. The yearly NBU anexo changes
  billing rows and rarely touches result lines.

### Option B: seed from LOINC

- Free account → 88.5 MB zip → parse three CSVs (table, panels, es-AR variant). One-off, no runtime
  dependency.
- Then, **by hand**: pick a LOINC panel per NBU práctica. That is ~50 judgement calls, and US panels
  do not match Argentine ones one-to-one. Next, write a printable Spanish name for every line, because
  es-AR gives `glucosa:concentración de masa:…`. Next, replace the units, because `mg/dL` is not what
  either lab prints. Then add the ranges, which LOINC does not have.
- **Licence cost:** every seeded row must carry its LOINC code and a LOINC display name, plus the
  notice in the app. Field contents may not be changed.
- **What it saves:** the list of members per panel, the one thing a bioquímico recites without looking.
- **What it buys:** a LOINC code on each Analyte, which nothing in v1 reads.

### Option C: seed from SNOMED CT AR

It does not produce a schema: no panel membership and no bound units (§1). It costs an MLDS
registration and an RF2 parser to get, at most, names for single analytes, which the NBU already gives.

### Option D: nothing

Every lab types its hemograma's twenty lines the first time it orders one. This is legal and it is
what CONTEXT rule 1 already allows. But the first hemograma of the first day becomes a configuration
session at the counter, which is exactly what *"a lab starts and opens Fichas the same hour"* forbids.
A seed of a few hundred rows is cheaper than that first morning.

---

## What this means for the v1 spec

1. **No terminology in v1.** No `loinc` or `snomed` column on Analyte. Nothing reads it, no rule
   requires it, and no one on the bench would notice if it were wrong.
2. **Unit is free text** on the Analyte, printed verbatim and copied onto the Measurement. No UCUM
   validation.
3. **Day-one schema = one hand-written seed file**, built from the two labs' current report formats
   and checked against the NBU 2026 composition norms. Single-analyte prácticas get one Analyte named
   after the práctica, unit blank, filled on first use. This fills exactly what `CONTEXT.md` left to
   #18: *"Range sets ship suggested … What fills them is #18's job."*
4. **Leave the door open, at zero cost:** `ponytail:` if results ever go out over FHIR (the national
   Red, or a derivación partner that demands it), add a nullable `loinc` column and map the few hundred
   seeded Analytes once. That is a migration plus an afternoon of mapping. Mapping only the lines a
   lab really uses keeps the error surface small (hematology mis-mapping runs at 7.5 % even in the US).
5. **Do not copy content from LOINC into the seed.** The moment we do, every copied row has to carry
   LOINC's code and name. Looking at a LOINC panel to remind ourselves of a line we forgot is fine.

---

## Open questions

- **What do the two labs use today to print reports, and can it export?** If their current system can
  dump determinaciones, units and ranges, the seed is an import, not a transcription. One question to
  the bioquímica decides this.
- **Do the two labs' current ranges count as already confirmed?** They are the lab's own, not ours.
  `CONTEXT.md` says seeded ranges *"ship suggested; a Bioquímico confirms once"*. Keeping the
  confirm-once step costs nothing and stays correct if the seed is ever reused for a third lab.
- **SNOMED CT AR's local conditions for vendors** (Affiliate Licence clause 9.1) are unpublished. They
  matter only if the product is sold. One email to `terminologia.salud@msal.gov.ar` settles it.
- **openrsd.msal.gov.ar was unreachable**, so check it once for any lab-result FHIR profile before
  ever building an export.
- **Side finding for #2:** CUBRA published **NBU Versión 2012 – Actualización 2026** in September 2026
  ([PDF](https://cubra.org.ar/wp-content/uploads/2026/09/NBU-actualizacion-2026-final-sept.pdf)), and
  `cubra.org.ar` is reachable now. It was unreachable during #2. The NBU seed source in
  `ar-study-catalog.md` and `CONTEXT.md` (*"NBU 2012 act. 2016"* + anexos) may be one release behind.

---

## Sources

**Primary — SNOMED CT**
- Centro Nacional de Terminología en Salud · <https://www.argentina.gob.ar/salud/terminologia>
- CNTS FAQ · <https://www.argentina.gob.ar/salud/terminologia/preguntas-frecuentes-de-snomed-argentina>
- SNOMED CT (edición argentina) · <https://www.argentina.gob.ar/salud/terminologia/snomed-ct>
- Herramientas para la implementación · <https://www.argentina.gob.ar/salud/terminologia/herramientas-para-la-implementacion-de-snomed-ct>
- Repositorio Mesa de Estándares · <https://www.argentina.gob.ar/salud/digital/terminologia/repositorio-mesa-de-estandares-de-terminologia>
- MLDS, Argentina · <https://mlds.ihtsdotools.org/#/landing/AR?lang=es>
- SNOMED members · <https://www.snomed.org/members>
- Get SNOMED CT (fees) · <https://www.snomed.org/get-snomed>
- SNOMED CT Affiliate License Agreement (April 2023) · <https://www.snomed.org/_files/ugd/b17a0e_eb9ad064a1774ccaa7e53000b108afd5.pdf>
- Editorial Guide, observable entity defining attributes · <https://docs.snomed.org/education/snomed-ct-education-editorial-guide/readme/authoring/domain-specific-modeling/observable-entity/observable-entity-defining-attributes>

**Primary — LOINC, UCUM, and the joint ontology** (loinc.org blocks automated fetches; read through Wayback snapshots)
- LOINC License · <https://loinc.org/license> · [snapshot 2026-09-29](https://web.archive.org/web/20260929231741/https://loinc.org/kb/license)
- Download LOINC (2.83) · [snapshot 2026-09-18](https://web.archive.org/web/20260918072127/https://loinc.org/downloads)
- International / linguistic variants · [snapshot](https://web.archive.org/web/20260310134537/https://loinc.org/international/)
- Spanish translations · [snapshot](https://web.archive.org/web/20260208044833/https://loinc.org/international/spanish/)
- Common result and order codes · [snapshot](https://web.archive.org/web/20260506045842/https://loinc.org/usage/)
- Terms: [57021-8](https://web.archive.org/web/20260922114140/https://loinc.org/57021-8) · [58410-2](https://web.archive.org/web/20251231150127/https://loinc.org/58410-2/) · [718-7](https://web.archive.org/web/20250813074427/https://loinc.org/718-7/) · [2345-7](https://web.archive.org/web/20250413170420/https://loinc.org/2345-7/) · [2093-3](https://web.archive.org/web/20250414111913/https://loinc.org/2093-3/) · [6690-2](https://web.archive.org/web/20250421050321/https://loinc.org/6690-2)
- LOINC Ontology · <https://loincsnomed.org/> · [FAQ](https://loincsnomed.org/faq) · [release notes](https://loincsnomed.org/notes)
- SNOMED LOINC IG, accessing the ontology · <https://docs.snomed.org/implementation-guides/loinc-implementation-guide/technical-application/6.2-accessing-the-loinc-ontology>
- SNOMED/LOINC renewed agreement (2025) · <https://www.snomed.org/news/snomed-international-and-loinc%C2%AE-announce-renewed-collaboration-agreement-and-upcoming-production-release-of-the-loinc-ontology>
- UCUM License v1.1 · <https://ucum.org/license>

**Primary — Argentine law and the Red**
- Res. 680/2018 MSyDS · <https://www.argentina.gob.ar/normativa/nacional/317230/texto> · [annex PDF](https://www.argentina.gob.ar/normativa/317230_RES680_pdf/archivo)
- Res. 189/2018 SGS · <https://www.argentina.gob.ar/normativa/nacional/315832/texto>
- Red de Salud Digital, Estándares · <https://www.argentina.gob.ar/salud/digital/estandares>
- AR.FHIR.CORE · <https://guias.hl7.org.ar/site/index.html>
- Ley 27.706 · <https://www.argentina.gob.ar/normativa/nacional/ley-27706-380710/texto>
- Decreto 393/2023 · <https://www.argentina.gob.ar/normativa/nacional/decreto-393-2023-387475/texto>
- openrsd.msal.gov.ar *(unreachable)* · <https://openrsd.msal.gov.ar/>

**Primary — Argentine practice**
- CUBRA, NBU Versión 2012 – Actualización 2026 · <https://cubra.org.ar/wp-content/uploads/2026/09/NBU-actualizacion-2026-final-sept.pdf>
- Yofre et al., Hospital de Trelew reference intervals, ABCL 2012 · <https://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S0325-29572012000100003>
- IBC Rosario, Valores de referencia 02/2020 · <https://ibcrosario.com.ar/recursos/ValoresdeReferencia_202002.pdf>
- IBC Rosario, Hemograma automatizado · <https://www.ibcrosario.com.ar/articulos/HemogramaAutomatizadoValoresDeReferencia.html>

**Vendors and public systems**
- Ibis · <https://ibis-lis.com/>
- MaiLab · <https://www.mailab.com.ar/detalle-de-posibilidades.html>
- ANALIS.ar · <https://analis.ar/>
- LABO DATA2000 · <http://www.sistemasdata2000.com.ar/labodata.html>
- Analisys · <https://analisys.com.ar/web/>
- Labim (Dimsoft) · <https://dim-soft.com/>
- InterPracsys · <https://interpracsys.com/>
- ReporteWeb · <https://reporteweb.com.ar/>
- ANDES (Neuquén) · <https://github.com/andes/andes> · SIL2 · <https://github.com/andes/SIL2>

**Secondary**
- McDonald et al., *Mis-mappings between a producer's quantitative test codes and LOINC codes*, JAMIA 2022 · <https://lhncbc.nlm.nih.gov/LHC-publications/pubs/MismappingsbetweenaproducersquantitativetestcodesandLOINCcodesandanalgorithmforcorrectingthem.html>
