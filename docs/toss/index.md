---
layout: default
title: 토스 러너스 하이 2기
nav_order: 2
has_children: false
nav_icon: /assets/Toss_Symbol_Primary.png
has_toc: false
---

# INTRODUCTION

이번에 토스 러너스 하이 2기 프로그램에 참여하게 되었고, 결과 발표 시점에 이전 직장에서 경영 악화로 개발 조직이 해체되는 상황을 겪었습니다. 현업 목표를 이어가기 어려워진 상황에서, 제가 선택한 최선은 이전 직장에서 실제로 겪었던 실무 문제를 다시 꺼내 정의하고 직접 해결해보는 것이었습니다. 이를 위해 "논문 주제 구독 서비스"를 개인 프로젝트로 진행하지만 프로덕트 자체가 목표는 아닙니다. 본 러너스 하이 2기 프로그램에서 설정한 제 개인적인 목표는 아래와 같습니다.

# GOALS

"Redis Stream을 메시징 큐로 사용하는 실무 환경을 재현하고, 당시 시간과 우선순위로 **끝까지 다루지 못했던 아래와 같은 문제들을 정의 및 해결하는 것**"

1. 단일 Stream 을 사용할 때 발생하는 Big Key 문제 해결을 위한 샤딩(=> 이걸로 메세지들의 순서를 보장하면서 동시성을 가져갈 수 있음. 원래는 단일 stream 에 멀티 consumer 붙여서 순서 없이 처리했었음 + length trimming)
2. stream grafana lag + 장애 모니터링(=> 이걸로 장애 감지 및 대응 자동화로 빠르게 문제를 해결가능)
3. 메세지 exactly-once & 재처리 전략 고도화(=> CDL, PDL, 트랜젝션 코디네이터 자제구현으로 장애 복구 및 데이터 정합성 유지 고도화 가능)

종합하면, 저는 **장애 감지/대응** 과 **확장 가능한 시스템**을 통해 운영 비용을 낮추는데 집중한 프로젝트를 진행할 것입니다

# TIMELINE

* 전체 아키텍처 셋업 및 프로덕트 최소기능 구현(이미 조금씩 만들었었던 기능들 가져와서 쓰기만 하면 됨) [1주차]
    * LLM 이중화 체크(ollama-local-gamma3 model 만 / openai api) 4h
    * 논문 오픈 엑세스 크롤링 배치 4h
    * 유저/구독 관리 8h
    * ngrok 포트포워딩 1m
    * LLM 에 서킷브레이커 셋업 8h
* 기술 구현 [1~4주차]
    * Redis Stream 샤딩 구현. + ACL + **eviction 안되도록** 24h
    * 메세지 재처리 전략, 트랜젝션 코디네이터 자제구현 16h
    * Grafana lag 모니터링 + 장애알림 셋업 24h+8h

# RESULTS

* 여기서 수치로 보여줄 수 있는 것은?
    * redis stream 문제 메세지를 찾기까지 걸리는 시간 비교
    * redis stream 클러스터 모드에서 샤딩 전후 동시성 처리성능 비교(순서가 상관없는 메세지들은 그냥 읽고 내부 병렬처리하면 크게 상관없음. 단, 순서가 중요한 메세지들은 샤딩 필수라 결국 단일 스레드 vs 멀티 스레드 비교가 될 듯)
    * llm 이중화 셋업 전후 실패율 비교(아마 당연히 llama 동시진행 수가 정해져있어서 오픈ai api fallback 이 자주 일어날 듯)

* 수치말고 직접 보여줄 수 있는 것은?
    * redis stream 샤딩 구조 다이어그램
    * grafana 모니터링 대시보드 link
    * 장애 알림 슬랙 알림 예시
    * 메세지 재처리 전략 다이어그램
    * 프로젝트 github repo link

## reference
* [LY Corporation Tech Blog](https://techblog.lycorp.co.jp/ko/building-a-messaging-queuing-system-with-redis-streams)
* [Deep Dive of BigKey and HotKey Issues in Redis, What They Are, How to Discover, How to Handle](https://dev.to/mrboogiej/deep-dive-of-bigkey-and-hotkey-issues-in-redis-what-they-are-how-to-discover-how-to-handle-4ldl)