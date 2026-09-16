# LeonBoard Project Compact

## Project
- Repository: `Leonkhchen/leonboard`
- Purpose: personal portfolio dashboard and multi-agent project control center
- Runtime: Cloudflare Workers + D1
- Source of truth: GitHub

## Current status
- Status: verification
- Current milestone: Cloud-first development workstation via GitHub Codespaces
- Active branch: `feat/codespaces-devcontainer`
- Production branch: `master`

## Recently completed
- Cloudflare Worker CI/CD is active on `master`.
- Production deployment uses GitHub Actions with Cloudflare credentials stored as GitHub Actions secrets.
- Production deploy performs a post-deploy `/api/health` smoke test.
- Portfolio sync workflow is active.
- Codespaces dev-container configuration is being standardized for iPad-first manual development and debugging.

## Codespaces decisions
- Node.js 22 Bookworm dev-container image.
- 2 CPU / 4 GB RAM minimum starting point.
- GitHub CLI available through a Dev Container feature.
- OpenCode installed with the official `opencode-ai` npm package.
- Wrangler uses the repository dependency; no global Wrangler install.
- Port `8787` is forwarded privately for Cloudflare Worker local preview.
- No Docker-in-Docker, Python, Playwright, Chromium, or new lint/format stack unless later required.

## Safety decisions
- Do not commit secrets or PATs.
- Production deployment remains GitHub Actions only.
- Codespaces are for manual development/debug and do not replace CI/CD.
- Do not automatically run remote D1 schema migration as part of deployment.
- Local D1 development is allowed.

## Existing validation evidence
- `npm ci`: PASS in prior cloud implementation run.
- `npm run typecheck`: PASS in prior cloud implementation run.
- `npx --no-install wrangler --version`: PASS (`4.132.0`) in prior cloud implementation run.
- `npm run dev`: PASS in prior cloud implementation run.
- Local `/api/health`: HTTP 200 in prior cloud implementation run.
- Final Codespaces-specific validation is still required because the earlier Cloud Codex runner could not publish its branch or reproduce Codespaces authentication/runtime exactly.

## Remaining verification
Create a real Codespace from this feature branch and confirm:
- Node reports 22.x.
- `gh auth status` works with repository permissions.
- `opencode --version` works after container creation.
- `npm run typecheck` passes.
- `npm run dev` starts the Worker.
- Codespaces forwards port `8787` as private and Browser Preview works.
- A feature branch can be pushed and a PR can be created without embedding a PAT.

## Next action
After PR review, create a Codespace from `feat/codespaces-devcontainer` using an iPad/browser, run the short acceptance checklist in `docs/CODESPACES.md`, and record PASS/FAIL in the PR before merge.

## Recommended next agent
- ChatGPT: PR review and acceptance checklist coordination.
- ChatGPT Work: browser verification if available.
- Cloud Codex: only if repository changes are required after validation.
- Leon: first iPad Codespaces acceptance and any GitHub authorization prompt.

## Last updated
- 2026-09-16
- Updated during Codespaces dev-container handoff recovery.
