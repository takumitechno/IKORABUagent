# HQ10A manual live publish boundary

Live publishing is not part of the ordinary Agent capability allowlist.
`scripts/capability-client.sh` remains dry-run only. A human operator uses the
separate `scripts/live-publish-client.sh` after all Data Plane safety checks are
ready.

The Bridge must be launched manually with:

- the canonical absolute `THREADS_PRODUCTION_DB`;
- `THREADS_SECRET_BACKEND=windows`;
- a random, live-only `THREADS_LIVE_PUBLISH_ADMIN_KEY` of at least 32
  characters;
- an optional ordinary `AUTOPILOT_BRIDGE_API_KEY`.

Do not put the live admin key in `.env`, a repository file, a scheduler, or an
Agent environment. Supply it only to the manually launched Bridge process. The
manual client reads the same value without echo from the terminal; it has no
command-line or environment-variable option for the key.

The operator must type this exact confirmation for the current content:

```text
LIVE PUBLISH account=<account_id> handle=@<handle> content=<content_id> version=<version> hash=<full_sha256>
```

The live client sends exactly one HTTP request and has no retry. A timeout,
connection loss, or ambiguous result must be inspected and reconciled without
resending. The Data Plane uses the existing durable request claim, publication
identity, central safety gate, `ThreadsPublisher`, and ambiguous-outcome
handling.

The live route does not activate an account, configure rates, change kill
switches, approve content, refresh OAuth, or bypass any production gate.
