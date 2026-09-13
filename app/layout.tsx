import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import './globals.css'

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'หมูกรอบพอแดกได้',
  description: 'POS By DEVYIM',
  generator: 'devyim.app',

  icons: {
    icon: '/apple-icon.png',
    apple: '/apple-icon.png',
  },

  openGraph: {
    title: 'หมูกรอบพอแดกได้',
    description: 'POS By DEVYIM',
    url: 'https://moo-grob.devyim.site',
    siteName: 'หมูกรอบพอแดกได้',
    images: [
      {
        url: 'https://moo-grob.devyim.site/og-image.png',
        width: 1200,
        height: 630,
        alt: 'หมูกรอบพอแดกได้',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'หมูกรอบพอแดกได้',
    description: 'POS By DEVYIM',
    images: ['https://moo-grob.devyim.site/og-image.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#d98a3a',
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`light bg-background ${plexThai.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}