import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getWidgyPayload } from '@/lib/storage';
import { PartnerId } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerParam = searchParams.get('partner') || 'partner1';
    const theme = searchParams.get('theme') || 'rose'; // 'rose' | 'dark'

    let targetPartner: PartnerId = 'partner1';
    if (
      partnerParam === 'partner2' ||
      partnerParam === 'her' ||
      partnerParam === 'them' ||
      partnerParam === 'p2'
    ) {
      targetPartner = 'partner2';
    }

    const data = getWidgyPayload(targetPartner);

    const isDark = theme === 'dark';
    const bgGradient = isDark
      ? 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)'
      : 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 45%, #fecdd3 100%)';
    const cardBorder = isDark ? '#3f3f46' : '#fecdd3';
    const textColor = isDark ? '#ffffff' : '#4c0519';
    const subtextColor = isDark ? '#a1a1aa' : '#9f1239';
    const badgeBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.7)';
    const badgeText = isDark ? '#f43f5e' : '#e11d48';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px 44px',
            background: bgGradient,
            fontFamily: 'sans-serif',
            position: 'relative',
            borderRadius: '40px',
            border: `3px solid ${cardBorder}`,
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: badgeBg,
                padding: '8px 18px',
                borderRadius: '999px',
                border: `1.5px solid ${cardBorder}`,
              }}
            >
              <span style={{ fontSize: '18px' }}>✨</span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: badgeText,
                  textTransform: 'uppercase',
                }}
              >
                {data.question_category}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: badgeBg,
                padding: '8px 18px',
                borderRadius: '999px',
                border: `1.5px solid ${cardBorder}`,
              }}
            >
              <span style={{ fontSize: '18px' }}>💕</span>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: subtextColor,
                }}
              >
                {data.days_together}
              </span>
            </div>
          </div>

          {/* Question Text in Center */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '12px 0',
            }}
          >
            <span
              style={{
                fontSize: data.question_text.length > 70 ? '24px' : '28px',
                fontWeight: 700,
                lineHeight: 1.35,
                color: textColor,
                textWrap: 'balance',
              }}
            >
              &ldquo;{data.question_text}&rdquo;
            </span>
          </div>

          {/* Footer Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '16px',
              borderTop: `1.5px solid ${cardBorder}`,
            }}
          >
            {/* Left: Partner status and mood */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize: '20px' }}>{data.partner_mood_emoji}</span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: subtextColor,
                  }}
                >
                  {data.partner_name}: {data.partner_status_badge}
                </span>
              </div>
            </div>

            {/* Right: Tap indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f43f5e',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '14px',
                boxShadow: '0 4px 10px rgba(244, 63, 94, 0.3)',
              }}
            >
              <span>Tap to Open 💕</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 420,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error generating widget image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
