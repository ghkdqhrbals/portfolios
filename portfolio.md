---
layout: default
title: Portfolio
nav_exclude: true
toc_sidebar: false
description: "Backend project portfolio"
permalink: /portfolio/
---

저는 **스스로 문제를 찾고 해결하는 사람**입니다.

운영 환경에서 이미 드러난 장애만 처리하기보다, 병목이 생길 지점과 장애가 반복될 지점을 먼저 찾고, 다시 처리할 수 있고, 관측할 수 있고, 다음 배포부터 같은 일을 반복하지 않아도 되는 구조를 만드는 데 관심이 많습니다.

이 문서는 경력 기술서가 아니라, 제가 어떤 문제를 발견했고 어떤 기준으로 해결책을 골랐으며 최종적으로 어떤 결과를 만들었는지 보여주는 프로젝트 기록입니다. 자세한 경력 정보는 [About Me]({{ site.baseurl }}/cv/)에 따로 정리해두었습니다.

## PROJECT

* [Redis Stream 메시지 큐 기반 알림 재처리]({{ site.baseurl }}/docs/Java/30/) (FOODDASH)
  * 왜 만들었나
    * 주문 완료 흐름 안에서 PUSH -> SMS -> 알림톡 순서의 외부 알림 failover가 동기적으로 실행되고 있었습니다. 각 외부 API timeout을 5초로 잡으면 최악의 경우 주문 응답이 최대 15초까지 밀릴 수 있는 구조였습니다.
    * 특히 대량 알림 배치가 주문 시간대와 맞물리면 외부 Push API 호출과 서버 처리량이 동시에 몰려 timeout이 발생했습니다. 즉시성이 필요한 주문 알림과 대량 배치 알림이 같은 처리 흐름에 묶여 있으면, 배치 부하가 주문 응답 지연과 알림 누락 가능성으로 번지는 구조였습니다.
    * 알림 전송은 주문 데이터 저장과 달리 외부 서비스 장애, timeout, retry, 서버 재시작의 영향을 크게 받습니다. 메인 주문 흐름에 그대로 두면 주문 응답 지연과 알림 누락 가능성이 동시에 생겼습니다.
    * Amazon Kafka도 검토했지만, 당시 알림 시스템은 엄격한 순서 보장이나 장기 디스크 보관보다 빠른 처리와 낮은 운영 비용이 더 중요했습니다. 기존 Redis 인프라를 사용하면서 메시지 큐를 구성할 수 있는 Redis Stream이 요구사항에 맞았습니다.
  * 어떻게 만들었나
    * 주문 처리 로직은 알림 이벤트를 Redis Stream에 적재하고, 실제 외부 알림 전송은 별도 consumer가 Consumer Group으로 읽어 처리하도록 분리했습니다. 주문 API는 외부 Push API의 지연을 직접 기다리지 않게 만들었습니다.
    * consumer가 `XREADGROUP`으로 메시지를 가져가면 Redis Stream의 PEL(Pending Entries List)에 처리 중인 메시지로 남습니다. ACK 전 서버가 죽거나 예외가 나면 메시지가 PEL에 남기 때문에, 이를 재처리 기준으로 삼았습니다.
    * 일정 idle time이 지난 PEL 메시지는 `XPENDING`, `XAUTOCLAIM`/`XCLAIM`으로 다른 살아있는 consumer가 회수하도록 구성했습니다. 이 흐름으로 at-least-once 시맨틱 기반의 알림 재처리를 지원했습니다.
    * Redis Stream의 `XINFO CONSUMERS` idle 값만으로는 consumer 생존 여부를 정확히 판단하기 어렵기 때문에, consumer heartbeat를 `key + TTL`과 `Set`으로 별도 관리했습니다. 이벤트가 없어서 idle이 증가한 정상 consumer와 실제 죽은 consumer를 구분하기 위해서입니다.
    * 실패 이벤트가 특정 consumer에만 몰리지 않도록 `min(hash(eventId + consumerId))` 기준으로 담당 consumer를 정했습니다. consumer 추가/삭제 중 같은 이벤트를 동시에 처리할 수 있는 구간은 Redis Lock으로 막았습니다.
    * 재시도 횟수가 임계값을 넘는 메시지는 계속 재처리하지 않고 CDL/DLQ 성격의 별도 스트림으로 분리했습니다. 정상 메시지 흐름과 악성 메시지 흐름을 분리해 무한 재시도로 큐가 막히지 않게 했습니다.
  * 결과
    * 주문 응답 흐름에서 외부 알림 전송 지연을 제거하고, 알림 처리는 Redis Stream 메시지 큐 기반 비동기 구조로 분리했습니다.
    * 서버 재시작이나 consumer 장애가 발생해도 ACK되지 않은 메시지를 PEL 기준으로 다시 회수할 수 있게 되어, 미처리 알림 복구 경로가 생겼습니다.
    * 대량 알림 배치와 주문 시간대가 겹치는 상황에서도 주문 알림 처리 흐름이 같이 무너지지 않도록 분리했고, 알림 누락을 0% 수준으로 안정화했습니다.
    * Kafka를 도입하지 않고도 당시 요구사항에 맞는 빠른 메시지 처리, 낮은 인프라 비용, 장애 후 재처리 구조를 확보했습니다.

