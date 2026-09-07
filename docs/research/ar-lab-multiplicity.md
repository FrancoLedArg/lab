# Can one business run more than one laboratory in Argentina?

Research for issue [#11](https://github.com/FrancoLedArg/lab/issues/11). Last verified **2026-09-07**.

> **Not legal advice.** Requirements-gathering note for a product spec, written from primary sources
> (InfoLeg, Argentina.gob.ar, provincial normativa sites, colegios de bioquímicos, CNDC). Items that
> genuinely need a lawyer are collected in [§10](#10-what-genuinely-needs-a-lawyer) and flagged inline
> as **[LAWYER]**. Nothing below was inferred from a secondary write-up without reading the norm.
>
> **Correction to a sibling file.** [`ar-health-data-law.md`](./ar-health-data-law.md) §5.1 cites
> "Ley 8271 de Córdoba". Ley 8271 is **Provincia de Buenos Aires** (Colegio de Bioquímicos de la PBA,
> as amended by Leyes 11.925 and 13.560) — the argentina.gob.ar page for it says so explicitly
> ([normas.gba.gob.ar](https://normas.gba.gob.ar/documentos/Bj6wrUyB.html)). Córdoba's equivalent is
> **Ley 5197**. That matters here, because PBA's Ley 8271 art. 61 is one of the two hardest norms in
> this note.

---

## 1. TL;DR — the constraints that shape the tenancy model

| # | Constraint | Source | Hits |
|---|---|---|---|
| M1 | A professional may be **director *titular* of no more than two** laboratorios de análisis clínicos. The word is "titular" — the cap does not obviously reach adjunct/sub-director roles | Ley 17.132 art. 32 | tenancy limits |
| M2 | The cap binds the **professional, not the business**. No national norm caps how many habilitated labs one owner may hold | Ley 17.132 arts. 32, 39 (absence) | tenancy |
| M3 | **Habilitación is per establishment and per address.** A change of domicilio ends it; denominación/razón social cannot change without prior authorisation | Ley 17.132 arts. 34, 37; Chubut Res. 249/13 Anexo I cap. I.5 | **tenant identity** |
| M4 | Nationally/CABA a **commercial company may own** a lab, including with non-professional shareholders, provided they have **no injerencia in the dirección técnica** | Ley 17.132 art. 39 incs. c, d; MS habilitación trámite | tenancy |
| M5 | **PBA: a lab must be the exclusive property of the professionals**, who are themselves the DTs. A generic SA/SRL cannot own one | Res. MS PBA 2519/15 art. 44; Ley 8271 art. 61.g | provincial gate |
| M6 | **PBA: "Se podrá tener en propiedad más de un (1) Laboratorio, pero no establecer sucursales del mismo."** | Res. MS PBA 2519/15 art. 45 | **← the answer** |
| M7 | PBA: no numeric cap on direcciones técnicas, but a *sole* DT of two or more labs **may not run them simultaneously**; associated professionals may, if a socio covers each site | Res. 2519/15 art. 45; Ley 8271 art. 61.c | rostering |
| M8 | **Córdoba: a bioquímico may be titular of at most two laboratorios**, or one laboratorio + one punto de atención | Estatuto COBICO arts. 93, 96 | tenancy |
| M9 | Córdoba: **exactly one Punto de Atención Bioquímica per habilitated lab**; it needs another bioquímico present, and it dies with the parent lab's habilitación | Reglamento Interno COBICO art. 18 | **branch cardinality** |
| M10 | **Santa Fe: each Director Técnico may direct up to two establecimientos.** Being titular of more is expressly allowed **provided each extra has its own DT** | Decreto 4050/16 art. 12.1.d | **← franchise answer** |
| M11 | Santa Fe: **Centro de Extracciones Bioquímicas** is a distinct habilitación category — pre/post-analytical only, **only in localities with no lab**, only for a bioquímico who already has a lab elsewhere | Decreto 4050/16 art. 12.2.2 | branch type |
| M12 | Santa Fe: the dirección técnica is **independent of the persona física o jurídica that owns the business** | Res. Colegio de Bioquímicos SF 03/2018 | **ownership ≠ direction** |
| M13 | Chubut: **sala de extracción** is a habilitable establishment type with **obligatory DT "sin presencia permanente en el lugar"** | Res. MS Chubut 249/13, Anexo I cap. V | branch type |
| M14 | **A draw-and-ship storefront is prohibited** in PBA outright, and in Córdoba except as a PAB | Ley 8271 art. 61.f; Estatuto COBICO art. 91; Reglamento COBICO arts. 16, 34 | **the hard limit** |
| M15 | The report identifies **the laboratory that performed the analysis** — not the one that drew the sample | MERCOSUR/GMC Res. 30/20 §4.7.3 | **report (#12)** |
| M16 | Córdoba forces onto the protocol the DT's name + matrícula + **address, phone, locality**, plus the colegio inspection resolution number **and** the ministerial habilitación number, each with expiry | Reglamento COBICO art. 38 | **report (#12)** |
| M17 | Derivation between habilitated labs is lawful, must be registered, and the performing professional's protocol must be conserved (5 years in Córdoba, per-norm elsewhere) | Res. 2519/15 art. 50; Reglamento COBICO art. 41; MERCOSUR §4.1.12 | derivation |
| M18 | Every site is separately registered in **REFES** with its own 14-digit federal code, tipología **ESSID** ("Incluye por ejemplo… Laboratorios de Análisis Clínicos") | SISA/REFES; Res. MS 298/2011 | tenancy |

**One-line answer:** a multi-site lab in Argentina is **several tenants under one owner**, not one tenant
with branches — with a narrow, province-gated exception for a draw-only annex. See [§9](#9-what-this-means-for-the-tenancy-model).

---

## 2. Ley 17.132 art. 32 — the number is **two**, and the word is **titular**

Text used: [InfoLeg, texto actualizado](https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/19429/texact.htm);
cross-checked against the [COFyBCF transcription](https://www.cofybcf.org.ar/legislacion_detalle.php?l=17)
and [Argentina.gob.ar's texto actualizado](https://www.argentina.gob.ar/normativa/nacional/ley-17132-19429/actualizacion).

The operative sentence, verbatim:

> "**En ningún caso los profesionales podrán ser directores titulares de más de dos laboratorios de
> análisis clínicos sean oficiales y/o privados.**"

So the existing research file's "no one may be titular director of more than two labs" is **correct on
the number and correct on the word**. Two things follow that the shorter paraphrase hides:

1. **The cap is on `titular` directorship, not on presence.** The article separately imposes the duty of
   "atención personal y efectiva" and of signing the informes:

   > "Los directores técnicos de laboratorio de análisis clínicos están obligados a la **atención
   > personal y efectiva** del mismo, debiendo vigilar las distintas fases de los análisis efectuados y
   > **firmar los informes y/o protocolos** de los análisis que se entregan a los examinados."

   Read together: the cap is on how many labs you may *hold the titular directorship of*, and the
   personal-attention duty is what actually limits you in practice. Whether a professional can be
   *titular* of two and *adjunto/sub-director* of others is not addressed by art. 32 at national level.
   Several provinces answer it explicitly and differently (§3). **[LAWYER]** for CABA/federal.

2. **It counts oficiales and privados together.** A bioquímico who is DT of a hospital lab has used one
   of their two slots.

Also in art. 32: only médicos/doctores en medicina, bioquímicos/doctores en bioquímica, and equivalent
university graduates may perform the analyses; they must be enrolled in a *registro especial*; and
médicos who are DT of a lab **may not simultaneously practise medicine** (save the art. 20 inc. 25 case).

**Scope.** Ley 17.132 is national law applying in CABA and federal jurisdiction. Its reglamentación,
[Decreto 6216/1967](https://www.argentina.gob.ar/normativa/nacional/decreto-6216-1967-140762/texto),
fleshes out art. 32 with the authorisation-and-plans procedure and restates that DTs may not delegate
their functions to unauthorised persons — but adds **no** rule on multiplicity.

**Two more national articles that matter for tenancy:**

> **Art. 34** — "Toda persona que quiera instalar un establecimiento para la profilaxis, recuperación,
> diagnóstico y/o tratamiento de las enfermedades humanas deberá solicitar el permiso previo a la
> Secretaría de Estado de Salud Pública."

> **Art. 37** — "Una vez acordada la habilitación… los establecimientos **no podrán introducir
> modificación alguna en su denominación y/o razón social, en las modalidades de las prestaciones ni
> reducir sus servicios sin autorización previa**…"

Art. 34 is per-establishment. Art. 37 makes the establishment's *name* a regulated attribute, not a
branding field. Both point the same way: the unit of regulation is a site, not a company.

---

## 3. Provincial variation — the cap is not uniform, and the *sucursal* is where it bites

Ejercicio profesional and habilitación are provincial powers. I checked PBA, Córdoba and Santa Fe as
asked, plus Chubut and Tucumán because they turned out to contain the clearest text on annexes.

### 3.1 Provincia de Buenos Aires — **more permissive on DT count, absolutely prohibitive on sucursales**

Two instruments stack.

**(a) [Ley 8271 art. 61](https://normas.gba.gob.ar/documentos/Bj6wrUyB.html)** (text per Ley 13.560),
Capítulo XII "Del funcionamiento de los laboratorios". Verbatim, the incisos that matter:

> **b)** "El titular del laboratorio deberá permanecer en él mientras se realicen actos bioquímicos,
> desde la obtención de las muestras hasta la finalización de los análisis. Realizará directa y
> personalmente los análisis o, en caso de laboratorios de alta complejidad o gran volumen de trabajo,
> supervisará todas las tareas necesarias y vinculadas que realicen sus profesionales adjuntos…"

> **c)** "**El titular único de dos o más laboratorios no podrá hacerlos funcionar simultáneamente
> durante el mismo día.** Cuando se trate de varios profesionales asociados titulares de dos o más
> laboratorios, podrán hacerlos funcionar simultáneamente, **siempre que en cada uno de ellos alguno de
> los socios asuma personalmente la responsabilidad** que se impone en el inciso precedente."

> **d)** "Sólo el Director Técnico del Laboratorio podrá suscribir certificados, protocolos o informes
> relativos a análisis que él mismo no haya realizado totalmente…"

> **f)** "En cada laboratorio habilitado deberá ejercerse efectivamente la profesión bioquímica. **Está
> prohibido el funcionamiento de un laboratorio con la finalidad de realizar la derivación de las
> muestras obtenidas a otro u otros laboratorios.** El Director Técnico deberá archivar el resultado de
> toda derivación que justificadamente realice."

> **g)** "Los laboratorios deberán ser de propiedad de un Bioquímico o de varios civilmente asociados, o
> de una clínica con internación, o de una sociedad comercial integrada **exclusivamente por un
> Bioquímico y sus familiares directos**; cónyuge, ascendientes o descendientes. En este último
> supuesto, uno de los socios, por lo menos, deberá ser el Director Técnico del Laboratorio…"

Inciso **f** is the single most consequential sentence in this whole note: in PBA, a site whose *purpose*
is to draw samples and ship them elsewhere **is not a lawful laboratory**.

**(b) [Resolución MS PBA 2519/15](https://normas.gba.gob.ar/documentos/xa9e2GU4.html)** (27 Apr 2015),
the normas complementarias to Decreto 3280/90, chapter "Laboratorio de Análisis Clínicos"
([full text, Colegio de Bioquímicos PBA](http://www.colebioqpba.org.ar/admin/contenido_dinamico/legislacion/890cc2_Resolucion2519-15.doc)).
Verbatim:

> **Art. 44** — "Todo Laboratorio de Análisis Clínicos que se establezca o enajene, deberá ser
> **propiedad exclusiva del o de los profesionales universitarios** que posean título habilitante para
> el ejercicio de los análisis clínicos, **quienes asumirán asimismo el carácter de Director Técnico o
> Directores Técnicos**."

> **Art. 45** — "…**Se podrá tener en propiedad más de un (1) Laboratorio, pero no establecer sucursales
> del mismo. Un profesional podrá tener más de dos (2) direcciones técnicas.** El Director Técnico único
> de dos (2) o más Laboratorios no podrá hacerlos funcionar simultáneamente. Cuando se tratare de
> profesionales asociados con más de un (1) laboratorio, podrán hacerlos funcionar simultáneamente,
> siempre que en cada uno de ellos, alguno de los socios pudiere asumir completamente la Dirección
> Técnica."

> **Art. 50** — "En caso de derivarse alguna muestra para análisis a otro Laboratorio habilitado, por no
> contar el propio con el instrumental adecuado a la complejidad de la práctica a realizar, deberá
> consignarse y conservarse el protocolo de análisis del profesional que efectivamente lo realizó."

Note that 2519/15 art. 45 **liberalised** the old Decreto 3280/90 position (which barred owning more than
one lab at all, subject to a "utilidad zonal" exception) while **keeping the sucursal prohibition intact**.
And it is *more permissive than Ley 17.132 art. 32* on DT count: "más de dos (2) direcciones técnicas" is
allowed in PBA. That is a genuine conflict of norms between a national law and a provincial resolution;
the provincial one governs habilitación in PBA. **[LAWYER]** on which controls for a bioquímico
matriculado in PBA who is DT of three PBA labs.

The PBA habilitación trámite itself
([gba.gob.ar](https://www.gba.gob.ar/saludprovincia/tr%C3%A1mites_y_habilitaciones/laboratorios_de_an%C3%A1lisis_cl%C3%ADnicos_y_bacteriol%C3%B3gicos))
cites Res. 2519/15 + Decreto 3280/90, requires the solicitud signed by **propietario and director
técnico**, a title or ≥2-year lease **for the specific immueble**, an approved municipal plano, and a
Colegio de Bioquímicos certificate. It offers **no** category other than a full laboratorio.

### 3.2 Córdoba — cap of **two**, and a named, singular annex

Córdoba's colegio is created by **Ley 5197** (1970), not Ley 8271. The consolidated
[Ley + Estatuto + Reglamento Interno published by COBICO](https://cobico.ar/wp-content/uploads/2024/10/Ley-Estatuto-y-Reglamento-Interno-1.pdf)
is the operative text. Verbatim:

> **Estatuto art. 91** — "En cada laboratorio deberá ejercerse efectivamente la profesión. **Está
> prohibido el funcionamiento de un laboratorio con la finalidad exclusiva de realizar la derivación de
> las muestras obtenidas a otro u otros laboratorios, salvo que se tratare de un Punto de Atención
> Bioquímica.**"

> **Estatuto art. 93** — "La Dirección Técnica de los laboratorios deberá ser ejercida por bioquímicos,
> siendo los responsables de toda la actividad llevada a cabo en los mismos. **Cada Bioquímico podrá ser
> titular de hasta dos laboratorios**, en este caso el Director Técnico deberá contar con otro
> Bioquímico."

> **Estatuto art. 95** — "Fuera de los laboratorios anteriormente definidos, se admitirán: a) Los
> **puntos de atención (PA)** que deberán cumplir con la normativa vigente. b) **Extensión de
> laboratorios**: dos o más bioquímicos directores de laboratorios podrán instalar en forma conjunta
> aparatología de uso común de los mismos, en un espacio al que todos tendrán acceso…"

> **Estatuto art. 96** — "Se admitirá la **dirección técnica de dos laboratorios por cada bioquímico
> titular, o un laboratorio y un punto de atención**."

Córdoba therefore matches Ley 17.132's number (two) but spends it differently: two labs, *or* one lab
plus one PAB. Note art. 95(b) "extensión de laboratorios" — shared instrumentation between independent
labs is expressly contemplated. That is *shared equipment*, not a shared tenant.

### 3.3 Santa Fe — the cleanest text, and the one that permits the chain

[**Ley 13.236**](https://www.santafe.gob.ar/boletinoficial/ver.php?seccion=09-01-2012ley13236-2012.htm)
(sanctioned 24 Nov 2011, promulgated 28 Dec 2011), Capítulo VI:

> **Art. 23** — "En cada laboratorio habilitado deberá ejercerse efectivamente la profesión bioquímica.
> Todos los laboratorios que se habiliten, sean públicos o privados, deberán funcionar bajo la dirección
> técnica de un profesional matriculado en el Colegio de Bioquímicos, **como titular**."

> **Art. 24** — "El Bioquímico Titular es aquel a cuyo nombre y bajo cuya responsabilidad se realizan las
> actividades bioquímicas en el laboratorio. **Éste puede suscribir certificados, protocolos y/o informes
> relativos a análisis que pudieren haber sido realizados por otros bioquímicos del laboratorio bajo su
> dirección.** El titular del laboratorio debe permanecer en el mismo mientras se realicen los actos
> bioquímicos, debiendo cubrir como mínimo un horario de **cuatro (4) horas diarias** en el laboratorio."

> **Art. 25** — "La titularidad de un laboratorio podrá ser individual o compartida con otros bioquímicos."

The law sets **no numeric cap**. The cap lives in the reglamentación,
[**Decreto 4050/16**](https://cobisfe1.org.ar/publicaciones/decreto-no-4050) (23 Nov 2016), which replaced
art. 12 of Decreto 1453/86:

> **12.1.d** — "**Cada Director Técnico podrá ejercer la misma labor hasta en dos (2) establecimientos.
> De ser titular de más de dos, deberá contar con otros Directores Técnicos Bioquímicos en éstos.**"

> **12.1.c** — "Los establecimientos permanecerán abiertos un mínimo de cuatro (4) horas diarias, de
> lunes a viernes… En todo momento que el establecimiento permanezca abierto deberá contar con la
> presencia de por lo menos un Bioquímico matriculado en la Provincia de Santa Fe."

That is the express, positive authorisation for a multi-site business: **titularidad of more than two is
lawful, so long as each site beyond the DT's two carries its own DT.** See §8.

### 3.4 Does any province forbid multi-site outright? — **No; PBA forbids the *sucursal*, not the second lab**

I found no province that forbids one owner holding several habilitated labs. PBA comes closest and lands
on the distinction that matters: *more than one Laboratorio*, yes; *sucursales del mismo*, no. Córdoba
and Santa Fe cap the DT, not the owner. Chubut expressly contemplates a persona jurídica applicant
(§4.3). **[LAWYER]** for the 19 provinces not read here — this note swept 5 of 24 jurisdictions.

---

## 4. Ownership vs dirección técnica — separable everywhere except PBA and Córdoba

These are two different legal objects and the software must not conflate them.

### 4.1 CABA / federal — a company may own the lab

**[Ley 17.132 art. 39](https://www.cofybcf.org.ar/legislacion_detalle.php?l=17)**, Capítulo II "De la propiedad":

> "Podrán autorizarse los establecimientos mencionados en el art. 34, cuando su propiedad sea:
> **De profesionales habilitados** para el ejercicio de la medicina o de la odontología…;
> **De las sociedades civiles** que constituyan entre sí los profesionales a que se refiere el inciso
> anterior; **De sociedades comerciales de profesionales habilitados** para el ejercicio de la medicina
> o de la odontología; **De sociedades comerciales o civiles, entre médicos, odontólogos y no
> profesionales, no teniendo estos últimos injerencia ni en la dirección técnica del establecimiento ni
> en ninguna tarea que se refiera al ejercicio profesional**; De entidades de bien público sin fines de
> lucro."

And **art. 40** keeps the two liabilities apart:

> "…La responsabilidad del director **no excluye** la responsabilidad personal de los profesionales o
> colaboradores **ni de las personas físicas o ideales propietarias del establecimiento**."

The Ministry's own habilitación trámite
([argentina.gob.ar](https://www.argentina.gob.ar/servicio/habilitacion-de-un-laboratorio-de-analisis-clinicos))
operationalises exactly this: for a persona jurídica it asks for the **estatuto social, CUIT, ingresos
brutos**, compliance with **art. 39 de la Ley 17.132**, and an **"Acta de Directorio que designa al
Director Técnico… autenticada por Escribano Público"**. A board resolution appointing the DT only makes
sense if the board is not the DT. So: **for CABA/federal, an SA or SRL owns the lab and appoints a
bioquímico as DT.**

Nothing in the national regime forbids that company from owning several habilitated labs. The trámite is
per-establishment, and the constraint that bites is art. 32's two-lab cap on each DT, not on the company.

### 4.2 Santa Fe — expressly separated

[Colegio de Bioquímicos SF 2ª Circunscripción, Comunicación Oficial 27/02/2026](https://colebioqsf2.org/destacadas/desvinculacion-de-la-direccion-tecnica-de-un-laboratorio/),
restating **Resolución Nº 03/2018**:

> "…la **Dirección Técnica de un Laboratorio Bioquímico es independiente de la persona física o jurídica
> que posee el dominio comercial del establecimiento**. En caso de desvinculación el/la que se
> desempeñase como el/la Director/a Técnico/a bajo cualquier modalidad contractual (relación de
> dependencia y/o facturación) debe comunicar al Colegio la baja de la Dirección Técnica. **Hasta tanto
> no lo realice, continuará siendo responsable de los actos bioquímicos desarrollados en el
> establecimiento habilitado a su nombre, hasta el vencimiento de la habilitación.**"

Two engineering consequences: (a) `owner` and `director técnico` are independent fields; (b) **DT
assignment has a lifecycle with a lagging liability tail** — a DT stays on the hook until the colegio
records the baja. Deactivating a user is not the same as ending a dirección técnica.

The same colegio's habilitación checklist asks for "Documentación respaldatoria **que establezca
vinculación del Director Técnico y la empresa o institución** en donde funcionará el Laboratorio…
contrato societario, documentación que acredite relación laboral entre el Director Técnico y el
propietario del inmueble…" ([CBSF2](https://colebioqsf2.org/habilitaciones-laboratorios/)) — again
presupposing an owning company distinct from the DT.

### 4.3 Chubut — persona jurídica may apply, with a professional inside

[Res. MS Chubut 249/2013](https://e-legis-ar.msal.gov.ar/htdocs/legisalud/migration/pdf/23253.pdf),
Anexo I, Cap. I:

> "1- La solicitud de habilitación de laboratorios de análisis clínicos puede ser presentada por un
> profesional comprendido en la Ley X Nº 3; dicha presentación **también podrá ser efectuada por una
> persona jurídica, siempre que en la misma participe alguno de dichos profesionales**.
> 2- Sobre el solicitante recaerá la responsabilidad respecto del cumplimiento de todos los requisitos…
> 3- Uno de los profesionales… **ejercerá la dirección técnica del establecimiento**."

### 4.4 PBA and Córdoba — the exceptions that break the SaaS assumption

- **PBA**: Res. 2519/15 art. 44 — "propiedad exclusiva del o de los profesionales universitarios…
  **quienes asumirán asimismo el carácter de Director Técnico**". Ley 8271 art. 61.g allows a *sociedad
  comercial* only if "integrada **exclusivamente** por un Bioquímico y sus familiares directos". A
  venture-backed SA cannot own a PBA lab.
- **Córdoba**: the reading is the same in substance (art. 61.g's twin, via the COBICO Estatuto's
  ownership and DT rules), with a lab habilitación that is triennial and inspected by the Colegio
  (Reglamento art. 15, citing Decreto 33/08 and Res. 15/09 MS Córdoba).

**Practical:** a product that assumes "one company owns N labs" is wrong in the two provinces with the
densest lab markets in the country. What is true everywhere is "**one habilitación, one DT, one
address**". Build to that, and let ownership be a soft attribute of the group.

---

## 5. THE KEY QUESTION — laboratorio vs centro / puesto de extracción

**Answer: a draw-only site is a real, separately-regulated legal figure in *some* provinces, is
*prohibited* in others, and does not exist as a category at national/CABA level. So the product's
"branch" is not one thing. It is a full laboratorio by default, with a draw-only annex as an
optional, province-gated sub-type.**

### 5.1 Where it exists and what it is

**Santa Fe — `Centro de Extracciones Bioquímicas`.** Decreto 4050/16 art. 12.2 classifies establishments
into six kinds. Verbatim:

> "**1. LABORATORIO DE ANALISIS BIOQUIMICOS**: es el lugar donde se realizan análisis bioquímicos a
> través de las etapas pre-analíticas, analíticas y post-analíticas.
> **2. CENTRO DE EXTRACCIONES BIOQUIMICAS**: es donde **sólo se desarrollan las etapas pre y post
> analíticas** que le correspondan. **Sólo se puede habilitar en localidades donde no existe Laboratorio
> de Análisis Bioquímicos.** Pueden solicitar su habilitación **únicamente aquellos bioquímicos que
> tengan habilitado un laboratorio de análisis bioquímicos en otra localidad** y deben incluirlo en su
> declaración jurada de horario.
> **3. LABORATORIO BIOQUIMICO**: … habilitado por aquellos bioquímicos que demuestren fehacientemente
> conformar una figura integrativa con reconocimiento legal acreditable.
> **4. LABORATORIO DE PROCESAMIENTO**: propiedad de varios bioquímicos que conforman una figura
> integrativa… que procesan las muestras obtenidas en sus laboratorios bioquímicos. **En estos
> establecimientos no se atienden pacientes** y desarrollarán las etapas analíticas y post-analíticas…
> Estos Laboratorios **pueden recibir derivaciones de terceros**.
> **5. LABORATORIO ESPECIALIZADO**: dirigido técnicamente por un bioquímico especialista…
> **6. LABORATORIO DE DERIVACIÓN**: realizan prácticas bioquímicas que no pueden ser resueltas por el
> laboratorio derivante. **Pueden atender pacientes.**"

This is *the* structural map. It is worth reading twice: Santa Fe has separately named the
draw-only front (2), the analytical back-end that never sees a patient (4), and the reference lab that
does (6). Note the crucial limiter on the Centro de Extracciones: **it may only exist where there is no
lab**. It is an access-to-care device for thin markets, **not** a mechanism for putting twelve storefronts
in Rosario. Art. 12.3 lets Laboratorios de Procesamiento y de Derivación skip the sala de espera and sala
de extracción precisely because they do not receive patients.

Habilitación is by the provincial sanitary authority **and** the Colegio (Ley 13.236 art. 19).

**Chubut — `Sala de Extracción`.** Res. MS 249/13 Anexo I, Cap. V, verbatim:

> "**CAPÍTULO V - SALA DE EXTRACCIÓN**: destinada exclusivamente a la obtención de muestras para ser
> enviadas a un laboratorio; se habilitará cuando la autoridad sanitaria… considere que las condiciones
> particulares esgrimidas por los solicitantes así lo justifiquen.
> 1- Deberá contar con todo lo exigido en éste Anexo I: sala de espera, box/es de extracciones y
> sanitarios.
> 2- …en su lugar se dispondrá de un área de 2 m² de superficie mínima, con mesada, pileta… destinado a
> la preparación del material para su traslado.
> 2- Recurso humano necesario: **Técnico de Laboratorio** o formación académica equivalente.
> 3- **Dirección Técnica obligatoria: profesional del Art. 33 de la Ley X Nº 3, sin presencia permanente
> en el lugar.**
> 4- Deberá equiparse con lo necesario para la toma de muestras y el acondicionamiento de las mismas
> para su envío."

That inciso 3 is the single most useful sentence for the product: **a sala de extracción has its own
named DT, but that DT is not required to be physically there.** It is a distinct habilitación with a
distinct responsible professional — not an address hanging off the central lab's habilitación. The
resolution's own considerandos say exactly why the figure exists:

> "…dada la tendencia a concentrar la realización de prácticas en establecimientos con mayor capacidad
> técnica… como así también al gran número de localidades con baja densidad poblacional dentro de
> nuestra provincia, resulta inconveniente la instalación de laboratorios en cada una de ellas…
> se hace necesario prever el acondicionamiento de sitios que denominaremos **salas de extracción**
> destinados exclusivamente a la extracción de muestras que posteriormente serán enviadas a analizar…"

Chubut Anexo I Cap. IV also creates the mirror image: "**Si el laboratorio sólo recepciona muestras
obtenidas en otro establecimiento, podrá eximirse de contar con la sala de espera y con el box de
extracción**…" — the patient-less processing lab.

**Córdoba — `Punto de Atención Bioquímica` (PAB), and a hard cap of one.** Reglamento Interno COBICO
art. 18, verbatim:

> "**PUNTO DE ATENCIÓN BIOQUÍMICA (PAB)**: Fuera de los laboratorios habilitados como centrales, se
> admitirán los PUNTOS DE ATENCIÓN BIOQUÍMICA, que deberán cumplir con los requisitos y exigencias
> edilicias, de aparatología, materiales y reactivos **para la extracción, para el procesamiento
> preanalítico de las muestras, conservación, traslado y derivación de las mismas**… **Se admitirá UN
> solo PAB por laboratorio habilitado** y deberán **contar con la presencia de otro profesional
> bioquímico** y su resolución **caerá en pleno derecho con el vencimiento de la habilitación
> ministerial de su laboratorio**. Es condición fundamental para solicitar un Punto de Atención
> Bioquímica tener vigente habilitación Ministerial."

So in Córdoba the annex is: **one per lab, staffed by a bioquímico, and lifecycle-coupled to the parent
lab's habilitación.** Art. 24 gives its minimum rooms (waiting room; extraction/reception/processing
room; pathogenic waste area; bathroom) and art. 34 gives it minimum kit ("baño de maría, centrífuga y
heladera").

### 5.2 Where it is prohibited

**Córdoba, Reglamento Interno art. 16**, verbatim:

> "Sólo se podrán extraer y recibir muestras para análisis clínicos **en los Laboratorios con
> habilitación ministerial y sus correspondientes puntos de atención** y en el domicilio de los pacientes
> que así lo requieran, **quedando terminantemente prohibida la instalación de receptorías y/o
> extractorías**. Los laboratorios que reciban muestras para procesar como derivación **solo podrán
> hacerlo si provienen de laboratorios habilitados**."

And art. 34, in the documentation requirements: "**El laboratorio debe demostrar consistentemente que no
funciona como una extractoría.**" That is an affirmative burden of proof placed on the lab — i.e., an
audit will look at the derivation ratio.

**PBA**: Ley 8271 art. 61.f (quoted §3.1) prohibits a lab existing "con la finalidad de realizar la
derivación de las muestras obtenidas", and Res. 2519/15 art. 45 prohibits sucursales. PBA offers **no**
extraction-only category at all: the habilitación trámite and Res. 2519/15 arts. 43–50 know only a full
laboratorio, whose art. 47 minimum rooms include a *sala de extracciones* **and** a *laboratorio
propiamente dicho* of ≥12 m².

### 5.3 Where it simply does not exist as a category

**CABA / national.** The Ministry's habilitación trámite lists only "laboratorio de análisis clínicos"
and its internal *cuarto de extracción de muestras*. I found **no** national or CABA norm creating a
draw-only establishment type, and **no** national REFES tipología for one — REFES codes a lab as
tipología **51 ESSID**, "Establecimiento de salud sin internación de diagnóstico… Incluye por ejemplo
los centros de Diagnóstico por imágenes y **Laboratorios de Análisis Clínicos**"
([SISA](https://sisa.msal.gov.ar/sisadoc/docs/050101/refes_tipologias.jsp)), with a 14-digit federal code
per establishment under [Res. MS 298/2011](https://sisa.msal.gov.ar/sisadoc/docs/050101/refes_codificacion.jsp).
**Tucumán** likewise: its Reglamentación de la Ley 5482 lists minimum installations for *a laboratory*
(sala de extracciones, sala de espera, sala de procesamiento, baño) and knows no annex type
([COBITUC](https://www.cobituc.org.ar/reglamentacion-de-la-ley-n-5482/)).

**[LAWYER]** — whether CABA has a *municipal* rubro (Código de Habilitaciones) that permits an
extraction-only local under the national health habilitación. I found none, but CABA's own habilitación
código was not read end-to-end.

### 5.4 So: is our "branch" a lab, an annex, or both? — **Both, and the default is a full lab**

| Jurisdiction | Draw-only annex? | Own DT? | Cardinality | Norm |
|---|---|---|---|---|
| CABA / federal | **Not found** | — | — | Ley 17.132; MS trámite; REFES |
| Buenos Aires (prov.) | **Prohibited** (no sucursales; no derivation-purpose labs) | — | 0 | Res. 2519/15 arts. 44–45; Ley 8271 art. 61.f |
| Córdoba | Yes — `Punto de Atención Bioquímica` | Needs *another* bioquímico present | **exactly 1 per lab** | Reglamento COBICO art. 18; Estatuto arts. 91, 95, 96 |
| Santa Fe | Yes — `Centro de Extracciones Bioquímicas` | Habilitated to a bioquímico who has a lab elsewhere | n, but **only where no lab exists** | Decreto 4050/16 art. 12.2.2 |
| Chubut | Yes — `Sala de Extracción` | **Yes, DT obligatorio, sin presencia permanente** | discretionary | Res. 249/13 Anexo I cap. V |

The linkage to a central lab is lawful in all three provinces that recognise the figure, and derivation
between habilitated labs is lawful everywhere (M17). What is **not** lawful anywhere I looked is an
unhabilitated storefront that draws blood and couriers it.

---

## 6. Whose name and address prints on the report

**The identity that must appear is that of the laboratory that performed the analysis, and the DT who
endorses it — not the site that drew the sample.**

**MERCOSUR/GMC Res. 30/20 §4.7.3** (incorporated by
[Res. MS 1514/2021](https://servicios.infoleg.gob.ar/infolegInternet/anexos/350000-354999/350267/norma.htm);
annex text via [IMPO](https://www.impo.com.uy/bases/decretos-internacional/345-2021/1)) requires, among
the mandatory fields, "**La identificación del laboratorio que efectuó el análisis**" and "**La
identificación del profesional que avala la emisión del informe**". Note the verb: *efectuó*. The
drawing site is not what that field names. See the sibling file's C8.

**Ley 17.132 art. 32** requires the **DT** to sign the informes/protocolos handed to the examinados
(sibling file C6), and the MS habilitación trámite requires the printed protocol to carry lab letterhead
plus the DT's **name, matrícula, phone, address and signature** (sibling file C7).

**Córdoba is the most explicit, and adds two fields nobody expects.** Reglamento Interno COBICO art. 38,
verbatim:

> "Deberán constar como mínimo, los siguientes datos:
> a) Nombre y apellido del bioquímico con o sin el prefijo Dr.;
> b) **Número de matrícula profesional, número de resolución de inspección de laboratorio de Cobico con
> su vencimiento y el número de resolución de habilitación ministerial con su vencimiento.**
> c) **Dirección, teléfono, localidad;**
> d) Nombres y apellidos del paciente, eventualmente datos del médico solicitante;
> e) Fecha de realización; si las circunstancias lo exigieran incluir también la hora de extracción u
> obtención del material;
> f) Firma y sello del profesional."

and art. 40:

> "Los protocolos de análisis **sólo podrán ser firmados por los bioquímicos Directores técnicos o por
> bioquímicos que se desempeñen en ese laboratorio**."

So in Córdoba, the report carries **two habilitación resolution numbers with expiry dates** — meaning the
report template is a function of the *issuing lab's live habilitación state*, and a lab whose
habilitación lapsed cannot print a valid protocol. That is a hard validation rule, not a cosmetic field.

**Answer to the posed scenario.** A chain that draws at 12 storefronts and runs one lab prints **the
central lab's identity** — its letterhead, its DT, its matrícula, its address, its habilitación numbers —
because that is the lab "que efectuó el análisis" and its DT is the one who signs. Where the drawing
site is itself a habilitated annex with its own DT (Chubut sala de extracción, Córdoba PAB), that DT is
responsible for the pre-analytical phase and the annex is a documented origin, but it is **not** the
signatory of the analytical result. And where the drawing site is itself a full laboratorio that derived
the sample out (the PBA pattern), the norms flip the emphasis: PBA Res. 2519/15 art. 50 requires the
derivante to "consignar y conservar el protocolo de análisis del **profesional que efectivamente lo
realizó**", and Córdoba art. 41 requires keeping the received informe with "la fecha y nombre del
profesional que intervino, por lo menos durante **cinco años**".

**Engineering consequence:** the report's letterhead block is bound to the **performing lab**, and the
sample's **collection site** is a separate, printable-but-distinct attribute. A single `tenant.branding`
object that supplies both is wrong. **[LAWYER]** on whether a chain may add the collection site's address
to the report as a courtesy field — nothing I read forbids extra information, but Córdoba art. 37
("los protocolos deberán ser de aspecto sobrio") and the Colegio's prior-approval power over publicity
(Ley 13.236 art. 32 in SF; COBICO Título IV) mean it is not a free-for-all.

---

## 7. Reality check — what real Argentine chains actually are

The best evidence here is not a marketing page but a **CNDC merger dictamen**, because the parties were
compelled to describe their own structure.

**[CNDC / RESOL-2024-280-APN-SIYC#MEC](https://cndc.produccion.gob.ar/sites/default/files/cndcfiles/1855.pdf)**
(EX-2022-50992304), acquisition of exclusive control over **LABORATORIO HIDALGO S.A.**, dictamen
4 Sep 2024. Findings, verbatim where they matter:

> **¶28** — "Cabe mencionar que dicha modalidad se da **tanto entre las sedes de un mismo laboratorio**
> como así también, entre distintas empresas de laboratorios, en ambos casos, impulsada por la
> **estrategia comercial de escindir las etapas de extracción (instalando el mayor número de sedes
> posible para ganar capilaridad territorial) y la de procesamiento, centralizando ésta última en una
> planta o sede particular con el equipamiento analítico adecuado**."

> **¶45** — "**CENTRO ROSSI** cuenta con **14 sedes** localizadas en la Ciudad Autónoma de Buenos Aires
> (10), Partido de San Isidro (1), Quilmes (1) y Moreno (2), mientras que **LABORATORIO HIDALGO**, al
> momento de la notificación de la operación, tenía **26 sedes** distribuidas en la zona norte de la
> Provincia de Buenos Aires, de las cuales 8 se encontraban ubicadas en el Partido de San Isidro."

> **¶45 (cont.)** — "…una sucursal dejó de recibir pacientes y actualmente se utiliza como depósito, y
> otras dos que estaban relacionadas al «Sanatorio San Lucas» actualmente son operadas por CENTRALAB
> S.A. Como consecuencia, **3 de los 8 laboratorios localizados en el partido de San Isidro fueron dados
> de baja** con posterioridad a la operación."

Read ¶45's last clause carefully: the CNDC calls the sedes "**laboratorios**", and says three of them
were "**dados de baja**" — the vocabulary of *habilitaciones being cancelled*, one per site. In PBA, where
sucursales are prohibited (M6), that is exactly what a 26-site chain must be: **26 separate
habilitaciones**.

Corporate form, from the same dictamen: **LABORATORIO HIDALGO S.A.**; **ENRIQUE MARTÍN ROSSI S.A.**
(Centro Rossi); **CENTRO DE ESTUDIOS INFECTOLÓGICOS S.A.** (Stamboulian); CENTRALAB S.A.; and a single
controlling shareholder across all of them. Also named as market participants:
**LABORATORIO BIOMÉDICO DR. RAPELA S.A.**, **CENTRO DE ESTUDIOS BIOQUÍMICOS S.R.L.**, **DIAGNÓSTICO
MAIPÚ**, and the **Cámara Argentina de Laboratorios Bioquímicos** / **CADIME**. So: **SA and SRL are the
normal corporate wrappers**, and one holding lawfully controls several lab companies.

On the derivation economics, ¶31, verbatim:

> "…en el mercado se pueden encontrar laboratorios que derivan **casi la totalidad de sus muestras**
> (**DIAGNÓSTICO MAIPÚ** informó que en el 2021 derivó el **88%** de las muestras), como así también
> laboratorios que procesan internamente la gran mayoría de las determinaciones. En particular, ROSSI y
> LABORATORIO HIDALGO… tercerizan un bajo volumen de muestras a otros laboratorios (alrededor del 1%)…"

And ¶47–¶52 confirm the geographic logic: patients choose a *sede* by proximity (60% travel <3 km), so
the extraction footprint is dense and local, while processing "puede[n] ser trasladadas largas
distancias".

**Other chains, from their own pages:**

- **Stamboulian Servicios de Salud** — [13 centres](https://stamboulian.com.ar/centros/) across CABA and
  northern GBA. The page labels each centre's services; only **6 of 13** carry the label "Laboratorio"
  (Barrio Norte I, Belgrano I, Flores, Microcentro, Villa Crespo, Villa Urquiza); the rest are
  "Vacunación" and/or consultorios. It uses **no** term like "centro de extracción". So even a chain with
  a dense footprint does not put a lab at every address.
- **MANLAB** — describes itself as a **derivation hub, not a branch network**:
  "**2.000 LABORATORIOS ASOCIADOS**", "18.500.000 test realizados cada año", "36.000 pacientes diarios",
  a single named "**CENTRO DE PROCESAMIENTO**" of 1.600 m², and "18 unidades móviles propias" running
  "25 recorridas diarias monitoreadas por GPS" ([manlab.com.ar/nosotros](https://www.manlab.com.ar/nosotros/)).
  Its address is a single CABA domicilio. MANLAB's 2.000 sites are **other people's labs**, connected by
  a derivation agreement and a courier route — not tenants of MANLAB. It even runs a separate
  [derivaciones portal](https://derivaciones.manlab.com.ar/) for them.
- **Laboratorio Hidalgo** — ISO 15189 accredited since 2005, 26 sedes at the time of the CNDC filing,
  now under Centro Rossi's control.

**Conclusion from evidence, not assumption:** the dominant real structure is **many separately-habilitated
laboratorios under common ownership, plus a derivation relationship to one high-complexity plant** —
which is precisely what PBA's prohibition on sucursales forces, and what the CNDC describes as the
industry's deliberate commercial strategy. The "one lab, twelve draw-only storefronts" model that the
question posits is the *exception*, available only in provinces that name the annex and only within their
limits.

---

## 8. "Franchise" structures — lawful, and expressly contemplated in Santa Fe

**Yes, the pattern is documented, and it is lawful where the province says so.**

The clean authority is **Santa Fe, Decreto 4050/16 art. 12.1.d**:

> "Cada Director Técnico podrá ejercer la misma labor hasta en dos (2) establecimientos. **De ser titular
> de más de dos, deberá contar con otros Directores Técnicos Bioquímicos en éstos.**"

That sentence anticipates exactly the described structure — a titular with more than two establecimientos,
each of the extras carrying its own contracted DT — and permits it, subject to each DT covering at most
two sites and each site being open ≥4 h/day with a matriculado present (art. 12.1.c).

PBA reaches the same place from the other side: Res. 2519/15 art. 45's "Cuando se tratare de profesionales
**asociados** con más de un (1) laboratorio, podrán hacerlos funcionar **simultáneamente**, siempre que en
cada uno de ellos, **alguno de los socios pudiere asumir completamente la Dirección Técnica**". Ley 8271
art. 61.c says the same. The condition is not "one matrícula per site" as a paper formality — it is that
a *socio actually able to assume full DT responsibility* is there while the site operates.

**So what is the art. 32 cap actually stopping?** Not multi-site businesses. It stops **one professional
lending their matrícula to an unbounded number of sites they cannot personally attend** — which is why
every norm in this note pairs a numeric cap with a *presence* duty:

| Jurisdiction | Numeric cap | Presence duty |
|---|---|---|
| National / CABA | 2 (director *titular*) | "atención personal y efectiva" — Ley 17.132 art. 32 |
| Buenos Aires | none stated ("más de dos direcciones técnicas") | may not run two simultaneously unless a socio covers each — Res. 2519/15 art. 45; Ley 8271 art. 61.b–c |
| Córdoba | 2 labs, or 1 lab + 1 PAB | titular must remain "mientras se realicen actos bioquímicos" — Estatuto arts. 93, 96 |
| Santa Fe | 2 per DT; more allowed with extra DTs | titular ≥4 h/día; a matriculado present whenever open — Ley 13.236 art. 24; Dec. 4050/16 art. 12.1.c |

The cap and the presence duty are one rule expressed twice. A structure that engages one real, present,
matriculado DT per site satisfies both. A structure that names a DT who is never there fails the second
half even where it passes the first — and PBA/Córdoba give the authority explicit tools to catch it
(Ley 8271 art. 61.j: fines and clausura; COBICO Reglamento art. 34: "el laboratorio debe demostrar
consistentemente que no funciona como una extractoría").

**[LAWYER]** on whether a per-site DT engaged as a contractor (locación de servicios) rather than an
employee changes anything. Santa Fe's Res. 03/2018 says "bajo cualquier modalidad contractual (relación
de dependencia y/o facturación)" — i.e. it does not, there. Not verified elsewhere.

---

## 9. What this means for the tenancy model

**A multi-site lab is several tenants sharing an owner — not one tenant with branches.**

The reasoning, in one chain:

1. The unit that the state regulates is the **habilitación**, and a habilitación is bound to one
   establishment at one address (Ley 17.132 arts. 34, 37; Chubut Res. 249/13 "caducidad… por cambio de
   domicilio"; REFES codes one federal number per establishment).
2. Each habilitación carries **its own director técnico**, who personally signs the reports issued there
   (Ley 17.132 art. 32; Ley 8271 art. 61.d; Ley 13.236 art. 24; Reglamento COBICO art. 40).
3. The report's letterhead, address, matrícula and — in Córdoba — **habilitación resolution numbers with
   expiry** are properties of *that* habilitación (§6). Two sites cannot share one letterhead block.
4. PBA, the largest market, **forbids the sucursal outright** and forces every additional site to be its
   own laboratorio (Res. 2519/15 art. 45). A model whose only multi-site primitive is "branch" cannot
   represent a PBA chain at all.
5. The real chains are built exactly that way (§7): 14 sedes / 26 sedes, described by the competition
   authority as separate *laboratorios* that get *dados de baja* one at a time.

So the aggregate root is the **Laboratory = one habilitación**. Recommended shape:

```
Organization              -- commercial owner (SA/SRL, or the professionals themselves in PBA/Córdoba)
  └── Laboratory (1..n)   -- THE TENANT. one habilitación, one address, one letterhead,
      │                      one DT (or co-DTs), one set of habilitación numbers + expiry
      ├── DrawSite (0..n) -- province-gated annex: centro/puesto de extracción, PAB, sala de extracción.
      │                      has its own habilitación and its own DT; NOT a full lab; issues no report
      └── DerivationLink  -- to another Laboratory (own or third-party) that performs and signs
```

What that buys, and what it costs:

1. **`Laboratory` is the tenant.** Data isolation, users, catalogue, report template, retention clock and
   AAIP registration all hang off it. Do not put the report letterhead on `Organization`.
2. **`Organization` is a grouping, not a security boundary** — cross-lab reporting, shared catalogue
   authoring and single sign-on live there. But a user's *permissions* are per-Laboratory, because the
   professional responsibility is per-Laboratory.
3. **`DrawSite` is a first-class but subordinate entity**, not a `Laboratory` with fewer features. It has
   an address, a DT, a habilitación, and a mandatory link to the Laboratory that performs — and it
   **never issues a signed report**. Model it, but gate it by jurisdiction: it is invalid in PBA, capped
   at one per lab in Córdoba, and locality-restricted in Santa Fe.
4. **A sample's `collection site` and a result's `performing lab` are different fields**, and only the
   latter drives the letterhead (§6, MERCOSUR §4.7.3 "el laboratorio que efectuó el análisis").
5. **`DirectorTecnico` is an assignment with a lifecycle**, not a role flag: `{professional, laboratory,
   from, to, registered_with_colegio_at}`. Santa Fe Res. 03/2018 makes the outgoing DT liable "hasta el
   vencimiento de la habilitación" until the baja is filed — so ending an assignment is an event with a
   tail, and the system should be able to say who was DT on the date a given report was signed.
6. **Enforce the caps as configuration, not as code.** `max_direcciones_tecnicas_per_professional` is 2
   nationally, 2 in Córdoba, 2-per-DT-with-overflow in Santa Fe, and unbounded-with-a-presence-rule in
   PBA. Put the number in a per-jurisdiction policy table keyed by the same `{jurisdiction}` you already
   need for matrícula (sibling file, C-note on matrícula as a triple). One warning at DT assignment time
   is worth more than a hard block, since the rule is genuinely different per province and at least one
   provincial norm is more permissive than the national one.
7. **Derivation is already in the model** (sibling file, domain point 8). This note only adds that the
   derivation counterparty may be *another Laboratory in the same Organization* — which is the chain
   pattern — and that the received protocol must be retained (5 years Córdoba; 3 years PBA/Chubut for
   determination registers; 10 years under Ley 26.529 art. 18 for the historia clínica).

**The one thing not to build:** a `branches` table hanging off a single tenant, sharing one letterhead,
one DT and one habilitación. That models a legal object Argentina does not have.

---

## 10. What genuinely needs a lawyer

Do not let the build depend on my reading of these:

1. **Can a bioquímico be *titular* director of two labs and *adjunto / sub-director* of others under
   Ley 17.132 art. 32?** The article caps only "directores titulares". PBA and Santa Fe answer yes in
   substance; CABA/federal is unaddressed. Directly determines the DT-assignment cap in CABA.
2. **PBA Res. 2519/15 art. 45 ("más de dos direcciones técnicas") vs Ley 17.132 art. 32 (max two).** A
   provincial ministerial resolution is more permissive than a national law on the same point. Which
   governs a PBA-matriculado DT of three PBA labs?
3. **Can a non-professional-owned SA/SRL own a laboratorio in PBA or Córdoba?** Res. 2519/15 art. 44 and
   Ley 8271 art. 61.g read as no. That is an existential constraint on a SaaS whose customers are
   corporate lab groups in the country's biggest market — worth a definitive opinion before pricing a
   multi-tenant plan around "one company, N labs".
4. **Is there any CABA municipal or national route to an extraction-only site?** I found none, and I did
   not read the CABA Código de Habilitaciones end-to-end. If the answer is yes, the `DrawSite` entity
   becomes materially more valuable.
5. **The 19 provinces not swept.** This note read PBA, Córdoba, Santa Fe, Chubut and Tucumán. Anything
   sold nationally needs the remaining jurisdictions checked for (a) DT caps, (b) ownership restrictions,
   (c) whether an extraction-only category exists.
6. **May the collection site's address be printed on the report alongside the performing lab's?**
   Nothing forbids extra fields, but protocol content and publicity are colegio-supervised (COBICO
   Reglamento art. 37 "aspecto sobrio"; Ley 13.236 art. 32).
7. **Does a per-site DT engaged as a contractor satisfy the presence duty?** Santa Fe Res. 03/2018 says
   contractual modality is irrelevant to responsibility; not verified in PBA or Córdoba.
8. **Whether an intra-group derivation (site A of the chain to site B of the chain) is a *cesión* of
   sensitive data under Ley 25.326 art. 11** requiring the patient's prior consent — because on this
   note's model, A and B are separate legal establishments with separate habilitaciones, not one
   controller with two rooms. See the sibling file §2.3; the joint-liability rule in art. 11.4 makes this
   more than a formality.

---

## 11. Sources

Primary — national:

- [Ley 17.132 — Ejercicio de la medicina, odontología y actividades de colaboración (texto actualizado, InfoLeg)](https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/19429/texact.htm)
- [Ley 17.132 — texto actualizado (Argentina.gob.ar)](https://www.argentina.gob.ar/normativa/nacional/ley-17132-19429/actualizacion)
- [Ley 17.132 — full transcription incl. arts. 32, 34–40 (COFyBCF)](https://www.cofybcf.org.ar/legislacion_detalle.php?l=17)
- [Decreto 6216/1967 — reglamentación de la Ley 17.132](https://www.argentina.gob.ar/normativa/nacional/decreto-6216-1967-140762/texto)
- [MS — Habilitación de un laboratorio de análisis clínicos (trámite; art. 39 compliance, acta de directorio, protocol content)](https://www.argentina.gob.ar/servicio/habilitacion-de-un-laboratorio-de-analisis-clinicos)
- [MERCOSUR/GMC Res. 30/20 — full annex incl. §4.7.3 (IMPO, Uruguay Decreto 345/2021)](https://www.impo.com.uy/bases/decretos-internacional/345-2021/1)
- [Resolución MS 1514/2021 — incorpora MERCOSUR/GMC Res. 30/20](https://servicios.infoleg.gob.ar/infolegInternet/anexos/350000-354999/350267/norma.htm)
- [SISA/REFES — tipologías y categorías de los establecimientos de salud](https://sisa.msal.gov.ar/sisadoc/docs/050101/refes_tipologias.jsp)
- [SISA/REFES — codificación federal de establecimientos (Res. MS 298/2011)](https://sisa.msal.gov.ar/sisadoc/docs/050101/refes_codificacion.jsp)

Primary — Provincia de Buenos Aires:

- [Ley 8271 (texto según Leyes 11.925 y 13.560) — Colegio de Bioquímicos PBA, art. 61 "Del funcionamiento de los laboratorios"](https://normas.gba.gob.ar/documentos/Bj6wrUyB.html)
- [Resolución MS PBA 2519/2015 — normas complementarias del régimen de establecimientos privados](https://normas.gba.gob.ar/documentos/xa9e2GU4.html)
- [Resolución 2519/15, chapter "Laboratorio de Análisis Clínicos", arts. 43–50 (Colegio de Bioquímicos PBA, full text)](http://www.colebioqpba.org.ar/admin/contenido_dinamico/legislacion/890cc2_Resolucion2519-15.doc)
- [PBA — trámite de habilitación de Laboratorios de Análisis Clínicos y Bacteriológicos](https://www.gba.gob.ar/saludprovincia/tr%C3%A1mites_y_habilitaciones/laboratorios_de_an%C3%A1lisis_cl%C3%ADnicos_y_bacteriol%C3%B3gicos)

Primary — Córdoba:

- [Ley 5197, Estatuto y Reglamento Interno que regulan el ejercicio de la Bioquímica en la Provincia de Córdoba (COBICO, ed. 2024)](https://cobico.ar/wp-content/uploads/2024/10/Ley-Estatuto-y-Reglamento-Interno-1.pdf) — Estatuto arts. 89, 91, 93–99; Reglamento Interno arts. 15–18, 22–24, 34, 37–41

Primary — Santa Fe:

- [Ley 13.236 — Ejercicio de la Profesión Bioquímica (Boletín Oficial de Santa Fe)](https://www.santafe.gob.ar/boletinoficial/ver.php?seccion=09-01-2012ley13236-2012.htm)
- [Ley 13.236 — texto oficial (santafe.gov.ar/normativa)](https://www.santafe.gov.ar/normativa/getFile.php?id=224736&item=109705&cod=f24603469f771b3cdc6f968d72e93842)
- [Decreto 4050/16 (23 Nov 2016) — reemplaza el art. 12 del Decreto 1453/86; clasificación de establecimientos](https://cobisfe1.org.ar/publicaciones/decreto-no-4050)
- [Colegio de Bioquímicos SF 2ª Circ. — Resolución 03/2018 y desvinculación de la dirección técnica](https://colebioqsf2.org/destacadas/desvinculacion-de-la-direccion-tecnica-de-un-laboratorio/)
- [Colegio de Bioquímicos SF 2ª Circ. — requisitos de habilitación de laboratorios](https://colebioqsf2.org/habilitaciones-laboratorios/)

Primary — Chubut and Tucumán:

- [Resolución MS Chubut 249/2013 — normas de habilitación para laboratorios de análisis clínicos, bacteriológicos e histopatológicos; Anexo I cap. IV–V (sala de extracción)](https://e-legis-ar.msal.gov.ar/htdocs/legisalud/migration/pdf/23253.pdf)
- [Reglamentación de la Ley 5482 (Colegio de Bioquímicos de Tucumán)](https://www.cobituc.org.ar/reglamentacion-de-la-ley-n-5482/)

Primary — market structure:

- [CNDC / RESOL-2024-280-APN-SIYC#MEC — dictamen 4/9/2024, adquisición de LABORATORIO HIDALGO S.A. (EX-2022-50992304)](https://cndc.produccion.gob.ar/sites/default/files/cndcfiles/1855.pdf)

First-party company pages (non-normative, used only for the reality check):

- [Stamboulian Servicios de Salud — Nuestros Centros](https://stamboulian.com.ar/centros/)
- [MANLAB — Nosotros](https://www.manlab.com.ar/nosotros/) and [portal de derivaciones](https://derivaciones.manlab.com.ar/)
