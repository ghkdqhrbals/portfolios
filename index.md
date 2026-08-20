---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /
toc_sidebar: false
---

<div id="recent-root" class="recent-root" data-per-page="20">
	<div class="recent-toolbar">
		<div><p class="recent-eyebrow">ARCHIVE</p><h2 id="recent-posts" class="recent-heading">Recent Posts</h2><p class="recent-meta"><span id="total-count">0</span> notes</p></div>
		<nav id="recent-pagination" class="recent-pagination" aria-label="Recent posts pagination"></nav>
	</div>
	<ul id="recent-list" class="recent-list"></ul>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

{% include recent_data.json.html %}
