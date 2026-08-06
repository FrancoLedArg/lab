# Lab Management

Clinical diagnostic lab operations for subscribed Labs: staff register Visits where Patient, coverage, and Medical Order data are captured, Specimens are collected, authorization and Charges are tracked (Obra Social–specific), Results are entered manually, and Results are delivered to the Patient. Accountability is derived. Multiple Labs subscribe; each Lab is a single site. One bounded context.

## Language

### Tenancy

**Lab**:
A single-site clinical diagnostic laboratory that subscribes to the product. The unit of tenancy and operational isolation. May send or receive Specimens via Derivation. The Lab (owner) decides processing and Result Delivery discretion (partial vs full, trust vs wait for payment/authorization).
_Avoid_: Tenant (implementation), clinic, site (unless distinguishing rooms inside one Lab)

### People & coverage

**Patient**:
The person from whom Specimens are collected and to whom Results are delivered (print, PDF, WhatsApp). May also receive WhatsApp follow-ups for pending authorization or payment.
_Avoid_: Client, customer, afiliado

**Affiliate**:
The person whose Obra Social coverage is used. May differ from the Patient. Depending on Obra Social Policy, may authorize Practices (e.g. BOREAL) before or after the Visit.
_Avoid_: Member, insured

**Obra Social**:
A health-coverage organization (e.g. IOSEP, BOREAL) with its own authorization channel, Co-seguro pattern, and coverage rules.
_Avoid_: Medical service provider, payer (too generic)

**Coverage Mode**:
How a Medical Order is covered: **Obra Social** or **Particular** (Patient pays in full; Affiliate may be absent).
_Avoid_: Payment type, insurance type

### Visit & orders

**Visit**:
One Patient appearance at the Lab. Staff register Patient (and Affiliate) data, one or more Medical Orders, collect Specimen(s), record Practice Line authorization outcomes as far as known, and collect Charges due at that appearance. A later Medical Order may continue unfinished Practices; it may occur on a later Visit with or without a new draw (Lab discretion).
_Avoid_: Accession, encounter, appointment (unless you later mean scheduling)

**Medical Order**:
The doctor’s paper request registered on a Visit: Practices, Coverage Mode / Obra Social, Affiliate data when applicable. More than one Medical Order may belong to the same Visit. A new Medical Order is used when a later authorization wave continues Practices not covered earlier.
_Avoid_: Lab order, prescription (upstream)

**Practice** (*Práctica*):
A catalog item the Lab can perform. Carries method, units, reference ranges, material cost, and UB weight. UB weights follow the national Consejo de Bioquímicos; Obra Sociales set peso per UB and policies—not the UB weight.
_Avoid_: Test, analysis, study, bloodwork (as the atomic term)

**Practice Line**:
A Practice on a Medical Order, with coverage status: authorized, not authorized / Patient-pay, pending authorization, not covered.
_Avoid_: Order item, Authorization (as a separate aggregate)

**Authorization Number**:
Obra Social–specific reference recorded on the **Medical Order** when Policy requires it (e.g. BOREAL). Not per Practice Line unless a future Obra Social forces that.
_Avoid_: Auth code, token (implementation)

**Unidad Bioquímica (UB)**:
National billing unit for a Practice (weight from Consejo de Bioquímicos). Obra Social sets peso per UB.
_Avoid_: Credit, point

### Specimens

**Specimen**:
Physical sample collected on a Visit. May support Practices across Medical Orders / later Visits when the Lab retains it instead of redrawing. May be derived to another Lab or an external lab. Whether the Lab processes all Practices up front or waits on later authorization is Lab discretion.
_Avoid_: Sample (prefer Specimen), tube (container)

**Derivation**:
Sending a Specimen (or work for some Practices) to another Lab on the platform or to an external higher-complexity lab, including registration at the destination (staff or agent).
_Avoid_: Referral, outsourcing

### Results & delivery

**Result**:
Values and observations staff register for a Practice on a Specimen. Manual entry only.
_Avoid_: Lab data

**Result Delivery**:
Making finalized Results available to the Patient (print, PDF, WhatsApp). Timing and partial vs full delivery are at **Lab discretion** (e.g. deliver what’s done; wait for authorization/payment; allow pay-later for trusted Patients).
_Avoid_: Sending results (vague)

### Authorization & money

**Authorization** (status + process, not a separate aggregate):
Recorded on Practice Lines. Process is Obra Social–specific, driven by **Obra Social Policy** — e.g. IOSEP: staff authorize on an external site before the Patient leaves (cupón / recibo from that site, Co-seguro known, Patient signs); BOREAL: Affiliate often authorizes later; staff mark pending and follow up (e.g. WhatsApp) until an Authorization Number and outcome exist. Scaffold records outcomes in-app; channel automation is optional later.
_Avoid_: Authorization as the core aggregate

**Proof Document**:
A retained copy of an external authorization artifact (e.g. IOSEP cupón or recibo) kept with the Visit / Medical Order for reprint or legal backup. Not used in day-to-day ops once Charges and Practice Line statuses are recorded; retain until the Lab no longer needs that backup.
_Avoid_: Attachment (too generic), document vault as a product concept

**Charge**:
An amount the Patient owes in the context of a Visit and/or Medical Order (Co-seguro, Particular, full Patient-pay Practice Lines), each tracked as paid or unpaid. Labs may allow pay-later at their discretion.
_Avoid_: Invoice (unless you later mean a formal fiscal document), debt

**Co-seguro**:
A Charge under Obra Social rules. Pattern depends on Policy: e.g. per Medical Order / authorization wave (IOSEP), or once at the Visit covering orders present (BOREAL). Distinct from paying an unauthorized Practice in full.
_Avoid_: Extra payment, surcharge (UI copy only)

**Accountability**:
Derived Lab-side money view: revenue (Obra Social and/or Patient Charges, UB math) minus material cost. Completeness of authorization and payment is trackable according to Policy.
_Avoid_: Billing (SaaS subscription fees to Labs are out of this domain), accounting

**Obra Social Policy**:
Per-Lab configuration of how a given Obra Social is handled: who authorizes, when relative to the Visit, Co-seguro pattern, required external references (e.g. authorization number, cupón), uncovered Practices, follow-up behavior. Expected to reflect local collegiate practice (e.g. Colegio de Bioquímicos de Santiago del Estero) but must be customizable for other regions — without promising every national edge case.
_Avoid_: Integration config (implementation), full national rules engine

## Scaffold spine (agreed)

In scope for shared language: Lab, Patient, Affiliate, Coverage Mode, Obra Social, Obra Social Policy (thin), Visit, Medical Order, Practice, Practice Line, Authorization Number (when Policy requires), Specimen, Result, Result Delivery, Charge, Co-seguro, Proof Document (retain for reprint/legal backup), Derivation, Accountability (derived), Authorization as Practice Line status.

Parked: per–Obra Social website agents, WhatsApp authorization/payment chasing automation, rich tarifario overlays, full in-network Derivation automation, every regional edge case.
