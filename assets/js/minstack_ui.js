(function () {
  'use strict';

  function initNavigation() {
    var toggle = document.getElementById('sidebar-collapse-toggle');
    var openToggle = document.getElementById('sidebar-open-toggle');
    if (!toggle || !openToggle) return;
    var key = 'minstack-nav-collapsed';
    var collapsed = window.localStorage.getItem(key) === 'true';
    function update(value) {
      collapsed = value;
      document.body.classList.toggle('minstack-nav-collapsed', collapsed);
      toggle.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
      toggle.setAttribute('aria-label', '네비게이션 닫기');
      toggle.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
      openToggle.setAttribute('aria-pressed', collapsed ? 'false' : 'true');
      openToggle.hidden = !collapsed;
    }
    update(collapsed);
    function toggleNavigation() {
      window.localStorage.setItem(key, String(!collapsed));
      update(!collapsed);
    }
    toggle.addEventListener('click', toggleNavigation);
    openToggle.addEventListener('click', toggleNavigation);
  }

  function apiPath(path) { return path === '/portfolios' ? '/' : (path.indexOf('/portfolios/') === 0 ? path.slice(11) : path); }
  function resolvePageAsset(source, pageUrl) {
    if (!source) return '';
    try {
      var page = new URL(pageUrl || window.location.pathname, window.location.origin);
      var directory = page.pathname.endsWith('/') ? page.pathname : page.pathname.slice(0, page.pathname.lastIndexOf('/') + 1);
      return new URL(source, window.location.origin + directory).href;
    } catch (_) { return source; }
  }
  function normalizeContentImages() {
    var pageUrl = window.location.pathname;
    document.querySelectorAll('.main-content img[src]').forEach(function (image) {
      var source = image.getAttribute('src') || '';
      if (source.indexOf('../') === 0 || source.indexOf('./') === 0) image.src = resolvePageAsset(source, pageUrl);
    });
  }
  function enhanceRecent() {
    var list = document.getElementById('recent-list');
    if (!list) return;
    var links = Array.prototype.slice.call(list.querySelectorAll('.r-title a'));
    var paths = links.map(function (link) { return apiPath(new URL(link.href, window.location.origin).pathname); });
    if (!paths.length) return;
    fetch('/api/metrics?post_paths=' + encodeURIComponent(paths.join(',')), { headers: { Accept: 'application/json' } })
      .then(function (response) { return response.ok ? response.json() : { items: [] }; })
      .then(function (payload) {
        var items = payload.items || [];
        links.forEach(function (link, index) {
          var meta = items.find(function (item) { return apiPath(item.post_path) === paths[index]; });
          if (!meta) return;
          var title = link.parentElement;
          var stats = title.querySelector('.recent-stats') || document.createElement('span');
          stats.className = 'recent-stats';
          stats.innerHTML = '<span class="recent-stat recent-stat--like" aria-label="좋아요">' + (meta.like_count || 0) + '</span><span class="recent-stat recent-stat--comment" aria-label="댓글">' + (meta.comment_count || 0) + '</span>';
          title.appendChild(stats);
        });
      }).catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    normalizeContentImages();
    var list = document.getElementById('recent-list');
    if (list) {
      new MutationObserver(enhanceRecent).observe(list, { childList: true });
      enhanceRecent();
    }
  });
})();
