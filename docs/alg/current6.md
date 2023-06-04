---
layout: default
title: H-Index
parent: 알고리즘 문제
nav_order: 6
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/42747)


### 문제 설명

H-Index는 과학자의 생산성과 영향력을 나타내는 지표입니다. 어느 과학자의 H-Index를 나타내는 값인 h를 구하려고 합니다. 위키백과1에 따르면, H-Index는 다음과 같이 구합니다.
어떤 과학자가 발표한 논문 n편 중, h번 이상 인용된 논문이 h편 이상이고 나머지 논문이 h번 이하 인용되었다면 h의 최댓값이 이 과학자의 H-Index입니다.
어떤 과학자가 발표한 논문의 인용 횟수를 담은 배열 citations가 매개변수로 주어질 때, 이 과학자의 H-Index를 return 하도록 solution 함수를 작성해주세요.


### 생각할 점
1. 간단하게 생각한다면, for i in range(1001)로 루프 돌리기
2. citations sort 해서 인덱스 기반 크기 계산 가능. 그러면 N = 논문개재수, 시간복잡도 = O(N^2) ~= N(N-1)/2
3. 초기에 sorting 잘해야한다. += 느낌으로 

### Code

```python
from collections import defaultdict
def solution(citations):
    answer = 0
    citations.sort(key=lambda x:x, reverse=True)
    d = defaultdict(int)
    cur = 0
    for c in citations:
        cur+=1
        d[c]=cur
    length = len(citations)
    before = 0
    for i in range(1000,-1,-1):
        if d[i] != 0:
            before = d[i]
        d[i] = before
    
    for i in range(1000,-1,-1):
        if d[i] >= i:
            return i
            
    return answer
```