# 環 — MEGURI B2B onboarding / account bootstrap design — v2 (corrective)

> **Partly superseded by [`meguri-b2b-onboarding-design-v3.md`](meguri-b2b-onboarding-design-v3.md)**
> (DOT re-audit NOT_READY). v3 §2 lists which v2 sections are replaced; all others remain the baseline. This v2 text is otherwise kept unchanged.

Status: **design only, corrective revision.** No application code, no
Production change, no MAINLINE runtime change, no deploy, no migration, no
scheduler / credential / approval / arm / publication / live-account change.

| | |
|---|---|
| Supersedes | `docs/meguri-b2b-onboarding-design.md` (v1). v1 is kept unchanged as history, except for a one-line pointer at its top. |
| v1 audited at | `IKORABUagent` commit `d0af430b83e975735a06319d272832fe520f3477` |
| Audit result on v1 | DOT: **PASS_WITH_CORRECTIONS**. Corrections ONB-01 … ONB-10 |
| This revision | Applies ONB-01 … ONB-10 and the DOT Research Intelligence v1 compatibility conclusions |
| Requested outcome | DOT re-audit |

### 0.1 Sources of authority used in v2

| Source | Used for | Notes |
|---|---|---|
| DOT audit of v1 (ONB-01 … ONB-10) | every correction | Authoritative |
| DOT Research Intelligence v1 compatibility audit | §5 | **Authoritative for frozen v1 behaviour.** The `ri_*` structures, `collect(SourceSpec)`, freshness and relevance rules, and `suggestions_only` output are LAB / frozen assets. They are **not present in any branch of `takumitechno/Threads-` (19 branches checked at depth 1) or in `IKORABUagent`.** v2 relies on the audit's conclusions and does not invent column names. |
| `Threads-` @ `8590243` (code read, read-only) | §4, §5.7, §7, §8, §12 | Verified directly: membership query (`production/store.py` `list_accounts_for_user`, `get_account_role`), funnel catalogue (`production/funnel.py`), `price` handling (`production/funnel.py`, `production/fortune_qa.py` FQA-7), style readiness (`production/accounts.py` `style_profile` blocking item), generation fields (`production/store.py`: `style_profile_version`, `verified_fact_keys_json`) |
| `Threads-` `work/ai-unit-economics02a1-production-hardening` | §6 | `ai_usage_events`, `ai_cost_policies`, unknown-cost handling. Merged state on MAINLINE is unknown (§15 U-C1). |

### 0.2 Corrected summary

The business goal does not change: **eventually**, a new customer account
should be launched through configuration and onboarding, not custom
development.

v1 claimed more than the architecture supports. v2 states the following
plainly:

1. **The current architecture does not support arbitrary verticals through
   data alone.** Fortune-specific funnel goals and facts, fortune-coupled
   Writer / prompt / QA labels, an account-wide `price` key, code-package
   domains, and the two-account Research v1 restriction all block it (§12).
   A small set of common-core changes must land first.
2. **Research Intelligence v1 outputs suggestions only.** Onboarding adds an
   explicit, recorded selection step between Research and Planning. It never
   wires Research directly into the Writer (§5).
3. **"Active" is a product state, not authority.** Config approval, product
   activity, content approval, execution authority and armed state are five
   separate things (§3.2).
4. **Customer input is a claim.** Customer-submitted facts are
   CUSTOMER_ASSERTED until someone verifies them. Existing verified-fact
   readers see only a verified projection (§4).
5. **Generation binds to an immutable execution snapshot**, not just a config
   version number. Publication still re-checks STOP, revocation and the latest
   restrictions (§8).
6. **Approval is never inherited across a semantic change.** A fresh QA PASS
   never re-validates an old approval (§9).
7. **Monthly JPY is a desired limit / estimate, not a guaranteed cap** (§6).
8. **A database lock is not quiescence.** Config promotion uses an explicit
   operational-quiescence check (§3.6).
9. **Template defaults are not an accepted Style profile.** Readiness gets an
   explicit provenance-aware adapter and is never weakened silently (§5.7).
10. **SHADOW is an authorization boundary**, not a status label (§10).

The current two-account MVP is **independent** of this project (§13.1).

---

## 1. Change log from v1

| # | v1 location | v1 said | v2 says | Audit ID | v2 section |
|---|---|---|---|---|---|
| 1 | §6.2, §6.5 step 3–4 | packets → `content_plans` → Writer request | ri output is suggestions only. An explicit **ResearchSelection** record is the only path into Planning. Writer never reads ri packets directly. | ONB-01 | §5.1, §5.2 |
| 2 | §6.2, §6.5, §13.1 | new `research_candidates`, `research_packets`, `source_items`, `collection_runs` | **Removed.** Reuse the existing `ri_*` candidate / observation / packet / dedup structures. Onboarding adds only a profile adapter, a selection record, and a snapshot envelope. | ONB-02 | §5.3 |
| 3 | §6.4 | shared tenant-neutral source cache | **Removed.** Not implemented in v1. Moved to "not yet". All collection is account-scoped. | ONB-02 / RI compat | §5.4, §14 |
| 4 | §6.3 | `relevance.min_score: 0.55`, free freshness hours, cadence, budget knobs | v1 thresholds are fixed and kept verbatim. Freshness is limited to the existing v1 rule sets. Every profile field is marked COMPATIBLE / ADAPT / MISSING / CONFLICT. | RI compat | §5.5 |
| 5 | §6.7 | "then onboard a third account" | Research v1 supports **two accounts only**. A third account is MISSING and needs a separate, approved generalization. | RI compat | §5.5, §12 |
| 6 | §13.2 examples | membership on accounts 1–3 limits an agency editor to 1–3 | **Wrong under the current contract.** Visibility is org link ∪ membership. An org-role user sees every org-linked account. Strict allowlisting is a separate authorization-model change. | ONB-03 | §7.2, §7.3 |
| 7 | §13.1 | `ADD UNIQUE(account_id)` to `org_accounts` | No immediate UNIQUE. Run an inventory first (multi-org links, orphans, tests, authority and cost attribution). Ownership becomes a separate explicit record. No history rewrite. | ONB-03 | §7.4 |
| 8 | §5.3 | ACTIVE ⇔ `status = active` via `arm()`; "arm() is the single place where both change" | Five separate concepts. Lifecycle ACTIVE never arms, never grants execution authority, and never renews it. `armed ⇒ ACTIVE`, not the reverse. | ONB-04 | §3.2–§3.4 |
| 9 | §3.13 `attest.facts_accurate`; §4.4 `verification_level` | customer attestation writes `account_verified_facts` with `customer_attested` | Customer input → fact **event** (CUSTOMER_ASSERTED) → verification → **verified projection**. `account_verified_facts` holds only VERIFIED, unexpired, unrevoked facts. No new column for old readers to ignore. | ONB-05 | §4 |
| 10 | §4.4 | `offer.<id>.*` free-form keys; fortune aliases for all | Stable `offer_id` + offer revision + typed common facts + small typed extensions. Per-plan selected offer + exact fact snapshot. Aliases only where semantics match. **`price` is not aliased.** | ONB-05 / offer model | §4.3–§4.6 |
| 11 | §10.2 | stamp `config_version` on plans and content | Immutable **ExecutionSnapshot** with config hash, persona, selected offer + fact snapshot, research envelope, style and semantic versions, account identity, and policy versions. Publication re-checks live state separately. | ONB-06 | §8 |
| 12 | §9.5 | after a change, re-QA; "passes keep their approval" | A semantic change invalidates approval. QA can only decide eligibility for **re-approval**. A restrictive-only context change is a publication-time gate and never re-authorizes. | ONB-07 | §9 |
| 13 | §3.12, §4.2 CostPolicy, G9, E070/E120 | monthly JPY cap, "never overspend silently" | Current capability: usage ledger, daily call caps, unknown-call handling, deterministic mode. Monthly JPY is a **desired limit / estimate**. A hard cap is a future Cost Governor project. | ONB-08 | §6 |
| 14 | §5.4 | `BEGIN IMMEDIATE`; "queued and never applied while NIGHT holds the DB" | A DB lock serializes writes only. Promotion requires an explicit operational-quiescence predicate over publication, provider claims, parts, ambiguity, reconciliation, batches, armed state and incidents. | ONB-09 | §3.6 |
| 15 | §8.4 G4, E050 | "or the customer accepted a template baseline style" | Template defaults ≠ accepted Style profile. Style evidence has provenance classes. Readiness changes go through an explicit adapter that needs its own approval. No fake research posts. TOPIC and STYLE stay separate. | ONB-10 | §5.6–§5.8 |
| 16 | §9.1–§9.3 | SAFE / REVIEW / RESHADOW; "restrictive ⇒ SAFE whatever the field" | SAFE_CANDIDATE / REVIEW_REQUIRED / RE_SHADOW_REQUIRED with impact analysis. Mixed changes are classified by their most demanding part. | change classification | §11 |
| 17 | §8.2 | "factory refuses when lifecycle ≠ ACTIVE"; shadow may request insights scope | SHADOW is a separate execution principal with no publish credentials, no live queue path, no activation path, and no execution-authority minting. | SHADOW boundary | §10 |
| 18 | §16 phase 11 | "third vertical by config only" as the final phase | CAREER no-code test: **NOT RUN / NOT PASS**. Blockers are listed. The test runs only after the common-core changes, with no test-only shim. | CAREER | §12 |
| 19 | §8.3, §8.5 | 72 h / 3 cycles / 10 posts / 14 days | These are **proposed onboarding SHADOW and ramp parameters (future)**. They are not gates on the current two-account MVP. | MVP scope | §13.1 |
| 20 | §16 | UI at phase 8 | Build order starts with contracts, compiler, snapshot, facts, ownership, SHADOW boundary, adapters and parity. **UI comes last.** | build order | §13.2 |
| 21 | §3.4 `account.handle unique_global` | handle is the identity | Identity = `(platform, provider-native account ID)`. Handle is mutable metadata. | tenant model | §7.5 |

