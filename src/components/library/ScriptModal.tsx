'use client'

import { useState } from 'react'
import { ReelsScript, ScriptCreateInput } from '@/lib/types'

interface ScriptModalProps {
  script: ReelsScript | null
  onClose: () => void
  onSave?: (data: ScriptCreateInput) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  isNew?: boolean
}

const SCRIPT_TYPES = ['hack', 'pain', 'new', 'knowledge', 'fomo', 'other']
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

export default function ScriptModal({
  script,
  onClose,
  onSave,
  onDelete,
  isNew,
}: ScriptModalProps) {
  const [formData, setFormData] = useState<ScriptCreateInput>(
    script
      ? {
          brand: script.brand,
          productType: script.productType,
          theme: script.theme,
          scriptType: script.scriptType,
          hook: script.hook,
          structureBreakdown: script.structureBreakdown ?? undefined,
          emotionDesign: script.emotionDesign ?? undefined,
          cta: script.cta ?? undefined,
          reusablePoints: script.reusablePoints ?? undefined,
          rewrittenVersion: script.rewrittenVersion ?? undefined,
          suggestedProduct: script.suggestedProduct ?? undefined,
          performanceRating: script.performanceRating ?? undefined,
          isRecommended: script.isRecommended,
          notes: script.notes ?? undefined,
          viewsCount: script.viewsCount ?? undefined,
        }
      : {
          brand: '',
          productType: '',
          theme: '',
          scriptType: 'hack',
          hook: '',
          isRecommended: false,
        }
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!script && !isNew) return null

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const newValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSave) return

    setIsSaving(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '保存失敗，請稍後重試'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete || !script) return
    if (!confirm('確定要刪除這個腳本嗎？此操作無法復原。')) return

    setIsSaving(true)
    setError(null)

    try {
      await onDelete(script.id)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '刪除失敗，請稍後重試'
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E8E8E4] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            {isNew ? '新增腳本' : '編輯腳本'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#1A1A1A] text-2xl w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Brand */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              品牌 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
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

          {/* Theme */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              主題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
            />
          </div>

          {/* Script Type */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              腳本類型 <span className="text-red-500">*</span>
            </label>
            <select
              name="scriptType"
              value={formData.scriptType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent bg-white"
            >
              {SCRIPT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Hook */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Hook (開場白) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="hook"
              value={formData.hook}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* Structure Breakdown */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              結構分解
            </label>
            <textarea
              name="structureBreakdown"
              value={formData.structureBreakdown || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* Emotion Design */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              情感設計
            </label>
            <textarea
              name="emotionDesign"
              value={formData.emotionDesign || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* CTA */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              CTA (行動呼籲)
            </label>
            <textarea
              name="cta"
              value={formData.cta || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* Reusable Points */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              可複用要點
            </label>
            <textarea
              name="reusablePoints"
              value={formData.reusablePoints || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* Rewritten Version */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              改寫版本
            </label>
            <textarea
              name="rewrittenVersion"
              value={formData.rewrittenVersion || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* Suggested Product */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              建議商品
            </label>
            <input
              type="text"
              name="suggestedProduct"
              value={formData.suggestedProduct || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
            />
          </div>

          {/* Performance Rating */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              績效評分 (1-5)
            </label>
            <input
              type="number"
              name="performanceRating"
              value={formData.performanceRating || ''}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
            />
          </div>

          {/* Views Count */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              瀏覽次數
            </label>
            <input
              type="number"
              name="viewsCount"
              value={formData.viewsCount || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
            />
          </div>

          {/* Is Recommended */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isRecommended"
              checked={formData.isRecommended || false}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#E8E8E4]"
            />
            <label className="ml-2 text-sm font-semibold text-[#1A1A1A]">
              推薦為高績效案例
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              備註
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-all ${
                isSaving
                  ? 'bg-[#CCCCCC] cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-[#333333]'
              }`}
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            {script && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isSaving
                    ? 'bg-[#EFEFEF] text-[#CCCCCC] cursor-not-allowed'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                刪除
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg font-semibold text-[#1A1A1A] border border-[#E8E8E4] hover:bg-[#FAFAF8] transition-all"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
