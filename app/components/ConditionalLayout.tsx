'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isEditorPage = pathname?.startsWith('/editor')

  return (
    <>
      {!isAdminPage && !isEditorPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminPage && !isEditorPage && <Footer />}
    </>
  )
}
