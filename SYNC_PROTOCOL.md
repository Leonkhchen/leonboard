# Cross-Agent Sync Protocol

This repository is the shared control plane for Leon's software projects.

## Source of Truth

1. `projects.json` — portfolio registry and cross-project priority.
2. Each application repository's `PROJECT_COMPACT.md` — current project state.
3. GitHub Issues / Pull Requests / commits — execution evidence.
4. D1 — dashboard cache, activity log and handoff history only.

D1 must never silently override GitHub project state.

## Agent startup checklist

Every agent working on a tracked project should:

1. Read `AGENTS.md` in this repository.
2. Read `projects.json` and locate the target project.
3. Read the target repository's `PROJECT_COMPACT.md` if present.
4. Inspect open Issues / active PRs before coding.
5. Confirm the current `nextAction` and blockers.

## During work

- Work on a feature branch for non-trivial changes.
- Record meaningful commits and PR numbers.
- Never deploy production unless the project workflow explicitly allows it and Leon has approved.
- Never modify production D1 data as part of ordinary development/testing.

## Completion / handoff checklist

Before handing work to another agent:

1. Run the required tests, lint, typecheck and build.
2. Record preview / validation evidence where applicable.
3. Update the target repository `PROJECT_COMPACT.md`.
4. Update `projects.json` when portfolio-level fields changed: status, priority, primary agent, next action, URLs.
5. Add an activity / handoff record to LeonBoard D1 when the API is available.

## Handoff payload

Use this shape when handing off between agents:

```json
{
  "projectId": "milk-tea-pos",
  "fromAgent": "OpenCode",
  "toAgent": "ChatGPT",
  "summary": "Implemented order cancellation and tests",
  "nextAction": "Review PR and validate preview",
  "blockers": "None"
}
```

## Activity payload

```json
{
  "projectId": "milk-tea-pos",
  "agent": "OpenCode",
  "action": "implementation",
  "detail": "Added order cancellation flow",
  "commitSha": "<sha>",
  "prNumber": 7,
  "result": "tests passed"
}
```

Write API calls require `Authorization: Bearer <SYNC_TOKEN>`.
