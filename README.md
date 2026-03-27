# âme soeur Reels 腳本生成系統

由 Claude AI 驅動的 Instagram Reels 腳本生成平台。為 âme soeur 設計，協助快速創作符合品牌語氣、高流量的短影音內容。

## 工具特色

✨ **品牌語氣一致** — 完全遵循 âme soeur 的閨蜜感、日系生活感風格
📚 **高績效參考** — 自動參考已驗證的高流量腳本模式和結構
⚡ **快速迭代** — 秒級生成完整 Reels 腳本（Hook、分場景、CTA）
💾 **可複製使用** — 產出的文案、字幕都是開箱即用的品質
📊 **腳本資料庫** — 管理、查詢、編輯高績效腳本案例

## 系統需求

- Node.js 18+
- npm 或 pnpm
- Supabase 帳號（免費層可用）
- Anthropic Claude API Key

## 第一步：設定 Supabase

### 1.1 建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 建立帳號
2. 建立新專案（選擇靠近你的地區）
3. 複製 **Project URL** 和 **Anon Key**

### 1.2 執行資料庫 Schema

1. 在 Supabase 控制台進入 **SQL Editor**
2. 建立新的 SQL query
3. 複製 `supabase/schema.sql` 的全部內容並執行

### 1.3 執行初始資料 (Seed)

1. 在 SQL Editor 建立新 query
2. 複製 `supabase/seed.sql` 的全部內容並執行
3. 你會看到 8 個高績效的參考腳本被插入資料庫

驗證：進入 **Table Editor**，應該看到 `reels_script_library` 表包含 8 筆資料。

## 第二步：設定環境變數

### 2.1 複製環境範本

```bash
cp .env.example .env.local
```

### 2.2 填入環境變數

編輯 `.env.local`：

```env
# Supabase（從 Supabase 控制台取得）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Claude API（從 Anthropic console 取得）
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**取得 Service Role Key**：
- Supabase 控制台 → Settings → API
- 複製 Service role (secret) 的 key

## 第三步：安裝依賴並啟動

```bash
# 安裝依賴
npm install
# 或使用 pnpm
pnpm install

# 啟動開發伺服器
npm run dev
# 或
pnpm dev
```

應用會在 `http://localhost:3000` 啟動。

## 使用指南

### 生成腳本

1. 前往 **✨ 生成腳本** 頁面
2. 填寫表單：
   - **商品名稱**：例「棉麻條紋襯衫」
   - **商品類型**：選擇類別
   - **核心賣點**：2-3 個最重要的特徵
   - **目標受眾**：誰會買？例「小隻身型女生、155-165cm」
   - **腳本風格**：選擇內容類型
     - ⚡ **Hack型**：痛點解法，教學型內容（最高流量）
     - 🥹 **痛點共感**：先同理生活，再帶商品
     - 😎 **新品驚喜**：嘿嘿！新品來囉
     - 💡 **知識教學**：你可能不知道的穿搭秘密
     - 🔥 **FOMO回購**：之前沒搶到…它回來啦！
   - **CTA 目標**：例「留言關鍵字取連結」
   - **補充說明**：任何額外資訊

3. 點擊 **✨ 生成腳本**，AI 會在 10-30 秒內產出腳本
4. 結果包含：
   - **Hook**：開場白（大字黑底呈現）
   - **分場景展示**：依序的視覺指導和字幕
   - **Caption**：IG 貼文文案（可直接複製）
   - **CTA**：行動呼籲（可直接複製）
   - **參考資料**：本次使用的高績效腳本案例

### 管理腳本資料庫

1. 前往 **📚 資料庫** 頁面
2. **搜尋**：輸入 Hook、主題或品牌名稱
3. **篩選**：
   - 按腳本類型（Hack、痛點共感等）
   - 只看推薦（⭐）的高績效案例
4. **點擊列表**查看詳細資訊
5. **編輯**：修改任何欄位後保存
6. **新增**：點擊「+ 新增腳本」建立新案例
7. **刪除**：在編輯模式點擊「刪除」按鈕

## 品牌語氣指南

系統內嵌完整的品牌語氣規則。生成的腳本會遵循：

### 核心語氣
- 口語自然，用「啊、欸、啦～～」
- 先說生活處境，再帶商品
- 像閨蜜分享，不像廣告
- 偶爾自嘲，有溫度也有能量

### Emoji 邏輯
- 😍 推薦/超愛
- 🥹 感動/可愛
- 💓 溫柔喜愛
- 🔥 限時優惠
- ✨ 細節亮點
- 😎 帥氣有型

