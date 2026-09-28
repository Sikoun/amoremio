import { NextRequest, NextResponse } from 'next/server';
import { updateMood } from '@/lib/storage';
import { getSessionPartner, unauthorized } from '@/lib/auth';
import { stateResponse } from '@/lib/view';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const me = getSessionPartner(request);
  if (!me) return unauthorized();

  try {
    const body = await request.json();
    const { mood, moodEmoji } = body;

    if (typeof mood !== 'string' || !mood.trim() || mood.length > 60) {
      return NextResponse.json({ error: 'Mood must be 1–60 characters' }, { status: 400 });
    }
    const emoji = typeof moodEmoji === 'string' && moodEmoji.length <= 16 ? moodEmoji : '🥰';

    const updated = await updateMood(me, mood, emoji);
    return stateResponse(updated, me);
  } catch (error) {
    console.error('Error updating mood:', error);
    return NextResponse.json({ error: 'Failed to update mood' }, { status: 500 });
  }
}
