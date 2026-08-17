#!/usr/bin/env node

const BASE_URL = process.env.CF_BASE_URL || '';
const TEST_PASSWORD = process.env.CF_TEST_PASSWORD || 'test1234';
const ADMIN_PASSWORD = process.env.CF_ADMIN_PASSWORD || '';
const POST_PATH = process.env.CF_POST_PATH || `/docs/smoke-${Date.now()}`;

if (!BASE_URL || !/^https?:\/\//.test(BASE_URL)) {
  console.error('[smoke] CF_BASE_URL is required and must be absolute URL.');
  console.error('Example: CF_BASE_URL=https://your-project.pages.dev node scripts/smoke_test_cf_comments.mjs');
  process.exit(1);
}

function decodeResponse(response) {
  return response.text().then(raw => {
    try {
      return [response, JSON.parse(raw)];
    } catch (_err) {
      return [response, { raw }];
    }
  });
}

async function request(method, path, body) {
  const headers = {
    Accept: 'application/json'
  };
  const options = { method, headers };
  if (body !== null && body !== undefined) {
    headers['Content-Type'] = 'application/json';
    options.body = body;
  }
  const res = await fetch(new URL(path, BASE_URL).toString(), options);
  const [response, payload] = await decodeResponse(res);
  if (!response.ok) {
    const message = payload && payload.error ? payload.error : payload?.raw || '(no body)';
    throw new Error(`${method} ${path} failed (${response.status}): ${message}`);
  }
  return payload;
}

async function main() {
  const token = Date.now().toString(36);
  const marker = `smoke-${token}`;
  const nickname = 'smoke-bot';
  const password = TEST_PASSWORD;
  const initBody = `테스트 댓글 ${marker}`;

  const created = await request('POST', '/api/comments', JSON.stringify({
    post_path: POST_PATH,
    nickname,
    password,
    body: initBody
  }));
  if (!created.ok) throw new Error('create response not ok');
  console.log('[smoke] CREATE ok');

  const listResp = await request('GET', `/api/comments?post_path=${encodeURIComponent(POST_PATH)}`, null);
  const found = (listResp.items || []).find(item => item.nickname === nickname && item.body === initBody);
  if (!found || !found.id) throw new Error('created comment not found in list response');
  console.log(`[smoke] LIST ok -> id=${found.id}`);

  try {
    await request('PUT', `/api/comments/${found.id}`, JSON.stringify({
      password: 'wrong',
      nickname,
      body: 'bad update'
    }));
    throw new Error('wrong password update should fail');
  } catch (err) {
    if (!/401/.test(err.message)) throw err;
    console.log('[smoke] UPDATE wrong password rejected');
  }

  const updatedBody = `수정 ${marker}`;
  await request('PUT', `/api/comments/${found.id}`, JSON.stringify({
    password,
    nickname,
    body: updatedBody
  }));
  console.log('[smoke] UPDATE ok');

  await request('POST', `/api/comments/${found.id}/report`, JSON.stringify({
    reason: 'smoke test'
  }));
  console.log('[smoke] REPORT ok');

  if (ADMIN_PASSWORD) {
    await request('DELETE', `/api/comments/${found.id}`, JSON.stringify({
      admin_password: ADMIN_PASSWORD
    }));
    console.log('[smoke] DELETE with admin ok');
  } else {
    await request('DELETE', `/api/comments/${found.id}`, JSON.stringify({
      password
    }));
    console.log('[smoke] DELETE ok');
  }

  console.log('[smoke] completed');
}

main().catch(err => {
  console.error(`[smoke] FAILED: ${err.message}`);
  process.exit(1);
});
