/**
 * AI Provider 工廠
 *
 * 透過環境變數 AI_PROVIDER 切換：
 *   AI_PROVIDER=gemini     → 使用 Gemini（預設）
 *   AI_PROVIDER=anthropic  → 使用 Claude
 *
 * 未來 fallback 架構（已預留，不啟用）：
 *   若要加 gemini → fail → anthropic，
 *   請在 generateWithFallback() 解除註解，
 *   並將 route.ts 改用 generateWithFallback(prompt) 即可。
 */

import { AIProvider, ProviderName } from './types'
import { GeminiProvider } from './gemini'
import { AnthropicProvider } from './anthropic'

/** 根據環境變數回傳對應的 provider 實例 */
export function getProvider(): AIProvider {
  const providerName = (process.env.AI_PROVIDER ?? 'gemini') as ProviderName

  switch (providerName) {
    case 'anthropic':
      return new AnthropicProvider()
    case 'gemini':
    default:
      return new GeminiProvider()
  }
}

/**
 * [預留] 帶 fallback 的生成函式
 * 未來啟用時：將 route.ts 中 provider.generate(prompt)
 * 改為 generateWithFallback(prompt) 即可
 */
// export async function generateWithFallback(prompt: string): Promise<string> {
//   const primary = getProvider()
//   try {
//     return await primary.generate(prompt)
//   } catch (primaryError) {
//     console.error(`[AI] ${primary.name} 失敗，切換至 anthropic`, primaryError)
//     const fallback = new AnthropicProvider()
//     return await fallback.generate(prompt)
//   }
// }

export { GeminiProvider } from './gemini'
export { AnthropicProvider } from './anthropic'
export type { AIProvider, ProviderName } from './types'
