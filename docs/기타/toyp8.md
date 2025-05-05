---
layout: default
title: 😈 악성코드 유형 별 대표 특성 추출 프로젝트
date: 2021-12-01
parent: 토이 프로젝트
nav_order: 2
---

**해당 프로젝트는 국가연구과제 수행 중, 2015 Window malware dataset을 대상으로한 N-gram 기반 악성코드 패턴추출 프로젝트입니다.**

* 참여인원 : 5인 팀(팀원 역할)
* 기간 : 2021년 09월 ~ 2021년 12월(3개월)
* 나의 역할
  * ✍️ 윈도우 악성코드 데이터 분석
  * 💡 N-gram 기반 악성코드 대표 특성 도출
* Github : 비공개

### 💡 **N-gram 기반 악성코드 대표 특성 도출**
* step 1 : Malware assembly file에서 .text section의 opcode를 추출합니다
* step 2 : 1-gram부터 9-gram까지 opcode pattern의 빈도수를 추출합니다
* step 3 : 유형별 악성코드 파일에서 opcode pattern이 나타나는 비율 측정 후, 다른 유형과 차이를 가지는 대표 opcode pattern 추출합니다

![p1](../../../assets/img/etc/1.png)

### 결과
혹시 모를 라이센스 문제로 일정 부분만 표시하겠습니다.
![p1](../../../assets/img/etc/2.png)

|**악성코드 유형** |**분류 정확도**|
|--|--|
|Ramnit |98.61%|
|Lollipop |97.22%|
|Kelihos_v3 |99.38%|
|Vundo |99.38%|
|Tracur |99.54%|
|Kelihos_ver1 |100%|
|Gatak |97.99%|
