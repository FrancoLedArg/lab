# WhatsApp delivery of clinical lab reports: rules, health-data policy, and cost

Research for issue #4. Date of research: 2026-08-31.

**Verdict: viable in Argentina.** Meta's health-data restriction is *conditional on local law*, and the
condition does not fire in Argentina. But two things materially change the plan: (1) a shared
"one number for all labs" model is effectively ruled out by Meta's display-name rules, so WhatsApp is a
**per-lab onboarding step**, not a free platform feature; and (2) **the free-messaging window closes on
2026-10-01**, one month from this writing, which changes the cost model from ~free to per-message.

## A note on sources

`developers.facebook.com` was **unreachable from this environment** (WebFetch timeouts and `curl` exit 35/000
on every attempt — the host appears to be egress-blocked here). Claims that would normally cite the developer
docs are therefore cited to:

- Meta policy/legal pages that **were** reachable and quoted directly (`whatsappbusiness.com/policy`,
  `whatsapp.com/legal/business-terms`) — these carry the load-bearing policy answer;
- corroborating BSP/partner documentation (tyntec, 360dialog, Twilio, Wati, Vonage, Infobip, AWS), which
  restates Meta's rules.

Anything sourced only from the second bucket is marked **[verify]** and should be re-checked against Meta's
developer docs and rate card from an unblocked network before it is budgeted or built on.

---

## 1. THE BLOCKER QUESTION: does Meta permit sending medical/health information?

**Answer: yes, conditionally — and the condition is satisfied in Argentina.**

### The exact policy text

The restriction lives in the WhatsApp Business Messaging Policy, section **"3. Protect Data and Comply with Law"**.
Quoted verbatim from the live page:

> "Don't use WhatsApp for telemedicine or to send or request any health related information, if applicable
> regulations prohibit distribution of such information to systems that do not meet heightened requirements
> to handle health related information."

— [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/)
(`https://www.whatsapp.com/legal/commerce-policy` now 301-redirects here.)

This is **not a blanket ban on health data.** It is a conditional prohibition, and the condition is a
*renvoi to local law*: WhatsApp is off-limits for health information only where the applicable national
regulation forbids routing such data through systems lacking a heightened/certified handling regime.

### Does the condition fire in Argentina? No.

The clause is aimed at regimes like:

