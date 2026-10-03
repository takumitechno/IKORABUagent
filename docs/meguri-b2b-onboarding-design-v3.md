# 環 — MEGURI B2B onboarding / account bootstrap design — v3 (final corrective)

Status: **design only, corrective revision.** No application code, no
Production change, no MAINLINE runtime change, no deploy, no migration, no
scheduler / credential / approval / arm / publication / live-account change.

| | |
|---|---|
| Supersedes | the sections of `docs/meguri-b2b-onboarding-design-v2.md` listed in §2. Every other v2 section is retained unchanged. v1 and v2 are kept as history, each with a one-line pointer at its top. |
| v2 audited at | `IKORABUagent` branch `claude/practical-wright-j9wk8p`, commit `a12a0671a135e545af8cced7f3eed751032c4e46` |
| DOT re-audit result on v2 | **NOT_READY** |
| This revision | Applies only the remaining contract corrections from the v2 re-audit (items 1–15 of the v3 corrective brief). It is **not** a redesign. |
| Requested outcome | DOT final re-audit |
| Effect on the current two-account MVP | **None.** This project does not gate it (§15). |

### 0.1 Sources of authority used in v3

| Source | Used for | Notes |
|---|---|---|
| DOT re-audit of v2 | every v3 correction | Authoritative. Statements in v3 about current behaviour that come from this re-audit are labelled "(DOT re-audit)". They are not re-verified in this revision. |
| DOT re-audit, current-state findings | §3, §10, §12, §7.3 | (a) the confirmed 1–120 s TTL / generation-bound `execution_authorities` belong to **CATFOOD-specific control**; (b) current live publication uses separate controls (§3.1); (c) current generation `request_json` may preserve fact values; (d) current readiness has **separate** `research` and `style_profile` blockers; (e) current cost capability (§10.1) |
| DOT re-audit, recommendations | §5, §8 | restriction-only approvals: **SAFE WITH CONDITIONS**; cross-org membership: **explicit DELEGATION, not ownership** |
| DOT Research Intelligence v1 compatibility audit | §9 | Unchanged from v2. Frozen v1 contract. |
| v2 §0.1 sources | retained sections | Unchanged |

The `takumitechno/Threads-` repository is not readable from this revision's
session. v3 therefore does not add any new code-level claim. Where a
correction needs an exact table, column or function name that has not been
confirmed, v3 lists it as an unknown (§16).

### 0.2 How to read v3

- v3 = v2 + the corrections below. Where v2 and v3 disagree, **v3 wins**.
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
   `writer_input_authorized = false`. Selection mode is `operator_manual`
   only (§9).
10. Monthly JPY is a **desired limit / estimate**. Only the paths that are
    actually enforced today are described as enforced (§10).
11. One canonical **SelectedOfferFactSnapshot**, with typed price, feeds the
    Writer, request validation, QA and approval binding (§11).
12. Current `request_json` may preserve fact values. It is still not the
    future ExecutionSnapshot contract (§12).
13. CAREER is **NOT_READY**. The full acceptance test includes Research.
    Without Research it is only a **LIMITED CORE TEST** (§13).
14. The first implementation-planning slice is only the **pure compiler +
    field catalogue** (§17).

---

## 1. Change log from v2

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
- **Record:** `ingress_fence(account_id, reason, requested_by, fence_ts)`.
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
  accounts, except under the NEVER_LIVE proof (§4.5).

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
| PAUSED → ACTIVE (resume) | releases it | no | gates re-checked. No live control restored. Arming stays separate. |
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

1. **Fence** (Phase A).
2. **Drain by evidence** (Phase B). Wait. Never kill or self-heal.
3. **Apply** in one DB transaction: re-evaluate `quiescent()` (TOCTOU), then
   promote the version pointer, write the legacy projection and append
   audit. If the re-check fails, abort and keep the fence.
4. **Release** the fence, unless a pause or suspend is also in effect.

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

Every v1 research output carries:

```
authority                                  = "suggestions_only"
verified_facts                             = []
requires_explicit_operator_plan_decision   = true
writer_input_authorized                    = false
```

