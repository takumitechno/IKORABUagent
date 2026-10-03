# 環 — MEGURI B2B onboarding / account bootstrap design — v3 (final corrective) + errata v3.1

Status: **design only, corrective revision.** No application code, no
Production change, no MAINLINE runtime change, no deploy, no migration, no
scheduler / credential / approval / arm / publication / live-account change.

| | |
|---|---|
| Supersedes | the sections of `docs/meguri-b2b-onboarding-design-v2.md` listed in §2. Every other v2 section is retained unchanged. v1 and v2 are kept as history, each with a one-line pointer at its top. |
| v2 audited at | `IKORABUagent` branch `claude/practical-wright-j9wk8p`, commit `a12a0671a135e545af8cced7f3eed751032c4e46` |
| DOT re-audit result on v2 | **NOT_READY** |
| This revision | Applies only the remaining contract corrections from the v2 re-audit (items 1–15 of the v3 corrective brief). It is **not** a redesign. |
| v3 audited at | `IKORABUagent` branch `claude/admiring-mccarthy-qxogva`, commit `4638fafae0d650ab95224feb9d779450d1979622` |
| Errata v3.1 | Applies only the finite corrections from the **DOT final re-audit of v3** (limited corrective brief items 1–5). Edited in place, so `git diff 4638faf -- docs/meguri-b2b-onboarding-design-v3.md` is the exact diff. Change log: §19. |
| Requested outcome | DOT diff re-audit of errata v3.1 |
| Effect on the current two-account MVP | **None.** This project does not gate it (§15). |

### 0.1 Sources of authority used in v3

| Source | Used for | Notes |
|---|---|---|
| DOT re-audit of v2 | every v3 correction | Authoritative. Statements in v3 about current behaviour that come from this re-audit are labelled "(DOT re-audit)". They are not re-verified in this revision. |
| DOT re-audit, current-state findings | §3, §10, §12, §7.3 | (a) the confirmed 1–120 s TTL / generation-bound `execution_authorities` belong to **CATFOOD-specific control**; (b) current live publication uses separate controls (§3.1); (c) current generation `request_json` may preserve fact values; (d) current readiness has **separate** `research` and `style_profile` blockers; (e) current cost capability (§10.1) |
| DOT re-audit, recommendations | §5, §8 | restriction-only approvals: **SAFE WITH CONDITIONS**; cross-org membership: **explicit DELEGATION, not ownership** |
| DOT Research Intelligence v1 compatibility audit | §9 | Unchanged from v2. Frozen v1 contract. |
| DOT final re-audit of v3 | errata v3.1 (§19) | Authoritative for the v3.1 corrections. Statements about current behaviour taken from it are labelled "(DOT final re-audit)": (a) the four frozen advisory fields belong to the **planning-input / export envelope**, not to every `ri_packets` row; (b) research freshness is a **fixed** v1 classification, not a selectable policy; (c) manual TOPIC intake is **existing** v1 behaviour; (d) `ri_packets.payload_hash` exists; (e) frozen Research v1 has its own daily AI limits, USD budget limits and source/fetch limits. Not re-verified in this revision. |
| v2 §0.1 sources | retained sections | Unchanged |

The `takumitechno/Threads-` repository is not readable from this revision's
session. v3 therefore does not add any new code-level claim. Where a
correction needs an exact table, column or function name that has not been
confirmed, v3 lists it as an unknown (§16).

### 0.2 How to read v3

- v3 = v2 + the corrections below. Where v2 and v3 disagree, **v3 wins**.
- Errata v3.1 (§19) is part of v3. Text added or changed by v3.1 is in the
  sections it names. Where v3.1 and the original v3 text differ, **v3.1
  wins**.
- v2 sections not named in §2 remain the accepted baseline, word for word.
- v2 §17 amendments to v1 remain in force. §18 adds the further amendments.

### 0.3 Corrected summary

1. The confirmed 1–120 s TTL / generation-bound execution authorities are a
   **CATFOOD-specific control**. They are **not** a general live-publication
   authority, and no universal live TTL authority is claimed (§3).
2. Six concepts stay separate: **CONFIG APPROVED, PRODUCT ACTIVE, CONTENT
   APPROVED, ARMED, LIVE ADMISSION, EXECUTION AUTHORITY** (§3.2).
3. PRODUCT ACTIVE is never armed, executable, publishable or authority. For
   **future onboarding-managed accounts only**, it may become one extra
   required condition for live admission. A1/A2 get no new gate (§3.4).
4. **Ingress fence** (stop new admission) and **quiescence** (drain complete)
   are two separate phases. Pausing needs only the fence, so STOP can never
   prevent reaching PAUSED (§4).
5. Restriction-only changes keep an approval valid only under ten explicit
   conditions. They never rebind or revive an approval (§5).
6. Approver additions and removals are **REVIEW_REQUIRED** (§6).
7. `MANUALLY_APPROVED_STYLE` is a defined **future** provenance class. It
   does not satisfy the separate `research` readiness blocker (§7).
8. Cross-org membership is **explicit delegation, not ownership** (§8).
9. Research v1 stays frozen: `authority = suggestions_only`,
   `verified_facts = []`, `requires_explicit_operator_plan_decision = true`,
   `writer_input_authorized = false`. These are checked on the
   **planning-input / export envelope**, not required on every `ri_packets`
   row. Selection mode is `operator_manual` only. Freshness is v1's fixed
   classification. Manual TOPIC intake is existing behaviour (§9, v3.1).
10. Monthly JPY is a **desired limit / estimate**. Only the paths that are
    actually enforced today are described as enforced: Writer daily limits
    and frozen Research v1's own daily AI, USD budget and source/fetch
    limits. None of them is a unified Cost Governor (§10, v3.1).
11. One canonical **SelectedOfferFactSnapshot**, with typed price, feeds the
    Writer, request validation, QA and approval binding (§11).
12. Current `request_json` may preserve fact values. It is still not the
    future ExecutionSnapshot contract (§12).
13. CAREER is **NOT_READY**. The full acceptance test includes Research.
    Without Research it is only a **LIMITED CORE TEST** (§13).
14. The first implementation-planning slice is only the **pure compiler +
    field catalogue** (§17). Its first catalogue freezes only with the
    corrected field statuses of §17.6 (v3.1).

---

## 1. Change log from v2

This table is the v2 → v3 history. Rows 5, 6, 10, 12, 13, 14, 16, 19 and 20
are corrected further by errata v3.1 (§19).

| # | v2 location | v2 said | v3 says | Brief item | v3 § |
|---|---|---|---|---|---|
| 1 | §2.2 row "Execution authority / arm / STOP"; §3.2 EXECUTION_AUTHORITY row | "existing TTL / generation-bound authority" as the authority for live work | The confirmed 1–120 s `execution_authorities` are **CATFOOD-specific**. Live publication is governed by separate existing controls. No universal live TTL authority is claimed. | 1 | §3.1, §3.2 |
| 2 | §3.2 publication predicate | `EXECUTION_AUTHORITY valid now (TTL, generation)` as a term for every publication | `LIVE_ADMISSION` predicate built from the controls that actually exist. CATFOOD authority appears only on CATFOOD paths that already require it. | 1 | §3.3 |
| 3 | §3.2 invariants; §3.5 `arm()` precondition | `ARMED ⇒ ACTIVE` stated for all accounts | Applies to **onboarding-managed accounts only**, through a separately approved guard (G-ACTIVE). A1/A2 get no new ACTIVE gate. CATFOOD TTL is never reused as the live mechanism. | 2 | §3.4, §3.5 |
| 4 | §10.2 first row | SHADOW excluded because "the existing authority path refuses to mint execution authority" and "the publisher factory requires a valid live authority token" | SHADOW exclusion is bound to the real live controls (publish credentials, admin authorization, `allow_live`, arm, live queue). It does not rely on CATFOOD authority. | 1 | §3.6 |
| 5 | §3.6 protocol step 1 | admission fence = "refuse to grant new execution authority" | Ingress fence = `LIVE_ADMISSION` refuses every new item for the account. Refusing authority issuance alone is insufficient. | 3 | §4.2 |
| 6 | §3.2, §3.4 "lifecycle label changes once quiescence holds"; §3.6 Q9 counts kill switch | PAUSED waits on quiescence, and STOP counts against quiescence, which is circular | **STOP REQUEST / INGRESS FENCE** and **DRAIN COMPLETE / QUIESCENT** are separate. PAUSED needs only the fence. STOP is itself a fence and is never a quiescence blocker. | 3 | §4.2–§4.4 |
| 7 | §3.6 exceptions | "accounts that never left SHADOW need only Q9" | A **NEVER_LIVE** proof: positive verification that no live claim, authority or in-flight work ever existed. Unknown coverage means the full predicate applies. | 3 | §4.5 |
| 8 | §9.3 | restriction added + gate passes ⇒ the existing approval still covers it | **SAFE WITH CONDITIONS** (ten conditions, all required). No rewrite or rebind. Content change ⇒ new version + new approval. Restriction removed later ⇒ no revival. | 4 | §5 |
| 9 | §11.2 approver rows | add = SAFE_CANDIDATE; remove = SAFE_CANDIDATE if ≥ 1 remains | **REVIEW_REQUIRED** for both: authorized admin, account-scope and role validation, pending-approval impact review, audit | 5 | §6 |
| 10 | §5.7–§5.8 | `MANUALLY_APPROVED` class, loosely defined; readiness discussed only as `style_profile` | **MANUALLY_APPROVED_STYLE** with required evidence. Current readiness has **separate** `research` and `style_profile` blockers. A manual style alone never clears the research blocker. | 6 | §7 |
| 11 | §7.2 last bullet; §7.3; §13.2 AUTHZ-ALLOWLIST dependency | cross-org membership "noted, not endorsed"; strict allowlisting as a dependency | Cross-org membership = **explicit DELEGATION**. Ownership, delegation, billing attribution, audit attribution and role are separate. Strict same-org allowlisting is **not planned** without a real product requirement. | 7 | §8 |
| 12 | §5.2 `selection_basis operator_manual \| (future) policy_id` | future policy selection in the current schema | Frozen v1 output fields stated exactly. Selection mode is `operator_manual` only. A selection is not a fact, Writer authority or planning authority. | 8 | §9.1–§9.3 |
| 13 | §5.5 conditional rows ("ADAPT if v1 takes …") | conditional ADAPT | **MISSING until confirmed** (known bounded SourceSpec contract). A `source_type` name does not prove the transport exists. | 8 | §9.4, §9.5 |
| 14 | §6.1 "per-feature daily call caps … the only enforced limit"; §6.2 compiler output "is what is enforced" | all-feature daily caps implied as enforced | Only **Writer-specific daily limits** are described as enforced. Per-feature caps on other paths are estimates until enforcement on that path is confirmed. Monthly JPY = desired limit / estimate. | 9 | §10 |
| 15 | v1 §3.11 `ops.pause_rules` 「月額上限に到達 (always on)」 and other v1 cap wording not covered by v2 §17 | monthly cap as an always-on pause rule | Withdrawn. The remaining v1 cap wording is amended in §18. | 9 | §10.3, §18 |
| 16 | §4.4 `price`; §4.6 aliases in a "per-plan fact view" | per-plan view; "parity proves existing readers see identical facts" | One canonical **SelectedOfferFactSnapshot** for Writer input, request validation, QA and approval binding. Typed price. Explicit legacy aliases with conflict detection that fails closed. Current readers are not assumed to understand the new model. | 10 | §11 |
| 17 | §13.2 step 8 "behavioural parity … same QA findings" | "parity" including intentionally changed behaviour | **EXACT_PARITY** vs declared **INTENDED_DIVERGENCE**. "Full parity" is never claimed where safety strengthening changes behaviour. | 10 | §11.6 |
| 18 | §8.1 | generation records hold `verified_fact_keys_json` (keys only), so a value can change under a key | Current `request_json` **may preserve fact values** (DOT re-audit). That is still not the immutable ExecutionSnapshot contract. | 11 | §12 |
| 19 | §16 | every ONB item "APPLIED" | Each ONB item is CLOSED, PARTIAL or OPEN, with its remaining dependency named | 12 | §14 |
| 20 | §12.1, §12.4 step 4 | "NOT RUN / NOT PASS"; "research (if C6 is in scope) or none" | Status **NOT_READY**. Target **FUTURE_PASS_AFTER_COMMON_CORE**. The full test requires Research. Without it, the run is a **LIMITED CORE TEST** and never a CAREER PASS. | 13 | §13 |
| 21 | §13.1 | MVP independence | Reaffirmed. Future ACTIVE rules apply only to onboarding-managed accounts unless separately migrated. | 14 | §15 |
| 22 | §13.2 ten-step build order | full plan through UI | Only the first slice is proposed for implementation planning: **pure compiler + field catalogue**. Later slices are listed for order only. | 15 | §17 |

