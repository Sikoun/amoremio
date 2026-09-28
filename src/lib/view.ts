import { NextResponse } from 'next/server';
import { CoupleData, PartnerId } from './types';

// Shape the shared state for one partner: tag who they are, and keep the blind reveal
// honest by withholding today's partner answer until they've answered themselves.
export function viewFor(state: CoupleData, me: PartnerId): CoupleData {
  const other: PartnerId = me === 'partner1' ? 'partner2' : 'partner1';
  const today = state.answers[state.todayKey];
  if (!today?.[other] || today[me]) {
    return { ...state, me };
  }
  return {
    ...state,
    me,
    answers: {
      ...state.answers,
      [state.todayKey]: {
        ...today,
        [other]: { text: '', answeredAt: today[other]!.answeredAt, hidden: true },
      },
    },
  };
}

export function stateResponse(state: CoupleData, me: PartnerId): NextResponse {
  return NextResponse.json(viewFor(state, me), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
