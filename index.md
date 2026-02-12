---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /
guestbook_page: /guestbook/
guestbook_embed: true
---

안녕하세요. 백엔드 개발자 황보규민입니다.

이곳은 제가 실무에서 겪은 문제와 해결 과정, 그리고 그 속에서 얻은 인사이트를 기록하고 공유하는 공간입니다.

글 대부분은 다소 편안하고 자유로운 말투로 작성되었으며, 기록을 통해 지식을 체계화하고 나중에 다시 참고할 수 있는 자료로 남기고자 합니다.


<div id="recent-root" class="recent-root" data-per-page="20">
	<div class="recent-meta"><span id="total-count">0</span> posts</div>
	<ul id="recent-list" class="recent-list"></ul>
	<div class="recent-controls" aria-label="Recent posts controls">
		<button id="recent-more" type="button" class="gb-page-btn" style="display:none">More</button>
		<span id="recent-count" class="recent-count" style="display:none"></span>
	</div>
	<div id="guestbook-section" class="recent-guestbook">
		<div id="guestbook-status"></div>
		<form id="guestbook-form" class="guestbook-form">
			<div class="form-group gb-name">
				<input type="text" id="name" placeholder="Name" autocomplete="name" required class="form-input">
			</div>
			<div class="form-group gb-password">
				<input type="password" id="password" placeholder="Password" autocomplete="current-password" required class="form-input">
			</div>
			<div class="form-group gb-message">
				<textarea id="message" placeholder="Write a comment…" required class="form-input form-message" maxlength="500" aria-label="Comment" rows="1"></textarea>
			</div>
			<button type="submit" class="submit-btn">Post</button>
		</form>
		<div id="guestbook-list" class="guestbook-list"></div>
		<div id="guestbook-pagination" class="guestbook-pagination" aria-label="Guestbook pagination"></div>
	</div>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

{% include recent_data.json.html %}


