import { NextRequest, NextResponse } from 'next/server';
import { getWidgyPayload } from '@/lib/storage';
import { PartnerId, WidgyResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerParam = searchParams.get('partner') || 'partner1';
    const key = (searchParams.get('key') || 'question_text') as keyof WidgyResponse;

    let targetPartner: PartnerId = 'partner1';
    if (partnerParam === 'partner2' || partnerParam === 'her' || partnerParam === 'them' || partnerParam === 'p2') {
      targetPartner = 'partner2';
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const widgetData = getWidgyPayload(targetPartner, baseUrl);
    const outputText = String(widgetData[key] ?? widgetData.question_text ?? '');

    return new NextResponse(outputText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating widget text:', error);
    return new NextResponse('Error loading widget text', { status: 500 });
  }
}
