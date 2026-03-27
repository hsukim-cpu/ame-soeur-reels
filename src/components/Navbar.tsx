'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 bg-white border-b border-[#E8E8E4] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#1A1A1A]">âme soeur</span>
            <span className="text-sm text-[#999999]">Reels</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            <Link
              href="/generate"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/generate')
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#666666] hover:bg-[#FAFAF8]'
              }`}
            >
              ✨ 生成腳本
            </Link>
            <Link
              href="/library"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/library')
                  ? 'bg-[#1A1A1A] text-white'
                  : 'text-[#666666] hover:bg-[#FAFAF8]'
              }`}
            >
              📚 資料庫
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
