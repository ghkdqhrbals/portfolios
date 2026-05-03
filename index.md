---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /
qa_assistant: true
---

안녕하세요. 백엔드 개발자 황보규민입니다.

이곳은 제가 실무에서 겪은 문제와 해결 과정, 그리고 그 속에서 얻은 인사이트를 기록하고 공유하는 공간입니다.

글 대부분은 다소 편안하고 자유로운 말투로 작성되었으며, 기록을 통해 지식을 체계화하고 나중에 다시 참고할 수 있는 자료로 남기고자 합니다.

<section class="blog-qa-shell">
  <div class="blog-qa-hero compact">
    <div class="blog-qa-copy">
      <h1>어떤 점이 궁금하신가요?</h1>
    </div>
  </div>

  <div class="blog-qa-status-strip">
    <div class="blog-qa-mini-status" id="blog-site-status-card">
      <span class="blog-qa-dot info" id="blog-site-status-dot" aria-hidden="true"></span>
      <span class="blog-qa-mini-text">Blog</span>
      <span class="blog-qa-mini-text subtle" id="blog-site-status-value">checking...</span>
    </div>
    <div class="blog-qa-mini-status" id="backend-status-card">
      <span class="blog-qa-dot info" id="backend-status-dot" aria-hidden="true"></span>
      <span class="blog-qa-mini-text">MCP-backend</span>
      <span class="blog-qa-mini-text subtle" id="backend-status-value">checking...</span>
    </div>
  </div>

  <div class="blog-qa-main">
    <form id="blog-qa-form">
      <label class="sr-only" for="blog-qa-question"></label>
      <div class="blog-qa-composer">
        <textarea id="blog-qa-question" class="form-input" rows="1" maxlength="1500" placeholder="궁금한 점을 남겨주세요" required></textarea>
        <button id="blog-qa-submit" type="submit" aria-label="질문 보내기">
          <span class="blog-qa-submit-label">➜</span>
        </button>
      </div>
    </form>
    <p class="blog-qa-note">질문 내용과 응답은 저장되지 않습니다. 편하게 아무거나 물어보세요!</p>

    <div id="blog-qa-status" style="display:none;"></div>
    <div id="blog-qa-result" aria-live="polite"></div>
  </div>
</section>

<div id="recent-root" class="recent-root" data-per-page="20">
	<div class="recent-meta"><span id="total-count">0</span> posts</div>
	<ul id="recent-list" class="recent-list"></ul>
	<nav id="recent-pagination" class="recent-pagination" aria-label="Recent posts pagination"></nav>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

{% include recent_data.json.html %}
