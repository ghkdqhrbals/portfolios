(function () {
  'use strict';

  var widget = document.getElementById('comments-widget');
  if (!widget) return;

  var list = document.getElementById('comments-list');
  var message = document.getElementById('comments-message');
  var createForm = document.getElementById('comment-form');
  var postLikeButton = document.getElementById('post-like-button');
  var apiBase = '/api/comments';
  var postPath = normalizePath(widget.getAttribute('data-post-path') || window.location.pathname);
  var hiddenClass = 'comments-form-hidden';

  function normalizePath(value) {
    var path = (value || '/').trim();
    if (path === '/portfolios') return '/';
    if (path.indexOf('/portfolios/') === 0) path = path.slice(11);
    return path.charAt(0) === '/' ? path : '/' + path;
  }

  function element(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function setMessage(text, isError) {
    message.textContent = text || '';
    message.className = isError ? 'comments-message comments-message--error' : 'comments-message';
  }

  function value(form, name) {
    var field = form.querySelector('[name="' + name + '"]');
    return field ? field.value : '';
  }

  function dateText(value) {
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? value || '' : date.toLocaleString('ko-KR');
  }

  function field(label, name, type, options) {
    options = options || {};
    var wrapper = element('label', 'comment-form__field');
    var caption = element('span');
    caption.textContent = label;
    var input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    input.name = name;
    if (type !== 'textarea') input.type = type || 'text';
    input.className = type === 'textarea' ? 'comment-form__textarea' : 'comment-form__input';
    if (options.required) input.required = true;
    if (options.minLength) input.minLength = options.minLength;
    if (options.maxLength) input.maxLength = options.maxLength;
    if (options.rows) input.rows = options.rows;
    input.placeholder = options.placeholder || '';
    if (options.value) input.value = options.value;
    wrapper.appendChild(caption);
    wrapper.appendChild(input);
    return wrapper;
  }

  function inlineForm(kind, id, item) {
    var form = element('form', 'comments-inline-form ' + hiddenClass);
    form.dataset.kind = kind;
    form.dataset.commentId = id;
    if (kind !== 'report') {
      form.appendChild(field('비밀번호', 'password', 'password', {
        required: true, minLength: 4, maxLength: 64, placeholder: '등록 시 사용한 비밀번호'
      }));
    }
    if (kind === 'edit') {
      form.appendChild(field('닉네임', 'nickname', 'text', {
        maxLength: 40, placeholder: '닉네임', value: item.nickname || ''
      }));
      form.appendChild(field('내용', 'body', 'textarea', {
        required: true, maxLength: 5000, rows: 3, value: item.body || ''
      }));
    }
    if (kind === 'report') {
      form.appendChild(field('신고 사유', 'reason', 'textarea', {
        maxLength: 300, rows: 2, placeholder: '신고 사유를 입력하세요.'
      }));
    }
    var submit = element('button', 'comment-form__submit');
    submit.type = 'submit';
    submit.textContent = kind === 'edit' ? '수정' : kind === 'report' ? '신고' : '삭제';
    form.appendChild(submit);
    return form;
  }

  function render(item) {
    var id = String(item.id || '');
    var li = element('li', 'comment-item');
    li.dataset.commentId = id;

    var header = element('div', 'comment-item__header');
    var author = element('span', 'comment-item__nickname');
    author.textContent = item.nickname || '익명';
    var time = element('time', 'comment-item__time');
    time.textContent = dateText(item.created_at);
    time.dateTime = item.created_at || '';
    header.appendChild(author);
    header.appendChild(time);

    var menuWrap = element('div', 'comment-item__menu');
    var menuButton = element('button', 'comment-menu-button');
    menuButton.type = 'button';
    menuButton.textContent = '...';
    menuButton.setAttribute('aria-label', '댓글 메뉴');
    menuButton.dataset.action = 'menu';
    menuButton.dataset.commentId = id;
    var menu = element('div', 'comment-menu ' + hiddenClass);
    ['edit', 'delete', 'report'].forEach(function (kind) {
      var action = element('button', 'comment-menu__item');
      action.type = 'button';
      action.dataset.action = kind;
      action.dataset.commentId = id;
      action.textContent = kind === 'edit' ? '수정' : kind === 'delete' ? '삭제' : '신고';
      menu.appendChild(action);
    });
    menuWrap.appendChild(menuButton);
    menuWrap.appendChild(menu);
    header.appendChild(menuWrap);

    var bodyNode = element('pre', 'comment-item__body');
    bodyNode.textContent = item.body || '';
    var likeButton = element('button', 'comment-like-button');
    likeButton.type = 'button';
    likeButton.dataset.action = 'like';
    likeButton.dataset.commentId = id;
    likeButton.dataset.liked = item.liked ? 'true' : 'false';
    likeButton.setAttribute('aria-pressed', item.liked ? 'true' : 'false');
    likeButton.textContent = '좋아요 ' + String(item.like_count || 0);
    li.appendChild(header);
    li.appendChild(bodyNode);
    li.appendChild(likeButton);
    li.appendChild(inlineForm('edit', id, item));
    li.appendChild(inlineForm('delete', id, item));
    li.appendChild(inlineForm('report', id, item));
    return li;
  }

  async function json(response) {
    var text = await response.text();
    try { return text ? JSON.parse(text) : {}; } catch (_) { return {}; }
  }

  async function request(endpoint, options) {
    var response = await fetch(endpoint, options);
    var payload = await json(response);
    if (!response.ok) throw new Error(payload.error || ('요청 실패: ' + response.status));
    return payload;
  }

  async function load() {
    try {
      var result = await request(apiBase + '?post_path=' + encodeURIComponent(postPath), {
        headers: { Accept: 'application/json' }
      });
      list.textContent = '';
      var items = result.items || [];
      if (!items.length) {
        var empty = element('li', 'comment-empty');
        empty.textContent = '아직 댓글이 없습니다.';
        list.appendChild(empty);
      } else {
        items.forEach(function (item) { list.appendChild(render(item)); });
      }
      setMessage('', false);
    } catch (error) {
      setMessage(error.message || '댓글 목록을 불러오지 못했습니다.', true);
    }
  }

  function updatePostLike(result) {
    if (!postLikeButton) return;
    postLikeButton.dataset.liked = result.liked ? 'true' : 'false';
    postLikeButton.setAttribute('aria-pressed', result.liked ? 'true' : 'false');
    postLikeButton.textContent = '좋아요 ' + String(result.like_count || 0);
  }

  async function loadPostLike() {
    if (!postLikeButton) return;
    try {
      var result = await request('/api/likes?post_path=' + encodeURIComponent(postPath), { headers: { Accept: 'application/json' } });
      updatePostLike(result);
    } catch (error) { setMessage(error.message || '좋아요를 불러오지 못했습니다.', true); }
  }

  async function submitCreate(event) {
    event.preventDefault();
    var submitButton = createForm.querySelector('button[type="submit"]');
    if (submitButton && submitButton.disabled) return;
    var nickname = value(createForm, 'nickname').trim();
    var password = value(createForm, 'password');
    var body = value(createForm, 'body').trim();
    if (!nickname || !password || !body) {
      setMessage('닉네임, 비밀번호, 댓글 내용을 모두 입력해주세요.', true);
      return;
    }
    if (submitButton) submitButton.disabled = true;
    try {
      await request(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ post_path: postPath, nickname: nickname, password: password, body: body })
      });
      createForm.reset();
      setMessage('댓글이 등록되었습니다.', false);
      await load();
    } catch (error) {
      setMessage(error.message || '댓글 등록에 실패했습니다.', true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  async function submitInline(event, form) {
    event.preventDefault();
    var id = form.dataset.commentId;
    var kind = form.dataset.kind;
    try {
      if (kind === 'delete') {
        if (!value(form, 'password')) throw new Error('비밀번호를 입력해주세요.');
        await request(apiBase + '/' + encodeURIComponent(id), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ password: value(form, 'password') })
        });
        setMessage('댓글이 삭제되었습니다.', false);
      } else if (kind === 'edit') {
        await request(apiBase + '/' + encodeURIComponent(id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            password: value(form, 'password'),
            nickname: value(form, 'nickname').trim(),
            body: value(form, 'body').trim()
          })
        });
        setMessage('댓글이 수정되었습니다.', false);
      } else if (kind === 'report') {
        await request(apiBase + '/' + encodeURIComponent(id) + '/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ reason: value(form, 'reason').trim() })
        });
        setMessage('신고가 접수되었습니다.', false);
      }
      await load();
    } catch (error) {
      setMessage(error.message || '요청에 실패했습니다.', true);
    }
  }

  widget.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) return;
    var id = target.dataset.commentId;
    if (!id) return;
    var item = target.closest('.comment-item');
    if (!item) return;
    if (target.dataset.action === 'like') {
      if (target.disabled) return;
      target.disabled = true;
      request(apiBase + '/' + encodeURIComponent(id) + '/like', {
        method: 'POST', headers: { Accept: 'application/json' }
      }).then(function (result) {
        target.dataset.liked = result.liked ? 'true' : 'false';
        target.setAttribute('aria-pressed', result.liked ? 'true' : 'false');
        target.textContent = '좋아요 ' + String(result.like_count || 0);
      }).catch(function (error) {
        setMessage(error.message || '댓글 좋아요 처리에 실패했습니다.', true);
      }).finally(function () {
        target.disabled = false;
      });
      return;
    }
    if (target.dataset.action === 'menu') {
      item.querySelector('.comment-menu').classList.toggle(hiddenClass);
      return;
    }
    if (['edit', 'delete', 'report'].indexOf(target.dataset.action) !== -1) {
      item.querySelector('.comment-menu').classList.add(hiddenClass);
      item.querySelectorAll('.comments-inline-form').forEach(function (form) {
        form.classList.add(hiddenClass);
      });
      item.querySelector('form[data-kind="' + target.dataset.action + '"]').classList.remove(hiddenClass);
    }
  });

  widget.addEventListener('submit', function (event) {
    if (!(event.target instanceof HTMLFormElement)) return;
    if (event.target === createForm) submitCreate(event);
    else submitInline(event, event.target);
  });

  if (postLikeButton) {
    postLikeButton.addEventListener('click', function () {
      if (postLikeButton.disabled) return;
      postLikeButton.disabled = true;
      request('/api/likes?post_path=' + encodeURIComponent(postPath), {
        method: 'POST', headers: { Accept: 'application/json' }
      }).then(updatePostLike).catch(function (error) {
        setMessage(error.message || '좋아요 처리에 실패했습니다.', true);
      }).finally(function () {
        postLikeButton.disabled = false;
      });
    });
  }

  load();
  loadPostLike();
})();
