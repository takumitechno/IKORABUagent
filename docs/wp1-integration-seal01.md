# WP1 integration seal

The checked-in producer artifact is
`pokemon-agents/contracts/bridge_contract_v1.json`. It is exported from the
Threads FastAPI/OpenAPI models and generates
`pokemon-agents/web/lib/threads-bridge-contract-v1.generated.ts`:

```console
# From the sibling Threads checkout, export directly into this repository:
python -m threads_autopilot.bridge.contract_export --output ../ikorabu/pokemon-agents/contracts/bridge_contract_v1.json
# Then, from the IKORABU repository:
bun pokemon-agents/scripts/generate-threads-bridge-contract.ts
bun pokemon-agents/scripts/generate-threads-bridge-contract.ts --check
```

The artifact checksum is embedded in the generated file and asserted by the
contract test. Runtime validators then fail closed on missing required fields,
unknown enums, malformed required timestamps, and incompatible schema versions.
Heartbeat transport names are exactly `runner_name` and `last_run_at`; aliases
are not guessed.

Normalized runner evidence preserves producer `expected="unknown"`. Missing,
invalid, future, unsupported, or result-less evidence is unavailable; failed,
stale, unhealthy, and disabled/unknown states are never treated as healthy.
NIGHT and quarantine coverage remains `complete`, `partial`, or `unknown`, and
truncation cannot normalize to complete. Account discovery failure and a valid
zero-active-account result remain distinct ATTENTION alerts.

This repository has no package manifest or canonical repository-wide test
script. WP1 acceptance uses the existing Bun test runner directly:

```console
bun test pokemon-agents/tests/threads-bridge-contract.test.ts pokemon-agents/tests/threads-dashboard.test.ts
bun test pokemon-agents/tests/control-plane-monitor.test.ts
bun test pokemon-agents/tests
```

The scheduler remains enabled only by exact `POKEMON_AGENTS_SCHEDULER=on`;
notification transport requires exact
`IKORABU_NOTIFICATION_TRANSPORT_ENABLED=true`; legacy daily-report LLM use
requires exact `IKORABU_DAILY_REPORT_LLM_ENABLED=true`. Routine monitoring is
deterministic and makes no model calls.
