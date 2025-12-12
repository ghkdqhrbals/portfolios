---
layout: default
title: Recent Posts
nav_exclude: true
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

안녕하세요. 백엔드 개발자 황보규민입니다.

이곳은 제가 실무에서 겪은 문제와 해결 과정, 그리고 그 속에서 얻은 인사이트를 기록하고 공유하는 공간입니다.
글 대부분은 다소 편안하고 자유로운 말투로 작성되었으며,
기록을 통해 지식을 체계화하고 나중에 다시 참고할 수 있는 자료로 남기고자 합니다.

아직 부족한 점이 많지만,
특별한 목적보다는 재미있게 실험하고, 문제를 해결하며, 그 경험에서 배운 점들을 나누는 데 초점을 두고 있습니다.

<div class="terminal-header">
	<span class="prompt">gyumin@blog</span><span class="path"></span>% ls -lh --color=auto recent_posts/
</div>

<div id="recent-root" class="recent-root terminal-output" data-per-page="20">
	<div class="terminal-header-line">total <span id="total-count">0</span></div>
	<ul id="recent-list" class="recent-list"></ul>
	<div class="recent-controls">
		<div class="terminal-prompt">
			<span class="prompt">gyumin@blog</span>% <button id="recent-more" type="button" style="display:none">next</button>
		</div>
		<span id="recent-count" class="recent-count" style="display:none"></span>
	</div>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

<style>
	.terminal-header {
		background: #0c0c0c;
		color: #c0c0c0;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		padding: 10px 14px;
		border-radius: 6px 6px 0 0;
		font-size: 13px;
		border: 1px solid #2a2a2a;
		border-bottom: none;
		letter-spacing: 0.3px;
	}
	.terminal-header .prompt {
		color: #4ae54a;
		font-weight: normal;
	}
	.terminal-header .path {
		color: #5599ff;
		font-weight: bold;
	}
	.terminal-output {
		background: #0c0c0c;
		border: 1px solid #2a2a2a;
		border-radius: 0 0 6px 6px;
		padding: 14px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
		color: #c0c0c0;
		font-size: 13px;
		line-height: 1.2;
	}
	.terminal-header-line {
		color: #888;
		margin-bottom: 8px;
		font-size: 13px;
	}
	.recent-root {
		margin-top: 0;
	}
	.recent-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.recent-list li {
		display: flex;
		align-items: baseline;
		gap: 6px;
		padding: 0;
		font-size: 13px;
		color: #c0c0c0;
		line-height: 1.2;
	}
	.recent-list li::before {
		display: none !important;
		content: none !important;
	}
	.recent-list li .r-perm {
		color: #888;
		font-size: 12px;
		width: 75px;
		flex-shrink: 0;
	}
	.recent-list li .r-links {
		color: #888;
		font-size: 12px;
		width: 12px;
		text-align: right;
		flex-shrink: 0;
	}
	.recent-list li .r-user {
		color: #888;
		font-size: 12px;
		width: 55px;
		flex-shrink: 0;
	}
	.recent-list li .r-group {
		color: #888;
		font-size: 12px;
		width: 45px;
		flex-shrink: 0;
	}
	.recent-list li .r-size {
		color: #888;
		font-size: 12px;
		width: 35px;
		text-align: right;
		flex-shrink: 0;
	}
	.recent-list li .r-date {
		color: #888;
		font-size: 12px;
		white-space: nowrap;
		width: 75px;
		flex-shrink: 0;
	}
	.recent-list li .r-title {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.recent-list li a {
		text-decoration: none;
		color: #5599ff;
		font-weight: normal;
		display: inline-block;
	}
	.recent-list li a:hover {
		color: #66aaff;
		text-decoration: underline;
	}
	.terminal-prompt {
		margin-top: 12px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.terminal-prompt .prompt {
		color: #4ae54a;
	}
	.terminal-prompt .path {
		color: #5599ff;
		font-weight: bold;
	}
	#recent-more {
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		font-size: 13px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		color: #c0c0c0;
		transition: color 0.15s;
	}
	#recent-more:hover {
		color: #fff;
		background: transparent;
		box-shadow: none;
	}
	#recent-count {
		margin-left: 12px;
		font-size: 12px;
		color: #666;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
	}
	.recent-empty {
		padding: 12px 0;
		color: #666;
		font-size: 13px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
	}
</style>

{% include recent_data.json.html %}


