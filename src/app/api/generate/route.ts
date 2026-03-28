import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { buildGeneratePrompt } from '@/lib/prompts'
import { GenerateFormData, GeneratedScript, ReelsScript } from '@/lib/types'
import { getProvider } from '@/lib/ai'
import { generateTemplateScript } from '@/lib/ai/template'

/** 將各種 AI 錯誤轉為對使用者友善的中文訊息 */
function toUserMessage(error: unknown, providerName: string): string {
  const msg = error instanceof Error ? error.message : ''

  if (msg === 'RATE_LIMIT' || msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('quota') || msg.includes('429')) {
    return `目前 AI 服務暫時忙碌，請稍後再試（${providerName}）`
  }
  if (msg === 'INVALID_API_KEY' || msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('authentication')) {
    return 'AI 服務設定錯誤，請聯絡管理員'
  }
  if (msg.toLowerCase().includes('網路') || msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
    return '生成服務暫時不可用，請稍後再試'
  }
  if (msg.toLowerCase().includes('credit') || msg.toLowerCase().includes('balance')) {
    return 'AI 服務額度不足，請聯絡管理員'
  }
  return '生成服務暫時不可用，請稍後再試'
}

/**
 * POST /api/generate
 * Generate a Reels script using the configured AI provider (default: Gemini)
 */
export async function POST(request: NextRequest) {
  const provider = getProvider()

  try {
    const formData: GenerateFormData = await request.json()

    // Validate required fields
    if (
      !formData.productName ||
      !formData.productType ||
      !formData.coreSelling ||
      !formData.targetAudience ||
      !formData.scriptStyle ||
      !formData.ctaGoal
    ) {
      return NextResponse.json(
        { error: '請填寫所有必填欄位' },
        { status: 400 }
      )
    }

    // Query for relevant scripts from the database
    let referencedScripts: ReelsScript[] = []
    try {
      const { data: typeMatches, error: typeError } = await supabase
        .from('reels_script_library')
        .select('*')
        .eq('script_type', formData.scriptStyle)
        .eq('is_recommended', true)
        .limit(5)

      if (!typeError && typeMatches && typeMatches.length > 0) {
        referencedScripts = typeMatches.map((script: any) => ({
          id: script.id,
          createdAt: script.created_at,
          brand: script.brand,
          productType: script.product_type,
          theme: script.theme,
          scriptType: script.script_type,
          hook: script.hook,
          structureBreakdown: script.structure_breakdown,
          emotionDesign: script.emotion_design,
          cta: script.cta,
          reusablePoints: script.reusable_points,
          rewrittenVersion: script.rewritten_version,
          suggestedProduct: script.suggested_product,
          performanceRating: script.performance_rating,
          isRecommended: script.is_recommended,
          notes: script.notes,
          viewsCount: script.views_count,
        }))
      }

      if (referencedScripts.length < 3) {
        const { data: recommendedScripts, error: recError } = await supabase
          .from('reels_script_library')
          .select('*')
          .eq('is_recommended', true)
          .order('views_count', { ascending: false })
          .limit(5 - referencedScripts.length)

        if (!recError && recommendedScripts) {
          const newScripts = recommendedScripts.map((script: any) => ({
            id: script.id,
            createdAt: script.created_at,
            brand: script.brand,
            productType: script.product_type,
            theme: script.theme,
            scriptType: script.script_type,
            hook: script.hook,
            structureBreakdown: script.structure_breakdown,
            emotionDesign: script.emotion_design,
            cta: script.cta,
            reusablePoints: script.reusable_points,
            rewrittenVersion: script.rewritten_version,
            suggestedProduct: script.suggested_product,
            performanceRating: script.performance_rating,
            isRecommended: script.is_recommended,
            notes: script.notes,
            viewsCount: script.views_count,
          }))
          referencedScripts = [...referencedScripts, ...newScripts].slice(0, 5)
        }
      }
    } catch (dbError) {
      console.error('Database query error:', dbError)
      // DB 查詢失敗不影響生成，繼續執行
    }

    // Build the prompt
    const prompt = buildGeneratePrompt(formData, referencedScripts)

    // Call AI provider (Gemini / Anthropic，由 AI_PROVIDER 環境變數決定)
    let rawText: string
    let usedMode: 'ai' | 'template' = 'ai'
    try {
      rawText = await provider.generate(prompt)
    } catch (aiError) {
      console.error(`[AI] ${provider.name} generate error:`, aiError)

      // ── Fallback：AI 失敗時改用模板模式 ──────────────────────────
      console.log('[Fallback] Switching to template mode')
      const templateScript = generateTemplateScript(formData, referencedScripts)
      return NextResponse.json(
        {
          script: templateScript,
          referencedScripts,
          provider: 'template',
          mode: 'template',
        },
        { status: 200 }
      )
    }

    // Parse JSON from the AI response
    let generatedScript: GeneratedScript
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')

      const parsed = JSON.parse(jsonMatch[0])
      generatedScript = {
        hook: parsed.hook || '',
        scenes: (parsed.scenes || []).map((scene: any, idx: number) => ({
          number: scene.number || idx + 1,
          visual: scene.visual || '',
          subtitle: scene.subtitle || '',
          duration: scene.duration,
        })),
        caption: parsed.caption || '',
        cta: parsed.cta || '',
      }
    } catch (parseError) {
      console.error('[AI] JSON parse error:', parseError)
      console.error('[AI] Raw response:', rawText)
      return NextResponse.json(
        { error: '無法解析生成結果，請稍後重試', provider: provider.name },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        script: generatedScript,
        referencedScripts,
        provider: provider.name,
        mode: usedMode,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Generate route error:', error)
    return NextResponse.json(
      { error: toUserMessage(error, provider.name), provider: provider.name },
      { status: 500 }
    )
  }
}
