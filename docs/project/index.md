---
layout: default
title: 📌 실시간 채팅서버 프로젝트
nav_order: 3
has_children: true
---

# **채팅 서버**
실시간 트래픽 관찰 및 안전성과 확장성을 고려한 Spring-Java 기반 채팅 백엔드/프론트 서버 프로젝트입니다 😊

* Github : [https://github.com/ghkdqhrbals/spring-chatting-server](https://github.com/ghkdqhrbals/spring-chatting-server)
* Deployed URL : [https://www.litcodev.com](https://www.litcodev.com)

<img src="../../assets/chat/1.png" alt="Image 1" width="200"><img src="../../assets/chat/2.png" alt="Image 2" width="200"><img src="../../assets/chat/3.png" alt="Image 3" width="200"><img src="../../assets/chat/4.png" alt="Image 4" width="200"><img src="../../assets/chat/1.png" alt="Image 5" width="200">

<details><summary> Project Modules </summary><div markdown="1">

1. `common-dto` : 에러 처리와 다양한 변수 및 dto들을 관리하는 모듈입니다.
2. `gateway-service` : Netty, (Spring-Cloud-Gateway) 통합 백엔드 엔트리를 제공하는 게이트웨이로써 JWT 토큰 검증 및 유저권한에 따라 백엔드에 엑세스를 허가해주는 모듈입니다.
3. `config-service` : 여러 설정파일들을 rabbitMQ와 actuator로 여러 서버에 전파하는 역할을 수행합니다.
4. `discovery-service` : Eureka 서버로 `gateway-service` 에게 로드밸런싱을 위한 서버 url 리스트를 반환해주는 역할을 수행합니다.
5. `docker-elk` : `엘라스틱 서치` + `로그 스태시` + `키바나` 를 병합하여 도커라이징 된 라이브러리로, `Kafka` 의 newUser 토픽을 읽어와 인덱스에 저장 및 그래프화 하는 모듈입니다.
6. `인증서버` : Undertow, JWT 토큰 발급 및 `채팅서버`와 `고객서버`에 유저 추가 이벤트를 Saga Orchestration 방식으로 전파하는 역할을 수행합니다.
7. `채팅서버` : Tomcat, 채팅서비스를 제공하는 서버입니다.
8. `고객서버` : Tomcat, 사용자의 계좌를 관리하는 서버입니다.
9. `주문서버` : (**Not set**) 사용자의 상품주문을 관리하는 서버입니다.
10. `상품서버` : (**Not set**) 상품목록을 관리하는 서버입니다.
11. `kafkaMQ` : `인증서버`, `고객서버`, `주문서버` 가 유저정보를 서로 전파받을 떄 사용됩니다. 또한 RDB 의 Backup를 생성할 때 사용되며 ELK 의 통계를 만들때 사용되는 백본망입니다.
12. `rabbitMQ` : Actuator 에 설정파일들을 실시간으로 전파할 떄 사용되는 메세지큐입니다.
13. `nginx` : (deprecated)
14. `Redis` : 이벤트 전송 상태를 저장할 때 사용하는 DB입니다.
15. `RDB` : (Postgres) AWS-RDS 및 localDB 를 사용하며, 주요서비스들의 데이터들을 저장합니다.

</div></details>


-----

## 1.  💡 아키텍처 변천사

<details><summary> V1 아키텍처 </summary><div markdown="1">

![img](../../assets/img/kafka/kafkaVersion.png)

</div></details>

<details><summary> V2, V3 아키텍처 </summary><div markdown="1">

![img](../../assets/img/es/final.png)

</div></details>

<details><summary> V4 아키텍처 </summary><div markdown="1">

![img](../../assets/img/msa/v3.1.0.png)

</div></details>

<details><summary> V5 아키텍처 </summary><div markdown="1">

![image](../../assets/img/msa/12.svg)

</div></details>


<details><summary> V5.3 아키텍처 </summary><div markdown="1">

<img width="880" alt="스크린샷 2023-12-15 오후 12 31 41" src="https://github.com/ghkdqhrbals/spring-chatting-server/assets/29156882/2652be5a-2d1c-4a7b-957b-d69aaa21007e">

</div></details>

------

## 2.  🔨 성능 이슈 해결 및 최적화 과정

성능 최적화 방법과 결과를 [link](https://github.com/ghkdqhrbals/spring-chatting-server/issues?q=is%3Aissue+label%3A%22feature%3A+performance%22+) 에 상세히 정리하였습니다! 이를 바탕으로 작성한 포스팅입니다. 

* [성능 최적화 과정 - 1](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-16-chatting(13)/) : **6가지 가설** 중, 도커 리소스 추가와 서버 수평 확장를 통한 성능 최적화 진행
> <details><summary> 6가지 가설 </summary><div markdown="1">
>
>  * [서버부하 툴의 속도문제] 문제였나? ❌
>  * [이벤트 흐름에서의 문제] 문제였나? ❌
>  * [백업 과정에서의 문제] 문제였나? ❌ 
>  * [과도한 replication 생성] 문제였나? ❌
>  * [제한된 CPU/MEMORY 리소스로 인한 문제] 문제였나? ✅
>  * [단일 인증 서버로 인한 병목현상] 문제였나? ✅
>
> </div></details>
* [성능 최적화 과정 - 2](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-17-chatting(15)/) : JPA-Batch를 통한 성능 최적화 진행
* [성능 최적화 과정 - 3](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-24-chatting(17)/) : JDBC-Batch 성능 그래프 확인
* [성능 최적화 과정 - 4](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-27-chatting(18)/) : **5가지 성능 개선 사안**들 및 적용된 값들 정리
> <details><summary> 5가지 성능 개선 사안 </summary><div markdown="1">
>
>  * [JDBC-Batch] before : 1 / after : 100
>  * [chatting_id 내부 자동 생성(네트워크 로드 감소)] before : from db sequence / after : random.UUID
>  * [db parallel processor 확장(db cpu 사용률 증가)] before : 1개 / after : 8개
>  * [쿼리 빈도 축소( sql 최적화 + lazy fetch )] before : 6번 / after : 4번
>  * [서버 수평 확장] before : 1대 / after : 2대
>
> </div></details>
* [성능 최적화 과정 - 5](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-03-05-chatting(21)/) : AWS-RDS 그래프 지표 관찰 및 db connection 증가를 통한 성능 최적화 진행
* [성능 최적화 과정 - 6](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-03-11-chatting(23)/) : 부하 테스트를 위한 툴 제작 및 실제 테스트 결과
* [성능 최적화 과정 - 7](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-03-16-chatting(25)/) : RDB 인덱싱 활성화를 통한 성능 최적화 진행
* [성능 최적화 과정 - 8](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-05-01-chatting(35)/) : **6가지 가설** 중, 이벤트 전송 스레드 증가를 통한 성능 최적화 진행
> <details><summary> 6가지 가설 </summary><div markdown="1">
>
> * [Undertow 의 적은 parellel thread] 문제였나? ❌
> * [Spring Security 의 토큰 확인 절차에서 발생할 수 있는 딜레이 문제] 문제였나? ❌
> * [이벤트 트랜젝션을 관리하는 Redis 저장 성능 문제] 문제였나? ❌
> * [CPU/Memory 부족] 문제였나? ✅
> * [적은 Kafka Producer 스레드 개수] 문제였나? ✅
> * [linger.ms 와 batch_size 문제] 문제였나? ❌
>
> </div></details>
* [성능 최적화 과정 - 9](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-12-21-chatting(40)/) : HPA(max 3), ReadinessProbe, CPU limit, EKS NodeGroup AutoScaling O(CPU usage 50%), Caching, 톰켓 최적화
> <details><summary> 개선된 지표확인 </summary><div markdown="1">
>
> | 지표 | 개선 이전 | 개선 이후 | 변화 |
> |------|-----------|-----------|------|
> | TPS 평균 | 109.27 | 312.16 | **185.68% 🟢** |
> | TPS p95 | 271.82 | 376.77 | **38.61% 🟢** |
> | TPS p99 | 298.47 | 415.61 | **39.25% 🟢** |
> | MTTFB 평균 | 1605.44 ms | 950.89 ms | **68.84% 🟢** |
> | MTTFB p95 | 24013.28 ms | 1322.11 ms | **1716.28% 🟢** |
> | MTTFB p99 | 27690.40 ms | 1833.22 ms | **1410.48% 🟢** |
> | MTTFB 차이 평균 | 2838.38 ms | 112.52 ms | **2422.56% 🟢** |
> | MTTFB 평균적인 변동률 | 75.00% | 10.67% | **602.91% 🟢** |
>
> </div></details>
* [성능 최적화 과정 - 10](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-12-29-chatting(41)/) : Nginx Ingress replicaSet=2~3
> <details><summary> 개선된 지표확인 </summary><div markdown="1">
>
> | 지표              | 개선 이전      | 개선 이후      | Change |
> | ----------------|------------|------------|-------|
> | TPS 평균         | 319.99     | 422.20     | **31.94% 🟢** |
> | TPS p95        | 376.77     | 497.80     | **32.12% 🟢** |
> | TPS p99        | 415.61     | 532.80     | **28.20% 🟢** |
> | MTTFB 평균       | 950.89 ms  | 709.86 ms  | **25.35% 🟢** |
> | MTTFB p95      | 1322.11 ms | 958.64 ms  | **27.49% 🟢** |
> | MTTFB p99      | 1833.22 ms | 1117.45 ms | **39.04% 🟢** |
> | MTTFB 차이 평균    | 112.52 ms  | 58.82 ms   | **47.72% 🟢** |
> | MTTFB 평균적인 변동률 | 10.67%     | 7.67%      | **28.12% 🟢** |
>
> </div></details>
* [성능 최적화 과정 - 11](https://ghkdqhrbals.github.io/portfolios/docs/project/2024-01-03-chatting(42)/) : RDB b-tree Long type PK indexing
> <details><summary> 개선된 지표확인 </summary><div markdown="1">
>
> | 지표 | 개선 이전 | 개선 이후 | Change        |
> |------|-----------|---------------|------|
> | TPS 평균 | 377.24 | 404.36 | **7.19% 🟢**  |
> | TPS p95 | 464.73 | 472.70 | **1.71% 🟢**  |
> | TPS p99 | 491.26 | 520.06 | **5.86% 🟢**  |
> | MTTFB 평균 | 496.27 ms | 456.42 ms | **8.73% 🟢**  |
> | MTTFB p95 | 882.81 ms | 799.67 ms | **10.4% 🟢**  |
> | MTTFB p99 | 1163.81 ms | 1130.67 ms | **2.93% 🟢**  |
> | MTTFB 차이 평균 | 106.51 ms | 74.02 ms | **43.89% 🟢** |
> | MTTFB 평균적인 변동률 | 20.77% | 15.27% | **36.02% 🟢** |
>
> </div></details>

------

## 3.  📕 프로젝트를 수행하기 위해 따로 공부 및 정리한 포스팅 
* [메세지큐 - 1](https://ghkdqhrbals.github.io/portfolios/docs/메세지큐/2022-12-01-message-queue/) : 메세지 큐의 장점과 단점 정리
* [메세지큐 - 2](https://ghkdqhrbals.github.io/portfolios/docs/메세지큐/2022-12-02-kafka/) : Kafka 용어정리 및 구조 파악 
* [마이크로서비스 - 1(EN)](https://ghkdqhrbals.github.io/portfolios/docs/msa/2022-09-05-micro-service-architecture2/) : 기본적인 MSA 의 장단점 및 이해 정리
* [마이크로서비스 - 2](https://ghkdqhrbals.github.io/portfolios/docs/msa/2022-09-04-micro-service-architecture1/) : SAGA 패턴에 대한 이해 정리 
* [마이크로서비스 - 3](https://ghkdqhrbals.github.io/portfolios/docs/msa/2023-03-22-msa1/) : DDD 에 대한 이해와 이벤트 롤백처리에 대한 이해 정리
* [마이크로서비스 - 4(EN)](https://ghkdqhrbals.github.io/portfolios/docs/msa/2022-05-30-msa-docker-kubernetes/) : Docker/Kubernetes 이해 정리
* [웹서버 - 1](https://ghkdqhrbals.github.io/portfolios/docs/Java/6/) : Netty 아키텍처 및 동작원리 정리 
* [웹서버 - 2](https://ghkdqhrbals.github.io/portfolios/docs/Java/5/) : JVM NIO 모델에서 Reactor 모델까지의 변천사 정리
* [스프링 - 1](https://ghkdqhrbals.github.io/portfolios/docs/Java/2/) : Spring-Webflux 정리
* [스프링 - 2](https://ghkdqhrbals.github.io/portfolios/docs/Java/3/) : Reactor 모델에서의 Spring-security 인가 설정 정리
* [엘라스틱서치 - 1](https://ghkdqhrbals.github.io/portfolios/docs/elasticSearch/2022-12-31-elastic-search/) : RDB 와 ElasticSearch 비교 정리
* [엘라스틱서치 - 2](https://ghkdqhrbals.github.io/portfolios/docs/elasticSearch/2023-01-01-elastic-search(2)/) : ElasticSearch 노드 운용 방법 정리
* [엘라스틱서치 - 3](https://ghkdqhrbals.github.io/portfolios/docs/elasticSearch/2023-01-02-elastic-search(3)/) : LogStash 와 Kibana 를 붙여 하나의 스택을 통한 시각화 과정 정리
* [관계형데이터베이스 - 1](https://ghkdqhrbals.github.io/portfolios/docs/데이터베이스/db1/) : 쿼리 최적화 방법 정리
* [관계형데이터베이스 - 2](https://ghkdqhrbals.github.io/portfolios/docs/데이터베이스/2022-11-20-DB-3/) : 데이터 정합성 이론 정리
* [Golang - 1](https://ghkdqhrbals.github.io/portfolios/docs/Go언어/2022-09-18-thread-goroutine/) : 부하 테스트 툴 제작 시 필요한 경량 스레드 구조 정리
* [Java - 1](https://ghkdqhrbals.github.io/portfolios/docs/Java/java3/) : 자바의 CompletableFure 을 통한 콜백/멀티스레딩 정리
* [Java - 2](https://ghkdqhrbals.github.io/portfolios/docs/Java/java1/) : 자바의 동기/비동기 Blocking/Non-blocking 정리
* [Git 컨벤션 - 1](https://accurate-allspice-e0a.notion.site/git-convention-9e8f78c9d33346bca965c30fb6537d5a) : Git 컨벤션 정리
* [JWT - 1](https://accurate-allspice-e0a.notion.site/jwt-2eb41c679cfe4fa4b5210594482b8025?pvs=4) : 토큰 저장 시 주의사항 및 구현 방식 정리

그 밖에 Reactor, R2DBC, Spring-WebFlux Transactional 처리, K8S, AWS, etc. 

## 4.  📗 프로젝트 진행 포스팅