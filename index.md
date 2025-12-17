---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /
---

안녕하세요. 백엔드 개발자 황보규민입니다.

이곳은 제가 실무에서 겪은 문제와 해결 과정, 그리고 그 속에서 얻은 인사이트를 기록하고 공유하는 공간입니다.
글 대부분은 다소 편안하고 자유로운 말투로 작성되었으며,
기록을 통해 지식을 체계화하고 나중에 다시 참고할 수 있는 자료로 남기고자 합니다.

아직 부족한 점이 많지만,
특별한 목적보다는 재미있게 실험하고, 문제를 해결하며, 그 경험에서 배운 점들을 나누는 데 초점을 두고 있습니다.


<div id="recent-root" class="recent-root terminal-output" data-per-page="20">
	<div class="terminal-prompt">
		<span class="prompt">gyumin@blog</span><span class="path"></span>% ls -al --color=auto recent_posts/
	</div>
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
	.social-links {
		display: flex;
		gap: 16px;
		justify-content: center;
		margin: 24px 0 32px;
	}
	.social-links a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #f1f5f9;
		transition: all 0.2s ease;
		border: none !important;
		text-decoration: none !important;
	}
	.social-links a:hover {
		background: #e2e8f0;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		text-decoration: none !important;
	}
	.social-icon {
		width: 20px;
		height: 20px;
		filter: grayscale(1) brightness(0.4);
		transition: filter 0.2s ease;
	}
	.social-links a:hover .social-icon {
		filter: grayscale(0) brightness(1);
	}
	
	.terminal-header {
		background: #f8f9fa;
		color: #2d3748;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		padding: 10px 14px;
		border-radius: 6px 6px 0 0;
		font-size: 13px;
		border: 1px solid #e2e8f0;
		border-bottom: none;
		letter-spacing: 0.3px;
	}
	.terminal-header .prompt {
		color: #10b981;
		font-weight: normal;
	}
	.terminal-header .path {
		color: #0a66c2;
		font-weight: bold;
	}
	.terminal-output {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 0 0 6px 6px;
		padding: 14px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		color: #374151;
		font-size: 13px;
		line-height: 1.2;
	}
	.terminal-header-line {
		color: #6b7280;
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
		color: #374151;
		line-height: 1.2;
	}
	.recent-list li::before {
		display: none !important;
		content: none !important;
	}
	.recent-list li .r-perm {
		color: #6b7280;
		font-size: 12px;
		width: 75px;
		flex-shrink: 0;
	}
	.recent-list li .r-links {
		color: #6b7280;
		font-size: 12px;
		width: 12px;
		text-align: right;
		flex-shrink: 0;
	}
	.recent-list li .r-user {
		color: #6b7280;
		font-size: 12px;
		width: 55px;
		flex-shrink: 0;
	}
	.recent-list li .r-group {
		color: #6b7280;
		font-size: 12px;
		width: 45px;
		flex-shrink: 0;
	}
	.recent-list li .r-size {
		color: #6b7280;
		font-size: 12px;
		width: 35px;
		text-align: right;
		flex-shrink: 0;
	}
	.recent-list li .r-date {
		color: #6b7280;
		font-size: 12px;
		white-space: nowrap;
		width: 75px;
		flex-shrink: 0;
	}
	/* .recent-list li .r-title {
		flex: 1;
		min-width: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #374151;
	}
	.recent-list li .r-title a {
		text-decoration: none !important;
		color: #0a66c2 !important;
		font-weight: normal;
		display: inline;
		border-bottom: none !important;
		background-image: none !important;
		box-shadow: none !important;
	} */
	/* .recent-list li .r-title a:hover {
		color: #2563eb !important;
		text-decoration: underline !important;
		text-decoration-thickness: 2px !important;
		text-underline-offset: 2px !important;
		border-bottom: none !important;
	} */
	.terminal-prompt {
		margin-top: 12px;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.terminal-prompt .prompt {
		color: #10b981;
	}
	.terminal-prompt .path {
		color: #0a66c2;
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
		color: #374151;
		transition: color 0.15s;
	}
	#recent-more:hover {
		color: #111827;
		background: transparent;
		box-shadow: none;
	}
	#recent-count {
		margin-left: 12px;
		font-size: 12px;
		color: #6b7280;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
	}
	.recent-empty {
		padding: 12px 0;
		color: #6b7280;
		font-size: 13px;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
	}
</style>

{% include recent_data.json.html %}


