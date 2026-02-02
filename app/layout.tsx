import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import './globals.css'
import ConditionalLayout from './components/ConditionalLayout'
import { Providers } from './providers'
import GoogleAnalytics from './components/GoogleAnalytics'
import CookieConsentBanner from './components/CookieConsentBanner'

export const metadata: Metadata = {
  title: '100AFRO | African Entertainment Hub',
  description: 'The world\'s leading destination for African entertainment, bridging the gap between the continent and the diaspora.',
  keywords: ['African music', 'Afrobeats', 'Entertainment', 'Culture', 'Music', 'Videos'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '100AFRO',
  },
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen font-sans bg-gray-900 text-gray-100">
        {gaId && (
          <>
            {/* GA4 scripts will be loaded conditionally via client component */}
            <Suspense fallback={null}>
              <GoogleAnalytics gaId={gaId} />
            </Suspense>
          </>
        )}
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  )
}

