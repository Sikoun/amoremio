import { NextRequest, NextResponse } from 'next/server';
import { sendPoke } from '@/lib/storage';
import { PartnerId } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromPartnerId, emoji, message } = body;

    if (!fromPartnerId) {
      return NextResponse.json({ error: 'Missing fromPartnerId' }, { status: 400 });
    }

    const updated = sendPoke(
      fromPartnerId as PartnerId,
      emoji || '💖',
      message || 'Sent you love!'
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error sending poke:', error);
    return NextResponse.json({ error: 'Failed to send poke' }, { status: 500 });
  }
}
