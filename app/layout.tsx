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