---

## 2. v2 sections: retained, replaced, amended

| v2 section | v3 treatment |
|---|---|
| §0, §1 | history (retained) |
| §2.1 | retained |
| §2.2 | retained, except: row "Execution authority / arm / STOP" → §3.1; row "Delegated account membership" → §8; row "Style readiness adapter" → §7.4; row "Cost" → §10 |
| §3.1 | retained |
| §3.2 | **replaced** by §3.2–§3.4 |
| §3.3 | retained, except the ACTIVE and PAUSED meanings (§3.4, §4.4) |
| §3.4 | **replaced** by §4.4 (pause/resume) and §3.4 (activation) |
| §3.5 | **amended** by §3.5 |
| §3.6 | **replaced** by §4 |
| §4.1–§4.3, §4.5 | retained |
| §4.4 `price` row | **replaced** by §11.3 |
| §4.6 | **replaced** by §11 |
| §5.1 | retained, read together with §9.2 |
| §5.2 | **replaced** by §9.3 |
| §5.3, §5.4, §5.6 | retained |
| §5.5 | retained, except the rows corrected in §9.4 |
| §5.7, §5.8 | **replaced** by §7 |
| §6 | **replaced** by §10 |
| §7.1, §7.4, §7.5 | retained (the §7.4 inventory is extended by §8.5) |
| §7.2 | retained as the description of the **current** query. The last consequence bullet is replaced by §8. |
| §7.3 | **replaced** by §8.6 |
| §8.1 | **replaced** by §12.1–§12.2 |
| §8.2–§8.4 | retained, extended by §11 (SOFS) and §12.3, and with the §8.4 first bullet replaced by §3.3 |
| §9.1, §9.2, §9.4 | retained |
| §9.3 | **replaced** by §5 |
| §10.1, §10.3 | retained, with the test list corrected in §3.6 |
| §10.2 | retained, except the first row (§3.6) |
| §11.1 | retained |
| §11.2 | retained, except the approver rows (§6) and the restrictive rows, which now follow §5 |
| §12 | **replaced** by §13 (the blockers B1–B6 and the common-core changes C1–C6 are retained) |
| §13.1 | retained and reaffirmed in §15 |
| §13.2 | **replaced** by §17 for sequencing. The list of separately approved dependencies is replaced by §17.4. |
| §14 | retained, plus the additions in §17.5 |
| §15 | **replaced** by §16 |
| §16 | **replaced** by §14 |
| §17 | retained, plus §18 |

---

## 3. Corrected authority model (brief items 1, 2)

### 3.1 What exists today (DOT re-audit)

| Control | Scope | v3 treatment |
|---|---|---|
| `execution_authorities`: 1–120 s TTL, generation-bound | **CATFOOD-specific control only** | Not a general live-publication authority. Onboarding never mints, extends, reuses or relies on it. |
| admin authorization | live publication actions | existing, unchanged |
| account / content / version / hash checks | live publication | existing, unchanged |
| credential identity | live publication | existing, unchanged |
| `allow_live` | live publication | existing, unchanged |
| armed state (`arm()` / `disarm()`) | live publication | existing, unchanged |
| STOP | everything | existing, unchanged |
| QA / approval | live publication | existing, unchanged |
| rate limits | live publication | existing, unchanged |
| finite NIGHT batch constraints | where the path is a NIGHT batch | existing, unchanged |

v3 does **not** claim that a universal live TTL authority exists. If DOT later
verifies one, it is added here by a separate note. The exact names and
records of these controls are unknown U-A1 (§16).

### 3.2 Six separate concepts

| Concept | Question | Set by | Today | It never means |
|---|---|---|---|---|
| **CONFIG APPROVED** | Has this exact config version been accepted? | customer admin + operator, per change class (v2 §11, §5, §6) | NEW (`account_config_versions`) | promoted, active, armed, or publishable |
| **PRODUCT ACTIVE** | Is the customer's account in operation (運用中)? | operator (MVP) | NEW (`lifecycle_state`) | armed, executable, publishable, admitted, or holding any authority |
| **CONTENT APPROVED** | Did an authorized approver approve this exact content for this account under this snapshot? | approver | existing workflow, extended binding (v2 §9.1) | approval of any other content, account, offer or snapshot |
| **ARMED** | Is the account's publish gate armed? | operator through the existing `arm()` | existing | product activity, or permission to publish without the other controls |
| **LIVE ADMISSION** | May this exact item be published on this account **now**? | evaluated by the existing live controls (§3.3) at admission and again at publication | existing controls, not a stored grant | anything that persists. Onboarding never stores, caches or pre-computes it. |
| **EXECUTION AUTHORITY** | Is there a current CATFOOD TTL / generation-bound grant? | existing CATFOOD control path | existing, **CATFOOD only** | general live-publication authority, or anything onboarding can grant or depend on |

### 3.3 Live admission predicate

**Current accounts (A1, A2, and every account that is not onboarding-managed):
unchanged.** v3 adds, removes or reorders nothing:

```
LIVE_ADMISSION_current(item, account) =
      admin authorization valid for the action
    ∧ account / content / version / hash checks pass
    ∧ credential identity matches the account
    ∧ allow_live
    ∧ ARMED
    ∧ ¬STOP
    ∧ QA PASS ∧ CONTENT APPROVED (existing workflow)
    ∧ rate limits
    ∧ finite NIGHT batch constraints            -- only where the path is a NIGHT batch
    ∧ CATFOOD execution authority               -- only on CATFOOD paths that already require it
```

**Future onboarding-managed accounts:**

```
LIVE_ADMISSION_onboarded(item, account) =
      LIVE_ADMISSION_current(item, account)
    ∧ PRODUCT ACTIVE                            -- G-ACTIVE: extra guard, separately approved (§3.4)
    ∧ ¬ingress_fence(account)                   -- G-FENCE: §4.2, separately approved
    ∧ snapshot checks (v2 §8.4, §12.3)
    ∧ approval bound to (account_id, content_hash, snapshot_hash) (v2 §9.1)
    ∧ latest restriction evaluation = PASS (§5)
```

Every added term is a conjunct. Each can only **remove** admission. None can
create it. This replaces the v2 §3.2 predicate and the first bullet of v2
§8.4.

### 3.4 PRODUCT ACTIVE and ARMED

- PRODUCT ACTIVE is **not** armed, executable, publishable, admitted, or an
  authority grant.
- **Onboarding-managed accounts** carry an `onboarding_managed = true`
  attribute, set when the onboarding path creates the account. Only a
  separate, approved migration decision may change it.
- For onboarding-managed accounts only, PRODUCT ACTIVE becomes **one
  required condition** of live admission, through guard **G-ACTIVE**: an
  extra conjunct in the admission path and an `arm()` precondition. G-ACTIVE
  is a MAINLINE change. It needs its own design note, tests and approval.
- **Until G-ACTIVE exists, no onboarding-managed account is eligible for live
  admission at all** (fail closed). Such accounts stay in SHADOW.
- **A1 and A2 get no new ACTIVE-required gate by default.** For them, a
  missing `lifecycle_state` never blocks anything. Bringing A1/A2 under
  onboarding rules is a separate migration decision.
- The CATFOOD TTL mechanism is **not** reused as the live-admission
  mechanism for onboarding-managed accounts or for any other account.
- No lifecycle transition arms, sets `allow_live`, grants admin
  authorization, mints CATFOOD authority, raises a rate limit, or clears
  STOP.
- APPROVED → ACTIVE is an operator lifecycle action only. Arming is a
  separate, later, existing operator action with its own confirmation.

### 3.5 Amendment to v2 §3.5 (mapping to `status`)

The rule "`status = active` only when `lifecycle_state = ACTIVE`" and the
`arm()` lifecycle precondition apply **only to onboarding-managed accounts**,
and only once G-ACTIVE is approved. For every other account, `arm()` behaves
exactly as today.

### 3.6 Correction to the SHADOW boundary (v2 §10.2, first row; v2 §10.3)

| SHADOW must not obtain | Enforcement (v3) |
|---|---|
| live publication | The shadow principal `shadow:<account_id>` cannot satisfy `LIVE_ADMISSION` because it structurally lacks: publish-purpose credentials (secret-store refusal), admin authorization, the ability to set `allow_live`, the ability to call `arm()`, and live-queue write rights. For onboarding-managed accounts, G-ACTIVE also applies. **The boundary does not rely on CATFOOD execution authority.** The shadow principal cannot mint it either. |

The v2 §10.3 negative-test list is corrected. "Authority mint" is replaced by
**each live control separately**: admin authorization, setting `allow_live`,
`arm()`, publish-purpose credential read, live queue insert, live approval
creation, and CATFOOD authority mint where that path exists. Every one of
them must fail closed for the shadow principal.

---

## 4. Corrected quiescence / fence model (brief item 3)

### 4.1 What v2 got wrong

- A DB lock serializes writes. It does not prove that work outside the
  database has stopped. (v2 already said this; kept.)
- v2's fence only stopped **issuing new authority**. Under §3.1 there is no
  universal authority to stop issuing, and stopping issuance does not stop
  admissions that need no new grant.
- v2 made PAUSED wait for quiescence while counting STOP / kill switch as a
  quiescence blocker. STOP could therefore prevent PAUSED. That is circular.

### 4.2 Phase A — STOP REQUEST / INGRESS FENCE

- **Trigger:** STOP, a pause or suspend request, an offboarding request, or a
  config promotion that can affect execution.
- **Record (v3.1):** one **hold** per reason, not one shared flag:
  `ingress_holds(hold_id, account_id, reason_kind, reason_ref, owner, raised_by, raised_at, bound_config_version NULL, expected_old_version NULL, released_by NULL, released_at NULL)`
  (design sketch, not a migration). `ingress_fence(account_id)` is true
  while **any** hold on the account is unreleased. `fence_ts` in §4.3 means
  the `raised_at` of the hold being drained. Ownership and release rules:
  §4.7.
- **Effect, immediate:** `LIVE_ADMISSION` is false for every **new** item
  on the account. It is checked at admission and again at publication for
  items not yet started. `disarm()` is always allowed immediately.
- **Never waits** on anything. Never aborts an in-flight provider call.
  Never retries, cancels or self-heals any work.
- **STOP is a fence** (the strongest one). It is never a blocker for
  reaching any fenced state.
- **Scope:** this section governs onboarding-managed accounts. For A1, A2
  and every other account that is not onboarding-managed, nothing here
  changes current behaviour. Their fence remains the existing controls.
- **G-FENCE:** enforcing the fence inside the admission path is a separately
  approved MAINLINE change. Until it exists, the only fence available is the
  existing controls (`disarm()`, STOP, `allow_live` off), and execution-
  affecting config promotion is **not available** for onboarding-managed
  accounts, except under the NEVER_LIVE proof (§4.6). The G-FENCE design
  note must satisfy the invariants F1–F7 (§4.7, v3.1) before G-FENCE
  implementation can be planned.

### 4.3 Phase B — DRAIN COMPLETE / QUIESCENT

`quiescent(account_id) → {quiescent, blockers[], evidence[], evaluated_at}`.
Read-only. Each condition comes from its own authoritative evidence source
(U-Q1). **Unknown or unreadable evidence counts as not quiescent.**

| # | Condition (all required) | Fails when |
|---|---|---|
| Q1 | no new admission | an admission is recorded for the account after `fence_ts`, or the fence is not in place |
| Q2 | no active provider claim | any claimed provider container / creation id not yet confirmed or abandoned |
| Q3 | no in-flight publication | any publication record in a pre-terminal state |
| Q4 | no partial publication | any multi-part / self-reply thread with some parts published and some not |
| Q5 | no ambiguous publication | any unresolved publication-recovery case. **Only an operator resolves it.** |
| Q6 | no reconciliation pending | any open external reconciliation run or deletion tombstone |
| Q7 | no active finite batch | any open NIGHT batch or loop-runner window including the account |
| Q8 | no account armed for publication | ARMED, or `allow_live` still on for the account, or (CATFOOD paths only) an unexpired CATFOOD execution authority covering the account |
| Q9 | no active recovery / incident path | an incident procedure or recovery procedure is **in progress** for the account |

- Q9 is about an active **recovery path**, not about STOP. A STOP that is
  engaged with no recovery in progress does not block Q9.
