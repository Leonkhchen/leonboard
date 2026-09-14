# Leon Project Control Center — Deployment

## 1. Create D1

```bash
wrangler d1 create leonboard-db
```

Copy the returned `database_id` into `wrangler.jsonc`.

## 2. Initialize schema

Local:

```bash
npm run db:local
```

Remote:

```bash
npm run db:remote
```

## 3. Configure write token

```bash
wrangler secret put SYNC_TOKEN
```

Use a long random value. Do not commit it to GitHub.

## 4. Local development

```bash
npm install
npm run dev
```

Open `/agent-board.html` for the portfolio view.

## 5. Deploy

```bash
npm run deploy
```

Production deployment should be performed only after Leon approves the change.

## 6. API checks

```bash
curl http://localhost:8787/api/health
curl http://localhost:8787/api/projects
```

Write example:

```bash
curl -X POST http://localhost:8787/api/activity \
  -H "Authorization: Bearer $SYNC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"milk-tea-pos","agent":"OpenCode","action":"test","detail":"All tests passed","result":"success"}'
```

## Design rule

GitHub remains the source of truth. D1 is a synchronized operational view and activity log; if there is a conflict, reconcile D1 from GitHub rather than overwriting GitHub from D1 automatically.
