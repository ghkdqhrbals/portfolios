---
layout: default
title: About Me
nav_order: 2
description: "About Me / CV"
permalink: /cv/
---

<div class="contact-inline">
	<span>
		<img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/solid/phone.svg" alt="phone" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		(+82) 10-5177-1967
	</span>
	<span>
		<img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/solid/envelope.svg" alt="email" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		<a href="mailto:ghkdqhrbals@gmail.com">ghkdqhrbals@gmail.com</a>
	</span>
	<span>
		<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" alt="github" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		<a href="https://github.com/ghkdqhrbals">ghkdqhrbals</a>
	</span>
	<span>
		<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" alt="linkedin" style="height:1em;vertical-align:middle;filter:grayscale(1);margin-right:4px;">
		<a href="https://www.linkedin.com/in/gyumin-hwangbo-92382218b/">gyumin</a>
	</span>
</div>

안녕하세요. Spring-Boot/Kotlin 기반의 백엔드 시스템 설계 및 개발 경험을 보유한 백엔드 엔지니어 <span class="my-name">황보규민</span>입니다.

저는 Redis Stream 기반의 메시징 시스템 설계<sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Java/30/" style="color:#007bff;text-decoration:none;">[1]</a></sup>, 대용량 배치 작업 95.4% 최적화<sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Java/20/" style="color:#007bff; text-decoration:none;">[2]</a></sup>, 브랜드 별 CI/CD 파이프라인 구성<sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Java/25/" style="color:#007bff; text-decoration:none;">[3]</a></sup> 등 
실무 기술 경험을 바탕으로 **안전한 백엔드 시스템 구축**과 **운영 자동화** 측면에서 팀에 기여할 수 있습니다. 또한 QA 하기 편하도록 테스트하기 좋은 로직으로 코드 작성하는 것을 선호하며 기술적인 문제 해결 과정들을 문서화하고 팀원들과 지속적으로 공유함으로써 함께 성장할 수 있는 문화를 조성할 수 있습니다.

안정적으로 운영되는 시스템을 만드는 것이 현재 제가 가장 중요하게 생각하는 가치입니다.

