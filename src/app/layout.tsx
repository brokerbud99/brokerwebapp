import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { BackgroundProvider } from '@/contexts/BackgroundContext'

export const metadata: Metadata = {
  title: 'Broker Web App',
  description: 'Broker web application built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <BackgroundProvider>
            {children}
          </BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
