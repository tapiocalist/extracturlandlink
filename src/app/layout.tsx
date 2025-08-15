import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { BrowserCompatibilityChecker } from '@/components/BrowserCompatibilityChecker'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'extracturl.link - URL Extractor Tool',
  description: 'Extract URLs from hyperlinked text content - Google Sheets, documents, emails and more',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zoom on input focus
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <BrowserCompatibilityChecker>
          <Navigation />
          {children}
        </BrowserCompatibilityChecker>
      </body>
    </html>
  )
}