import { readFile } from 'node:fs/promises';

const apiUrl = process.env.LEONBOARD_API_URL?.replace(/\/$/, '');
const syncToken = process.env.LEONBOARD_SYNC_TOKEN;
const githubToken = process.env.LEONBOARD_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

if (!apiUrl || !syncToken) {
  throw new Error('LEONBOARD_API_URL and LEONBOARD_SYNC_TOKEN are required');
}

const registry = JSON.parse(await readFile(new URL('../projects.json', import.meta.url), 'utf8'));

const ghHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
};

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 500)}`);
  }
  return response;
}

async function post(path, body) {
  await request(`${apiUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${syncToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function githubJson(path) {
  return (await request(`https://api.github.com${path}`, { headers: ghHeaders })).json();
}

async function findCompact(owner, repo, defaultBranch) {
  for (const path of ['docs/PROJECT_COMPACT.md', 'PROJECT_COMPACT.md']) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(defaultBranch)}`;
    const response = await fetch(url, { headers: ghHeaders });
    if (response.ok) {
      const data = await response.json();
      return { path, sha: data.sha, updated: true };
    }
    if (response.status !== 404) {
      throw new Error(`Compact lookup failed for ${owner}/${repo}: ${response.status}`);
    }
  }
  return null;
}

for (const project of registry.projects) {
  const payload = {
    ...project,
    updatedBy: 'GitHub Sync',
    progress: project.progress ?? 0,
  };

  if (!project.repo) {
    await post('/api/projects', payload);
    continue;
  }

  const [owner, repo] = project.repo.split('/');
  try {
    const repoInfo = await githubJson(`/repos/${owner}/${repo}`);
    const pulls = await githubJson(`/repos/${owner}/${repo}/pulls?state=open&per_page=10`);
    const compact = await findCompact(owner, repo, repoInfo.default_branch);

    await post('/api/projects', payload);
    await post('/api/activity', {
      projectId: project.id,
      agent: 'GitHub Sync',
      action: 'repository-sync',
      detail: `default=${repoInfo.default_branch}; openPRs=${pulls.length}; compact=${compact?.path ?? 'missing'}`,
      commitSha: repoInfo.default_branch ? undefined : null,
      result: compact ? 'ok' : 'compact-missing',
    });
  } catch (error) {
    console.error(`[${project.id}]`, error.message);
    await post('/api/activity', {
      projectId: project.id,
      agent: 'GitHub Sync',
      action: 'repository-sync',
      detail: error.message,
      result: 'failed',
    });
    process.exitCode = 1;
  }
}

console.log(`Synced ${registry.projects.length} project registry entries.`);
