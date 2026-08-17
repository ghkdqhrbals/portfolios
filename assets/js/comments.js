(function () {
  'use strict';

  var widget = document.getElementById('comments-widget');
  if (!widget) return;

  var commentsList = document.getElementById('comments-list');
  var messageEl = document.getElementById('comments-message');
  var createForm = document.getElementById('comment-form');
  var apiBase = '/api/comments';
  var postPath = normalizePostPath(widget.getAttribute('data-post-path') || window.location.pathname || '/');

  var hiddenClass = 'comments-form-hidden';

  function normalizePostPath(value) {
    var normalized = (value || '').trim();
    if (!normalized) return '/';
    if (normalized === '/portfolios') return '/';
    if (normalized.indexOf('/portfolios/') === 0) {
      normalized = normalized.slice('/portfolios'.length);
    }
    return normalized.charAt(0) === '/' ? normalized : '/' + normalized;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function setMessage(message, isError) {
    if (!messageEl) return;
    messageEl.textContent = message || '';
    messageEl.className = isError ? 'comments-message comments-message--error' : 'comments-message';
  }

  function formatDate(value) {
    if (!value) return '';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function createElement(tag, className) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    return node;
  }

  function createInput(options) {
    var container = createElement('label', 'comment-form__field');
    var text = document.createElement('span');
    text.textContent = options.label;
    var input = options.type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');

    input.name = options.name;
    input.type = options.type || 'text';
    input.className = options.inputClass || 'comment-form__input';
    if (options.required) input.required = true;
    if (options.type !== 'textarea' && options.maxLength) input.maxLength = options.maxLength;
    if (options.type === 'textarea' && options.maxLength) input.maxLength = options.maxLength;
    if (options.rows) input.rows = options.rows;
    if (options.placeholder) input.placeholder = options.placeholder;
    if (typeof options.minLength === 'number') input.minLength = options.minLength;
    input.value = options.value || '';

    container.appendChild(text);
    container.appendChild(input);
    return container;
  }

  function createToggleButton(label, kind, commentId) {
    var button = createElement('button', 'comment-action-btn');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('data-action', 'toggle-' + kind);
    button.setAttribute('data-kind', kind);
    button.setAttribute('data-comment-id', String(commentId));
    return button;
  }

  function createInlineForm(kind, commentId) {
    var form = createElement('form', 'comments-inline-form');
    form.setAttribute('data-kind', kind);
    form.setAttribute('data-comment-id', String(commentId));
    form.classList.add(hiddenClass);

    if (kind === 'edit') {
      form.appendChild(createInput({
        label: '수정 비밀번호',
        name: 'password',
        type: 'password',
        required: true,
        maxLength: 64,
        minLength: 4,
        placeholder: '등록 시 사용한 비밀번호'
      }));
      form.appendChild(createInput({
        label: '관리자 비밀번호 (선택)',
        name: 'admin_password',
        type: 'password',
        maxLength: 64,
        placeholder: '관리자용 비밀번호'
      }));
      form.appendChild(createInput({
        label: '수정 닉네임',
        name: 'nickname',
        type: 'text',
        maxLength: 40,
        placeholder: '변경할 닉네임 (선택)'
      }));
      form.appendChild(createInput({
        label: '수정 내용',
        name: 'body',
        type: 'textarea',
        required: true,
        rows: 4,
        maxLength: 5000,
        placeholder: '수정할 댓글 내용을 입력하세요.'
      }));
      var editButton = createElement('button', 'comment-form__submit');
      editButton.type = 'submit';
      editButton.textContent = '수정';
      form.appendChild(editButton);
      return form;
    }

    if (kind === 'delete') {
      form.appendChild(createInput({
        label: '삭제 비밀번호',
        name: 'password',
        type: 'password',
        required: true,
        maxLength: 64,
        minLength: 4,
        placeholder: '등록 시 사용한 비밀번호'
      }));
      form.appendChild(createInput({
        label: '관리자 비밀번호 (선택)',
        name: 'admin_password',
        type: 'password',
        maxLength: 64,
        placeholder: '관리자용 비밀번호'
      }));
      var deleteButton = createElement('button', 'comment-form__submit');
      deleteButton.type = 'submit';
      deleteButton.textContent = '삭제';
      form.appendChild(deleteButton);
      return form;
    }

    if (kind === 'report') {
      form.appendChild(createInput({
        label: '신고 사유',
        name: 'reason',
        type: 'textarea',
        rows: 3,
        maxLength: 300,
        placeholder: '신고 사유를 입력하세요. 비워도 됩니다.'
      }));
      var reportButton = createElement('button', 'comment-form__submit');
      reportButton.type = 'submit';
      reportButton.textContent = '신고 접수';
      form.appendChild(reportButton);
      return form;
    }

    return form;
  }

  function renderComment(item) {
    var commentId = String(item.id || '');
    var li = createElement('li', 'comment-item');
    li.setAttribute('data-comment-id', commentId);

    var header = createElement('div', 'comment-item__header');
    var nickname = createElement('span', 'comment-item__nickname');
    nickname.textContent = item.nickname || '익명';
    var createdAt = createElement('time', 'comment-item__time');
    createdAt.textContent = formatDate(item.created_at);
    createdAt.dateTime = item.created_at || nowIso();
    var updatedAt = item.updated_at && item.updated_at !== item.created_at
      ? createElement('span', 'comment-item__updated')
      : null;
    if (updatedAt) {
      updatedAt.textContent = ' (수정됨)';
    }
    header.appendChild(nickname);
    header.appendChild(createdAt);
    if (updatedAt) header.appendChild(updatedAt);

    var body = createElement('pre', 'comment-item__body');
    body.textContent = item.body || '';

    var actions = createElement('div', 'comment-item__actions');
    actions.appendChild(createToggleButton('수정', 'edit', commentId));
    actions.appendChild(createToggleButton('삭제', 'delete', commentId));
    actions.appendChild(createToggleButton('신고', 'report', commentId));

    var editForm = createInlineForm('edit', commentId);
    var deleteForm = createInlineForm('delete', commentId);
    var reportForm = createInlineForm('report', commentId);
    editForm.querySelector('textarea[name="body"]').value = item.body || '';

    li.appendChild(header);
    li.appendChild(body);
    li.appendChild(actions);
    li.appendChild(editForm);
    li.appendChild(deleteForm);
    li.appendChild(reportForm);

    return li;
  }

  function setHiddenForm(form, isHidden) {
    if (!form) return;
    if (isHidden) {
      form.classList.add(hiddenClass);
    } else {
      form.classList.remove(hiddenClass);
    }
  }

  function clearMessage() {
    setMessage('', false);
  }

  async function safeJsonResponse(response) {
    var text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (_error) {
      return {};
    }
  }

  async function request(endpoint, options) {
    var response = await fetch(endpoint, options);
    var payload = await safeJsonResponse(response);
    if (!response.ok) {
      throw new Error((payload && payload.error) || ('요청 실패: ' + response.status));
    }
    return payload;
  }

  async function loadComments() {
    try {
      var result = await request(apiBase + '?post_path=' + encodeURIComponent(postPath), {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      });
      var comments = (result && result.items) || [];
      commentsList.textContent = '';
      if (!comments.length) {
        var empty = createElement('li', 'comment-empty');
        empty.textContent = '아직 댓글이 없습니다.';
        commentsList.appendChild(empty);
        return;
      }

      comments.forEach(function (comment) {
        commentsList.appendChild(renderComment(comment));
      });
      clearMessage();
    } catch (error) {
      setMessage(error.message || '댓글 목록을 불러오지 못했습니다.', true);
    }
  }

  function collectFormValue(form, key) {
    var field = form.querySelector('[name="' + key + '"]');
    return field ? field.value : '';
  }

  async function onCreateSubmit(event) {
    event.preventDefault();
    var nickname = collectFormValue(createForm, 'nickname');
    var password = collectFormValue(createForm, 'password');
    var body = collectFormValue(createForm, 'body');

    if (!nickname || !password || !body) {
      setMessage('닉네임, 비밀번호, 댓글 내용을 모두 입력해주세요.', true);
      return;
    }

    try {
      await request(apiBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          post_path: postPath,
          nickname: nickname.trim(),
          password: password,
          body: body.trim()
        })
      });

      createForm.reset();
      setMessage('댓글이 등록되었습니다.');
      await loadComments();
    } catch (error) {
      setMessage(error.message || '댓글 등록에 실패했습니다.', true);
    }
  }

  async function onEditSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var commentId = form.getAttribute('data-comment-id');
    var password = collectFormValue(form, 'password');
    var adminPassword = collectFormValue(form, 'admin_password');
    var body = collectFormValue(form, 'body');
    if ((!password && !adminPassword) || !body) {
      setMessage('비밀번호(또는 관리자 비밀번호)와 내용을 모두 입력해주세요.', true);
      return;
    }

    try {
      await request(apiBase + '/' + encodeURIComponent(commentId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          password: password,
          body: body.trim(),
          nickname: collectFormValue(form, 'nickname').trim(),
          admin_password: collectFormValue(form, 'admin_password')
        })
      });

      setMessage('댓글이 수정되었습니다.');
      await loadComments();
    } catch (error) {
      setMessage(error.message || '댓글 수정에 실패했습니다.', true);
    }
  }

  async function onDeleteSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var commentId = form.getAttribute('data-comment-id');
    var password = collectFormValue(form, 'password');
    var adminPassword = collectFormValue(form, 'admin_password');
    if (!password && !adminPassword) {
      setMessage('비밀번호(또는 관리자 비밀번호)를 입력해주세요.', true);
      return;
    }

    try {
      await request(apiBase + '/' + encodeURIComponent(commentId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          password: password,
          admin_password: adminPassword
        })
      });

      setMessage('댓글이 삭제되었습니다.');
      await loadComments();
    } catch (error) {
      setMessage(error.message || '댓글 삭제에 실패했습니다.', true);
    }
  }

  async function onReportSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var commentId = form.getAttribute('data-comment-id');
    var reason = collectFormValue(form, 'reason').trim();
    if (!reason) {
      reason = '신고 이유 미입력';
    }

    try {
      await request(apiBase + '/' + encodeURIComponent(commentId) + '/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          reason: reason
        })
      });

      setMessage('신고가 접수되었습니다. 확인 후 처리하겠습니다.');
      setHiddenForm(form, true);
    } catch (error) {
      setMessage(error.message || '신고 접수에 실패했습니다.', true);
    }
  }

  widget.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches('[data-action^="toggle-"]')) return;

    var kind = target.getAttribute('data-kind');
    var commentId = target.getAttribute('data-comment-id');
    if (!kind || !commentId) return;

    var form = widget.querySelector('form[data-kind="' + kind + '"][data-comment-id="' + commentId + '"]');
    if (!form) return;

    var isHidden = form.classList.contains(hiddenClass);
    setHiddenForm(form, !isHidden);
  });

  widget.addEventListener('submit', function (event) {
    if (!(event.target instanceof HTMLFormElement)) return;
    event.preventDefault();

    var target = event.target;
    if (target === createForm) {
      onCreateSubmit(event);
      return;
    }

    var kind = target.getAttribute('data-kind');
    if (kind === 'edit') {
      onEditSubmit(event);
      return;
    }
    if (kind === 'delete') {
      onDeleteSubmit(event);
      return;
    }
    if (kind === 'report') {
      onReportSubmit(event);
      return;
    }
  });

  loadComments();
})();
