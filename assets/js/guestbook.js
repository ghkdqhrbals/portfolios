(function () {
  'use strict';

  function logDebug(message, data) {
    try {
      if (!window || !window.console || !window.console.debug) return;
      if (typeof data === 'undefined') window.console.debug('[guestbook]', message);
      else window.console.debug('[guestbook]', message, data);
    } catch (_) {}
  }

  function logError(message, data) {
    try {
      if (!window || !window.console || !window.console.error) return;
      if (typeof data === 'undefined') window.console.error('[guestbook]', message);
      else window.console.error('[guestbook]', message, data);
    } catch (_) {}
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function getSiteBaseurl() {
    const el = document.documentElement;
    const v = el && el.getAttribute('data-site-baseurl');
    return v || '';
  }

  function getApiBase() {
    const el = document.documentElement;
    const v = el && el.getAttribute('data-guestbook-api-base');
    return (v || '').replace(/\/$/, '');
  }

  function getPageTitle() {
    const title = document.title || '';
    return title.replace(/\s*[-|].*$/, '').trim();
  }

  function getGuestbookPageOverride() {
    const el = document.documentElement;
    const v = el && el.getAttribute('data-guestbook-page-override');
    return (v || '').trim();
  }

  function normalizePagePath(pathname) {
    const baseurl = getSiteBaseurl();
    if (baseurl && pathname && pathname.startsWith(baseurl)) {
      const stripped = pathname.slice(baseurl.length);
      return stripped || '/';
    }
    return pathname || '/';
  }

  function stripTrailingSlashes(path) {
    return String(path || '/').replace(/\/+$/, '') || '/';
  }

  function getListOrderForPage(pagePath) {
    // Guestbook page: newest first. Regular pages: oldest first.
    const p = stripTrailingSlashes(pagePath);
    return p === '/guestbook' ? 'desc' : 'asc';
  }

  function getGuestbookPagePath() {
    const override = getGuestbookPageOverride();
    if (override) {
      // Allow value like "/guestbook/" (preferred). Also tolerate missing leading slash.
      const normalized = override.startsWith('/') ? override : '/' + override;
      return normalizePagePath(normalized);
    }
    return normalizePagePath(window.location.pathname);
  }

  function setStatus(message, kind) {
    const section = byId('guestbook-section');
    const el = byId('guestbook-status');
    if (section) section.style.display = 'block';
    if (!el) return;

    if (!message) {
      el.textContent = '';
      el.style.display = 'none';
      return;
    }

    el.style.display = 'block';

    el.textContent = message;

    const styles = {
      info: 'border:1px solid #e5e7eb;background:#f9fafb;color:#111827;',
      ok: 'border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;',
      warn: 'border:1px solid #fed7aa;background:#fff7ed;color:#9a3412;',
      error: 'border:1px solid #fecaca;background:#fff1f2;color:#991b1b;',
    };
    el.setAttribute(
      'style',
      'margin:12px 0;padding:10px 12px;border-radius:8px;' + (styles[kind] || styles.info),
    );
  }

  function setFormVisible(visible) {
    const form = byId('guestbook-form');
    if (!form) return;
    form.style.display = visible ? 'grid' : 'none';
  }

  function setSectionVisible(visible) {
    const section = byId('guestbook-section');
    if (!section) return;
    section.style.display = visible ? 'block' : 'none';
  }

  const API_BASE = getApiBase();

  const PAGE_SIZE = 20;
  let currentListPage = 1;
  let lastTotal = 0;
  let replyOpenFor = null;

  function setQaState(message, kind) {
    const el = byId('blog-qa-status');
    if (!el) return;
    if (!message) {
      el.textContent = '';
      el.style.display = 'none';
      return;
    }
    const tones = {
      info: 'border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;',
      ok: 'border:1px solid #bbf7d0;background:#f0fdf4;color:#166534;',
      error: 'border:1px solid #fecaca;background:#fff1f2;color:#991b1b;',
    };
    el.style.display = 'block';
    el.setAttribute('style', 'margin:12px 0;padding:10px 12px;border-radius:8px;' + (tones[kind] || tones.info));
    el.textContent = message;
  }

  function setSubmitLoading(isLoading) {
    const submitEl = byId('blog-qa-submit');
    const labelEl = submitEl && submitEl.querySelector ? submitEl.querySelector('.blog-qa-submit-label') : null;
    if (!submitEl || !labelEl) return;

    submitEl.disabled = !!isLoading;
    submitEl.classList.toggle('is-loading', !!isLoading);
    labelEl.textContent = isLoading ? '' : '➜';
    submitEl.setAttribute('aria-label', isLoading ? '답변 생성 중' : '질문 보내기');
  }

  function setMiniStatus(idPrefix, text, kind) {
    const card = byId(idPrefix + '-card');
    const value = byId(idPrefix + '-value');
    const dot = byId(idPrefix + '-dot');
    if (!card || !value) return;

    const tones = {
      info: { border: '#cbd5e1', bg: '#f8fafc', fg: '#334155' },
      ok: { border: '#bbf7d0', bg: '#f0fdf4', fg: '#166534' },
      warn: { border: '#fde68a', bg: '#fffbeb', fg: '#92400e' },
      error: { border: '#fecaca', bg: '#fff1f2', fg: '#991b1b' },
    };
    const tone = tones[kind] || tones.info;

    card.style.borderColor = 'transparent';
    card.style.background = 'transparent';
    value.style.color = tone.fg;
    value.textContent = text;
    if (dot) {
      dot.classList.remove('info', 'ok', 'warn', 'error');
      dot.classList.add(kind || 'info');
    }
  }

  async function checkBlogSiteStatus() {
    try {
      await fetch('https://ghkdqhrbals.github.io/portfolios/', { method: 'GET', mode: 'no-cors', cache: 'no-store' });
      setMiniStatus('blog-site-status', 'reachable', 'ok');
    } catch (_) {
      setMiniStatus('blog-site-status', 'unreachable', 'error');
    }
  }

  async function checkHealth() {
    if (!API_BASE) {
      setMiniStatus('backend-status', 'missing api base', 'warn');
      setFormVisible(false);
      setStatus('', 'warn');
      setSectionVisible(false);
      logDebug('API base missing (data-guestbook-api-base is empty)');
      return false;
    }

    setSectionVisible(true);
    setStatus('', 'info');
    const url = API_BASE + '/health';
    try {
      const r = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'include' });
      if (!r.ok) {
        setMiniStatus('backend-status', 'degraded', 'warn');
        setFormVisible(false);
        setStatus('', 'warn');
        setSectionVisible(false);
        logDebug('health not ok', { status: r.status, url });
        return false;
      }
      setFormVisible(true);
      setStatus('', 'ok');
      setSectionVisible(true);
      setMiniStatus('backend-status', 'healthy', 'ok');
      logDebug('health ok', { url });
      return true;
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      setMiniStatus('backend-status', 'unreachable', 'error');
      setFormVisible(false);
      setStatus('', 'error');
      setSectionVisible(false);
      logError('health fetch failed', { message: msg, url });
      return false;
    }
  }

  function renderInlineMarkdown(text) {
    return escapeHtml(String(text || ''))
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  }

  function renderMarkdown(markdown) {
    const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let inCodeBlock = false;
    let codeLines = [];
    let listType = null;
    let paragraph = [];

    function flushParagraph() {
      if (!paragraph.length) return;
      html.push('<p>' + renderInlineMarkdown(paragraph.join(' ')) + '</p>');
      paragraph = [];
    }

    function flushList() {
      if (!listType) return;
      html.push('</' + listType + '>');
      listType = null;
    }

    function flushCodeBlock() {
      if (!inCodeBlock) return;
      html.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
      inCodeBlock = false;
      codeLines = [];
    }

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        flushParagraph();
        flushList();
        if (inCodeBlock) flushCodeBlock();
        else inCodeBlock = true;
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      if (!trimmed) {
        flushParagraph();
        continue;
      }

      const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const level = Math.min(6, heading[1].length);
        html.push('<h' + level + '>' + renderInlineMarkdown(heading[2]) + '</h' + level + '>');
        continue;
      }

      const bullet = trimmed.match(/^[-*]\s+(.+)$/);
      if (bullet) {
        flushParagraph();
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
          html.push('<ul>');
        }
        html.push('<li>' + renderInlineMarkdown(bullet[1]) + '</li>');
        continue;
      }

      const numbered = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (numbered) {
        flushParagraph();
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
          const start = Math.max(1, Number.parseInt(numbered[1], 10) || 1);
          html.push('<ol start="' + start + '">');
        }
        html.push('<li>' + renderInlineMarkdown(numbered[2]) + '</li>');
        continue;
      }

      if (listType) flushList();
      paragraph.push(trimmed);
    }

    flushParagraph();
    flushList();
    flushCodeBlock();

    return html.join('');
  }

  function normalizeToolCalls(toolCalls) {
    if (!Array.isArray(toolCalls)) return [];
    return toolCalls
      .map((toolCall) => {
        if (!toolCall || typeof toolCall !== 'object') return null;
        const tool = toolCall.tool || toolCall.name || '';
        const args = toolCall.arguments || toolCall.args || {};
        if (!tool) return null;
        return { tool: String(tool), arguments: args };
      })
      .filter(Boolean);
  }

  function createStreamingQaResult() {
    const host = byId('blog-qa-result');
    if (!host) return null;
    host.innerHTML =
      '<div class="blog-qa-tools" style="display:none;" aria-label="호출된 함수"><ul></ul></div>' +
      '<div class="blog-qa-answer markdown-body"></div>' +
      '<div class="blog-qa-sources" style="display:none;"><strong>참고한 글</strong><ul></ul></div>';
    return host;
  }

  function updateStreamingAnswer(answer) {
    const host = byId('blog-qa-result');
    const answerEl = host && host.querySelector ? host.querySelector('.blog-qa-answer') : null;
    if (!answerEl) return;
    answerEl.innerHTML = renderMarkdown(answer || '');
  }

  function updateStreamingSources(sources) {
    const host = byId('blog-qa-result');
    const sourcesEl = host && host.querySelector ? host.querySelector('.blog-qa-sources') : null;
    const listEl = sourcesEl && sourcesEl.querySelector ? sourcesEl.querySelector('ul') : null;
    if (!sourcesEl || !listEl) return;
    const sourceHtml = (sources || [])
      .map((source) => {
        const title = escapeHtml(String(source.title || '참고 링크'));
        const url = escapeHtml(String(source.url || '#'));
        return '<li><a href="' + url + '" target="_blank" rel="noreferrer">' + title + '</a></li>';
      })
      .join('');
    listEl.innerHTML = sourceHtml;
    sourcesEl.style.display = sourceHtml ? 'block' : 'none';
  }

  function addStreamingToolCall(toolCalls, toolCall) {
    const normalized = normalizeToolCalls([toolCall])[0];
    if (!normalized) return;
    const key = normalized.tool + ':' + JSON.stringify(normalized.arguments || {});
    const exists = toolCalls.some((existing) => existing.key === key);
    if (!exists) toolCalls.push({ key, tool: normalized.tool, arguments: normalized.arguments });

    const host = byId('blog-qa-result');
    const toolsEl = host && host.querySelector ? host.querySelector('.blog-qa-tools') : null;
    const listEl = toolsEl && toolsEl.querySelector ? toolsEl.querySelector('ul') : null;
    if (!toolsEl || !listEl) return;
    listEl.innerHTML = toolCalls
      .map((item) => {
        return '<li><span class="blog-qa-tool-name">' + escapeHtml(item.tool) + '</span></li>';
      })
      .join('');
    toolsEl.style.display = toolCalls.length ? 'block' : 'none';
  }

  function parseSseMessage(raw) {
    const message = { event: '', data: '' };
    String(raw || '').split(/\r?\n/).forEach((line) => {
      if (!line || line.startsWith(':')) return;
      const idx = line.indexOf(':');
      const field = idx >= 0 ? line.slice(0, idx) : line;
      let value = idx >= 0 ? line.slice(idx + 1) : '';
      if (value.startsWith(' ')) value = value.slice(1);
      if (field === 'event') message.event = value;
      if (field === 'data') message.data += (message.data ? '\n' : '') + value;
    });
    return message;
  }

  async function readAskStream(response, state) {
    if (!response.body || !response.body.getReader) {
      throw new Error('이 브라우저에서 스트리밍 응답을 읽을 수 없습니다.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    async function handleMessage(raw) {
      const message = parseSseMessage(raw);
      if (!message.data) return;

      let payload;
      try {
        payload = JSON.parse(message.data);
      } catch (_) {
        return;
      }

      const eventName = payload.event || message.event;
      if (eventName === 'answer_delta') {
        state.answer += payload.delta || '';
        updateStreamingAnswer(state.answer);
        return;
      }
      if (eventName === 'tool_call') {
        addStreamingToolCall(state.toolCalls, payload.tool_call);
        return;
      }
      if (eventName === 'done') {
        const result = payload.result || {};
        state.answer = result.answer || state.answer;
        updateStreamingAnswer(state.answer);
        updateStreamingSources(result.sources || []);
        normalizeToolCalls(result.tool_calls).forEach((toolCall) => addStreamingToolCall(state.toolCalls, toolCall));
        state.done = true;
        return;
      }
      if (eventName === 'error') {
        throw new Error(payload.error || '스트리밍 처리 중 오류가 발생했습니다.');
      }
    }

    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });

      let boundary = buffer.search(/\r?\n\r?\n/);
      while (boundary >= 0) {
        const raw = buffer.slice(0, boundary);
        buffer = buffer.slice(buffer.charAt(boundary) === '\r' ? boundary + 4 : boundary + 2);
        await handleMessage(raw);
        boundary = buffer.search(/\r?\n\r?\n/);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) await handleMessage(buffer);
  }

  async function askQuestion(ev) {
    ev.preventDefault();
    if (!API_BASE) {
      setQaState('API 서버 주소가 비어 있습니다.', 'error');
      return;
    }

    const questionEl = byId('blog-qa-question');
    const question = (questionEl && questionEl.value) || '';
    if (!question.trim()) {
      setQaState('질문을 입력해 주세요.', 'error');
      return;
    }

    setSubmitLoading(true);
    setQaState('', 'info');

    try {
      createStreamingQaResult();

      const response = await fetch(API_BASE + '/ask/stream', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({
          question,
          page_url: window.location.href,
          page_title: getPageTitle(),
        }),
      });
      if (!response.ok) {
        let detail = '질문 처리에 실패했습니다.';
        try {
          const data = await response.json();
          detail = (data && (data.detail || data.message)) || detail;
        } catch (_) {}
        throw new Error(detail);
      }

      await readAskStream(response, { answer: '', toolCalls: [], done: false });
      setQaState('', 'ok');
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      setQaState(msg, 'error');
    } finally {
      setSubmitLoading(false);
    }
  }

  function wireQaComposer(form) {
    const textarea = byId('blog-qa-question');
    if (!textarea || !form) return;

    textarea.addEventListener('input', () => autoGrowTextarea(textarea));
    textarea.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter') return;
      if (ev.shiftKey) return;
      ev.preventDefault();
      try {
        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      } catch (_) {}
    });
    autoGrowTextarea(textarea);
  }

  function clampInt(v, min, max, fallback) {
    const n = Number.parseInt(String(v), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }

  function getTotalPages(total) {
    return Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));
  }

  function renderPagination(total, page) {
    const host = byId('guestbook-pagination');
    if (!host) return;

    lastTotal = total || 0;
    const totalPages = getTotalPages(lastTotal);
    const safePage = clampInt(page, 1, totalPages, 1);
    currentListPage = safePage;

    if (totalPages <= 1) {
      host.innerHTML = '';
      host.style.display = 'none';
      return;
    }

    host.style.display = 'flex';

    const prevDisabled = safePage <= 1;
    const nextDisabled = safePage >= totalPages;

    host.innerHTML =
      '<button type="button" class="gb-page-btn" data-page="' + (safePage - 1) + '" ' + (prevDisabled ? 'disabled' : '') + '>Prev</button>' +
      '<span class="gb-page-info">' + safePage + ' / ' + totalPages + '</span>' +
      '<button type="button" class="gb-page-btn" data-page="' + (safePage + 1) + '" ' + (nextDisabled ? 'disabled' : '') + '>Next</button>';
  }

  function wirePagination() {
    const host = byId('guestbook-pagination');
    if (!host) return;
    if (host.__wired) return;
    host.__wired = true;
    host.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!t || !t.getAttribute) return;
      const page = t.getAttribute('data-page');
      if (!page) return;
      const totalPages = getTotalPages(lastTotal);
      const nextPage = clampInt(page, 1, totalPages, 1);
      loadGuestbook(nextPage);
    });
  }

  async function loadGuestbook(pageNum) {
    const currentPage = getGuestbookPagePath();
    const order = getListOrderForPage(currentPage);
    const page = clampInt(pageNum || currentListPage, 1, 10_000, 1);
    const url = API_BASE
      + '/guestbook?page_filter=' + encodeURIComponent(currentPage)
      + '&page=' + encodeURIComponent(String(page))
      + '&per_page=' + encodeURIComponent(String(PAGE_SIZE))
      + '&order=' + encodeURIComponent(order);
    try {
      const r = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'include' });
      const data = await r.json();
      const list = byId('guestbook-list');
      if (!list) return;
      const threads = (data && data.threads) || [];
      const total = (data && typeof data.total === 'number') ? data.total : 0;

      list.innerHTML = threads
        .map((t) => {
          const entry = t.entry;
          const replies = t.replies || [];
          const id = entry[0];
          const name = entry[1];
          const message = entry[2];
          const date = entry[3];

          const parentHtml =
            '<div class="guestbook-entry" data-entry-id="' + id + '">' +
            '  <span class="entry-name">' + escapeHtml(String(name)) + '</span>' +
            '  <span class="entry-message">' + escapeHtml(String(message)) + '</span>' +
            '  <span class="entry-date">' + escapeHtml(String(date)) + '</span>' +
            '  <span class="entry-actions">' +
            '    <button type="button" data-action="reply" data-id="' + id + '" class="action-btn reply-btn">Reply</button>' +
            '    <button type="button" data-action="edit" data-id="' + id + '" class="action-btn edit-btn">Edit</button>' +
            '    <button type="button" data-action="delete" data-id="' + id + '" class="action-btn delete-btn">Delete</button>' +
            '  </span>' +
            '</div>';

          const replyForm = (replyOpenFor === id)
            ? (
              '<form class="gb-reply-form" data-parent-id="' + id + '">' +
              '  <input class="gb-reply-name" name="name" type="text" placeholder="Name" autocomplete="name" required />' +
              '  <input class="gb-reply-password" name="password" type="password" placeholder="Password" autocomplete="current-password" required />' +
              '  <input class="gb-reply-message" name="message" type="text" placeholder="Write a reply…" maxlength="500" required />' +
              '  <button type="submit" class="gb-reply-submit">Reply</button>' +
              '  <button type="button" class="gb-reply-cancel" data-action="reply-cancel" data-id="' + id + '">Cancel</button>' +
              '</form>'
            )
            : '';

          const repliesHtml = replies
            .map((r) => {
              const rid = r[0];
              const rname = r[1];
              const rmessage = r[2];
              const rdate = r[3];
              return (
                '<div class="guestbook-reply" data-entry-id="' + rid + '">' +
                '  <span class="entry-name">' + escapeHtml(String(rname)) + '</span>' +
                '  <span class="entry-message">' + escapeHtml(String(rmessage)) + '</span>' +
                '  <span class="entry-date">' + escapeHtml(String(rdate)) + '</span>' +
                '  <span class="entry-actions">' +
                '    <button type="button" data-action="edit" data-id="' + rid + '" class="action-btn edit-btn">Edit</button>' +
                '    <button type="button" data-action="delete" data-id="' + rid + '" class="action-btn delete-btn">Delete</button>' +
                '  </span>' +
                '</div>'
              );
            })
            .join('');

          return '<div class="guestbook-thread">' + parentHtml + replyForm + repliesHtml + '</div>';
        })
        .join('');

      renderPagination(total, (data && data.page) || page);
      logDebug('list loaded', { page: currentPage, listPage: page, threads: threads.length, total });
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      setStatus('', 'error');
      setFormVisible(false);
      setSectionVisible(false);
      logError('list fetch failed', { message: msg, url });
    }
  }

  function escapeHtml(s) {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function autoGrowTextarea(el) {
    if (!el || !el.style) return;
    try {
      el.style.height = 'auto';
      const h = Math.min(el.scrollHeight || 0, 220);
      if (h) el.style.height = h + 'px';
    } catch (_) {}
  }

  function wireEnterToSubmit(textarea, form) {
    if (!textarea || !form || !textarea.addEventListener) return;
    textarea.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Enter') return;
      if (ev.shiftKey) return; // Shift+Enter => newline
      ev.preventDefault();
      try {
        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      } catch (_) {}
    });
    textarea.addEventListener('input', () => autoGrowTextarea(textarea));
    autoGrowTextarea(textarea);
  }

  async function addEntry(ev) {
    ev.preventDefault();
    const name = (byId('name') && byId('name').value) || '';
    const password = (byId('password') && byId('password').value) || '';
    const message = (byId('message') && byId('message').value) || '';
    const page = getGuestbookPagePath();
    const order = getListOrderForPage(page);

    if (message.length > 500) {
      logDebug('message too long', { length: message.length });
      return;
    }

    const url = API_BASE + '/guestbook';
    try {
      const r = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, message, page }),
      });
      if (!r.ok) {
        logDebug('create not ok', { status: r.status, url });
        return;
      }
      const form = byId('guestbook-form');
      if (form) form.reset();

      // If list is chronological (asc), the newest comment lands on the last page.
      await loadGuestbook(1);
      if (order === 'asc') {
        const totalPages = getTotalPages(lastTotal);
        if (totalPages > 1) await loadGuestbook(totalPages);
      }
      logDebug('create ok', { url });
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      logError('create failed', { message: msg, url });
    }
  }

  async function editEntry(id) {
    const password = prompt('Enter password:');
    if (!password) return;
    const message = prompt('Edit comment:');
    if (!message) return;

    if (message.length > 500) {
      alert('Max length is 500 characters.');
      return;
    }

    const url = API_BASE + '/guestbook/' + encodeURIComponent(String(id));
    try {
      const r = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, message }),
      });
      if (!r.ok) {
        alert('Edit failed');
        return;
      }
      await loadGuestbook(currentListPage);
    } catch (e) {
      alert('Edit failed');
    }
  }

  async function addReply(parentId, payload) {
    const name = payload.name || '';
    const password = payload.password || '';
    const message = payload.message || '';
    const page = getGuestbookPagePath();

    if (message.length > 500) {
      alert('Max length is 500 characters.');
      return;
    }

    const url = API_BASE + '/guestbook';
    try {
      const r = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password, message, page, parent_id: Number(parentId) }),
      });
      if (!r.ok) {
        logDebug('reply not ok', { status: r.status, url });
        return;
      }
      replyOpenFor = null;
      await loadGuestbook(currentListPage);
      logDebug('reply ok', { parentId });
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      logError('reply failed', { message: msg, url });
    }
  }

  async function deleteEntry(id) {
    const password = prompt('Enter password:');
    if (!password) return;

    const url = API_BASE + '/guestbook/' + encodeURIComponent(String(id)) + '?password=' + encodeURIComponent(password);
    try {
      const r = await fetch(url, { method: 'DELETE', credentials: 'include' });
      if (!r.ok) {
        alert('Delete failed');
        return;
      }
      await loadGuestbook(currentListPage);
    } catch (e) {
      alert('Delete failed');
    }
  }

  function wireEntryButtons() {
    const list = byId('guestbook-list');
    if (!list) return;
    list.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!t || !t.getAttribute) return;
      const action = t.getAttribute('data-action');
      const id = t.getAttribute('data-id');
      if (!action) return;

      if (action === 'reply') {
        if (!id) return;
        replyOpenFor = (replyOpenFor === Number(id)) ? null : Number(id);
        loadGuestbook(currentListPage);
        return;
      }

      if (action === 'reply-cancel') {
        replyOpenFor = null;
        loadGuestbook(currentListPage);
        return;
      }

      if (!id) return;
      if (action === 'edit') editEntry(id);
      if (action === 'delete') deleteEntry(id);
    });

    list.addEventListener('submit', (ev) => {
      const form = ev.target;
      if (!form || !form.getAttribute) return;
      if (!form.classList || !form.classList.contains('gb-reply-form')) return;
      ev.preventDefault();
      const parentId = form.getAttribute('data-parent-id');
      if (!parentId) return;

      const fd = new FormData(form);
      addReply(parentId, {
        name: String(fd.get('name') || ''),
        password: String(fd.get('password') || ''),
        message: String(fd.get('message') || ''),
      });
    });
    // Enter submits, Shift+Enter inserts newline + autosize
    list.addEventListener('keydown', (ev) => {
      const t = ev.target;
      if (!t || !t.classList || !t.classList.contains('gb-reply-message')) return;
      if (ev.key !== 'Enter') return;
      if (ev.shiftKey) return;
      const form = t.closest && t.closest('form');
      if (!form) return;
      ev.preventDefault();
      try {
        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      } catch (_) {}
    });
    list.addEventListener('input', (ev) => {
      const t = ev.target;
      if (!t || !t.classList || !t.classList.contains('gb-reply-message')) return;
      autoGrowTextarea(t);
    });
  }

  function init() {
    setFormVisible(false);
    setSectionVisible(true);

    const form = byId('guestbook-form');
    const qaForm = byId('blog-qa-form');

    if (qaForm) {
      qaForm.addEventListener('submit', askQuestion);
      wireQaComposer(qaForm);
    }

    if (form) {
      wireEntryButtons();
      wirePagination();
      form.addEventListener('submit', addEntry);

      const mainMessage = byId('message');
      wireEnterToSubmit(mainMessage, form);
    }

    if (!form && !qaForm) return;

    checkBlogSiteStatus();

    checkHealth().then((ok) => {
      if (!ok || !form) return;
      loadGuestbook(1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
