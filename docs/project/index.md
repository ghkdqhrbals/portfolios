---
layout: default
title: 실시간 채팅서버 프로젝트
nav_order: 3
has_children: true
---


# **채팅 백엔드 서버** [개발과정](https://ghkdqhrbals.github.io/categories/%EC%B1%84%ED%8C%85%EC%84%9C%EB%B2%84-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/){: .btn .btn-primary .fs-3 .mb-4 .mb-md-0 .mr-2 } [Github](https://github.com/ghkdqhrbals/spring-chatting-server){: .btn .btn-black .fs-3 .mb-4 .mb-md-0 } [설명 및 시연영상](https://www.youtube.com/watch?v=3VqwZ17XyEQ&t=625s){: .btn .btn-red .fs-3 .mb-4 .mb-md-0 }
* **개요** : Spring-Java 기반 실시간 채팅 백엔드 서버입니다
* **기간** : 2022.10 ~ 2023.01 (4개월)
* **인원** : 1인

| 사용기술                         | 내용                                                                                                          |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------|
| ELK stack                    | Elastic Search + Logstash + Kibana 를 통한 통계수집/시각화 [Image](https://ghkdqhrbals.github.io/assets/img/es/5.png) |
| Kafka                        | 3대의 Broker과 replica들을 통한 안전성 및 확장성 제공                                                                       |
| Debezium/JDBC-Sink-connector | Kafka를 통한 백업 DB uni-directional sync [Details](https://ghkdqhrbals.github.io/posts/chatting(9)/)            |
| Docker                       | 서버/DB/Kafka/Connector/ELK/Monitoring/etc. 실행 자동화                                                            |
| Nginx                        | API gateway로써 채팅서버 및 인증서버를 묶어서 통합 RestApi entry point 제공                                                    |
| Stomp                        | 채팅 실시간성 제공                                                                                                  |
| JPA                          | 영속성을 활용한 DB 관리                                                                                              |

* **아키텍처**
  ![image](../../assets/images/v3.1.0.png)
