---
layout: default
title: Projects
nav_order: 2
---

# Projects

## **채팅 백엔드 서버** [개발과정](https://ghkdqhrbals.github.io/categories/%EC%B1%84%ED%8C%85%EC%84%9C%EB%B2%84-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/){: .btn .btn-primary .fs-3 .mb-4 .mb-md-0 .mr-2 } [Github](https://github.com/ghkdqhrbals/spring-chatting-server){: .btn .btn-black .fs-3 .mb-4 .mb-md-0 }
> * **개요** : Spring-Java 기반 실시간 채팅 백엔드 서버입니다
> * **사용기술**
> 1. Elastic Search + Logstash + Kibana 를 통한 통계수집/시각화 [Image](https://ghkdqhrbals.github.io/assets/img/es/5.png)
> 2. Kafka : 백본망(broker:3대)
> 3. Debezium/JDBC-Sink-connector : 백업 DB uni-directional sync
> 4. Docker : 모든 과정 도커라이징을 통한 CI(15개 컨테이너 동작)
> 5. API Gateway(nginx) : 2대의 채팅서버 및 1대의 인증서버를 묶어서 통합 RestApi entry point 제공
> 6. STOMP : 웹소켓을 통한 채팅 실시간성 제공
> * **아키텍처**
> ![chattingBackendArchitecture](../../assets/images/architectures.png)



## **뱅킹 백엔드 서버** [Github](https://github.com/ghkdqhrbals/golang-backend-master){: .btn .btn-black .fs-3 .mb-4 .mb-md-0 }
> * **개요** : Golang 으로 제작된 뱅킹 RestAPI 제공 백엔드 서버입니다
> * **사용기술**
> 1. AWS + Git workflow 서비스를 통한 CI/CD 파이프라인 구축 [Image](https://ghkdqhrbals.github.io/assets/img/golang/deploy.jpeg)
> 2. JWT/PASETO : 인증토큰으로 세션유지 리소스 최적화
> 3. Bcrypt : HASH(password + salt) 로 안전한 DB 저장 [Image](https://ghkdqhrbals.github.io/assets/img/golang/safe-password-storing.jpeg)
> 4. Sqlc : SQL문 인터페이스화
> 5. Docker + Kubernetes : CI 및 수평확장
> 6. Gin : Gin 라이브러리를 통한 RestApi 구현 [Details](https://github.com/ghkdqhrbals/golang-backend-master/wiki/ghkdqhrbals:gin)
> 7. Viper : configuration 자동설정 [Details](https://github.com/ghkdqhrbals/golang-backend-master/wiki/ghkdqhrbals:viper)
> 8. Gmock : mock test [Details](https://github.com/ghkdqhrbals/golang-backend-master/wiki/ghkdqhrbals:mockdb)
> * **플로우**
> ![golang-architecture](../../assets/images/api-multi-thread.jpeg)
>

## **다중 Geth 취약점을 이용한 블록체인 이클립스 공격 설계** [논문확인](https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502){: .btn .btn-blue .fs-3 .mb-4 .mb-md-0 }
> * **개요** : Golang으로 제작된 이더리움 클라이언트(~1.9.25v)를 마비시키는 공격설계 논문입니다
> * **사용기술**
> 1. DDoS : UDP-based 분산 DoS 공격을 통한 노드의 연산 자원을 강제로 소모되도록 유도
> 2. Ethereum-analysis : 이더리움 Geth 클라이언트의 라우팅 테이블 분석을 통한 내부구조 확인
> 3. IP 변환 : UDP-based DoS공격 + IP 변환을 통해 희생자 노드의 공격방어율 하락 유도
> 4. HeartBeat : 희생자 노드의 HeartBeat 관측을 통해 공격 패킷개수 최적화
> * **아키텍처**
> ![attack](../../assets/images/attack.png)


## **블록체인 기반 친환경 에너지 거래 플랫폼 프로토타입** [Github](https://github.com/ghkdqhrbals/blockchain-with-python){: .btn .btn-black .fs-3 .mb-4 .mb-md-0 }
> * **개요** : python으로 제작된 블록체인 기반 친환경 에너지 거래 플랫폼의 프로토타입입니다. 합의 알고리즘에 집중하였습니다.
> * **사용기술**
> 1. 블록 생성자 결정 : Consensus-algorithm 의 PBFT 합의 알고리즘 기반 2-stage 합의 알고리즘 생성 `𝑀𝑖𝑛𝑒𝑟=𝑀𝑎𝑥_𝐴𝑑𝑑𝑟 (ℎ𝑎𝑠ℎ(𝑃𝑟𝑒𝑣𝐵𝑙𝑜𝑐𝑘𝐻𝑎𝑠ℎ,𝐴𝑑𝑑𝑟)`
> 2. 블록 완결 : `∑(0<𝑖<𝑑)𝑅𝐸100_𝑖^𝑎𝑔𝑟𝑒𝑒 ≥2/3 𝑅𝐸100_𝑡𝑜𝑡𝑎𝑙`

## **빈도수 모델을 통한 악성 파워쉘 스크립트 탐지**
> * **개요** : python으로 제작된 Fileless Malware 중 파워쉘 스크립트 탐지 툴입니다.
> * **사용기술** [논문 분석 자료](https://ghkdqhrbals.github.io/assets/img/golang/study-powershell-malware.pdf){: .btn .btn-red .fs-2 .mb-4 .mb-md-0 }
> 1. Pattern Analysis : Fileless Malware 의 특성인 메모리 상 동작하는 악성 스크립트의 패턴을 분석
> 2. Powershell Malware Analysis : 악성 파워쉘 스크립트의 패턴을 분석
> 3. 비난독화 : 난독화 된 악성 스크립트를 탐지를 위해 비난독화 진행(base64-encoding + etc.)
> 4. TF-IDF : 빈도수 기반 모델 사용
>
> * **아키텍처**
> ![attackon](../../assets/images/powershell2.png)