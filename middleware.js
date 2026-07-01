import { next } from '@vercel/edge';

// Framework-agnostic Vercel Edge Middleware. Runs before any static file is
// served, so it gates the entire report (index.html) behind a password.
//
// The real password lives only in the SITE_PASSWORD env var and is compared
// server-side here — it is never sent to the browser. The auth cookie stores
// the SHA-256 of the password (not the password itself), which the middleware
// re-derives from SITE_PASSWORD on each request to validate the session.

const COOKIE = 'mari_auth';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds

export const config = {
  // Run on everything except Vercel internals and favicon (avoids redirect noise).
  matcher: ['/((?!_vercel|_next|favicon.ico).*)'],
};

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const password = process.env.SITE_PASSWORD;
  const token = password ? await sha256Hex(password) : null;
  const authed = token && readCookie(request.headers.get('cookie'), COOKIE) === token;

  // --- Handle login form submission ---
  if (url.pathname === '/api/login' && request.method === 'POST') {
    const form = await request.formData();
    const attempt = String(form.get('password') ?? '');
    if (password && attempt === password) {
      const res = new Response(null, { status: 303, headers: { Location: '/' } });
      res.headers.append(
        'Set-Cookie',
        `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
      );
      return res;
    }
    return Response.redirect(new URL('/login?error=1', request.url), 303);
  }

  // --- The login page itself is always reachable ---
  if (url.pathname === '/login' || url.pathname === '/login.html') {
    if (authed) return Response.redirect(new URL('/', request.url), 302);
    return next();
  }

  // --- Everything else requires a valid session ---
  if (authed) return next();
  return Response.redirect(new URL('/login', request.url), 302);
}
