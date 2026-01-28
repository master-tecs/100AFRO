import type { Metadata } from 'next'
import Script from 'next/script'
import { Suspense } from 'react'
import './globals.css'
import ConditionalLayout from './components/ConditionalLayout'
import { Providers } from './providers'
import GoogleAnalytics from './components/GoogleAnalytics'

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
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
              `}
            </Script>
            <Suspense fallback={null}>
              <GoogleAnalytics gaId={gaId} />
            </Suspense>
          </>
        )}
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}

