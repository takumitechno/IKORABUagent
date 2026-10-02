/**
 * POST /api/contact — Cloudflare Pages Function
 *
 * Browser → this function → email provider → company inbox.
 * The recipient, the sender and every credential come from Cloudflare environment
 * variables / secrets. Nothing in the request can choose or change the recipient.
 * The response says { ok: true } only after the provider has accepted the message.
 *
 * Environment (see README "Contact form: server configuration"):
 *   EMAIL_PROVIDER        "resend" | "cloudflare"   (unset = sending disabled → 503)
 *   CONTACT_TO            recipient address                       (variable)
 *   CONTACT_FROM          sender address on a verified domain     (variable)
 *   RESEND_API_KEY        Resend API key                          (secret, provider "resend")
 *   SEND_EMAIL            send_email binding                      (binding, provider "cloudflare")
 *   TURNSTILE_SECRET_KEY  Turnstile secret; when set, a token is required (secret)
 *   CONTACT_RATE_LIMITER  Workers rate limiting binding            (binding, optional)
 *   ALLOWED_ORIGINS       extra allowed Origin values, comma separated (variable, optional)
 */

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

// ---------- providers: resolve only after the provider has accepted the message ----------

async function sendResend(env, mail) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: mail.replyTo, subject: mail.subject, text: mail.text })
  });
  let data = {};
  try { data = await res.json(); } catch { data = {}; }
  if (!res.ok || !data.id) throw new Error(`resend ${res.status}`);
  return data.id;
}

const utf8b64 = str => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
// RFC 2047 encoded words, split on character boundaries so no word exceeds 75 characters
export function encodeWord(str) {
  const words = [];
  let cur = '';
  for (const ch of str) {
    if (new TextEncoder().encode(cur + ch).length > 42) { words.push(cur); cur = ''; }
    cur += ch;
  }
  if (cur) words.push(cur);
  return words.map(w => `=?UTF-8?B?${utf8b64(w)}?=`).join('\r\n ');
}
export function buildMime(env, mail, id) {
  const domain = String(env.CONTACT_FROM).split('@')[1] || 'localhost';
  const body = utf8b64(mail.text).replace(/.{1,76}/g, '$&\r\n');
  return [
    `From: ${encodeWord('匠Technologies Webサイト')} <${env.CONTACT_FROM}>`,
    `To: <${env.CONTACT_TO}>`,
    `Reply-To: <${mail.replyTo}>`,
    `Subject: ${encodeWord(mail.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${id}@${domain}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body
  ].join('\r\n');
}
async function sendCloudflare(env, mail) {
  // Cloudflare Email Routing: CONTACT_TO must be a verified destination address of the account
  const { EmailMessage } = await import('cloudflare:email');
  const id = crypto.randomUUID();
  await env.SEND_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, buildMime(env, mail, id)));
  return id;
}

function providerReady(env) {
  if (!env.CONTACT_TO || !env.CONTACT_FROM) return null;
  if (env.EMAIL_PROVIDER === 'resend' && env.RESEND_API_KEY) return sendResend;
  if (env.EMAIL_PROVIDER === 'cloudflare' && env.SEND_EMAIL) return sendCloudflare;
  return null;
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