Sections of v1 that v2 does not restate (the form UX, most field tables,
templates, error catalogue, and the visibility table) remain the design
baseline, **with the amendments listed in §17**.

---

## 2. Corrected domain model

### 2.1 Classification legend

| Tag | Meaning |
|---|---|
| **REUSE** | Existing MAINLINE or frozen-LAB structure used as is. No contract change. |
| **ADAPT** | Existing structure, reached through a new adapter or projection. The underlying contract is unchanged. Where the adapter itself changes a readiness or authority rule, it says so and needs its own approval. |
| **NEW** | New onboarding-owned structure. Additive. Ships dark. |

### 2.2 Objects

| Object | Tag | Backing structure | Purpose / key rule |
|---|---|---|---|
| Organization | REUSE | `organizations` | Contracting customer. MVP: the operator creates it (`tenant-onboard`). |
| User / org role | REUSE | `users(org_id)`, `user_roles` | Org role (admin/editor/viewer). **Semantics as of today: see §7.2.** |
| Delegated account membership | REUSE (semantics documented) | `user_account_memberships` (0024) | Overrides the org role on that account. It does **not** hide other org-linked accounts (§7.2). |
| Account ownership | NEW (after inventory) | `account_ownership` (append-only, §7.4) | One operating account → one owning org. Distinct from access links. |
| ChannelAccount | ADAPT | `production_accounts` + identity mapping (§7.5) | Identity = `(platform, provider_account_id)`. `handle` is metadata. |
| ChannelConnection | REUSE | credentials (0014) by `purpose` | Publish-purpose credentials are never reachable from SHADOW (§10). |
| OnboardingSubmission | NEW | `onboarding_submissions` | Draft answers. Never read by runtime. |
| Field catalogue | NEW (data) | versioned data file | Declares field type, kind, defaultability, change class and destination. No executable validation (§14). |
| Vertical template | NEW (data) | versioned data file | Preferences and policy defaults only. **Never facts. Never an accepted Style profile.** |
| Compiler | NEW (pure function) | code, written once | `compile(submission, template@v, catalogue@v, floor@v) → AccountConfig candidate + FactAssertions`. No network, no DB writes. |
| AccountConfig version | NEW | `account_config_versions` (append-only) | Full config document + hash. |
| Legacy config projection | ADAPT | `production_accounts.config_json` | Projection of the **promoted** version's persona/planning/funnel sections, so existing readers work unchanged. Written only by the promotion step (§3.6). |
| Offer | NEW | `offers` (stable `offer_id`) + `offer_revisions` | §4.3 |
| Fact event | NEW | `fact_events` (append-only) | Customer assertions, verifications, rejections, expiries, revocations (§4.2) |
| Verified fact projection | ADAPT | `account_verified_facts` (existing reader table) | Contains only VERIFIED ∧ unexpired ∧ unrevoked facts. Written only by the projector (§4.2). |
| Research profile adapter | ADAPT | config → v1 profile parameters + `SourceSpec`s | v1 contract frozen (§5.3) |
| ri candidates / observations / packets / dedup | REUSE | `ri_*` (frozen v1) | Account-scoped. Suggestions only. |
| ResearchSelection | NEW | `research_selections` | The explicit, authorized boundary from suggestion to plan (§5.2) |
| Style evidence | ADAPT | `account_research_posts` → `account_style_profiles`, semantic style | STYLE only. Never fed by ri. Provenance classes in §5.7 |
| Style readiness adapter | ADAPT (**readiness-contract change; separate approval**) | wraps `accounts.validate` `style_profile` item | §5.8 |
| ExecutionSnapshot | NEW | `execution_snapshots` (immutable) | §8 |
| Plans / content / generations | ADAPT | `content_plans`, `content_versions`, generation records | Gain a `snapshot_id` reference. Existing `style_profile_version` and `verified_fact_keys_json` stay. |
| Approval | ADAPT | `production/workflow.py` (`content_hash`-bound) | Additionally bound to `snapshot_hash` and `account_id`. §9 |
| Execution authority / arm / STOP | REUSE | existing TTL / generation-bound authority, `accounts.arm()`/`disarm()`, STOP | **Unchanged.** Onboarding never writes them (§3.2). |
| Operational quiescence | NEW (read-only predicate) | reads publication, recovery, reconciliation, batch, arm and incident state | §3.6 |
| Cost | REUSE + NEW (estimate only) | `ai_usage_events`, `ai_cost_policies`, Writer daily limits | Desired monthly JPY is stored as **intent**, not enforcement (§6) |
| SHADOW lane | NEW | separate principal, tables and credential scope | §10 |

---

## 3. Corrected lifecycle

### 3.1 Two independent axes

v1 used one state machine for both "where is this customer in onboarding"
and "may this account publish". v2 splits them:

- **Product lifecycle** (`lifecycle_state`): onboarding and customer-facing
  progress. **Grants nothing.**
- **Execution controls** (existing, unchanged): execution authority, armed
  state, STOP, content approval. **Only these permit a publication.**

### 3.2 Five concepts (ONB-04)

| Concept | Question it answers | Set by | Stored in | It never means |
|---|---|---|---|---|
| **CONFIG_APPROVED** | Has this exact config version been accepted? | customer admin + operator, per change class (§11) | `account_config_versions.status = approved` + approver/time | that it is promoted, that the product is active, or that anything may publish |
| **PRODUCT_ACTIVE** | Is the customer's account in operation (運用中)? | operator activation in MVP (§3.4) | `lifecycle_state = ACTIVE` | armed, authority granted, approval bypassed, STOP ignored, or authority renewed |
| **CONTENT_APPROVED** | Did an authorized approver approve this exact content for this account under this snapshot? | approver (existing workflow) | approval record bound to `(account_id, content_id, content_hash, snapshot_hash)` | approval of any other version, account, offer or snapshot (§9) |
| **EXECUTION_AUTHORITY** | Is there a current, finite, unexpired grant to perform live work? | existing operator path (TTL / generation-bound), unchanged | existing authority records | anything permanent. It expires on its own TTL and is never minted or extended by onboarding. |
| **ARMED_STATE** | Is the account's publish gate armed? | existing `accounts.arm(confirm_handle)` / `disarm()` | existing `status` | product activity, or authority to publish without the other conditions |

A live publication requires all of the following, evaluated **at publication
time**:

```
PRODUCT_ACTIVE
∧ ARMED_STATE
∧ EXECUTION_AUTHORITY valid now (TTL, generation)
∧ ¬STOP
∧ CONTENT_APPROVED for (account_id, content_hash, snapshot_hash)
∧ snapshot inputs not revoked / expired / superseded semantically (§8.4)
∧ latest restrictive policy passes (§8.4)
∧ existing 3-key rule (authorized publisher, allow_live)
```

Invariants:

- `ARMED ⇒ lifecycle_state = ACTIVE` (a necessary condition only).
- `lifecycle_state = ACTIVE` does **not** imply ARMED. An ACTIVE account is
  normally disarmed between finite execution windows.
- No lifecycle transition calls `arm()`, mints authority, or extends a TTL.
- Leaving ACTIVE (PAUSED, SUSPENDED, OFFBOARDED) first requires `disarm()`
  and the quiescence check (§3.6). Pausing is a safe direction: `disarm()`
  is always allowed immediately. The *lifecycle* label changes once
  quiescence holds.
- STOP overrides every state. Lifecycle never clears STOP.

### 3.3 Product lifecycle states

Unchanged from v1 §5.1 in shape: DRAFT → SUBMITTED → CONFIGURED → VALIDATED
→ SHADOW → REVIEW_REQUIRED → APPROVED → ACTIVE, plus NEEDS_INPUT, PAUSED,
SUSPENDED and OFFBOARDED. The meanings change:

| State | Corrected meaning |
|---|---|
| CONFIGURED | the compiler produced a candidate config. Fact assertions are recorded as CUSTOMER_ASSERTED. |
| VALIDATED | automated checks passed. **Facts are not verified by validation**: reachability ≠ correctness. |
| SHADOW | the SHADOW principal may run for this account (§10). |
| REVIEW_REQUIRED | shadow evidence is ready for human review |
| APPROVED | config version approved **and** facts used by enabled roles verified (§4) |
| ACTIVE | product in operation. **No authority.** Execution still needs the existing operator path. |

### 3.4 Transition changes vs v1 §5.2

| Transition | v1 | v2 |
|---|---|---|
| APPROVED → ACTIVE | "operator executes `arm()`" in the same step | Operator sets `lifecycle_state = ACTIVE` after re-checking gates. **Arming is a separate, later, existing operator action** with its own confirmation and TTL. |
| ACTIVE → PAUSED | `disarm()` | `disarm()` immediately (safe), then the lifecycle label changes once quiescence holds (§3.6) |
| PAUSED → ACTIVE | "customer resume" re-checks G2/G9/G13 | the customer may *request* resume. The lifecycle returns to ACTIVE after re-checks. **Execution authority is not restored**: it was finite and has expired or must be re-granted by the existing path. |
| SUSPENDED → prior | "never straight back to ACTIVE without re-arm" | the prior state is ≤ APPROVED. Re-activation follows APPROVED → ACTIVE, and arming remains separate. |

