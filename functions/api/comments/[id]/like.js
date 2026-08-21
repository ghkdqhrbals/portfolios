import { notifySlack } from '../../../_shared/slack.js';

export async function onRequest(context) {
  const { request, params, env } = context;
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (!env || !env.COMMENTS_DB) return json({ error: 'COMMENTS_DB binding is missing' }, 500);

  const commentId = Number(params.id);
  if (!Number.isFinite(commentId)) return json({ error: 'Invalid comment id' }, 400);
  const visitor = getOrCreateVisitor(request);

  try {
    const comment = await env.COMMENTS_DB.prepare(
      'SELECT id, nickname, post_path, body FROM comments WHERE id = ?1 AND deleted_at IS NULL'
    ).bind(commentId).first();
    if (!comment) return json({ error: 'Comment not found' }, 404);

    const existing = await env.COMMENTS_DB.prepare(
      'SELECT 1 FROM comment_likes WHERE comment_id = ?1 AND visitor_id = ?2'
    ).bind(commentId, visitor.id).first();

    if (existing) {
      await env.COMMENTS_DB.prepare(
        'DELETE FROM comment_likes WHERE comment_id = ?1 AND visitor_id = ?2'
      ).bind(commentId, visitor.id).run();
    } else {
      await env.COMMENTS_DB.prepare(
        'INSERT INTO comment_likes (comment_id, visitor_id, created_at) VALUES (?1, ?2, ?3)'
      ).bind(commentId, visitor.id, new Date().toISOString()).run();
      await notifySlack(env, [
        '[댓글 좋아요]',
        `- 닉네임: ${comment.nickname || '익명'}`,
        `- 경로: ${new URL(request.url).origin}${comment.post_path || ''}`,
        `- 내용: ${(comment.body || '').replace(/\s+/g, ' ').slice(0, 300)}`
      ].join('\n'));
    }

    const count = await env.COMMENTS_DB.prepare(
      'SELECT COUNT(*) AS count FROM comment_likes WHERE comment_id = ?1'
    ).bind(commentId).first();
    return json({ ok: true, liked: !existing, like_count: Number(count?.count || 0) }, 200, visitor.setCookie);
  } catch (error) {
    return json({ error: error.message || 'Failed to toggle like' }, 500);
  }
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
