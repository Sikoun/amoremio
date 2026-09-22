import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amore Mio 💕',
  description: 'Our private space for daily questions, mood updates, and shared moments.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Amore Mio',
  },
  applicationName: 'Amore Mio',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#fff1f2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-100/60 antialiased selection:bg-rose-200">
        <main className="max-w-md mx-auto min-h-screen flex flex-col relative px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
