import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zeno — Business Operating System',
    template: '%s | Zeno',
  },
  description:
    'Run your business. Own your numbers. The premium Business Operating System for freelancers, agencies, startups, and online sellers. Calculators, invoicing, analytics, and more.',
  keywords: [
    'business calculator', 'invoice generator', 'profit calculator', 'GST calculator',
    'shipping calculator', 'freelance pricing', 'business analytics', 'SaaS dashboard',
  ],
  authors: [{ name: 'Zeno' }],
  creator: 'Zeno',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zenoapp.io',
    title: 'Zeno — Business Operating System',
    description: 'Run your business. Own your numbers.',
    siteName: 'Zeno',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zeno — Business Operating System',
    description: 'Run your business. Own your numbers.',
    creator: '@zenoapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F8FC' },
    { media: '(prefers-color-scheme: dark)', color: '#09090E' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
