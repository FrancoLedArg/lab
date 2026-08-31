# MercadoPago: SaaS subscription (we get paid) + patient→lab payments (they get paid)

Research for [issue #3](https://github.com/FrancoLedArg/lab/issues/3). Blocks #13 (subscription plans) and #9.

Date checked: 2026-08-31. All facts below come from MercadoPago's own developer docs / product pages unless marked otherwise. Fee figures and doc URLs on this site move around; re-verify before committing to numbers.

---

## TL;DR

- **Flow 1 (lab pays us): MercadoPago Suscripciones works and is self-serve.** `preapproval_plan` + `preapproval`, hosted `init_point` for card capture, automatic monthly charge, built-in dunning (4 retries / 10-day window, auto-cancel after 3 failed installments), webhooks. Nothing here blocks v1.
- **Flow 2 (patient pays lab): both models work, and they are very different.** OAuth "Split de Pagos 1:1" is the correct marketplace model and is the *only* one that lets us take a commission — but it requires the lab to have a **KYC level 6** MercadoPago account and it requires us to register a Marketplace application. The "lab pastes their Access Token" model is ~a day of work and zero onboarding friction, but it means holding a full-power production credential per lab.
- **Stripe is not an option for an Argentine entity** — Argentina is not on Stripe's supported-countries list. That removes the most obvious alternative for flow 1.

---

## Flow 1 — Lab owner pays us a monthly subscription

### 1.1 Does MercadoPago do recurring subscriptions? Yes.

Product: **Suscripciones** (API resources: `preapproval_plan`, `preapproval`, `authorized_payment`).
Available in **Argentina**, Brazil, Chile, Colombia, Mexico, Peru, Uruguay.
Source: <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/overview>

Two integration shapes:

**a) With an associated plan** — you create the plan once, then attach subscribers to it.

```
POST https://api.mercadopago.com/preapproval_plan
  reason, back_url, payment_methods_allowed,
  auto_recurring: { frequency, frequency_type, repetitions,
                    billing_day, billing_day_proportional,
                    free_trial: {...}, transaction_amount, currency_id }
→ returns preapproval_plan_id

POST https://api.mercadopago.com/preapproval
  preapproval_plan_id, card_token_id, payer_email,
  status: "authorized", auto_recurring, back_url
```

Docs explicitly state: *"A subscription with an associated plan must always be created with its `card_token_id` and in status `Authorized`."* — i.e. with a plan, **we** must tokenize the card ourselves (Bricks / Checkout API card form).
Source: <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-configuration/subscription-associated-plan>

**b) Without a plan** — two sub-modes:
- *Authorized payment*: card captured at creation, engine schedules and charges automatically.
- *Pending payment*: `POST /preapproval` with `status: "pending"` and no card. The response contains an **`init_point`** — a MercadoPago-hosted link. Send the lab owner there, they pay and authorize with their own saved methods or as guest, and the subscription flips to authorized.
Sources: <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-configuration/subscription-no-associated-plan>, <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-configuration/subscription-no-associated-plan/pending-payments>

**Constraint that matters for #13:** the plan-based flow forces us to build a card form (PCI-scoped-ish, more work); the hosted `init_point` flow is the lazy path but is documented under *no associated plan*. If we want named plans **and** a hosted card form, the docs are ambiguous about whether `preapproval_plan`'s own `init_point` can be used to self-subscribe without us tokenizing. **Verify this against a sandbox app before designing the plan catalogue in #13.** Practical fallback: model plans in our own DB and create one `preapproval` per lab with the hosted pending-payment flow.