- Scheduled approved work inside a change's impact window is **not** a
  quiescence condition. It is reported as impact for change classification
  (v2 §11.1).
- Nothing in Phase B kills, retries or resolves work. It waits for natural
  completion or for operator action.

### 4.4 Which operations need what

| Operation | Needs fence (Phase A) | Needs QUIESCENT (Phase B) | Notes |
|---|---|---|---|
| STOP | is a fence | no | |
| ACTIVE → PAUSED | yes | **no** | lifecycle becomes PAUSED as soon as the fence is in place |
| ACTIVE → SUSPENDED (operator) | yes | **no** | same |
| PAUSED → ACTIVE (resume) | releases **only the PAUSE hold** (§4.7 F6) | no (F7). A remaining hold keeps admission false; resume never waits for it. | gates re-checked. No live control restored. Arming stays separate. Returns to ACTIVE only when no other hold remains (F7). |
| pure restriction (§5) | no | no | applies at admission and publication |
| config promotion that can affect execution | yes | **yes** | re-checked inside the apply transaction (TOCTOU) |
| ownership transfer, identity re-bind, publish-credential replacement | yes | **yes** | |
| → OFFBOARDED | yes | **yes** | |

PAUSED and SUSPENDED mean **"no new admission"**. They carry a separate
`drain_state`:

| `drain_state` | Meaning | Customer copy (no internal names) |
|---|---|---|
| `DRAINING` | fence in place; some Q2–Q8 work still finishing | 「停止しました。処理中の投稿を確認しています」 |
| `QUIESCENT` | Q1–Q9 all hold, with evidence | 「停止しました」 |
| `BLOCKED_ON_OPERATOR` | Q5, Q6 or Q9 needs operator action | 「停止しました。担当者が確認しています」 |

There is no circular requirement: PAUSED needs only the fence, the fence
never waits, STOP is itself a fence, and QUIESCENT does not require the
absence of STOP.

### 4.5 Promotion protocol (replaces v2 §3.6 protocol)

1. **Fence** (Phase A): raise a `CONFIG_CHANGE` hold bound to
   `expected_old_version = vN` and `bound_config_version = vN+1` (§4.7 F2, F3).
2. **Drain by evidence** (Phase B). Wait. Never kill or self-heal.
3. **Apply** in one serialized step (§4.7 F4): re-evaluate `quiescent()`
   (TOCTOU), check that the active version is still `expected_old_version`,
   then promote the version pointer, write the legacy projection and append
   audit. If any re-check fails, abort and keep the hold.
4. **Release** only the `CONFIG_CHANGE` hold raised in step 1. Every other
   hold (STOP, pause, suspend, incident, offboarding, another change) stays
   exactly as it is (§4.7 F6).

### 4.6 NEVER_LIVE: the simplified proof for accounts that never had live authority

v2's "accounts that never left SHADOW need only Q9" is withdrawn. A simpler
proof is allowed **only** when absence is **positively verified**:

| # | Must be shown, from an authoritative source | |
|---|---|---|
| N1 | the account was never armed | no arm event for the account in the arm audit |
| N2 | `allow_live` was never set for the account | |
| N3 | no publish-purpose credential was ever bound to the account | |
| N4 | no publication, provider claim, part, recovery or reconciliation record exists | |
| N5 | the account was never in a NIGHT batch or loop-runner window | |
| N6 | no live queue row and no live approval exists | |
| N7 | no CATFOOD execution authority row exists for the account | only where CATFOOD applies |

- Each check must come from a source that is **known to record the event
  from the account's creation onward**. If a source was introduced later, or
  has been purged or rotated, the proof fails and the full §4.3 predicate
  applies.
- The proof is recorded with evidence (source, query identifier, count,
  timestamp). It is **re-proven every time**. It is not a sticky flag.
- "No evidence found" is never the same as "positively verified absent".

### 4.7 G-FENCE contract invariants (v3.1)

These are requirements on the future **G-FENCE design note**. They must all
be answered before G-FENCE implementation planning starts. They do **not**
prescribe a mechanism. An epoch / generation counter is one acceptable
mechanism, not a mandatory one: a single serialized DB transaction, a
per-account claim row with a conflicting write, or another mechanism is
equally acceptable if the note proves F1–F7.

| # | Invariant | The G-FENCE note must state |
|---|---|---|
| F1 | **Covered durable claims.** The fence blocks every durable claim that can lead to a provider call without passing another admission check. | the exact list, at least: live queue insert / `publish_ready` transition, live slot reservation, NIGHT batch or loop-runner inclusion, publication record creation, provider container / creation claim, publish-purpose credential checkout. A claim type that is not listed is not covered, and G-FENCE is not complete. Continuation parts of a publication admitted **before** the hold are in-flight work (Q3, Q4), not new admission. Whether STOP halts them follows existing STOP semantics, unchanged. Inventory: U-F1. |
| F2 | **Account / config generation binding.** Every admitted claim records the `account_id`, the active config version, and the account identity / credential binding it was admitted under. | where the binding is recorded, and that a publication-time re-check refuses a not-yet-started claim whose recorded binding is no longer current |
| F3 | **Expected old version during transition.** A config switch is compare-and-set: it applies only if the active version still equals the hold's `expected_old_version`. | what happens to claims recorded under the old version: started ones drain (Phase B); not-yet-started ones are refused after the switch and need fresh admission under the new version (with a new snapshot, and approval per change class). An expected-version mismatch aborts the switch and keeps the hold. |
| F4 | **Serialization.** Admission, hold state (raise / release / read) and the config switch are serialized per account. | how it is proven that an admission either commits before the hold (and is then visible to Q1–Q3 drain evidence) or observes the hold and refuses, never both; and that the switch re-reads holds, quiescence and the expected version in the same serialized step. Admission work outside the DB must hit the same serialization point (for example, through a claim row write) before any provider call. |
| F5 | **Ownership per reason.** Each hold has exactly one owning reason and one owner. | the owner table below, and who may release |
| F6 | **No cross-release.** Releasing one reason's hold never releases another's. | release acts on one `hold_id`, is refused for a principal that does not own that reason, and leaves every other hold active. `ingress_fence(account)` stays true while any hold is unreleased. |
| F7 | **Resume.** Resume does not universally require drain, but never bypasses another active hold. | PAUSED → ACTIVE releases only the PAUSE hold, without waiting for QUIESCENT. If any other hold remains, the account stays PAUSED (or SUSPENDED) with the remaining hold named (customer copy 「停止中（担当者が確認しています）」), and admission stays false. A resume never releases, shortens or overrides a STOP, SUSPEND / incident, OFFBOARDING or CONFIG_CHANGE hold. |

Owner per reason (F5):

| `reason_kind` | Raised by | Owner (sole releaser) | Release rule |
|---|---|---|---|
| `STOP` | existing STOP control | existing STOP procedure | existing STOP semantics. G-FENCE reads STOP; it never owns, releases or clears it. |
| `PAUSE` | customer admin / editor, or a pause rule | customer admin (resume) | §4.4 resume row and F7. A pause rule's hold is released only by an explicit resume, never by the rule's condition clearing. |
| `SUSPEND` / `INCIDENT` | operator | operator, with reason code | an incident or recovery path in progress (Q9) is closed first |
| `OFFBOARDING` | org admin request + operator | none | terminal. Never released. |
| `CONFIG_CHANGE` | the promotion procedure (§4.5) | that promotion, on completion or abort | §4.5 step 4 |
| `IDENTITY_CHANGE` (ownership transfer, identity re-bind, publish-credential replacement) | operator | that procedure, on completion or abort | §4.4 (needs QUIESCENT) |

The exact list of claim types (F1) and where each is recorded is unknown
U-F1. Until it is known, G-FENCE is not complete and §4.2's fail-closed
default (no execution-affecting promotion) stays.

---

## 5. Restriction-only changes and existing approvals (brief item 4)

### 5.1 Decision

DOT recommendation adopted: **SAFE WITH CONDITIONS.**

Scope: the approval semantics of onboarding-managed accounts (v2 §9). The
current A1/A2 approval workflow is unchanged unless it is separately
migrated.

### 5.2 Conditions (all required)

An existing content approval may remain valid after a restriction is added
only when **every** condition below holds:

| # | Condition |
|---|---|
| R1 | account and provider identity unchanged |
| R2 | content version and content hash unchanged |
| R3 | CTA destination unchanged |
| R4 | selected offer and fact snapshot (SOFS hash, §11) unchanged |
| R5 | semantic meaning of the approved publication unchanged |
| R6 | the change only **narrows** allowed behaviour |
| R7 | no loosening is mixed into the same change (otherwise E150; split it into separate versions, v2 §11.1) |
| R8 | the **latest** restriction set is evaluated again on the exact content before publication |
| R9 | an evaluation failure, of any kind, blocks publication |
| R10 | queued, scheduled and approved-but-unpublished items are checked for compatibility (§5.4) |

If any condition does not hold, the change is not restriction-only, and
v2 §9.2 (invalidation) applies.

### 5.3 Mechanics

- The approval record is **never rewritten, re-issued or re-bound** to a new
  restriction version, snapshot or hash.
- Each publication attempt writes an evaluation record:
  `restriction_evaluations(approval_id, content_hash, snapshot_hash, restriction_set_version, result, evaluated_at)`.
- Results:

| Result | Effect |
|---|---|
| `PASS` | this publication may continue, subject to the rest of `LIVE_ADMISSION` |
| `FAIL` (the content violates the latest restriction) | publication blocked. The approval becomes **INVALIDATED**, which is terminal. |
| `ERROR` (the evaluation could not complete) | publication blocked. The approval is neither invalidated nor revived. The next attempt needs a fresh `PASS` against the then-latest restriction set. |

### 5.4 Queued-item compatibility check (R10)

When a restriction is promoted, a scan covers every queued, scheduled and
approved-but-unpublished item of the account:

- compatible → listed, unchanged
- incompatible → approval INVALIDATED, item blocked
- not evaluable → item blocked and listed for review

The scan is a report plus a pre-block. The publication-time evaluation (R8)
remains authoritative.

### 5.5 When content must change

If satisfying the restriction requires editing the content, the result is a
**new content version** with a new content hash, new QA and a **new
approval**. The old approval is never moved onto the new version.

### 5.6 When a restriction is later removed

Removing a restriction is a loosening (REVIEW_REQUIRED, v2 §11.2). It **never
revives** an approval that was invalidated while the restriction was in
force. INVALIDATED is terminal. A fresh approval is needed.

### 5.7 Typical restriction-only changes

added banned term, added prohibited topic, offer availability → paused or
ended, lower daily cap, lower CTA frequency, approval policy tightened.

An offer availability change to `paused` makes conversion content for that
offer fail R8, so its approval is invalidated. A later return to `accepting`
does not revive it (§5.6).

A narrowed posting window that excludes an already approved slot is **not**
restriction-only for that item: moving the slot is a semantic change
(v2 §9.2).

---

## 6. Approver changes (brief item 5)

Adding or removing an approver is **REVIEW_REQUIRED**. "At least one
approver remains" is necessary, but it is **not** sufficient.

| Requirement | Rule |
|---|---|
| authorized admin | performed by an org admin of the **owning** org, or the operator in MVP. A delegate (§8) cannot add or remove approvers. |
| account scope validation | an added approver must have access to the account through the owning org's role or an active delegation (§8) |
| role validation | the approver's role on the account must permit approval. A viewer cannot become an approver. |
| pending-approval impact review | lists pending approval requests and approved-but-unpublished items related to the added or removed approver |
| audit record | actor, actor org, access basis, account, approver, change, reason, impact-review result |

Impact review for a **removal**:

- Pending requests assigned to the removed approver are **reassigned only by
  explicit decision**, or expire as `skip` (v2 §9.4). No automatic
  reassignment.
- For each approved-but-unpublished item approved by the removed approver,
  the reviewer records **keep** or **invalidate**. There is no default
  "keep". Until the decision is recorded, the item is blocked from
  publication (fail closed).
- Removing the last approver is refused (E091, unchanged).

No narrower SAFE case is defined. A future policy may define one explicitly.

---

## 7. Style provenance and readiness (brief item 6)

### 7.1 Provenance classes (replaces v2 §5.7)

| Class | Source | Status |
|---|---|---|
| `DERIVED_OWN_HISTORY` | real own past posts | existing path |
| `BENCHMARK_DERIVED` | reference accounts through manual intake | existing path |
| `MANUALLY_APPROVED_STYLE` | an account-bound style specification, reviewed in SHADOW and explicitly accepted | **future design option. Not current Production behaviour.** |
| `TEMPLATE_DEFAULT` | template data only | never an accepted style |

