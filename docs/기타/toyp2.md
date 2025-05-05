---
layout: default
title: s파워쉘 악성 스크립트 탐지 프로젝트
date: 2021-09-01
parent: 토이 프로젝트
nav_order: 2
---

**해당 프로젝트는 KISA에서 주최한 2021 사이버보안 AI*빅테이터 경진대회의 본선에서 진행한 프로젝트입니다.**

* 참여인원 : 3인 팀(팀장 역할)
* 기간 : 2021년 09월 ~ 2021년 12월(3개월)
* 나의 역할
  * ✍️ 윈도우 파일리스 악성코드 데이터 분석
  * 📃 파일리스 악성코드 탐지 논문 정리
  * 💡 파일리스 악성코드 탐지 모델 개발
* Github : [https://github.com/ghkdqhrbals/Malware_LSTM](https://github.com/ghkdqhrbals/Malware_LSTM)
* 결과 : 4등

### ✍️ 윈도우 파일리스 악성코드 데이터 분석

<details><summary> 파일리스 악성코드 분석 </summary><div markdown="1">

윈도우에 악성코드가 **메모리**로 삽입되기 위해서는 대부분 Powershell 스크립트를 사용합니다.

**대부분의 탐지는 디스크를 분석하며 탐지**하기에, 메모리상에서만 존재하는 악성코드를 잡기란 쉽지 않습니다.

따라서 우리는 애초에 메모리에 삽입되는 스크립트를 잡아야 하는것이죠!

![p1](../../../assets/img/malware/4.png)

위에서 보이는 Stage는 파일리스 악성코드의 공격 Stage 입니다. 메모리에 악성코드 스크립트가 삽입되기까지 Stage 1,2 에서 우회를 하고 최종적으로 Stage 3에서 실행되죠. 

이러한 공격방법에서는 공격자는 Powershell 을 많이 사용합니다. **Powershell 이 권한획득/우회 에 있어 매우 강력**하기 때문이죠!

![p1](../../../assets/img/malware/5.png)

아래는 WMI 를 통한 파일리스 악성코드 실행 순서입니다.

![p1](../../../assets/img/malware/6.png)
![p1](../../../assets/img/malware/7.png)
![p1](../../../assets/img/malware/8.png)
![p1](../../../assets/img/malware/9.png)
![p1](../../../assets/img/malware/10.png)
![p1](../../../assets/img/malware/11.png)
![p1](../../../assets/img/malware/12.png)
![p1](../../../assets/img/malware/13.png)
![p1](../../../assets/img/malware/14.png)

위의 과정을 지나면 아래와 같이 윈도우 시스템 프로퍼티에다가 스크립트가 박힙니다. 

이를 통해 공격자는 **백도어**를 쉽게 구성할 수 있어요.

![p1](../../../assets/img/malware/15.png)

그래서 종합해보면, 아래와 같이 종합해볼 수 있어요.

![p1](../../../assets/img/malware/16.png)

파일리스는 권한획득/우회 가 쉬운 PowershellScript 를 통해 들어오며, 난독화를 거쳐, 윈도우 기본 라이브러리인 WMI 에 접근합니다. 이 WMI 를 통해 공격자는 시스템이 재부팅될 때 공격 스크립트를 자동으로 실행시킬 수 있어요(이를 지속성-Persistance 라고 합니다).

</div></details>

### 📃 파일리스 악성코드 탐지 논문 정리

<details><summary> 논문 정리 </summary><div markdown="1">

현재(2021년 9월) 눈여겨볼 논문들은 총 **8개**로 아래와 같이 정리해보았습니다.

![p1](../../../assets/img/malware/18.png)

이 때 같은 데이터셋을 가지고 탐지하는 모델끼리 비교하는 것이 모델성능을 비교하기에 좋습니다.

따라서 **Pulling Back the certain on EncodedCommand PowerShell Attacks** 이라는 기술문서의 데이터셋을 공통적으로 처리하는 모델 5가지를 비교하려고 합니다(그 중 대표되는 논문인 AST-Based Deep Learning for Detecting Malicious PowerShell 만 기술하겠습니다. 다른 논문정리는 다음 링크를 확인해주세요! [파일리스 악성코드 분석 자료](https://ghkdqhrbals.github.io/assets/img/golang/study-powershell-malware.pdf)).

<details><summary> AST-Based Deep Learning for Detecting Malicious PowerShell 논문 정리 </summary><div markdown="1">

먼저 **데이터셋 정제단계**입니다. 아래와 같이 AST(Abstract Syntax Tree) 로 스크립트를 정제합니다.
![p1](../../../assets/img/malware/20.png)

이후에 정제된 AST를 가지고 RF(랜덤 포레스트)로 가기전에 아래와 같이 벡터화를 시켜야해요. 여기서 단순히 원-핫으로 각각의 AST 노드들을 인코딩하기에는 악성코드가 가지는 특성을 가지지 못하겠죠? **원-핫은 서로 연관관계를 벡터만 봤을 때 알 수 없기 때문이죠**.
![p1](../../../assets/img/malware/21.png)

**이 논문이 가지는 고유특성이 아래에서 드러납니다**. 얘네는 코드간의 연관관계를 가지는 벡터를 직접 커스터마이징 했어요. Type들은 AST 노드들이구요. AST 노드 간 연관관계를 tanh 로 임의특성을 넣어주고, Weight를 `자식노드의 자식개수`/`부모노드의 자식개수` 에 영향받도록 설정하였습니다. 
![p1](../../../assets/img/malware/22.png)

만약 위의 예시처럼 AST 노드가 구성된다면 아래와 같이 벡터를 구할 수 있겟죠?
![p1](../../../assets/img/malware/23.png)

여기서 cost function을 구성할 때, 아래와 같이 `||vec(p)-vec'(p)||^2`로 구하게 된다면 `d`는 0에 빠르게 수렴하게 됩니다. 즉, overfitting된다는 얘기이죠.
![p1](../../../assets/img/malware/24.png)

그래서 L2 norm 을 적용시켜서 오버피팅을 아래와 같이 막게 됩니다.
![p1](../../../assets/img/malware/25.png)

아래와 같이 AST 노드의 특성이 구별됨과 동시에 서로의 연관관계를 알 수 있죠?
![p1](../../../assets/img/malware/26.png)

결론적으로 랜덤 포레스트 모델 적용 후, Confusion 매트릭스 확인해보면 아래와 같은 결과가 도출됩니다.
![p1](../../../assets/img/malware/27.png)

아쉬운 점은 데이터셋 편향에 대한 처리(예로 Duplication으로 복제시키는 방법)가 부족했습니다. 또한 SET 탐지 결과가 ShellCode Inject로 나오는 것과 같이 성능또한 부족했습니다.

</div></details>

</div></details>



### 💡 파일리스 악성코드 탐지 모델 개발

<details><summary> 사용 모델 아키텍처 및 결과 </summary><div markdown="1">

## Frequency Model 을 통한 특성 도출

![p1](../../../assets/img/terms/11.png)
![p1](../../../assets/img/terms/12.png)
![p1](../../../assets/img/terms/13.png)
![p1](../../../assets/img/terms/14.png)
![p1](../../../assets/img/terms/15.png)

## 결과
정밀도 : 0.8562
재현율 : 0.7057
F1-score : 0.7737

## 후기
사실 LSTM 과 TF-IDF 를 앙상블하여 모델링 해보았지만, LSTM 이 악성 스크립트를 잘 학습하지 못했습니다. **아마 AST 로는 악성 스크립트의 특성이 반영되지 못한게 가장 큰 이유가 아닐까 생각합니다**. 따라서 앙상블을 중간에 제외하고 TF-IDF 로만 반영하여 학습하였습니다.

그리고 대부분의 제공된 데이터셋은 난독화가 되어 있었습니다. 따라서 해당 부분을 비난독화하고자 Revoke Expression/PowerDecoder 등 여러 툴을 사용하여 진행하였지만, **약 5%는 난독화가 제대로 진행되지 않았습니다**. 즉, 모델학습에 치명적인 결과를 초래한다는 것이죠! 결과로 꽤 낮은 정밀도가 나왔다고 생각합니다. 

</div></details>