* [MySQL CDC -> MQ -> ETL -> MongoDB 동기화 파이프라인]({{ site.baseurl }}/docs/Java/37/) (FOODDASH)
  * 왜 만들었나
    * 멀티프랜차이즈 환경에서는 주문, 메뉴, 스토어, 프랜차이즈, 약관, 회원 상세 정보처럼 여러 테이블을 조합해 조회해야 하는 화면과 API가 많았습니다. MySQL에서 매번 멀티 쿼리와 join을 수행하면 대용량 실시간 조회 요구사항을 만족시키기 어렵다고 판단했습니다.
    * 단순 통계 배치가 아니라, 조회 모델을 MongoDB 문서로 역정규화해 빠르게 읽고 싶었습니다. 또한 향후 MongoDB를 주문 정보의 주요 조회 저장소로 전환할 가능성도 있었기 때문에, 정기 배치보다 CDC 기반 동기화 파이프라인이 더 맞았습니다.
    * 요구사항의 핵심은 "데이터를 많이 읽어야 하고, 빠르게 조회되어야 하며, 여러 테이블에 걸친 주문/메뉴 도메인을 하나의 조회 모델로 합쳐야 한다"였습니다.
  * 어떻게 만들었나
    * Debezium Server가 MySQL binlog를 읽고 변경 이벤트를 JSON payload로 Redis Stream에 적재하도록 구성했습니다. Kafka 없이 Debezium Server -> Redis Stream 구조로 만들었습니다.
    * Redis Stream -> MongoDB sink connector가 없었기 때문에, 별도 sink pod를 만들어 Stream 메시지를 읽고 MongoDB에 upsert/remove하는 ETL 모듈을 구현했습니다.
    * 테이블별 Row data class와 MongoDB domain document를 분리했습니다. Debezium의 `before`/`after` payload를 Row로 파싱하고, 각 `SinkConnector`가 테이블별 mapping, upsert key, remove key를 책임지도록 구성했습니다.
    * MongoDB 문서에는 `sinkInfo(mysqlId, franchiseCode, sinkedAt)`를 넣어 같은 MySQL id라도 프랜차이즈별로 격리되도록 했습니다. 멀티프랜차이즈 환경에서 같은 id가 다른 브랜드 데이터와 충돌하지 않게 하기 위한 기준입니다.
    * 초기 적재는 Debezium snapshot으로 처리하고, 이후 추가되는 테이블은 incremental snapshot 전략을 고려했습니다. binlog offset과 schema history는 Redis에 저장해 Debezium Server 재시작 이후에도 이어서 처리할 수 있게 했습니다.
    * Redis Stream key를 하드코딩하지 않고 `mysql_sink.*` 같은 prefix를 주기적으로 조회해 동적으로 구독하도록 했습니다. 테이블이 늘어날 때마다 sink read 설정을 수동으로 추가하는 부담을 줄이기 위해서입니다.
    * sink 처리 속도가 Redis Stream 적재 속도를 따라가지 못하면 Redis 메모리가 커지기 때문에 `maxmemory`, `noeviction`, `debezium.sink.redis.memory.limit.mb=512`, `threshold=85` 기준으로 binlog -> Redis 구간의 유량을 제어했습니다.
    * MongoDB upsert를 메시지 단건마다 수행하면 네트워크 round-trip과 ACK/delete 오버헤드가 커졌습니다. `stream -> 100 read -> buffer -> Mongo bulk flush + Redis bulk ack/delete` 구조로 바꾸고, 100개가 차지 않아도 1초마다 flush하도록 했습니다.
  * 결과
    * MySQL의 join-heavy 조회를 MongoDB 조회 문서로 분리해, 주문/메뉴/회원처럼 여러 테이블에 걸친 데이터를 빠르게 읽을 수 있는 구조를 만들었습니다.
    * 기존 DB에 무거운 조회 부하를 계속 주지 않고, CDC로 동기화된 별도 조회 모델에서 읽는 구조를 확보했습니다.
    * Redis 메모리가 4GB까지 증가하며 eviction 위험이 있던 상태를 512MB limit/85% threshold 설정 이후 400MB 이하 수준으로 안정화했습니다.
    * 단건 처리 1.3~1.5ms 수준이던 MongoDB upsert 흐름을 100건 평균 27ms 수준으로 줄여, 건당 약 0.27ms의 bulk 처리 구조로 개선했습니다. 결과적으로 약 5배 빠른 sink 처리가 가능해졌습니다.
    * 단순 성능 최적화가 아니라, 향후 조회 저장소 전환 가능성까지 고려한 MySQL CDC -> MQ -> ETL -> MongoDB 동기화 아키텍처를 운영 가능한 형태로 만들었습니다.