Onboarding never changes these values. Every onboarding adapter checks them
and **fails closed** if any value differs, for example a packet claiming
`writer_input_authorized = true`. Such a packet is rejected as a contract
violation.

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
  packet_id, packet_ref_hash,             -- §12.3: hash computed at selection time if v1 has none
  item_refs_json,
  selection_mode,                         -- CHECK (selection_mode = 'operator_manual')
  selected_by, selected_at,
  revoked_by NULL, revoked_at NULL
)
```

- `selection_mode` has exactly one allowed value: `operator_manual`.
  There is **no** `policy_id` column. Policy-based selection is a separate
  future authority expansion and is not mixed into current behaviour.
- Guards: `selection.account_id = packet.account_id = plan.account_id`.
- Revocable before plan generation. After generation it is part of the
  immutable snapshot.

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

### 9.5 Corrections to the v2 §5.5 field matrix

| Field | v2 | v3 |
|---|---|---|
| `topics[].weight` | ADAPT if v1 takes weights | **MISSING** until U-R2 confirms. Weights may still be used downstream in **planning** only. |
| `topics[].subtopics` | ADAPT if v1 accepts them | **MISSING** until U-R2 confirms |
| `exclude_keywords` / `exclude_topics` | ADAPT via v1 exclusion if present | **MISSING** on the research side until U-R2 confirms. A planning-side filter on **selection** stays allowed. It never mutates packets. |
| `manual_intake` | ADAPT if a SourceSpec type covers it | **MISSING** on the research side until U-R2 confirms. It stays available as a STYLE intake. |
| `sources[].adapter` | ADAPT, existing types only | ADAPT only for existing types **whose transport is confirmed** (V7) |
| `research.freshness` | labels mapping 1:1 to v1 rule sets | unchanged, plus V4 |
| relevance threshold | 0.55 withdrawn | unchanged, plus V5 |

---

## 10. Corrected cost model (brief item 9)

### 10.1 Current capability (DOT re-audit)

| Capability | Status | Used for |
|---|---|---|
| AI usage ledger | exists | attribution and reporting. The `shadow` lane is tagged where the path records it. |
| **Writer-specific daily limits** | exist and are enforced on the Writer path | the **only** limit v3 describes as enforced |
| Unknown-cost call handling | exists for some paths | where implemented, an unknown price is never counted as zero. Elsewhere the cost shows 「算出不可」. |
| Deterministic / no-AI mode | exists where the template wording path supports it | `cost.no_ai_mode` |

### 10.2 Not current

- a universal, feature-wide, atomic monthly JPY hard cap
- unified budget enforcement across every AI, research and SHADOW path
- enforced per-feature daily caps on paths other than the Writer. Treated
  as **not enforced** until enforcement on that specific path is confirmed
  (U-C3).
- the frozen **Cost Governor v2** and **CI-01** are **not Production**. Any
  integration is a separate promotion through the PROMOTION WINDOW
  (`docs/HQ_DECISIONS.md`).

### 10.3 Monthly JPY = DESIRED LIMIT / ESTIMATE

- `cost.monthly_cap_jpy` is relabelled 「月額の目安（希望の上限）」 and stored
  as `desired_monthly_jpy` intent (unchanged from v2).
- The compiler may derive a **Writer daily-limit proposal** from it,
  conservatively. That is the only enforcement the figure can feed today.
  Usage on every other path is **estimated and reported**, not limited.
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
| research envelope | not guaranteed | selection ids + packet refs + hashes, or explicit `none` |
| style version + provenance class | version stored separately; class not bound | bound |
| account identity `(platform, provider_account_id)` | not guaranteed | bound |
| immutability enforced | not as a contract | append-only, hash-verified |
| referenced by approval | no | `snapshot_hash` in the approval binding |
| completeness | records what was sent | must bind **all effective inputs** needed for reproducibility |

`request_json` stays, as evidence of what was sent. After the snapshot
exists, it is a derived artifact that request validation checks against
SOFS (§11.1). The snapshot does not replace it, and it does not satisfy the
snapshot contract.

### 12.3 Research envelope without a v1 packet hash

If v1 packets have no stable hash (U-R4), the adapter computes a canonical
hash of the selected items **as read at selection time** and stores those
items' content in the snapshot's research envelope as reference evidence
(still `suggestions_only`). U-R4 then affects efficiency only, not
correctness.

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
| P2 | no career-specific runtime branch (grep for `career`, `job_posting`, `salary` in non-data source returns only generic loader tests) |
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

---

## 14. ONB closure matrix (brief item 12)

Legend: **CLOSED** = the design contract is corrected and no open design
dependency remains · **PARTIAL** = the contract is corrected, but a named
inventory or separately approved design is still needed before the contract
can be bound · **OPEN** = not addressed.

A dependency is never counted as closed merely because it is deferred to
implementation.

| ID | Proposed status | What v3 does | Remaining dependency |
|---|---|---|---|
| **ONB-01** Research authority | **CLOSED** | Frozen v1 fields stated exactly (§9.1). Selection records who/what/account/plan, but grants no fact, Writer or planning authority (§9.2). `operator_manual` only. No policy column (§9.3). | none for the design. Policy-based or automatic selection is out of scope, not a dependency. |
| **ONB-02** Research source of truth | **PARTIAL** | Reuse of `ri_*` kept (v2 §5.3). Conditional ADAPT rows → MISSING (§9.5). V1–V8 constraints (§9.4). | U-R1 (exact `ri_*` inventory) and U-R2 (SourceSpec fields) are needed to bind the adapter |
| **ONB-03** Membership semantics | **PARTIAL** | Cross-org = explicit delegation. Five dimensions separated. No destructive UNIQUE. Allowlisting not planned (§8). | U-T1 ownership inventory and U-T3 cross-org membership classification (§8.4) |
| **ONB-04** Active ≠ authority | **PARTIAL** | Six concepts (§3.2). CATFOOD authority scoped correctly (§3.1). Live admission predicate (§3.3). ACTIVE as an extra guard for onboarding-managed accounts only. No gate on A1/A2 (§3.4). SHADOW boundary rebound to the real controls (§3.6). | U-A1 (exact names and records of the current live controls) to bind §3.3; G-ACTIVE (separate approval) before any onboarding-managed account can go live |
| **ONB-05** Claims vs verified | **CLOSED** | v2 §4.1–§4.2 retained. SOFS accepts VERIFIED facts only (§11.2). | U-V1 has a fail-closed default (operator-only verification). Widening it is a separate authority expansion. |
| **ONB-06** Snapshot | **CLOSED** | Current `request_json` described correctly. Difference from the snapshot contract stated (§12.2). Research envelope hash computed at selection when v1 has none (§12.3). | none for the design. U-R4 affects efficiency only. |
| **ONB-07** Approval | **CLOSED** | Restriction-only rule with ten conditions, no rebind, no revival, `ERROR` blocks (§5). Approver changes are REVIEW_REQUIRED (§6). | none |
| **ONB-08** Cost model | **CLOSED** | Only Writer daily limits described as enforced. Monthly JPY = desired limit / estimate. Cap wording withdrawn (§10, §18). Cost Governor v2 / CI-01 stated as not Production. | none for the design. U-C3 can only **add** enforced paths. A hard-cap claim requires a separately promoted Cost Governor integration. |
| **ONB-09** Lock ≠ quiescence | **PARTIAL** | Fence and quiescence separated. Q1–Q9 cover all required conditions. No circularity. NEVER_LIVE positive proof (§4). | U-Q1 (authoritative evidence source for each of Q1–Q9 and N1–N7); G-FENCE (separate approval) for execution-affecting promotion |
| **ONB-10** Style / readiness | **PARTIAL** | `MANUALLY_APPROVED_STYLE` defined with M1–M7. Separate `research` and `style_profile` blockers. A manual style never clears the research blocker (§7). | U-S1 (product decision: is a manual style wanted?), U-S2 (exact blocker predicates), RA-1 and RA-2 readiness-contract changes (separate approval) |

No ONB item is OPEN. The PARTIAL items do not hide any capability as
supported: every one is fail-closed until its dependency is resolved.

Additional items:

| Item | Status | Section |
|---|---|---|
| Execution authority language | CLOSED | §3 |
| Restriction-only rule | CLOSED | §5 |
| Approver changes | CLOSED | §6 |
| Cross-org delegation | PARTIAL (inventory U-T1/U-T3) | §8 |
| Selected-offer / fact model | PARTIAL (reader adaptation C2/C4 before price or salary use) | §11 |
| CAREER acceptance contract | CLOSED as a contract. The test itself is **NOT_READY**. | §13 |
| MVP scope separation | CLOSED | §15 |
| Smallest implementation slice | CLOSED | §17 |

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
| U-R1 | exact `ri_*` table / column inventory | §9 adapter binding | DOT (LAB) | no adapter is specified |
| U-R2 | SourceSpec fields v1 accepts | §9.5 | DOT (LAB) | MISSING |
| U-R3 | v1 freshness rule sets and labels | v2 §5.5 R3 | DOT (LAB) | field hidden |
| U-R4 | stable v1 packet hash | §12.3 | DOT (LAB) | hash computed at selection |
| U-R5 | which `source_type`s have a confirmed working transport | §9.4 V7 | DOT (LAB) | not selectable |
| U-A1 | exact names and records of the current live controls (§3.1) | §3.3 binding | DOT | no onboarding-managed account goes live |
| U-A2 | full list of CATFOOD paths that require `execution_authorities` | §3.3, Q8, N7 | DOT | treated as applicable where unknown (fail closed) |
| U-Q1 | authoritative evidence source per Q1–Q9 and N1–N7, and each source's coverage start | §4 | DOT | unknown = not quiescent / proof fails |
| U-C1 | MAINLINE merge state of the cost tables | §10.1 | DOT / operator | reporting only |
| U-C2 | per-post call estimate and pricing table version | §10.3 Writer-limit proposal | operator | no proposal; manual Writer limit |
| U-C3 | which non-Writer paths enforce a daily cap | §10.2 | DOT | not enforced |
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
| K9 | unsupported Research fields (MISSING / CONFLICT, §9.5, v2 §5.5) are **explicitly reported** in the CompileReport |
| K10 | templates cannot create verified facts: the output has only CUSTOMER_ASSERTED assertions, and `kind: fact ⇒ defaultable: false` is enforced |
| K11 | templates cannot create approvals: the output has no approval, config approval or content approval |
| K12 | A1 / A2 **golden tests**: compiling the A1/A2 submissions reproduces their current `config_json` after normalization. Any difference is reported as EXACT_PARITY / INTENDED_DIVERGENCE / REGRESSION (§11.6). |

**CompileReport** contains: input versions and hashes, output hash, rejected
unknown fields, unsupported Research fields with their status, defaults
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

U-A1, U-A2, U-Q1, U-R1, U-R2, U-R5, U-S2, U-T1 and U-T3 are read-only
investigations. They can proceed independently and change nothing.

### 17.4 Separately approved dependencies (replaces the v2 §13.2 list)

- **G-ACTIVE:** PRODUCT ACTIVE as an extra admission guard and `arm()`
  precondition, onboarding-managed accounts only (§3.4)
- **G-FENCE:** ingress fence in the admission path (§4.2)
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

---

## 18. Further amendments to retained v1 sections

These add to v2 §17. Where they disagree with v1 or v2, these win.

| v1 location | v1 text | Amendment |
|---|---|---|
| §2 rename table | 「月額の上限」 | 「月額の目安」 |
| §2 journey flow (STEP 10) and §3.12 title | 月額の上限 | 月額の目安 |
| §3.11 `ops.pause_rules` | 「月額上限に到達 (always on)」 | **withdrawn.** No monthly cap signal exists. A Writer daily-limit hit stops Writer generation for that UTC day. It is not a pause rule. |
| §3.12 `cost.on_cap` | 「その月は新しい投稿を作らない」 (default) | **withdrawn** (MISSING until a Cost Governor exists). Options: 「その日の投稿文の作成を止める」 (Writer daily limit) and, only where the template supports it, deterministic mode. |
| §4.2 CostPolicy row | "Cap reached ⇒ block or deterministic mode. Never overspend silently." Per-feature `ai_cost_policies` for writer / research_classify / research_angle / qa_semantic | Desired limit plus a Writer daily-limit proposal. Other features' rows are estimates and reporting only, unless enforcement on that path is confirmed (U-C3). "Never overspend silently" is withdrawn. |
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

## FINAL STATUS

**DESIGN_V3_READY_FOR_FINAL_REAUDIT**

All fifteen items of the v3 corrective brief are applied (§1). Each ONB
finding has an explicit CLOSED / PARTIAL / OPEN status with its remaining
dependency (§14). No ONB item is OPEN. Every PARTIAL item is fail-closed
until its named inventory or separately approved change exists. No current
capability is overstated. The current two-account MVP is unaffected.
