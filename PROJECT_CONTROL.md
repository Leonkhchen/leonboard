# Leon Project Control

## Purpose

This repository is the central portfolio control plane for all new applications, existing applications and migration projects.

## Portfolio workflow

`Idea -> Planned -> Active -> Verification -> Done`

Existing applications moving platforms use:

`Migration Assessment -> Migration -> Verification -> Done`

Blocked work uses `Waiting`; intentionally suspended work uses `Paused`.

## Standard delivery flow

1. ChatGPT defines scope, architecture and acceptance criteria.
2. `projects.json` and/or GitHub Issue captures the work.
3. OpenCode implements in the target repository.
4. OpenCode runs lint/test/build and creates preview evidence.
5. ChatGPT or Google AI reviews when useful.
6. Leon validates the preview.
7. PR is merged after approval.
8. CI/CD deploys production.
9. Agent updates `PROJECT_COMPACT.md` and `projects.json`.

## Portfolio fields

Each project entry tracks:

- `id`: stable machine-readable identifier
- `name`: display name
- `type`: new-development / existing-development / migration
- `status`: portfolio status
- `priority`: P0-P3
- `repo`: GitHub owner/repository, or null before creation
- `platform`: current/target runtime
- `primaryAgent`: default implementation owner
- `reviewAgent`: default reviewer / backup
- `nextAction`: one executable next step
- `notes`: concise durable context

## Priority

- **P0**: current critical project; should receive attention first.
- **P1**: active/next major project.
- **P2**: planned or migration backlog.
- **P3**: idea/incubator.

## Agent synchronization contract

All agents must prefer repository state over remembered conversation state. At the beginning of work, read the central registry and the target project's compact. At the end of meaningful work, update durable state before handing off.

Do not use the board as a secret store. Links, public deployment URLs and non-secret IDs are acceptable; tokens, passwords, API keys and private credentials are not.

## Recommended per-project file

Create `PROJECT_COMPACT.md` in each active repository using this shape:

```md
# Project Compact

- Status:
- Priority:
- Current milestone:
- Latest validated commit:
- Active branch / PR:
- Preview URL:
- Production URL:
- Last updated:
- Updated by:

## Completed

## Test evidence

## Known issues / blockers

## Architecture decisions

## Next action

## Recommended next agent
```

## Board implementation

`agent-board.html` reads `projects.json` and renders the portfolio as a browser-based Kanban board. This first version is intentionally read-only: agents update the Git-tracked registry so every change is auditable and reversible. A later phase can add authenticated editing through a Cloudflare Worker + D1/GitHub API.