### 3.5 Mapping to existing `status`

| lifecycle_state | `status` may be | Notes |
|---|---|---|
| DRAFT … APPROVED, NEEDS_INPUT, SHADOW, REVIEW_REQUIRED | `draft` / `ready` | Never `active`. Enforced in the store method that changes lifecycle and in `arm()`'s precondition. Adding that precondition to `arm()` is a MAINLINE change, tracked as a dependency (§13.2 step 6). |
| ACTIVE | `ready` or `active` | `active` only through the existing `arm()` |
| PAUSED, SUSPENDED, OFFBOARDED | `ready` / `draft` | `disarm()` first |

### 3.6 Operational quiescence (ONB-09)

`BEGIN IMMEDIATE` and the single-writer lock serialize **database writes**.
They say nothing about work already outside the database: an HTTP request to
the provider, a claimed container, a half-posted thread, or a batch between
steps. v2 never treats a lock as proof that work has stopped.

**Predicate** `operational_quiescence(account_id) → {quiescent, blockers[], evidence_ts}`
is read-only. Each source is inspected independently, and **unknown evidence
counts as not quiescent** (fail closed):

| # | Check | Existing evidence source (to be bound in the adapter) | Blocks when |
|---|---|---|---|
| Q1 | in-flight publication | publication records in a pre-terminal state | any |
| Q2 | provider claim | claimed provider containers / creation IDs not yet confirmed or abandoned | any |
| Q3 | pending / partial parts | multi-part / self-reply thread parts with some published and some not (0019) | any |
| Q4 | ambiguous publication | publication-recovery state (0013) not resolved | any. **Only an operator resolves this.** |
| Q5 | reconciliation | external reconciliation runs (0023) or deletion tombstones (0022) open | any open run |
| Q6 | active finite batch | NIGHT batch (0017) / loop-runner window open for the account | any |
| Q7 | armed state | `status = active` | armed |
| Q8 | execution authority | an unexpired authority grant covering the account | any unexpired grant |
| Q9 | incidents / recovery | open incident, kill switch, recovery procedure | any |
| Q10 | scheduled approved work inside the change's impact window | approvals + schedule | not a blocker. **Reported as impact** for §11 classification. |

**Protocol for any config promotion that can affect execution:**

1. **Admission fence.** Record `change_pending(account_id, version)`. While it
   is set, the existing authority path refuses to grant **new** execution
   authority for the account. Implementing this refusal is a MAINLINE
   dependency and needs its own approval. The fence does not touch work that
   is already admitted.
2. **Drain by evidence, not by time.** Evaluate the predicate. If it is not
   quiescent, wait for natural completion or operator action. Nothing is
   killed or self-healed.
3. **Apply.** In one DB transaction: re-evaluate the predicate (TOCTOU), then
   promote the version pointer, write the legacy projection and append audit.
   If the re-check fails, abort and keep the fence.
4. **Release** the fence.

Exceptions:

- **Pure restrictions** that only narrow future admission (pause, disarm,
  add a banned term, mark an offer unavailable, lower a daily cap) take effect
  **at admission and publication time** without waiting for quiescence.
  They never retract an already-running provider call. Q1–Q4 work still
  finishes or is resolved through existing recovery.
- Onboarding writes for accounts that never left SHADOW need only Q9.

---

## 4. Corrected facts model (ONB-05, offer model)

### 4.1 Three categories

| Category | Meaning | Visible to existing verified-fact readers (Writer, QA, funnel) |
|---|---|---|
| **CUSTOMER_ASSERTED** | the customer says so, with actor and time | **No** |
| **VERIFIED** | an authorized verifier checked it against provenance or evidence | **Yes**, through the projection only, while unexpired and unrevoked |
| **REJECTED / EXPIRED / REVOKED** | the verifier refused it, its validity ended, or it was withdrawn | **No.** Removal from the projection is immediate. |

Templates and the compiler **cannot create VERIFIED facts**. The field
catalogue enforces `kind: fact ⇒ defaultable: false`, and the fact store
accepts a VERIFIED event only from a verifier principal (operator in MVP).

### 4.2 Flow

```
customer input (STEP 6/7, attestation)
   │ compile
   ▼
fact_events  [ASSERTED]  (append-only, provenance, asserted_by/at)
   │ verifier action (operator in MVP), with evidence ref
   ▼
fact_events  [VERIFIED | REJECTED]
   │ projector (single writer, deterministic)
   ▼
account_verified_facts   ← existing readers unchanged; contains ONLY active VERIFIED facts
   ▲
   └─ expiry job / revocation event → projector removes the row; impacted approvals invalidated (§9)
```

- The projector is the **only** writer of `account_verified_facts` for
  onboarding-managed accounts. Old readers ignore unknown columns, so v2 does
  **not** add a `verification_level` column. Old readers only ever see facts
  that are already verified and active.
- A verifier sees the asserted value, provenance and evidence. Verifying
  creates a new event. It never edits the assertion.
- **Automated checks are not verification.** URL reachability, https and
  shortener checks are recorded as `check_events`. They can block, but they
  cannot verify.
- Allowing some fact types to be verified by "customer admin + automated
  check" without an operator would be an **authority expansion**. It is out
  of scope and needs its own design.

`fact_events` design sketch (not a migration):

```
fact_events(
  event_id, account_id, offer_id NULL,      -- NULL = account/org-level fact
  offer_revision NULL,
  fact_type,                                -- from the typed catalogue (§4.4)
  value_json,                               -- typed per fact_type
  event_kind,                               -- ASSERTED | VERIFIED | REJECTED | EXPIRED | REVOKED | SUPERSEDED
  status_after,                             -- CUSTOMER_ASSERTED | VERIFIED | REJECTED | EXPIRED | REVOKED
  source_kind, source_ref,                  -- customer_form | evidence_upload | operator_review | system_expiry …
  asserted_by, asserted_at,
  verified_by NULL, verified_at NULL,
  revision,                                 -- per (account_id, offer_id, fact_type)
  valid_from NULL, valid_until NULL,        -- expiry
  revoked_by NULL, revoked_at NULL, reason NULL,
  supersedes_event_id NULL
)  -- append-only; UPDATE/DELETE refused by trigger
```

### 4.3 Offer identity

| Element | Rule |
|---|---|
| `offer_id` | stable, opaque, account-scoped. Never reused. Retiring an offer keeps the id. |
| `offer_type` | one of a small closed set from the catalogue: `own_product`, `own_service_booking`, `affiliate`, `job_posting`, `lead_magnet`, `inquiry`. Fortune's 無料鑑定 is `lead_magnet` / `own_service_booking` + a legacy alias (§4.6). |
| `offer_revision` | increments when any **verified** fact of the offer changes. A plan binds `(offer_id, offer_revision)` plus the fact snapshot. |
| Readiness | derived, never stored. Every fact required for the offer type and the plan's role is VERIFIED, inside its validity window, with `availability = accepting`. |

### 4.4 Common typed facts (smallest set)

| Fact type | Value type | Required for conversion | Notes |
|---|---|---|---|
| `goal` | enum from **catalogue data** (not a Python constant) | yes | Replaces the fortune-only `PRIMARY_GOALS` as the source of allowed values (§12 C1) |
| `destination_url` | url | yes | "No URL that is not here may be written" (existing rule, now per offer) |
| `availability` | `{status: accepting|paused|ended}` | yes (must be `accepting`) | |
| `validity_window` | `{start?, end?}` date range | when posts mention a period or deadline | Fact expiry is enforced by `valid_until` |
| `application_method` | text | yes | "Do not invent steps" |
| `provider` | text | when a post names who provides it | |
| `price` | `{amount, currency: JPY, tax: incl|excl, conditions?}` | only when the plan's role allows mentioning price | **Offer-scoped.** Never account-wide (§4.6). |

### 4.5 Typed extensions (only when needed)

Declared in catalogue data with the same closed value types (enum, url, text,
money, money_range, date, date_range, bool). There is no free-form key/value
store and no executable validation.

| Offer type | Extension facts |
|---|---|
| `affiliate` | `affiliate_network` (text), `partnership_status` (enum `approved|applied|none`; CTA only if `approved`), `advertiser_restrictions` (text) |
| `job_posting` (CAREER) | `employment_type` (enum), `salary_range` (`{min, max, currency, period}`), `eligibility_requirements` (text) |
| `own_product` with legal notice | `legal_notice_url` (url, org-level) |

Account/org-level facts (`offer_id = NULL`): `operator_name`,
`pr_disclosure_label`, `legal_notice_url`, and existing experience / case /
voice facts (`personal_experience`, `client_case`, `testimonial`, …). These
keep their existing supply classes.

Every fact, common or extension, carries status, source/provenance,
asserted actor/time, verified actor/time, revision, expiry and revocation.

### 4.6 Writer scope and legacy aliases

**Per plan**, the snapshot (§8) binds `selected_offer_id`, `offer_revision`
and the **exact fact snapshot** (event ids + value hashes) of that offer
only, plus the account-level facts the plan's role needs. The Writer adapter
gives the Writer **only those facts**. It never gives the Writer every offer's
facts.

Legacy aliases, for the existing fortune account only, where the semantics
are identical:

