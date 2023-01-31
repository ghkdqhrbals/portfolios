---
layout: default
title: 뱅킹 서버 프로젝트
nav_order: 4
has_children: true
---

# **뱅킹 백엔드 서버** [Github](https://github.com/ghkdqhrbals/golang-backend-master){: .btn .btn-black .fs-3 .mb-4 .mb-md-0 }
* **개요** : Golang 으로 제작된 뱅킹 RestAPI 제공 백엔드 서버입니다
* **기간** : 2022.06 ~ 2022.09 (4개월)
* **인원** : 1인

| 사용기술     | 내용                                                                                                                    |
|:---------|:----------------------------------------------------------------------------------------------------------------------|
| AWS      | Git-workflow 로 연동하여 CI/CD 파이프라인 구축 [Image](https://ghkdqhrbals.github.io/assets/img/golang/deploy.jpeg)               |
| JWT | 인증토큰으로 세션유지 리소스 최적화                                                                                                   |
| Bcrypt | HASH(password + salt) 로 안전한 DB 저장 [Image](https://ghkdqhrbals.github.io/assets/img/golang/safe-password-storing.jpeg) 
| Sqlc | sql문 인터페이스화                                                                                                           |
| Docker/K8S | 서버+DB CI                                                                                                              |
| Gin | RestApi 구현 [Details](https://github.com/ghkdqhrbals/golang-backend-master/wiki/ghkdqhrbals:gin)                       |
| Viper | 외부 configuration 의존성 주입 [Details](https://github.com/ghkdqhrbals/golang-backend-master/wiki/ghkdqhrbals:viper)        |
| Gmock | mock test [Details](https://github.com/ghkdqhrbals/golang-backend-master/wiki/ghkdqhrbals:mockdb)                     |
