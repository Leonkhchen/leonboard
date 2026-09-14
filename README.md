# LeonBoard

個人儀表板 + 多 Agent 專案控制台。

原有功能：
- 待辦事項（家庭 / 工作）
- 進度追蹤
- 已部署應用
- 我的最愛
- 內容以密碼加密（AES-GCM，PBKDF2 導出金鑰），開頁需輸入密碼
- 資料存於瀏覽器 localStorage；「☁ 備份」會把**加密後**的 `data.json` commit 回本 repo
- `data.json` 為密文，公開亦無法直接讀取內容

## Multi-Agent Project Control

此 repo 現在同時作為 ChatGPT、OpenCode、Google AI / Antigravity 共用的 portfolio source of truth。

核心檔案：
- `projects.json`：中央專案 registry，記錄狀態、優先級、repo、平台、主要 Agent、review Agent 與 next action
- `AGENTS.md`：所有 Agent 共用的讀寫與交接規則
- `PROJECT_CONTROL.md`：專案管理模型、狀態定義與標準 delivery flow
- `agent-board.html`：讀取 `projects.json` 的唯讀 Kanban / Portfolio Board

## Agent workflow

每個 Agent 開始工作前：

1. 讀取本 repo 的 `projects.json`
2. 讀取 `AGENTS.md`
3. 進入目標 repo 後讀取 `PROJECT_COMPACT.md`（若存在）
4. 檢查相關 Issues / PRs

完成一個有意義的 milestone 後：

1. 更新目標 repo 的 `PROJECT_COMPACT.md`
2. 若 portfolio 狀態 / next action 有變化，更新本 repo 的 `projects.json`
3. 在 PR / compact 留下測試、build、preview 證據
4. 留下一個可由下一個 Agent 直接執行的 `nextAction`

## Board

用 HTTP / GitHub Pages 開啟 `agent-board.html` 即可看到跨專案 Kanban。第一版刻意保持唯讀，所有狀態更新都透過 Git commit，因此有完整歷史、可 review、可 rollback。

後續版本可再加入 Cloudflare Workers + D1 + GitHub API，提供手機可編輯的 Portfolio Dashboard。
