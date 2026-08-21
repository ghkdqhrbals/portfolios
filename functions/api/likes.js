import { notifySlack } from '../_shared/slack.js';

export async function onRequest(context) {
  const { request, env } = context;
  if (!env || !env.COMMENTS_DB) return json({ error: 'COMMENTS_DB binding is missing' }, 500);
  if (request.method !== 'GET' && request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const url = new URL(request.url);
  const postPath = normalizePath(url.searchParams.get('post_path'));
  if (!postPath) return json({ error: 'post_path is required' }, 400);
  const visitor = getOrCreateVisitor(request);

  try {
    const existing = await env.COMMENTS_DB.prepare(
      'SELECT 1 FROM post_likes WHERE post_path = ?1 AND visitor_id = ?2'
    ).bind(postPath, visitor.id).first();

    if (request.method === 'POST') {
      if (existing) {
        await env.COMMENTS_DB.prepare(
          'DELETE FROM post_likes WHERE post_path = ?1 AND visitor_id = ?2'
        ).bind(postPath, visitor.id).run();
      } else {
        await env.COMMENTS_DB.prepare(
          'INSERT INTO post_likes (post_path, visitor_id, created_at) VALUES (?1, ?2, ?3)'
        ).bind(postPath, visitor.id, new Date().toISOString()).run();
        await notifySlack(env, `[포스팅 좋아요]\n- 경로: ${new URL(request.url).origin}${postPath}`);
      }
    }

    const count = await env.COMMENTS_DB.prepare(
      'SELECT COUNT(*) AS count FROM post_likes WHERE post_path = ?1'
    ).bind(postPath).first();
    return json({ ok: true, liked: request.method === 'POST' ? !existing : Boolean(existing), like_count: Number(count?.count || 0) }, 200, visitor.setCookie);
  } catch (error) {
    return json({ error: error.message || 'Failed to load post likes' }, 500);
  }
}

function normalizePath(value) {
  if (typeof value !== 'string') return '';
  const path = value.trim();
  if (!path) return '';
  if (path === '/portfolios') return '/';
  if (path.startsWith('/portfolios/')) return path.slice('/portfolios'.length);
  return path.startsWith('/') ? path : `/${path}`;
}

function getOrCreateVisitor(request) {
  const match = request.headers.get('Cookie')?.match(/(?:^|;\s*)blog_visitor_id=([^;]+)/);
  if (match && /^[a-f0-9-]{16,80}$/i.test(match[1])) return { id: match[1], setCookie: '' };
  const id = crypto.randomUUID();
  return { id, setCookie: `blog_visitor_id=${id}; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax` };
}

function json(payload, status = 200, cookie = '') {
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(JSON.stringify(payload), { status, headers });
}
