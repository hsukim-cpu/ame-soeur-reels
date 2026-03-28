/**
 * Anthropic Claude Provider
 * 原本的 Claude 呼叫邏輯，封裝成 AIProvider 介面
 */

import Anthropic from '@anthropic-ai/sdk'
import { AIProvider } from './types'

const ANTHROPIC_MODEL = 'claude-sonnet-4-6-20250805'

export class AnthropicProvider implements AIProvider {
  name = 'anthropic'

  async generate(prompt: string): Promise<string> {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY 未設定')
    }

    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Anthropic 回傳格式錯誤')
    }

    return content.text
  }
}
