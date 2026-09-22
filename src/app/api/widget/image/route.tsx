import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getWidgyPayload, getWidgetPreferences } from '@/lib/storage';
import { PartnerId, WidgetTheme } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface ThemeTokens {
  bgGradient: string;
  cardBorder: string;
  textColor: string;
  subtextColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  pillBg: string;
  watermarkColor: string;
}

const THEMES: Record<WidgetTheme, ThemeTokens> = {
  rose: {
    bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 45%, #fecdd3 100%)',
    cardBorder: '#fecdd3',
    textColor: '#881337',
    subtextColor: '#9f1239',
    badgeBg: 'rgba(255, 255, 255, 0.85)',
    badgeBorder: '#fecdd3',
    badgeText: '#e11d48',
    pillBg: 'rgba(255, 255, 255, 0.9)',
    watermarkColor: 'rgba(159, 18, 57, 0.35)',
  },
  lavender: {
    bgGradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 45%, #e9d5ff 100%)',
    cardBorder: '#d8b4fe',
    textColor: '#581c87',
    subtextColor: '#7e22ce',
    badgeBg: 'rgba(255, 255, 255, 0.85)',
    badgeBorder: '#d8b4fe',
    badgeText: '#9333ea',
    pillBg: 'rgba(255, 255, 255, 0.9)',
    watermarkColor: 'rgba(126, 34, 206, 0.35)',
  },
  matcha: {
    bgGradient: 'linear-gradient(135deg, #f7fee7 0%, #ecfccb 45%, #d9f99d 100%)',
    cardBorder: '#bef264',
    textColor: '#365314',
    subtextColor: '#4d7c0f',
    badgeBg: 'rgba(255, 255, 255, 0.85)',
    badgeBorder: '#bef264',
    badgeText: '#65a30d',
    pillBg: 'rgba(255, 255, 255, 0.9)',
    watermarkColor: 'rgba(77, 124, 15, 0.35)',
  },
  peach: {
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 45%, #fed7aa 100%)',
    cardBorder: '#fdba74',
    textColor: '#7c2d12',
    subtextColor: '#c2410c',
    badgeBg: 'rgba(255, 255, 255, 0.85)',
    badgeBorder: '#fdba74',
    badgeText: '#ea580c',
    pillBg: 'rgba(255, 255, 255, 0.9)',
    watermarkColor: 'rgba(194, 65, 12, 0.35)',
  },
  midnight: {
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
    cardBorder: '#3f3f46',
    textColor: '#fafafa',
    subtextColor: '#a1a1aa',
    badgeBg: 'rgba(255, 255, 255, 0.08)',
    badgeBorder: '#3f3f46',
    badgeText: '#fb7185',
    pillBg: 'rgba(255, 255, 255, 0.08)',
    watermarkColor: 'rgba(255, 255, 255, 0.25)',
  },
  minimal: {
    bgGradient: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f4f4f5 100%)',
    cardBorder: '#e4e4e7',
    textColor: '#18181b',
    subtextColor: '#71717a',
    badgeBg: '#ffffff',
    badgeBorder: '#e4e4e7',
    badgeText: '#18181b',
    pillBg: '#ffffff',
    watermarkColor: 'rgba(24, 24, 27, 0.3)',
  },
};

function resolvePartner(param: string | null): PartnerId {
  if (param === 'partner2' || param === 'her' || param === 'them' || param === 'p2') {
    return 'partner2';
  }
  return 'partner1';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPartner = resolvePartner(searchParams.get('partner'));
    const savedPrefs = getWidgetPreferences(targetPartner);

    // Allow query params to override stored preferences (great for live previews)
    const rawTheme = (searchParams.get('theme') as WidgetTheme) || savedPrefs.theme;
    const themeKey: WidgetTheme = THEMES[rawTheme] ? rawTheme : 'rose';
    const theme = THEMES[themeKey];

    const showDays = searchParams.has('showDays')
      ? searchParams.get('showDays') === 'true'
      : savedPrefs.showDays;

    const showCategory = searchParams.has('showCategory')
      ? searchParams.get('showCategory') === 'true'
      : savedPrefs.showCategory;

    const showPartnerStatus = searchParams.has('showPartnerStatus')
      ? searchParams.get('showPartnerStatus') === 'true'
      : savedPrefs.showPartnerStatus;

    const roundedCorners = searchParams.has('rounded')
      ? searchParams.get('rounded') === 'true'
      : savedPrefs.roundedCorners;

    const data = getWidgyPayload(targetPartner);

    const questionFontSize =
      data.question_text.length > 90
        ? '44px'
        : data.question_text.length > 50
        ? '52px'
        : '60px';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 64px',
            background: theme.bgGradient,
            fontFamily: 'sans-serif',
            position: 'relative',
            borderRadius: roundedCorners ? '56px' : '0px',
            border: roundedCorners ? `4px solid ${theme.cardBorder}` : 'none',
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
            {showCategory ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: theme.badgeBg,
                  padding: '12px 24px',
                  borderRadius: '999px',
                  border: `2px solid ${theme.badgeBorder}`,
                }}
              >
                <span style={{ fontSize: '26px' }}>✨</span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    letterSpacing: '1.5px',
                    color: theme.badgeText,
                    textTransform: 'uppercase',
                  }}
                >
                  {data.question_category}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex' }} />
            )}

            {showDays && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: theme.badgeBg,
                  padding: '12px 24px',
                  borderRadius: '999px',
                  border: `2px solid ${theme.badgeBorder}`,
                }}
              >
                <span style={{ fontSize: '26px' }}>💕</span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: theme.subtextColor,
                  }}
                >
                  {data.days_together}
                </span>
              </div>
            )}
          </div>

          {/* Question Text in Center */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: '20px 0',
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: questionFontSize,
                fontWeight: 700,
                lineHeight: 1.35,
                color: theme.textColor,
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
              paddingTop: '24px',
              borderTop: `2px solid ${theme.cardBorder}`,
            }}
          >
            {/* Left: Partner status and mood */}
            {showPartnerStatus ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: theme.pillBg,
                  padding: '10px 22px',
                  borderRadius: '24px',
                  border: `1.5px solid ${theme.badgeBorder}`,
                }}
              >
                <span style={{ fontSize: '28px' }}>{data.partner_mood_emoji}</span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: theme.subtextColor,
                  }}
                >
                  {data.partner_name}: {data.partner_status_badge}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex' }} />
            )}

            {/* Right: Clean, discreet app branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '20px',
                fontWeight: 700,
                color: theme.watermarkColor,
                letterSpacing: '0.5px',
              }}
            >
              <span>Amore Mio</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1600,
        height: 840,
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