* [멀티프랜차이즈 백엔드 운영 자동화]({{ site.baseurl }}/docs/Java/25/) (FOODDASH)
  * 왜 만들었나
    * 교촌을 포함한 멀티프랜차이즈 서비스에서는 주문/결제/멤버십이라는 공통 흐름은 같지만, 브랜드별 정책과 기능 차이가 계속 생깁니다. 공통 로직과 브랜드별 차이를 분리하지 않으면 같은 기능을 여러 번 수정하고, 배포 때마다 실수할 가능성이 커집니다.
    * 브랜드가 늘어날수록 배포 대상 모듈, 설정값, 운영 환경, 승인 절차가 복잡해졌습니다. 단순 수동 배포로는 변경 범위를 놓치거나, 공통 모듈 변경 후 파생 모듈 배포를 누락할 수 있었습니다.
    * 회원/주문 데이터 이관, 브랜드별 staging/production 배포, 공통 모듈 변경 영향 전파처럼 반복되지만 실수하면 운영 영향이 큰 작업을 자동화해야 했습니다.
  * 어떻게 만들었나
    * 브랜드 공통 도메인과 브랜드별 확장 지점을 분리했습니다. 공통 모듈 변경 시 영향을 받는 하위 모듈을 같이 배포 목록에 넣고, 특정 하위 모듈만 바뀐 경우에는 해당 모듈만 배포되도록 변경 감지 기반 deploy list를 구성했습니다.
    * staging 배포는 변경 감지를 기반으로 빠르게 검증하고, production 배포는 수동 승인 단계를 거치도록 분리했습니다. 빠른 피드백과 운영 안전성을 동시에 가져가기 위한 구조입니다.
    * GitHub Actions에서 빌드 대상 모듈을 계산하고, Jib 기반 이미지 빌드/푸시, Kubernetes rollout 상태 확인, Slack 알림을 연결했습니다. 단순히 `kubectl apply`가 끝나는 것이 아니라 pod rollout 성공/실패까지 확인하도록 했습니다.
    * rollout이 timeout되거나 image pull/runtime 문제가 발생하면 Slack으로 실패를 알리도록 구성했습니다. 배포 스크립트가 성공했는데 실제 pod가 정상 기동하지 않는 상황을 놓치지 않기 위해서입니다.
  * 결과
    * 브랜드별 차이가 늘어나도 공통 로직을 재사용하고, 변경된 모듈과 영향받는 모듈을 기준으로 배포 범위를 계산할 수 있게 됐습니다.
    * staging 자동 검증과 production 수동 승인 흐름을 분리해, 빠른 배포와 운영 안전성을 함께 확보했습니다.
    * Kubernetes rollout 상태를 배포 파이프라인에서 추적해, 배포 명령 성공과 실제 서비스 기동 성공을 분리해서 볼 수 있게 했습니다.
    * 자담 위메프오 서비스 이관 같은 회원/주문 데이터 마이그레이션 이후에도 운영 이슈를 안정화하며, 멀티프랜차이즈 백엔드 운영을 자동화 가능한 구조로 정리했습니다.

