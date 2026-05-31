---
layout: default
title: 새로운 블록체인 합의 알고리즘 설계
date: 2021-09-01
summary: "해당 프로젝트는 석사 연구과정 중, 텀 프로젝트로 블록체인 합의알고리즘을 새롭게 설계한 프로젝트입니다."
parent: 토이 프로젝트
nav_order: 4
---

**해당 프로젝트는 석사 연구과정 중, 텀 프로젝트로 블록체인 합의알고리즘을 새롭게 설계한 프로젝트입니다.**

* 참여인원 : 2인 팀(공동 팀장 역할)
* 기간 : 2021년 09월 ~ 2021년 10월(1개월)
* 나의 역할
   * 📃 기존 에너지 거래 방식 한계점 분석
   * ✍️ 2-stage 합의 알고리즘 설계
* Github : [https://github.com/ghkdqhrbals/blockchain-with-python](https://github.com/ghkdqhrbals/blockchain-with-python) 

### 📃 **기존 에너지 거래 방식 한계점 분석**

<details><summary> 한계점 및 제안하는 블록체인 플랫폼 </summary><div markdown="1">

### 기존 에너지 거래 방식 한계점

![img](../../../assets/img/terms/5.png)

> * 한국 전력 공사의 계약 독점
> * 계약 무결성 침해 위험 존재
> * 계약 수수료 발생
> * 수동화 계약으로 인한 비효율성

### 제안하는 에너지 거래 블록체인 플랫폼

![img](../../../assets/img/terms/6.png)

> * 지속적으로 변하는 블록 채굴자에게 계약 위임
> * 계약 무결성 보존
> * 채굴자에게 계약 수수료 지급
> * 자동화 계약으로 인한 효율성

</div></details>

### ✍️ **2-stage 합의 알고리즘 설계**

<details><summary> 2-stage 합의 알고리즘 </summary><div markdown="1">

### 트랜젝션 설계

1. Not signed by Supplier : 트랜잭션 전송

| FROM(ID) | ENERGY | MONEY | TO(ID) |   signature1   | signature2 | Fee |
|:--------:|:------:|:-----:|:------:|:--------------:|:----------:|:---:|
|    Amy   |   50   |  41$  |   M1   |  Sig(Amy, Tx1) |    NULL    |  5% |
|    Bob   |   30   |  22$  |   M3   |  Sig(Bob, Tx2) |    NULL    |  7% |
|   Chen   |   20   |  56$  |   M2   | Sig(Chen, Tx3) |    NULL    |  3% |
|    ...   |   ...  |  ...  |   ...  |        …       |      …     |  …  |

2. Signed by Supplier : 서명 후 트랜잭션에 담기

| FROM(ID) | ENERGY | MONEY | TO(ID) |   signature1   |      signature2      | Fee |
|:--------:|:------:|:-----:|:------:|:--------------:|:--------------------:|:---:|
|    Amy   |   50   |  41$  |   M1   |  Sig(Amy, Tx1) | Sig(M1,Sig(Amy,Tx1)) |  5% |
|    Bob   |   30   |  22$  |   M3   |  Sig(Bob, Tx2) | Sig(M2,Sig(Bob,Tx2)) |  7% |
|   Chen   |   20   |  56$  |   M2   | Sig(Chen, Tx3) |         NULL         |  3% |
|    ...   |   ...  |  ...  |   ...  |        …       |           …          |  …  |

### 2-stage consensus algorithm

* 블록 생성자 결정

**𝑀𝑖𝑛𝑒𝑟=𝑀𝑎𝑥_𝐴𝑑𝑑𝑟 (ℎ𝑎𝑠ℎ(𝑃𝑟𝑒𝑣𝐵𝑙𝑜𝑐𝑘𝐻𝑎𝇽,𝐴𝑑𝑑𝑟)**

* 블록 완결

**∑(0<𝑖<𝑑)𝑅𝐸100_𝑖^𝑎𝑔𝑟𝑒𝑒 ≥2/3 𝑅𝐸100_𝑡𝑜𝑡𝑎𝑙**

### 프로토타입 결과

![img](../../../assets/img/terms/1.png)
![img](../../../assets/img/terms/2.png)
![img](../../../assets/img/terms/3.png)
![img](../../../assets/img/terms/4.png)


</div></details>