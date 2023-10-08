---
layout: default
title: 쿠버네티스 생명 주기
parent: 도커와2
nav_order: 6
---

> #### Reference
> * 도서 : 컨테이너 인프라 환경 구축을 위한 쿠버네티스/도커
> * [https://dzone.com/articles/kubernetes-lifecycle-of-a-pod](https://dzone.com/articles/kubernetes-lifecycle-of-a-pod)


1. 유저는 kubectl 명령어를 통해 API 서버 파드 생성을 요청합니다
2. API 서버는 파드의 생성 요청을 etcd 에 기록합니다
3. API 서버는 