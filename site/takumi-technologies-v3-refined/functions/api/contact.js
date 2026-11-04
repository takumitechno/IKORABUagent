/**
 * POST /api/contact — Cloudflare Pages Function
 *
 * Browser → this function → SMTP2GO (HTTP API) → info@takumitechno.com
 *   → Cloudflare Email Routing → the company's mailbox.
 * The recipient is fixed here, on the server. Nothing in the request can choose or change it.
 * The visitor's address is used only as Reply-To. The API key lives in a Cloudflare secret.
 * The response says { ok: true } only after SMTP2GO has accepted the message.
 *
 * Environment (see README "Contact form"):
 *   SMTP2GO_API_KEY       SMTP2GO API key with permission to send   (secret; unset = sending disabled → 503)
 *   CONTACT_FROM          sender address verified in SMTP2GO        (variable, optional; default info@takumitechno.com)
 *   TURNSTILE_SECRET_KEY  Turnstile secret; when set, a token is required (secret, optional)
 *   CONTACT_RATE_LIMITER  Workers rate limiting binding            (binding, optional)
 *   ALLOWED_ORIGINS       extra allowed Origin values, comma separated (variable, optional)
 */

const CONTACT_TO = 'info@takumitechno.com';
const DEFAULT_FROM = 'info@takumitechno.com';
const SENDER_NAME = 'Takumi Technologies Website';
const SMTP2GO_SEND = 'https://api.smtp2go.com/v3/email/send';
const MAX_BODY = 16 * 1024;
const MIN_ELAPSED_MS = 3000;
const TOPICS = ['運用代行', 'メディア自動運用', '業務改善・BPO', '広告運用・マーケティング', '環 — MEGURIについて', 'その他'];
const LIMITS = { name: 100, company: 100, email: 254, url: 300, message: 2000 };
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(\.[^\s@<>()[\]\\,;:".]+)+$/;

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra }
});

// control and bidi-override characters never belong in a form value
const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‎‏‪-‮⁦-⁩]/g;
const oneLine = v => String(v ?? '').replace(/[\r\n\t]+/g, ' ').replace(CTRL, '').replace(/\s{2,}/g, ' ').trim();
const multiLine = v => String(v ?? '').replace(/\r\n?/g, '\n').replace(CTRL, '').replace(/\n{4,}/g, '\n\n\n').trim();

function isUrl(v) {
  if (/\s/.test(v)) return false;
  try {
    const u = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(v) ? v : 'https://' + v);
    return (u.protocol === 'https:' || u.protocol === 'http:') && u.hostname.includes('.');
  } catch { return false; }
}

async function readLimited(request) {
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY) return { tooLarge: true };
  if (!request.body) return { text: '' };
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) { try { await reader.cancel(); } catch { /* ignore */ } return { tooLarge: true }; }
    chunks.push(value);
  }
  const buf = new Uint8Array(size);
  let o = 0;
  for (const c of chunks) { buf.set(c, o); o += c.byteLength; }
  return { text: new TextDecoder().decode(buf) };
}

export function validate(input) {
  const v = {
    name: oneLine(input.name),
    company: oneLine(input.company),
    email: oneLine(input.email),
    topic: oneLine(input.topic),
    url: oneLine(input.url),
    message: multiLine(input.message)
  };
  const errors = {};
  if (!v.name) errors.name = 'required'; else if (v.name.length > LIMITS.name) errors.name = 'too_long';
  if (v.company.length > LIMITS.company) errors.company = 'too_long';
  if (!v.email) errors.email = 'required';
  else if (v.email.length > LIMITS.email || !EMAIL_RE.test(v.email)) errors.email = 'invalid';
  if (!TOPICS.includes(v.topic)) errors.topic = 'invalid';
  if (!v.message) errors.message = 'required'; else if (v.message.length > LIMITS.message) errors.message = 'too_long';
  if (v.url && (v.url.length > LIMITS.url || !isUrl(v.url))) errors.url = 'invalid';
  if (input.consent !== true) errors.consent = 'required';
  return { values: v, errors };
}

