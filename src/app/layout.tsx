import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navigation from '@/components/Navigation'
import { BrowserCompatibilityChecker } from '@/components/BrowserCompatibilityChecker'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'URL Extractor',
  description: 'Extract URLs from hyperlinked text content - Google Sheets, documents, emails and more',
  keywords: ['URL extractor', 'link extractor', 'Google Sheets', 'hyperlinks', 'URL parser'],
  authors: [{ name: 'extracturl.link' }],
  creator: 'extracturl.link',
  publisher: 'extracturl.link',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zoom on input focus
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2983101910496872"
     crossorigin="anonymous"></script>
        
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={dmSans.className}>
        <BrowserCompatibilityChecker>
          <Navigation />
          {children}
        </BrowserCompatibilityChecker>
      </body>
    </html>
  )
}
