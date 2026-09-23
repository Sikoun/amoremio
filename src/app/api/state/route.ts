import { NextRequest, NextResponse } from 'next/server';
import { getCoupleState, updateSettings } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await getCoupleState();
    return NextResponse.json(state, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching state:', error);
    return NextResponse.json({ error: 'Failed to fetch state' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const updated = await updateSettings(
      partner1Name,
      partner2Name,
      anniversaryDate,
      partner1Pet,
      partner2Pet,
      partner1CustomPet,
      partner2CustomPet
    );
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
