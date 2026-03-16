---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /en/
guestbook_page: /guestbook/
guestbook_embed: true
---

[한국어 버전](/)

Hi, I'm Gyumin Hwangbo, a backend developer.

This is a space where I document real-world problems I faced, how I solved them, and the insights I gained along the way.

Most posts are written in a relaxed, conversational tone. I aim to systematize knowledge through documentation and keep it as a reference I can revisit later.


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

