import { createClient } from '@supabase/supabase-js'

// Browser client - used for client-side requests
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Server client - used for server-side requests with service role key
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

/**
 * Type-safe wrapper for Supabase queries
 */
export async function querySupabase<T>(
  table: string,
  query?: {
    filter?: Record<string, any>
    order?: [string, boolean]
    limit?: number
    offset?: number
  }
) {
  let q = supabase.from(table).select('*')

  if (query?.filter) {
    Object.entries(query.filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        q = q.in(key, value)
      } else {
        q = q.eq(key, value)
      }
    })
  }

  if (query?.order) {
    const [column, ascending] = query.order
    q = q.order(column, { ascending })
  }

  if (query?.limit) {
    q = q.limit(query.limit)
  }

  if (query?.offset) {
    q = q.range(query.offset, query.offset + (query.limit || 10) - 1)
  }

  return q as unknown as Promise<{ data: T[]; error: any }>
}
