const UTF8 = new TextEncoder();
import { notifySlack } from '../../_shared/slack.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env || !env.COMMENTS_DB) {
    return jsonResponse({ error: 'COMMENTS_DB binding is missing' }, 500);
  }

  const url = new URL(request.url);
  const postPath = normalizePostPath(url.searchParams.get('post_path'));
  if (!postPath) {
    return jsonResponse({ error: 'post_path is required' }, 400);
  }

  try {
    const visitorId = readVisitorId(request);
    const query = await env.COMMENTS_DB.prepare(
      `
        SELECT
          c.id,
          c.nickname,
          c.body,
          c.created_at,
          c.updated_at,
          COUNT(cl.visitor_id) AS like_count,
          MAX(CASE WHEN cl.visitor_id = ?2 THEN 1 ELSE 0 END) AS liked
        FROM comments c
        LEFT JOIN comment_likes cl ON cl.comment_id = c.id
        WHERE c.post_path = ?1 AND c.deleted_at IS NULL
        GROUP BY c.id, c.nickname, c.body, c.created_at, c.updated_at
        ORDER BY c.created_at ASC
      `
    )
      .bind(postPath, visitorId)
      .all();

    const items = (query.results || []).map((item) => ({
      ...item,
      liked: Number(item.liked || 0) === 1,
      like_count: Number(item.like_count || 0)
    }));
    return jsonResponse({ items });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Failed to load comments' }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env || !env.COMMENTS_DB) {
    return jsonResponse({ error: 'COMMENTS_DB binding is missing' }, 500);
  }

  let payload = null;

  try {
    payload = await request.json();
  } catch (_error) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const postPath = normalizePostPath(payload.post_path);
  const nickname = trimOrNull(payload.nickname);
  const password = trimOrNull(payload.password);
  const body = trimOrNull(payload.body);

  if (!postPath) return jsonResponse({ error: 'post_path is required' }, 400);
  if (!nickname) return jsonResponse({ error: 'nickname is required' }, 400);
  if (!password || password.length < 4) return jsonResponse({ error: 'password must be at least 4 chars' }, 400);
  if (!body) return jsonResponse({ error: 'body is required' }, 400);
  if (nickname.length > 40) return jsonResponse({ error: 'nickname is too long' }, 400);
  if (body.length > 5000) return jsonResponse({ error: 'body is too long' }, 400);

  try {
    const now = new Date().toISOString();
    const passwordHash = await hashPassword(password);

    await env.COMMENTS_DB.prepare(
      `
        INSERT INTO comments (
          post_path,
          nickname,
          password_hash,
          body,
          created_at,
          updated_at
        )
        VALUES (?1, ?2, ?3, ?4, ?5, ?5)
      `
    )
      .bind(postPath, nickname, passwordHash, body, now)
      .run();

    await notifySlack(env, [
      '[새 댓글]',
      `- 닉네임: ${nickname}`,
      `- 경로: ${new URL(request.url).origin}${postPath}`,
      `- 내용: ${body.slice(0, 300)}`
    ].join('\n'));

    return jsonResponse({ ok: true }, 201);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Failed to create comment' }, 500);
  }
}

function trimOrNull(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

function normalizePostPath(postPath) {
  if (typeof postPath !== 'string') return '';
  const normalized = postPath.trim();
  if (!normalized) return '';
  if (normalized === '/portfolios') return '/';
  if (normalized.indexOf('/portfolios/') === 0) {
    return `/${normalized.slice('/portfolios'.length).replace(/^\/+/, '')}`;
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function readVisitorId(request) {
  const match = request.headers.get('Cookie')?.match(/(?:^|;\s*)blog_visitor_id=([^;]+)/);
  return match && /^[a-f0-9-]{16,80}$/i.test(match[1]) ? match[1] : '';
}

function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let output = '';
  for (const byte of bytes) {
    output += byte.toString(16).padStart(2, '0');
  }
  return output;
}

async function hashPassword(password, providedSalt = null) {
  const salt = providedSalt || crypto.randomUUID();
  const combined = `${salt}:${password || ''}`;
  const digest = await crypto.subtle.digest('SHA-256', UTF8.encode(combined));
  return `${salt}:${toHex(digest)}`;
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
