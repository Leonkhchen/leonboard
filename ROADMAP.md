# Leon Project Control Center Roadmap

## Phase 1 — Shared Git control plane
Status: complete

- Central `projects.json`
- Shared `AGENTS.md`
- Project workflow rules
- Agent Board
- Cross-agent handoff convention

## Phase 2 — Cloudflare operational dashboard
Status: implementation complete, provisioning pending

- Workers API
- D1 schema
- Activity log
- Handoff log
- Project detail API
- Codespaces / Dev Container
- API write authorization via `SYNC_TOKEN`

Pending:
- Create `leonboard-db` in Cloudflare
- Replace D1 `database_id`
- Apply remote schema
- Set `SYNC_TOKEN`
- Deploy and validate production URL

## Phase 3 — GitHub synchronization
Status: planned

- Import `projects.json` into D1
- Read repo `PROJECT_COMPACT.md`
- Sync open PR / Issue status
- Capture deployment evidence
- Detect stale project state
- Never auto-overwrite GitHub state from D1

## Phase 4 — Portfolio UX
Status: planned

- Today Focus
- Blocked projects
- Waiting for Leon
- Migration pipeline
- Agent activity timeline
- Project detail drawer
- Search and filters

## Phase 5 — Agent automation
Status: planned

- Reusable OpenCode command for start/handoff
- GitHub Action to validate compact schema
- Optional scheduled sync from GitHub to D1
- Alert when P0/P1 project is blocked or stale
