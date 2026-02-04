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

  async function checkHealth() {
    if (!API_BASE) {
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
      const r = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
      if (!r.ok) {
        setFormVisible(false);
        setStatus('', 'warn');
        setSectionVisible(false);
        logDebug('health not ok', { status: r.status, url });
        return false;
      }
      setFormVisible(true);
      setStatus('', 'ok');
      setSectionVisible(true);
      logDebug('health ok', { url });
      return true;
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      setFormVisible(false);
      setStatus('', 'error');
      setSectionVisible(false);
      logError('health fetch failed', { message: msg, url });
      return false;
    }
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
      const r = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
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
      const r = await fetch(url, { method: 'DELETE' });
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
    if (!form) return;

    wireEntryButtons();
    wirePagination();
    form.addEventListener('submit', addEntry);

    const mainMessage = byId('message');
    wireEnterToSubmit(mainMessage, form);

    checkHealth().then((ok) => {
      if (!ok) return;
      loadGuestbook(1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
