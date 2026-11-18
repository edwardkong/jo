// The notes inbox: a Cloudflare Worker that receives the "order slip" form from a post page,
// checks it for spam, and commits the note as a YAML file in the site's repo. The site then
// rebuilds and the note appears under the post. Nothing is stored anywhere else.
//
// Secrets (wrangler secret put ...):   GITHUB_TOKEN      fine-grained PAT, Contents: read+write on the repo
//                                      TURNSTILE_SECRET  Cloudflare Turnstile secret key (optional but recommended)
// Vars (wrangler.toml):                GITHUB_REPO       "owner/repo"
//                                      GITHUB_BRANCH     "main"
//                                      SITE_URL          "https://owner.github.io/repo"  (no trailing slash)
// Optional binding:                    LIMITER           Workers rate limiting (see wrangler.toml)

const MAX_BODY = 2000;
const MAX_NAME = 60;
const SLUG = /^[a-z0-9][a-z0-9-]{0,99}$/;

export default {
  async fetch(request, env) {
    const origin = new URL(env.SITE_URL).origin;
    const cors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      Vary: 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') {
      return new Response('notes inbox. nothing to see here.', { status: 200, headers: cors });
    }

    const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
    const reply = (status, body, slug) => {
      if (wantsJson) {
        return new Response(JSON.stringify(body), {
          status,
          headers: { ...cors, 'Content-Type': 'application/json' },
        });
      }
      // No-JS fallback: send the reader back to the post.
      const back = slug ? `${env.SITE_URL}/menu/${slug}/?note=${body.ok ? 'sent' : 'failed'}#notes` : env.SITE_URL;
      return new Response(null, { status: 303, headers: { ...cors, Location: back } });
    };

    // Only accept posts from the site itself (browsers always send Origin on cross-site POSTs).
    const reqOrigin = request.headers.get('Origin');
    if (reqOrigin && reqOrigin !== origin) return reply(403, { ok: false, error: 'wrong door.' });

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(400, { ok: false, error: 'that was not a form.' });
    }

    const slug = String(form.get('post') || '').trim();
    const name = clean(String(form.get('name') || '')).slice(0, MAX_NAME);
    const body = clean(String(form.get('body') || '')).slice(0, MAX_BODY);
    const trap = String(form.get('website') || '');
    const token = String(form.get('cf-turnstile-response') || '');
    const ip = request.headers.get('CF-Connecting-IP') || '';

    // --- spam checks, cheapest first ---
    if (trap) return reply(200, { ok: true }, slug); // honeypot filled: pretend it worked
    if (!SLUG.test(slug)) return reply(400, { ok: false, error: 'which post was that for?' }, slug);
    if (body.length < 2) return reply(400, { ok: false, error: 'the note is empty.' }, slug);
    if (looksLikeSpam(body)) return reply(400, { ok: false, error: 'that reads like spam. sorry if it is not.' }, slug);

    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: ip || 'anon' });
      if (!success) return reply(429, { ok: false, error: 'slow down a little. try again in a minute.' }, slug);
    }

    if (env.TURNSTILE_SECRET) {
      const human = await verifyTurnstile(env.TURNSTILE_SECRET, token, ip);
      if (!human) return reply(400, { ok: false, error: 'the little checkbox did not go through. try again.' }, slug);
    }

    // The post must exist on the live site (also stops notes on drafts or made-up slugs).
    const page = await fetch(`${env.SITE_URL}/menu/${slug}/`, { method: 'HEAD' });
    if (!page.ok) return reply(404, { ok: false, error: 'that post is not on the menu.' }, slug);

    // --- write the note into the repo ---
    const now = new Date();
    const stamp = now.toISOString().replace(/[:.]/g, '-');
    const id = Math.random().toString(36).slice(2, 7);
    const path = `src/content/comments/${slug}/${stamp}-${id}.yml`;
    const yaml =
      `post: ${slug}\n` +
      `name: ${JSON.stringify(name)}\n` +
      `body: |\n${body.split('\n').map((l) => '  ' + l).join('\n')}\n` +
      `date: ${now.toISOString()}\n`;

    const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'notes-inbox-worker',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Note from a reader on ${slug}`,
        content: toBase64(yaml),
        branch: env.GITHUB_BRANCH || 'main',
        committer: { name: 'notes inbox', email: 'notes@users.noreply.github.com' },
      }),
    });

    if (!res.ok) {
      console.error('github', res.status, await res.text());
      return reply(502, { ok: false, error: 'the kitchen could not pin it up. try again later.' }, slug);
    }
    return reply(200, { ok: true }, slug);
  },
};

/** Trim, normalise line endings, drop control characters (keep newlines and tabs). */
function clean(s) {
  return s
    .replace(/\r\n?/g, '\n')
    .replace(/[^\P{C}\n\t]/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Crude but effective: link-stuffed or shouting notes are not what this slip is for. */
function looksLikeSpam(body) {
  const links = (body.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 1) return true;
  if (/\[url=|\[link=|<a\s/i.test(body)) return true;
  const letters = body.replace(/[^a-z]/gi, '');
  const upper = body.replace(/[^A-Z]/g, '');
  if (letters.length > 20 && upper.length / letters.length > 0.7) return true;
  return false;
}

async function verifyTurnstile(secret, token, ip) {
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json().catch(() => ({}));
  return Boolean(data.success);
}

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
