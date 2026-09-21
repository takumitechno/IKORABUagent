# Capability Bridge boundary (HQ04)

`scripts/capability-client.sh` is the shared HTTP transport from the Control
Plane to the Threads Data Plane. Agent definitions must delegate to this
capability layer; they must not contain HTTP paths, curl commands, provider
credentials, or publishing logic.

The client supports three read-only capabilities and three mutation
capabilities:

```sh
bash scripts/capability-client.sh \
  --capability preflight \
  --account-id acct_8ssana \
  --agent-id hitomi-selector

bash scripts/capability-client.sh \
  --capability threads.content.preview \
  --account-id acct_8ssana \
  --agent-id hitomi-selector \
  --topic '音信不通' \
  --content-role reach

bash scripts/capability-client.sh \
  --capability threads.content.generate \
  --account-id acct_8ssana \
  --agent-id kiara-executor \
  --request-id one-human-issued-id

bash scripts/capability-client.sh \
  --capability threads.content.revise \
  --account-id acct_8ssana \
  --content-id cv-example \
  --expected-version 1 \
  --expected-content-hash '<64-character-sha256>' \
  --human-feedback 'Keep the voice; correct the reviewed claims.' \
  --agent-id takumi-human \
  --request-id one-revision-id \
  --confirm-human

bash scripts/capability-client.sh \
  --capability threads.approval.get \
  --account-id acct_8ssana \
  --content-id cv-example \
  --request-id one-review-id

bash scripts/capability-client.sh \
  --capability threads.approval.approve \
  --account-id acct_8ssana \
  --content-id cv-example \
  --expected-version 1 \
  --expected-content-hash '<64-character-sha256>' \
  --agent-id takumi-human \
  --request-id one-approval-id \
  --confirm-human

bash scripts/capability-client.sh \
  --capability threads.approval.reject \
  --account-id acct_8ssana \
  --content-id cv-example \
  --expected-version 1 \
  --expected-content-hash '<64-character-sha256>' \
  --agent-id takumi-human \
  --request-id one-rejection-id \
  --reason 'revision required' \
  --confirm-human
```

The client uses `THREADS_BRIDGE_URL` (default
`http://127.0.0.1:8000`) and `THREADS_BRIDGE_API_KEY`. A missing key is allowed
only for localhost development. A remote origin requires HTTPS and an API key.

The Data Plane Bridge resolves every production-v2 Store dependency through
`THREADS_PRODUCTION_DB`. It is optional for the localhost repository layout,
where the absolute project-root `data/research.db` is the default. When set it
must be an absolute path. The older `THREADS_RESEARCH_DB` remains a fallback;
the legacy `THREADS_AUTOPILOT_DB` is intentionally separate and is never used
as a production-v2 fallback. The resolved path is written only to Data Plane
operator logs, not capability responses.

`threads.publish` is exposed only as an explicit `--dry-run` mutation in
HQ09A. It sends the exact version/hash and request ID to
`POST /autopilot/v2/publish`, performs no automatic HTTP retry, and cannot
select a live publisher. Live publication remains unavailable through the
Control Plane.

HQ10A adds a separate manual-only `threads.publish.live` transport in
`scripts/live-publish-client.sh`. It is intentionally absent from the generic
capability allowlist and requires a live-only admin key plus an exact typed
account/handle/content/version/hash confirmation. See
`docs/hq10a-live-publish.md`. This does not make an account active or configure
its production rate policy.

`threads.content.preview` sends a JSON POST to the production v2 preview route.
It is always `dry_run=true`, costs $0, permits a usable draft account, and
returns only reference IDs—not prompt or reference bodies. Its output is not
approved and cannot be published.

`threads.content.generate` sends one JSON POST to the production v2 paid
generation route. It forwards only account ID, actor, and optional request ID;
provider/model remain Data Plane configuration. This mutation has **zero
automatic retries**, because the current Data Plane schema does not provide
request-ID idempotency. A network or HTTP failure is returned to the operator
without resending.

Successful generation ends at human approval pending (or QA rejected after the
Writer's bounded attempts). It is not approval, publish, account activation,
or a live Threads action. `threads.content.preview` remains read-only/$0;
`threads.content.generate` is paid and mutates the production content ledger.

The older `/autopilot/*` routes are the legacy single-persona pipeline. The
new `/autopilot/v2/*` namespace is account-scoped and production-backed. It
does not provide publishing, notifications, health checks, report building, or
cost queries.

Approval inspection is read-only. Approval and rejection are exact-version,
exact-hash production workflow mutations and have zero automatic retries. The
client requires `--confirm-human`, rejects missing actor/request identifiers,
and the Data Plane rejects obvious automation actors. This is a safety
boundary, not strong human authentication: actor names and the human flag are
caller assertions, and request IDs are not yet durably unique. Do not invoke
approval mutations from a scheduler, executor agent, or autonomous loop.

Human revision is also a manual mutation with zero automatic retries. It sends
only the exact reviewed content identity and editorial feedback; provider and
model remain Data Plane configuration. It creates another unapproved review
candidate after the existing Writer, Copy Guard and QA gates. It does not
approve, publish, arm an account, or call Threads.
