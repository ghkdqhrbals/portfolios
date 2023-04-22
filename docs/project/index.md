---
layout: default
title: 📌 실시간 채팅서버 프로젝트
nav_order: 2
has_children: true
---

# **채팅 서버**

Kafka와 ELK stack을 통해 실시간 트래픽 관찰 및 안전성과 확장성을 고려한 Spring-Java 기반 채팅 백엔드/프론트 서버 프로젝트입니다.

<details><summary>채팅 서버 내용</summary><div markdown="1">



### 사용기술

| 사용기술                         | 내용                                                                                                          |
|:-----------------------------|:------------------------------------------------------------------------------------------------------------|
| ELK stack                    | Elastic Search + Logstash + Kibana 를 통한 통계수집/시각화 [Image](https://ghkdqhrbals.github.io/assets/img/es/5.png) |
| Kafka                        | 3대의 Broker과 replica들을 통한 안전성 및 확장성 제공                                                                       |
| Debezium/JDBC-Sink-connector | Kafka를 통한 백업 DB uni-directional sync [Details](https://ghkdqhrbals.github.io/posts/chatting(9)/)            |
| Docker                       | 서버/DB/Kafka/Connector/ELK/Monitoring/etc. 실행 자동화                                                            |
| Nginx                        | API gateway로써 채팅서버 및 인증서버를 묶어서 통합 RestApi entry point 제공                                                    |
| Stomp                        | 채팅 실시간성 제공                                                                                                  |
| JPA                          | 영속성을 활용한 DB 관리                                                                                              |

### 아키텍처
![image](../../assets/img/msa/12.svg)

</div>
