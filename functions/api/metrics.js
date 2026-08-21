export async function onRequest(context) {
  const { request, env } = context;
  if (!env?.COMMENTS_DB) return json({ error: 'COMMENTS_DB binding is missing' }, 500);
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const url = new URL(request.url);
  let paths = url.searchParams.getAll('post_paths').flatMap((value) => value.split(','));
  paths = [...new Set(paths.map(normalizePath).filter(Boolean))].slice(0, 50);
  if (!paths.length) return json({ error: 'post_path or post_paths is required' }, 400);

  const marks = paths.map(() => '?').join(',');
  const binds = paths;
  const [likes, comments] = await Promise.all([
    env.COMMENTS_DB.prepare(`SELECT post_path, COUNT(*) AS count FROM post_likes WHERE post_path IN (${marks}) GROUP BY post_path`).bind(...binds).all(),
    env.COMMENTS_DB.prepare(`SELECT post_path, COUNT(*) AS count FROM comments WHERE post_path IN (${marks}) AND deleted_at IS NULL GROUP BY post_path`).bind(...binds).all()
  ]);
  const map = new Map(paths.map((path) => [path, { post_path: path, like_count: 0, comment_count: 0 }]));
  (likes.results || []).forEach((row) => { map.get(row.post_path).like_count = Number(row.count || 0); });
  (comments.results || []).forEach((row) => { map.get(row.post_path).comment_count = Number(row.count || 0); });
  return json({ ok: true, items: [...map.values()] });
}

function normalizePath(value) {
  if (typeof value !== 'string') return '';
  let path = value.trim();
  if (!path) return '';
  if (path === '/portfolios') return '/';
  if (path.startsWith('/portfolios/')) path = path.slice('/portfolios'.length);
  return path.startsWith('/') ? path : `/${path}`;
}

function json(payload, status = 200) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };
  return new Response(JSON.stringify(payload), { status, headers });
}
