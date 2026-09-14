# One-Time Activation Checklist

Most of Leon Project Control Center is committed and ready. The following steps require Leon because they involve account authorization/secrets.

## A. Cloudflare provisioning

From a trusted Codespace/local shell in this repository:

```bash
npm install
wrangler login
wrangler d1 create leonboard-db
```

Copy the returned `database_id` into `wrangler.jsonc`.

Then initialize D1:

```bash
npm run db:remote
```

Create a random sync token locally and save it as the Worker secret (never commit it):

```bash
wrangler secret put SYNC_TOKEN
```

Deploy only after reviewing the target account:

```bash
npm run deploy
```

Validate:

```bash
curl https://<worker-url>/api/health
curl https://<worker-url>/api/projects
```

## B. GitHub Actions secrets

In `Leonkhchen/leonboard` → Settings → Secrets and variables → Actions, add:

- `LEONBOARD_API_URL`: the deployed Worker origin, e.g. `https://...workers.dev`
- `LEONBOARD_SYNC_TOKEN`: exactly the same random value used for the Worker `SYNC_TOKEN`
- `LEONBOARD_GITHUB_TOKEN`: a fine-grained GitHub token with read-only Contents and Pull Requests access to the private repositories listed in `projects.json`

Do not grant write/admin permissions to the GitHub sync token.

## C. First synchronization test

Open Actions → `Sync Portfolio to LeonBoard` → Run workflow.

Success criteria:

1. Workflow completes successfully.
2. `/api/projects` returns project rows.
3. `/agent-board.html` loads from D1 rather than fallback JSON.
4. A project detail endpoint shows recent `GitHub Sync` activity.
5. Missing Compact files are reported as activity, not treated as completed work.

## Safety

- GitHub remains source of truth.
- D1 is a synchronized operational view/activity log.
- No workflow in this repository is authorized to merge PRs or deploy other projects.
- Production changes to tracked applications still require Leon approval under each project's own workflow.