## EXPERIENCE
* Backend Engineer([**FOODDASH**](https://fooddash.co.kr/)) 2024.04 ~ present
  * Kotlin/Spring-Boot 기반 교촌, 자담 등 멀티 프랜차이즈 F&B 솔루션 개발
  * 회원, 주문 결제 및 롤백, 멤버십 설계 및 개발
  * 사용자 멤버십 등급 갱신 배치 작업 최적화 19m13s 에서 53s로 **95.4% 개선.**<sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Java/20/" style="color:#007bff; text-decoration:none;">[1]</a></sup>
  * 브랜드 별 모듈화 및 개별&통합 CI/CD 파이프라인 구성.<sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Java/25/" style="color:#007bff; text-decoration:none;">[2]</a></sup>
  * Redis stream 도입 비동기 알림 시스템 설계, 리밸런싱, DLQ, 컨슈머 관리 로직 설계.<sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Java/30/" style="color:#007bff;text-decoration:none;">[3]</a></sup>.
  * MySQL -> Redis stream -> MongoDB [CDC ETL](https://ghkdqhrbals.github.io/portfolios/docs/Java/37/) 시스템 설계 및 개발
  * 개발스택 : Kotlin/Spring-Boot, Mysql, MongoDB, Kubernetes, AWS
* Senior Researcher(foxee) 2023.06 ~ 2024.01(7 month)
  * Java/Spring-Boot 기반 취약점 분석 웹 백엔드 개발
  * 악성코드 이미지 CNN eXplainable AI 개발
  * 개발스택 : Java/Spring-Boot, PostgreSQL, Docker
* Intern(주식회사 펄스) 2020.01 ~ 2020.02(1 month)
  * 역할 : 사내 편의 서비스 개발
  * 개발스택 : Python

## EDUCATION

* 부산대학교 컴퓨터공학과 석사 졸업(2020.09 ~ 2022.08)
* 부산대학교 정보컴퓨터공학부 학사 졸업(2014.03 ~ 2020.08)
* 부일 외국어고등학교 졸업(2010.03 ~ 2013.02)

## OPENSOURCE
* 2025.10 [OAuth2.0 인증모듈 퍼블릭 package 배포](https://github.com/ghkdqhrbals/personal-module)

  lightweight OAuth2.0 인증모듈로 revoke 지원을 포함합니다.
* 2025.03 [AWS 계정변경 유틸리티](https://github.com/matryer/xbar-plugins/pull/2103)
  
  멀티 프렌차이즈를 운영하면서 aws 계정설정이 자주 스위칭되어 편의를 위해 mac xbar 자동화 툴 머지
* 2024.03 ~ 2024.04 [서버 벤치마크 서비스](https://github.com/backend-tech-forge/benchmark)
* 2024.01 ~ 2024.02 [슬랙 리스트 알림 Git Actions](https://github.com/ghkdqhrbals/slack-list)
* 2022.11 ~ 2024.02 실시간 채팅 서비스 ([47 stars](https://github.com/ghkdqhrbals/spring-chatting-server))

  개인으로 1년 넘게 진행했던 프로젝트이며 현재는 **[KT AICC](https://www.kt-aicc.com/user/index)** 에서 오픈소스 차용되어 사용됨.
  * **최대 59배 속도 개선** (TPS p99.9 1.63\t-> 96.52) <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/pf/" style="color:#007bff;text-decoration:none;">[7]</a></sup>

* 2022.06 ~ 2022.09 뱅킹 서버 배포 자동화 <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/project2/" style="color:#007bff; text-decoration:none;">[8]</a></sup>
* 2021.09 ~ 2021.12 윈도우 악성코드 유형 별 대표특성 추출 <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/toy/toyp8/" style="color:#007bff; text-decoration:none;">[9]</a></sup>
* 2021.09 ~ 2021.12 파워쉘 악성 스크립트 탐지 <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/toy/toyp2/" style="color:#007bff; text-decoration:none;">[10]</a></sup>
* 2021.09 ~ 2021.10 블록체인 기반 친환경 에너지 거래 플랫폼 프로토타입 <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/toy/toyp4/" style="color:#007bff; text-decoration:none;">[11]</a></sup>

## PAPER

* 이더리움 블록체인 이클립스 공격 논문 <sup><a href="https://ghkdqhrbals.github.io/portfolios/docs/Blockchain/" style="color:#007bff; text-decoration:none;">[16]</a></sup>

## ACTIVITY

* (특허등록) 블록체인 클라이언트 취약점 탐지 방법 및 취약점 탐지 장치 (2022.01 ~ 2022.12) <sup><a href="https://patents.google.com/patent/KR20240019566A/ko" style="color:#007bff; text-decoration:none;">[17]</a></sup>
* (학술대회) (NLP)N-gram과 위협 행위 기반의 Windows 악성코드 패밀리 주요 유형 패턴 분석 (2021.12)<sup><a href="https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11035874" style="color:#007bff; text-decoration:none;">[18]</a></sup>
* (SW등록) RE100 실현을 위한 블록체인 기반 REC(신재생에너지공급인증서) 거래 플랫폼 프로토타입 [C-2021-044149] (2021.09 ~ 2021.11)<sup><a href="https://www.ntis.go.kr/outcomes/popup/srchTotlSpwr.do?cmd=view&rstId=SNW-2021-00312106034&returnURI=null&pageCode=RI_SW_RST_DTL" style="color:#007bff; text-decoration:none;">[19]</a></sup>
* (대회) 해커톤 대회 : Convergence Security Graduate School Hackathon Competition (2021.09 ~ 2021.11)
* (대회) AI 대회(4등) : 2021 Cybersecurity AI/big data challenge, Korea Internet & Security Agency(KISA) - 파일리스 악성코드탐지 부문 (2021.09 ~ 2021.12)
* (대회) 개인정보보호 대회(3등) : 2020 K-cyber security challenge, Korea Internet & Security Agency(KISA) - 개인정보보호 부문 (2020.09 ~ 2020.12)
* (SW 해외교육) 미국 산호세 주립대학 San Jose State Univ. 1 Washinton Square, CA, USA (2019.06 ~ 2019.09)
* (교환학생) 말레이시아 헬프 대학 HELP Univ. Bukit Damansara 50490 Kuala Lumpur, Malaysia (2017.12 ~ 2018.03)
