---
layout: default
title: 네트워크
parent: 알고리즘 문제
nav_order: 7
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/43162)


### 문제 설명

네트워크란 컴퓨터 상호 간에 정보를 교환할 수 있도록 연결된 형태를 의미합니다. 예를 들어, 컴퓨터 A와 컴퓨터 B가 직접적으로 연결되어있고, 컴퓨터 B와 컴퓨터 C가 직접적으로 연결되어 있을 때 컴퓨터 A와 컴퓨터 C도 간접적으로 연결되어 정보를 교환할 수 있습니다. 따라서 컴퓨터 A, B, C는 모두 같은 네트워크 상에 있다고 할 수 있습니다.
컴퓨터의 개수 n, 연결에 대한 정보가 담긴 2차원 배열 computers가 매개변수로 주어질 때, 네트워크의 개수를 return 하도록 solution 함수를 작성하시오.



### 생각할 점
1. 인접매트릭스 = computers 입니다.
2. for loop 를 n만큼 돌리면서 각 노드와 인접한 리스트를 순차검색합니다.
3. 이 때, 이미 한번 본 노드는 제외시킨다면 빠를거에요.

### Code

```python
from collections import deque
def solution(n, computers):
    answer = 0
    visited = [False for _ in range(n)]
    
    for c in range(n):
        
        # 중복 제외
        if visited[c]:
            continue
        
        q = deque([c])
        visited[c]=True
        
        # 사이클 확인 및 중복리스트 추가
        while q:
            cur = q.popleft()
            for idx,e in enumerate(computers[cur]):
                
                # 자기자신 제외
                if idx == cur:
                    continue
                    
                if e == 1 and visited[idx]==False:
                    q.append(idx)
                    visited[idx]=True
        
        # 사이클 추가
        answer+=1
    
    return answer
```