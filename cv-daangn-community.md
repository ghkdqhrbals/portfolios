---
layout: default
title: About Me
nav_exclude: true
search_exclude: true
sitemap: false
toc_sidebar: false
description: "About Me / Daangn Community Backend"
permalink: /cv/daangn-community/
---

안녕하세요. Spring Boot/Kotlin 기반의 대규모 백엔드 시스템을 설계하고 운영 자동화까지 함께 다뤄온 백엔드 엔지니어 황보규민입니다.

저는 **만들고 개선하고 자동화하는 것을 좋아하는 개발자**입니다. 600만+ 회원, MAU 77만 규모의 교촌을 포함한 멀티 프랜차이즈 서비스에서 주문/결제/멤버십 백엔드를 개발했고, Redis Stream 메시지 큐, MySQL CDC 파이프라인, 대용량 배치 성능 개선, GitHub Actions/Kubernetes 기반 배포 자동화를 직접 설계하고 운영했습니다.

당근 커뮤니티실에서 중요하게 보는 "사용자 문제를 발견하고, 기술을 선택하고, 만든 뒤 결과를 측정하며 추가 개선하는 방식"은 제가 일해온 방식과도 맞닿아 있습니다. 저는 서버 코드에만 머무르지 않고 데이터 동기화, 메시징, 배포, 모니터링, 장애 복구 흐름까지 함께 보며 제품이 실제로 안정적으로 동작하는 지점까지 책임지는 방식으로 일해왔습니다.

최근에는 주로 Codex 로 작업을 진행하고 있습니다. 저는 AI 도구도 결국 사용하는 사람이 시스템과 문제를 얼마나 이해하고 있는지에 따라 결과가 달라진다고 생각합니다. **아는 만큼 정교하고 좋은 결과물이 나온다**고 생각하기 때문에, 단순히 "해달라"고 요청하는 방식에 그치지 않고 초기 설계에서 최적화, 모니터링, 안전성, 보안까지 필요한 기준을 함께 잡고 관리하려고 합니다.

## EXPERIENCE