export function buildEmail(v, now = new Date()) {
  const sentAt = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(now) + '（日本時間）';
  const subject = oneLine(`【匠Technologies お問い合わせ】${v.topic} / ${v.name}`).slice(0, 200);
  const text = [
    'Webサイトのお問い合わせフォームから、次の内容が送信されました。',
    '',
    `お名前：${v.name}`,
    `会社名・屋号：${v.company || '（未記入）'}`,
    `メールアドレス：${v.email}`,
    `ご相談内容：${v.topic}`,
    `Webサイト / SNS URL：${v.url || '（未記入）'}`,
    `送信日時：${sentAt}`,
    '',
    '―― お問い合わせ本文 ――',
    v.message,
    '',
    '――',
    'このメールに返信すると、送信者のメールアドレス宛に返信されます。'
  ].join('\n');
  return { subject, text };
}

// ---------- delivery: resolves only after SMTP2GO has accepted the message ----------

// the sender must be an address (or on a domain) verified in SMTP2GO
export function senderAddress(env) {
  const from = oneLine(env.CONTACT_FROM);
  return from && EMAIL_RE.test(from) ? from : DEFAULT_FROM;
}

export function smtp2goRequest(env, mail) {
  return {
    sender: `${SENDER_NAME} <${senderAddress(env)}>`,
    to: [CONTACT_TO],
    subject: mail.subject,
    text_body: mail.text,
    custom_headers: [{ header: 'Reply-To', value: mail.replyTo }]
  };
}

async function sendSmtp2go(env, mail) {
  const res = await fetch(SMTP2GO_SEND, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Smtp2go-Api-Key': env.SMTP2GO_API_KEY },
    body: JSON.stringify(smtp2goRequest(env, mail)),
    signal: AbortSignal.timeout(12000)
  });
  let data = {};
  try { data = await res.json(); } catch { data = {}; }
  const d = data && data.data;
  if (!res.ok || !d || d.succeeded !== 1 || d.failed) {
    throw new Error(`smtp2go ${res.status} ${(d && d.error_code) || ''}`.trim());
  }
  return d.email_id || '';
}

function providerReady(env) {
  return env.SMTP2GO_API_KEY ? sendSmtp2go : null;
}

async function verifyTurnstile(env, token, ip) {
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  return data.success === true;
}

export async function handleContact(request, env = {}) {
  if (request.method !== 'POST') return json(405, { ok: false, code: 'method_not_allowed' }, { 'Allow': 'POST' });

  // same-origin posts only (plus any explicitly allowed origins)
  const origin = request.headers.get('Origin');
  if (origin) {
    const allowed = new Set([new URL(request.url).origin, ...String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)]);
    if (!allowed.has(origin)) return json(403, { ok: false, code: 'forbidden_origin' });
  }
  if (!/^application\/json\b/i.test(request.headers.get('Content-Type') || '')) return json(415, { ok: false, code: 'unsupported_media_type' });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (env.CONTACT_RATE_LIMITER && typeof env.CONTACT_RATE_LIMITER.limit === 'function') {
    const { success } = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${ip || 'unknown'}` });
    if (!success) return json(429, { ok: false, code: 'rate_limited' }, { 'Retry-After': '60' });
  }

  const { text, tooLarge } = await readLimited(request);
  if (tooLarge) return json(413, { ok: false, code: 'too_large' });
  let input;
  try { input = JSON.parse(text); } catch { return json(400, { ok: false, code: 'bad_json' }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json(400, { ok: false, code: 'bad_json' });

  // spam: honeypot filled, or submitted faster than a person can type
  if (oneLine(input.fax)) return json(400, { ok: false, code: 'rejected' });
  if (typeof input.elapsedMs === 'number' && input.elapsedMs < MIN_ELAPSED_MS) return json(400, { ok: false, code: 'rejected' });

  const { values, errors } = validate(input);
  if (Object.keys(errors).length) return json(400, { ok: false, code: 'invalid', errors });

  if (env.TURNSTILE_SECRET_KEY) {
    const token = oneLine(input.turnstileToken);
    if (!token || !(await verifyTurnstile(env, token, ip).catch(() => false))) return json(400, { ok: false, code: 'turnstile' });
  }

  const send = providerReady(env);
  if (!send) return json(503, { ok: false, code: 'not_configured' });

  const { subject, text: body } = buildEmail(values);
  try {
    await send(env, { subject, text: body, replyTo: values.email });
  } catch (err) {
    console.error('contact: delivery failed', err && err.message);
    return json(502, { ok: false, code: 'delivery_failed' });
  }
  return json(200, { ok: true });
}

export const onRequestPost = ({ request, env }) => handleContact(request, env);
export const onRequest = ({ request, env }) => handleContact(request, env);
