import type { Metadata } from 'next'

import { getSiteUrl, siteName } from '@/lib/site'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description: 'Read the Bible with fast navigation, clean typography, and SEO-friendly routes.',
  openGraph: {
    title: siteName,
    description: 'Read the Bible with fast navigation, clean typography, and SEO-friendly routes.',
    url: '/',
    siteName,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: 'Read the Bible with fast navigation, clean typography, and SEO-friendly routes.'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <div className="page-shell">
          <header className="site-header">
            <div className="shell site-nav">
              <a className="brand" href="/" aria-label="Bible.me home">
                <strong>Bible.me</strong>
                <span>Readable scripture with clean routes</span>
              </a>
              <nav className="nav-links" aria-label="Primary">
                <a className="nav-pill" href="/">
                  Home
                </a>
                <a className="nav-pill" href="/tree">
                  Tree
                </a>
                <a className="nav-pill" href="/story">
                  Story
                </a>
              </nav>
            </div>
          </header>
          <main id="content" className="shell">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
