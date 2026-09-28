# WP3 final-closure traceability

This inventory binds `WP3-FINAL-CLOSURE-CHARTER/1` to code owners and executable tests. It is not acceptance, enrollment, or operational evidence. Exact run results belong in the candidate report for the audited SHA.

## Acceptance register

| ID | Code/evidence owner | Verification and intended-boundary test |
|---|---|---|
| AC01 | `catfood-coe.ts`, run spec, M/J fixed pins | `catfood-coe-consumer.test.ts` T01-T03; final-closure B2/B3 |
| AC02 | provenance manifest, V4 evidence, M/R/J | enrollment lineage tests; role-channel T01-T14 |
| AC03 | independently selected GO-root policy, GO verifier and M `go` profile | `catfood-go-root-policy.test.ts` G01-G26; trust T01-T02; sealed-input export path |
| AC04 | scope validators in trust/role channel | tenant, account, run and recovery mismatch regressions |
| AC05 | COE acquisition and reducer | full `catfood-coe-consumer.test.ts` pagination/reduction suite |
| AC06 | strict COE/result decoders | corrective04/05 producer union, nested-budget and credential-key tests |
| AC07 | immutable W, clock and observation journal | trust lifecycle/time/coverage suite; M window binding |
| AC08 | governed semantic-credit reducer | corrective04/05 duplicate, causal-credit and three-unit tests |
| AC09 | mutation intent/dispatch journal | corrective08 remote-effect regressions in `catfood-trust.test.ts` |
| AC10 | safety obligation projector | false-SAFE, delayed grant and drain regressions |
| AC11 | dispatch ambiguity normalizer | ambiguity alias and 408/429 regressions |
| AC12 | sticky finality reconstruction | abort/GO withdrawal/CLOSED and stop regressions |
| AC13 | owner/session/permit gates | owner lease, renewal, restart and <=120s permit tests |
| AC14 | recovery/history purpose gates | foreign, expired and positive-use recovery regressions |
| AC15 | paid/writer prohibition and cost evidence | COE prohibited-activity plus cost-accounting tests |
| AC16 | source-derived epochs/work/final closure | full genuine PASS/FAIL/BLOCKED multi-process fixture |
| AC17 | A/L/M/S role descriptors | `catfood-enrollment.test.ts` controlled-launch tests |
| AC18 | V4 enrollment and current status | role-channel registration, wrong-key, expiry and revocation tests |
| AC19 | role PoP/action transaction store | role-channel T01-T11 and stable-job B3 |
| AC20 | process-local sessions and key separation | role-channel T12-T14; four-process fixture; equal-key denial |
| AC21 | journal/checkpoint source custody | trust tamper/high-water/cache tests; sealed-input manifest |
| AC22 | custodian-only R v2 | role-channel release validation, independent policy reference and role/action allowlist |
| AC23 | exact standalone snapshots | final-closure B2: DELETE export, raw hash, sidecar and replacement denial |
| AC24 | immutable J v2 and separate signed JS | B3 plus `verifyEvaluationJobStateEnvelope`; independently resolved GO policy before insert |
| AC25 | evaluator assigned J and verified staging | evaluator role main and V5 multi-process fixture |
| AC26 | stable request/assessment and one E | B3 exact replay/random-retry checks and unique job assessment |
| AC27 | E recovery/cancel/expiry | B3 restart/lost response/cancel-delayed-commit checks |
| AC28 | authorized reviews and contradictions | B3 second job, semantic projection and contradiction record |
| AC29 | independently assigned job/target v2 | protected role reads, independently selected GO policy, T assignment and stale-target denial |
| AC30 | E binds exact C/J/M/R actor evidence | V3 evaluation action and V3 package verifier |
| AC31 | shared source-rederived kernel | direct/independent parity and full trust suite |
| AC32 | protected outer writer credential | V4 assignment plus equal-key and outer re-sign denial |
| AC33 | job-bound P | V3 writer authorization/preparation body validators |
| AC34 | exact I/idempotency | V3 finalize validator, writer V5 store and replay tests |
| AC35 | independent receiving verifier | V5 verifier, protected T and fresh clearance action |
| AC36 | historical stability/current dimensions | +5s/+5m/+1d regressions and fresh +1d verifier process |
| AC37 | sticky ancestry | enrollment provenance tests and intermediate TEST_ONLY taint in M |
| AC38 | provisionable operational consumer boundary | common V4 registration path and protected operational factory; missing material denies |
| AC39 | authority incarnation/revision/restore gate | continuity table, ordinary restart B3 and explicit blocked-state denial |
| AC40 | real TEST_ONLY PASS/FAIL/BLOCKED | V5 separated-process fixture |
| AC41 | fail-closed result semantics | trust evaluator and V5 expected-verification paths |
| AC42 | frozen producer compatibility | producer literal/generated union and full COE interoperability tests |
| AC43 | Git/integrity artifacts | consumer integrity manifest and exact candidate report |
| AC44 | independent audit boundary | B1-B3, A01-A55 inventory, full regression and exact-SHA audit pack |

## Attack register

