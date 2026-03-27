import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { buildGeneratePrompt } from '@/lib/prompts'
import { GenerateFormData, GeneratedScript, ReelsScript } from '@/lib/types'

/**
 * POST /api/generate
 * Generate a Reels script using Claude AI
 */
export async function POST(request: NextRequest) {
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
      // First, try to find scripts with matching script type
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

      // If we don't have enough matches, get top recommended scripts
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
      // Continue even if database query fails
    }

    // Build the prompt
    const prompt = buildGeneratePrompt(formData, referencedScripts)

    // Call Claude API
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6-20250805',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract the text content
    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: '無效的 API 回應' },
        { status: 500 }
      )
    }

    // Parse the JSON response from Claude
    let generatedScript: GeneratedScript
    try {
      // Extract JSON from the response (Claude might include extra text)
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
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
      console.error('JSON parse error:', parseError)
      console.error('Raw response:', content.text)
      return NextResponse.json(
        { error: '無法解析生成結果，請稍後重試' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        script: generatedScript,
        referencedScripts: referencedScripts,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '生成失敗' },
      { status: 500 }
    )
  }
}