| Typed fact (selected offer) | Legacy key the existing Writer/QA reads | Alias safe? |
|---|---|---|
| `destination_url` | `funnel_destination_url` | yes |
| `availability.status = accepting` | `free_reading_available = true` | yes, for the 無料鑑定 offer only |
| `application_method` | `free_reading_application_method` | yes, 無料鑑定 offer only |
| `provider` | `free_reading_provider` | yes, 無料鑑定 offer only |
| `goal` ∈ fortune values | `primary_threads_goal` | yes, only for values in the current fortune enum |
| `price` (offer-scoped) | `price` (account-wide, `OTHER_FACT_SUPPLIES`, FQA-7) | **No.** An account-wide `price` lets any post on the account state a price for any offer. The existing A1 `price` row stays as is for A1 only. The projector never emits an account-wide `price` from an offer-scoped fact. |

The adapter writes alias keys **into the per-plan fact view** that the Writer
receives. It does not write them as extra rows. A1/A2 parity (§13.2 step 8)
proves the existing readers see identical facts.

---

## 5. Research Intelligence v1 compatibility (ONB-01, ONB-02) and Style readiness (ONB-10)

### 5.1 Authority chain (ONB-01)

```
Research Intelligence v1 (frozen; suggestions_only)
   │  account-scoped ri_* candidates / observations / packets
   ▼
REFERENCE / SUGGESTION OUTPUT          ← read-only to everything downstream
   │
   │  ResearchSelection (NEW): an explicit, recorded, authorized act
   │    who: operator or an authorized planning principal for this account
   │    what: packet_id + item refs (+ packet hash)
   │    for: plan_id, account_id; under snapshot_id
   ▼
Planning (existing planner; reads the selection, never ri_* directly)
   ▼
Writer (existing guards; receives selected angles/refs via the plan snapshot)
```

- Without a ResearchSelection row, Planning behaves exactly as it does today.
- The Writer never queries `ri_*`. The research-leak and copy guards stay.
- **Automatic Research → Planning** (selection without a human or an
  authorized policy) is a **separate authority-expansion feature**. It needs
  its own design, tests and approval. It is not part of onboarding.
- The frozen v1 contract is not modified.

### 5.2 ResearchSelection (NEW)

```
research_selections(
  selection_id, account_id, packet_id, packet_hash, item_refs_json,
  selected_by, selected_at, selection_basis,      -- operator_manual | (future) policy_id
  plan_id NULL, snapshot_id NULL, revoked_at NULL
)
```

Guards: `selection.account_id = packet.account_id = plan.account_id`. A
selection can be revoked before plan generation. After generation it is part
of the immutable snapshot.

### 5.3 Source of truth (ONB-02): REUSE / ADAPT / NEW

| Onboarding concept | Tag | Backing |
|---|---|---|
| Candidates | **REUSE** | `ri_*` candidate structure |
| Observations | **REUSE** | `ri_*` observation structure |
| Packets | **REUSE** | `ri_*` packet structure (account-scoped) |
| Deduplication | **REUSE** | `ri_*` dedup |
| Source collection | **REUSE** | `collect(SourceSpec)` source adapters |
| AI enrichment | **REUSE** | v1 enrichment, which runs after deterministic packet handling and **does not mutate packets** |
| Account research profile | **ADAPT** | pure adapter `ri_profile_from_config(snapshot) → (v1 profile parameters, [SourceSpec])`. Its output must be exactly what v1 accepts today. |
| Selection boundary | **NEW** | `research_selections` (§5.2) |
| Research envelope in snapshot | **NEW** | references only (packet ids, hashes, selection ids) inside `execution_snapshots` |
| Shared source cache | **not built** | §14 |
| Duplicate canonical candidate / packet / source tables | **not built** | v1 `research_candidates`, `research_packets`, `source_items`, `collection_runs` are withdrawn |

Exact `ri_*` table and column names come from the DOT inventory (§15 U-R1).
v2 deliberately does not guess them.

### 5.4 Preserved DOT conclusions (frozen v1)

| # | Conclusion | v2 consequence |
|---|---|---|
| R1 | Third-account support is **not** generic | No third account through onboarding until a separate, approved generalization (§12 C6) |
| R2 | Source adapters use the existing `collect(SourceSpec)` model where applicable | Onboarding selects and parameterizes SourceSpecs. A new source **type** is code, reviewed separately, never added by onboarding. |
| R3 | v1 freshness rules ≠ arbitrary onboarding freshness configuration | The form may offer only the existing v1 rule sets. Arbitrary hours or days are MISSING. |
| R4 | v1 relevance thresholds are fixed and ≠ the proposed 0.55 | 0.55 withdrawn. v1 thresholds used verbatim. |
| R5 | AI enrichment runs after deterministic packet handling, not as packet mutation | Onboarding never writes into packets. Account angles live in enrichment or selection, outside the packet. |
| R6 | A shared source cache is **not** implemented | Removed from design |
| R7 | Packets are account-scoped | COMPATIBLE. All guards keyed on `account_id`. |
| R8 | Current output is `suggestions_only` | §5.1 selection boundary |
| R9 | Direct Writer authorization is a CONFLICT / future authority expansion | Not designed here |

### 5.5 Field compatibility matrix

Legend: **COMPATIBLE** = v1 supports it as is · **ADAPT** = reachable
through the profile adapter without changing v1 · **MISSING** = v1 has no
equivalent, so the field is hidden or disabled in the form until a separate,
approved feature exists · **CONFLICT** = contradicts the frozen v1 contract
or a safety boundary, so it is withdrawn.

Anything the DOT audit has not confirmed as supported is marked MISSING.

| v1 profile / form field | Status | Treatment in v2 |
|---|---|---|
| `account_id` scoping | COMPATIBLE | R7 |
| packets per account | COMPATIBLE | R7 |
| `topics[]` (labels) | ADAPT | mapped into the v1 profile parameters for the two supported accounts |
| `topics[].weight` | ADAPT | only if v1 takes weights. Otherwise used **downstream in planning**, not in ri (U-R2) |
| `topics[].intent` (news / evergreen) | ADAPT | mapped to existing v1 freshness rule set (R3) |
| `topics[].subtopics` | ADAPT | folded into keywords if v1 accepts them. Otherwise MISSING (U-R2) |
| `include_keywords` | ADAPT | via SourceSpec query parameters (R2) |
| `exclude_keywords` / `exclude_topics` | ADAPT | via deterministic v1 exclusion if present. Otherwise a **planning-side filter on selection**, never a packet mutation (U-R2) |
| `entities_watch` | MISSING | hidden |
| `sources[].adapter` selection | ADAPT | existing SourceSpec types only (R2) |
| `sources[].allow_domains` / `deny_domains` | MISSING until DOT confirms SourceSpec support (U-R2) | `research.blocked_sources` hidden or disabled |
| `research.preferred_sources` free URLs | MISSING | only existing source types are selectable |
| `freshness.{news_max_age_hours, default_max_age_days}` arbitrary | **CONFLICT** (R3) | withdrawn. `research.freshness` offers only labels that map 1:1 to v1 rule sets |
| `cadence` (collect 3x/week…) | MISSING | collection cadence is scheduler-owned. Onboarding does not modify the scheduler. `research.update_frequency` hidden. |
| `relevance.min_score: 0.55` | **CONFLICT** (R4) | withdrawn |
| `relevance.method = deterministic_first` | COMPATIBLE | v1 order (R5) |
| `relevance.llm_classify` as a packet stage | **CONFLICT** (R5) | enrichment only, after deterministic handling, non-mutating |
| `budget.max_items_per_cycle` / `max_llm_calls_per_cycle` | MISSING | not v1 knobs. Cost through the existing ledger and caps (§6) |
| `reference_accounts` | **CONFLICT** as a topic-research field | belongs to STYLE (§5.6). Moved. |
| `own_account_insights` as a topic source | MISSING | style/insights path, not ri |
| `manual_intake` | ADAPT | if an existing SourceSpec type covers it. Otherwise it remains a STYLE intake (U-R2) |
| shared `source_items` / `collection_runs` | **CONFLICT** (R6, ONB-02) | withdrawn |
| new `research_candidates` / `research_packets` | **CONFLICT** (ONB-02) | withdrawn. Reuse `ri_*`. |
| packet → `content_plans` automatically | **CONFLICT** (R8) | via ResearchSelection only |
| packet → Writer request | **CONFLICT** (R9) | withdrawn |
| packet stamped with `config_version` | **CONFLICT** (packet mutation) | snapshot references the packet instead (§8) |
| third account by config | MISSING (R1) | §12 C6 |
| tenant-private queries | COMPATIBLE | with no shared cache, every query is account-scoped |
| cross-tenant originality guard | MISSING | later, §14 |

The v1 §6.6 「AI面接対策」 example is **retracted as a current-capability
illustration**. It assumed a shared cache and a third (career) account,
neither of which exists. With v2, each account would collect separately.
The career account is not supported until R1 is lifted.

### 5.6 TOPIC vs STYLE (separation kept)

| | TOPIC research | STYLE evidence |
|---|---|---|
| Backing | `ri_*` (frozen v1) | `account_research_posts` → `account_style_profiles` (StyleDNA, numeric) + semantic style (closed vocabulary) |
| Inputs | SourceSpecs | own past posts (Manual Post Sync, `analyze_enabled`), reference accounts (manual intake) |
| Output | suggestions | style profile versions |
| Cross-feed | **never**: ri items are not research posts, and research posts are not ri observations | — |

**Fake research posts are forbidden.** Nobody may insert synthetic,
template-generated or ri-derived rows into `account_research_posts` to
satisfy style readiness.

### 5.7 Style provenance classes (ONB-10)

