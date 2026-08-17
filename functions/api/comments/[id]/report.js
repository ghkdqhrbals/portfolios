export async function onRequestPost(context) {
  const { request, params, env } = context;
  if (!env || !env.COMMENTS_DB) {
    return jsonResponse({ error: 'COMMENTS_DB binding is missing' }, 500);
  }

  const commentId = Number(params.id);
  if (!Number.isFinite(commentId)) {
    return jsonResponse({ error: 'Invalid comment id' }, 400);
  }

  let payload = null;
  try {
    payload = await request.json();
  } catch (_error) {
    payload = {};
  }

  const reason = typeof payload.reason === 'string' ? payload.reason.trim() : '';
  if (reason.length > 300) {
    return jsonResponse({ error: 'reason is too long' }, 400);
  }
  const clientIp = getClientIp(request);
  const reporterIpHash = await hashIp(clientIp);

  try {
    const requestOrigin = new URL(request.url).origin;
    const comment = await env.COMMENTS_DB.prepare(
      `
        SELECT id, nickname, post_path, body
        FROM comments
        WHERE id = ?1 AND deleted_at IS NULL
      `
    )
      .bind(commentId)
      .first();

    if (!comment) {
      return jsonResponse({ error: 'Comment not found' }, 404);
    }

    const now = new Date().toISOString();
    await env.COMMENTS_DB.prepare(
      `
        INSERT INTO comment_reports (comment_id, reason, reported_at, reporter_ip_hash)
        VALUES (?1, ?2, ?3, ?4)
      `
    )
      .bind(comment.id, reason || '신고 이유 없음', now, reporterIpHash)
      .run();

    const delivery = await notifySlack(env, {
      reason: reason || '신고 이유 없음',
      comment: {
        id: comment.id,
        nickname: comment.nickname,
        postPath: requestOrigin + (comment.post_path || ''),
        body: comment.body || ''
      }
    });

    return jsonResponse({ ok: true, slack_sent: delivery });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Failed to report comment' }, 500);
  }
}

function getClientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    ''
  );
}

async function hashIp(value) {
  const encoded = new TextEncoder().encode(value || '');
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return toHex(digest);
}

async function notifySlack(env, payload) {
  const webhook = env.SLACK_WEBHOOK_URL;
  if (!webhook) return false;

  const text = buildSlackText(payload);
  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    return response.ok;
  } catch (_error) {
    return false;
  }
}

function buildSlackText(payload) {
  const preview = (payload.comment.body || '').replace(/\s+/g, ' ').slice(0, 200);
  const postUrl = `${payload.comment.postPath || ''}`;
  return [
    '[댓글 신고]',
    `- 댓글 ID: ${payload.comment.id}`,
    `- 닉네임: ${payload.comment.nickname || '익명'}`,
    `- 경로: ${postUrl}`,
    `- 사유: ${payload.reason}`,
    `- 내용: ${preview}`
  ].join('\n');
}

function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let output = '';
  for (const byte of bytes) {
    output += byte.toString(16).padStart(2, '0');
  }
  return output;
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
