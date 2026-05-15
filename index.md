---
layout: default
title: Recent Posts
nav_exclude: true
description: "Latest technical notes"
permalink: /
---

안녕하세요. 백엔드 개발자 황보규민입니다.

이곳은 실무에서 직접 마주했던 문제들과, 그 문제를 해결하기 위해 고민했던 과정들을 기록하는 공간입니다. 단순히 기술을 소개하거나 사용 방법을 정리하는 데서 끝나는 것이 아니라, 실제 운영 환경 속에서 왜 이런 문제가 발생했는지, 어떤 선택지를 비교했는지, 그리고 어떤 트레이드오프 끝에 현재의 구조를 선택하게 되었는지를 중심으로 정리하고 있습니다.

주로 대규모 트래픽 환경에서의 메시징 시스템, 분산 처리, 데이터 흐름, 샤딩, 이벤트 기반 아키텍처, 운영 안정성, 모니터링과 같은 주제에 관심을 가지고 있습니다. 특히 Redis Streams, Kafka, CDC, Consumer Rebalancing, Ordering, Idempotency 같은 영역은 실무에서도 자주 고민했고, 개인적으로도 계속 깊게 탐구하고 있는 분야입니다.

또한 이 공간은 단순한 실무 기록만을 위한 곳은 아닙니다. 실무를 하며 자연스럽게 생긴 “정말 이 방식이 최선일까?”, “대규모 시스템에서는 실제로 어떻게 해결할까?”, “이 구조는 어디까지 확장 가능할까?” 같은 호기심들을 따라가며 깊게 파고든 내용들도 함께 정리하고 있습니다. 기술 문서, 오픈소스 PR, KIP, 실제 기업 사례, 운영 경험 등을 찾아보며 이해한 내용들을 최대한 제 언어로 재구성하려고 노력하고 있습니다.

글의 말투는 비교적 편안하고 자유로운 편입니다. 다만 내용만큼은 단순한 요약보다는 실제 문제 해결 과정과 사고 흐름이 드러나도록 작성하려고 합니다. 때로는 실패했던 접근이나 설계 과정에서의 고민도 그대로 남겨두는데, 그런 기록들이 오히려 이후에 더 큰 도움이 된다고 생각하기 때문입니다.

기술은 빠르게 변하지만, 문제를 바라보는 방식과 시스템을 설계하는 사고 과정은 오래 남는다고 생각합니다. 이 공간 역시 단순한 기록 저장소를 넘어, 시간이 지나 다시 돌아봤을 때 현재의 고민과 선택들을 추적할 수 있는 개인적인 아카이브이자, 비슷한 문제를 고민하는 누군가에게 작은 힌트라도 줄 수 있는 공간이 되었으면 합니다.

<div id="recent-root" class="recent-root" data-per-page="20">
	<div class="recent-meta"><span id="total-count">0</span> posts</div>
	<ul id="recent-list" class="recent-list"></ul>
	<nav id="recent-pagination" class="recent-pagination" aria-label="Recent posts pagination"></nav>
	<noscript>
		{% include recent_list.html %}
	</noscript>
</div>

{% include recent_data.json.html %}
