---
layout: default
title: 개발 계획
nav_order: 200
description: "개발 계획"
---

# 개발 계획

| 시작 날짜      | 개발 내용                                                                                |
|:-----------|:-------------------------------------------------------------------------------------|
| 2022-11-18 | ~~Front html에서 웹소켓 열기~~                                                              |
| 2022-11-19 | ~~Front html에서 웹소켓 송/수신~~                                                            |
| 2022-11-22 | ~~Server → Front html 메시지 송신~~                                                       |
| 2022-12-09 | ~~Kafka 토픽 별 파티션 5개, replica 3개 설정~~                                                 |
| 2022-12-09 | ~~Kafka 브로커 3대 설정~~                                                                  |
| 2022-12-16 | ~~ChatServer 유저 채팅 시 Kafka user-chat 토픽에 삽입~~                                        |
| 2022-12-21 | ~~ChatServer register 시 Kafka user-add 토픽에 삽입~~                                      |
| 2022-12-22 | ~~API gateway location regex 설정~~                                                    |
| 2022-12-22 | ~~API gateway 생성~~                                                                   |
| 2022-12-24 | ~~API gateway → AuthServer 1대 연동~~                                                   |
| 2022-12-24 | ~~API gateway → ChatServer 2대 연동~~                                                   |
| 2022-12-28 | ~~전체 도커라이징~~                                                                         |
| 2022-12-29 | ~~Kafka → Logstash 설정~~                                                              |
| 2022-12-30 | ~~Logstash → Elastic Search 설정~~                                                     |
| 2023-01-01 | ~~Elastic Search → Kibana 설정~~                                                       |
| 2023-01-03 | ~~Kibana 그래프 구성~~                                                                    |
| 2023-01-03 | ~~RDB → Kafka CDC 관측 Debezium 설정~~                                                   |
| 2023-01-03 | ~~ELK 도커라이징~~                                                                        |
| 2023-01-05 | ~~Kafka 에 메세지 전송 시 메세지 스키마 설정~~                                                      |
| 2023-01-06 | ~~Kafka → Backup DB 컨슈머 JDBC Sink Connector 설정~~                                     |
| 2023-01-08 | ~~양방향 DB 동기화 설정~~                                                                    |
| 2023-01-08 | ~~Debezium/Sink connector 도커라이징~~                                                    |
| 2023-01-16 | ~~Kafka lag-backup 측정~~                                                              |
| 2023-01-16 | ~~Kafka lag-user change 측정~~                                                         |
| 2023-01-16 | ~~Golang Code의 http request 속도측정~~                                                   |
| 2023-01-17 | ~~Kafka replica 속도 측정~~                                                              |
| 2023-01-18 | ~~api gateway 프록시 패스 프로세서 확인~~                                                       |
| 2023-01-19 | ~~nginx 프로세서 확장~~                                                                    |
| 2023-01-19 | ~~인증서버 수평확장~~                                                                        |
| 2023-01-19 | ~~JPA batch 설정~~                                                                     |
| 2023-01-19 | ~~인증서버 → 인증DB 네트워크 로드 확인~~                                                           |
| 2023-01-19 | ~~단일 인증서버 CPU 사용률 확인~~                                                               |
| 2023-01-22 | ~~시퀀스 다이어그램 설계~~                                                                     |
| 2023-01-23 | ~~HTTP Benchmark 스레드 분할~~                                                            |
| 2023-01-23 | ~~예상 UI 설계~~                                                                         |
| 2023-01-24 | ~~프론트 서버 통신방법 설계~~                                                                   |
| 2023-01-24 | ~~프론트 서버 api gateway 연결~~                                                            |
| 2023-01-27 | ~~프론트 서버 UI 개발~~                                                                     |
| 2023-01-27 | ~~채팅DB 네트워크 로드 확인~~                                                                  |
| 2023-01-28 | ~~채팅 레코드 ID 내부 생성~~                                                                  |
| 2023-01-29 | ~~Postgres DB 병렬 프로세서 확장~~                                                           |
| 2023-01-30 | ~~채팅서버 2대 수평 확장~~                                                                    |
| 2023-01-30 | ~~쿼리 빈도 축소~~                                                                         |
| 2023-02-18 | ~~전체 도커라이징~~                                                                         |
| 2023-02-19 | ~~서킷 브레이커의 기본 개념~~                                                                   |
| 2023-02-21 | ~~ListenableFuture 사용현황~~                                                            |
| 2023-02-28 | ~~분산DB(Cassandra) 와 AP 시스템 이해~~                                                      |
| 2023-03-01 | ~~HTTP Benchmark Tool 제작~~                                                           |
| 2023-03-10 | ~~동시성 테스트를 위한 HTTP Benchmark Tool goroutine multithreading + Spring Boot Tomcat 설정~~ |
| 2023-03-14 | ~~Postgresql partitioning + FDW(Foreign Data Wrapper) 이해~~                           |
| 2023-03-15 | ~~Spring-Cloud(Security/Bus/Eureka) 구현~~                                             |
| 2023-04-01 | ~~CQRS and Event-Sourcing with MSA 구현~~                                              |
| 2023-04-16 | ~~NIO/Reactor-Model/Netty 아키텍처 이해~~                                                  |
| 2023-04-25 | ~~Kafka CDC 및 Netty 클라이언트 키 매핑-SinksMap~~                                            |
| 2023-04-30 | ~~주문서비스 Order 서비스/Product 서비스/Customer 서비스 간 이벤트 스키마 및 보상트랜젝션 설계~~                   |
| 2023-05-01 | ~~성능문제 해결~~ 및 캐시서버구축                                                                 |
| 2023-05-11 | ~~포트폴리오 개편(Github, Portfolio, CV, Homepage)~~                                        |


