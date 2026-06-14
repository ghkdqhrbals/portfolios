---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /
---

안녕하세요. 백엔드 개발자 황보규민입니다.

운영 환경에서 마주친 병목, 장애 가능성, 데이터 정합성 문제를 정리해두는 개인 기록입니다. 나중에 다시 빠르게 찾아보고, 비슷한 문제를 겪는 사람에게 공유하기 위해 남깁니다.

단순한 사용법보다는 왜 문제가 생겼고, 어떤 기준으로 해결책을 골랐는지를 남기려고 합니다.

## Production

| Name | Description |
| - | - |
| [LidStay](https://ghkdqhrbals.github.io/LidStay/) | An easy-to-use macOS app that keeps your Mac awake with the lid closed, dims the display to reduce unnecessary power use, and supports auto-hotspot connect so remote sessions, long builds, and server tasks keep running without Amphetamine-style complexity. |

<div id="recent-root" class="recent-root" data-per-page="20">
	<div class="recent-toolbar">
		<div class="recent-meta"><span id="total-count">0</span> posts</div>
		<nav id="recent-pagination" class="recent-pagination" aria-label="Recent posts pagination"></nav>
	</div>
	<ul id="recent-list" class="recent-list"></ul>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

{% include recent_data.json.html %}
