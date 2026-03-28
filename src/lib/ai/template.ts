/**
 * Template Mode Generator
 * 當 AI API 額度不足時，從資料庫腳本 + 固定模板拼裝結果
 * 讓系統在沒有 AI 時仍然可以產出有品質的腳本
 */

import { GenerateFormData, GeneratedScript, ReelsScript, SceneItem } from '../types'

// ── 各風格的 Hook 模板 ──────────────────────────────────────────
const HOOK_TEMPLATES: Record<string, (f: GenerateFormData) => string> = {
  hack: (f) =>
    `穿${f.productType}這件事，你可能一直搞錯了！學起來欸 ✨`,
  pain: (f) =>
    `生活已經夠累了，找${f.productType}版型還要這麼難嗎？😫`,
  new: (f) =>
    `嘿嘿！等很久的${f.productName}終於來啦！😎`,
  knowledge: (f) =>
    `你可能不知道，${f.productType}要這樣選版型才對！💡`,
  fomo: (f) =>
    `上次沒搶到的你注意——${f.productName}它回來了啦 🔥`,
}

// ── 各風格的 Scene 模板 ──────────────────────────────────────────
const SCENE_TEMPLATES: Record<string, (f: GenerateFormData) => SceneItem[]> = {
  hack: (f) => [
    { number: 1, visual: '展示日常常見穿搭困擾，誇張表情', subtitle: '每次穿這樣都覺得怪怪der...', duration: '3秒' },
    { number: 2, visual: `拿出${f.productName}，給鏡頭一個「欸！」的表情`, subtitle: '欸等等！這件有救！', duration: '2秒' },
    { number: 3, visual: '穿上後的細節特寫，展示布料/版型', subtitle: f.coreSelling.split('、')[0] || '細節藏了驚喜', duration: '4秒' },
    { number: 4, visual: '完整造型展示，側身+正面', subtitle: '一秒從普通到有型啦 ✨', duration: '3秒' },
    { number: 5, visual: '比讚/推薦手勢，笑著看鏡頭', subtitle: f.ctaGoal, duration: '2秒' },
  ],
  pain: (f) => [
    { number: 1, visual: '日常煩惱場景，共情表情', subtitle: '找衣服真的好累啊...', duration: '3秒' },
    { number: 2, visual: `展示${f.productName}，眼神一亮`, subtitle: '但這件不一樣！', duration: '2秒' },
    { number: 3, visual: '穿上的輕鬆感，深呼吸的畫面', subtitle: f.coreSelling.split('、')[0] || '穿上就對了', duration: '4秒' },
    { number: 4, visual: '開心走位，完整造型', subtitle: `${f.targetAudience.split('、')[0] || '小隻身型'}的你一定懂 💓`, duration: '3秒' },
    { number: 5, visual: '招手邀請互動', subtitle: f.ctaGoal, duration: '2秒' },
  ],
  new: (f) => [
    { number: 1, visual: '神秘開箱動作，遮住商品', subtitle: '新品登場！嘿嘿 😎', duration: '2秒' },
    { number: 2, visual: `${f.productName}正面完整展示`, subtitle: '等等——是它！', duration: '3秒' },
    { number: 3, visual: '細節特寫：布料/設計/版型', subtitle: f.coreSelling.split('、')[0] || '藏了小細節', duration: '4秒' },
    { number: 4, visual: '穿上後完整造型展示', subtitle: '太Q啦～～ 直接收 💓', duration: '3秒' },
    { number: 5, visual: '手指往下滑的手勢', subtitle: f.ctaGoal, duration: '2秒' },
  ],
  knowledge: (f) => [
    { number: 1, visual: '認真表情對鏡頭，舉一根手指', subtitle: `選${f.productType}有個秘密——`, duration: '2秒' },
    { number: 2, visual: '對比：一般版型 vs 這件', subtitle: '一樣身型，差這樣！', duration: '4秒' },
    { number: 3, visual: `${f.productName}細節教學特寫`, subtitle: f.coreSelling.split('、')[0] || '關鍵在這裡', duration: '4秒' },
    { number: 4, visual: '穿上後造型示範，輕鬆感', subtitle: `${f.targetAudience.split('、')[0] || '適合各種身型'} ✨`, duration: '3秒' },
    { number: 5, visual: '點頭推薦手勢', subtitle: f.ctaGoal, duration: '2秒' },
  ],
  fomo: (f) => [
    { number: 1, visual: '遺憾表情，手攤開', subtitle: '上次沒搶到...😫', duration: '2秒' },
    { number: 2, visual: '突然眼神一亮', subtitle: '等等——它回來了！！', duration: '2秒' },
    { number: 3, visual: `${f.productName}完整展示`, subtitle: f.coreSelling.split('、')[0] || '就是這件', duration: '4秒' },
    { number: 4, visual: '穿上快速走位，限時感', subtitle: '這次不能再錯過啦 🔥', duration: '3秒' },
    { number: 5, visual: '緊迫手勢，認真看鏡頭', subtitle: f.ctaGoal, duration: '2秒' },
  ],
}

// ── Caption 模板 ──────────────────────────────────────────────────
function buildCaption(f: GenerateFormData): string {
  const sellingPoints = f.coreSelling.split('、').slice(0, 2).join('、')
  const audience = f.targetAudience.split('、')[0] || '小隻身型的你'

  const openers: Record<string, string> = {
    hack: `穿搭這件事，${audience}最懂那種「版型不對全身毀」的感受啊 😫`,
    pain: `找到對的衣服，真的可以讓人整天都開心欸 💓`,
    new: `新品到！這次真的不能再錯過了嘿嘿 😎`,
    knowledge: `分享一個選${f.productType}的小知識，學起來真的差很多 💡`,
    fomo: `上次很多人說沒搶到，這次它回來了，這次準備好了嗎 🔥`,
  }

  const opener = openers[f.scriptStyle] || openers.hack

  return `${opener}\n\n這件${f.productName}——${sellingPoints}，特別適合${audience}💓 版型超友好，穿上去直接輕鬆了！\n\n${f.ctaGoal} ✨`
}

// ── 主函式：從模板 + 資料庫拼裝腳本 ──────────────────────────────
export function generateTemplateScript(
  formData: GenerateFormData,
  referenceScripts: ReelsScript[]
): GeneratedScript {
  // 優先用資料庫裡同風格的 hook（如果有的話，品質更好）
  const matchingScript = referenceScripts.find(
    (s) => s.scriptType === formData.scriptStyle && s.hook
  )

  const hookFn = HOOK_TEMPLATES[formData.scriptStyle] ?? HOOK_TEMPLATES.hack
  const sceneFn = SCENE_TEMPLATES[formData.scriptStyle] ?? SCENE_TEMPLATES.hack

  // Hook：資料庫參考腳本存在時，用它的結構改寫；否則用模板
  const hook = matchingScript
    ? adaptHook(matchingScript.hook, formData)
    : hookFn(formData)

  return {
    hook,
    scenes: sceneFn(formData),
    caption: buildCaption(formData),
    cta: formData.ctaGoal,
  }
}

/** 把資料庫 hook 的商品詞換成當前商品 */
function adaptHook(originalHook: string, f: GenerateFormData): string {
  // 簡單替換常見商品類型詞
  const result = originalHook
    .replace(/上衣|T恤|毛衣|針織衫|外套|棒球外套|褲子|寬褲|裙子|配件|包包|鞋款/g, f.productType)
  return result.length > 5 ? result : HOOK_TEMPLATES[f.scriptStyle]?.(f) ?? originalHook
}
