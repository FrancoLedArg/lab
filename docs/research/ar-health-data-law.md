# Argentine law constraining lab-record software

Research for issue [#5](https://github.com/FrancoLedArg/lab/issues/5). Last verified **2026-08-31**.

> **Not legal advice.** This is a requirements-gathering note for a product spec, written from
> primary sources (InfoLeg, Argentina.gob.ar, AAIP, Boletín Oficial). Items that genuinely need a
> lawyer are collected in [§9](#9-what-genuinely-needs-a-lawyer) and flagged inline as **[LAWYER]**.
> Nothing below was inferred from a secondary write-up without checking the norm itself.

---

## 1. TL;DR — the constraints that shape the build

| # | Constraint | Source | Hits |
|---|---|---|---|
| C1 | A lab result **is** part of the historia clínica | Ley 26.529 art. 16 | data model |
| C2 | Records kept **≥ 10 years** from the last entry; deletion is not the patient's to demand | Ley 26.529 art. 18; Ley 25.326 art. 16.5 | data model, retention |
| C3 | **No in-place edits.** A correction is a new entry that leaves the wrong one visible and marked | Decreto 1089/2012 art. 15; Ley 27.706 art. 4 | **domain model (#6)** |
| C4 | Electronic records must be integral, authentic, **inalterable**, durable, recoverable; field-level modification control and per-user credentials are named explicitly | Ley 26.529 art. 13 | data model, auth |
| C5 | Patient owns the record and gets an **authenticated copy within 48 h** | Ley 26.529 art. 14; Decreto 1089/2012 art. 14 | export/PDF |
| C6 | The **director técnico must sign** the reports handed to patients | Ley 17.132 art. 32 | **report (#12)** |
| C7 | The printed protocol must carry lab letterhead + DT **name, matrícula, phone, address, signature** | MS habilitación requirement | **report (#12)** |
| C8 | Mandatory report field set (patient ID, analysis ID, lab ID, sample type, reference intervals, date, professional who endorses it, observations space, sample-quality note) | MERCOSUR/GMC Res. 30/20 §4.7.3 | **report (#12)** |
| C9 | The lab must have a procedure that **prevents alteration of issued reports** and keeps results traceable | MERCOSUR/GMC Res. 30/20 §4.7.7–4.7.8 | domain model |
| C10 | Health data = **datos sensibles**; written (or equivalent) informed consent; confidentiality; security measures | Ley 25.326 arts. 2, 5, 7, 8, 9, 10 | consent flow |
| C11 | Database must be **registered with the AAIP** (RNBD) | Ley 25.326 arts. 21, 24 | ops, not code |
| C12 | Hosting outside AR is **allowed but regulated** — US is *not* an adequate country, so you need model contractual clauses or express consent | Ley 25.326 art. 12; Disp. DNPDP 60-E/2016; Res. AAIP 34/2019 | infra + consent copy |
| C13 | **No general data-residency rule.** Nothing found requiring Argentine servers | — (absence of norm) | infra |
| C14 | `firma electrónica` is very likely sufficient; `firma digital` is the safe upgrade | Ley 25.506 arts. 3, 5, 7, 8; Decreto 1089/2012 art. 13 | **report (#12)** — see §5 |

---

## 2. Ley 25.326 — Protección de Datos Personales

Text used: [InfoLeg, texto actualizado](https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64790/texact.htm).
Reglamentación: [Decreto 1558/2001](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70368/norma.htm).

### 2.1 Health data is sensitive

**Art. 2** defines *datos sensibles* as data revealing, among others, "información referente a la
salud o a la vida sexual". **Art. 7.3** in principle *prohibits* forming files that store sensitive
data — but **art. 8** is the carve-out that makes a lab lawful:

> **Art. 8** — "Los establecimientos sanitarios públicos o privados y los profesionales vinculados a
> las ciencias de la salud pueden recolectar y tratar los datos personales relativos a la salud
> física o mental de los pacientes que acudan a los mismos o que estén o hubieren estado bajo
> tratamiento de aquéllos, respetando los principios del secreto profesional."

So the legal basis for a lab holding results is art. 8, not merely consent. Consent is still needed
for anything beyond that (marketing, research, cession to third parties).

### 2.2 Consent

**Art. 5.1** — consent must be "libre, expreso e informado", *in writing or by another equivalent
means*. **Art. 6** lists what must be told to the patient before collection: purpose and recipients,
existence and identity/domicile of the controller, whether answering is mandatory, consequences of
refusal, and the existence of access/rectification/suppression rights. The AAIP requires this notice
be visibly displayed ([Res. AAIP 14/2018](https://www.argentina.gob.ar/aaip/datospersonales/responsables/obligaciones)).

Practical: an on-screen consent step with a stored timestamp + version of the text shown. Ley 25.506
art. 3 means a digitally-signed acceptance satisfies the "por escrito" requirement; a checkbox is
"otro medio que permita se le equipare" — **[LAWYER]** on whether a checkbox alone is enough for
*sensitive* data.

### 2.3 Cession (art. 11)

Handing results to anyone but the patient (obra social, derivating lab, treating physician) is a
*cesión* and needs prior consent, with the recipient identified. Exception 11.3.d covers public-health
/ epidemiological needs **only with dissociation**. The cessionary inherits the same obligations and
the cedent is **jointly liable** (art. 11.4) — relevant if you integrate with a third-party portal.

### 2.4 Security (art. 9) and confidentiality (art. 10)

Art. 9.1 requires technical and organizational measures to avoid "adulteración, pérdida, consulta o
tratamiento no autorizado" **and to detect deviations**. Art. 9.2 forbids registering personal data
in systems lacking technical integrity/security conditions. Art. 10 imposes professional secrecy on
everyone in the processing chain, surviving the end of the relationship.

The concrete measures are in
[Resolución AAIP 47/2018](https://servicios.infoleg.gob.ar/infolegInternet/anexos/310000-314999/312662/norma.htm),
which repealed Disp. DNPDP 11/2006 and 9/2008. **Important nuance:** 47/2018 is a set of
*recommendations*, not mandatory measures — you may substitute more effective ones. Annex I (electronic
media) covers access control, **modification control**, backup/recovery, vulnerability management,
destruction, incident handling, and the development environment. Treat it as the de-facto checklist an
auditor will use.

### 2.5 Access and rectification — and why you cannot hard-delete

- **Art. 14.2** — 10 calendar days to answer an access request; free at ≥ 6-month intervals.
- **Art. 15** — the answer must be complete, plain-language, decoded, and may be delivered
  electronically at the holder's option.
- **Art. 16.2** — rectify / update / suppress within **5 business days** of the claim *or of noticing
  the error yourself*.
- **Art. 16.5** — suppression **does not proceed** where a legal duty to retain exists. Combined with
  Ley 26.529 art. 18 (10 years), a "delete my data" request over a clinical result is answered by
  blocking/restricting, not erasing.
- **Art. 16.6** — while an error is under verification, the controller must **block the record or flag
  it as under review** when serving it. That is a first-class state in the domain model, not a UI hint.

### 2.6 Registration with the AAIP

**Art. 21** requires every public database, and every private one *"destinado a proporcionar informes"*,
to be registered in the Registro Nacional de Bases de Datos Personales; **art. 24** repeats it for
private controllers. **Art. 31** backs it with warning, suspension, fines, closure, or cancellation of
the database. The AAIP
[obligations page](https://www.argentina.gob.ar/aaip/datospersonales/responsables/obligaciones)
states the duty plainly and exempts only strictly personal-use files. Registration is done through
TAD, is free, and does not expire, but must be amended when the declared facts change
([trámite](https://www.argentina.gob.ar/servicio/inscribir-un-responsable-de-bases-de-datos-personales-privadas)).

Art. 21.2 forces you to declare, among other things, **"h) Tiempo de conservación de los datos"** and
**"g) los medios utilizados para garantizar la seguridad… detallando la categoría de personas con
acceso"**. Your retention policy and your role model become a public filing — worth designing them
once, deliberately.

**[LAWYER]** — whether a lab's own patient database counts as *"destinada a proporcionar informes"* is
the classic grey area of art. 21. The lab literally issues informes to patients and obras sociales, so
the conservative reading (register it) is also the cheap one. The AAIP's own framing ("los archivos y
bases de datos que permitan obtener información sobre las personas deben estar inscriptos") is broad.

### 2.7 Cross-border transfer — you can host abroad, with paperwork

**Art. 12.1** prohibits transfer to countries that do not provide adequate protection. The AAIP
[explicitly treats cloud hosting as an international transfer](https://www.argentina.gob.ar/aaip/datospersonales/transferencias-internacionales),
using an Argentine company on US cloud servers as its worked example.

Countries deemed **adequate** (Disp. DNPDP 60-E/2016 + [Res. AAIP 34/2019](https://www.boletinoficial.gob.ar/detalleAviso/primera/202373/20190226)):
EU + EEA member states, United Kingdom, Switzerland, Guernsey, Jersey, Isle of Man, Faroe Islands,
Canada (private sector only), Andorra, New Zealand, **Uruguay**, Israel (automated processing only).

**The United States is not on that list.** Neither is Brazil. Routes to a non-adequate country:

1. **Model contractual clauses** — [Disposición 60-E/2016](https://servicios.infoleg.gob.ar/infolegInternet/anexos/265000-269999/267922/norma.htm),
   Annex I for cessions, Annex II for service provision (which is what a hosting provider is). Governed
   by Argentine law. Deviating from the model means asking the AAIP for approval within 30 days of the
   transfer. Res. AAIP 198/2023 additionally adopted the Ibero-American (RIPD) model clauses.
2. **Binding corporate rules** — Res. AAIP 159/2018.
3. **Express consent of the data subject** for that transfer — the AAIP transfers page names this
   route directly.
4. Art. 12.2.b's medical-data exception — **do not rely on it.** It covers exchanging medical data
   *"cuando así lo exija el tratamiento del afectado"* or for epidemiological research. Choosing a
   cheaper datacentre is not that.

**Practical:** hosting in `sa-east-1` (Brazil) buys nothing legally. If you want zero transfer
paperwork, host in the **EU or Uruguay**. If you host in the US, you need the DPA to incorporate the
Disp. 60-E/2016 Annex II clauses (or the RIPD ones) — the big providers will sign SCC-style addenda,
but they are *EU* SCCs by default, which is not the same instrument. **[LAWYER]** on whether a
provider's standard EU-SCC DPA satisfies art. 12 / Disp. 60-E, or whether an Argentine-law addendum is
required.

### 2.8 Is Ley 25.326 still the law in 2026? — Yes

No successor has been sanctioned. As of 2026-08-31, Ley 25.326 (as amended by Ley 26.343 for credit
data) remains in force, with Decreto 1558/2001 as its reglamentación.

Pending, none sanctioned:

- The **AAIP/Executive anteproyecto** (Mensaje 87/2023 to the Chamber of Deputies) **lost
  parliamentary status at the end of 2024** ([AAIP project page](https://www.argentina.gob.ar/aaip/datospersonales/proyecto-ley-datos-personales)).
- **Expte. 1751-D-2026** (Dip. Yeza), *"Marco regulatorio para la protección de los datos personales y
  la privacidad de las personas humanas. Derogación de la Ley 25326"*, presented **22 Apr 2026**,
  referred to Asuntos Constitucionales / Justicia / Presupuesto y Hacienda — still in committee
  ([HCDN](https://www.hcdn.gob.ar/diputados/myeza/proyecto.html?exp=1751-D-2026)). 72 articles, 13
  titles, GDPR/LGPD-inspired.
- Further bills from Dip. Carro and Sen. Doñate.

Argentina's EU adequacy status was **revalidated by the European Commission in January 2024**, so
inbound EU→AR flows stay free. Design to 25.326, but the pending bills all move toward GDPR shape
(controller/processor split, breach notification, DPO, risk tiering) — so a build that already keeps
an audit log, a records-of-processing register, and a consent version history will not need rework.

---

## 3. Ley 26.529 — Derechos del Paciente / Historia Clínica

Text used: [InfoLeg, texto actualizado](https://servicios.infoleg.gob.ar/infolegInternet/anexos/160000-164999/160432/texact.htm)
(as amended by Ley 26.742 and Ley 26.812). Reglamentación:
[Decreto 1089/2012](https://servicios.infoleg.gob.ar/infolegInternet/anexos/195000-199999/199296/norma.htm).

### 3.1 Yes, a lab result is part of the historia clínica

**Art. 12** defines the HC as "el documento obligatorio **cronológico, foliado y completo** en el que
conste toda actuación realizada al paciente por profesionales y auxiliares de la salud."

**Art. 16 (Integridad)** settles it:

> "Forman parte de la historia clínica, los consentimientos informados, las hojas de indicaciones
> médicas, las planillas de enfermería, los protocolos quirúrgicos, las prescripciones dietarias,
> **los estudios y prácticas realizadas, rechazadas o abandonadas**, debiéndose acompañar en cada caso,
> breve sumario del acto de agregación y desglose autorizado **con constancia de fecha, firma y sello
> del profesional actuante**."

Two things fall out: (a) **rejected and abandoned studies are in scope too** — a cancelled or rejected
sample is a record you must keep, not a row you delete; (b) every add/remove carries a dated, signed
summary of *why* — i.e. an audit event with an actor and a reason.

**Art. 15** enumerates required entries: start date; patient and family identifying data; **identifying
data of the intervening professional and their specialty**; clear and precise records of the acts
performed; genetic/physiological/pathological history; and (inc. g) every medical act — including
"prácticas, estudios principales y complementarios afines con el diagnóstico".

Decreto 1089/2012 art. 15 adds mandatory identity fields: **name and surname, DNI/pasaporte/cédula,
sex, age, phone, address**, plus **date and hour of every professional action, recorded immediately**.

**Art. 17 (Unicidad)** — one HC per patient per establishment, keyed by a **"clave uniforme"** which
must be communicated to the patient. Decreto 1089/2012 art. 17 lets that key be the DNI. So: one
patient aggregate, one stable public identifier, and the patient is entitled to know it.

### 3.2 Retention: 10 years minimum, from the *last* entry

**Art. 18** — establishments and professionals are *depositarios* of the HC and must prevent
unauthorised access. The retention duty "debe regir durante el plazo mínimo de **DIEZ (10) años** de
prescripción liberatoria de la responsabilidad contractual. Dicho plazo se computa **desde la última
actuación registrada** en la historia clínica."

Note the clock: it resets on every new entry, per patient. It is not 10 years from the result date.

Decreto 1089/2012 art. 18 says what happens after: hand the HC to the patient, agree to keep holding
it, or digitise/microfilm it. If the patient shows no interest, it may be destroyed — but you must
notify the patient **at least 6 months before** the deadline by a reliable means at their last declared
address. Practically, for software: never auto-purge; expiry is a reviewable state with a notification
obligation attached.

### 3.3 Patient's right to a copy: 48 hours, authenticated

**Art. 14** — "El paciente es el titular de la historia clínica. A su simple requerimiento debe
suministrársele copia de la misma, **autenticada por autoridad competente de la institución
asistencial**. La entrega se realizará dentro de las **cuarenta y ocho (48) horas**."

Decreto 1089/2012 art. 14 fills it in: authenticated **by the director of the establishment or their
designee**; there must be a request form recording the requester's identifying data, the motive and the
urgency; immediate delivery if the patient is mid-treatment or in an urgent/grave situation; with a
justified impossibility you may hand over an *epicrisis / resumen* and take an extension of **no more
than 10 calendar days** (aligning with 25.326 art. 14.2). Free at 6-month intervals; beyond 3 requests
you may charge for further copies.

**Art. 19** lists who else may request it (legal representative; spouse/cohabitant and forced heirs with
the patient's authorisation; treating professionals with express authorisation) and requires the
depositary to keep a **backup copy with the same formalities and guarantees as the original**.
**Art. 20** gives a direct *habeas data* action on refusal, delay, or silence.

### 3.4 Immutability — the answer to "can an approved result be edited?"

**No, not in place. A correction is a new, attributed, dated entry, and the original stays visible.**

**Art. 13 (Historia clínica informatizada)** is the governing text:

> "El contenido de la historia clínica puede confeccionarse en soporte magnético siempre que se
> arbitren todos los medios que aseguren la preservación de su **integridad, autenticidad,
> inalterabilidad, perdurabilidad y recuperabilidad** de los datos contenidos en la misma en tiempo y
> forma. A tal fin, debe adoptarse el uso de **accesos restringidos con claves de identificación,
> medios no reescribibles de almacenamiento, control de modificación de campos** o cualquier otra
> técnica idónea para asegurar su integridad."

Note that the law offers three example techniques and then says "or any other suitable technique" —
so an append-only event log with cryptographic chaining satisfies "medios no reescribibles" just as
WORM media would. You do **not** need write-once hardware.

**Decreto 1089/2012 art. 15** gives the paper rule that the digital model has to reproduce:

> "…la Historia Clínica **no deberá tener tachaduras, ni se podrá escribir sobre lo ya escrito. No se
> podrá borrar y escribir sobre lo quitado.** Se debe evitar dejar espacios en blanco y **ante una
> equivocación deberá escribirse "ERROR" y hacer la aclaración pertinente en el espacio subsiguiente.**
> No se deberá incluir texto interlineado."

Translated to a data model: an erroneous result is **superseded**, not overwritten. The wrong value
remains, marked as an error, and the correction is a subsequent entry carrying its own timestamp and
author.

**Ley 27.706 art. 4** states the same rule natively for electronic records:

> "La información suministrada **no puede ser alterada, sin que quede registrada la modificación
> pertinente, aun en el caso de que tuviera por objeto subsanar un error**…"

**Ley 27.706 art. 6** requires registration/update/consultation "en estrictas condiciones de seguridad,
integridad, autenticidad, confiabilidad, exactitud, inteligibilidad, conservación, disponibilidad,
acceso y **trazabilidad**", mechanisms for **authenticating** every person who touches the system
(inc. c), auditability and inspectability (inc. f), and it makes the content *documentación auténtica*
with full probative value **"siempre que se encuentre autenticada"** (inc. g). **Art. 7.a** names three
access levels: read; read+update; read+update+modify — a ready-made permission ladder.

Reinforcing from the lab side, **MERCOSUR/GMC Res. 30/20 §4.7.7**: "El laboratorio debe tener
implementado un **procedimiento que impida la alteración de los informes**", and **§4.7.8**: it must
guarantee recovery and availability of its records "de modo a permitir la **trazabilidad de los
resultados**".

**Conclusion for the domain model:** results are **immutable once approved/issued**. The only lawful
correction path is an **amendment / new version** that (a) preserves the prior version verbatim,
(b) records who amended it, when, and why, (c) is itself signed by a qualified professional, and (d) is
visible to anyone reading the record. This is a hard legal requirement, not a nice-to-have — see
[§8](#8-what-this-means-for-6-and-12).

---

## 4. Ley 25.506 — Firma Digital

Text used: [InfoLeg, texto actualizado](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70749/texact.htm)
(arts. 4 and 18 repealed by Ley 27.446).

Two distinct instruments:

- **Firma digital (art. 2)** — a mathematical procedure using information under the signer's exclusive
  control, verifiable by third parties, which simultaneously identifies the signer and **detects any
  post-signature alteration**. Valid only if made during the validity period of a certificate issued or
  recognised by a **certificador licenciado** (art. 9).
- **Firma electrónica (art. 5)** — any set of electronic data used by the signer as their means of
  identification that lacks one of the legal requirements to be a firma digital. Includes scanned
  signatures, a signed-in user clicking "approve", an OTP.

What each buys you:

| | firma digital | firma electrónica |
|---|---|---|
| Satisfies a legal "must be signed" requirement | **Yes** (art. 3) | Contested — **[LAWYER]** |
| Authorship | **Presumed** (art. 7) | Must be proved by whoever invokes it (art. 5) |
| Integrity since signing | **Presumed** (art. 8) | Must be proved |
| Counts as an "original" | **Yes** (art. 11) | No |
| Satisfies a retention duty | **Yes** (art. 12) | Not by itself |

The decisive asymmetry is **art. 5's reversed burden of proof**: "En caso de ser desconocida la firma
electrónica corresponde a quien la invoca acreditar su validez." If a patient or a court challenges a
report, with a firma digital you point at the certificate; with a firma electrónica *the lab* must prove
the report is genuine — which is exactly what a tamper-evident audit log and a hash chain are for.

**Does a lab report legally require a firma digital? — Genuinely unsettled. [LAWYER]**

The arguments each way, so the decision can be made on the record:

- **Toward firma digital.** **Decreto 1089/2012 art. 13** says the HC informatizada "deberá adaptarse
  a lo prescripto por la **Ley Nº 25.506**, sus complementarias y modificatorias." Ley 17.132 art. 32
  requires the DT to *firmar* the informes; art. 3 of 25.506 says a firma digital satisfies that, and
  is silent on whether a firma electrónica does. Ley 27.706 art. 6.g grants full probative value
  "siempre que se encuentre **autenticada**".
- **Toward firma electrónica being enough.** Ley 25.506's own art. 1 "reconoce el empleo de la firma
  electrónica **y** de la firma digital y su eficacia jurídica", so a firma electrónica has legal
  effect, only weaker. Decreto 1089 art. 13 says "adaptarse a lo prescripto por la Ley 25.506" — the
  law it points to regulates *both* instruments, so this reads more like "comply with the digital
  signature regime" than "you must hold a licensed certificate". The strongest analogy is
  **[Ley 27.553](https://servicios.infoleg.gob.ar/infolegInternet/anexos/340000-344999/340919/texact.htm)**
  on electronic prescriptions, where the legislature, facing the same question for a comparable
  clinical document, **allowed both**: recipes may be "fechadas y firmadas en forma **manuscrita,
  electrónica o digital**", with the extra 25.506 machinery required only "en caso de utilizar la firma
  digital". If a prescription for a controlled substance can travel on a firma electrónica, a lab report
  almost certainly can. Note also that Ley 26.529 art. 13 spells out its integrity requirements in
  technology-neutral terms and never mentions certificates.
- **Provincial overlay.** Habilitación and *ejercicio profesional* are provincial powers. A province or
  a colegio de bioquímicos may impose firma digital locally. Check the specific jurisdiction before
  committing.

**Engineering recommendation.** Build the report pipeline so the signature is a **pluggable step over a
canonical, frozen document**:

1. Freeze an immutable, byte-stable representation of the approved result and hash it.
2. Sign that hash. v1 = firma electrónica (authenticated approver + server-side key + timestamp),
   recorded in the audit log with actor, matrícula, and time.
3. Embed a verifiable artefact in the PDF (QR/URL to a verification endpoint + the hash) so a third
   party can check the copy against the record — this is what turns an art. 5 firma electrónica from
   an assertion into evidence, and it is what closes the burden-of-proof gap in practice.
4. Keep the interface such that swapping in a PAdES signature from a **certificador licenciado**
   (see the [licensed certifier list](https://www.argentina.gob.ar/jefatura/innovacion-publica/firmadigital))
   is a change of implementation, not of architecture.

That way the legal question does not block the build, and the answer, whenever it arrives, costs one
adapter.

---

## 5. Who may sign, and what must be printed

### 5.1 Who may perform and sign

**[Ley 17.132](https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/19429/texact.htm)
art. 32** (Título IV, De los Análisis, Capítulo I):

> "Los análisis químicos, físicos, biológicos o bacteriológicos aplicados a la medicina sólo podrán ser
> realizados por los siguientes profesionales: a) médicos y doctores en medicina; b) **bioquímicos** y
> doctores en bioquímica; c) diplomados universitarios con títulos similares que acrediten… haber
> cursado en su carrera todas las disciplinas inherentes a la ejecución de análisis aplicados a la
> medicina."

and, in the same article:

> "Los **Directores Técnicos** de laboratorios de análisis clínicos están obligados a la atención
> personal y efectiva del mismo, debiendo vigilar las distintas fases de los análisis efectuados y
> **firmar los informes y/o protocolos de los análisis que se entregan a los examinados**."

Also art. 32: professionals must be enrolled in a special registry; no one may be titular director of
more than two labs. **Art. 94–95** restrict *auxiliares de laboratorio* to secondary tasks under the
direct indication and control of a qualified professional — so "who ran the assay" and "who may release
it" are different roles in the model.

**Scope caveat:** Ley 17.132 is national law applicable in CABA and federal jurisdiction. Each province
has its own *ejercicio profesional* law and its own colegio de bioquímicos issuing the matrícula
(e.g. [Ley 8271 de la Provincia de Buenos Aires](https://www.argentina.gob.ar/normativa/provincial/ley-8271-123456789-0abc-defg-172-8000bvorpyel/actualizacion),
colegiación obligatoria; Córdoba's equivalent is **Ley 5197**). The DT-signs rule is uniform in substance; the matrícula's issuer, format,
and prefix are **not**. Store matrícula as a `{jurisdiction, type, number}` triple, never a bare
integer, and do not assume a national check-digit scheme.

### 5.2 Must it be printed on the report? — Yes

The Ministry of Salud's own habilitación requirements for a clinical analysis laboratory
([trámite](https://www.argentina.gob.ar/servicio/habilitacion-de-un-laboratorio-de-analisis-clinicos))
list among the documents to submit:

> "**Protocolo de resultados de análisis con membrete del laboratorio impreso, con el nombre, número de
> matrícula, teléfono, dirección y firma del Director Técnico.**"

That is a direct specification of the report header/footer: **lab letterhead, DT name, DT matrícula
number, phone, address, DT signature.** The same page requires the floor plan signed by the DT and the
board minute designating the DT notarised.

The trámite also cites **Res. MS 1938/2025** (making the procedure free) and confirms the national
Ministry handles labs domiciled in CABA — provinces habilitate their own, generally on equivalent terms.

---

## 6. Mandatory report content

**[MERCOSUR/GMC Res. N° 30/20](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-30-2021-350268/texto)**,
*"Requisitos de Buenas Prácticas para la organización y funcionamiento de laboratorios de análisis
clínicos"*, incorporated into Argentine law by
**[Resolución MS 1514/2021](https://servicios.infoleg.gob.ar/infolegInternet/anexos/350000-354999/350267/norma.htm)**
(B.O. 27/05/2021). Annex text as published by
[IMPO (Uruguay, Decreto 345/2021)](https://www.impo.com.uy/bases/decretos-internacional/345-2021/1) —
Ouro Preto art. 7 requires the *integral text* to be incorporated by every member state, so the annex is
identical across them. Art. 2 makes it applicable to **all** clinical analysis laboratories.

**§4.7.3 — "Los informes de resultados deben ser legibles y contener":**

- La identificación del paciente
- La identificación del análisis efectuado
- La identificación del laboratorio que efectuó el análisis
- El tipo de muestra primaria sobre la que se efectuó el análisis
- Los intervalos de referencia biológica, cuando sea posible
- Un espacio para el agregado de otras observaciones
- La calidad inadecuada de la muestra primaria que pudiera haber afectado el resultado obtenido
- Fecha de realización del estudio
- **La identificación del profesional que avala la emisión del informe**

Two of these are easy to under-build: the **sample-quality caveat** is a required field on the report,
not a free-text note someone might add; and the **reference interval** is per-analyte *and* per-method,
so it belongs to the analytical run, not to a global lookup table.

Other clauses that touch the software:

- **§4.1.9** — the lab's management must design procedures ensuring the **protection and confidentiality
  of information**.
- **§4.1.10** — control all documents/information and keep an archive, conserved per local, regional and
  national norms (i.e. the 10-year rule from Ley 26.529 art. 18).
- **§4.1.12** — keep a **register of every sample derived to another lab and the results obtained**.
  Derivations are first-class in the model.
- **§4.7.1–4.7.2** — a documented procedure for **review and release** of results (an explicit approval
  step, distinct from entry), and one to guarantee no transcription errors, including for results coming
  from derivation labs.
- **§4.7.5–4.7.6** — defined **"alerta"/"crítico"** intervals requiring immediate decision, plus a
  procedure for communicating them to the treating professional. That is a flaggable threshold per
  analyte and a recorded notification event.
- **§4.7.4** — a rapid-release procedure for urgent situations.
- **§4.6.4–4.6.7** — internal QC, calibration for traceability, external quality programmes, and
  up-to-date records of all of them.

**[CAVEAT]** Res. MS 1514/2021 art. 2 provides that, per Ouro Preto, the norm enters into force
**simultaneously in all member states 30 days after** the MERCOSUR Secretariat notifies that all have
incorporated it, to be announced by a notice in the Boletín Oficial. I did **not** locate that notice.
So the annex may be formally not-yet-in-force as a MERCOSUR norm. This does not change the engineering
answer — the field set is also the professional standard, overlaps with the habilitación protocol
requirements, and Resolución MS 594/2023 ("Documento Marco: Recomendaciones Paso a Paso para el
Desarrollo de Buenas Prácticas en el Laboratorio de Análisis Clínicos",
[B.O. 30/03/2023](https://www.boletinoficial.gob.ar/detalleAviso/primera/283656/20230330)) points the
same way — but do not cite 1514/2021 as binding without checking. **[LAWYER]**

Older, still-referenced quality material: Res. MS 739/2000, *Revisión de la Guía de Evaluación de los
Laboratorios de Análisis Clínicos*, within the Programa Nacional de Garantía de Calidad de la Atención
Médica ([InfoLeg](https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64308/norma.htm)).

---

## 7. Data residency — no Argentine-hosting requirement found

I found **no norm requiring health data or historias clínicas to be stored on servers physically in
Argentina.** Checked: Ley 25.326 and Decreto 1558/2001; Ley 26.529 and Decreto 1089/2012; Ley 27.706 and
its reglamentación Decreto 393/2023
([B.O. 31/07/2023](https://www.boletinoficial.gob.ar/detalleAviso/primera/291214/20230731)); the AAIP
transfers guidance. The regime is **conditional transfer, not localisation** — art. 12 of 25.326 plus
the instruments in §2.7.

Two honest limits on that negative finding:

1. **Provincial and CABA norms were not exhaustively swept.** Some jurisdictions' health-IT or public-
   procurement rules impose localisation on *public* establishments. A private lab is unlikely to be
   caught, but if the product targets a specific province or sells to the public sector, check that
   province. **[LAWYER]**
2. **Decreto 393/2023's substantive annex** (IF-2023-85768086-APN-SSISSYAP#MS) is published separately
   in the BORA web edition and I could not retrieve its full text. Ley 27.706 itself contains no
   residency clause, and the reglamentación would be an odd place to introduce one, but the annex is an
   unread source. Flagging it rather than asserting from its absence.

Proving a negative from statute is inherently weaker than citing a norm. Treat "no residency
requirement" as well-supported but not certified.

---

## 8. What this means for #6 and #12

### Domain model ([#6](https://github.com/FrancoLedArg/lab/issues/6))

1. **Results are immutable after approval. Amendment, never in-place edit.** Decreto 1089/2012 art. 15
   ("no se podrá escribir sobre lo ya escrito… ante una equivocación deberá escribirse ERROR") and Ley
   27.706 art. 4 ("no puede ser alterada, sin que quede registrada la modificación pertinente, aun… para
   subsanar un error") make versioning a legal requirement. Model it as a chain of versions on a stable
   result identity: `v1 (issued) → v2 (amends v1, reason, author, timestamp)`. The superseded version
   stays readable and is marked as corrected. Ley 26.529 art. 12's "cronológico, foliado" reinforces an
   append-only, ordered log.
2. **Two distinct states before immutability bites:** *preliminary/entered* (mutable, not yet released)
   and *approved/released* (frozen). MERCOSUR §4.7.1's review-and-release procedure is the transition.
   Editing a draft is fine; editing a released result is not.
3. **A "blocked / under review" state is required**, not optional — Ley 25.326 art. 16.6 obliges you to
   block or flag a record while an alleged error is being verified, and art. 16.2 gives you 5 business
   days.
4. **Every mutation carries actor, timestamp, and reason.** Ley 26.529 art. 16 requires a dated, signed
   summary for each agregación/desglose; Decreto 1089 art. 15 requires date **and hour**, recorded
   immediately; Ley 27.706 art. 6.c requires authentication of everyone who intervenes.
5. **No hard deletes.** 10-year retention from the *last entry* (Ley 26.529 art. 18) beats the right to
   erasure (Ley 25.326 art. 16.5). "Delete" is block/restrict. Rejected and abandoned studies are
   retained too (art. 16).
6. **One patient aggregate with a stable "clave uniforme"** (Ley 26.529 art. 17), and mandatory identity
   fields: name, DNI/pasaporte/cédula, sex, age, phone, address (Decreto 1089 art. 15).
7. **Model roles, not just users:** who collected the sample, who ran the assay (may be an auxiliar,
   Ley 17.132 art. 94–95), who approved/released, who is DT. Ley 27.706 art. 7.a's three access levels
   (read / read+update / read+update+modify) is a reasonable starting ladder.
8. **Derivations are entities** — MERCOSUR §4.1.12 requires a register of samples sent out and results
   received, and §4.7.2 requires transcription-error control over them.
9. **Reference intervals belong to the analytical run**, not to a global table — they are per-analyte and
   per-method, and the report must show the ones actually applied.
10. **Critical/alert thresholds and the notification event** are part of the model (MERCOSUR §4.7.5–4.7.6),
    because "we told the treating physician at 14:32" must be provable.

### Report PDF ([#12](https://github.com/FrancoLedArg/lab/issues/12))

1. **Required fields** — the union of MERCOSUR §4.7.3 and the habilitación protocol spec:
   patient identification; analysis identification; laboratory identification **with printed letterhead**;
   primary sample type; biological reference intervals where possible; a space for observations; any
   inadequate sample quality that could have affected the result; date the study was performed;
   identification of the professional endorsing the report; and **DT name + matrícula number + phone +
   address + signature**.
2. **The DT signs the reports delivered to patients** — Ley 17.132 art. 32. If a different professional
   validated the run, both identities appear (MERCOSUR §4.7.3 wants "el profesional que avala la emisión").
3. **Signature: build for firma electrónica, keep firma digital one adapter away.** See §4. Do not block
   v1 on obtaining certificates from a certificador licenciado, but do freeze-and-hash the document
   before signing and embed a verification QR/hash — that is what makes an art. 5 firma electrónica
   defensible, given its reversed burden of proof.
4. **Amended reports must be visibly amended.** Print the version, the fact that it supersedes an earlier
   report, the date, and the reason. Reissuing a corrected PDF that looks identical to the original is
   precisely what Decreto 1089 art. 15 forbids in paper form.
5. **The patient copy is an entitlement, not a feature:** on request, an **authenticated** copy within
   **48 hours** (Ley 26.529 art. 14), authenticated by the director or their designee, with a request
   record capturing requester, motive and urgency (Decreto 1089 art. 14). Delivery may be electronic at
   the patient's option (Ley 25.326 art. 15.3). Free at 6-month intervals; you may charge past 3 requests.
6. **Plain language** — Ley 25.326 art. 15.1 requires information "exenta de codificaciones", explained
   in language accessible to average knowledge. Raw LOINC codes and bare abbreviations on a
   patient-facing report are a compliance smell; MERCOSUR §4.7.3 opens with "deben ser **legibles**".
7. **Matrícula is jurisdictional** — `{jurisdiction, type, number}`, no national format assumption.

---

## 9. What genuinely needs a lawyer

Do not let the build depend on my reading of these:

1. **Does a lab report require a `firma digital`, or does a `firma electrónica` suffice?** The single
   highest-value question, and genuinely unsettled — Decreto 1089/2012 art. 13 points at Ley 25.506
   without specifying which instrument, and Ley 27.553 chose "both" for a comparable document. §4's
   pluggable design is the hedge, not the answer.
2. **Is a lab's patient database "destinada a proporcionar informes"** for Ley 25.326 art. 21 registration
   purposes? Conservative answer (register) is also the cheap one, but confirm.
3. **Is a hyperscaler's standard EU-SCC DPA sufficient under art. 12 / Disp. 60-E/2016**, or is an
   Argentine-law addendum with the Annex II clauses required? Affects the hosting decision directly.
4. **Is an on-screen consent checkbox "por escrito, o por otro medio que permita se le equipare"** for
   *sensitive* data under art. 5.1?
5. **Provincial overlay** — matrícula rules, colegio requirements, habilitación conditions, and any
   local firma-digital or data-localisation mandate in the target jurisdiction(s). Nothing here is
   province-specific.
6. **Whether MERCOSUR/GMC Res. 30/20 is formally in force in Argentina** (the Res. MS 1514/2021 art. 2
   simultaneity notice). Does not change what to build; does change what you may cite.
7. **Decreto 393/2023's annex** (IF-2023-85768086-APN-SSISSYAP#MS) — unread; verify it adds no
   residency, signature, or interoperability obligation.
8. **When Ley 27.706's Sistema Único obligations actually bite a private lab.** Art. 3 covers private
   establishments, but rollout is progressive and the interoperability framework is still being defined
   by the Ministry of Salud as authority of application.

---

## 10. Sources

Primary:

- [Ley 25.326 — Protección de los Datos Personales (texto actualizado)](https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64790/texact.htm)
- [Decreto 1558/2001 — reglamentación de la Ley 25.326](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70368/norma.htm)
- [Ley 26.529 — Derechos del Paciente / Historia Clínica (texto actualizado)](https://servicios.infoleg.gob.ar/infolegInternet/anexos/160000-164999/160432/texact.htm)
- [Decreto 1089/2012 — reglamentación de la Ley 26.529](https://servicios.infoleg.gob.ar/infolegInternet/anexos/195000-199999/199296/norma.htm)
- [Ley 25.506 — Firma Digital (texto actualizado)](https://servicios.infoleg.gob.ar/infolegInternet/anexos/70000-74999/70749/texact.htm)
- [Ley 27.706 — Programa Federal Único de Informatización y Digitalización de Historias Clínicas](https://servicios.infoleg.gob.ar/infolegInternet/anexos/380000-384999/380710/norma.htm)
- [Decreto 393/2023 — reglamentación de la Ley 27.706](https://www.boletinoficial.gob.ar/detalleAviso/primera/291214/20230731)
- [Ley 17.132 — Ejercicio de la medicina, odontología y actividades de colaboración (texto actualizado)](https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/19429/texact.htm)
- [Ley 27.553 — Recetas electrónicas o digitales (texto actualizado)](https://servicios.infoleg.gob.ar/infolegInternet/anexos/340000-344999/340919/texact.htm)
- [Resolución MS 1514/2021 — incorpora MERCOSUR/GMC Res. 30/20](https://servicios.infoleg.gob.ar/infolegInternet/anexos/350000-354999/350267/norma.htm)
- [MERCOSUR/GMC Res. 30/20 — resolutive text (Argentina.gob.ar)](https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-30-2021-350268/texto)
- [MERCOSUR/GMC Res. 30/20 — full annex, incl. §4.7.3 (IMPO, Uruguay Decreto 345/2021)](https://www.impo.com.uy/bases/decretos-internacional/345-2021/1)
- [Resolución MS 594/2023 — Documento Marco de Buenas Prácticas en el Laboratorio de Análisis Clínicos](https://www.boletinoficial.gob.ar/detalleAviso/primera/283656/20230330)
- [Resolución MS 739/2000 — Guía de Evaluación de los Laboratorios de Análisis Clínicos](https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64308/norma.htm)
- [Resolución AAIP 47/2018 — medidas de seguridad recomendadas](https://servicios.infoleg.gob.ar/infolegInternet/anexos/310000-314999/312662/norma.htm)
- [Disposición DNPDP 60-E/2016 — cláusulas contractuales modelo para transferencia internacional](https://servicios.infoleg.gob.ar/infolegInternet/anexos/265000-269999/267922/norma.htm)
- [Resolución AAIP 34/2019 — actualiza la lista de países adecuados](https://www.boletinoficial.gob.ar/detalleAviso/primera/202373/20190226)
- [Expte. 1751-D-2026 — HCDN, derogación de la Ley 25.326](https://www.hcdn.gob.ar/diputados/myeza/proyecto.html?exp=1751-D-2026)

Official guidance (first-party, non-normative):

- [AAIP — Obligaciones de los responsables de bases de datos personales](https://www.argentina.gob.ar/aaip/datospersonales/responsables/obligaciones)
- [AAIP — Transferencias internacionales](https://www.argentina.gob.ar/aaip/datospersonales/transferencias-internacionales)
- [AAIP — Proyecto de Ley de Protección de Datos Personales (status)](https://www.argentina.gob.ar/aaip/datospersonales/proyecto-ley-datos-personales)
- [AAIP — Inscribir un responsable de bases de datos personales privadas](https://www.argentina.gob.ar/servicio/inscribir-un-responsable-de-bases-de-datos-personales-privadas)
- [MS — Habilitación de un laboratorio de análisis clínicos (protocol content requirements)](https://www.argentina.gob.ar/servicio/habilitacion-de-un-laboratorio-de-analisis-clinicos)
