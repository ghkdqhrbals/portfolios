---
layout: default
title: 서킷 브레이커
parent: 게이트웨이
nav_order: 1
---

# 서킷 브레이커
Circuit Breaker란, 원격 접속의 성공/실패를 카운트하여 에러율(failure rate)이 임계치를 넘어섰을 때 자동적으로 접속을 차단하는 시스템입니다.

![statemachine](../../../assets/img/circuit/3.png)

# Reference
* [https://engineering.linecorp.com/ko/blog/circuit-breakers-for-distributed-services/](https://engineering.linecorp.com/ko/blog/circuit-breakers-for-distributed-services/)