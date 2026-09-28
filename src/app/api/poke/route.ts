import { NextRequest, NextResponse } from 'next/server';
import { sendPoke } from '@/lib/storage';
import { getSessionPartner, unauthorized } from '@/lib/auth';
import { stateResponse } from '@/lib/view';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const me = getSessionPartner(request);
  if (!me) return unauthorized();

  try {
    const body = await request.json();
    const { emoji, message } = body;

    if (message !== undefined && (typeof message !== 'string' || message.length > 200)) {
      return NextResponse.json({ error: 'Message must be under 200 characters' }, { status: 400 });
    }
    const safeEmoji = typeof emoji === 'string' && emoji.length <= 16 ? emoji : '💖';

    const updated = await sendPoke(me, safeEmoji, message?.trim() || 'Sent you love!');
    return stateResponse(updated, me);
  } catch (error) {
    console.error('Error sending poke:', error);
    return NextResponse.json({ error: 'Failed to send poke' }, { status: 500 });
  }
}