### 常用 CTA 句型
- 留言「關鍵字」馬上傳給你👍🏻
- 快＋1，這次不搶真的會沒你的 size🔥
- 想知道整套連結快留言給我們吧💓
- 不用猶豫請直接手刀包色吧！！！

### 應該有 ✅ vs 要避免 ❌
✅ 指定身型（小隻/155cm）讓人對號入座
✅ FOMO 但不焦慮（限時9折/只到週末）
✅ 自嘲推坑感（推坑/剁手/不買不行）
❌ 過於文青/詩意（不符實際風格）
❌ 直接說「這件很好看」
❌ 堆砌形容詞（完美/超美/絕美）

## 技術棧

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (claude-sonnet-4-6)
- **HTTP Client**: @supabase/supabase-js

## API 端點

```
POST   /api/generate           生成 Reels 腳本
GET    /api/scripts            列出所有腳本
POST   /api/scripts            新增腳本
GET    /api/scripts/[id]       取得單個腳本
PUT    /api/scripts/[id]       更新腳本
DELETE /api/scripts/[id]       刪除腳本
```

## 資料夾結構

```
ame-soeur-reels/
├── src/
│   ├── app/
│   │   ├── page.tsx              首頁
│   │   ├── layout.tsx            根佈局
│   │   ├── globals.css           全域樣式
│   │   ├── generate/
│   │   │   └── page.tsx          生成頁面
│   │   ├── library/
│   │   │   └── page.tsx          資料庫頁面
│   │   └── api/
│   │       ├── generate/
│   │       │   └── route.ts      生成 API
│   │       └── scripts/
│   │           ├── route.ts      腳本列表/新增 API
│   │           └── [id]/
│   │               └── route.ts  單個腳本 API
│   ├── components/
│   │   ├── Navbar.tsx            導航欄
│   │   ├── generate/
│   │   │   ├── GenerateForm.tsx  生成表單
│   │   │   └── ScriptResult.tsx  結果顯示
│   │   └── library/
│   │       ├── ScriptTable.tsx   腳本表格
│   │       └── ScriptModal.tsx    編輯模態框
│   └── lib/
│       ├── types.ts              TypeScript 類型
│       ├── prompts.ts            Claude 提示詞
│       └── supabase.ts           Supabase 客戶端
├── supabase/
│   ├── schema.sql                資料庫 Schema
│   └── seed.sql                  初始資料
├── .env.example                  環境變數範本
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.mjs
└── README.md
```

## 日後可擴充的方向

### 短期
- [ ] 多語言支援（英文、簡體中文）
- [ ] 腳本版本歷史和對比
- [ ] 批量生成（一次產出 3 個變體）
- [ ] 腳本下載（PDF、Markdown 格式）

### 中期
- [ ] 與 Instagram Graph API 整合，直接發佈
- [ ] 視覺參考圖片上傳（讓 AI 看到實際商品）
- [ ] 自動績效追蹤（綁定 IG 帳號，追蹤發佈後的數據）
- [ ] 效能分析儀表板（哪類腳本在什麼時段表現最好）
- [ ] 團隊協作功能（評論、核准流程、任務分配）

### 長期
- [ ] 影片剪輯範本自動生成（搭配 FFmpeg）
- [ ] 聲音/音樂推薦（根據 Hook 推薦適合的音樂）
- [ ] A/B 測試引擎（自動產出變體，測試最佳版本）
- [ ] 跨平台適配（TikTok、YouTube Shorts、小紅書）

## 常見問題

**Q: 為什麼生成失敗？**
A: 確認 Anthropic API Key 正確，並且帳戶有足夠額度。

**Q: 能離線使用嗎？**
A: 不能，因為需要連接 Claude API 和 Supabase。

**Q: 資料會被保存嗎？**
A: 只有你手動新增到「資料庫」的腳本會被保存。生成的臨時結果不會自動保存。

**Q: 可以修改品牌語氣嗎？**
A: 可以，編輯 `src/lib/prompts.ts` 中的 `BRAND_VOICE` 常數。

**Q: 支援多品牌嗎？**
A: 支援。資料庫設計已考慮多品牌，你可以為不同品牌建立不同的語氣設定。

## 授權

內部使用工具，保留所有權利。

## 支援

遇到問題？請檢查：
1. `.env.local` 是否正確設定
2. Supabase 連線是否成功（SQL Editor 能否執行）
3. Claude API Key 是否有效
4. 瀏覽器控制台是否有 JavaScript 錯誤

---

祝你創作愉快！每一個腳本都是一個與受眾連結的機會。✨
