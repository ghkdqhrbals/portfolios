---
layout: default
title: Portfolio
nav_exclude: true
toc_sidebar: false
description: "Backend project portfolio"
permalink: /portfolio/
---

저는 **스스로 문제를 찾고 해결하는 사람**입니다.

운영 환경에서 병목, 장애 가능성, 반복 작업을 먼저 찾고, 다시 처리할 수 있고 관측 가능한 구조로 바꾸는 데 집중해왔습니다.

## 1. Redis Stream 메시지 큐 기반 알림 재처리

관련 기록: [Kafka 대신 Redis Stream 적용기]({{ site.baseurl }}/docs/Java/30/)  
프로젝트: FOODDASH

**문제 상황**  
주문 완료 흐름에서 PUSH -> SMS -> 알림톡 failover가 동기적으로 실행되어, 외부 API timeout이 주문 응답 지연으로 이어졌습니다. 대량 알림 배치와 주문 알림이 겹치면 timeout/retry가 증가했고, 서버 재시작이나 consumer 장애 시 미처리 알림을 복구할 기준도 부족했습니다.

**해결**  
주문 API는 알림 이벤트를 Redis Stream에 적재하고, 실제 전송은 Consumer Group이 비동기로 처리하도록 분리했습니다. PEL(Pending Entries List), `XAUTOCLAIM`/`XCLAIM`, consumer heartbeat, Redis Lock, DLQ/CDL 분리를 적용해 at-least-once 시맨틱 기반 재처리 구조를 만들었습니다. produce 유실 가능성은 outbox 테이블과 재적재 스케줄러로 보완했습니다.

**결과**  
주문 응답 흐름에서 외부 알림 지연을 제거했고, 서버 재시작 이후에도 ACK되지 않은 알림을 회수할 수 있게 했습니다. 대량 배치와 주문 시간대가 겹쳐도 주문 알림 흐름이 같이 무너지지 않도록 분리했고, 알림 누락을 0% 수준으로 안정화했습니다.

## 2. MySQL CDC -> MQ -> ETL -> MongoDB 동기화 파이프라인

관련 기록: [Mysql - Redis stream - Mongodb CDC + ETL setup]({{ site.baseurl }}/docs/Java/37/)  
프로젝트: FOODDASH

**문제 상황**  
주문, 메뉴, 스토어, 프랜차이즈, 약관, 회원 정보를 여러 테이블에서 조합해 조회해야 했습니다. MySQL에서 매번 멀티 쿼리와 join을 수행하면 대용량 실시간 조회 요구사항을 만족시키기 어려웠습니다.

**해결**  
Debezium Server로 MySQL binlog를 읽고 Redis Stream에 적재한 뒤, 별도 sink pod가 MongoDB 조회 문서로 upsert하도록 구성했습니다. 테이블별 Row와 MongoDB document mapping을 분리하고, `sinkInfo(mysqlId, franchiseCode, sinkedAt)`로 멀티프랜차이즈 데이터 충돌을 막았습니다. Redis 메모리 임계값과 Mongo bulk flush 구조로 sink 처리량도 제어했습니다.

**결과**  
join-heavy 조회를 MongoDB 조회 모델로 분리해 빠른 실시간 조회 구조를 만들었습니다. Redis 메모리 사용량은 4GB 수준에서 400MB 이하로 안정화했고, MongoDB upsert는 단건 1.3~1.5ms에서 100건 평균 27ms 수준으로 개선했습니다.

## 3. 대용량 멤버십 등급 갱신 배치 성능 개선

관련 기록: [배치 처리 성능 향상]({{ site.baseurl }}/docs/Java/20/)  
프로젝트: FOODDASH

**문제 상황**  
멤버십 등급 갱신 배치가 `offset limit` 기반으로 데이터를 읽고 있었습니다. offset이 커질수록 B-Tree 앞부분부터 계속 스캔해야 해서, 데이터가 뒤로 갈수록 조회 비용이 커지는 구조였습니다.

**해결**  
`offset limit` 조회를 sliding-window 방식의 id range 조회로 변경했습니다. connection pool을 10개에서 30개로 늘리고, chunk size를 100에서 5로 줄였으며, VirtualThread 기반 처리와 bulk update, 필요한 column만 조회하는 select query로 변경했습니다. id gap이 있어도 최대 user id까지 window를 이동하도록 처리했습니다.

**결과**  
회원 등급 갱신 배치를 19m13s에서 53s로 단축해 처리 시간을 약 95% 개선했습니다.
