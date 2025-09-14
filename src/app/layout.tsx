import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SongBird - Learn Through Music',
  description: 'Transform your study materials into catchy songs that stick in your memory forever',
  keywords: ['education', 'music', 'learning', 'study', 'songs', 'memory'],
  authors: [{ name: 'SongBird Team' }],
  openGraph: {
    title: 'SongBird - Learn Through Music',
    description: 'Transform your study materials into catchy songs that stick in your memory forever',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SongBird - Learn Through Music',
    description: 'Transform your study materials into catchy songs that stick in your memory forever',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Layout>
            {children}
          </Layout>
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
