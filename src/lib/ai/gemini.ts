/**
 * Gemini AI Provider
 * 使用 REST API（不需安裝 SDK），模型：gemini-1.5-flash（免費額度大）
 */

import { AIProvider } from './types'

const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string; thought?: boolean }>
    }
    finishReason?: string
  }>
  error?: {
    code: number
    message: string
    status: string
  }
}

export class GeminiProvider implements AIProvider {
  name = 'gemini'

  async generate(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY 未設定')
    }

    const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`

    let res: Response
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.7,
          },
          thinkingConfig: {
            thinkingBudget: 0,  // 關閉 thinking mode，直接輸出結果
          },
        }),
      })
    } catch (networkError) {
      throw new Error('網路連線失敗，無法連接 Gemini 服務')
    }

    const data: GeminiResponse = await res.json()

    // API 層錯誤處理
    if (!res.ok || data.error) {
      const code = data.error?.code ?? res.status
      const msg = data.error?.message ?? ''

      if (code === 429 || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate')) {
        throw new Error('RATE_LIMIT')
      }
      if (code === 401 || code === 403 || msg.toLowerCase().includes('api key')) {
        throw new Error('INVALID_API_KEY')
      }
      throw new Error(`Gemini API 錯誤 (${code}): ${msg}`)
    }

    // 提取文字（gemini-2.5-flash 有 thinking mode，parts[0] 可能是思考內容，需跳過）
    const parts = data.candidates?.[0]?.content?.parts ?? []
    const textPart = parts.find((p) => !p.thought && p.text) ?? parts[parts.length - 1]
    const text = textPart?.text
    if (!text) {
      throw new Error('Gemini 回傳空結果')
    }

    return text
  }
}
