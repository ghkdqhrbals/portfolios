---
layout: default
title: Recent Posts
nav_order: 1
description: "Latest technical notes"
permalink: /
---

<div class="contact-inline">
	<span>
		<img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/solid/phone.svg" alt="phone" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		(+82) 10-5177-1967
	</span>
	<span>
		<img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/solid/envelope.svg" alt="email" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		<a href="mailto:ghkdqhrbals@gmail.com">ghkdqhrbals@gmail.com</a>
	</span>
	<span>
		<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="github" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		<a href="https://github.com/ghkdqhrbals">ghkdqhrbals</a>
	</span>
	<span>
		<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="linkedin" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		<a href="https://www.linkedin.com/in/gyumin-hwangbo-92382218b/">gyumin</a>
	</span>
</div>

안녕하세요. 2년차 주니어 백엔드 개발자 황보규민 입니다. 본 블로그는 제가 실무에서 겪은 기술적인 문제 해결 과정들을 기록하고 공유하는 공간입니다. 주로 Spring-Boot/Kotlin 기반의 백엔드 시스템 설계 및 개발, 운영 자동화, 테스트 코드 작성 등에 관한 내용을 다룹니다.

대부분 러프한 언어로 작성된 글이며 기록을 통해 제 지식을 정리하고, 나중에 다시 참고할 수 있는 자료로 만들고자 합니다.

부족한 점이 많지만, 지속적으로 배우고 성장하는 개발자가 되기 위해 노력하고 있습니다.

## RECENT POSTS

<div id="recent-root" class="recent-root" data-per-page="20">
	<ul id="recent-list" class="recent-list"></ul>
	<div class="recent-controls">
		<button id="recent-more" type="button" style="display:none">더 보기</button>
		<span id="recent-count" class="recent-count" style="display:none"></span>
	</div>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

<style>
	.recent-root{margin-top:8px}
	.recent-list{list-style:none;margin:0;padding:0;}
	.recent-list li{display:flex;gap:10px;align-items:center;padding:6px 4px;border-bottom:1px solid #eee;font-size:14px;}
	.recent-list li .r-date{width:78px;font-family:monospace;color:#666;font-size:12px;flex-shrink:0;}
	.recent-list li .r-title{flex:1;min-width:0;}
	.recent-list li .r-cat{margin-left:8px;display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;line-height:1;letter-spacing:.25px;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;}
	.recent-list li .r-parent{margin-left:6px;font-size:11px;color:#555;}
	.recent-list li a{flex:1;text-decoration:none;color:#111;}
	.recent-list li a:hover{text-decoration:underline;}
	#recent-more{margin:14px 0 4px;padding:8px 18px;border:1px solid #ccc;background:#fff;border-radius:4px;cursor:pointer;font-size:14px;}
	#recent-more:hover{background:#f5f5f5;}
	#recent-count{margin-left:12px;font-size:12px;color:#555;}
	.recent-empty{padding:24px 4px;color:#777;font-size:14px;}
</style>

{% include recent_data.json.html %}