| Class | Source | Can satisfy current readiness (`style_profile` item)? |
|---|---|---|
| `DERIVED_OWN_HISTORY` | real own posts | **yes**. This is the existing path, unchanged. |
| `BENCHMARK_DERIVED` | reference accounts through manual intake | **yes**. Existing path, unchanged. |
| `MANUALLY_APPROVED` | a style spec explicitly reviewed and approved by operator + customer (may start from a template) | **not under the current contract.** Only through the readiness adapter (§5.8) once that adapter is approved. |
| `TEMPLATE_DEFAULT` | template data only | **never**. Template defaults alone are not an accepted Style profile. |

### 5.8 Readiness adapter contract

- `accounts.validate()` keeps its `style_profile` blocking item **unchanged**
  for every account.
- A new `style_readiness(account_id) → {class, profile_ref, approved_by?, blocking?}`
  reports the provenance class. It **never** silently turns a blocking item
  into a pass.
- **SHADOW** may generate samples with `TEMPLATE_DEFAULT` style. Every sample
  is labelled with its style class, and the shadow report says "文体: おすすめの
  初期設定（未承認）".
- **APPROVED / ACTIVE** require `DERIVED_OWN_HISTORY`, `BENCHMARK_DERIVED`,
  or, only after the adapter change is separately approved,
  `MANUALLY_APPROVED`, with the approver identity and template lineage
  recorded.
- Adding `MANUALLY_APPROVED` as a readiness-satisfying class is a
  **readiness-contract change**. It needs its own design note, tests showing
  existing accounts' readiness is byte-identical, and DOT approval. Until
  then, a brand-new account with no posts and no references **cannot** reach
  APPROVED. The blocker is named (E050).

---

## 6. Corrected cost model (ONB-08)

### 6.1 Current production capability (use only these)

| Capability | Status | Used for |
|---|---|---|
| AI usage ledger (`ai_usage_events`) | existing per DOT. v1 saw it on the unmerged branch (U-C1). | attribution by account / feature / lane (`shadow` lane tagged) |
| Per-feature daily call caps (`ai_cost_policies.utc_daily_call_cap`) | existing (append-only policies) | **the only enforced limit**, in calls, UTC days |
| Writer daily call limits | existing | enforced |
| Unknown-cost calls | existing: an unknown model price makes the cost `None` and is counted as `unknown_cost_call_count` | the estimate is shown as "算出不可" and is never treated as zero |
| Deterministic / no-call mode | existing where the template wording path supports it | `cost.no_ai_mode` |

### 6.2 Monthly JPY = desired limit / estimate

- `cost.monthly_cap_jpy` is relabelled **「月額の目安（希望の上限）」**. It is
  stored as `desired_monthly_jpy` **intent**.
- The compiler converts it **conservatively** into per-feature daily call
  caps, using the pricing table version and expected calls per post. The
  daily call caps are what is enforced. The JPY figure is not.
- The customer UI states: 「目安です。実際の利用は1日の回数上限で管理しています。
  月額を超えないことを保証するものではありません」.
- An unknown-cost call during SHADOW blocks the estimate. The cost row of the
  activation review shows "算出不可" and needs operator acknowledgement. It is
  never auto-passed.
- G9 / E120 become **review items** ("projected ≥ 80 % of the desired limit").
  They are no longer claims of enforcement.
- `cost.on_cap` is limited to what daily caps can do today: stop generation
  for that feature for the UTC day, or deterministic mode where supported. A
  "stop for the month" option is MISSING until a Cost Governor exists.

### 6.3 Future Cost Governor (separate project, not designed here)

Required before any customer-facing "hard monthly cap" claim:

- confirmed usage vs **reserved** usage (admission reserves before the call)
- pricing version per event, currency (USD → JPY) and FX source/version
- month boundary definition (JST vs UTC) and period close
- **atomic admission** (reserve-or-refuse in one step)
- no double counting (retries, regenerations, shadow vs live)
- org-level aggregation across accounts (Customer B)
- reconciliation of unknown-cost calls

---

## 7. Corrected tenant / ownership model (ONB-03)

### 7.1 Three relations, kept distinct

| Relation | Meaning | Today |
|---|---|---|
| **OWNERSHIP** | which organization owns the operating account (contract, attribution, offboarding) | implicit through `org_accounts`, which allows many orgs per account (no UNIQUE) |
| **ORG ROLE** | a user's role in their own org (`users.org_id` single org) | `user_roles(user_id, org_id, role)` |
| **DELEGATED ACCOUNT MEMBERSHIP** | a role on a specific account | `user_account_memberships(user_id, account_id, role)` |

### 7.2 Current semantics (verified in `production/store.py` @ `8590243`)

```
visible_accounts(user) =
    { a | org_accounts(user.org_id, a) }            -- every org-linked account
  ∪ { a | user_account_memberships(user, a) }       -- plus explicit memberships
  (only if the user has a user_roles row in their own org)

role(user, a) = COALESCE(membership.role, org_role)  -- membership overrides org role on that account
```

Consequences:

- A membership **adds** an account or **changes the role** on it. It does
  **not** remove the user's access to other org-linked accounts.
- A user must have an org role to see anything, so a "membership-only" user
  does not exist today.
- A membership may reference an account **not linked to the user's org**, and
  the query still grants access. This is noted for DOT as an observation
  (§15 U-T3). v2 does not change it.

### 7.3 Corrected examples

- **Customer A** (1 admin, 3 accounts: Threads plus two waitlisted
  platforms). The admin sees all three cards. Unchanged from v1.
- **Customer B** (5 Threads accounts). An agency editor with an org role in
  org B **sees all 5** under the current contract. A membership on accounts
  1–3 changes the role on those accounts but **does not hide 4–5**.
  - To restrict that editor to 1–3 **today**, the only option is to keep them
    out of org B and use per-account delegation. That needs the cross-org
    membership behaviour from U-T3, which v2 does not endorse.
  - **Strict same-org account allowlisting** (an org role such as `member`
    with no implicit account access, or a per-user `delegated_only` scope) is
    a **separate authorization-model change (AUTHZ-ALLOWLIST)**. It needs its
    own design, migration review, tests and approval. Onboarding does not
    depend on it.

### 7.4 Future ownership invariant (no immediate UNIQUE)

Target:

```
operating account ──1──▶ owning organization
organization      ──n──▶ operating accounts
users             ──▶ org roles + delegated memberships
```

Procedure:

1. **Inventory (read-only)**, reported to DOT:
   - accounts with more than one `org_accounts` row
   - accounts with no row (orphans)
   - memberships pointing to accounts outside the user's org
   - tests and fixtures that assume multi-link
   - authority and audit records that reference an org
   - cost attribution (`ai_usage_events`) that relies on org links
2. Introduce `account_ownership(account_id, org_id, effective_from, effective_to, recorded_by, reason)`
   as an append-only record, **separate from access links**.
3. Enforce "one current owner" on `account_ownership`, not by altering
   `org_accounts`, once the inventory shows zero conflicts or each conflict
   has an operator decision.
4. **No history rewrite.** Past audit, authority and cost rows keep the org
   recorded when they were written.

### 7.5 Account identity

- Canonical identity = `(platform, provider_account_id)`, UNIQUE. A new
  identity mapping is introduced. It does not rename `account_id`.
- `handle` and `display_name` are mutable metadata with change history. A
  handle change is a metadata event, not a new account.
- The connection identity check moves from handle comparison to provider-ID
  comparison once the provider ID is known. Until then the existing handle
  check stays. This is a dependency at §13.2 step 5.
- A platform change is a **new ChannelAccount**, never an overwrite (§11).

---

## 8. Corrected config version / execution snapshot model (ONB-06)

### 8.1 Why a version number is not enough

`config_version` says which document was current. It does not capture the
fact **values**, the offer revision, the research packets, or the style or
policy versions actually used. Today, generation records already store
`style_profile_version` and `verified_fact_keys_json`, which holds **keys
only**. A fact value can change under the same key.

### 8.2 ExecutionSnapshot (NEW, immutable)

Created once, before generation, for each plan. Content versions reference it.

| Component | Contents |
|---|---|
| Account identity | `account_id`, `(platform, provider_account_id)`, owning org at creation time |
| Config | `config_version`, `config_hash`, `catalogue_version`, `template_ref@version`, `safety_floor_version` |
| Persona | persona version / hash + provenance class |
| Offer + facts | `selected_offer_id`, `offer_revision`, fact event ids + value hashes for the selected offer, and the account-level facts the role needs |
| Research envelope | ResearchSelection ids, `ri` packet ids + packet hashes (or `none`) |
| Style | `style_profile_version`, semantic style version, style provenance class (§5.7) |
| Policy | ComplianceRules hash, QA rule-set version, approval policy version, publishing policy version, cost policy version |
| Writer contract | writer contract version, prompt-template version, model id (operator view only) |
| Hash | `snapshot_hash` = canonical hash of everything above |

```
execution_snapshots(snapshot_id, account_id, snapshot_hash, components_json, created_at, created_by)
  -- append-only; no UPDATE/DELETE (trigger)
content_plans.snapshot_id, content_versions.snapshot_id, generations.snapshot_id   -- additive references
```

### 8.3 Rules

- A plan generated under snapshot S can only produce content bound to S.
  Regenerating under newer inputs creates a new snapshot S′ and new content.
- Shadow samples have their own snapshots in the SHADOW tables (§10). They
  never link to live content.