Billing knobs that shape what we can sell (#13): `frequency` + `frequency_type` (weekly / monthly / yearly only), `repetitions`, `billing_day` + `billing_day_proportional` (proration), `free_trial`, `transaction_amount`, `currency_id`. Notably absent: usage-based/metered billing, per-seat quantity, coupons/discount codes, tax lines. **Anything usage-metered or seat-based has to be computed by us and pushed as an amount change**, not modelled in MercadoPago.

### 1.2 Failed payments

From the authorized-payments doc: an installment that is declined enters **`recycling`** status and gets up to **4 retry attempts** inside a **10-day window** (shortened if the installment has an earlier expiry). After the 4th failure the installment lands in `processed` with a rejected payment attached. After **3 installments with rejected payments the subscription is cancelled automatically** and the seller is emailed.
Installment statuses: `processed`, `waiting for gateway`, `recycling`.
Source: <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-configuration/subscription-no-associated-plan/authorized-payments>

So MercadoPago gives us roughly a **30-day dunning grace period for free**. We do not need to build retry logic — we need to build *reaction* to it (soft-lock the account, email the lab).

### 1.3 Webhooks

Topics: `subscription_preapproval` (subscription created/updated), `subscription_authorized_payment` (a recurring charge happened/updated), `subscription_preapproval_plan` (plan created/updated), plus the generic `payment` topic.

Payload is a thin notification — `{ id, live_mode, type, date_created, user_id, api_version, action, data: { id } }` — so every handler must re-fetch the resource by id.

Authenticated via the **`x-signature`** header, format `ts=<timestamp>,v1=<hash>`: build a manifest from `data.id` + `x-request-id` + `ts`, HMAC-SHA256 with the webhook secret, compare to `v1`. Official SDKs ship a validator.
Source: <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/your-integrations/notifications/webhooks>

### 1.4 Self-serve end to end? Yes.

`POST /preapproval` (pending) → redirect to `init_point` → lab pays with card / account money / guest checkout → `back_url` returns them to us → `subscription_preapproval` webhook confirms `authorized`. No human in the loop on our side. Payment methods available to the subscriber include account money, credit/debit, credit lines, and even offline Rapipago / Pago Fácil, plus guest checkout without a MercadoPago account (overview doc, above).

### 1.5 Fees, payout timing, entity/tax

MercadoPago's Suscripciones product page lists AR pricing as a **choice of payout speed** (checked 2026-08-31):

| Money available | Commission |
|---|---|
| Instantly | 6.99% + IVA |
| 10 days | 4.49% + IVA |
| 18 days | 3.39% + IVA |
| 35 days | 1.49% + IVA |

Plus *"los costos pueden variar de acuerdo a los impuestos provinciales."*
Source: <https://www.mercadopago.com.ar/herramientas-para-vender/suscripciones>

The generic cost pages (<https://www.mercadopago.com.ar/ayuda/recibir-pagos-costos_220>, <https://www.mercadopago.com.ar/ayuda/33403>) return **403 to automated fetches** — a human should open them to confirm the table above and the QR/link rates for flow 2.

**Entity/tax on our side — flagged, not resolved.** To receive money we need a MercadoPago seller account tied to a CUIT. MercadoPago acts as a withholding agent (IVA / Ganancias / IIBB, and the debits-and-credits tax applies to the account), and we still owe an AFIP/ARCA invoice per subscription charge — MercadoPago does **not** invoice on our behalf; it is a PSP, not a merchant of record. **This one needs an accountant, not a docs read.** Don't let #13 assume MercadoPago handles invoicing.

---

## Flow 2 — Patient pays the lab

Requirement: money lands in the **lab's** account. Two credible models.

### Model A — Split de Pagos 1:1 (OAuth-connected sellers) — the real marketplace pattern

Product name: **Split de Pagos**, model **1:1** (one marketplace, one seller per payment).
Available in AR, BR, CL, CO, MX, PE, UY. Works with **Checkout Pro, Checkout API, and Checkout Bricks only** — no other product.
Sources: <https://www.mercadopago.com.ar/developers/en/docs/split-payments/split-1-1/overview>, <https://www.mercadopago.com.ar/developers/es/docs/split-payments/split-1-1/integration-configuration/create-configuration>

**Setup on our side:** create an application in *Tus integraciones* with solution "Pagos online", product Checkout Pro or Checkout API, and **integration model "Marketplace"**; configure a Redirect URL.

**Linking a lab (OAuth authorization-code flow):**

```
https://auth.mercadopago.com/authorization
  ?client_id=APP_ID&response_type=code&platform_id=mp
  &state=RANDOM_ID&redirect_uri=YOUR_URL          (PKCE supported, recommended)

POST https://api.mercadopago.com/oauth/token
  { client_id, client_secret, code, grant_type: "authorization_code",
    redirect_uri, test_token: false }
→ access_token, refresh_token, public_key, user_id (= collector_id)
```

- authorization `code` is valid **10 minutes**, single use
- seller `access_token` is valid **180 days / 6 months**; `refresh_token` also 6 months — **if we don't refresh in time the lab has to re-authorize.** A refresh cron is mandatory, not optional.
- tokens die on the seller's password change, on de-authorization, on fraud action, or if we delete the application. There is a de-authorization webhook we should subscribe to.

Sources: <https://www.mercadopago.com.ar/developers/en/docs/split-payments/additional-content/security/oauth/creation>, <https://www.mercadopago.com.ar/developers/en/docs/split-payments/additional-content/security/oauth/management>, <https://www.mercadopago.com.ar/developers/en/docs/split-payments/split-1-1/additional-content/security/oauth/introduction>

**Taking a commission** (answers Q7): charge with the *seller's* OAuth access token and add one field.

- Checkout Pro — `POST /checkout/preferences` with `"marketplace_fee": <amount>`
- Checkout API — `POST /v1/payments` with `"application_fee": <amount>`, `Authorization: Bearer {{oauth_access_token}}`

Order of deduction, quoted: *"The Mercado Pago commission is deducted from the amount received by the seller. In other words, the Mercado Pago commission is deducted first and the Marketplace commission is deducted from the remaining amount."*
Source: <https://www.mercadopago.com.ar/developers/en/docs/split-payments/split-1-1/integration-configuration/integrate-marketplace>

**Commission is a one-field change on an existing integration**, so building on Split now costs almost nothing extra and leaves the monetisation door open. That is the strongest argument for Model A.

**What the lab must do / requirements (Q5):**
- a MercadoPago **seller account at KYC level 6** (docs' wording) — this is the real onboarding friction; a lab with a casual personal account may need to upgrade
- the MercadoPago mobile app, to manage received payments
- click through our OAuth consent screen
Source: <https://www.mercadopago.com.ar/developers/en/docs/split-payments/split-1-1/prerequisites>

**Limitation worth knowing:** the **1:N model** (splitting one payment across several sellers) is *"available only to sellers with an advised portfolio who are in contact with the Mercado Pago commercial team."* Same for configuring commission release dates. We only need 1:1, so this doesn't block us — but it means anything fancier requires a sales conversation.

### Model B — Lab pastes their own credentials; we generate a link/QR per order

Mechanically: the lab copies their production **Access Token** (and Public Key) from *Tus integraciones*; for each order we `POST /checkout/preferences` with their token and hand the patient the returned **`init_point`** URL — rendered as a link, or encoded as a QR image (it's just a URL; no QR product needed).
Source: <https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing>

Note on the actual **QR Code product**: it is a different thing — static/dynamic/hybrid QR bound to a configured **store + POS**, aimed at in-person checkout, and the docs do not present it as a remote/online-order mechanism. Don't reach for it just to get a QR image.
Source: <https://www.mercadopago.com.ar/developers/es/docs/qr-code/overview>

**The catch:** MercadoPago's own credentials doc calls the Access Token a *"private application key that should always be used in the backend"* that *"should never be exposed"*, and says the Client Secret must be kept secure and inaccessible to any system user or intruder.
Source: <https://www.mercadopago.com.ar/developers/es/docs/your-integrations/credentials>
A pasted production Access Token is **unscoped and non-expiring by policy**: it can create payments, issue refunds, and read the lab's entire payment history — including payments unrelated to us. We would be storing N of those. If we are breached, every lab is breached.

### Concrete comparison

| | **A — Split 1:1 / OAuth** | **B — pasted credentials** |
|---|---|---|
| Money lands in lab's account | Yes | Yes |
| Lab onboarding | OAuth consent click, but needs **KYC 6** account | Copy/paste a token from a dashboard — no KYC gate from us, but a confusing, error-prone step for a non-technical lab admin |
| Our setup | Register Marketplace application, build OAuth callback + **token refresh job** | None |
| Credential we hold | Per-seller token, scoped to our app, **revocable by the lab**, expires in 6 months | Full-power production token, **not revocable except by the lab regenerating it**, no expiry |
| Commission | `marketplace_fee` / `application_fee` — one field | **Impossible.** We'd have to invoice separately |
| Reconciliation / visibility | Split sales reports, webhooks scoped to our app | We see only what we created; no clean separation |
| Blast radius if breached | Labs revoke our app | Every lab's full MercadoPago account |
| Build cost | ~a week (OAuth + refresh + de-auth webhook + re-link UX) | ~a day |

**Recommendation:** Model A. Model B's only real advantage is build time, and it trades that for the two things that are expensive to fix later — **no commission path** and **an unacceptable credential-custody posture**. The OAuth work is bounded and well documented. If we need something on screen this week, Model B is a defensible temporary shim *only* if we plan the migration, because switching later forces every lab through onboarding a second time.

---

## Sandbox / test story (Q8)

Same mechanism for both flows: **test users** created from *Tus integraciones → Cuentas de prueba*. Up to **15** per application, **cannot be deleted**, country fixed at creation, each gets a username/password and a 6-digit verification code. You need at minimum a *seller* test account, a *buyer* test account, and — explicitly called out for marketplace models — an *integrator* test account. Test cards are provided; test accounts can be seeded with fake money.
Source: <https://www.mercadopago.com.ar/developers/es/docs/subscriptions/additional-content/your-integrations/test/accounts>

Flow-specific notes:
- Checkout Pro preferences return a **`sandbox_init_point`** alongside `init_point`.
- OAuth token exchange takes a **`test_token`** boolean, so seller linking is testable end to end.
- Documented limitation: **Checkout Bricks integrations do not support test accounts.** If we pick Bricks for card capture in flow 1, our test story degrades — worth weighing against the hosted `init_point`.
- Also documented: while logged in as a test user, the *Test Credentials* and *Integration Quality* dashboard sections are inaccessible.
- **Not documented and worth probing early:** how time-dependent subscription behaviour (the monthly charge, the 4-retry recycling window) is exercised in sandbox. There is no described clock-advance facility. Assume we cannot fully rehearse dunning and design the account-suspension logic defensively.

---

## Should flow 1 go somewhere else?

**Stripe: no.** Argentina is not on <https://stripe.com/global>. Full-launch list is Australia, Austria, Belgium, Brazil, Bulgaria, Canada, Croatia, Cyprus, Czechia, Denmark, Estonia, Finland, France, Germany, Gibraltar, Greece, Hong Kong, Hungary, Ireland, Italy, Japan, Latvia, Liechtenstein, Lithuania, Luxembourg, Malaysia, Malta, Mexico, Netherlands, New Zealand, Norway, Poland, Portugal, Romania, Singapore, Slovakia, Slovenia, Spain, Sweden, Switzerland, Thailand, UAE, UK, US; India and Indonesia in preview. Argentina appears nowhere. An Argentine entity cannot open a Stripe account to charge Argentine businesses.

**Paddle / Lemon Squeezy (merchant-of-record): technically possible, wrong shape.** Paddle states it supports sellers "anywhere in the world with exception to sanctioned countries" and sells into 200+ countries (<https://developer.paddle.com/concepts/sell/supported-countries-locales/>, <https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle>). Their docs do not explicitly name Argentina either way — **ambiguous, would need to ask them.** But the shape is wrong for this buyer: an MoR charges a cross-border, typically USD transaction. Small Argentine clinical labs paying a foreign-currency card charge hit FX/tax friction and card-level restrictions that a domestic ARS charge simply doesn't have, and MoR pricing (~5%) is not obviously better than MercadoPago's 3.39–4.49% tiers. It also implies a foreign entity on our side.

**dLocal: wrong customer.** dLocal is built for *global* companies collecting *from* Latin America, sold with an enterprise/contract motion. There is no self-serve signup path, which kills it for a v1 where we want to be live this month.

**Verdict: stay on MercadoPago for flow 1.** The buyers are Argentine businesses paying in ARS; MercadoPago is the payment rail they already have, already trust, and can pay from with account money or an offline coupon. Every alternative trades that away for features we don't need. Revisit only if we ever sell outside Argentina.

---

## Open questions

1. **Does `preapproval_plan` expose its own hosted `init_point` for self-subscribe, or does using plans force us to tokenize the card?** This decides whether #13's plan catalogue lives in MercadoPago or in our own DB. Test in sandbox before designing.
2. **KYC level 6** — what does a typical small lab actually have to do to reach it, and how many will bounce off? This is the main adoption risk for Model A.
3. **Invoicing (AFIP/ARCA)** — MercadoPago is a PSP, not a merchant of record. Who issues the factura for each subscription charge, and is that automated? Accountant question.
4. **Confirm the fee table** by hand; the cost help pages block automated fetching.
