---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /en/
toc_sidebar: false
---

[한국어 버전](/)

This is a space where I document real-world problems I faced, how I solved them, and the insights I gained along the way.

Most posts are written in a relaxed, conversational tone. I aim to systematize knowledge through documentation and keep it as a reference I can revisit later.


<div id="recent-root" class="recent-root" data-per-page="20">
	<div><p class="recent-eyebrow">ARCHIVE</p><h2 id="recent-posts" class="recent-heading">Recent Posts</h2><p class="recent-meta"><span id="total-count">0</span> notes</p></div>
	<ul id="recent-list" class="recent-list"></ul>
	<nav id="recent-pagination" class="recent-pagination" aria-label="Recent posts pagination"></nav>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

{% include recent_data.json.html %}
