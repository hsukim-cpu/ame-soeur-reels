'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-[#1A1A1A] mb-6">
          âme soeur Reels 腳本生成器
        </h1>

        <p className="text-xl text-[#666666] mb-12 leading-relaxed">
          由 Claude AI 驅動的 Instagram Reels 腳本生成系統。
          <br />
          為每件商品創造有靈魂的內容，把閨蜜感轉換成轉化率。
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Generate Script Card */}
          <Link
            href="/generate"
            className="group bg-white border border-[#E8E8E4] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">✨</div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              生成新腳本
            </h2>
            <p className="text-[#666666] mb-6">
              輸入商品資訊，AI 幫你創造高流量的 Reels 腳本
            </p>
            <div className="inline-block px-6 py-2 bg-[#1A1A1A] text-white rounded-lg group-hover:bg-[#333333] transition-colors">
              開始生成 →
            </div>
          </Link>

          {/* Script Library Card */}
          <Link
            href="/library"
            className="group bg-white border border-[#E8E8E4] rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              腳本資料庫
            </h2>
            <p className="text-[#666666] mb-6">
              查看高績效腳本案例，尋找靈感和參考模式
            </p>
            <div className="inline-block px-6 py-2 bg-[#1A1A1A] text-white rounded-lg group-hover:bg-[#333333] transition-colors">
              瀏覽資料庫 →
            </div>
          </Link>
        </div>

        <div className="bg-white border border-[#E8E8E4] rounded-2xl p-8 text-left">
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">工具特色</h3>
          <ul className="space-y-3 text-[#666666]">
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>
                品牌語氣一致：完全遵循 âme soeur 的閨蜜感、日系生活感風格
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>
                高績效參考：自動參考已經驗證的高流量腳本模式和結構
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>
                快速迭代：秒級生成完整 Reels 腳本，包含 Hook、分場景、CTA
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>
                可複製：產出文案、字幕都是開箱即用的品質
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
