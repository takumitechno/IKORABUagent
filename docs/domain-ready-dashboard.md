# Dashboard domain-ready runbook

The dashboard remains private and local by default. This preparation does not
purchase a domain, change DNS, create a Cloudflare account, or start a Tunnel.

## Current boundary

- Dashboard origin: `http://127.0.0.1:5733`
- Internal operator page: `http://127.0.0.1:5733/internal`
- Customer-facing page: `http://127.0.0.1:5733/`
- Data Plane Bridge default: `http://127.0.0.1:8000`

The browser only talks to the dashboard origin. The dashboard backend calls the
Bridge with `THREADS_BRIDGE_URL` and `THREADS_BRIDGE_API_KEY`; neither value is
rendered into HTML or browser JavaScript. Do not point a public Tunnel or DNS
record at the Bridge port and do not bind either service to a public interface.
No browser CORS allowance is needed because dashboard requests are same-origin.
Browser mutation requests on the internal page are rejected when their `Origin`
does not match the dashboard origin.

## Local configuration

```dotenv
POKEMON_AGENTS_HOST=127.0.0.1
POKEMON_AGENTS_PORT=5733
THREADS_BRIDGE_URL=http://127.0.0.1:8000
THREADS_BRIDGE_API_KEY=<server-side only, when configured>
THREADS_DASHBOARD_ACCOUNT_ID=acct_8ssana
DASHBOARD_INTERNAL_AUTH=local
```

`local` mode is accepted only while the dashboard is bound to loopback. A
`0.0.0.0`, LAN, or public bind fails at startup. Every route except the explicit
customer allowlist (`/`, `/improvement`, customer assets, and `/health`) is an
internal route.

Start the dashboard as before and open `http://127.0.0.1:5733/`. The internal
account selector is at `/internal`; its options come from the Bridge's
`GET /operator/accounts` response. The customer-facing `/` page intentionally
has no internal account selector.

## Future Cloudflare setup

Use a named Cloudflare Tunnel whose ingress maps `admin.<domain>` to
`http://127.0.0.1:5733`. Keep `POKEMON_AGENTS_HOST=127.0.0.1`; cloudflared runs on
the same machine and reaches the loopback origin. Before enabling the hostname,
create a Cloudflare Access application for `admin.<domain>`, restrict it to the
approved identity or group, enable MFA at the identity provider, and change:

```dotenv
DASHBOARD_INTERNAL_AUTH=cloudflare-access
DASHBOARD_INTERNAL_ALLOWED_EMAILS=operator@example.com
DASHBOARD_INTERNAL_ACCOUNT_IDS=acct_8ssana
DASHBOARD_CSRF_SECRET=<at-least-32-random-characters>
```

In that mode every Agent OS page and API except the customer allowlist requires
the authenticated-user header and JWT assertion inserted by Cloudflare Access.
The email must also be listed in `DASHBOARD_INTERNAL_ALLOWED_EMAILS`, and HQ
account selection is restricted by `DASHBOARD_INTERNAL_ACCOUNT_IDS`. Browser
mutations require a server-issued CSRF token. Non-browser hooks may instead use
a 32+ character `DASHBOARD_INTERNAL_API_KEY` service credential. This is defense in depth, not a substitute
for Access policy enforcement: the origin must remain loopback-only and must not
be reachable directly from the internet.

The Bridge exposes only `GET /health` anonymously. Use
`AUTOPILOT_BRIDGE_AUTH_MODE=local` for a loopback-only developer Bridge. For a
service-authenticated deployment set `AUTOPILOT_BRIDGE_AUTH_MODE=api-key` and a
32+ character `AUTOPILOT_BRIDGE_API_KEY`; missing configuration fails closed.
The dashboard sends that key server-to-server and never renders it into HTML.

Required user-owned inputs when enabling it:

1. A domain controlled in Cloudflare and the intended `admin` hostname.
2. A Cloudflare Zero Trust account and an identity provider/login method.
3. The exact email address or group allowed by the Access policy, plus the MFA
   policy to apply.
4. A machine authorized to run `cloudflared` continuously and create a named
   Tunnel.
5. Permission to create the Tunnel DNS route for `admin.<domain>`.
6. A server-side Bridge API key if the Bridge is moved off loopback. Never put
   it in browser code, query strings, or Cloudflare public variables.

Recommended hostname roles:

- `admin.<domain>`: private operator dashboard, always protected by Access.
- `app.<domain>`: future customer-facing product with tenant authentication and
  no internal account selector or Agent OS operational detail.
- `api.<domain>`: reserved API edge only if a future architecture requires it.
  Prefer private service-to-service routing; do not expose the current Bridge
  directly under this hostname.

## Security and operational constraints

- Cloudflare Access must be active before the `admin` hostname is made usable.
- Keep secrets, tokens, admin keys, request IDs, hashes, and database paths out
  of UI responses and logs intended for customers.
- The account selector changes only Bridge-scoped reads and the selected manual
  post policy update. It does not publish to Meta.
- Do not enable live publish, change NIGHT batch configuration, or alter Task
  Scheduler as part of domain setup.
- A future customer deployment should be a separate surface or deployment, not
  an unprotected alias of the internal dashboard.