- Rollback is forward-only, as in v1 §10.3. A new config version's snapshot is
  built from current facts. If a fact used by the rolled-back version has
  expired or been revoked, the rollback is blocked and the fact is named.

### 8.4 Publication-time checks (separate from the snapshot)

A snapshot proves **what was used**. It never proves that publishing is still
allowed. At publication time, independently of the snapshot:

- STOP, armed state, and execution authority (TTL / generation): §3.2
- every fact in the snapshot is still VERIFIED, unexpired and unrevoked, and
  the selected offer's `availability` is still `accepting`
- the latest **restrictive** policy passes on the exact content: newly banned
  terms, newly prohibited topics, a newly paused offer
- the account identity still matches the connected credential
- the approval is still valid (§9)

Any failure blocks that publication. None of these checks can authorize a
publication that the snapshot and approval do not already cover.

---

## 9. Corrected approval semantics (ONB-07)

### 9.1 Binding

An approval binds `(account_id, content_id, content_hash, snapshot_hash, approver, approved_at)`.
It is valid only for that exact tuple.

### 9.2 Invalidation, which QA cannot undo

An approval is **invalidated**, whatever any later QA result says, when the
semantic meaning of the approved publication changes. That includes any of:

| Change | Examples |
|---|---|
| offer changed | different `selected_offer_id`, new `offer_revision` |
| CTA destination changed | `destination_url` changed, revoked or expired |
| eligibility changed | `eligibility_requirements`, age conditions |
| price / terms changed | `price`, `salary_range`, `validity_window`, affiliate terms |
| publishing policy changed materially | PR disclosure rule, approval policy, the approved scheduled slot moved |
| target account changed | content moved to another account, or the account's identity changed |
| compliance rules loosened or replaced | any non-restrictive change to rules that applied to the content |
| persona / audience / template change | these are RE_SHADOW_REQUIRED changes. Queued content under the old snapshot is invalidated. |

```
old approval + changed facts/policy/offer/CTA + fresh QA PASS  ≠  valid approval
```

After invalidation, the content may be **re-submitted for a new approval**.
If its snapshot inputs no longer exist, it must be regenerated under a new
snapshot. A QA PASS is a precondition for re-approval. It is never a
substitute for it.

### 9.3 Restrictive context changes

If the content and its snapshot inputs are unchanged and only a restriction
was **added** (a banned term, a prohibited topic, an offer paused), the
approval is not re-issued. Instead, the publication-time gate (§8.4) applies
the latest restriction:

- **fail** → the publication is blocked and the approval invalidated
- **pass** → the existing approval still covers the same text and semantics.
  Nothing in the approved meaning changed.

A restriction can only remove eligibility. It never grants it.

### 9.4 Unchanged from v1

- `on_timeout = skip` (fixed). An expired approval request never publishes.
- AUTO approval is unavailable at onboarding. Loosening approval policy needs
  admin + operator policy review (§11). The ESCALATE/AUTO track-record
  preconditions in v1 §9.4 are **future**.

---

## 10. Corrected SHADOW boundary

### 10.1 Principle

SHADOW is a **separate execution principal with a separate capability set**.
A `status = "shadow"` label in the UI or a lifecycle row is not the boundary.

### 10.2 Enforceable boundary

| SHADOW must not obtain | Enforcement (structural, not conventional) |
|---|---|
| live publication authority | Shadow jobs run as principal `shadow:<account_id>`. The existing authority path refuses to mint execution authority for any non-live principal, and for any account whose `lifecycle_state ≠ ACTIVE`. The publisher factory requires a valid live authority token. A shadow process never holds one. |
| live queue rights | Shadow output lives in separate tables (`shadow_plans`, `shadow_samples`, `shadow_snapshots`) with **no foreign key or state transition into** live `content_plans` / `content_versions` / approval / publication tables. The live-queue store methods require a live principal. DB triggers refuse rows with `lane = 'shadow'` in live tables. |
| publication credentials | The secret store refuses publish-purpose credentials (0014 `purpose`) to the shadow principal. Shadow processes are started without the secret-store handle for publish purposes. Read-only insights use a separate credential purpose, or are omitted. |
| activation authority | Lifecycle transitions to APPROVED / ACTIVE and `arm()` require an operator principal. The shadow principal has no route to them. |
| KPI / learning / daily publish counters | Shadow events are `lane = shadow` in `ai_usage_events`. KPI, learning and publish-cap readers filter on the live lane (lesson from the Phase 1.4 DryRun bug). |
| "promotion" of a sample | Not possible. 「最初の投稿に使いたい」 generates **new** live content under a new live snapshot, after activation, through normal QA and approval. |

### 10.3 Required negative tests (before any SHADOW code ships)

- Every live-side entry point (publisher factory, queue insert, approval
  creation, authority mint, `arm()`, credential read with publish purpose)
  called by the shadow principal fails closed.
- Every shadow table has no path into live tables (schema test).
- A shadow run for an account that is concurrently ACTIVE does not change any
  live row or counter.

---

## 11. Corrected change classification

### 11.1 Classes

| Class | Meaning | Applies |
|---|---|---|
| **SAFE_CANDIDATE** | low-risk, **if** impact analysis shows no committed work is affected | after automated checks + the author's confirmation. **Re-classified to REVIEW_REQUIRED if the impact analysis finds affected scheduled, approved or queued work.** |
| **REVIEW_REQUIRED** | a human review of the candidate version and its impact | customer admin and/or operator, per row |
| **RE_SHADOW_REQUIRED** | full shadow under the candidate version | customer + operator. The active version continues meanwhile. |

**Mixed change sets**: the class is the **most demanding** class of any
atomic delta. A set is never SAFE because one part is restrictive. An author
who wants the restrictive part applied now must split it into a **separate
version**, which is classified on its own.

**Impact analysis** (always run): list the unpublished plans, content and
approvals whose snapshots depend on the changed inputs, and the scheduled
slots inside the change. If anything is listed, the change is at least
REVIEW_REQUIRED.

### 11.2 Table

| Change | Class | Notes |
|---|---|---|
| Posting time / windows for **future, uncommitted** windows within policy | SAFE_CANDIDATE | revalidate window capacity |
| Posting time change affecting **already approved or scheduled** publication | REVIEW_REQUIRED | the moved slot invalidates that approval (§9.2) |
| Blackout dates added (future, uncommitted) | SAFE_CANDIDATE | the impact analysis lists scheduled items |
| Posts/week decrease | SAFE_CANDIDATE (restricts future admission) | existing queue and approvals still checked |
| Posts/week increase | REVIEW_REQUIRED | cost estimate re-run (§6) |
| CTA frequency decrease / to 入れない | SAFE_CANDIDATE for future work | queued conversion content and its approvals still checked. Affected items → REVIEW_REQUIRED |
| CTA frequency increase | REVIEW_REQUIRED | |
| CTA destination change | REVIEW_REQUIRED | fact update (new verification) + impacted approvals invalidated (§9.2) |
| CTA wording / semantic change | REVIEW_REQUIRED | |
| Add banned terms / prohibited topics | SAFE_CANDIDATE (restrictive) | publication-time gate (§9.3). Never a re-approval. |
| Remove banned terms / prohibited topics | REVIEW_REQUIRED (operator) | loosening |
| Audience change | RE_SHADOW_REQUIRED | |
| Persona / tone chips / stance change | RE_SHADOW_REQUIRED | |
| Main offer change / new main offer | RE_SHADOW_REQUIRED | |
| Template / business category switch | RE_SHADOW_REQUIRED | |
| Main pillar add / remove / rename | RE_SHADOW_REQUIRED if it changes the main offer or audience framing, else REVIEW_REQUIRED | |
| Affiliate terms / price / eligibility / validity | **fact update** (assert → verify → project) + impacted-content approval review | approvals that depend on the old fact are invalidated (§9.2) |
| Offer availability → paused / ended | SAFE_CANDIDATE (restrictive) | removes eligibility immediately at admission and publication |
| Research keyword / source selection within existing SourceSpec types | REVIEW_REQUIRED | limited to COMPATIBLE / ADAPT fields (§5.5) |
| New source **type** | not an onboarding change | code, separately reviewed |
| Reference accounts (style) added / removed | REVIEW_REQUIRED | new style profile version. New snapshots only. |
| Approval policy tighten (→ MANUAL) | SAFE_CANDIDATE | |
| Approval policy loosen | REVIEW_REQUIRED: **org admin + operator policy review** | v1 §9.4 track record = future |
| Approvers add | SAFE_CANDIDATE | |
| Approvers remove | SAFE_CANDIDATE if ≥ 1 remains, else refused (E091) | pending approval requests assigned to the removed user are reassigned or expire (skip) |
| Desired monthly budget decrease | SAFE_CANDIDATE | daily caps recomputed downwards |
| Desired monthly budget increase | REVIEW_REQUIRED: **org admin** + reconciliation against the org-level desired total and current daily caps | no enforcement claim (§6) |
| Platform change / add | **new ChannelAccount** | never an overwrite |
| Brand / display name | REVIEW_REQUIRED | |
| Handle change at the provider | metadata event (§7.5) | identity unchanged |
| Company name | REVIEW_REQUIRED (operator) | contract record |

Any class above SAFE_CANDIDATE that affects execution is promoted only
through the quiescence protocol (§3.6).

---

## 12. CAREER no-code acceptance contract

### 12.1 Current status

**NOT RUN / NOT PASS.** CAREER is **not** data-only today.

### 12.2 Current blockers (verified at `Threads-` @ `8590243` unless noted)