- **United States** — HIPAA, which requires a Business Associate Agreement. Meta will not sign one, and there
  are no WhatsApp audit logs of who accessed what
  ([HIPAA Journal](https://www.hipaajournal.com/whatsapp-hipaa-compliant/)).
- **France** — the *Hébergeur de Données de Santé* (HDS) certification mandate for hosting health data.

Meta enforces this directly at onboarding: the expansion of allowed medical-services verticals
**"does NOT apply to entities operating in the U.S. or France"** due to heightened health-data regulation, and
medical service providers in those two countries are auto-rejected during onboarding
([tyntec, Meta Commerce Policy FAQ](https://www.tyntec.com/helpcenter/docs/faqs/whatsapp-business/whatsapp-commerce-policy/what-industries-in-the-health-sector-are-allowed-on-whatsapp/)) **[verify]**.

**Argentina is not on that exclusion list**, and Argentine law imposes no HDS/HIPAA-equivalent
*certified-system* requirement. What it does impose is consent + confidentiality:

- **Ley 25.326 (Protección de Datos Personales)** classifies health data as *datos sensibles*. Art. 8 permits
  health establishments and health-science professionals to collect and process patient health data, subject
  to the principles of **professional secrecy**
  ([full text, OAS](https://www.oas.org/juridico/pdfs/arg_ley25326.pdf)).
- **Ley 26.529 (Derechos del Paciente / Historia Clínica)** requires strict confidentiality of the patient's
  sensitive data, and provides that anyone handling clinical documentation must keep due reserve
  **"salvo expresa autorización del propio paciente"** — i.e. patient authorization is exactly the lawful gate
  ([text, Argentina.gob.ar](https://www.argentina.gob.ar/normativa/nacional/ley-26529-160432/texto)).

So Argentine law **conditions** distribution on patient consent and confidentiality; it does not
**prohibit** distribution to non-certified systems. The Meta clause's trigger is therefore not met.

### Conditions we must satisfy anyway

Permitted-but-conditional. All of these are load-bearing:

1. **Explicit opt-in, held by us/the lab.** The Policy is unambiguous:
   > "You may only contact people on WhatsApp if: (a) they have given you their mobile phone number; and
   > (b) you have received opt-in permission from the recipient confirming that they wish to receive
   > subsequent messages or calls from you."

   and

   > "You are solely responsible for determining the method of opt-in, that you have obtained opt-in in a
   > manner that complies with laws applicable to your communications..."

   Meta also asks for **opt-in scoped by message category**, and says it "may also reactively evaluate a
   business' opt-in flows, including review of user feedback." ([Policy](https://whatsappbusiness.com/policy/))
   This opt-in must double as the Ley 26.529 *expresa autorización* — capture it at intake, per patient, with
   a timestamp, and store it.

2. **Meta disclaims all fitness for healthcare — the risk is ours.** From the WhatsApp Business Terms:
   > "We make no representations or warranties that our Business Services meet the needs of entities regulated
   > by laws and regulations with heightened confidentiality requirements for personal data, such as
   > healthcare, financial, or legal services entities."

   and

   > "Company must also secure all necessary rights, consents, and permissions (for example, opt-in) to share
   > its customers' contact and other personal data with WhatsApp, and to communicate with its customers via
   > the WhatsApp service using this information."

   — [WhatsApp Business Terms](https://www.whatsapp.com/legal/business-terms)

   This is a liability allocation, not a prohibition. But it means **no contractual comfort from Meta**: if a
   result leaks, that is the lab's exposure and ours.

3. **The Commerce Policy restriction is about *selling*, not messaging.** The Commerce Policy bars transacting
   in drugs, medical devices, and similar regulated goods, and applies to Catalogs/commerce experiences:
   > "If you use Catalogs, or provide any other commerce experiences to sell or otherwise facilitate the
   > exchange of goods or services prohibited by the Meta Commerce Policy, then we may prohibit you from using
   > some or all of the WhatsApp Business Services."

   Delivering a result report is not a commerce experience — **we sell nothing in the message**. Note the
   related rule that pharmacies may not use WhatsApp "for customer care use-cases that are not related to the
   administration of medical services"; a diagnostic lab delivering its own results *is* administration of a
   medical service, so it sits on the permitted side **[verify]**.

### Design consequence (recommended)

Keep clinical content **out of the template body**. The notification says only that a result is ready; the
result itself is the attachment or a link. Two options:

- **(a) Attach the PDF** — best UX, but the clinical data lands permanently in the patient's WhatsApp and in
  Meta's media store.
- **(b) Notification + link to an authenticated portal** — the message carries no health data at all, the
  Ley 25.326 sensitive-data surface stays on our infrastructure, and access is revocable and auditable
  (which Ley 26.529's integrity/restricted-access expectations favour).

**Recommend (b) as the default, (a) as a per-lab opt-in.** (b) also sidesteps the whole "is the PDF itself
health information in transit" question, since the link is content-free.

---

## 2. Which API: Cloud API direct vs. a BSP

| Option | Setup | Cost shape | Fit |
|---|---|---|---|
| **Cloud API direct from Meta** | We become a Tech Provider; build Embedded Signup ourselves | Meta rates at cost, no markup | Best long-run for a multi-lab SaaS |
| **360dialog** | Fast; resells Cloud API | ~€49/mo + ~$0.005/msg, advertises **no markup on Meta fees** | Cleanest passthrough BSP **[verify]** |
| **Twilio** | Fastest to first message; excellent docs | ~+$0.005/message, no fixed monthly | Good for a pilot |
| **Wati** | No-code inbox bundled | ~$49–99/mo, **~20% markup** on Meta charges | Wrong shape — we are the product, we don't need their UI |
| **Gupshup** | Strong volume rates in India/SEA | volume-based | Little advantage for Argentina |

Sources: [Kommunicate](https://www.kommunicate.io/blog/twilio-vs-360dialog-a-comparison/),
[EZContact](https://ezcontact.ai/en/blog/whatsapp-api-pricing-comparison-meta-twilio-360dialog-ezcontact/),
[getkanal BSP comparison](https://getkanal.com/blog/whatsapp-business-api-providers-compared) — all **[verify]**.

**Recommendation:** pilot on **Twilio or 360dialog** (days to first message, they absorb the Meta partner
paperwork), and treat direct Cloud API + our own Tech Provider Embedded Signup as the migration target once
per-lab onboarding volume justifies it. The message-send code is nearly identical; what differs is onboarding
plumbing, so this is a cheap bet to reverse.

---

## 3. Sending the PDF: attachment vs link, limits

- **PDF attachment is supported.** `application/pdf`, **max 100 MB** on the Cloud API; a file over the limit
  produces error `131052` "Media file size too big." Documents also cover txt/doc(x)/xls(x)/ppt(x) **[verify]**
  ([AWS End User Messaging](https://docs.aws.amazon.com/social-messaging/latest/userguide/supported-media-types.html),
  [Meta media docs, via search](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media)).
  Lab report PDFs are typically well under 1 MB, so the limit is a non-issue.
- **Two ways to supply the file:** upload it and use the returned media ID, or pass a publicly-reachable HTTPS
  link that Meta fetches. Uploading is preferable here — a public link to a patient's report is exactly the
  leak we are trying to avoid.
- **To attach a PDF *outside* the 24-hour window**, the template needs a **DOCUMENT header**. Media for a
  template header must be uploaded through a **resumable upload session**; the template-create call takes the
  returned handle at `components[i].example.header_handle[0]`, not the binary. That handle must be used within
  roughly 24 hours **[verify]** ([Vonage template management](https://developer.vonage.com/en/messages/guides/whatsapp-template-management)).
  Practically: the header document is a *sample* at approval time; the real per-patient PDF is bound at send time.

---

## 4. The 24-hour window and templates

- A **customer service window** opens when the patient messages the business and stays open **24 hours from
  the patient's most recent message**.
- **Business-initiated** messages outside that window **must** use a pre-approved template.
- **Does "your result is ready" qualify? Yes — as a Utility template.** Utility templates "enable businesses to
  follow up on user actions or requests" and are "typically triggered by user actions." A result notification
  follows directly from the patient's own act of ordering a test, which is squarely utility.
- **Utility content rules:** must stay **neutral** — no offers, no sales lines, no upsells, and no "hybrid"
  templates (e.g. a receipt that doubles as a coupon). A utility template carrying promotional wording is a
  common rejection cause and gets **recategorized to marketing**, which costs ~5x more.
- **Approval time:** typically **minutes**; Meta commonly returns a decision in ~1–5 minutes, with up to
  **24 hours** in the worst case **[verify]**
  ([Ominiflow](https://ominiflow.com/blog/meta-whatsapp-template-approval-guide),
  [Twilio](https://www.twilio.com/docs/whatsapp/tutorial/message-template-approvals-statuses)).
  Approved templates can be edited up to **10 times per 30 days / once per 24 hours** **[verify]**.

**Consequence:** template approval is *not* the onboarding bottleneck people assume. We author **one** utility
template with parameters (patient name, lab name, order ID) and reuse it across every lab. Per-lab approval
latency is essentially zero.

Suggested body — deliberately content-free:

> "Hola {{1}}, tu resultado de {{2}} ya está disponible. Podés verlo acá: {{3}}"

No diagnosis, no test values, no clinical terms in the template itself.

---

## 5. Cost in Argentina, and who pays

**A change lands in ~30 days and it matters.**

- Meta moved from conversation-based to **per-message pricing on 2025-07-01**.
- Since **2024-11**, non-template service messages inside the 24h window were **free**; from **2025-07** through
  **2026-09**, utility templates inside an open window were **also free**.
- **From 2026-10-01, both become billable.** Service messages will be charged at the same per-message rate as
  utility/authentication templates in each country. **Meta publishes exact October rates by 2026-09-01** —
  i.e. *tomorrow*, relative to this research
  ([Wati](https://www.wati.io/en/blog/whatsapp-service-message-pricing/),
  [SendPulse](https://sendpulse.com/blog/whatsapp-service-message-pricing),
  [Zendesk](https://support.zendesk.com/hc/en-us/articles/11113277351322-Announcing-upcoming-changes-to-WhatsApp-Business-messaging-pricing)) **[verify]**.

**Argentina rates** (third-party restatements of Meta's card; conversation-era framing in places, so treat as
order-of-magnitude only):

| Category | Rate (USD) |
|---|---|
| Utility | ~$0.0120 |
| Authentication | ~$0.0220 |
| Marketing | ~$0.0618 |
| Service | free until 2026-10-01, billable after |

([Ominiflow Argentina](https://ominiflow.com/whatsapp-api-pricing/argentina)) — **[verify against Meta's rate
card; do this after 2026-09-01 when the October numbers publish].**

**Order of magnitude:** ~**USD 0.012** per delivered result. 10,000 results/month ≈ **USD 120/month** in Meta
fees, plus BSP markup (~$0.005/msg on Twilio/360dialog ≈ +$50). This is **not** a cost that threatens the
business model — it is roughly a rounding error against per-test revenue, and cheaper than SMS.

**Who pays:** we do, to Meta/the BSP, and we should. Metered pass-through to labs adds billing machinery for
cents. Fold it into the subscription and treat WhatsApp volume as COGS; revisit only if a single high-volume
lab distorts the blended rate. Note the volume-tiered discounts on utility/authentication rates work in our
favour precisely *because* we aggregate all labs under our own account.

---

## 6. Numbers and verification — the real onboarding question

**Each lab realistically needs its own WhatsApp number and WABA. A single shared number is not a viable
platform shortcut.** This is the finding that most affects the roadmap.

Why the shared-number idea fails:

- **Display name rules.** A display name "should have a relationship with your business" and must show
  "consistent branding with external sources (e.g. a company's website or marketing)." Where the name
  represents a *different* business (agency, distributor, partner, parent), "the relationship between the
  business represented in the display name must be clearly established"
  ([360dialog display name guidelines](https://docs.360dialog.com/docs/waba-management/display-name-guidelines)) **[verify]**.
  One number cannot present as 40 different laboratories.
- **Patient trust.** A result notification arriving from an unknown SaaS brand rather than "Laboratorio X"
  reads as phishing — precisely the wrong signal for a message carrying a health result.
- **Blast radius.** One number means one quality rating. A single lab generating patient complaints
  (unwanted messages, wrong recipient) degrades deliverability **for every lab on the platform**. That is an
  unacceptable coupling for a channel delivering medical results.

The right shape — **Tech Provider + Embedded Signup**:

- We register as a **Tech Provider** and embed Meta's signup flow in our own onboarding UI. The lab creates/
  claims its WABA and phone number **without leaving our app**; our backend receives the WABA ID and phone
  number ID. Each lab keeps ownership of its WABA and number, and can revoke our access from Meta Business
  Suite at any time
  ([Telnyx](https://developers.telnyx.com/docs/messaging/whatsapp/embedded-signup/tech-provider),
  [Twilio Tech Provider guide](https://www.twilio.com/docs/whatsapp/isv/tech-provider-program/integration-guide),
  [360dialog](https://docs.360dialog.com/docs/hub/embedded-signup)) **[verify]**.
- The lab needs a **phone number not currently registered on WhatsApp** (a landline works; it can receive the
  OTP by voice call). This is the most common practical snag — labs routinely want to reuse the number their
  staff already run WhatsApp on, and cannot.
- **Meta Business Verification:** needed by the lab to lift limits and to get the display name shown properly.
  Unverified, the display name only appears in small text next to the number in contacts view, not in the chat
  list or chat thread ([Vonage](https://api.support.vonage.com/hc/en-us/articles/28026107711516-Why-is-my-WhatsApp-Messaging-Limit-still-at-250-and-Display-Name-not-visible-after-Business-Verification)) **[verify]**.

**Messaging limits** (relevant because they gate go-live volume):

- New business portfolios start at **250** business-initiated conversations / rolling 24h.
- With Business Verification + approved display name, start at **1,000** (reportedly **2,000** in some cases).
- Tiers then climb **10,000 → 100,000 → unlimited**, evaluated by Meta roughly every 6 hours, gated on quality
  rating and on having used at least half the current limit daily over the last 7 days.
- **Since 2025-10-07, limits apply at the Meta Business Portfolio level, not per phone number** — all numbers in
  a portfolio share one limit
  ([Meta messaging limits, via search](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits),
  [Bloomreach](https://documentation.bloomreach.com/engagement/docs/whatsapp-messaging-limits)) **[verify]**.

That last point is subtle and important: if labs' WABAs sit under **their own** portfolios, each lab gets its
own limit and its own quality rating — good isolation, but each must climb the ladder from 250. Verify how
the chosen BSP structures portfolio ownership before committing.

**Onboarding cost per lab:** realistically **1–3 business days**, dominated by the lab producing a spare phone
number and completing Meta Business Verification (document upload, Meta review) — not by anything we build.
Budget it as a **guided onboarding step with human help**, not a self-serve toggle.

---

## 7. Fallback

Email, and it should be the **primary** channel with WhatsApp as the accelerator — not the other way round.

Rationale: email has no opt-in gate to clear with Meta, no per-message cost, no quality rating to lose, no
24-hour window, no template approval, and no dependency on a third party that explicitly disclaims fitness for
healthcare. Degradation ladder:

1. **WhatsApp** utility template → link to authenticated portal (fastest, highest read rate).
2. **Email** with the same portal link (universal fallback; also the audit trail).
3. **Portal only** — patient logs in and fetches the report; always available, and the thing both channels
   point at anyway.

Because both channels carry only a **link**, not the report, the fallback is a routing decision rather than a
second delivery implementation. Build the portal + link-issuing first; WhatsApp then becomes a notification
transport we can add, remove, or fail over per lab without touching how results are stored or accessed.

---

## Recommendations

1. **Proceed with WhatsApp** — the health-data policy does not block us in Argentina. The clause is conditional
   on local law and Argentina imposes consent/secrecy, not certified-system requirements.
2. **Send a link, not the PDF, by default.** Keeps clinical data off Meta's infrastructure and out of the
   patient's chat history; makes access revocable and auditable.
3. **Capture per-patient WhatsApp opt-in at intake**, timestamped and stored — it discharges both Meta's opt-in
   rule and Ley 26.529's *expresa autorización*.
4. **Build the portal + email path first.** WhatsApp is a notification transport bolted on top, not the
   delivery mechanism.
5. **Plan per-lab WhatsApp onboarding (1–3 days)** via Tech Provider Embedded Signup. Do not promise labs a
   same-day WhatsApp switch-on.
6. **Re-check Meta's rate card after 2026-09-01** — October rates publish then, and the free-window era ends
   2026-10-01. Any cost model built on "utility inside the window is free" is already obsolete.
7. **Verify every [verify]-marked claim** against `developers.facebook.com` from an unblocked network before
   building.

## Open questions

- Exact Argentina per-message utility rate on Meta's **October 2026** card (publishes 2026-09-01).
- Whether the chosen BSP places each lab's WABA under the **lab's own** Meta Business Portfolio or under ours —
  determines whether messaging limits and quality ratings are isolated per lab.
- Whether Argentina's data-protection authority (AAIP) has issued any guidance specific to messaging health
  results over consumer platforms — not found in this pass.
- Whether a lab's existing WhatsApp Business *app* number can be migrated to the API without losing history.
