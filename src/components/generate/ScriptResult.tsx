'use client'

import { useState } from 'react'
import { GeneratedScript, ReelsScript } from '@/lib/types'

interface ScriptResultProps {
  script: GeneratedScript | null
  referencedScripts: ReelsScript[]
  isLoading: boolean
}

export default function ScriptResult({
  script,
  referencedScripts,
  isLoading,
}: ScriptResultProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showReferences, setShowReferences] = useState(false)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#E8E8E4] rounded-lg p-6">
          <div className="h-8 bg-[#E8E8E4] rounded animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#E8E8E4] rounded animate-pulse"></div>
            <div className="h-4 bg-[#E8E8E4] rounded animate-pulse w-5/6"></div>
          </div>
        </div>
        <div className="bg-white border border-[#E8E8E4] rounded-lg p-6">
          <div className="h-6 bg-[#E8E8E4] rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-[#E8E8E4] rounded animate-pulse"></div>
                <div className="h-3 bg-[#E8E8E4] rounded animate-pulse w-4/5"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!script) {
    return (
      <div className="bg-white border border-[#E8E8E4] rounded-lg p-8 text-center">
        <p className="text-[#999999]">
          填寫表單並點擊「生成腳本」開始創作
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hook Section */}
      <div className="bg-[#1A1A1A] text-white rounded-lg p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 opacity-70">
          Hook - 吸睛開場
        </h3>
        <p className="text-2xl font-semibold leading-relaxed mb-4">
          {script.hook}
        </p>
        <button
          onClick={() => copyToClipboard(script.hook, 'hook')}
          className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
        >
          {copiedField === 'hook' ? '✓ 已複製' : '複製'}
        </button>
      </div>

      {/* Scenes Section */}
      <div className="bg-white border border-[#E8E8E4] rounded-lg p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-[#1A1A1A]">
          分場景展示
        </h3>
        <div className="space-y-4">
          {script.scenes.map((scene) => (
            <div
              key={scene.number}
              className="border-l-4 border-[#1A1A1A] pl-4 py-2"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-[#1A1A1A]">
                  場景 {scene.number}
                </h4>
                {scene.duration && (
                  <span className="text-xs bg-[#FAFAF8] px-2 py-1 rounded text-[#666666]">
                    {scene.duration}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#666666] mb-2">
                <strong>視覺：</strong> {scene.visual}
              </p>
              <p className="text-sm text-[#1A1A1A] bg-[#FAFAF8] p-2 rounded border border-[#E8E8E4]">
                <strong>字幕：</strong> {scene.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Caption Section */}
      <div className="bg-white border border-[#E8E8E4] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]">
            Caption 文案
          </h3>
          <button
            onClick={() => copyToClipboard(script.caption, 'caption')}
            className="text-sm px-3 py-1 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded transition-colors"
          >
            {copiedField === 'caption' ? '✓ 已複製' : '複製'}
          </button>
        </div>
        <p className="whitespace-pre-wrap text-[#1A1A1A] leading-relaxed">
          {script.caption}
        </p>
      </div>

      {/* CTA Section */}
      <div className="bg-white border border-[#E8E8E4] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#1A1A1A]">
            行動呼籲 (CTA)
          </h3>
          <button
            onClick={() => copyToClipboard(script.cta, 'cta')}
            className="text-sm px-3 py-1 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded transition-colors"
          >
            {copiedField === 'cta' ? '✓ 已複製' : '複製'}
          </button>
        </div>
        <p className="text-[#1A1A1A] leading-relaxed">{script.cta}</p>
      </div>

      {/* Referenced Scripts */}
      {referencedScripts.length > 0 && (
        <div className="bg-white border border-[#E8E8E4] rounded-lg p-6">
          <button
            onClick={() => setShowReferences(!showReferences)}
            className="w-full text-left font-semibold text-[#1A1A1A] flex items-center justify-between"
          >
            <span>
              📊 本次參考了 {referencedScripts.length} 個高績效資料
            </span>
            <span className={`text-xl transition-transform ${showReferences ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {showReferences && (
            <div className="mt-4 space-y-3 border-t border-[#E8E8E4] pt-4">
              {referencedScripts.map((script) => (
                <div
                  key={script.id}
                  className="p-3 bg-[#FAFAF8] rounded border border-[#E8E8E4]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#1A1A1A] text-sm">
                        {script.hook}
                      </p>
                      <p className="text-xs text-[#999999] mt-1">
                        {script.brand} • {script.scriptType} •{' '}
                        {script.viewsCount?.toLocaleString() || '無'} 次瀏覽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save to Database Hint */}
      <div className="bg-[#FAFAF8] border border-[#E8E8E4] rounded-lg p-4">
        <p className="text-sm text-[#666666]">
          💡 想保存這個腳本？請至{' '}
          <a href="/library" className="font-semibold text-[#1A1A1A] hover:underline">
            腳本資料庫
          </a>{' '}
          頁面手動新增。
        </p>
      </div>
    </div>
  )
}
