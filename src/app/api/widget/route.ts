import { NextRequest, NextResponse } from 'next/server';
import { getWidgyPayload, getW12Payload } from '@/lib/storage';
import { PartnerId } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerParam = searchParams.get('partner') || 'partner1';
    const formatParam = searchParams.get('format') || searchParams.get('template') || '';

    let targetPartner: PartnerId = 'partner1';
    if (partnerParam === 'partner2' || partnerParam === 'her' || partnerParam === 'them' || partnerParam === 'p2') {
      targetPartner = 'partner2';
    }

    if (formatParam.toLowerCase() === 'w12') {
      const rows = getW12Payload(targetPartner);
      return NextResponse.json(rows, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const widgetData = getWidgyPayload(targetPartner, baseUrl);

    return NextResponse.json(widgetData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating widget payload:', error);
    return NextResponse.json(
      { error: 'Failed to generate widget data' },
      { status: 500 }
    );
  }
}
