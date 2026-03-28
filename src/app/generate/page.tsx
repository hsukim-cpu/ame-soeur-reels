'use client'

import { useState } from 'react'
import GenerateForm from '@/components/generate/GenerateForm'
import ScriptResult from '@/components/generate/ScriptResult'
import { GenerateFormData, GeneratedScript, GenerateMode, ReelsScript } from '@/lib/types'

export default function GeneratePage() {
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(
    null
  )
  const [referencedScripts, setReferencedScripts] = useState<ReelsScript[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generateMode, setGenerateMode] = useState<GenerateMode | undefined>(undefined)

  const handleSubmit = async (formData: GenerateFormData) => {
    setIsLoading(true)
    setError(null)
    setGeneratedScript(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '生成失敗，請稍後重試')
      }

      const data = await response.json()
      setGeneratedScript(data.script)
      setReferencedScripts(data.referencedScripts || [])
      setGenerateMode(data.mode ?? 'ai')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '發生未知錯誤，請稍後重試'
      setError(message)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">
          ✨ 生成 Reels 腳本
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Form (40%) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E8E8E4] rounded-lg p-6 sticky top-20">
              <GenerateForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Panel - Result (60%) */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 font-semibold mb-1">生成失敗</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <ScriptResult
              script={generatedScript}
              referencedScripts={referencedScripts}
              isLoading={isLoading}
              mode={generateMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
