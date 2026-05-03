(function () {
  'use strict';

  function logDebug(message, data) {
    try {
      if (!window || !window.console || !window.console.debug) return;
      if (typeof data === 'undefined') window.console.debug('[blog-qa]', message);
      else window.console.debug('[blog-qa]', message, data);
    } catch (_) {}
  }

  function logError(message, data) {
    try {
      if (!window || !window.console || !window.console.error) return;
      if (typeof data === 'undefined') window.console.error('[blog-qa]', message);
      else window.console.error('[blog-qa]', message, data);
    } catch (_) {}
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function getApiBase() {
    const el = document.documentElement;
    const v = el && el.getAttribute('data-qa-api-base');
    return (v || '').replace(/\/$/, '');
  }

  function getPageTitle() {
    const title = document.title || '';
    return title.replace(/\s*[-|].*$/, '').trim();
  }

  const API_BASE = getApiBase();

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
      info: { fg: '#334155' },
      ok: { fg: '#166534' },
      warn: { fg: '#92400e' },
      error: { fg: '#991b1b' },
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
      logDebug('API base missing (data-qa-api-base is empty)');
      return false;
    }

    const url = API_BASE + '/health';
    try {
      const r = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store', credentials: 'include' });
      if (!r.ok) {
        setMiniStatus('backend-status', 'degraded', 'warn');
        logDebug('health not ok', { status: r.status, url });
        return false;
      }
      setMiniStatus('backend-status', 'healthy', 'ok');
      logDebug('health ok', { url });
      return true;
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      setMiniStatus('backend-status', 'unreachable', 'error');
      logError('health fetch failed', { message: msg, url });
      return false;
    }
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  function autoGrowTextarea(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
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

  function init() {
    const qaForm = byId('blog-qa-form');

    if (qaForm) {
      qaForm.addEventListener('submit', askQuestion);
      wireQaComposer(qaForm);
    }

    if (!qaForm) return;

    checkBlogSiteStatus();
    checkHealth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