| # | Blocker | Where | Why it blocks |
|---|---|---|---|
| B1 | Fortune-specific funnel goal enum | `production/funnel.py` `PRIMARY_GOALS` (`free_reading_application`, `line_registration`, `paid_reading`, `profile_visit`) and `GOAL_LABELS` | No `job_application` goal. Adding one is a Python edit. |
| B2 | Fixed conversion facts | `production/funnel.py` `FUNNEL_FACTS` / `REQUIRED_FOR_CONVERSION` (`free_reading_*`) | Conversion requires fortune keys |
| B3 | Fortune-coupled Writer / prompt / QA labels | `production/fortune_qa.py` (FQA rules and messages, e.g. 「鑑定」), Writer prompt labels drawn from `GOAL_LABELS` / `GOAL_NOTES` | Career copy would be checked and prompted with fortune vocabulary |
| B4 | Unsafe generic `price` | `production/funnel.py` `OTHER_FACT_SUPPLIES["price"]`; FQA-7 `_invented_price` checks `"price" in facts` | One account-wide price fact authorizes price mentions for every offer. Salary ranges do not fit. |
| B5 | Domain registry loading / versioning | `domains/registry.py` (a genre = a code package); `research/materialize.py` builds an in-memory `DomainConfig` | No versioned, data-loaded template path |
| B6 | Research v1 two-account restriction | frozen LAB (DOT R1) | A third account cannot get research |

### 12.3 Common-core changes (small, generic, done once)

| # | Change | Resolves |
|---|---|---|
| C1 | Goal enum and labels loaded from versioned catalogue data. Fortune values become the fortune catalogue entry. | B1 |
| C2 | Required-for-conversion facts derived from offer type + typed catalogue (§4.4–§4.5), with the fortune legacy aliases (§4.6) | B2 |
| C3 | Writer prompt labels and QA rule messages parameterized from catalogue / template data. Fortune-specific QA rules remain as the fortune template's rule set, selected by data. | B3 |
| C4 | Offer-scoped `price` / `money` / `money_range` facts. FQA-7-style checks read the selected offer's snapshot facts. | B4 |
| C5 | Template registry that loads versioned data templates through the **same** loader in production and tests | B5 |
| C6 | Research account generalization: **a separate, approved feature** that lifts R1 without changing the frozen v1 contract for A1/A2 | B6 |

Each of C1–C6 must pass A1/A2 behavioural parity (§13.2 step 8) before the
CAREER test.

### 12.4 Future acceptance test (to run after C1–C6)

**Claim tested:** adding CAREER requires only:

- template / config data (`career_recruitment@1`)
- catalogue data (goal values, offer type `job_posting`, extension facts, QA
  label data)
- customer data (submission, fact assertions, verifications)

It must **not** require any career-specific Python or TypeScript business
logic.

**Procedure:**

1. Starting point: a MAINLINE commit with C1–C6 merged, tagged `T0`.
2. Add the CAREER template + catalogue entries as data files only, at `T1`.
3. Onboard a synthetic CAREER org and account through the production
   onboarding path (compiler → fact assertions → operator verification →
   SHADOW). No production publication.
4. Run the full SHADOW lane: research (if C6 is in scope) or none, planning
   with a ResearchSelection, Writer, QA, snapshot binding, and approval
   records in shadow.

**Pass criteria (all):**

| # | Criterion |
|---|---|
| P1 | `git diff T0..T1` touches only declared data paths (templates, catalogue). **Zero** `.py` / `.ts` / `.tsx` changes. |
| P2 | No code path contains a career-specific branch. A grep for `career`, `job_posting`, `salary` in non-data source files returns nothing beyond generic catalogue loader tests. |
| P3 | The test loads the template through the production loader (C5). **No test-only shim**, monkeypatch, fixture override, or alternate registry. |
| P4 | Writer requests for a conversion plan contain **only** the selected `job_posting` offer's verified facts (snapshot check) |
| P5 | QA findings and prompts use career catalogue labels. No fortune vocabulary appears. |
| P6 | Missing `salary_range` verification blocks conversion plans that would mention salary, with the existing missing-fact path |
| P7 | The SHADOW boundary negative tests (§10.3) pass for the CAREER account |
| P8 | A1 and A2 behavioural parity still passes at `T1` |

Result recorded as PASS / FAIL with evidence. Any FAIL means the failing
item becomes another common-core change and the test re-runs from a new `T0`.

---

## 13. MVP scope and build order

### 13.1 Scope separation

The **current two-account MVP is independent of this onboarding project.**
None of the following are gates on it:

- 72 h soak
- 3 planning cycles
- 10 posts
- 14 days
- onboarding completion
- B2B readiness

These values appear in this document only as **proposed future onboarding
parameters** (SHADOW exit criteria and live ramp for onboarded customer
accounts). They are template-tunable and subject to DOT review when that
phase is designed. This is future onboarding infrastructure.

### 13.2 Corrected build order

Each step is design → DOT review → (later) implementation in an additive,
dark form. **No step changes MAINLINE live behaviour without its own
explicit approval.** The UI comes last.

| # | Step | Deliverable | Exit check | Depends on |
|---|---|---|---|---|
| 1 | **Correct the contracts / design doc** | this v2 | DOT re-audit | — |
| 2 | **Pure compiler + field catalogue** | catalogue schema (closed types, no executable validation), `compile()` spec, CompileReport, provenance map | deterministic golden tests. Compiler has no I/O. | 1 |
| 3 | **Versioned config + immutable execution snapshot** | `account_config_versions`, `execution_snapshots` spec, snapshot hash canonicalization, publication-time check list | spec review; hash stability tests | 2 |
| 4 | **Typed fact / selected-offer model** | `offers`, `offer_revisions`, `fact_events`, projector spec, alias table (§4.6) | projector emits only VERIFIED; A1 alias parity | 3 |
| 5 | **Ownership / delegation rules** | read-only ownership inventory; `account_ownership` spec; identity mapping `(platform, provider_account_id)`; documented current membership semantics | inventory reviewed by DOT. No UNIQUE until clean. | 1 |
| 6 | **True SHADOW boundary** | shadow principal, tables, credential-purpose refusal, authority-mint refusal, `arm()` lifecycle precondition | §10.3 negative tests | 3, 5 |
| 7 | **Adapters** to existing Research / Planning / Writer / Approval / Cost | `ri_profile_from_config`, ResearchSelection, Writer per-plan fact view, approval binding to `snapshot_hash`, cost intent → daily-cap compiler, quiescence predicate (§3.6), style-readiness reporter (§5.8, report-only) | adapters read-only w.r.t. frozen contracts | 3, 4, 6 |
| 8 | **A1 / A2 behavioural parity** | express both current accounts as submissions | `compile(submission)` == current `config_json` (normalized); same plans, facts seen by Writer, QA findings, readiness and approvals for a frozen input set; ri profile adapter output == current v1 parameters | 7 |
| 9 | **CAREER data-only acceptance test** | C1–C6, then §12.4 | P1–P8 | 8 (+ C6 approval) |
| 10 | **Only then: customer onboarding UI** | form, progress, blockers, shadow review, activation request | usability run; customer copy matches §6.2 and §17 | 9 |

Separately approved changes that this plan depends on, but does not include:

- AUTHZ-ALLOWLIST (§7.3)
- the readiness-contract change for MANUALLY_APPROVED style (§5.8)
- the authority-path admission fence (§3.6)
- the `arm()` lifecycle precondition (§3.5)
- Research account generalization C6 (§12.3)
- Cost Governor (§6.3)
- automatic Research → Planning (§5.1)

---

## 14. What not to build

Kept from v1 and strengthened:

- enterprise admin suite
- SSO / SAML
- billing, payment, invoicing, plan management
- self-serve signup
- non-Threads live publication adapters
- generic workflow / BPMN engine, event sourcing, bitemporal history
- arbitrary executable validation in the field catalogue or templates (closed
  validation tokens only)
- arbitrary fact KV dumping ground (typed facts and declared extensions only)
- per-customer custom Python / TypeScript
- cross-account learning, global ranking models
- shared KPI pools
- shared source cache (and shared research analytics)
- automatic approval (AUTO at onboarding, or approval inherited across
  semantic change)
- operator-less activation
- dangerous self-healing (auto-retry of ambiguous publications, auto-clearing
  of incidents, automatic STOP release, automatic re-arm)
- automatic Research → Planning or Research → Writer authorization
- duplicate canonical Research tables alongside `ri_*`
- synthetic or template-generated `account_research_posts` to satisfy
  readiness
- automatic extraction of offer facts from customer sites or LPs
- LLM-generated personas presented as confirmed
- customer access to raw research, packets, prompts or QA internals
- automatic profile / bio editing on the customer's social account
- unofficial scraping of any platform
- per-role partial shadow lanes (RESHADOW_SCOPED)
- a customer-facing "guaranteed monthly cap" before the Cost Governor exists

---

## 15. Remaining unknowns

