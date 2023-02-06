---
layout: default
title: 악성코드 패턴추출 프로젝트
parent: 토이 프로젝트
nav_order: 2
---

**이 프로젝트는 아래의 2015 Window malware dataset을 대상으로한 N-gram 기반 악성코드 패턴추출 프로젝트입니다.**

|Malware Name|데이터 개수|
|---|----|
|Ramnit|  1541|
|Lollipop | 2478|
|Kelihos_v3 |2942|
|Vundo |475|
|Simda |42|
|Tracur |751|
|Kelihos_ver1 |398|
|Gatak |1013|

## N-gram 기반 악성코드 대표 특성 도출
  * step 1 : Malware assembly file에서 .text section의 opcode를 추출
  * step 2 : 1-gram부터 9-gram까지 opcode pattern의 빈도수 추출
  * step 3 : 유형별 악성코드 파일에서 opcode pattern이 나타나는 비율 측정 후, 다른 유형과 차이를 가지는 대표 opcode pattern 추출

![p1](../../../assets/img/etc/1.png)

## 결과
혹시 모를 라이센스 문제로 일정 부분만 표시하겠습니다.
![p1](../../../assets/img/etc/2.png)
