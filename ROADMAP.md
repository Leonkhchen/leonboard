# Leon Project Control Center Roadmap

## Phase 1 — Shared Git control plane
Status: complete

- Central `projects.json`
- Shared `AGENTS.md`
- Project workflow rules
- Agent Board
- Cross-agent handoff convention

## Phase 2 — Cloudflare operational dashboard
Status: code complete, provisioning pending

- Workers API
- D1 schema
- Activity log
- Handoff log
- Project detail API
- Codespaces / Dev Container
- API write authorization via `SYNC_TOKEN`

User/provisioning gate remaining:
- Create `leonboard-db` in Cloudflare
- Replace D1 `database_id`
- Apply remote schema
- Set Worker `SYNC_TOKEN`
- Deploy and validate production URL

## Phase 3 — GitHub synchronization
Status: implementation complete, credentials/endpoint pending

Implemented:
- Scheduled/manual GitHub Action every 6 hours
- Import `projects.json` entries into LeonBoard API/D1
- Inspect tracked repositories and open PR counts
- Detect `docs/PROJECT_COMPACT.md` or root `PROJECT_COMPACT.md`
- Record sync activity/errors in D1
- Private-repository support through a fine-grained GitHub token
- GitHub remains authoritative; sync does not overwrite GitHub from D1

Activation gate:
- Add GitHub Actions secrets `LEONBOARD_API_URL`, `LEONBOARD_SYNC_TOKEN`, `LEONBOARD_GITHUB_TOKEN`
- Run the workflow manually once and inspect results

## Phase 3A — Durable project compacts
Status: in progress

- Milk Tea POS: complete and detailed (`docs/PROJECT_COMPACT.md`)
- Exam Cleaner: compact added
- LifeFlow migration: compact added
- Web MP3 Player migration: compact added
- Junior Math: pending repository registration
- AI Life Keeper: pending compact
- EPUB TTS Web: pending compact refresh

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
Status: partial foundation complete

- Shared startup/handoff protocol exists
- Scheduled GitHub synchronization exists
- Remaining: reusable OpenCode start/handoff commands
- Remaining: compact schema validator
- Remaining: P0/P1 stale/block alerting