| ID | Unknown | Needed for | Owner |
|---|---|---|---|
| U-R1 | Exact `ri_*` table and column inventory (candidates, observations, packets, dedup), packet hash availability | §5.3, §8.2 research envelope | DOT (LAB) |
| U-R2 | Which SourceSpec parameters v1 accepts (domain allow/deny, weights, subtopics, exclusions, manual intake) | §5.5 ADAPT vs MISSING | DOT (LAB) |
| U-R3 | v1 freshness rule sets and their labels, for a 1:1 form mapping | §5.5 R3 | DOT (LAB) |
| U-R4 | Whether a v1 packet has a stable content hash or only an id | §8.2 | DOT (LAB) |
| U-C1 | Merge state of `ai_usage_events` / `ai_cost_policies` on MAINLINE (v1 saw them on an unmerged branch) | §6.1 | DOT / operator |
| U-C2 | Per-post call estimate and pricing table version used for the desired-limit → daily-cap conversion | §6.2 | operator |
| U-T1 | Ownership inventory results (§7.4 step 1) | §7.4 | operator (read-only query) |
| U-T2 | Whether the Threads API provider account id is available at OAuth time for every connected account | §7.5 | DOT |
| U-T3 | Intended semantics of memberships on accounts outside the user's org (currently granted by the query) | §7.2 | DOT / product |
| U-A1 | Exact names and records of the existing TTL / generation-bound execution authority, to bind §3.2 and the §3.6 fence | §3 | DOT |
| U-Q1 | Authoritative evidence source for each quiescence check Q1–Q9, especially provider claims and the loop-runner window | §3.6 | DOT |
| U-S1 | Whether a MANUALLY_APPROVED style class is wanted at all, or new accounts must always bring posts or references | §5.8 | product + DOT |
| U-P1 | Proposed SHADOW exit and ramp parameters (72 h, 3 cycles, 10 posts, 14 days): commercial acceptability | future onboarding phase | product |
| U-V1 | Who may verify which fact types in MVP (operator only assumed) and the evidence retention policy | §4.2 | product + DOT |

---

## 16. Audit response matrix

| ID | Correction applied | Section | Remaining dependency | Status |
|---|---|---|---|---|
| **ONB-01** Research authority | Research → suggestion → explicit ResearchSelection → Planning → Writer. No direct path. Automatic connection is a separate authority expansion. Frozen v1 untouched. | §5.1, §5.2, §5.4 R8/R9, §14 | none for design. Automatic selection = separate future feature. | **APPLIED** |
| **ONB-02** Research source of truth | Reuse `ri_*` candidates/observations/packets/dedup and `collect(SourceSpec)`. v1 duplicate tables and shared cache withdrawn. REUSE/ADAPT/NEW table. | §5.3, §5.5, §2.2 | U-R1 (exact `ri_*` inventory) | **APPLIED** (names pending DOT inventory) |
| **ONB-03** Membership semantics | OWNERSHIP / ORG ROLE / DELEGATED MEMBERSHIP separated. Current union semantics documented from code. Customer B example corrected. Strict allowlist labelled AUTHZ-ALLOWLIST (separate). No immediate UNIQUE. Inventory first. | §7.1–§7.4 | U-T1, U-T3; AUTHZ-ALLOWLIST if wanted | **APPLIED** |
| **ONB-04** Active ≠ authority | Five concepts separated. Lifecycle never arms, mints, renews or ignores STOP. `armed ⇒ ACTIVE` only. | §3.1–§3.5 | U-A1; `arm()` lifecycle precondition (separate approval) | **APPLIED** |
| **ONB-05** Claims vs verified | CUSTOMER_ASSERTED / VERIFIED / REJECTED·EXPIRED·REVOKED. Event → verification → projection. Old readers see the projection only. No `verification_level` column. Templates cannot create VERIFIED facts. | §4.1, §4.2, §17 (attestation) | U-V1 | **APPLIED** |
| **ONB-06** Snapshot | Immutable ExecutionSnapshot with config hash, persona, offer + fact snapshot, research envelope, style/semantic, identity and policy versions. Publication-time checks separate. | §8 | U-R4 | **APPLIED** |
| **ONB-07** Approval not preserved by QA | Semantic change invalidates approval regardless of QA. Restrictions are a publication-time gate only. Approval bound to account + content hash + snapshot hash. | §9 | none | **APPLIED** |
| **ONB-08** Cost model | Current capability vs future Cost Governor. Monthly JPY = desired limit / estimate. Daily call caps are the only enforcement. Unknown cost never zero. | §6 | U-C1, U-C2; Cost Governor (separate) | **APPLIED** |
| **ONB-09** Lock ≠ quiescence | Read-only quiescence predicate Q1–Q10, fail-closed, admission fence, TOCTOU re-check, no self-healing. | §3.6 | U-Q1; admission fence (separate approval) | **APPLIED** |
| **ONB-10** Style / readiness | No fake research posts. TOPIC/STYLE separate. Provenance classes. Template default ≠ accepted style. Readiness adapter is report-only until a separately approved contract change. | §5.6–§5.8, §17 (G4, E050) | U-S1; readiness-contract change (separate approval) | **APPLIED** |

Additional required items:

| Item | Section | Status |
|---|---|---|
| RI v1 compatibility (R1–R9, field matrix) | §5.4, §5.5 | APPLIED |
| Offer / fact model | §4.3–§4.6 | APPLIED |
| Tenant / ownership, identity | §7.4, §7.5 | APPLIED |
| Change classification | §11 | APPLIED |
| SHADOW boundary | §10 | APPLIED |
| CAREER acceptance (NOT RUN / NOT PASS) | §12 | APPLIED |
| MVP scope separation | §13.1 | APPLIED |
| Build order (UI last) | §13.2 | APPLIED |
| What not to build | §14 | APPLIED |

---

## 17. Amendments to retained v1 sections

v1 §2 (journey), §3 (form), §7 (templates), §11 (errors) and §12
(visibility) stay as the baseline, with these amendments. Where v1 and this
list disagree, this list wins.

### 17.1 Form (v1 §3)

| v1 field | Amendment |
|---|---|
| `account.handle` (`unique_global`) | Uniqueness on `(platform, provider_account_id)` after connection. Handle uniqueness is a warn-level pre-check only (§7.5). |
| `account.connect` | identity check by provider id when available (§7.5) |
| STEP 6 offer fields | values become **fact assertions** (CUSTOMER_ASSERTED). Destinations change from `Fact offer.<id>.*` to typed `fact_events` (§4.4–§4.5). `offer.price` is offer-scoped `price`. |
| `offer.affiliate.status` | `partnership_status`. CTA only when VERIFIED `approved`. |
| `offer.claims` | unchanged intent: assertions require operator verification |
| `research.freshness` | only labels mapping 1:1 to v1 rule sets (U-R3) |
| `research.update_frequency` | hidden (MISSING: scheduler-owned) |
| `research.blocked_sources`, free `preferred_sources` URLs | hidden until U-R2 confirms support |
| `content.reference_accounts` | STYLE input only (§5.6) |
| `cost.monthly_cap_jpy` | relabelled 「月額の目安（希望の上限）」. Stored as desired intent. Help text per §6.2. |
| `cost.on_cap` | options limited per §6.2 |
| `ops.approval_mode` | unchanged (AUTO disabled at onboarding) |
| `attest.facts_accurate` | effect: writes CUSTOMER_ASSERTED fact events with asserted actor/time. **Does not verify anything.** |
| `attest.persona_confirmed` | unchanged (`owner_confirmed` through the existing `set_persona` contract) |
| `attest.defaults_accepted` | records acceptance of **preferences / policy** defaults. It never constitutes style approval (§5.7). |

### 17.2 Gates (v1 §8.4)

| Gate | Amendment |
|---|---|
| G4 Style | per §5.8. "Template baseline style accepted" removed as a pass condition. |
| G6 Funnel | "required verification level" → required facts **VERIFIED** (§4) |
| G9 Cost | review item on the desired limit (§6.2), not enforcement |
| G13 Safety state | replaced by the quiescence predicate (§3.6) + STOP + no open incident |
| All gates | evaluated for **lifecycle** transitions only. They grant no execution authority (§3.2). |

### 17.3 Error catalogue (v1 §11)

| Code | Amendment |
|---|---|
| E011 | "handle already linked to another org" → "provider account already owned by another org" (§7.4–§7.5) |
| E020 / E021 | "missing offer facts" also covers facts that are CUSTOMER_ASSERTED but not yet VERIFIED: 「確認中の情報があるため、案内なしでお試し運用します」 |
| E023 | unchanged meaning; applies to all fact types (§4.2) |
| E040 / E041 | limited to COMPATIBLE / ADAPT sources. A third account shows a new **E043**: 「この運用形態の情報収集は準備中です」 (R1) |
| E050 | per §5.8: 「文体の参考がありません。過去の投稿の取り込みか、参考アカウントを追加してください」. The "おすすめの文体で始める" option is withdrawn as an activation path. |
| E070 / E120 | wording changed to "目安" (§6.2). No claim of enforcement. |
| E130 | covers all quiescence blockers Q1–Q9 (§3.6) |
| **E140** (new) | approval invalidated by a semantic change (§9.2): 「内容に関わる設定が変わったため、もう一度確認が必要です」 |
| **E150** (new) | change set mixes restrictive and loosening parts: 「制限を強める変更と緩める変更が混在しています。分けて保存すると、制限だけ先に反映できます」 |

### 17.4 Multi-tenant section (v1 §13)

Replaced by §7. `ADD UNIQUE(account_id)` withdrawn. `org_budget` becomes a
**desired** org-level total (§6.2) with no enforcement claim.

### 17.5 Shadow and ramp numbers (v1 §8.3, §8.5)

Retained as **proposed future onboarding parameters only** (§13.1).

---

## FINAL STATUS

**DESIGN_V2_READY_FOR_REAUDIT**

All ten corrections (ONB-01 … ONB-10) and the Research Intelligence v1
compatibility conclusions are applied. They are mapped in §16. Open items
are listed explicitly as unknowns (§15) or as separately approved
dependencies (§13.2). None is hidden as supported.
