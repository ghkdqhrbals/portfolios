export async function onRequestPut(context) {
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
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const body = trimOrNull(payload.body);
  const nickname = typeof payload.nickname === 'string' ? payload.nickname.trim() : '';
  const password = trimOrNull(payload.password);
  const adminPassword = trimOrNull(payload.admin_password);

  if (!password && !isMasterPasswordMatch(adminPassword, env.COMMENT_ADMIN_PASSWORD)) {
    return jsonResponse({ error: 'password is required' }, 400);
  }

  if (!body) {
    return jsonResponse({ error: 'body is required' }, 400);
  }
  if (body.length > 5000) {
    return jsonResponse({ error: 'body is too long' }, 400);
  }
  if (nickname && nickname.length > 40) {
    return jsonResponse({ error: 'nickname is too long' }, 400);
  }

  try {
    const existing = await env.COMMENTS_DB.prepare(
      `
        SELECT id, password_hash, nickname
        FROM comments
        WHERE id = ?1 AND deleted_at IS NULL
      `
    )
      .bind(commentId)
      .first();

    if (!existing) {
      return jsonResponse({ error: 'Comment not found' }, 404);
    }

    if (!await verifyPasswordOrAdmin(password, existing.password_hash, env, adminPassword)) {
      return jsonResponse({ error: 'Invalid password' }, 401);
    }

    const now = new Date().toISOString();
    const nextNickname = nickname || existing.nickname || '익명';
    await env.COMMENTS_DB.prepare(
      `
        UPDATE comments
        SET body = ?1, nickname = ?2, updated_at = ?3
        WHERE id = ?4
      `
    )
      .bind(body, nextNickname, now, commentId)
      .run();

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Failed to update comment' }, 500);
  }
}

export async function onRequestDelete(context) {
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

  const password = trimOrNull(payload.password);
  const adminPassword = trimOrNull(payload.admin_password);

  try {
    const existing = await env.COMMENTS_DB.prepare(
      `
        SELECT id, password_hash
        FROM comments
        WHERE id = ?1 AND deleted_at IS NULL
      `
    )
      .bind(commentId)
      .first();

    if (!existing) {
      return jsonResponse({ error: 'Comment not found' }, 404);
    }

    const authorized = await verifyPasswordOrAdmin(password, existing.password_hash, env, adminPassword);
    if (!authorized) {
      return jsonResponse({ error: 'Invalid password' }, 401);
    }

    const now = new Date().toISOString();
    await env.COMMENTS_DB.prepare(
      `
        UPDATE comments
        SET deleted_at = ?1
        WHERE id = ?2
      `
    )
      .bind(now, commentId)
      .run();

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ error: error.message || 'Failed to delete comment' }, 500);
  }
}

function trimOrNull(value) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

async function verifyPasswordOrAdmin(password, storedHash, env, adminPassword = '') {
  if (isMasterPasswordMatch(adminPassword || '', env.COMMENT_ADMIN_PASSWORD)) {
    return true;
  }

  if (!password) return false;
  const parsed = normalizeStoredHash(storedHash);
  if (!parsed) return false;

  const expected = await hashPassword(password, parsed.salt);
  return expected === `${parsed.salt}:${parsed.hash}`;
}

function isMasterPasswordMatch(candidate, expected) {
  if (!candidate || !expected) return false;
  return candidate === expected;
}

function normalizeStoredHash(value) {
  if (typeof value !== 'string') return null;
  const delimiterIndex = value.indexOf(':');
  if (delimiterIndex <= 0) return null;
  return {
    salt: value.slice(0, delimiterIndex),
    hash: value.slice(delimiterIndex + 1)
  };
}

function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let output = '';
  for (const byte of bytes) {
    output += byte.toString(16).padStart(2, '0');
  }
  return output;
}

async function hashPassword(password, salt) {
  const encoded = new TextEncoder().encode(`${salt}:${password || ''}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
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
