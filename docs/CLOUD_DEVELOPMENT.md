# LeonBoard Cloud-First Development SOP

LeonBoard 後續以雲端開發為預設。GitHub 是 source of truth；Cloudflare Workers + D1 是 runtime；LeonBoard 是 operational project view。

## Agent responsibilities

### ChatGPT
- 需求澄清、架構與驗收標準
- PR / code review
- 判斷是否需要切換 Cloud Codex
- 最終整理測試與部署證據

### ChatGPT Work
- 跨 GitHub / Cloudflare 的瀏覽器操作
- 查看 Actions、Preview、Production 與實際 UI
- 執行瀏覽器驗收
- 彙整部署與同步結果
- 遇到登入、2FA、敏感授權時交還使用者

### Cloud Codex
- repository 多檔案修改
- feature / refactor / migration
- npm install / npm ci
- typecheck、tests、build
- 建 branch、commit、PR
- 修正 CI failure

### Leon
- Production 高影響決策
- 必要的登入 / 2FA
- 建立或輪替敏感 secrets / tokens
- Preview 或 Production 的最終業務驗收

## Standard delivery flow

1. ChatGPT 定義需求、scope、acceptance criteria。
2. 小修改可由 ChatGPT / Work 處理；跨多檔案功能交給 Cloud Codex。
3. 所有程式修改使用 feature branch + PR，不直接修改 `master`。
4. PR 自動執行 `Cloudflare Worker CI/CD / Validate`：
   - `npm ci`
   - `npm run typecheck`
   - 檢查 `public/`
   - 檢查 `wrangler.jsonc` 不含 placeholder
5. ChatGPT review PR；需要 UI 驗證時由 Work 開啟 Preview / 測試環境驗收。
6. Leon 確認重大或可見行為變更後 merge。
7. merge / push 到 `master` 後 GitHub Actions 自動部署 Cloudflare Production。
8. deployment 完成後 workflow 呼叫 `/api/health` 做 smoke test。
9. `Sync Portfolio to LeonBoard` 每 6 小時同步一次，也可手動觸發。
10. milestone 完成後更新 target repo `PROJECT_COMPACT.md` 與必要的 `projects.json` 狀態。

## Required GitHub Actions secrets

既有同步：
- `LEONBOARD_API_URL`
- `LEONBOARD_SYNC_TOKEN`
- `LEONBOARD_GITHUB_TOKEN`（若需讀取其他 private repositories）

Cloudflare Production deployment：
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

`CLOUDFLARE_API_TOKEN` 應限制到 LeonBoard 所在 Cloudflare account，僅給部署 Worker 所需權限。Secret 值不得 commit 到 repository、文件、issue、PR 或聊天內容。

## D1 policy

Production deploy **不自動執行 schema migration**。

原因：程式部署與資料結構變更的風險不同，D1 migration 必須獨立審查與執行。若未來 schema 變更頻率增加，再建立專用 migration workflow，採 manual approval / workflow_dispatch。

## When local Codex is still allowed

地端只作備援，不是預設流程：

- 第一次建立或修復 Cloudflare / GitHub authentication bootstrap
- Cloud Browser 或 Cloud Codex 被網站登入 / 權限限制卡住
- 工作需要只有本機才有的檔案、裝置或私有環境
- 雲端 CI 無法重現的 OS / device-specific 問題

其他一般 LeonBoard 開發應維持：

`ChatGPT -> Work / Cloud Codex -> GitHub PR -> GitHub Actions -> Cloudflare -> LeonBoard sync`

## Safety rules

- 不在程式碼中保存 token / secret。
- 不讓 PR 自動部署 Production。
- Production 只由 `master` 或手動 workflow dispatch 部署。
- 不在 Production deployment 自動執行 D1 schema migration。
- GitHub 維持 source of truth；D1 是 operational view，不取代 repository state。
