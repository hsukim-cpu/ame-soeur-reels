'use client'

import { ReelsScript } from '@/lib/types'

interface ScriptTableProps {
  scripts: ReelsScript[]
  onRowClick: (script: ReelsScript) => void
  isLoading: boolean
}

const SCRIPT_TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  hack: { bg: 'bg-blue-100', text: 'text-blue-700', label: '⚡ Hack' },
  pain: { bg: 'bg-purple-100', text: 'text-purple-700', label: '🥹 痛點共感' },
  new: { bg: 'bg-pink-100', text: 'text-pink-700', label: '😎 新品驚喜' },
  knowledge: { bg: 'bg-green-100', text: 'text-green-700', label: '💡 知識教學' },
  fomo: { bg: 'bg-orange-100', text: 'text-orange-700', label: '🔥 FOMO' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700', label: '其他' },
}

export default function ScriptTable({
  scripts,
  onRowClick,
  isLoading,
}: ScriptTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-lg overflow-hidden">
        <div className="space-y-2 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-[#E8E8E4] rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (scripts.length === 0) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-lg p-12 text-center">
        <p className="text-[#999999]">沒有找到符合條件的腳本</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E8E8E4] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E8E4] bg-[#FAFAF8]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A] uppercase">
                品牌
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A] uppercase">
                類型
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A] uppercase">
                Hook
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A] uppercase">
                瀏覽次數
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A] uppercase">
                評分
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#1A1A1A] uppercase">
                推薦
              </th>
            </tr>
          </thead>
          <tbody>
            {scripts.map((script) => {
              const typeInfo =
                SCRIPT_TYPE_COLORS[script.scriptType] ||
                SCRIPT_TYPE_COLORS.other
              return (
                <tr
                  key={script.id}
                  onClick={() => onRowClick(script)}
                  className="border-b border-[#E8E8E4] hover:bg-[#FAFAF8] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#1A1A1A] text-sm">
                      {script.brand}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}
                    >
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#666666] truncate max-w-xs">
                      {script.hook}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#666666]">
                      {script.viewsCount
                        ? (script.viewsCount / 10000).toFixed(1) + '萬'
                        : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1A1A1A]">
                      {'★'.repeat(script.performanceRating || 0)}
                      {'☆'.repeat(5 - (script.performanceRating || 0))}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {script.isRecommended && (
                      <span className="text-lg">✓</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