### 7.2 `MANUALLY_APPROVED_STYLE` requirements (all)

| # | Requirement |
|---|---|
| M1 | **account-bound** style version and content hash. It cannot be shared or copied to another account by reference. |
| M2 | **template lineage**: template id and version it started from, plus a diff of the edits |
| M3 | SHADOW samples generated with this exact style version were **reviewed** (sample ids recorded) |
| M4 | reviewer identity, reviewer authority (role at the time) and timestamp |
| M5 | persona / account isolation checks passed: the samples do not imitate another managed account's persona or voice |
| M6 | source-copy checks passed: no reference or source text is reproduced |
| M7 | explicit **final operator acceptance**, recorded separately from the reviewer's |

Prohibitions:

- A manually approved style is never presented as derived from historical
  posts or from benchmark research.
- No research posts, benchmark rows or packets are fabricated to satisfy
  readiness. (v2 §5.6 rule retained.)

### 7.3 Two separate readiness blockers

Current readiness has **separate** blockers for `research` and
`style_profile` (DOT re-audit). Their exact predicates are unknown U-S2.

| Provenance | Clears `style_profile` blocker? | Clears `research` blocker? |
|---|---|---|
| `DERIVED_OWN_HISTORY` | yes (existing) | only as the existing contract already defines. v3 assumes nothing more. |
| `BENCHMARK_DERIVED` | yes (existing) | only as the existing contract already defines. v3 assumes nothing more. |
| `MANUALLY_APPROVED_STYLE` | **only** through a future readiness adapter contract **RA-1** | **no**. It needs its own explicit future contract **RA-2**. |
| `TEMPLATE_DEFAULT` | never | never |

v3 does not assume that Research Intelligence v1 (`ri_*`) output satisfies
the `research` readiness blocker. That binding is part of U-S2.

### 7.4 Readiness adapter (replaces v2 §5.8)

- `accounts.validate()` keeps its `research` and `style_profile` items
  **unchanged** for every account.
- A report-only `style_readiness(account_id)` returns
  `{class, profile_ref, lineage?, reviewed_samples?, reviewer?, accepted_by?, research_blocker, style_blocker}`.
  It never turns a blocking item into a pass.
- **RA-1** (manual style may clear `style_profile`) and **RA-2** (how a
  brand-new account may clear `research`) are **readiness-contract changes**.
  Each needs its own design note, tests showing existing accounts' readiness
  is byte-identical, and DOT approval.
- Until then, a brand-new account with no posts and no references **cannot
  reach APPROVED** (E050). SHADOW may still run with `TEMPLATE_DEFAULT` or
  candidate `MANUALLY_APPROVED_STYLE`, with every sample labelled by class.
- (v3.1) RA-1 and RA-2 remain **future contract work**. Nothing in v3 or
  v3.1 makes either one current. Neither is part of slice 1 (§17.1).
- (v3.1) A manual style **never silently** affects the `research` blocker.
  No readiness report, adapter, gate, UI or summary may show research as
  satisfied, partly satisfied or "not needed" because a style is accepted.
  The research blocker changes only through RA-2.

### 7.5 Re-review triggers for `MANUALLY_APPROVED_STYLE` (v3.1)

An accepted manual style version is acceptance of **one exact style version
under one exact context**. Any trigger below makes it `REVIEW_DUE`. A
`REVIEW_DUE` style counts as **not accepted** (fail closed) until M3–M7 are
repeated with new SHADOW samples:

| # | Trigger | Examples |
|---|---|---|
| T1 | **persona change** | any change to tone, stance, persona profile, first person or signature phrases, or `persona.provenance` |
| T2 | **template / style change** | new template version adopted, template lineage changed, the style specification edited (any change to its content hash) |
| T3 | **provenance revocation** | the template version is withdrawn, a reference input in the lineage is revoked, the reviewer's or accepting operator's authority is found invalid for the acceptance time, or an isolation (M5) or source-copy (M6) finding is raised later |
| T4 | **meaningful new quality evidence** | a QA hard-fail pattern, a customer NG or reject spike, a copy or isolation finding, or an operator-recorded quality finding attached to the style version |

- RA-1 must define "meaningful" for T4 with explicit thresholds. Until then,
  **every** operator-recorded quality finding attached to the style version
  is meaningful.
- A re-review never edits the old acceptance record. It produces a new
  acceptance (or a rejection) for the then-current style version.
- What `REVIEW_DUE` does to an account that already relies on the style is
  RA-1 scope. Today that case cannot arise, because RA-1 does not exist.

### 7.6 Manual Post Sync is not automatically a sufficient style corpus (v3.1)

- Importing own posts through Manual Post Sync (v1 `account.use_past_posts`)
  only **supplies input** to the existing style pipeline. Sync completion is
  not style readiness.
- Synced posts become `DERIVED_OWN_HISTORY` evidence only when the existing
  style pipeline has **actually built and versioned** a style profile from
  them under its existing requirements (own-account identity, analyse
  enablement, and any corpus minimum it applies). The `style_profile`
  blocker clears only through the existing predicate on that built profile.
- A small, empty, unverified or unbuilt sync leaves the blocker in place
  (E050). Onboarding never pads it with template, synthetic, benchmark or
  `ri_*` rows (v2 §5.6).
- Manual Post Sync never clears the `research` blocker.
- The exact corpus requirements are part of U-S2.

---

## 8. Cross-org delegation model (brief item 7)

### 8.1 Decision

DOT recommendation adopted: **cross-org membership is explicit DELEGATION,
not ownership.**

```
operating account ──1──▶ owning organization            (ownership)
operating account ──n──▶ delegated users / orgs         (delegation, explicit)
```

### 8.2 Five separate dimensions

