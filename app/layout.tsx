import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Providers } from './providers'

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
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen font-sans bg-gray-900 text-gray-100">
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

