import { NextRequest, NextResponse } from 'next/server';
import { updateMood } from '@/lib/storage';
import { PartnerId } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId, mood, moodEmoji } = body;

    if (!partnerId || !mood) {
      return NextResponse.json({ error: 'Missing partnerId or mood' }, { status: 400 });
    }

    const updated = updateMood(partnerId as PartnerId, mood, moodEmoji || '🥰');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating mood:', error);
    return NextResponse.json({ error: 'Failed to update mood' }, { status: 500 });
  }
}