* [대용량 멤버십 등급 갱신 배치 성능 개선]({{ site.baseurl }}/docs/Java/20/) (FOODDASH)
  * 왜 만들었나
    * 멤버십 등급 갱신은 많은 회원을 대상으로 매월 반복 실행되는 배치였습니다. 처리 시간이 길어질수록 운영자가 결과를 기다리는 시간이 길어지고, 배치 실패 시 재실행 부담도 커졌습니다.
    * 기존 구조는 `offset limit` 기반으로 데이터를 읽고 있었습니다. offset이 커질수록 B-Tree 시작 지점부터 offset 위치까지 계속 스캔해야 하므로, 뒤쪽 데이터를 읽을수록 조회 비용이 커지는 구조였습니다.
    * 대량 회원 데이터를 다루는 배치는 단순히 "돌아간다"가 아니라, 제한된 시간 안에 안정적으로 끝나야 운영 가능한 작업이라고 판단했습니다.
  * 어떻게 만들었나
    * `offset limit` 조회를 sliding-window 방식의 id range 조회로 변경했습니다. 매번 앞쪽 데이터를 건너뛰는 대신, id 범위를 이동시키며 필요한 구간만 읽도록 바꿨습니다.
    * connection pool을 10개에서 30개로 늘리고, step 실행 chunk size를 100에서 5로 줄여 더 많은 작업 단위가 병렬로 처리되도록 조정했습니다.
    * 커널 스레드 기반 처리에서 VirtualThread 기반 처리로 전환했습니다. Reader 내부에 `ThreadLocal` list를 오래 들고 있는 방식은 피하고, `read()` 메서드 내부 stack에서 필요한 데이터만 처리한 뒤 즉시 반환하도록 바꿨습니다.
    * update query는 bulk 처리로 묶고, select query는 등급 갱신에 필요한 column만 조회하도록 줄였습니다. DB round-trip과 불필요한 데이터 로딩 비용을 함께 줄이기 위한 변경이었습니다.
    * id가 중간에 비어 있는 경우에도 최대 user id까지 window를 계속 이동하도록 처리했습니다. rollback이나 sequence 선할당으로 id gap이 생기는 실제 운영 데이터를 고려한 방식입니다.
  * 결과
    * 100만 명 이상 회원 등급 갱신 배치를 19m13s에서 53s로 단축했습니다.
    * 처리 시간 기준 약 95.4% 개선했고, 기존 대비 약 21배 빠른 배치 처리 결과를 냈습니다.
    * 병목 원인이 단순 CPU 문제가 아니라 조회 방식, chunk 크기, connection pool, thread 모델, query shape가 함께 얽힌 문제임을 확인하고 각각을 분리해 개선했습니다.
    * 반복 실행되는 운영 배치를 더 짧은 시간 안에 끝낼 수 있게 만들어, 실패 대응과 재실행 부담을 줄였습니다.