| Dimension | Meaning | Determined by |
|---|---|---|
| **Ownership** | which org owns the account (contract, offboarding, final authority) | `account_ownership` (v2 §7.4), exactly one current owner |
| **Delegation** | a user (or another org's user) granted access to a specific account | explicit delegation record (§8.3) |
| **Billing attribution** | whom the account's cost is attributed to | the **owning** org at event time. Never the delegate. |
| **Audit attribution** | who acted, and on what basis | acting user + acting user's org + access basis (`org_role` or `delegation_id`) + owning org at event time |
| **Role** | what the actor may do on the account | the owning-org role, or the role stated on the delegation |

### 8.3 Delegation record (future, design sketch, not a migration)

```
account_delegations(
  delegation_id, account_id, owning_org_id,
  delegate_user_id, delegate_org_id NULL,
  role,                                   -- validated against allowed delegate roles
  granted_by, granted_at, expires_at NULL,
  revoked_by NULL, revoked_at NULL, reason
)  -- append-only
```

- Granted only by an admin of the owning org (operator in MVP).
- A delegation never confers ownership, billing responsibility, offboarding
  rights, approver management (§6), further delegation, or ownership
  transfer.
- Revocation takes effect at the next authorization check. Pending approval
  requests assigned to a revoked delegate follow the §6 removal review.

### 8.4 Existing cross-org memberships

Existing `user_account_memberships` rows that reference an account outside
the user's org (v2 §7.2, U-T3) are **inventoried**, not changed. Each row is
classified by the operator as **intended delegation** (later re-recorded with
granter evidence) or **error** (operator decision). Until classified,
behaviour is unchanged. Nothing is silently removed.

### 8.5 No destructive migration before inventory

- No `UNIQUE(account_id)` and no other destructive constraint on
  `org_accounts` until existing links and history are inventoried
  (v2 §7.4 step 1, extended with the cross-org membership classification
  from §8.4).
- No history rewrite. Past audit, authority and cost rows keep the org that
  was recorded when they were written.

### 8.6 Same-org allowlisting (replaces v2 §7.3)

- Strict same-org account allowlisting (AUTHZ-ALLOWLIST) is **not planned**
  and is removed from the dependency list. It is reconsidered only if a real
  product requirement appears.
- Customer A: unchanged.
- Customer B: an editor with an org role in org B sees all org-linked
  accounts. This is the current contract and stays. An agency user who
  should see only accounts 1–3 belongs to the agency's own org and receives
  **explicit delegations** on accounts 1–3.

---

## 9. Research Intelligence v1 (brief item 8)

### 9.1 Frozen v1 contract, stated exactly

**Two different objects (v3.1, DOT final re-audit):**

| Object | What it is | Carries the four advisory fields? |
|---|---|---|
| `ri_packets` row | the stored, account-scoped packet | **not required.** A packet row is valid without them. It is identified by its packet id, its account id and `ri_packets.payload_hash` (exact column names other than `payload_hash`: U-R1). |
| **planning-input / export envelope** | what v1 emits for downstream planning | **yes**, exactly as below |

The planning-input / export envelope carries:

```
authority                                  = "suggestions_only"
verified_facts                             = []
requires_explicit_operator_plan_decision   = true
writer_input_authorized                    = false
```

- Onboarding never changes these values.
- An onboarding adapter that consumes v1 output reads it **through the
  envelope** and **fails closed** if the envelope is missing any of the four
  fields or any value differs (for example `writer_input_authorized = true`).
  Such an envelope is rejected as a contract violation.
- The adapter does **not** require these envelope-only fields on each
  `ri_packets` row, and does not reject a packet for lacking them. If a
  packet row does carry one of them with a contradicting value, that is
  also a contract violation (fail closed).
- Reading `ri_packets` directly, bypassing the envelope, never grants more
  than the envelope would. The four values above apply to everything v1
  produces.
- The exact envelope name and field paths are part of U-R1.

### 9.2 What a ResearchSelection is, and is not

A ResearchSelection **records**:

- **who** selected
- **what** packet / source items
- for **which account**
- for **which plan**

It does **not** turn research into:

- a verified fact (`verified_facts` stays `[]`; any factual claim must go
  through fact assertion → verification, v2 §4.2)
- Writer authority (`writer_input_authorized` stays `false`)
- planning authority (`requires_explicit_operator_plan_decision` stays
  `true`. The plan decision remains a separate, explicit operator act in the
  existing planning path.)

Selected items reach Planning as **reference suggestions, labelled
`suggestions_only`**. The Writer never reads `ri_*`. The research-leak and
copy guards stay.

### 9.3 ResearchSelection record (replaces v2 §5.2)

```
research_selections(
  selection_id, account_id, plan_id,
  packet_id, packet_payload_hash,         -- v3.1: ri_packets.payload_hash as read at selection time
  item_refs_json,                         -- item refs; per-item hash only where payload_hash does not cover the ref (§12.3)
  selection_mode,                         -- CHECK (selection_mode = 'operator_manual')
  selected_by, selected_at,
  revoked_by NULL, revoked_at NULL
)
```

- `selection_mode` has exactly one allowed value: `operator_manual`.
  There is **no** `policy_id` column. Policy-based selection is a separate
  future authority expansion and is not mixed into current behaviour.
- Guards: `selection.account_id = packet.account_id = plan.account_id`.
- (v3.1) At plan build, `ri_packets.payload_hash` is read again. If it
  differs from `packet_payload_hash`, the selection is stale and the plan is
  not built from it (fail closed). It needs a new `operator_manual`
  selection.
- Revocable before plan generation. After generation it is part of the
  immutable snapshot.
- (v3.1) Selection is **only** `operator_manual`: a human operator act on the
  existing planning path. No form field, template, catalogue entry, schedule
  or score may select research.

### 9.4 Additional v1 constraints

| # | Constraint |
|---|---|
| V1 | A third account is **not generic** today (E043 retained) |
| V2 | Source and cache stay **account-private**, which is the current model |
| V3 | There is **no shared source cache** |
| V4 | **Stale does not automatically mean rejected.** A stale item stays a suggestion labelled stale. Onboarding never turns staleness into rejection or deletion. |
| V5 | The fixed v1 relevance behaviour is **not an arbitrary customer threshold**. No form field changes it. |
| V6 | **SourceSpec fields remain the known bounded contract.** A field that is not confirmed is MISSING (§9.5). |
| V7 | A **`source_type` name does not prove the transport exists.** A type is selectable only when its transport is confirmed working. |
| V8 | **Changing a source version does not automatically disable old sources.** Disabling a source is a separate explicit action. Old packets keep their source-version reference. |
| V9 | (v3.1) **Freshness is a fixed v1 classification, not a selectable policy** (DOT final re-audit). v1 classifies items with its existing fixed rules. No form field, template, catalogue entry or operator setting chooses, tunes or switches a freshness rule set, window or threshold. Onboarding only **displays** the label v1 assigned, and V4 still applies. |
| V10 | (v3.1) **Manual TOPIC intake is existing v1 behaviour** (DOT final re-audit). It is an operator act on the existing v1 path, account-scoped. Onboarding adds no new intake channel and no customer-facing upload into `ri_*`. It is separate from manual **STYLE** intake (benchmark posts → `account_research_posts`), and the two never cross-feed (v2 §5.6). |

### 9.5 Corrections to the v2 §5.5 field matrix

| Field | v2 | v3 |
|---|---|---|
| `topics[].weight` | ADAPT if v1 takes weights | **MISSING** until U-R2 confirms. Weights may still be used downstream in **planning** only. |
| `topics[].subtopics` | ADAPT if v1 accepts them | **MISSING** until U-R2 confirms |
| `exclude_keywords` / `exclude_topics` | ADAPT via v1 exclusion if present | **MISSING** on the research side until U-R2 confirms. A planning-side filter on **selection** stays allowed. It never mutates packets. |
| `manual_intake` (TOPIC) | ADAPT if a SourceSpec type covers it | v3: MISSING. **v3.1: COMPATIBLE as existing behaviour** (V10). It is an operator act, not a form or profile field. The compiler emits nothing for it. |
| `manual_intake` (STYLE) | STYLE intake | unchanged: STYLE only (§7, v2 §5.6) |
| `sources[].adapter` | ADAPT, existing types only | ADAPT only for existing types **whose transport is confirmed** (V7) |
| `research.freshness` | labels mapping 1:1 to v1 rule sets | v3: unchanged. **v3.1: CONFLICT, withdrawn as a form field** (V9). There is no selectable rule set. The fixed v1 classification is displayed, not configured. |
| `topics[].intent` (news / evergreen) | ADAPT: mapped to a v1 freshness rule set | **v3.1: MISSING on the research side** (V9: nothing to map to). It may stay a **planning-side** preference only. |
| relevance threshold | 0.55 withdrawn | unchanged, plus V5 |

v3.1: §17.6 is the single field-status table used to freeze the first
catalogue. Where §17.6 and this table differ, §17.6 wins.

---

## 10. Corrected cost model (brief item 9)

### 10.1 Current capability (DOT re-audit)

| Capability | Status | Used for |
|---|---|---|
| AI usage ledger | exists | attribution and reporting. The `shadow` lane is tagged where the path records it. |
| **Writer-specific daily limits** | exist and are enforced on the Writer path | the Writer path. The only limit the onboarding desired-limit figure may feed (§10.3). |
| **Research v1 daily AI limits** (v3.1, DOT final re-audit) | exist inside frozen Research v1 and are enforced by v1 on its own path | v1's AI calls (for example enrichment). Frozen: onboarding reads them, never sets, raises or parameterizes them. |
| **Research v1 USD budget limits** (v3.1, DOT final re-audit) | exist inside frozen Research v1, in **USD**, enforced by v1 on its own path | v1's spend. They are **path-local**, not a monthly JPY customer cap and not a unified budget. Frozen, as above. |
| **Research v1 source / fetch limits** (v3.1, DOT final re-audit) | exist inside frozen Research v1 | bound collection volume per source / run. Frozen, as above. |
| Unknown-cost call handling | exists for some paths | where implemented, an unknown price is never counted as zero. Elsewhere the cost shows 「算出不可」. |
| Deterministic / no-AI mode | exists where the template wording path supports it | `cost.no_ai_mode` |

The exact names, units, windows and values of the Research v1 limits are
unknown U-C4. v3.1 claims only that they exist and are enforced by v1 on the
v1 path. It does **not** claim that they cover any non-Research path.

### 10.2 Not current

- a universal, feature-wide, atomic monthly JPY hard cap
- unified budget enforcement across every AI, research and SHADOW path. The
  Writer limits and the Research v1 limits are separate, path-local
  controls. Together they are **not** a unified governor: there is no
  shared reservation, no cross-path total and no JPY month.
- enforced per-feature daily caps on paths other than the Writer and the
  Research v1 path. Treated as **not enforced** until enforcement on that
  specific path is confirmed (U-C3). v3.1 does **not** claim that every
  non-Writer path is estimate-only: the Research v1 path has its own
  enforced limits (§10.1).
- the frozen **Cost Governor v2** and **CI-01** are **not Production**. Any
  integration is a separate promotion through the PROMOTION WINDOW
  (`docs/HQ_DECISIONS.md`).

### 10.3 Monthly JPY = DESIRED LIMIT / ESTIMATE

- `cost.monthly_cap_jpy` is relabelled 「月額の目安（希望の上限）」 and stored
  as `desired_monthly_jpy` intent (unchanged from v2).
- The compiler may derive a **Writer daily-limit proposal** from it,
  conservatively. That is the only enforcement the figure can feed today.
- (v3.1) The figure **never** changes the Research v1 daily AI, USD budget
  or source/fetch limits. The Research v1 path stays limited by its own
  frozen limits, whatever the customer enters. The estimate shows Research
  v1 usage against those limits only as reporting.
- Usage on paths that are neither the Writer nor Research v1, and have no
  confirmed enforcement (U-C3), is **estimated and reported**, not limited.
- Customer copy: 「目安です。実際の利用額がこの金額を超えないことを保証するものではありません」.
- Wording that implies a monthly cap is enforced is withdrawn wherever it
  appears, including v1 `ops.pause_rules` 「月額上限に到達 (always on)」 and
  `cost.on_cap` 「その月は新しい投稿を作らない」 (§18).
- G9 / E120 are review items on the desired limit (v2 kept). "No cap breach
  during shadow" is withdrawn, because there is no monthly cap to breach. It
  is replaced by: "no unacknowledged unknown-cost call, and Writer daily-
  limit hits are listed".
- `org_budget` is a desired org-level total with no enforcement claim
  (v2 kept).

### 10.4 Future Cost Governor

v2 §6.3 requirements retained. A customer-facing hard monthly cap claim
needs a separately promoted Cost Governor integration.

(v3.1) Current vs future, kept apart:

| | Current (enforced today) | Future unified Cost Governor (not Production) |
|---|---|---|
| Scope | per path: Writer daily limits; Research v1 daily AI, USD budget, source/fetch limits | every AI / research / SHADOW path of an account and org |
| Unit | calls / USD, per path | one reserved + confirmed ledger, with pricing version and FX |
| Admission | each path checks its own limit | atomic reserve-or-refuse across paths |
| Monthly JPY | not enforced anywhere | possible only after promotion |
| Who changes limits | existing owners of each path. Onboarding changes none of the Research v1 limits. | the Governor's own policy, after promotion |

---

## 11. Selected-offer fact snapshot (brief item 10)

### 11.1 One canonical object

**SelectedOfferFactSnapshot (SOFS)** is built **once per plan** from the
verified projection and the selected offer revision. It is embedded by hash
in the ExecutionSnapshot. It is the **single** fact source for:

| Consumer | Rule |
|---|---|
| Writer input | the Writer receives exactly the SOFS facts (selected offer + role-required account facts), nothing else |
| request validation | before a generation call, every fact value in the request must equal the SOFS value, and the request may contain no fact key absent from SOFS. Any mismatch blocks the call. |
| QA | offer, price, CTA, eligibility and validity checks read SOFS only |
| approval binding | `snapshot_hash` covers the SOFS hash. The approval view shows the SOFS facts. |

### 11.2 Structure (design sketch)

```
SelectedOfferFactSnapshot {
  sofs_version: 1,
  account_id, offer_id, offer_type, offer_revision,
  facts: [
    { fact_type, value /* typed */, event_id, value_hash, status: "VERIFIED",
      valid_from, valid_until,
      provenance: { source_kind, source_ref, verified_by, verified_at } }
  ],
  account_facts: [ /* only those the plan's role requires; same shape */ ],
  legacy_aliases: [ { legacy_key, canonical: { offer_id, fact_type, projection }, derived_value_hash } ],
  sofs_hash
}
```

Only VERIFIED, unexpired, unrevoked facts can enter SOFS.

### 11.3 Typed price (replaces v2 §4.4 `price` row)

```
price {
  amount:          integer, minor units of `currency` (JPY: yen)
  currency:        ISO 4217 code
  tax:             incl | excl | not_applicable
  period_or_unit:  closed enum from catalogue data (once, per_month, per_session, per_minute, …)
  conditions:      [ { kind: closed enum, wording: verified text } ]
  offer_revision
  valid_from, valid_until
  provenance
}
```

`salary_range` follows the same pattern:
`{min, max, currency, period: hour | month | year, conditions, offer_revision, validity, provenance}`.

Rules:

- **The presence of a `price` key never validates any amount.**
- Every monetary expression in content is parsed. Each must match an amount,
  currency and period/unit in SOFS. If SOFS carries conditions, the content
  must state them.
- A mismatch fails QA. A parse that is uncertain fails closed.
- Price is mentioned only when the plan's role allows it (v2 §4.4).

**Tax semantics (v3.1):**

| `tax` | Meaning of `amount` | Content rule |
|---|---|---|
| `incl` | the verified amount **includes** consumption tax (税込), as shown by the verified source | content must state that amount with the 税込 basis, or with no basis where the compliance data says the total-price display needs no label |
| `excl` | the verified amount **excludes** consumption tax (税別 / 税抜), as shown by the verified source | content must state it with an explicit 税別 / 税抜 label. Whether a tax-excluded amount may be shown at all is decided by **compliance data**, not by the compiler (for example the 総額表示 rule for consumer-facing prices). Default floor: a consumer-facing offer may mention only an `incl` price. An `excl` price is usable only where the compliance data explicitly allows it. |
| `not_applicable` | the verified source states that no consumption tax applies | content must not add a 税込 or 税別 label |

- The system **never converts** between `incl` and `excl`, never assumes a
  tax rate, and never derives one amount from the other.
- `incl` and `excl` amounts for the same offer are **two separate facts**,
  each verified on its own.
- A price whose tax basis is unknown is **not** a typed price. It cannot
  enter SOFS, and no plan may mention it.
- A content tax label that differs from the SOFS `tax` fails QA, even when
  the number matches.

### 11.4 Legacy A1 aliases

- A1 is **not** onboarding-managed. Until a separate migration decision, A1
  runs on its current legacy path, unchanged.
- When A1 is represented in the offer model, each legacy key
  (`funnel_destination_url`, `free_reading_available`,
  `free_reading_application_method`, `free_reading_provider`,
  `primary_threads_goal`, `price`) may remain **only as an explicit alias**
  declared in data: `legacy_key → (offer_id, fact_type, projection)`.
- `price`: the account-wide legacy key may alias **exactly one declared A1
  offer's** typed price. It is never emitted from a generic offer-scoped
  fact, and never for any account other than A1. (This replaces v2's
  "`price` is not aliased": the account-wide key still never becomes a
  generic authorization.)
- **Conflict detection:** when a legacy value and its canonical value both
  exist, they are compared after normalization. A mismatch **fails closed**:
  SOFS is not built, no plan is generated, and E160 is raised. Neither side
  is silently preferred.

**Alias mapping rules (v3.1):**

| # | Rule |
|---|---|
| L1 | **Direction.** An alias is a read-only **projection** from canonical → legacy, for legacy readers. Writes never flow legacy → canonical through an alias. |
| L2 | **One-to-one.** Each `(account_id, legacy_key)` maps to exactly one `(offer_id, fact_type, projection)`. Two canonical sources for one legacy key is a catalogue load error. |
| L3 | **Explicit projection per key**, declared in data, never inferred: |
| | `destination_url → funnel_destination_url`: same URL after the declared normalization (scheme and host lowercased; no other rewriting) |
| | `availability.status → free_reading_available`: `accepting → true`; `paused` / `ended → false`. This is **lossy**: `false` does not say which of `paused` / `ended`. |
| | `application_method → free_reading_application_method`, `provider → free_reading_provider`: identical text |
| | `goal → primary_threads_goal`: only values in the current fortune enum. A canonical goal outside it has **no** legacy projection, so that offer cannot be used on the legacy reader path (§11.5). |
| | `price (typed) → price (A1 account-wide)`: only for the one declared A1 offer. The typed price must have `currency = JPY` and a known `tax`. The legacy value is compared on amount and, where the legacy value states it, tax basis. |
| L4 | **Comparison** projects the canonical value through L3 and compares it with the legacy value. Outcome is `EQUAL`, `CONFLICT` or `INDETERMINATE`. `INDETERMINATE` (for example a legacy price that states no tax basis while the typed price has one, or a legacy value that cannot be parsed) is handled **as a conflict** (E160, fail closed) until an operator resolves it. |
| L5 | **Import of existing legacy values** into the canonical model, if A1 is ever migrated, is a separate migration decision. It keeps the original verifier and time as provenance (`source_kind = legacy_import`) and never raises a value's status. A lossy legacy value (L3 `false`, L4 untaxed price) is not imported until an operator resolves it. |

### 11.5 Current readers do not understand SOFS

Current readers (Writer prompt builder, FQA-7, funnel) read legacy keys. They
are **not** assumed to understand SOFS. Until they are adapted (C2 / C4):

- onboarding-managed accounts may use only offers whose required facts have
  an exact legacy-reader equivalent
- plans for onboarding-managed accounts may **not** mention price or salary
  (the role disallows it), because FQA-7 checks key presence only

### 11.6 Parity vocabulary (replaces "behavioural parity" in v2 §13.2 step 8)

| Term | Meaning |
|---|---|
| **EXACT_PARITY** | identical output for a frozen input set |
| **INTENDED_DIVERGENCE** | a declared, approved, safety-strengthening change in behaviour, listed item by item |
| **REGRESSION** | any other difference. Blocks. |

Known intended divergences, to be listed in the parity report:

- the typed price check is stricter than FQA-7's key-presence check
- alias conflicts now fail closed (a new failure mode)
- the Writer receives only the selected offer's facts

The result is never called "full parity" when it contains an
INTENDED_DIVERGENCE.

---

## 12. ExecutionSnapshot explanation (brief item 11)

### 12.1 What the current system preserves (corrects v2 §8.1)

Current generation records store `style_profile_version` and
`verified_fact_keys_json` (keys). Current `request_json` **may preserve the
fact values** that were part of the Writer request (DOT re-audit). v2's
implication that no fact values are kept was wrong.

### 12.2 Why that is still not the snapshot contract

| Property | Current `request_json` | Future ExecutionSnapshot |
|---|---|---|
| fact values | may be present as sent | present, plus fact event ids, value hashes, VERIFIED status and provenance (SOFS) |
| offer identity / revision | not guaranteed | `selected_offer_id`, `offer_revision` |
| config, catalogue, template, safety-floor versions + hash | not guaranteed | bound |
| QA rule-set, approval, publishing, cost policy versions | not part of the request | bound |
| research envelope | not guaranteed | selection ids + packet ids + `ri_packets.payload_hash` + bounded item refs (§12.3), or explicit `none`. No raw bodies. |
| style version + provenance class | version stored separately; class not bound | bound |
| account identity `(platform, provider_account_id)` | not guaranteed | bound |
| immutability enforced | not as a contract | append-only, hash-verified |
| referenced by approval | no | `snapshot_hash` in the approval binding |
| completeness | records what was sent | must bind **all effective inputs** needed for reproducibility |

`request_json` stays, as evidence of what was sent. After the snapshot
exists, it is a derived artifact that request validation checks against
SOFS (§11.1). The snapshot does not replace it, and it does not satisfy the
snapshot contract.

### 12.3 Research envelope in the snapshot (replaced in v3.1)

v3's "store the selected items' content in the snapshot" is **withdrawn**.

- **Packet reference:** the snapshot's research envelope binds
  `selection_id`, `packet_id` and `ri_packets.payload_hash` as recorded on
  the selection (§9.3). This is the packet hash wherever a packet is
  referenced. The adapter does not compute a substitute packet hash.
- **Item reference:** item refs inside the packet are bound by id. Only
  where `payload_hash` does not cover a referenced item does the adapter
  compute a per-item canonical hash, at selection time, from the bounded
  reference fields below (U-R4 remainder).
- **Bounded copy:** the snapshot may hold, per selected item, only bounded
  reference metadata: source id, canonical URL, `source_type`, published /
  fetched time, the freshness label v1 assigned, and the item ref and hash.
  It holds **no raw source body, no full packet payload and no full
  article text**. Any short text the plan needs as context (for example an
  angle or a title) is limited by a catalogue-declared maximum length and
  stays subject to the research-leak and copy guards.
- **Reproducibility without copying:** a later re-check compares hashes. If
  the source item or packet is no longer available, the check reports
  "source no longer available" for that snapshot. It never falls back to a
  copied body, and it never makes the snapshot invalid retroactively.
- Everything in the envelope stays `suggestions_only` (§9.1).

---

## 13. CAREER acceptance (brief item 13)

### 13.1 Status

| | |
|---|---|
| Current status | **NOT_READY** |
| Future target | **FUTURE_PASS_AFTER_COMMON_CORE** |

The blockers B1–B6 and the common-core changes C1–C6 from v2 §12.2–§12.3 are
retained unchanged.

### 13.2 Two different tests

| Test | Research | Can produce CAREER PASS? |
|---|---|---|
| **FULL CAREER ACCEPTANCE** | **required**: the CAREER account gets research through the approved C6 path, `suggestions_only`, with an `operator_manual` ResearchSelection | **yes**, if every criterion in §13.4 passes |
| **LIMITED CORE TEST** | none. Recorded explicitly as `research envelope = none` and `selection = []`. | **no.** It is reported as LIMITED CORE TEST PASS/FAIL only. |

"Research none" never makes the vertical test pass. **No fake packet and no
fake selection** may be created for either test.

### 13.3 What a CAREER PASS may require

After the common-core work, adding CAREER may require **only**:

- template / config data
- catalogue data
- customer data

and **no career-specific Python or TypeScript runtime branch**.

### 13.4 Pass criteria (FULL CAREER ACCEPTANCE: all)

| # | Criterion |
|---|---|
| P1 | `git diff T0..T1` touches only declared data paths. **Zero** `.py` / `.ts` / `.tsx` changes. |
| P2 | (v3.1) **no industry-specific runtime branching** for CAREER, detected by control flow, not by vocabulary (see below) |
| P3 | the template loads through the production loader (C5). No test-only shim, monkeypatch, fixture override or alternate registry. |
| P4 | **offer isolation:** with several offers on the account (two `job_posting` offers and one `lead_magnet`), Writer input, QA and approval for a plan see only the selected offer |
| P5 | **typed salary facts:** salary in content must match the typed `salary_range` (amount, currency, period). Key presence alone fails. Missing verification blocks salary-mentioning plans. |
| P6 | **Writer fact isolation:** request validation (§11.1) passes, and the request contains no fact outside SOFS |
| P7 | **QA:** findings and prompts use career catalogue labels. No fortune vocabulary appears. |
| P8 | **SHADOW cannot reach live:** every live control from §3.6 fails closed for the CAREER shadow principal |
| P9 | **Research:** research for the CAREER account flows through C6 as `suggestions_only`, with an `operator_manual` selection, and the four frozen v1 fields unchanged (§9.1) |
| P10 | **A1/A2 compatibility:** EXACT_PARITY except the declared INTENDED_DIVERGENCE list (§11.6) |

The LIMITED CORE TEST runs P1–P8 and P10 with `research envelope = none` and
`selection = []`. Its result is never reported as a CAREER PASS.

**P2 detection rule (v3.1, replaces the v3 word grep):**

- The general word "career" (or 「キャリア」, `job_posting`, `salary`) appearing
  in non-data source **does not fail P2** by itself. Comments, docs, generic
  labels, test names, log text, the generic catalogue schema and the
  generic closed `offer_type` list may contain it.
- P2 **fails** when non-data runtime code (`.py` / `.ts` / `.tsx`, outside
  the generic loader and catalogue schema) **branches on vertical
  identity**. Examples that fail:
  - a comparison or dispatch on a template id or vertical id
    (`template_id == "career_recruitment"`, a `match` / `switch` / dict
    dispatch keyed on a vertical)
  - a branch on a vertical-specific offer type or fact type that changes
    behaviour (`if offer_type == "job_posting": …`), instead of reading the
    catalogue-declared value type or property (`money_range`,
    `requires_eligibility`, …)
  - a career-only module, registry entry, import path or feature flag
  - career-only prompt or QA wording in code instead of catalogue data
- Detection: (1) P1 already requires zero code change from T0 to T1;
  (2) at T1, a static check lists every conditional, dispatch table and
  registry in non-data runtime code whose key or comparand is a template id,
  vertical id, or vertical-specific offer / fact type literal. Each hit is a
  FAIL unless it is in the generic loader / schema. The check result is
  reviewed by DOT; a reviewer may not wave a hit through by renaming it.
- Branches that already exist at T0 for the fortune vertical
  (`engine_ref: divination`) are baseline. They are not counted against
  CAREER, and CAREER may not add a new one.

---

## 14. ONB closure matrix (brief item 12; updated in v3.1)

Legend: **CLOSED** = the design contract is corrected and no open design
dependency remains · **PARTIAL** = the contract is corrected, but a named
inventory or separately approved design is still needed before the contract
can be bound · **OPEN** = not addressed · **DEFERRED** (v3.1) = separately
approved future work that this design intentionally does not do. DEFERRED is
**never** counted as CLOSED.

A dependency is never counted as closed merely because it is deferred to
implementation. An item is CLOSED only when its **design contract** needs
nothing further. Implementation that is deferred is listed separately as
DEFERRED below.

| ID | v3 status | v3.1 status | What v3 + v3.1 do | Remaining dependency |
|---|---|---|---|---|
| **ONB-01** Research authority | CLOSED | **PARTIAL** | Frozen v1 fields stated exactly, now on the **planning-input / export envelope**, not required on every `ri_packets` row (§9.1). Selection records who/what/account/plan, but grants no fact, Writer or planning authority (§9.2). `operator_manual` only. No policy column. Selection bound to `ri_packets.payload_hash` (§9.3). | U-R1: envelope name and field paths, needed to bind the §9.1 check. Default until then: an envelope that cannot be read is rejected. (v3 marked this CLOSED; the DOT final re-audit showed the check was bound to the wrong object.) |
| **ONB-02** Research source of truth | PARTIAL | **PARTIAL** | Reuse of `ri_*` kept (v2 §5.3). Conditional ADAPT rows → MISSING. Freshness = fixed v1 classification (V9). Manual TOPIC intake = existing behaviour (V10). Catalogue statuses fixed in §17.6. | U-R1 (`ri_*` inventory), U-R2 (SourceSpec fields), U-R5 (confirmed transports) to bind the adapter |
| **ONB-03** Membership semantics | PARTIAL | **PARTIAL** (unchanged) | Cross-org = explicit delegation. Five dimensions separated. No destructive UNIQUE. Allowlisting not planned (§8). | U-T1 ownership inventory and U-T3 cross-org membership classification (§8.4) |
| **ONB-04** Active ≠ authority | PARTIAL | **PARTIAL** (unchanged) | Six concepts (§3.2). CATFOOD authority scoped correctly (§3.1). Live admission predicate (§3.3). ACTIVE as an extra guard for onboarding-managed accounts only. No gate on A1/A2 (§3.4). SHADOW boundary rebound to the real controls (§3.6). | U-A1 to bind §3.3; G-ACTIVE design (DEFERRED below) before any onboarding-managed account can go live |
| **ONB-05** Claims vs verified | CLOSED | **CLOSED** (unchanged) | v2 §4.1–§4.2 retained. SOFS accepts VERIFIED facts only (§11.2). | none for the design. U-V1 has a fail-closed default (operator-only verification); widening it is a separate authority expansion. |
| **ONB-06** Snapshot | CLOSED | **CLOSED** (corrected) | Current `request_json` described correctly (§12.2). Research envelope binds `ri_packets.payload_hash`; no substitute packet hash; **no raw bodies or full payloads** copied, only bounded reference metadata (§12.3). | none for the design. U-R4 remainder (item-level hash) has a fail-closed default and affects efficiency only. Snapshot implementation is slice 2 (DEFERRED below). |
| **ONB-07** Approval | CLOSED | **CLOSED** (unchanged) | Restriction-only rule with ten conditions, no rebind, no revival, `ERROR` blocks (§5). Approver changes are REVIEW_REQUIRED (§6). | none |
| **ONB-08** Cost model | CLOSED | **PARTIAL** | Writer daily limits **and** frozen Research v1 daily AI / USD budget / source-fetch limits described as the enforced, path-local controls. Not every non-Writer path is estimate-only. Monthly JPY = desired limit / estimate and never changes Research v1 limits. Current controls vs future unified Cost Governor separated. Cost Governor v2 / CI-01 not Production (§10). | U-C4: exact names / units / values of the Research v1 limits, to bind the §10.1 rows and the estimate display. U-C3 can only add enforced paths. Unified enforcement is DEFERRED (Cost Governor). (v3 marked this CLOSED while omitting the Research v1 limits.) |
| **ONB-09** Lock ≠ quiescence | PARTIAL | **PARTIAL** | Fence and quiescence separated. Q1–Q9. No circularity. NEVER_LIVE positive proof. Holds are per reason, with an owner each; no cross-release; resume releases only its own hold and never bypasses another; config switch is compare-and-set on the expected old version; serialization invariant stated without prescribing a mechanism (§4.2, §4.4, §4.5, §4.7). | U-Q1 (evidence source per Q1–Q9, N1–N7), U-F1 (covered claim types for F1); G-FENCE design note meeting F1–F7 (DEFERRED below) |
| **ONB-10** Style / readiness | PARTIAL | **PARTIAL** | `MANUALLY_APPROVED_STYLE` with M1–M7. Separate `research` and `style_profile` blockers. A manual style never silently affects the research blocker. Re-review triggers T1–T4 (§7.5). Manual Post Sync alone is not a sufficient style corpus (§7.6). | U-S1 (is a manual style wanted?), U-S2 (exact blocker predicates and corpus requirements); RA-1 and RA-2 (DEFERRED below) |

No ONB item is OPEN. The PARTIAL items do not hide any capability as
supported: every one is fail-closed until its dependency is resolved.

Additional items:

| Item | Status | Section |
|---|---|---|
| Execution authority language | CLOSED | §3 |
| Restriction-only rule | CLOSED | §5 |
| Approver changes | CLOSED | §6 |
| Cross-org delegation | PARTIAL (inventory U-T1/U-T3) | §8 |
| (v3.1) Research envelope vs packet | PARTIAL (U-R1, as ONB-01) | §9.1 |
| (v3.1) Fixed freshness classification; manual TOPIC intake as existing behaviour | CLOSED | §9.4 V9, V10 |
| (v3.1) Bounded research copy in snapshots | CLOSED | §12.3 |
| (v3.1) G-FENCE invariants F1–F7 | CLOSED as invariants. G-FENCE itself is DEFERRED and PARTIAL on U-F1. | §4.7 |
| (v3.1) Manual style re-review triggers; Manual Post Sync sufficiency | CLOSED as contract. RA-1 / RA-2 DEFERRED. | §7.5, §7.6 |
| Selected-offer / fact model | PARTIAL (reader adaptation C2/C4 before price or salary use) | §11 |
| (v3.1) Tax-basis semantics; legacy alias mapping rules L1–L5 | CLOSED as contract | §11.3, §11.4 |
| CAREER acceptance contract (incl. v3.1 P2 control-flow rule) | CLOSED as a contract. The test itself is **NOT_READY**; running it is DEFERRED. | §13 |
| MVP scope separation | CLOSED | §15 |
| Smallest implementation slice (scope definition) | CLOSED | §17.1 |
| (v3.1) Field catalogue v1 pre-freeze statuses and finding rules | CLOSED as design, subject to the DOT diff re-audit | §17.6 |

DEFERRED (separately approved future work; **not** CLOSED):

| Item | Why it is not part of this design | Section |
|---|---|---|
| G-ACTIVE | MAINLINE admission change; own design note, tests, approval | §3.4 |
| G-FENCE implementation | MAINLINE admission change; design note must meet F1–F7 | §4.2, §4.7 |
| RA-1, RA-2 | readiness-contract changes | §7.4 |
| C1–C6 (incl. C6 Research generalization) | common-core changes before CAREER | v2 §12.3 |
| Cost Governor / CI-01 integration | not Production; PROMOTION WINDOW only | §10.4 |
| Delegation record | future table | §8.3 |
| Slices 2–6 | each needs its own planning and approval | §17.2 |
| CAREER FULL ACCEPTANCE run | needs C1–C6 | §13 |

---

## 15. MVP scope (brief item 14)

This onboarding project **does not gate the current two-account MVP.**

None of the following is added to current MVP operation:

- 72 h soak
- 14-day history
- 10-post requirement
- onboarding completion
- B2B readiness

These remain **proposed future onboarding parameters** only (v2 §13.1).

Future onboarding ACTIVE rules (G-ACTIVE, lifecycle gates, ingress-fence
rules) apply **only to onboarding-managed accounts**, unless A1/A2 are
separately migrated by an explicit decision. This is consistent with
`docs/HQ_DECISIONS.md` (MAINLINE: stabilize the two own accounts first; no
long soak as an MVP gate).

---

## 16. Remaining unknowns (replaces v2 §15)

| ID | Unknown | Needed for | Owner | Default until resolved |
|---|---|---|---|---|
| U-R1 | exact `ri_*` table / column inventory, **plus (v3.1) the planning-input / export envelope name and the field paths of its four advisory fields** | §9.1 envelope check, §9 adapter binding | DOT (LAB) | no adapter is specified; an envelope that cannot be read is rejected |
| U-R2 | SourceSpec fields v1 accepts | §9.5 | DOT (LAB) | MISSING |
| U-R3 | v3.1: v1's fixed freshness classification labels, **for display only** (no rule-set selection exists, V9) | §9.4 V9 | DOT (LAB) | label not shown |
| U-R4 | v3.1: **resolved for packets** (`ri_packets.payload_hash`, DOT final re-audit). Remaining: whether item-level refs inside a packet have their own stable hash | §12.3 | DOT (LAB) | per-item canonical hash computed at selection, from bounded reference fields only |
| U-R5 | which `source_type`s have a confirmed working transport | §9.4 V7 | DOT (LAB) | not selectable |
| U-A1 | exact names and records of the current live controls (§3.1) | §3.3 binding | DOT | no onboarding-managed account goes live |
| U-A2 | full list of CATFOOD paths that require `execution_authorities` | §3.3, Q8, N7 | DOT | treated as applicable where unknown (fail closed) |
| U-Q1 | authoritative evidence source per Q1–Q9 and N1–N7, and each source's coverage start | §4 | DOT | unknown = not quiescent / proof fails |
| U-C1 | MAINLINE merge state of the cost tables | §10.1 | DOT / operator | reporting only |
| U-C2 | per-post call estimate and pricing table version | §10.3 Writer-limit proposal | operator | no proposal; manual Writer limit |
| U-C3 | which paths other than the Writer and Research v1 enforce a daily cap | §10.2 | DOT | not enforced |
| U-C4 | (v3.1) exact names, units, windows and values of the frozen Research v1 daily AI, USD budget and source/fetch limits | §10.1 rows; estimate display | DOT (LAB) | limits exist and are enforced by v1 (DOT final re-audit); onboarding shows no figure for them and changes none |
| U-F1 | (v3.1) exact list of durable claim types that can lead to a provider call, and where each is recorded | §4.7 F1 | DOT | G-FENCE not complete; no execution-affecting promotion |
| U-T1 | ownership inventory results | §8.5 | operator (read-only) | no ownership constraint |
| U-T2 | provider account id availability at OAuth time | v2 §7.5 | DOT | handle check stays |
| U-T3 | classification of existing cross-org memberships | §8.4 | operator + DOT | behaviour unchanged |
| U-S1 | whether `MANUALLY_APPROVED_STYLE` is wanted at all | §7 | product + DOT | not available |
| U-S2 | exact predicates of the `research` and `style_profile` readiness blockers | §7.3 | DOT | both unchanged; new accounts blocked |
| U-V1 | which fact types may be verified by whom; evidence retention | v2 §4.2 | product + DOT | operator only |
| U-P1 | commercial acceptability of future SHADOW / ramp parameters | future phase | product | proposed only |

---

## 17. Smallest implementation-planning slice (brief item 15)

Full onboarding implementation is **not** proposed. If v3 passes the final
re-audit, the first implementation-planning slice is only:

### 17.1 Slice 1 — PURE COMPILER + FIELD CATALOGUE

**Input**

- submission
- fixed template version
- fixed catalogue version
- fixed safety floor version

**Output**

- AccountConfig candidate
- CUSTOMER_ASSERTED FactAssertions
- provenance map (each output value → submission field, template default,
  catalogue default or safety floor)
- CompileReport

**Constraints**

| # | Constraint |
|---|---|
| K1 | deterministic: the same inputs give byte-identical output and hash |
| K2 | no DB required |
| K3 | no network |
| K4 | no credentials |
| K5 | no live queue |
| K6 | no arm |
| K7 | no publication |
| K8 | unknown fields are **rejected** (not ignored) |
| K9 | unsupported fields (MISSING / CONFLICT, §17.6) are **explicitly reported** in the CompileReport as findings, and are **never silently ADAPTed**: no fallback, approximation or substitute mapping (v3.1, §17.6) |
| K10 | templates cannot create verified facts: the output has only CUSTOMER_ASSERTED assertions, and `kind: fact ⇒ defaultable: false` is enforced |
| K11 | templates cannot create approvals: the output has no approval, config approval or content approval |
| K12 | A1 / A2 **golden tests**: compiling the A1/A2 submissions reproduces their current `config_json` after normalization. Any difference is reported as EXACT_PARITY / INTENDED_DIVERGENCE / REGRESSION (§11.6). |

**CompileReport** contains: input versions and hashes, output hash, rejected
unknown fields, unsupported-field findings (§17.6) with their status, defaults
applied (with source), fact assertions produced, and blockers (for example,
E043 for a third account, E050 for style).

**Not in slice 1:** storage, migrations, UI, verification, snapshots,
SHADOW, adapters, any MAINLINE change.

### 17.2 Later slices (order only; each needs its own planning and approval)

2. immutable config versions + ExecutionSnapshot
3. typed selected-offer / facts (SOFS)
4. true no-live SHADOW
5. adapters (Research, Planning, Writer, Approval, Cost, readiness reporter)
6. CAREER data-only acceptance (§13)

The customer UI does **not** come first. It follows all of the above.

### 17.3 Read-only inventories (not implementation slices)

U-A1, U-A2, U-Q1, U-R1, U-R2, U-R5, U-S2, U-T1 and U-T3, plus (v3.1) U-C4
and U-F1, are read-only investigations. They can proceed independently and
change nothing.

### 17.4 Separately approved dependencies (replaces the v2 §13.2 list)

- **G-ACTIVE:** PRODUCT ACTIVE as an extra admission guard and `arm()`
  precondition, onboarding-managed accounts only (§3.4)
- **G-FENCE:** ingress fence in the admission path (§4.2). Its design note
  must satisfy F1–F7 (§4.7) before implementation planning. The mechanism is
  not prescribed.
- **RA-1 / RA-2:** readiness-contract changes for manual style and the
  research blocker (§7.4)
- **C6:** Research account generalization (v2 §12.3)
- **Cost Governor integration** (§10.4)
- **delegation record** (§8.3)
- removed: AUTHZ-ALLOWLIST (§8.6), not planned
- out of scope: automatic Research → Planning / Writer

### 17.5 Additions to "What not to build" (v2 §14)

- reuse of CATFOOD execution authority as a live-publication mechanism
- any new ACTIVE gate on A1/A2 without a separate migration decision
- approval rebinding or revival after a restriction change
- automatic approver reassignment
- policy-based ResearchSelection
- fabricated packets, selections, research posts or benchmark rows
- treating a `price` key's presence as authorization for any amount
- (v3.1) a selectable freshness policy, rule set or window
- (v3.1) onboarding-set values for any Research v1 daily AI, USD budget or
  source/fetch limit
- (v3.1) copying raw source bodies or full packet payloads into snapshots
- (v3.1) silent ADAPT, fallback or approximate mapping of an unsupported
  field

### 17.6 Field catalogue v1: pre-freeze corrections (v3.1)

The first PURE COMPILER catalogue may be frozen only with the statuses
below. This table supersedes the research rows of v2 §5.5 and v3 §9.5 for
catalogue purposes.

**Statuses:** `SUPPORTED` (maps to a confirmed target) · `ADAPT` (a mapping
declared in catalogue data, with an evidence reference) · `PLANNING_ONLY`
(used by planning only, never sent to research) · `STYLE` (style input,
never research) · `MISSING` · `CONFLICT`.

| Field (v1 form key, or template data key) | Target | Catalogue v1 status | Compiler behaviour |
|---|---|---|---|
| `research.mode` | preference record | SUPPORTED (preference) | recorded. Selects template defaults only among SUPPORTED / ADAPT rows. |
| `research.themes` → `topics[]` labels | v1 profile topic labels | ADAPT, **A1/A2 only** (v2 §5.5) | A1/A2: declared mapping. Any other account: not mapped, blocker E043. |
| `research.keywords` → `include_keywords` | SourceSpec query parameters | ADAPT, **A1/A2 only** (v2 §5.5, R2) | as above |
| `content.pillars` weights → `topics[].weight` | — | MISSING (research); PLANNING_ONLY | finding. Weights go to `planning.content_pillar_ratios` only. |
| `content.subtopics` → `topics[].subtopics` | — | MISSING | finding. **Not** folded into keywords. |
| `research.exclude_keywords`, `content.prohibited_topics` → `exclude_*` | — | MISSING (research); PLANNING_ONLY | finding for research. Recorded as a planning-side filter on what the operator is shown for selection. Never mutates packets. Compliance use of `prohibited_topics` is unaffected. |
| template `topics[].intent` (news / evergreen) | — | MISSING (research); PLANNING_ONLY | finding (V9: no freshness rule set to map to) |
| `research.freshness` | — | **CONFLICT** | finding (error). Value dropped. The fixed v1 classification applies (V9). |
| `research.update_frequency` | — | MISSING (scheduler-owned) | finding |
| `research.preferred_sources` (source types) | `sources[].adapter` | ADAPT only for types with a confirmed transport (V7, U-R5). Every other type: MISSING. | per type |
| `research.preferred_sources` (free URLs), `research.blocked_sources` | — | MISSING (U-R2) | finding |
| `entities_watch` | — | MISSING | finding |
| template `relevance.*` | — | CONFLICT (V5) | template load error |
| template `budget.max_items_per_cycle` / `max_llm_calls_per_cycle` | — | CONFLICT (Research v1 limits are frozen, §10.1) | template load error |
| manual TOPIC intake | — | not a field (V10) | existing operator behaviour. Compiler emits nothing. |
| `content.reference_accounts` | manual STYLE intake request | STYLE | never research |
| `account.use_past_posts` | Manual Post Sync request | STYLE | never readiness by itself (§7.6) |
| `cost.monthly_cap_jpy` | `desired_monthly_jpy` | SUPPORTED (intent) | Writer daily-limit proposal only. Never a Research v1 limit (§10.3). |
| `cost.daily_call_cap` (operator) | Writer daily limit | SUPPORTED for the Writer only | another feature: finding (U-C3). A Research v1 feature: CONFLICT. |
| `offer.price` | typed price assertion (§11.3) | SUPPORTED as CUSTOMER_ASSERTED | `amount`, `currency` and `tax` are all required. A missing `tax` basis is a submission validation error, not a default. |

**Finding rules:**

- Every field whose status is `MISSING` or `CONFLICT` and that has a value
  in the submission produces **one CompileReport finding**: field key,
  status, reason, section reference, and whether the value came from the
  submission or a template. Severity: `MISSING → warn` (value not used),
  `CONFLICT → error` (compile result is not a valid candidate). Unknown
  keys stay rejected (K8).
- The provenance map records `UNSUPPORTED:<status>` for each such field. The
  output contains **no** value derived from it.
- A template that supplies a default for a `MISSING` or `CONFLICT` field is
  a **template load error**. Templates cannot hide an unsupported field
  behind a default.
- `ADAPT` exists **only** where the catalogue declares the mapping and its
  evidence reference. The compiler contains no fallback or approximate
  mapping (for example subtopics → keywords, intent → freshness, blocked
  sources → exclusions).
- Raising a field from `MISSING` to `ADAPT` or `SUPPORTED` needs a **new
  catalogue version** with evidence, never only a compiler change.

---

## 18. Further amendments to retained v1 sections

These add to v2 §17. Where they disagree with v1 or v2, these win.

| v1 location | v1 text | Amendment |
|---|---|---|
| §2 rename table | 「月額の上限」 | 「月額の目安」 |
| §2 journey flow (STEP 10) and §3.12 title | 月額の上限 | 月額の目安 |
| §3.11 `ops.pause_rules` | 「月額上限に到達 (always on)」 | **withdrawn.** No monthly cap signal exists. A Writer daily-limit hit stops Writer generation for that UTC day. It is not a pause rule. |
| §3.12 `cost.on_cap` | 「その月は新しい投稿を作らない」 (default) | **withdrawn** (MISSING until a Cost Governor exists). Options: 「その日の投稿文の作成を止める」 (Writer daily limit) and, only where the template supports it, deterministic mode. |
| §4.2 CostPolicy row | "Cap reached ⇒ block or deterministic mode. Never overspend silently." Per-feature `ai_cost_policies` for writer / research_classify / research_angle / qa_semantic | Desired limit plus a Writer daily-limit proposal. v1's proposed `research_classify` / `research_angle` rows are withdrawn as onboarding-set limits: AI use on the Research v1 path is governed by frozen Research v1's own daily AI, USD budget and source/fetch limits (v3.1, §10.1), which onboarding never sets. Other features' rows are estimates and reporting only, unless enforcement on that path is confirmed (U-C3). "Never overspend silently" is withdrawn. |
| §5.2 PAUSED → ACTIVE | G9 (budget) re-checked | G9 is a review item on the desired limit, not a budget check |
| §8.4 G9 | "no cap breach during shadow" | per §10.3 |
| §11 E070 | 「月額上限が目安…」 | 「月額の目安が、想定の利用額（◯円〜）を下回っています」 |
| §11 E091 | removing the last approver | unchanged. All other approver changes follow §6 (REVIEW_REQUIRED). |
| §11 E130 | kill switch / partial publication pending, at arm | covers quiescence blockers Q1–Q9 for operations that need QUIESCENT (§4.4). It is not raised for pause or STOP. |
| §11 **E160** (new) | — | legacy alias conflicts with its canonical fact (§11.4): 「登録情報に食い違いがあるため、確認が終わるまで案内を止めています」 |
| §12.2 vocabulary | CostPolicy / budget → 月額の上限 | → 月額の目安 |
| §13.1 `org_budget` | caps the total | desired org-level total, no enforcement (v2 kept) |
| §8.4 G4 / §11 E050 | — | wording from v2 §17.3 kept. 「おすすめの文体で始める」 stays withdrawn as an activation path. MANUALLY_APPROVED_STYLE becomes an option only after RA-1. |

---

## 19. Errata v3.1 — change log from v3 (DOT final re-audit)

Applies only the finite corrections of the limited corrective brief. No
redesign. No code. No MAINLINE or Production change.

| # | Brief item | v3 said | v3.1 says | § |
|---|---|---|---|---|
| E1 | 1 Research | every v1 research output carries the four advisory fields; the adapter checks them on packets | the fields belong to the **planning-input / export envelope**; they are not required on every `ri_packets` row; the envelope check fails closed; a contradicting value on a packet is also a violation | §0.1, §0.3 #9, §9.1, U-R1 |
| E2 | 1 Research | `packet_ref_hash`, computed at selection if v1 has none | `ri_packets.payload_hash` is the packet hash; re-read at plan build; mismatch = stale selection (fail closed); per-item hash only where `payload_hash` does not cover a ref | §9.3, §12.3, U-R4 |
| E3 | 1 Research | `research.freshness`: labels mapping 1:1 to v1 rule sets | freshness is a **fixed** v1 classification; no selectable policy; `research.freshness` CONFLICT (withdrawn); `topics[].intent` MISSING on the research side; the label is displayed only | §9.4 V9, §9.5, §17.6, U-R3 |
| E4 | 1 Research | `manual_intake` MISSING on the research side | manual TOPIC intake is **existing** v1 behaviour (operator act, account-scoped); no new intake channel; separate from STYLE intake | §9.4 V10, §9.5, §17.6 |
| E5 | 1 Research | snapshot stores selected items' content | raw source bodies and full packet payloads are **not** copied; bounded reference metadata only; short context text capped by the catalogue and guarded | §12.2, §12.3, §17.5 |
| E6 | 1 Research | — | selection is `operator_manual` only; nothing else may select | §9.3 |
| E7 | 2 Cost | Writer daily limits are the **only** enforced limit | frozen Research v1 daily AI, USD budget and source/fetch limits are documented as existing, path-local and enforced by v1; onboarding never sets them; not every non-Writer path is estimate-only; current controls vs future unified Cost Governor table; Cost Governor v2 / CI-01 remain not Production | §0.1, §0.3 #10, §10.1–§10.4, §18, U-C3, U-C4 |
| E8 | 3 G-FENCE | one `ingress_fence` record; release "unless a pause or suspend is also in effect" | one **hold per reason** with a sole owner; F1–F7 invariants: covered durable claims, account / config generation binding, expected old version (compare-and-set), serialization of admission / hold state / switch, owner per reason, no cross-release, resume never bypasses another hold; no mechanism (epoch or other) is prescribed | §4.2, §4.4, §4.5, §4.7, §17.4, U-F1 |
| E9 | 4 Style | — | RA-1 / RA-2 restated as future contract work; re-review triggers T1–T4 (persona change, template/style change, provenance revocation, meaningful new quality evidence); manual style never silently affects research readiness; Manual Post Sync alone is not a sufficient style corpus | §7.4, §7.5, §7.6 |
| E10 | 5 Catalogue | K9: unsupported Research fields reported | single pre-freeze field-status table; unsupported fields are explicit CompileReport findings (MISSING = warn, CONFLICT = error); templates cannot default them; no silent, fallback or approximate ADAPT | §17.1 K9, §17.5, §17.6 |
| E11 | 5 Catalogue | P2: grep for `career`, `job_posting`, `salary` | the word alone never fails P2; P2 detects **industry-specific runtime branching** by control flow (template / vertical / vertical-specific type literals in conditionals, dispatch or registries) | §13.4 |
| E12 | 5 Catalogue | alias list + conflict detection | alias rules L1–L5: canonical → legacy projection only, one-to-one, explicit per-key projection (lossy cases named), `INDETERMINATE` = conflict, legacy import is a separate decision | §11.4 |
| E13 | 5 Catalogue | `tax`: incl / excl / not_applicable | tax-basis semantics: amount as verified, never converted, `incl` / `excl` are separate facts, unknown basis is not a typed price, label mismatch fails QA, `excl` display only where compliance data allows | §11.3, §17.6 |
| E14 | matrix | ONB-01 and ONB-08 CLOSED | ONB-01 → PARTIAL (U-R1 envelope binding), ONB-08 → PARTIAL (U-C4); DEFERRED status added and never counted as CLOSED; new v3.1 rows | §14 |

### 19.1 Remaining PARTIAL items after v3.1

| Item | Blocking dependency |
|---|---|
| ONB-01 Research authority | U-R1 (envelope name and field paths) |
| ONB-02 Research source of truth | U-R1, U-R2, U-R5 |
| ONB-03 Membership semantics | U-T1, U-T3 |
| ONB-04 Active ≠ authority | U-A1; G-ACTIVE (DEFERRED) |
| ONB-08 Cost model | U-C4 |
| ONB-09 Lock ≠ quiescence | U-Q1, U-F1; G-FENCE note meeting F1–F7 (DEFERRED) |
| ONB-10 Style / readiness | U-S1, U-S2; RA-1, RA-2 (DEFERRED) |
| Cross-org delegation | U-T1, U-T3 |
| Selected-offer / fact model | C2 / C4 reader adaptation (DEFERRED) |

### 19.2 Can PURE COMPILER + FIELD CATALOGUE planning start?

**Yes, as planning only, once DOT accepts this diff.** Slice 1 (§17.1)
needs none of the PARTIAL dependencies above:

- it has no storage, live path, admission, fence, readiness or adapter, so
  U-A1, U-Q1, U-F1, G-ACTIVE, G-FENCE and RA-1 / RA-2 do not apply;
- every research field whose v1 mapping is unconfirmed is `MISSING` with an
  explicit finding (§17.6), so U-R1 / U-R2 / U-R5 can only **raise**
  statuses later through a new catalogue version;
- the cost output is only `desired_monthly_jpy` plus a Writer daily-limit
  proposal, so U-C4 does not apply.

Conditions on that planning:

1. The catalogue v1 freezes with exactly the §17.6 statuses and finding
   rules.
2. The K12 golden tests need the current A1 / A2 `config_json` as read-only
   fixtures. Reading them is an inventory step; nothing in MAINLINE or
   Production changes.
3. Planning output is a plan, not code. Implementation needs its own
   approval.

---

## FINAL STATUS

**DESIGN_READY_FOR_DIFF_REAUDIT**

Errata v3.1 applies only the five corrective items of the DOT final
re-audit (§19, E1–E14). The exact diff from v3 is
`git diff 4638faf -- docs/meguri-b2b-onboarding-design-v3.md`. Remaining
PARTIAL items and their dependencies are listed in §19.1; deferred work is
listed as DEFERRED and is not counted as CLOSED (§14). No ONB item is OPEN.
No current capability is overstated. The current two-account MVP is
unaffected.
