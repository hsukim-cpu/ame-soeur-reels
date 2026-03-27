'use client'

import { useState } from 'react'
import { GenerateFormData } from '@/lib/types'

interface GenerateFormProps {
  onSubmit: (data: GenerateFormData) => void
  isLoading: boolean
}

const PRODUCT_TYPES = [
  '上衣',
  'T恤',
  '毛衣',
  '針織衫',
  '外套',
  '棒球外套',
  '褲子',
  '寬褲',
  '裙子',
  '配件',
  '包包',
  '鞋款',
  '其他',
]

const SCRIPT_STYLES = [
  {
    value: 'hack',
    label: '⚡ 穿搭Hack型',
    description: '痛點→解法，最高流量公式',
  },
  {
    value: 'pain',
    label: '🥹 痛點共感型',
    description: '先同理生活，再帶出商品',
  },
  {
    value: 'new',
    label: '😎 新品驚喜型',
    description: '嘿嘿！新品登場',
  },
  {
    value: 'knowledge',
    label: '💡 知識教學型',
    description: '你可能不知道的穿搭秘密',
  },
  {
    value: 'fomo',
    label: '🔥 FOMO回購型',
    description: '之前沒搶到…它回來啦！',
  },
]

export default function GenerateForm({ onSubmit, isLoading }: GenerateFormProps) {
  const [formData, setFormData] = useState<GenerateFormData>({
    productName: '',
    productType: '',
    coreSelling: '',
    targetAudience: '',
    scriptStyle: 'hack',
    ctaGoal: '',
    additionalInfo: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          商品名稱 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="例：棉麻條紋襯衫"
          required
          className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
        />
      </div>

      {/* Product Type */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          商品類型 <span className="text-red-500">*</span>
        </label>
        <select
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent bg-white"
        >
          <option value="">選擇商品類型</option>
          {PRODUCT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Core Selling Points */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          核心賣點 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="coreSelling"
          value={formData.coreSelling}
          onChange={handleChange}
          placeholder="例：日系條紋設計、100%棉超透氣、寬鬆版型好修身"
          required
          rows={3}
          className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
        />
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          目標受眾 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          placeholder="例：小隻身型女生、155-165cm、喜歡日系風"
          required
          className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
        />
      </div>

      {/* Script Style */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
          腳本風格 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {SCRIPT_STYLES.map((style) => (
            <label
              key={style.value}
              className={`block p-3 border rounded-lg cursor-pointer transition-all ${
                formData.scriptStyle === style.value
                  ? 'border-[#1A1A1A] bg-[#FAFAF8]'
                  : 'border-[#E8E8E4] hover:border-[#D0D0CC]'
              }`}
            >
              <input
                type="radio"
                name="scriptStyle"
                value={style.value}
                checked={formData.scriptStyle === style.value}
                onChange={handleChange}
                className="mr-3"
              />
              <span className="font-medium text-[#1A1A1A]">{style.label}</span>
              <p className="text-sm text-[#999999] ml-6">
                {style.description}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* CTA Goal */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          CTA 目標 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ctaGoal"
          value={formData.ctaGoal}
          onChange={handleChange}
          placeholder="例：留言關鍵字取連結、私訊我們、限時9折"
          required
          className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
        />
      </div>

      {/* Additional Info */}
      <div>
        <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
          補充說明
        </label>
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="任何額外資訊，例：有優惠活動、搭配建議..."
          rows={2}
          className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          isLoading
            ? 'bg-[#CCCCCC] cursor-not-allowed'
            : 'bg-[#1A1A1A] hover:bg-[#333333] active:scale-95'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>生成中...</span>
          </span>
        ) : (
          '✨ 生成腳本'
        )}
      </button>
    </form>
  )
}
