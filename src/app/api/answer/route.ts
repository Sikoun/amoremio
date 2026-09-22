import { NextRequest, NextResponse } from 'next/server';
import { submitAnswer, getTodayDateKey } from '@/lib/storage';
import { PartnerId } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerId, answerText, date } = body;

    if (!partnerId || !answerText) {
      return NextResponse.json(
        { error: 'Missing partnerId or answerText' },
        { status: 400 }
      );
    }

    const targetDate = date || getTodayDateKey();
    const updated = submitAnswer(partnerId as PartnerId, targetDate, answerText);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 });
  }
}