| ID | Disposition | Executable owner/evidence |
|---|---|---|
| A01 | rejected | trust T01 forged GO |
| A02 | rejected | G01 same-ID/different-SPKI and G02 offline store-key swap |
| A03 | rejected | trust SQL/store replacement tests; B2 |
| A04 | rejected | trust checkpoint tamper/high-water tests; B2 |
| A05 | rejected | M pair common-cut and mixed-manifest B2 |
| A06 | rejected | B2 WAL/journal sidecar denial |
| A07 | rejected | B2 stable-handle staging and replacement denial |
| A08 | rejected | retained-source digest/rederivation tests |
| A09 | rejected | G01-G26 independent protected policy; M/store/artifact roots are evidence, never permission |
| A10 | rejected | frozen pin and manifest validation tests |
| A11 | rejected | R receipt/actor/body verification in `issueEvaluationJob` |
| A12 | rejected | SOURCE cannot call custodian release |
| A13 | rejected | WRITER cannot call custodian release |
| A14 | rejected | EVALUATOR cannot call custodian release |
| A15 | rejected | signed J digest and exact package validation |
| A16 | rejected | strict J scope/run validation |
| A17 | rejected | J/R public role-evidence digest binding |
| A18 | rejected | protected exact T and stale-target denial |
| A19 | original E recovered | B3 lost response and authority restart |
| A20 | rejected | B3 random request cannot create another assessment |
| A21 | one original effect | SQLite transaction/unique job assessment and exact replay oracle |
| A22 | conflict | immutable request/body and job uniqueness constraints |
| A23 | historical read only | new subject cannot commit old assigned J; original E remains readable |
| A24 | serialized | B3 cancel wins against delayed prepared commit |
| A25 | allowed only as new J | B3 distinct instructed review |
| A26 | impossible | writer accepts authenticated package and has no evaluator/session callback |
| A27 | rejected | target comes from protected verifier assignment, never artifact |
| A28 | rejected | target supersession and current target transaction check |
| A29 | contradiction retained | B3 divergent authorized assessments block new clearance |
| A30 | rejected | real canonical wrong-key copied-session test |
| A31 | rejected | writer proof cannot authorize evaluator action at authority |
| A32 | rejected | V5 outer re-sign and receipt association tests |
| A33 | rejected | controlled-launch preload/load-restore tests |
| A34 | rejected | corrective08 false-SAFE/delayed-grant regressions |
| A35 | rejected | business ambiguity normalization regressions |
| A36 | rejected | sticky TEST_ONLY provenance and V5 artifact tests |
| A37 | historical only | exact replay returns original receipt, never fresh clearance |
| A38 | historically authentic only | +1d fresh verifier; expired original roles cannot act |
| A39 | rejected | expired/revoked current verifier role-action checks |
| A40 | restart retained; detected restore blocked | B3 ordinary restart plus continuity `BLOCKED` gate |
| A41 | rejected | direct outer/action/authority key equality checks |
| A42 | ambiguity retained | corrective08 408/429 and impossible-state regressions |
| A43 | rejected | scoped recovery expiry/foreign-target tests |
| A44 | blocked | missing GO/environment/clock ancestry cannot verify |
| A45 | TEST_ONLY sticky | acquisition history contributes to M taint |
| A46 | provisionable/absent materials denied | protected operational factory uses common path; no permanent verifier stub |
| A47 | rejected at transaction | writer prepare/finalize and verifier clearance recheck contradictions |
| A48 | rejected | target supersession test before clearance |
| A49 | external deployment gate | peer memory/handle/ACL isolation is not claimed by TEST_ONLY processes |
| A50 | external TCB limit | coherent rollback of all independent anchors is not code-detectable |
| A51 | pre-rehearsal methodology gate | production clock uncertainty is not measured here |
| A52 | real-run gate | no real 24-hour/CATFOOD execution is authorized or claimed |
| A53 | rejected | nested credential-name and resource-budget producer tests |
| A54 | rejected | strict schema/domain/version checks; V4 cannot satisfy V5 expected acceptance |
| A55 | no public API | protected custodian derives M from its configured stores and run only |

## Baseline reproductions

- B1: the shared bearer, copied public evaluator evidence and writer authority reach the real TEST_ONLY authority but cannot create `evaluator.result.commit`; the wrong-key signature is canonical and otherwise well-formed.
- B2: a valid enrolled path accepts the genuine exported pair, while altered bytes, sidecars and a manifest/job mismatch are rejected before evaluation.
- B3: exact retry, lost response and ordinary authority restart return byte-identical E with the same assessment, actor and time; a random request is denied and one assessment row remains for that job.

## B2-GO-ROOT corrective

`catfood-go-root-policy.v1` is owned by the existing protected role-authority accepted-workload configuration. Its reference is mandatory in custody release v2, evaluation job v2 and expected target v2. Store keys are parsed as Ed25519 and fingerprinted over canonical SPKI DER, then the entire effective profile is compared with the independently selected policy before GO use, release, job insertion, evaluation or expected verification. G01-G26 cover same-ID substitution, offline local-hash repair, profile completeness, scope, history/rotation, non-promotion, residual-job denial, evaluator material mismatch and an authentic full chain under policy B rejected by a verifier independently fixed to A.

## Explicit limits

The fixture proves software composition and authenticated role separation, not hostile same-user process isolation. H and production clock methodology remain required before rehearsal. Real launcher/enrollment/build/root/key provisioning, coherent nonrollbackable deployment continuity and the real observation profile remain external gates. Threads is a frozen read-only producer dependency.
