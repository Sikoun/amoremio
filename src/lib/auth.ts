import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { PartnerId } from './types';

export const SESSION_COOKIE = 'amoremio_session';

// Browsers cap cookie lifetime at 400 days; the app refreshes it on every visit.
const SESSION_MAX_AGE = 60 * 60 * 24 * 400;

// Pairing codes are compared case-insensitively and ignore spaces/dashes,
// so "abcd-efgh-jkmn" and "ABCD EFGH JKMN" both work when typed on a phone.
function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

function configuredCodes(): Record<PartnerId, string> | null {
  const p1 = process.env.PARTNER1_CODE;
  const p2 = process.env.PARTNER2_CODE;
  if (!p1 || !p2) return null;
  return { partner1: normalizeCode(p1), partner2: normalizeCode(p2) };
}

export function isAuthConfigured(): boolean {
  return configuredCodes() !== null;
}

export function partnerForCode(code: string | undefined | null): PartnerId | null {
  const codes = configuredCodes();
  if (!codes || !code) return null;
  const normalized = normalizeCode(code);
  if (!normalized) return null;
  if (safeEqual(normalized, codes.partner1)) return 'partner1';
  if (safeEqual(normalized, codes.partner2)) return 'partner2';
  return null;
}

export function getSessionPartner(request: NextRequest): PartnerId | null {
  return partnerForCode(request.cookies.get(SESSION_COOKIE)?.value);
}

export function setSessionCookie(response: NextResponse, code: string): void {
  response.cookies.set(SESSION_COOKIE, normalizeCode(code), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
}

export function unauthorized(): NextResponse {
  const message = isAuthConfigured()
    ? 'Not paired'
    : 'Pairing codes are not configured on the server (PARTNER1_CODE / PARTNER2_CODE)';
  return NextResponse.json({ error: message }, { status: 401 });
}
