import { NextRequest, NextResponse } from 'next/server';
import { submitAnswer, getTodayDateKey, isValidDateKey } from '@/lib/storage';
import { getSessionPartner, unauthorized } from '@/lib/auth';
import { stateResponse } from '@/lib/view';

export const dynamic = 'force-dynamic';

const MAX_ANSWER_LENGTH = 2000;

export async function POST(request: NextRequest) {
  const me = getSessionPartner(request);
  if (!me) return unauthorized();

  try {
    const body = await request.json();
    const { answerText, date } = body;

    if (typeof answerText !== 'string' || !answerText.trim()) {
      return NextResponse.json({ error: 'Missing answerText' }, { status: 400 });
    }
    if (answerText.length > MAX_ANSWER_LENGTH) {
      return NextResponse.json({ error: 'Answer is too long' }, { status: 400 });
    }

    // Allow answering yesterday's question too, so an app left open past midnight
    // still saves the answer to the question that was on screen.
    const today = getTodayDateKey();
    const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000)
      .toISOString()
      .slice(0, 10);
    const targetDate = isValidDateKey(date) && (date === today || date === yesterday) ? date : today;

    const updated = await submitAnswer(me, targetDate, answerText);
    return stateResponse(updated, me);
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 });
  }
}
