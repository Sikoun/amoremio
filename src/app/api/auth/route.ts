import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, isAuthConfigured, partnerForCode, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Pair this device: exchange a pairing code for a long-lived httpOnly session cookie.
export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: 'Pairing codes are not configured on the server' },
      { status: 500 }
    );
  }

  try {
    const { code } = await request.json();
    const partner = typeof code === 'string' ? partnerForCode(code) : null;
    if (!partner) {
      // Small delay to make guessing codes tediously slow
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({ error: "That code doesn't match" }, { status: 401 });
    }

    const response = NextResponse.json({ partner });
    setSessionCookie(response, code);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// Unpair this device
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
