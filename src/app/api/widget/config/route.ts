import { NextRequest, NextResponse } from 'next/server';
import { getWidgetPreferences, saveWidgetPreferences } from '@/lib/storage';
import { PartnerId, WidgetPreferences } from '@/lib/types';

export const dynamic = 'force-dynamic';

function resolvePartner(param: string | null): PartnerId {
  if (param === 'partner2' || param === 'her' || param === 'them' || param === 'p2') {
    return 'partner2';
  }
  return 'partner1';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partner = resolvePartner(searchParams.get('partner'));
    const prefs = getWidgetPreferences(partner);
    return NextResponse.json({ partner, preferences: prefs });
  } catch (error) {
    console.error('Error fetching widget preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const partner = resolvePartner(body.partner || searchParams.get('partner'));
    
    const updated = saveWidgetPreferences(partner, body.preferences || body);
    return NextResponse.json({ success: true, partner, preferences: updated });
  } catch (error) {
    console.error('Error saving widget preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
