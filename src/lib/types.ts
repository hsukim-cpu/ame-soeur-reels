/**
 * Core TypeScript types for the âme soeur Reels script generation system
 */

export interface ReelsScript {
  id: string
  createdAt: string
  brand: string
  productType: string
  theme: string
  scriptType: 'hack' | 'pain' | 'new' | 'knowledge' | 'fomo' | 'other'
  hook: string
  structureBreakdown: string | null
  emotionDesign: string | null
  cta: string | null
  reusablePoints: string | null
  rewrittenVersion: string | null
  suggestedProduct: string | null
  performanceRating: number | null
  isRecommended: boolean
  notes: string | null
  viewsCount: number | null
}

export interface GenerateFormData {
  productName: string
  productType: string
  coreSelling: string
  targetAudience: string
  scriptStyle: 'hack' | 'pain' | 'new' | 'knowledge' | 'fomo'
  ctaGoal: string
  additionalInfo: string
}

export interface SceneItem {
  number: number
  visual: string
  subtitle: string
  duration?: string | null
}

export interface GeneratedScript {
  hook: string
  scenes: SceneItem[]
  caption: string
  cta: string
}

export interface GenerateResponse {
  script: GeneratedScript
  referencedScripts: ReelsScript[]
}

export interface ScriptCreateInput {
  brand: string
  productType: string
  theme: string
  scriptType: 'hack' | 'pain' | 'new' | 'knowledge' | 'fomo' | 'other'
  hook: string
  structureBreakdown?: string | null
  emotionDesign?: string | null
  cta?: string | null
  reusablePoints?: string | null
  rewrittenVersion?: string | null
  suggestedProduct?: string | null
  performanceRating?: number | null
  isRecommended?: boolean
  notes?: string | null
  viewsCount?: number | null
}
