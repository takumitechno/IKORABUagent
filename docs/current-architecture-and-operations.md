# =LOVE Agent OS / Threads current architecture and operations

## Naming and ownership

- **=LOVE Agent OS** is the headquarters / Control Plane.
- **IKORABUagent** is the Control Plane repository.
- **Threads-** is the Threads Data Plane and execution repository.
- ChatGPT / クロちゃん acts as CTO, strategist, PM, and Lead Architect.
- Codex is the development lead. Claude is the auditor and deputy development lead.

The existing `pokemon-agents/` directory, `POKEMON_AGENTS_*` environment variables,
and database legacy columns remain compatibility identifiers. They are not product
names and must not be mechanically renamed without a dedicated migration.

## Trust boundary

The Control Plane decides what, when, and why. The Data Plane owns provider access,
publication state, metrics persistence, and execution safety. `IKORABUagent` never
reads or writes the production database directly; all production information crosses
the Bridge/API boundary. Secrets, tokens, admin keys, personal data, production paths,
and raw internal logs must not appear in documentation examples or customer UI.

## Current Threads operations

- **NIGHT03** is the pre-approved scheduled root batch. Only the approved current
  body/version may enter the batch.
- **NIGHT04** is a one-shot runner launched by Windows Task Scheduler. The runner
  executes once and exits; schedule registration and OS task state remain outside
  this repository's automatic mutation path.
- **Manual Post Sync** imports human-created Threads posts for observation without
  turning them into automatically generated content.
- `analyze_enabled` and `learn_enabled` are separate controls. A new manual post is
  normally analyzable but not learnable until explicitly enabled.
- **Self-Reply Thread Sync** groups an owned root and its self-replies into one logical
  thread, keeps part-level identity and KPI, excludes replies to other people, and
  avoids duplicating existing `ai_auto` split publications.
- The **morning report / KPI / hypothesis loop** uses observed KPI to review hypotheses
  and inform the next plan. Only learn-enabled content may feed learning.

## Partial publication constraint

If PART0 has been published but a following reply fails, the result is partial.
PART0 must not be resent. Operators first reconcile the durable publication record and
then use the explicit recovery path for only the unsent part. This constraint belongs
in operator and publishing recovery documentation; it should not be copied into
unrelated product copy.

Baseline note (2026-09-21): `pub-95ba769052b74542` is a contained unresolved
partial. The root succeeded, the reply failed, and retry remains stopped. This is
not a customer-visible blocker. No automatic retry is allowed, and root resend is
forbidden.

## UI boundary

The customer-facing dashboard must not expose internal Agent names, role topology,
Control/Data Plane implementation details, operational keys, or production paths. The
operator-only `/internal` dashboard may show internal Agent names and sanitized system
state. Its production values still come only from the Bridge/API.

## Mutation boundary

Documentation and dashboard maintenance do not authorize live publish, Meta POST,
production database mutation, account activation, approval changes, rate-policy
changes, kill-switch changes, Task Scheduler changes, or credential rotation.
