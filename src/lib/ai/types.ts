/**
 * AI Provider 共用介面
 */

export interface AIProvider {
  /** provider 名稱，用於 log / 錯誤訊息顯示 */
  name: string
  /** 送入 prompt，回傳文字結果 */
  generate(prompt: string): Promise<string>
}

export type ProviderName = 'gemini' | 'anthropic'
