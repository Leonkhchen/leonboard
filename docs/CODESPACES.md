# LeonBoard Codespaces Guide

LeonBoard supports a cloud development workstation through GitHub Codespaces. A Windows PC does not need to be powered on.

## From iPad

1. Open GitHub in Safari or Chrome and sign in.
2. Open `Leonkhchen/leonboard`.
3. Choose **Code -> Codespaces -> Create codespace**.
4. Wait for the dev container to finish setup.
5. Open a Terminal.
6. Verify the environment:
   - `node --version` (expected Node 22.x)
   - `npm --version`
   - `gh --version`
   - `git --version`
   - `curl --version`
   - `jq --version`
   - `sqlite3 --version`
   - `opencode --version`
   - `npx --no-install wrangler --version`
7. Run `npm run typecheck`.
8. Run `npm run dev`.
9. Open the **Ports** panel and use the private forwarded port `8787` labelled **Cloudflare Worker Dev**.
10. Confirm `/api/health` works from the local Worker preview.
11. Use OpenCode from the Terminal when interactive coding or debugging is needed.
12. Commit and push changes to a feature branch and open a PR.
13. Stop the Codespace when finished to avoid unnecessary compute usage.

## OpenCode

OpenCode is installed during container creation through the official npm package:

```bash
npm install -g opencode-ai
```

Verify with:

```bash
opencode --version
```

If OpenCode Web is needed, start it only inside the Codespace and keep its forwarded port private. For example:

```bash
opencode web --hostname 0.0.0.0
```

Forward the port reported by OpenCode using the Codespaces Ports panel and do not make it public unless there is an explicit reason.

## GitHub authentication

Codespaces normally provides repository-scoped GitHub authentication. Check it with:

```bash
gh auth status
```

The expected workflow is to create a feature branch, commit, push, and open a PR. Do not store a PAT in the repository or in committed environment files. If repository permissions are insufficient, adjust GitHub/Codespaces authorization rather than embedding a token in code.

## Cloudflare development policy

Wrangler is managed by the repository dependency. Do not install a separate global Wrangler version.

Local development:

```bash
npm ci
npm run typecheck
npm run dev
```

Production deployment remains outside the Codespace:

`PR -> GitHub Actions Validate -> approved merge to master -> GitHub Actions -> Cloudflare Production -> smoke test`

Do not put `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `LEONBOARD_SYNC_TOKEN`, GitHub PATs, or other secret values in `devcontainer.json`, committed `.env` files, documentation, issues, or PR descriptions.

## D1 policy

Local D1 development is allowed. Production/remote D1 migration is not automatic and must remain a separately reviewed operation.

## Recommended machine

Start with the minimum requested by `.devcontainer/devcontainer.json`:

- 2 CPUs
- 4 GB RAM

Increase the machine only if actual development proves this insufficient.

## What is intentionally not installed

The LeonBoard container intentionally does not add:

- Docker-in-Docker
- Python
- Playwright / Chromium
- a new lint or formatting framework

These should be added only when a project requirement justifies the extra complexity or storage.
