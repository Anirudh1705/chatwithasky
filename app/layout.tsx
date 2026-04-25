import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asky',
  description: 'AI Chatbot inspired by Asky',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-parchment text-near-black">
        {children}
      </body>
    </html>
  )
}
