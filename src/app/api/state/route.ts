import { NextRequest, NextResponse } from 'next/server';
import { getCoupleState, updateSettings, isValidDateKey } from '@/lib/storage';
import { getSessionPartner, unauthorized } from '@/lib/auth';
import { stateResponse } from '@/lib/view';
import { PET_EMOJIS } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const me = getSessionPartner(request);
  if (!me) return unauthorized();

  try {
    const state = await getCoupleState();
    return stateResponse(state, me);
  } catch (error) {
    console.error('Error fetching state:', error);
    return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
  }
}

const isValidName = (v: unknown) => v === undefined || (typeof v === 'string' && v.trim().length > 0 && v.length <= 40);
const isValidPet = (v: unknown) => v === undefined || (typeof v === 'string' && v in PET_EMOJIS);
const isValidCustomPet = (v: unknown) =>
  v === undefined ||
  (typeof v === 'object' && v !== null && isValidPet((v as { species?: unknown }).species) && 'species' in v);

export async function POST(request: NextRequest) {
  const me = getSessionPartner(request);
  if (!me) return unauthorized();

  try {
    const body = await request.json();
    const {
      partner1Name,
      partner2Name,
      anniversaryDate,
      partner1Pet,
      partner2Pet,
      partner1CustomPet,
      partner2CustomPet,
    } = body;

    if (
      !isValidName(partner1Name) ||
      !isValidName(partner2Name) ||
      (anniversaryDate !== undefined && !isValidDateKey(anniversaryDate)) ||
      !isValidPet(partner1Pet) ||
      !isValidPet(partner2Pet) ||
      !isValidCustomPet(partner1CustomPet) ||
      !isValidCustomPet(partner2CustomPet)
    ) {
      return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
    }

    const updated = await updateSettings(
      partner1Name,
      partner2Name,
      anniversaryDate,
      partner1Pet,
      partner2Pet,
      partner1CustomPet,
      partner2CustomPet
    );
    return stateResponse(updated, me);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