* Backend Engineer([**FOODDASH**](https://fooddash.co.kr/)) 2024.04.15 ~ 2025.11.30

  * **600만+ 회원, MAU 77만 교촌**을 포함한 멀티 프랜차이즈 브랜드의 주문/결제/멤버십 백엔드 개발 및 무중단 배포 운영.
  * **알림 시스템 안정화**
    * 문제점 발견: Sentry에서 특정 사용자에게 주문 push 알림을 전송하는 과정에서 외부 Push API timeout이 발생하는 것을 확인했습니다. 대규모 알림 배치와 실시간 주문 알림이 같은 처리 흐름을 공유하고 있었기 때문에, 주문 시간대에 timeout/retry가 겹치면 주문 알림 지연과 누락 가능성이 커질 수 있었습니다. 서버 재시작 시 이미 가져간 메시지가 실제로 처리되었는지 추적하기 어려운 문제도 있었습니다.
    * 기술 선택과 이유: Kafka도 검토했지만, 당시 요구사항은 장기 보관이나 복잡한 파티셔닝보다 기존 인프라 재사용, 낮은 운영 비용, 빠른 메시지 처리, 장애 후 재처리가 더 중요했습니다. 그래서 Redis Stream 메시지 큐를 선택했고, Consumer Group/PEL(Pending Entries List)을 기반으로 ACK되지 않은 메시지를 추적하도록 설계했습니다.
    * 결과 측정: 주문 흐름에서 외부 알림 호출을 분리했고, 서버 재시작 이후에도 ACK되지 않은 알림을 회수할 수 있게 만들었습니다. 결과적으로 알림 전송 누락을 **0% 수준으로 안정화**했습니다.
    * 추가 개선: `XAUTOCLAIM`/`XCLAIM`, consumer heartbeat, Redis Lock, CDL/DLQ 분리를 추가해 at-least-once 시맨틱 기반 재처리 구조를 보강했고, produce 유실 가능성은 outbox 테이블과 재적재 스케줄러로 보완했습니다.
  * **실시간 주문/메뉴 조회 모델 동기화**
    * 문제점 발견: 어드민 사용자가 대용량 주문·메뉴 데이터를 빠르게 실시간 확인해야 했지만, 여러 테이블에 걸친 멀티 쿼리 때문에 조회 응답이 느려질 수 있었습니다. 어드민 사용자는 빠른 확인을 원했고, 백엔드는 조회 부하와 데이터 정합성을 함께 해결해야 했습니다.
    * 기술 선택과 이유: 원본 MySQL 정규화 모델을 그대로 조회하는 대신, 조회 목적에 맞춘 MongoDB 역정규화 모델을 만들기로 했습니다. 변경 데이터는 **MySQL CDC -> Redis Stream MQ -> ETL -> MongoDB** 흐름으로 동기화했습니다. Debezium Server로 binlog를 읽고, Redis Stream을 MQ로 사용해 ETL sink pod와 분리했습니다.
    * 결과 측정: MongoDB upsert 흐름을 단건 **1.3~1.5ms** 처리에서 **100건 평균 27ms** bulk 처리 구조로 개선했습니다. Redis 메모리 사용량이 **4GB**까지 증가하는 상황을 확인했고, `512MB limit / 85% threshold` 기반 consume 제한으로 동기화 파이프라인이 메모리 한계를 넘지 않도록 제어했습니다.
    * 추가 개선: Redis Stream backpressure, memory threshold 기반 consume 제한, bulk upsert, stream별 메모리 모니터링을 추가했습니다. 또한 전체 스냅샷을 매번 크게 다시 처리하는 방식의 부담을 줄이기 위해, 변경 구간을 나누어 반영하는 증분 스냅샷 흐름으로 개선했습니다.
  * **멤버십 등급 갱신 배치 성능 개선**
    * 문제점 발견: **100만명 이상 회원 대상 멤버십 등급 갱신 배치**가 오래 걸리면 운영 시간과 배치 윈도우를 압박하고, 후속 작업 지연으로 이어질 수 있었습니다.
    * 기술 선택과 이유: 단순히 서버 스펙을 올리는 대신, 병목을 조회 방식, chunk 크기, connection pool, thread 모델, update 방식으로 나누어 확인했습니다. `offset limit` 조회는 데이터가 커질수록 뒤쪽 페이지가 느려지기 때문에 sliding-window id range 조회로 바꿨습니다.
    * 결과 측정: 처리 시간을 **19m13s -> 53s**로 단축해 **95.4% 개선**했습니다.
    * 추가 개선: connection pool **10 -> 30**, chunk size **100 -> 5**, VirtualThread 기반 처리, bulk update, 필요한 column만 조회하는 select query를 적용해 병목을 단계적으로 줄였습니다.
  * **배포 파이프라인 안정화**
    * 문제점 발견: 배포 명령은 성공했지만 실제 서비스가 정상 기동되기 전에 빈 로딩 상태나 초기 로컬 캐시 활성화 오류가 발생하는 경우를 빠르게 잡기 어려웠습니다.
    * 기술 선택과 이유: GitHub Actions에서 변경 모듈을 계산하고 Jib 이미지 빌드/푸시, Kubernetes 배포, Slack 알림을 연결했습니다. `kubectl apply` 성공만 확인하지 않고 readinessProbe 활성화까지 기다려 실제 서비스 정상 기동 여부를 확인하도록 만들었습니다.
    * 결과 측정: 배포 명령 성공과 실제 서비스 기동 성공을 분리해서 볼 수 있게 되었고, 초기화 오류를 배포 직후 빠르게 확인할 수 있게 했습니다.
    * 추가 개선: staging 자동 배포와 production 수동 승인 배포를 분리하고, 브랜드별 기능 차이와 공통 모듈을 기준으로 변경 감지 배포 흐름을 정리했습니다.
  * 자담 위메프오 서비스 이관 과정에서 회원/주문 데이터 마이그레이션을 수행하고, 전환 이후 서비스 운영 이슈를 안정화.
  * 주요 스택 : Kotlin, Spring Boot, MySQL, Redis Stream, MongoDB, Kubernetes, AWS, GitHub Actions

* Senior Researcher(foxee) 2023.06 ~ 2024.01

  * **XAI 기반 취약점 분석 웹 서비스 개발**
    * 문제점 발견: 악성코드 분석 결과를 단순 분류 결과로만 보여주면, 사용자가 "왜 위험한지"를 이해하기 어렵고 분석 결과를 검증하기도 어려웠습니다. 분석 결과, 라이선스, 취약점 정보, 사용자 권한을 함께 관리해야 했기 때문에 연구 코드만으로는 서비스 운영 흐름을 만들기 어려웠습니다.
    * 기술 선택과 이유: 분석 결과를 일회성 연구 결과로 끝내지 않고 사용자, 라이선스, 취약점 정보와 함께 관리해야 했기 때문에 백엔드 API와 RDB 기반 도메인 모델이 필요했습니다. 그래서 Java/Spring Boot와 PostgreSQL을 선택해 서비스 흐름을 구성했습니다. 또한 악성코드 여부만 반환하면 사용자가 판단 근거를 확인하기 어렵기 때문에, Grad-CAM 기반 XAI 결과를 함께 제공해 악성코드 판단 위치를 시각적으로 확인할 수 있도록 했습니다.
    * 결과 측정: Windows 2015 악성코드 데이터셋을 대상으로 N-gram 기반 대표 opcode 특성을 도출했고, 이를 AI 모델 학습/검증에 활용할 수 있는 데이터 형태로 정제했습니다. 연구 결과를 웹 서비스 API와 연결해, 분석 요청부터 결과 조회까지 이어지는 기본 서비스 흐름을 구현했습니다.
    * 추가 개선: Docker/GitHub Actions 기반 배포 흐름을 정리해 연구/서비스 개발 환경의 반복 작업을 줄였고, 데이터 정제와 시각화 파이프라인을 분리해 모델 개선과 서비스 개발을 병행할 수 있도록 구성했습니다.
  * 주요 스택 : Java, Spring Boot, PostgreSQL, Docker, Python

* Intern(주식회사 펄스) 2020.01 ~ 2020.02(1 month)

  * 사내 업무 편의 기능을 Python 기반으로 개발.

## EDUCATION

* 부산대학교 컴퓨터공학과 석사 졸업(2020.09 ~ 2022.08)
  * 논문 : [디중 Geth 취약점을 이용한 블록체인 이클립스 공격 설계](https://ghkdqhrbals.github.io/portfolios/docs/Blockchain/)
* 부산대학교 컴퓨터공학부 학사 졸업(2014.03 ~ 2020.08)
* 부일 외국어고등학교 졸업(2010.03 ~ 2013.02)

## OPENSOURCE

* 2025.10 [OAuth2.0 인증모듈 퍼블릭 package 배포](https://github.com/ghkdqhrbals/personal-module)

  경량 OAuth2.0 인증모듈로 spring security 에 없는 revoke 지원을 포함합니다.
* 2025.03 [AWS 계정변경 유틸리티](https://github.com/matryer/xbar-plugins/pull/2103)

  멀티 프랜차이즈를 운영하면서 AWS 계정 설정이 자주 스위칭되어 편의를 위해 macOS xbar 자동화 툴을 제작했고, 메인 프로젝트에 merge 되었습니다.
* 2024.03 ~ 2024.04 [서버 벤치마크 서비스](https://github.com/backend-tech-forge/benchmark)
* 2024.01 ~ 2024.02 [슬랙 리스트 알림 Git Actions](https://github.com/ghkdqhrbals/slack-list)
* 2022.11 ~ 2024.02 실시간 채팅 서비스 ([47 stars](https://github.com/ghkdqhrbals/spring-chatting-server))

  개인으로 1년 넘게 진행했던 프로젝트이며 현재는 **[KT AICC](https://www.kt-aicc.com/user/index)** 에서 오픈소스 차용되어 사용되는 중.
  * **최대 59배 속도 개선** (TPS p99.9 **1.63 -> 96.52**) <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/pf/" style="color:#007bff;text-decoration:none;">[7]</a></sup>

## ACTIVITY

* (특허등록) 블록체인 클라이언트 취약점 탐지 방법 및 취약점 탐지 장치 (2022.01 ~ 2022.12) <sup><a href="https://patents.google.com/patent/KR20240019566A/ko" style="color:#007bff; text-decoration:none;">[17]</a></sup>
* (학술대회) (NLP)N-gram과 위협 행위 기반의 Windows 악성코드 패밀리 주요 유형 패턴 분석 (2021.12)<sup><a href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11035874" style="color:#007bff; text-decoration:none;">[18]</a></sup>
* (SW등록) RE100 실현을 위한 블록체인 기반 REC(신재생에너지공급인증서) 거래 플랫폼 프로토타입 [C-2021-044149] (2021.09 ~ 2021.11)<sup><a href="https://www.ntis.go.kr/outcomes/popup/srchTotlSpwr.do?cmd=view&rstId=SNW-2021-00312106034&returnURI=null&pageCode=RI_SW_RST_DTL" style="color:#007bff; text-decoration:none;">[19]</a></sup>
* (대회) 해커톤 대회 : Convergence Security Graduate School Hackathon Competition (2021.09 ~ 2021.11)
* (대회) AI 대회(4등) : 2021 Cybersecurity AI/big data challenge, Korea Internet & Security Agency(KISA) - 파일리스 악성코드탐지 부문 (2021.09 ~ 2021.12)
* (대회) 개인정보보호 대회(3등) : 2020 K-cyber security challenge, Korea Internet & Security Agency(KISA) - 개인정보보호 부문 (2020.09 ~ 2020.12)
* (SW 해외교육) 미국 산호세 주립대학 San Jose State Univ. 1 Washinton Square, CA, USA (2019.06 ~ 2019.09)
* (교환학생) 말레이시아 헬프 대학 HELP Univ. Bukit Damansara 50490 Kuala Lumpur, Malaysia (2017.12 ~ 2018.03)

## CONTACT

- GitHub: [github.com/ghkdqhrbals](https://github.com/ghkdqhrbals)
- Portfolio: [ghkdqhrbals.github.io/portfolios](https://ghkdqhrbals.github.io/portfolios)
- LinkedIn: [linkedin.com/in/gyumin-hwangbo](https://www.linkedin.com/in/gyumin-hwangbo-92382218b/)
- Phone : (+82) 10-5177-1967
- Email : ghkdqhrbals@gmail.com