import { GenerateFormData, ReelsScript } from './types'

/**
 * Full brand voice for âme soeur embedded directly
 * This contains all guidelines for content generation
 */
export const BRAND_VOICE = `
品牌語氣核心：
- 性別感：中性，常強調「小隻身型」「155-165cm」
- 風格：日系生活感，不是雜誌美，是「今天就這樣出門」的真實感
- 推銷力道：像閨蜜/好友分享，不像廣告——但有明確 CTA
- 情緒基調：活潑、口語、偶爾自嘲，有溫度也有能量
- 溝通方式：先共情生活處境，再帶出商品解決方案

口吻特徵：
- 語尾助詞：欸、啊、啦～～、掰掰、嘿嘿
- 自嘲誇張：「再買我就剁手」「不買不行啊！！」「錯過會想咬手帕！」
- 共情句型：「生活已經夠累了...」「早晚溫差就交給它」
- 驚喜感：「太Q啦～～」「這件藏了小細節」「直接驚呼好舒服！」

Emoji邏輯：
- 😍：推薦/超愛/視覺亮點
- 🥹：感動/可愛到不行/心疼
- 💓💕：溫柔喜愛/分享給你
- 🔥：限時優惠/熱賣提醒
- ✨：細節亮點/特色設計
- 😎：帥氣/有型/自信感
- 😫：「之前沒搶到」的遺憾感（用於回購文）

Caption公式（高流量版）：
[情緒/生活切入句 + emoji]
[商品連結]
[核心賣點 1-2 句]
[身型/穿搭細節 1-2 句]
[CTA：留言「關鍵字」我傳給你 / 限時優惠提醒]

高流量 Reels Hook 模式：
- FOMO回購型（7.8萬）：「你錯過的那件...它回來啦！」
- 情緒共感型（2.5萬）：「生活___就要___」
- 新品驚喜型（10.8萬）：「嘿嘿！新品來嘍😎」
- 身型定位型（3.6萬）：「小隻身型穿起來剛剛好！」
- 穿搭Hack型（競品118萬）：「差一點差很多，超簡單學起來」
- 剁手自嘲型：「再買___我就剁手！這件不買不行！」
- 細節驚喜型（2萬）：「低調藏了___小細節」

CTA常用句型：
- 留言「關鍵字」馬上傳給你👍🏻
- 快＋1，這次不搶真的會沒你的 size🔥
- 你最喜歡哪套？私訊我們傳整套給你😍
- 想知道整套連結快留言給我們吧💓
- 不用猶豫請直接手刀包色吧！！！
- 🔥限時9折優惠，只到這週末喔🔥

應該有 vs 要避免：
✅ 口語自然，有啊/欸/啦～～
✅ 先說生活處境再帶商品
✅ 指定身型（小隻/155cm）讓人對號入座
✅ FOMO但不焦慮（限時9折/只到週末）
✅ 自嘲推坑感（推坑/剁手/不買不行）
✅ 細節設計的驚喜感（藏了小細節）
✅ 邀請互動 CTA
❌ 過於文青/詩意（不符實際風格）
❌ 直接開門見山說「這件很好看」
❌ 模糊描述「男女都適合」
❌ 過度催促（「現在馬上買！！！」）
❌ 堆砌形容詞（完美/超美/絕美）
❌ 沒有 CTA 就結束

受眾輪廓：
- 主要：小隻身型女生（155-165cm 高頻出現）
- 其次：中性穿搭愛好者（男女款、oversized、寬版褲）
- 心理：生活忙碌但想穿得有品味，不想花太多時間搭配
- 痛點：找不到版型對的衣服、之前錯過搶不到、不知道怎麼搭
`

/**
 * Build the full prompt for Claude API
 * Includes brand voice, referenced scripts, user input, and JSON format requirements
 */
export function buildGeneratePrompt(
  formData: GenerateFormData,
  referencedScripts: ReelsScript[]
): string {
  const scriptStyleDescriptions: Record<string, string> = {
    hack: '⚡ 穿搭Hack型 — 痛點→解法，展示實用技巧。最高流量公式。',
    pain: '🥹 痛點共感型 — 先同理生活處境，再帶出商品解決方案。情感共鳴為先。',
    new: '😎 新品驚喜型 — 嘿嘿！新品登場。輕鬆隨興，低門檻。',
    knowledge: '💡 知識教學型 — 你可能不知道的穿搭秘密。驚嚇型開頭增加停留。',
    fomo: '🔥 FOMO回購型 — 之前沒搶到…它回來啦！緊迫感+限量感。',
  }

  const referencedScriptsContext = referencedScripts
    .map(
      (script) =>
        `Hook: "${script.hook}"
Brand: ${script.brand}
Style: ${script.scriptType}
Views: ${script.viewsCount?.toLocaleString() || 'N/A'}
Theme: ${script.theme}`
    )
    .join('\n---\n')

  return `You are an expert Instagram Reels scriptwriter for the fashion brand âme soeur. Your task is to generate a compelling Reels script following the brand voice guidelines below.

=== BRAND VOICE GUIDELINES ===
${BRAND_VOICE}

=== REFERENCED HIGH-PERFORMING SCRIPTS ===
These scripts achieved high engagement. Learn from their structure and emotion:
${referencedScriptsContext || 'No referenced scripts found.'}

=== USER REQUEST ===
商品名稱: ${formData.productName}
商品類型: ${formData.productType}
核心賣點: ${formData.coreSelling}
目標受眾: ${formData.targetAudience}
腳本風格: ${scriptStyleDescriptions[formData.scriptStyle] || formData.scriptStyle}
CTA目標: ${formData.ctaGoal}
補充說明: ${formData.additionalInfo || '無'}

=== OUTPUT FORMAT ===
You MUST output a valid JSON object with this exact structure:
{
  "hook": "A compelling opening line that stops scrolling. Must follow the brand voice, use natural language with particles like 啊/欸/啦, and be engaging.",
  "scenes": [
    {
      "number": 1,
      "visual": "描述這一幕視覺呈現（例：拿起商品，展示細節，close-up 布料等）",
      "subtitle": "螢幕上出現的文字或字幕，協助理解視覺內容",
      "duration": "可選，如 3秒、快速切換 等"
    }
  ],
  "caption": "Instagram caption text. Start with emotional/life situation hook, include 1-2 core selling points, mention sizing/styling details if relevant, and end with a clear CTA. Use the brand voice naturally with emojis strategically placed.",
  "cta": "Clear call-to-action. Should invite engagement (留言/私訊/快＋1) and may include urgency (限時優惠/只到週末) if appropriate. Keep it natural and friendly, not pushy."
}

=== IMPORTANT NOTES ===
1. The hook must be natural, conversational, and immediately relevant to the user's pain point or excitement
2. Scenes should be 3-5 total, each with clear visual and subtitle
3. Caption should be 2-4 sentences, starting with emotion/lifestyle, then product, then details
4. Use body type references (小隻身型、155-165cm) when relevant to the target audience
5. Match the referenced scripts' emotion and structure style, but make it unique for this product
6. Return ONLY valid JSON, no additional text before or after

Generate the script now:`
}
