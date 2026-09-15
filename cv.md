---
layout: default
title: About Me
nav_order: 1
description: "About Me / CV"
permalink: /cv/
---

안녕하세요. 교촌 주문, 결제, 멤버십 서비스에서 최대 4,000 RPS의 트래픽을 처리하고, Spring Boot/Kotlin 기반 고가용성 백엔드 시스템을 설계, 운영, 자동화해 온 백엔드 엔지니어 황보규민입니다.

CDC 기반 데이터 동기화, 대용량 배치 처리 시간 95.4% 단축, 브랜드별 CI/CD, Redis Streams 기반 알림 처리 구조 개선을 통해 서비스의 안정성과 운영 효율을 높여왔습니다.

운영 중 발생한 성능 병목과 알림 누락의 원인을 분석하고 재발을 줄이는 데 집중합니다. 최근에는 Codex를 활용해 코드 분석부터 구현, 테스트, 문서화까지 개발 작업을 진행하고 있습니다.

## EXPERIENCE

* Backend Engineer · **FOODDASH** 2024.04.15 ~ 2025.11.30

  * 회원 600만 명 이상, 월간 활성 사용자(MAU) 77만 명 규모의 교촌치킨과 자담·읍천리 등 여러 프랜차이즈 브랜드의 주문·결제·멤버십 백엔드를 개발하고 무중단 운영.
  * 자담 위메프오 서비스 이관 과정에서 회원/주문 데이터 마이그레이션을 수행하고, 전환 이후 서비스 운영 이슈를 안정화.
  * 100만 명 이상 회원 대상 멤버십 등급 갱신 배치의 병목을 분석하고, 처리 시간을 19분 13초에서 53초로 단축하여 [95.4% 개선](https://minstack.pages.dev/docs/Java/20/).
  * 브랜드별 기능 차이와 공통 모듈을 분리하고, 변경 감지 기반 staging 배포와 수동 승인 production 배포를 지원하는 [통합 CI/CD 파이프라인](https://minstack.pages.dev/docs/Java/25/) 구축.
  * 대규모 알림 배치와 실시간 주문 알림이 겹칠 때 발생하던 외부 Push API 타임아웃, 재시도, 서버 재시작 시 전송 누락 문제를 분석.
    * 알림 누락 문제 해결을 위해 Redis Streams 메시지 큐 도입을 테크 리드로 주도하고, Consumer Group과 PEL(Pending Entries List, 처리 대기 메시지 목록)로 처리 중이던 메시지를 추적해 최소 한 번 전달을 보장하는 알림 처리와 서버 재시작 후 미처리 알림 복구를 지원하도록 개선.
    * 결과적으로 알림 전송 누락을 0% 수준으로 [안정화](https://minstack.pages.dev/docs/Java/30/).
  * 대용량 주문/메뉴 데이터를 빠르게 실시간 조회해야 하는 요구사항에서, 여러 테이블에 걸친 멀티 쿼리 병목을 줄이기 위해 조회 모델 역정규화가 필요하다고 판단하고 [MySQL CDC → MQ → ETL → MongoDB 동기화 파이프라인](https://minstack.pages.dev/docs/Java/37/)을 설계 및 운영.
  * 주요 기술: Kotlin, Spring Boot, MySQL, Redis Streams, Kubernetes, AWS

* Senior Researcher · foxee 2023.06 ~ 2024.01

  * Java/Spring Boot 기반 취약점 분석 웹 서비스의 백엔드 API 개발.
  * 악성코드 이미지 기반 CNN/XAI 연구를 수행하고, Windows 2015 악성코드 데이터셋의 벡터 정제 및 시각화 파이프라인 구축.
  * Docker/GitHub Actions 기반 배포 흐름을 정리해 연구/서비스 개발 환경의 반복 작업을 줄임.
  * 주요 기술: Java, Spring Boot, PostgreSQL, Docker, Python

* Intern · 주식회사 펄스 2020.01 ~ 2020.02

  * 사내 업무 편의 기능을 Python 기반으로 개발.

## EDUCATION

* 부산대학교 컴퓨터공학과 석사 졸업(2020.09 ~ 2022.08)
  * 논문: [다중 Geth 취약점을 이용한 블록체인 이클립스 공격 설계](https://minstack.pages.dev/docs/Blockchain/)
* 부산대학교 컴퓨터공학부 학사 졸업(2014.03 ~ 2020.08)
* 부일외국어고등학교 졸업(2010.03 ~ 2013.02)

## OPEN SOURCE

* 2026.07 [redisStreamScope — Redis Streams 운영 콘솔](https://ghkdqhrbals.github.io/redisstreamscope/) · [GitHub](https://github.com/ghkdqhrbals/redisstreamscope)

  Go·React 기반의 셀프 호스팅 도구로, 스트림·메시지·Consumer Group 조회와 lag·미처리 메시지 모니터링을 지원합니다. 메시지 재처리·DLQ 격리 및 재전송, ACL 기반 접근 제어와 감사 로그를 제공하며 Docker·Helm으로 배포할 수 있습니다.

* 2025.10 [OAuth 2.0 인증 모듈 공개 패키지 배포](https://github.com/ghkdqhrbals/personal-module)

  토큰 폐기(revoke) 기능을 포함한 경량 OAuth 2.0 인증 모듈입니다.
* 2025.03 [AWS 계정 전환 유틸리티](https://github.com/matryer/xbar-plugins/pull/2103)

  여러 프랜차이즈 브랜드 운영 중 반복되는 AWS 계정 전환을 자동화한 macOS xbar 유틸리티입니다. 기여한 코드는 공식 플러그인 저장소에 병합되었습니다.
* 2024.03 ~ 2024.04 [서버 벤치마크 서비스](https://github.com/backend-tech-forge/benchmark)
* 2024.01 ~ 2024.02 [Slack 리스트 알림 GitHub Actions](https://github.com/ghkdqhrbals/slack-list)
* 2022.11 ~ 2024.02 [실시간 채팅 서비스](https://github.com/ghkdqhrbals/spring-chatting-server)

  1년 이상 개발한 개인 프로젝트로, **[KT AICC](https://www.kt-aicc.com/user/index)** 에서 오픈소스를 활용하고 있습니다.
  * **최대 59배 처리량 개선** (TPS p99.9: 1.63 → 96.52) <sup><a href="https://minstack.pages.dev/docs/pf/">[1]</a></sup>

* 2022.06 ~ 2022.09 뱅킹 서버 배포 자동화 <sup><a href="https://minstack.pages.dev/docs/project2/">[2]</a></sup>
* 2021.09 ~ 2021.12 Windows 악성코드 유형별 대표 특성 추출 <sup><a href="https://minstack.pages.dev/docs/toy/toyp8/">[3]</a></sup>
* 2021.09 ~ 2021.12 PowerShell 악성 스크립트 탐지 <sup><a href="https://minstack.pages.dev/docs/toy/toyp2/">[4]</a></sup>
* 2021.09 ~ 2021.10 블록체인 기반 친환경 에너지 거래 플랫폼 프로토타입 <sup><a href="https://minstack.pages.dev/docs/toy/toyp4/">[5]</a></sup>

## ACTIVITY

* (특허등록) 블록체인 클라이언트 취약점 탐지 방법 및 취약점 탐지 장치 (2022.01 ~ 2022.12) <sup><a href="https://patents.google.com/patent/KR20240019566A/ko">[6]</a></sup>
* (학술대회) (NLP)N-gram과 위협 행위 기반의 Windows 악성코드 패밀리 주요 유형 패턴 분석 (2021.12)<sup><a href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11035874">[7]</a></sup>
* (SW등록) RE100 실현을 위한 블록체인 기반 REC(신재생에너지공급인증서) 거래 플랫폼 프로토타입 [C-2021-044149] (2021.09 ~ 2021.11)<sup><a href="https://www.ntis.go.kr/outcomes/popup/srchTotlSpwr.do?cmd=view&rstId=SNW-2021-00312106034&returnURI=null&pageCode=RI_SW_RST_DTL">[8]</a></sup>
* (대회) 해커톤 대회 : Convergence Security Graduate School Hackathon Competition (2021.09 ~ 2021.11)
* (대회) AI 대회(4등) : 2021 Cybersecurity AI/big data challenge, Korea Internet & Security Agency(KISA) - 파일리스 악성코드탐지 부문 (2021.09 ~ 2021.12)
* (대회) 개인정보보호 대회(3등) : 2020 K-cyber security challenge, Korea Internet & Security Agency(KISA) - 개인정보보호 부문 (2020.09 ~ 2020.12)
* (SW 해외교육) 미국 산호세 주립대학 San Jose State Univ. 1 Washinton Square, CA, USA (2019.06 ~ 2019.09)
* (교환학생) 말레이시아 헬프 대학 HELP Univ. Bukit Damansara 50490 Kuala Lumpur, Malaysia (2017.12 ~ 2018.03)

## CONTACT

- GitHub: [github.com/ghkdqhrbals](https://github.com/ghkdqhrbals)
- LinkedIn: [linkedin.com/in/gyumin-hwangbo](https://www.linkedin.com/in/gyumin-hwangbo-92382218b/)
- Phone: (+82) 10-5177-1967
- Email: ghkdqhrbals@gmail.com
