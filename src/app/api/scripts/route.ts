import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { ReelsScript, ScriptCreateInput } from '@/lib/types'

/**
 * GET /api/scripts
 * List all scripts with optional search and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') // Search query
    const scriptType = searchParams.get('scriptType') // Filter by type
    const isRecommended = searchParams.get('isRecommended') // Filter by recommended
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseServer.from('reels_script_library').select('*')

    // Apply filters
    if (scriptType && scriptType !== 'all') {
      query = query.eq('script_type', scriptType)
    }

    if (isRecommended === 'true') {
      query = query.eq('is_recommended', true)
    }

    // Apply search if provided
    if (q) {
      query = query.or(
        `hook.ilike.%${q}%,theme.ilike.%${q}%,brand.ilike.%${q}%`
      )
    }

    // Apply pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    const scripts: ReelsScript[] = (data || []).map((script: any) => ({
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

    return NextResponse.json({
      data: scripts,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error('GET /api/scripts error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch scripts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/scripts
 * Create a new script
 */
export async function POST(request: NextRequest) {
  try {
    const body: ScriptCreateInput = await request.json()

    // Validate required fields
    if (!body.brand || !body.productType || !body.theme || !body.scriptType || !body.hook) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseServer
      .from('reels_script_library')
      .insert({
        brand: body.brand,
        product_type: body.productType,
        theme: body.theme,
        script_type: body.scriptType,
        hook: body.hook,
        structure_breakdown: body.structureBreakdown,
        emotion_design: body.emotionDesign,
        cta: body.cta,
        reusable_points: body.reusablePoints,
        rewritten_version: body.rewrittenVersion,
        suggested_product: body.suggestedProduct,
        performance_rating: body.performanceRating,
        is_recommended: body.isRecommended || false,
        notes: body.notes,
        views_count: body.viewsCount,
      })
      .select()
      .single()

    if (error) {
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

    return NextResponse.json(script, { status: 201 })
  } catch (error) {
    console.error('POST /api/scripts error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create script' },
      { status: 500 }
    )
  }
}
