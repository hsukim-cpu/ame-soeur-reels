import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'âme soeur Reels Script Generator',
  description: 'AI-powered Instagram Reels script generation for âme soeur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-[#FAFAF8]">
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
