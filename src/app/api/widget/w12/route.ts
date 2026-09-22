import { NextRequest, NextResponse } from 'next/server';
import { getW12Payload } from '@/lib/storage';
import { PartnerId } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerParam = searchParams.get('partner') || 'partner1';

    let targetPartner: PartnerId = 'partner1';
    if (
      partnerParam === 'partner2' ||
      partnerParam === 'her' ||
      partnerParam === 'them' ||
      partnerParam === 'p2'
    ) {
      targetPartner = 'partner2';
    }

    const rows = getW12Payload(targetPartner);

    return NextResponse.json(rows, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating W12 widget payload:', error);
    return NextResponse.json(
      [{ key: 'Error loading widget' }],
      { status: 500 }
    );
  }
}
