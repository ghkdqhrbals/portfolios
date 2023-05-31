---
layout: default
title: 포트폴리오
nav_order: 1
description: "다양한 프로젝트를 기록하는 곳입니다"
permalink: /
---


안녕하세요. 백엔드 개발자 황보규민입니다 😊

저는 **장애발생에 미리 대응**하길 좋아하며, **확장성 있는 시스템 구축**하는 것을 중점적으로 개발하길 좋아합니다.

## 기본정보

* Github : [https://github.com/ghkdqhrbals](https://github.com/ghkdqhrbals)
* 이메일 : ghkdqhrbals@gmail.com
* LinkedIn : [https://www.linkedin.com/in/gyumin-hwangbo-92382218b/](https://www.linkedin.com/in/gyumin-hwangbo-92382218b/)

## 학력

* 부산대학교 2020.09 ~ 2022.08 컴퓨터공학과 석사 졸업
* 부산대학교 2014.03 ~ 2020.08 정보컴퓨터공 학부 졸업

## 경험

* [DB 크롤링](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp1/) 개발(주식회사 펄스) 2020.01 ~ 2020.02
  * Python, Selenium

## 기술 스택

* 프론트엔드
  * HTML, CSS : 현재 포트폴리오 페이지 및 [이전 포트폴리오 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp6/) 등 간단한 프론트 구현가능

* 백엔드
  * Java(Spring) : 채팅서버 프로젝트에서 비동기 멀티스레딩을 통한 효율향상 경험
  * Spring-Cloud/Security : 채팅서버 프로젝트에서 Config 서버를 통한 설정파일 배포 경험. 또한 JWT 토큰 인증/인가 처리를 Reactor 기반으로 처리한 경험이 있음
  * Kafka : 채팅서버 프로젝트에서 MSA 의 백본망으로 사용한 경험
  * Golang(Gin) : 뱅킹서버 프로젝트/HTTP 벤치마크 프로젝트에서 비동기 멀티스레딩을 통한 효율향상 경험
  * Docker/Shell-script : 채팅서버/뱅킹서버/HTTP 벤치마크 프로젝트에서 서버 실행에 필요한 부분을 자동화한 경험
  * Kubernetes/AWS/Git-Actions : 뱅킹서버 프로젝트에서 CI/CD 를 구현한 경험
  
* 기타
  * Linux : 리눅스 환경에서의 코딩경험 많음
  * Git : 소스 버전관리
  * 보안
    * 이더리움 블록체인 네트워크 취약점 발견 및 공격성공 : 1저자로 [네트워크 보안 취약점 논문](https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502) 발표
    * 공격 탐지 및 패턴 추출 : [파워쉘 악성 스크립트 탐지](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp2/), [윈도우 악성 코드 패턴 추출](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp8/)

## 주요 프로젝트

* [채팅서버 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/project/)(기여도 100%)
  * 기간 : 2022년 10월 ~ 진행중
  * 인원 : 1명
  * 설명
    * 사용자 간 실시간으로 채팅전송 가능한 서버 개발
    * 현재 인증 API가 MSA Saga-Orchestration 형태로 진행됨
    * [성능최적화](https://ghkdqhrbals.github.io/portfolios/docs/project/#2---성능-이슈-해결-및-최적화-과정)와 확장성있는 아키텍처 개발에 초점을 맞춤
  * Github : [https://github.com/ghkdqhrbals/spring-chatting-server](https://github.com/ghkdqhrbals/spring-chatting-server)
  * Youtube : [https://www.youtube.com/watch?v=3VqwZ17XyEQ](https://www.youtube.com/watch?v=3VqwZ17XyEQ) 
  * <details><summary>기술 스택</summary><div markdown="1">

    | 사용기술 | 내용 |
    | -------- | :--- ||
    | ELK stack                    | Elastic Search + Logstash + Kibana 를 통한 통계수집/시각화 [Image](https://ghkdqhrbals.github.io/assets/img/es/5.png) |
    | Kafka                        | 3대의 Broker과 replica들을 통한 안전성 및 확장성 제공. MSA 백본망으로 사용                                                                 |
    | Debezium/JDBC-Sink-connector | Kafka를 통한 백업 DB uni-directional sync [Details](https://ghkdqhrbals.github.io/posts/chatting(9)/)                 |
    | Docker                       | 서버/DB/Kafka/Connector/ELK/Monitoring/etc. 실행 자동화                                                               |
    | Nginx/Spring-Cloud-gateway   | API gateway로써 채팅서버 및 인증서버를 묶어서 통합 RestApi entry point 제공                                           |
    | Stomp                        | 채팅 실시간성 제공                                                                                                    |
    | JPA + JDBC                   | INSERT 문 JDBC 배치 프로세싱, 비동기 DB 관리                                                                          |
    | AWS RDS                      | authDB에 적용되었으며, Postgresql 성능지표 시각화                                                                     |
    | Spring-Security              | Reactor 기반 JWT 인증 및 유저 Role 별 인가 설정                                                                     |
    | Spring-Cloud                 | Eureka 및 Config-Server 설정으로 자동 yaml 배포 및 확장성 고려                                                                |

      </div>
      </details>

## 기타 프로젝트

* [윈도우 악성코드 유형 별 대표특성 추출 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp8/)(기여도 50%)
  * 기술 스택 : Python, N-gram, TF-IDF
  * 기간 : 2021.09 ~ 2021.12
  * 인원 : 5명(팀원 역할)
  * 나의 역할
    * 윈도우 악성코드 데이터 분석(기여도 20%)
    * N-gram 기반 악성코드 대표 특성 도출(기여도 100%)
  * Github : 비공개
  * 설명 : 국가연구과제 수행 중, N-gram 기반 악성코드 대표 특성 추출 개발(N==7일 때 가장 분류 정확도가 높음)

* [뱅킹 서버 자동배포 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/project2/)(기여도 100%)
  * 기술 스택 : Golang, Gin, 비동기 멀티스레드 처리, Docker/Kubernetes, AWS-Route-53/ECR/EKS/Secrets/IAM, Git-Actions
  * 기간 : 2022.06 ~ 2022.09
  * 인원 : 1명
  * 나의 역할
    * 뱅킹 API 개발
    * 자동배포 Flow 개발(Git-Actions -> AWS-IAM/Secrets(시크릿 확인 및 설정파일 가져오기) -> AWS-ECR(이미지 배포) -> AWS-EKS(이미지를 가져와서 컨테이너 생성) -> AWS-EC2(서비스))
  * Github : [https://github.com/ghkdqhrbals/golang-backend-master](https://github.com/ghkdqhrbals/golang-backend-master)
  * 설명 : 뱅킹 서버를 자동으로 배포하는 CI/CD 구축

* [HTTP 벤치마크 툴 개발 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp3/)(기여도 100%)
  * 기술 스택 : Golang, 비동기 멀티스레딩 처리, 시간경과에 따른 트래픽 딜레이 그래프 생성
  * 기간 : 2023.01 ~ 2023.02
  * 인원 : 1명
  * Github : [https://github.com/ghkdqhrbals/gotybench](https://github.com/ghkdqhrbals/gotybench)
  * 설명 : 서버 부하를 테스트 하기 위해서 경량 스레드를 통한 1000개 이상의 동시 API 전송 테스트 가능

* [파워쉘 악성 스크립트 탐지 개발 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp2/)(기여도 80%)
  * 기술 스택
    * Python, TF-IDF, LSTM 모델을 통해 Binary Classification(Normal/Abnormal) 수행
    * PowerDecoder, Revoke Expression 을 통해 비난독화 진행
  * 기간 : 2021.09 ~ 2021.12
  * 인원 : 3명(팀장 역할)
  * 나의 역할
    * 윈도우 파일리스 악성코드 데이터 분석(기여도 60%)
    * 파일리스 악성코드 탐지 논문 정리(기여도 100%)
    * 파일리스 악성코드 탐지 모델 개발(기여도 100%)
  * Github : [https://github.com/ghkdqhrbals/Malware_LSTM](https://github.com/ghkdqhrbals/Malware_LSTM)
  * 설명 : 공격자는 주로 파워쉘 스크립트로 악성코드를 인메모리로 실행하는데, LSTM과 Frequency 모델을 앙상블하여 이를 탐지


* [DB 스냅샷 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp1/)(기여도 100%)
  * 기술 스택 : Python, Pyqt5, 크롤링
  * 기간 : 2020.01월 ~ 2020.02
  * 인원 : 1명
  * 나의 역할 : DB 크롤링 제작
  * Github : 비공개
  * 설명 : DB를 스냅샷하여 원하는 정보 검색 및 테이블 별 CSV 추출

* [근처 맛집 추천 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp5/)(기여도 10%)
  * 기술 스택 : Java, 크롤링
  * 기간 : 2019.04 ~ 2019.05월
  * 인원 : 8명(팀원 역할)
  * 나의 역할
    * kakao 지도에서 맛집을 크롤링하는 알고리즘 제작(기여도 100%)
  * Github : [https://github.com/pnu-005-team1/projectTeam1](https://github.com/pnu-005-team1/projectTeam1)
  * 설명 : 안드로이드 텀 프로젝트로 진행한 근처 맛집 추천 프로젝트로써, Kakao 지도에서 음식점들을 크롤링하여 별 개수와 카테고리/지역별로 맛집을 가져와서 추천함

* [택시 주행 시뮬레이터 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp7/)(기여도 60%)
  * 기술 스택 : Python, Pyqt5
  * 기간 : 2020.02 ~ 2020.06
  * 인원 : 3명(팀장 역할)
  * 나의 역할 
    * Pyqt5와 Qtdesigner_tool을 사용하여 Mainwindow와 Subwindow, Grid map User Interface 제작(기여도 80%)
    * BFS & DFS 알고리즘을 제작하여 고객 생성시 근처 차량 클래스의 값을 비교 및 검색, 최적의 결과 도출(기여도 100%)
    * map의 개수를 10개로 제한하고 편의를 위해 각각의 map정보를 txt로 받아와 변환, 가공하여 Map에 저장(기여도 100%)
    * Grid map에 state 별로 차량 및 고객, 도로 표시함수 제작(기여도 80%)
  * Github : [https://github.com/ghkdqhrbals/GraduateProject](https://github.com/ghkdqhrbals/GraduateProject)
  * 과제 발표자료 : [https://ghkdqhrbals.github.io/portfolios/assets/img/terms/주행시뮬레이터.pdf](https://ghkdqhrbals.github.io/portfolios/assets/img/terms/주행시뮬레이터.pdf)
  * 설명 : 택시가 동승이 가능할 때 인구 수에 따른 최적의 택시 수를 분석

* [포트폴리오 웹 개발 프로젝트](https://ghkdqhrbals.github.io/portfolios/docs/기타/toyp6/)(기여도 100%)
  * 기술 스택 : HTML, CSS, AWS, NGINX
  * 기간 : 2022.08월 ~ 2022.09 
  * 인원 : 1명 
  * 나의 역할
    * 프론트 엔드 개발
    * 리버스 프록시 설정 및 AWS 배포
  * Github : [https://github.com/ghkdqhrbals/portfolio](https://github.com/ghkdqhrbals/portfolio)
  * 설명 : 프론트 프로젝트로써 AWS-EC2 에 리버스 프록시와 React 서버를 함께 배포함

* 블록체인 기반 친환경 에너지 거래 플랫폼 프로토타입(기여도 50%)
  * 기술 스택 : Python, 합의 알고리즘
  * 기간 : 2021.03 ~ 2021.06
  * 인원 : 2명
  * 나의 역할
    * 새로운 합의 알고리즘 개발(기여도 40%)
      * 블록 생성자 결정 : `𝑀𝑖𝑛𝑒𝑟=𝑀𝑎𝑥_𝐴𝑑𝑑𝑟(ℎ𝑎𝑠ℎ(𝑃𝑟𝑒𝑣𝐵𝑙𝑜𝑐𝑘𝐻𝑎𝑠ℎ,𝐴𝑑𝑑𝑟)`
      * 블록 완결 : `∑(0<𝑖<𝑑)𝑅𝐸100_𝑖^𝑎𝑔𝑟𝑒𝑒 ≥2/3 𝑅𝐸100_𝑡𝑜𝑡𝑎𝑙`
    * 프로토타입 개발(기여도 80%)
  * Github : [https://github.com/ghkdqhrbals/blockchain-with-python](https://github.com/ghkdqhrbals/blockchain-with-python)

## 논문
* [이더리움 이클립스 공격 논문](https://ghkdqhrbals.github.io/portfolios/docs/Blockchain/)(기여도 100%)
  * 기술 스택 : 이더리움 블록체인, Golang, DDoS/이클립스 공격, Kademlia DHT, 노드탐색 프로토콜, 멀티코어 병렬 처리
  * 기간 : 2020.09 ~ 2022.08
  * 인원 : 2명(1 저자)
  * 나의 역할
    * 이더리움 클라이언트 코드레벨 분석
    * 이더리움 구현 취약점 분석
    * 새로운 이클립스 공격
    * 이클립스 공격 실험증명
  * Github : 비공개
  * 논문 : [https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502](https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502)
  * 논문소개(English) : [https://sites.google.com/view/master-thesis-hwangbogyumin/](https://sites.google.com/view/master-thesis-hwangbogyumin/)
  * 설명 : 이더리움 채굴자들의 85% 이상은 Geth 라는 클라이언트 프로그램을 통해 이더를 채굴합니다. 본 프로젝트는 이 Geth 를마비시켜 채굴을 할 수 없도록 공격하는 프로젝트입니다.
  * 상세설명 : 채굴을 위해서는 P2P 상에서 다른 노드들과 연결되어야지만 채굴이 가능합니다. 이유는 다른 노드들로부터 최신의 블록 해시를 받아오고 이를 통해 다음 블록을 채굴하기 때문이죠. 따라서 얼마나 노드들과 잘 연결되어있는지가 중요합니다. 하지만 노드들과 연결될 수 없다면 어떨까요? 채굴을 할 수 없게 되겠죠. 본 프로젝트는 하나의 노드를 마비시켜 다른 노드들과 연결될 수 없도록 DDoS 공격을 수행합니다. 결과로 채굴이 불가능해집니다.

* [이더리움 이클립스 분석 논문](https://ghkdqhrbals.github.io/assets/img/EthereumEclipseAttackAnalysis.pdf)(기여도 100%)
  * 기술 스택 : 이더리움 블록체인, 이클립스 공격, P2P 프로토콜
  * 기간 : 2020.09 ~ 2020.12
  * 인원 : 3명(1 저자)
  * 나의 역할
    * 이더리움 이클립스 공격 논문 정리
  * 설명 : 이더리움 클라이언트에 이클립스 공격을 진행한 논문들을 분석 및 클라이언트 버전 별 정리

## 외부 활동
* 특허 출원
  * 블록체인 클라이언트 취약점 탐지 방법 및 취약점 탐지 장치(2022.01 ~ 2022.12)
* 학술대회 참여
  * [N-gram과 위협 행위 기반의 Windows 악성코드 패밀리 주요 유형 패턴 분석](http://sso.riss.kr:11301/cdc_read_relay.jsp)(2021.12)
* SW 등록
  * RE100(알이100) 실현을 위한 블록체인 기반 REC(신재생에너지공급인증서) 거래 플랫폼 프로토타입 [C-2021-044149](https://www.ntis.go.kr/outcomes/popup/srchTotlSpwr.do?cmd=view&rstId=SNW-2021-00312106034&returnURI=null&pageCode=RI_SW_RST_DTL)(2021.09 ~ 2021.11)
* 대회 참여
  * 해커톤 대회 : Convergence Security Graduate School Hackathon Competition (2021.09 ~ 2021.11)
  * AI 대회(4등) : 2021 Cybersecurity AI/big data challenge, Korea Internet & Security Agency(KISA) - 파일리스 악성코드탐지 부문(2021.09 ~ 2021.12)
  * 개인정보보호 대회참여(3등) : 2020 K-cyber security challenge, Korea Internet & Security Agency(KISA) - 개인정보보호 부문(2020.09 ~ 2020.12)
* SW 해외교육
  * 미국 산호세 주립대학 San Jose State Univ. 1 Washinton Square, CA, USA (2019.06 ~ 2019.09)
* 계절학기 교환학생
  * 말레이시아 헬프 대학 HELP Univ. Bukit Damansara 50490 Kuala Lumpur, Malaysia (2017.12 ~ 2018.03)