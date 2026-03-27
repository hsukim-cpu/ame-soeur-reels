'use client'

import { useState, useEffect } from 'react'
import ScriptTable from '@/components/library/ScriptTable'
import ScriptModal from '@/components/library/ScriptModal'
import { ReelsScript, ScriptCreateInput } from '@/lib/types'

const SCRIPT_TYPES = [
  { value: 'all', label: '全部' },
  { value: 'hack', label: '⚡ Hack' },
  { value: 'pain', label: '🥹 痛點共感' },
  { value: 'new', label: '😎 新品驚喜' },
  { value: 'knowledge', label: '💡 知識教學' },
  { value: 'fomo', label: '🔥 FOMO' },
]

export default function LibraryPage() {
  const [scripts, setScripts] = useState<ReelsScript[]>([])
  const [filteredScripts, setFilteredScripts] = useState<ReelsScript[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showRecommended, setShowRecommended] = useState(false)
  const [selectedScript, setSelectedScript] = useState<ReelsScript | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  // Fetch scripts
  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/scripts')
      if (!response.ok) throw new Error('Failed to fetch scripts')
      const data = await response.json()
      setScripts(data.data || [])
    } catch (error) {
      console.error('Error fetching scripts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters
  useEffect(() => {
    let filtered = scripts

    // Filter by script type
    if (selectedType !== 'all') {
      filtered = filtered.filter((s) => s.scriptType === selectedType)
    }

    // Filter by recommended
    if (showRecommended) {
      filtered = filtered.filter((s) => s.isRecommended)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.hook.toLowerCase().includes(query) ||
          s.theme.toLowerCase().includes(query) ||
          s.brand.toLowerCase().includes(query)
      )
    }

    setFilteredScripts(filtered)
  }, [scripts, selectedType, showRecommended, searchQuery])

  const handleSaveScript = async (data: ScriptCreateInput) => {
    try {
      const url = selectedScript
        ? `/api/scripts/${selectedScript.id}`
        : '/api/scripts'
      const method = selectedScript ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Save failed')

      await fetchScripts()
      setSelectedScript(null)
      setShowNewModal(false)
    } catch (error) {
      console.error('Error saving script:', error)
      throw error
    }
  }

  const handleDeleteScript = async (id: string) => {
    try {
      const response = await fetch(`/api/scripts/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      await fetchScripts()
      setSelectedScript(null)
    } catch (error) {
      console.error('Error deleting script:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">📚 腳本資料庫</h1>
          <button
            onClick={() => {
              setSelectedScript(null)
              setShowNewModal(true)
            }}
            className="px-6 py-2 bg-[#1A1A1A] text-white rounded-lg font-semibold hover:bg-[#333333] transition-all active:scale-95"
          >
            + 新增腳本
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="搜尋 Hook、主題或品牌..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-[#E8E8E4] rounded-lg focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Script Type Chips */}
          <div className="flex flex-wrap gap-2">
            {SCRIPT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type.value
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white border border-[#E8E8E4] text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Recommended Toggle */}
          <button
            onClick={() => setShowRecommended(!showRecommended)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              showRecommended
                ? 'bg-[#FFD700] text-[#1A1A1A]'
                : 'bg-white border border-[#E8E8E4] text-[#1A1A1A] hover:border-[#1A1A1A]'
            }`}
          >
            ⭐ 推薦
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-[#666666]">
          找到 <span className="font-semibold">{filteredScripts.length}</span> 個腳本
        </div>

        {/* Table */}
        <ScriptTable
          scripts={filteredScripts}
          onRowClick={(script) => {
            setSelectedScript(script)
            setShowNewModal(false)
          }}
          isLoading={isLoading}
        />
      </div>

      {/* Modal */}
      {(selectedScript || showNewModal) && (
        <ScriptModal
          script={selectedScript}
          onClose={() => {
            setSelectedScript(null)
            setShowNewModal(false)
          }}
          onSave={handleSaveScript}
          onDelete={handleDeleteScript}
          isNew={showNewModal && !selectedScript}
        />
      )}
    </div>
  )
}
