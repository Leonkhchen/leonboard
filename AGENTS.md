# LeonBoard Multi-Agent Protocol

LeonBoard is the portfolio-level source of truth for Leon's software projects.

## Roles

- **Leon**: product owner; approves scope, validation and production releases.
- **ChatGPT**: portfolio lead / architect / reviewer. Clarifies requirements, plans milestones, reviews architecture and updates portfolio state.
- **OpenCode**: primary implementation agent. Changes repository code, runs tests, creates preview deployments and prepares PRs.
- **Google AI / Antigravity**: secondary reviewer, UI/prototype agent and AI-model experimentation backup.
- **GitHub Actions**: CI/CD and production deployment automation after approval.

## Source of truth

1. `projects.json` is the portfolio registry.
2. Each active application repository should contain `PROJECT_COMPACT.md` for detailed project state.
3. GitHub Issues represent actionable work.
4. Pull Requests represent code changes and validation evidence.
5. Chat history is context, not the authoritative project state.

## Required agent behavior

Before working on a project:

1. Read `projects.json`.
2. Read that repository's `PROJECT_COMPACT.md` when present.
3. Check active Issues / PRs relevant to the task.
4. Do not assume another agent's unfinished work is complete.

After a meaningful milestone:

1. Update the project's `PROJECT_COMPACT.md`.
2. Update the matching entry in `projects.json` if status, priority, owner agent or next action changed.
3. Record test/build/preview evidence in the PR or compact.
4. Leave a clear `nextAction` that another agent can execute without reconstructing chat history.

## Status definitions

- `idea`: captured but not committed.
- `planned`: scope known; not started.
- `active`: implementation in progress.
- `waiting`: blocked on Leon, external service, credentials, data or decision.
- `verification`: implementation complete; awaiting validation.
- `migration`: existing app being assessed or moved to Cloudflare.
- `done`: milestone/release completed.
- `paused`: intentionally stopped.

## Production safety

Agents may prepare preview deployments and migrations, but production-changing actions require explicit Leon approval unless an already-approved automated workflow is executing exactly as configured.

Never store API keys, passwords, tokens or secrets in `projects.json`, compact files, issues, commits or chat handoff notes.

## Project compact minimum fields

Every active project should eventually track:

- Project / repository
- Current status
- Current milestone
- Latest validated commit
- Active branch / PR
- Deployment URLs (non-secret)
- Completed work
- Test evidence
- Known issues / blockers
- Architecture decisions
- Next action
- Recommended next agent
- Last updated timestamp / agent

## Handoff rule

A handoff is successful when a different agent can answer these questions without reading prior chat:

1. What are we building or migrating?
2. What is completed and verified?
3. What is currently in progress?
4. What is blocked?
5. What exact action should happen next?
6. What must not be changed without Leon's approval?
