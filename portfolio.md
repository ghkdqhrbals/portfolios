---
layout: default
title: Portfolio
nav_order: 1.05
toc_sidebar: false
description: "황보규민의 백엔드 포트폴리오. FOODDASH 알림 시스템 재설계, 100만 회원 배치 처리 시간 95.4% 단축, CDC 데이터 파이프라인 개선."
permalink: /portfolio/
---

# 백엔드 포트폴리오

**황보규민 | Backend Engineer**<br>
FOODDASH, 2024.04 ~ 2025.11

주문, 결제, 멤버십 서비스를 개발하고 운영했습니다. 외부 알림 장애가 주문 응답에 영향을 주지 않도록 구조를 바꾸고, 대용량 배치와 데이터 동기화의 병목을 개선했습니다.

**운영한 서비스 규모**

- 월 주문 **100만 건**, 연 거래액 **1,500억 원 이상**
- 회원 **600만 명 이상**, MAU **77만 명**, 전체 서비스 피크 **4,000 RPS**
- 교촌치킨, 자담, 읍천리 등 여러 프랜차이즈의 주문, 결제, 멤버십 서비스

[CV]({{ '/cv/' | relative_url }}) / [GitHub](https://github.com/ghkdqhrbals) / [이메일](mailto:ghkdqhrbals@gmail.com)

## 1. Redis Streams 기반 알림 시스템 재설계

**외부 알림 전송을 주문 응답에서 분리하고, 서버 재시작 이후에도 미처리 알림을 회수할 수 있도록 개선했습니다.**

<picture>
  <source media="(max-width: 600px)" srcset="{{ '/assets/portfolio/notification-flow-mobile.svg' | relative_url }}">
  <img src="{{ '/assets/portfolio/notification-flow.svg' | relative_url }}" alt="알림 구조 개선 전후. 기존에는 주문 처리 안에서 외부 알림을 기다렸고, 개선 후에는 Redis Streams에 이벤트를 적재한 뒤 응답하며 Consumer Group이 전송과 복구를 담당합니다." width="900" height="440" loading="lazy">
</picture>

대량 알림 배치와 실시간 주문 알림이 겹칠 때 외부 Push API의 타임아웃과 재시도가 주문 응답 지연으로 이어졌습니다. 소비자가 종료되면 처리 중이던 알림을 복구할 기준도 필요했습니다.

**제가 바꾼 것**

- 테크 리드로 Redis Streams 도입을 주도하고, 주문 API의 이벤트 발행과 Consumer Group의 외부 전송을 분리했습니다.
- Outbox와 재적재 스케줄러로 발행 실패를 보완했습니다.
- PEL에서 ACK되지 않은 메시지를 추적하고, `XCLAIM`과 `XAUTOCLAIM`으로 미처리 알림을 회수하도록 구성했습니다.
- 활성 소비자별로 복구 작업을 분배하고, 메시지별 Redis Lock으로 동시 처리를 제어했습니다. 재시도 한도를 넘긴 메시지는 DLQ로 격리했습니다.

**결과:** 외부 API 지연이 주문 응답을 붙잡던 경로를 제거했습니다. 소비자 장애와 재시작 이후의 복구 경로를 만들고, 반복 실패 메시지를 따로 관리할 수 있게 했습니다.

<details>
<summary>당시 작성한 재처리 흐름도</summary>
<p><a href="{{ '/assets/30/2025-05-04-02-10-55.png' | relative_url }}" target="_blank" rel="noopener"><img src="{{ '/assets/30/2025-05-04-02-10-55.png' | relative_url }}" alt="실패 이벤트의 대기 시간, 재시도 횟수, 담당 소비자와 Redis Lock을 확인한 뒤 재처리 또는 DLQ로 분기하는 실제 설계 흐름도" width="3184" height="3840" loading="lazy"></a></p>
<p>이미지를 누르면 원본을 크게 볼 수 있습니다.</p>
</details>

[설계와 구현 기록: Kafka 대신 Redis Stream 적용기]({{ '/docs/Java/30/' | relative_url }})

## 2. 100만 회원 멤버십 배치 처리 시간 95.4% 단축

**회원 등급 갱신 시간을 19분 13초에서 53초로 줄였습니다.**

<picture>
  <source media="(max-width: 600px)" srcset="{{ '/assets/portfolio/batch-comparison-mobile.svg' | relative_url }}">
  <img src="{{ '/assets/portfolio/batch-comparison.svg' | relative_url }}" alt="100만 회원 등급 갱신 배치의 처리 시간 비교. 개선 전 19분 13초, 개선 후 53초로 95.4% 단축했습니다." width="900" height="270" loading="lazy">
</picture>

데이터의 뒤쪽으로 갈수록 OFFSET 조회의 스캔 비용이 커지는 병목을 분석했습니다. 조회 방식과 처리 단위를 함께 조정했습니다.

**제가 바꾼 것**

- `OFFSET LIMIT` 조회를 슬라이딩 윈도 방식의 ID 범위 조회로 변경했습니다. 중간 ID가 비어 있어도 최대 ID까지 처리하도록 구성했습니다.
- 필요한 컬럼만 조회하고 업데이트 쿼리는 일괄 처리했습니다.
- 커넥션 풀을 10개에서 30개로 늘리고, 청크 크기를 100에서 5로 조정했습니다. Virtual Threads를 적용해 동시 처리를 개선했습니다.

**결과:** 같은 100만 회원 대상 배치에서 실행 시간을 **1,153초 → 53초**로, 총 **1,100초** 줄였습니다.

[측정 결과와 구현 기록: 배치 처리 성능 향상]({{ '/docs/Java/20/' | relative_url }})

## 3. CDC 데이터 동기화의 메모리 사용량과 처리 성능 개선

**Redis 메모리를 피크 4GB에서 400MB 이하로 안정화하고, 일괄 처리로 건당 처리 시간을 약 5배 개선했습니다.**

![유량 제어 적용 전후의 실제 Redis 메모리 모니터링 그래프. 설정 전 약 4GB까지 상승하던 사용량이 설정 후 400MB 이하로 유지되며 선택 시점에는 372.7MB로 표시됩니다.]({{ '/assets/37/2025-09-26-02-48-29.png' | relative_url }})

*당시 기록한 Redis 메모리 그래프. [원본 보기]({{ '/assets/37/2025-09-26-02-48-29.png' | relative_url }})*

주문, 메뉴 등 여러 테이블의 데이터를 실시간 조회 모델로 옮기기 위해 **MySQL → Debezium → Redis Streams → ETL → MongoDB** 파이프라인을 설계하고 운영했습니다. 이벤트 유입이 소비보다 빠르면 Redis 메모리가 증가하고, MongoDB에 단건으로 반영하는 구간이 병목이 됐습니다.

**제가 바꾼 것**

- Redis 메모리 제한을 설정하고, Debezium의 512MB 제한과 85% 임계값으로 적재 유량을 제어했습니다.
- 메시지 100건을 모아 MongoDB에 반영하고 Redis ACK와 삭제도 일괄 처리했습니다. 100건이 차지 않으면 1초 주기로 반영하도록 구성했습니다.
- 프랜차이즈 코드와 MySQL ID를 조회 문서에 함께 보관해 브랜드별 데이터를 구분했습니다.

**결과**

- Redis 메모리: **피크 4GB → 400MB 이하**
- MongoDB 반영 처리: **단건 1.3~1.5ms → 100건 평균 약 27ms**, 건당 환산 **약 0.27ms**
- 여러 테이블을 조합하던 조회를 MongoDB 조회 모델로 분리했습니다.

[관측 그래프와 구현 기록: MySQL, Redis Streams, MongoDB CDC + ETL]({{ '/docs/Java/37/' | relative_url }})
