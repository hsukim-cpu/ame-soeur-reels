import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { ReelsScript, ScriptCreateInput } from '@/lib/types'

/**
 * GET /api/scripts/[id]
 * Get a single script by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseServer
      .from('reels_script_library')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Script not found' },
          { status: 404 }
        )
      }
      throw error
    }

    const script: ReelsScript = {
      id: data.id,
      createdAt: data.created_at,
      brand: data.brand,
      productType: data.product_type,
      theme: data.theme,
      scriptType: data.script_type,
      hook: data.hook,
      structureBreakdown: data.structure_breakdown,
      emotionDesign: data.emotion_design,
      cta: data.cta,
      reusablePoints: data.reusable_points,
      rewrittenVersion: data.rewritten_version,
      suggestedProduct: data.suggested_product,
      performanceRating: data.performance_rating,
      isRecommended: data.is_recommended,
      notes: data.notes,
      viewsCount: data.views_count,
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('GET /api/scripts/[id] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch script' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/scripts/[id]
 * Update a script
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<ScriptCreateInput> = await request.json()

    const updateData: Record<string, any> = {}

    // Map camelCase to snake_case for Supabase
    if (body.brand !== undefined) updateData.brand = body.brand
    if (body.productType !== undefined) updateData.product_type = body.productType
    if (body.theme !== undefined) updateData.theme = body.theme
    if (body.scriptType !== undefined) updateData.script_type = body.scriptType
    if (body.hook !== undefined) updateData.hook = body.hook
    if (body.structureBreakdown !== undefined)
      updateData.structure_breakdown = body.structureBreakdown
    if (body.emotionDesign !== undefined)
      updateData.emotion_design = body.emotionDesign
    if (body.cta !== undefined) updateData.cta = body.cta
    if (body.reusablePoints !== undefined)
      updateData.reusable_points = body.reusablePoints
    if (body.rewrittenVersion !== undefined)
      updateData.rewritten_version = body.rewrittenVersion
    if (body.suggestedProduct !== undefined)
      updateData.suggested_product = body.suggestedProduct
    if (body.performanceRating !== undefined)
      updateData.performance_rating = body.performanceRating
    if (body.isRecommended !== undefined)
      updateData.is_recommended = body.isRecommended
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.viewsCount !== undefined) updateData.views_count = body.viewsCount

    const { data, error } = await supabaseServer
      .from('reels_script_library')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Script not found' },
          { status: 404 }
        )
      }
      throw error
    }

    const script: ReelsScript = {
      id: data.id,
      createdAt: data.created_at,
      brand: data.brand,
      productType: data.product_type,
      theme: data.theme,
      scriptType: data.script_type,
      hook: data.hook,
      structureBreakdown: data.structure_breakdown,
      emotionDesign: data.emotion_design,
      cta: data.cta,
      reusablePoints: data.reusable_points,
      rewrittenVersion: data.rewritten_version,
      suggestedProduct: data.suggested_product,
      performanceRating: data.performance_rating,
      isRecommended: data.is_recommended,
      notes: data.notes,
      viewsCount: data.views_count,
    }

    return NextResponse.json(script)
  } catch (error) {
    console.error('PUT /api/scripts/[id] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update script' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/scripts/[id]
 * Delete a script
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseServer
      .from('reels_script_library')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/scripts/[id] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete script' },
      { status: 500 }
    )
  }
}
