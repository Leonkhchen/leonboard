export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  SYNC_TOKEN?: string;
}

const json = (data: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers || {}),
    },
  });

const unauthorized = () => json({ error: 'unauthorized' }, { status: 401 });

function isWriteAuthorized(request: Request, env: Env) {
  if (!env.SYNC_TOKEN) return false;
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${env.SYNC_TOKEN}`;
}

async function listProjects(env: Env) {
  const result = await env.DB.prepare(`
    SELECT id, name, repo, type, status, priority, primary_agent AS primaryAgent,
           next_action AS nextAction, progress, preview_url AS previewUrl,
           production_url AS productionUrl, updated_at AS updatedAt,
           updated_by AS updatedBy
    FROM projects
    ORDER BY
      CASE priority WHEN 'P0' THEN 0 WHEN 'P1' THEN 1 WHEN 'P2' THEN 2 ELSE 3 END,
      updated_at DESC
  `).all();
  return result.results;
}

async function projectDetail(env: Env, id: string) {
  const project = await env.DB.prepare(`
    SELECT id, name, repo, type, status, priority, primary_agent AS primaryAgent,
           next_action AS nextAction, progress, preview_url AS previewUrl,
           production_url AS productionUrl, updated_at AS updatedAt,
           updated_by AS updatedBy
    FROM projects WHERE id = ?
  `).bind(id).first();

  if (!project) return null;

  const [activity, handoffs, milestones] = await Promise.all([
    env.DB.prepare(`SELECT * FROM agent_activity WHERE project_id = ? ORDER BY created_at DESC LIMIT 50`).bind(id).all(),
    env.DB.prepare(`SELECT * FROM handoffs WHERE project_id = ? ORDER BY created_at DESC LIMIT 20`).bind(id).all(),
    env.DB.prepare(`SELECT * FROM milestones WHERE project_id = ? ORDER BY sort_order, id`).bind(id).all(),
  ]);

  return {
    project,
    activity: activity.results,
    handoffs: handoffs.results,
    milestones: milestones.results,
  };
}

async function upsertProject(request: Request, env: Env) {
  if (!isWriteAuthorized(request, env)) return unauthorized();
  const body = await request.json<Record<string, unknown>>();
  const required = ['id', 'name'];
  for (const key of required) {
    if (!body[key]) return json({ error: `missing ${key}` }, { status: 400 });
  }

  const progress = Math.max(0, Math.min(100, Number(body.progress ?? 0)));
  await env.DB.prepare(`
    INSERT INTO projects (
      id, name, repo, type, status, priority, primary_agent, next_action,
      progress, preview_url, production_url, updated_at, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      repo=excluded.repo,
      type=excluded.type,
      status=excluded.status,
      priority=excluded.priority,
      primary_agent=excluded.primary_agent,
      next_action=excluded.next_action,
      progress=excluded.progress,
      preview_url=excluded.preview_url,
      production_url=excluded.production_url,
      updated_at=CURRENT_TIMESTAMP,
      updated_by=excluded.updated_by
  `).bind(
    body.id,
    body.name,
    body.repo ?? null,
    body.type ?? 'development',
    body.status ?? 'planned',
    body.priority ?? 'P2',
    body.primaryAgent ?? body.primary_agent ?? null,
    body.nextAction ?? body.next_action ?? null,
    progress,
    body.previewUrl ?? body.preview_url ?? null,
    body.productionUrl ?? body.production_url ?? null,
    body.updatedBy ?? body.updated_by ?? 'agent'
  ).run();

  return json({ ok: true, id: body.id });
}

async function addActivity(request: Request, env: Env) {
  if (!isWriteAuthorized(request, env)) return unauthorized();
  const body = await request.json<Record<string, unknown>>();
  if (!body.projectId || !body.agent || !body.action) {
    return json({ error: 'projectId, agent and action are required' }, { status: 400 });
  }

  const result = await env.DB.prepare(`
    INSERT INTO agent_activity (
      project_id, agent, action, detail, commit_sha, pr_number, result
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    body.projectId,
    body.agent,
    body.action,
    body.detail ?? null,
    body.commitSha ?? null,
    body.prNumber ?? null,
    body.result ?? null
  ).run();

  return json({ ok: true, id: result.meta.last_row_id });
}

async function addHandoff(request: Request, env: Env) {
  if (!isWriteAuthorized(request, env)) return unauthorized();
  const body = await request.json<Record<string, unknown>>();
  if (!body.projectId || !body.summary || !body.nextAction) {
    return json({ error: 'projectId, summary and nextAction are required' }, { status: 400 });
  }

  const result = await env.DB.prepare(`
    INSERT INTO handoffs (
      project_id, from_agent, to_agent, summary, next_action, blockers
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    body.projectId,
    body.fromAgent ?? null,
    body.toAgent ?? null,
    body.summary,
    body.nextAction,
    body.blockers ?? null
  ).run();

  return json({ ok: true, id: result.meta.last_row_id });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, service: 'leon-project-control-center' });
    }

    if (url.pathname === '/api/projects' && request.method === 'GET') {
      return json(await listProjects(env));
    }

    if (url.pathname === '/api/projects' && request.method === 'POST') {
      return upsertProject(request, env);
    }

    const projectMatch = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
    if (projectMatch && request.method === 'GET') {
      const detail = await projectDetail(env, decodeURIComponent(projectMatch[1]));
      return detail ? json(detail) : json({ error: 'not found' }, { status: 404 });
    }

    if (url.pathname === '/api/activity' && request.method === 'POST') {
      return addActivity(request, env);
    }

    if (url.pathname === '/api/handoffs' && request.method === 'POST') {
      return addHandoff(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
