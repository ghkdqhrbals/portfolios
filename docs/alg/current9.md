---
layout: default
title: 가장 먼 노드
parent: 알고리즘 문제
nav_order: 9
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/49189)

### 문제 설명

n개의 노드가 있는 그래프가 있습니다. 각 노드는 1부터 n까지 번호가 적혀있습니다. 1번 노드에서 가장 멀리 떨어진 노드의 갯수를 구하려고 합니다. 가장 멀리 떨어진 노드란 최단경로로 이동했을 때 간선의 개수가 가장 많은 노드들을 의미합니다.

노드의 개수 n, 간선에 대한 정보가 담긴 2차원 배열 vertex가 매개변수로 주어질 때, 1번 노드로부터 가장 멀리 떨어진 노드가 몇 개인지를 return 하도록 solution 함수를 작성해주세요.

### 생각할 점
1. 인접 딕셔너리 리스트 생성!
2. bfs로 큐 검색

### Code

```python
from collections import deque, defaultdict

def solution(n, edge):
    answer = 0
    maxSum = 0 # 최대 길이
    visited = [False for _ in range(n+1)]
    q = deque([(1,0)])
    visited[1] = True
    
    # 인접행렬 리스트 생성
    d = defaultdict(list)
    for e in edge:
        d[e[0]].append(e[1])
        d[e[1]].append(e[0])
    
    while q:
        node, cur = q.popleft()
        if maxSum < cur: # 최대 길이 갱신
            maxSum = cur
            answer = 1
        else: # 최대 길이 유지 및 노드 추가
            answer+=1
            
        # 연결 된 노드 검증
        for nextNode in d[node]:
            if visited[nextNode]:
                continue
            q.append((nextNode,cur+1)) # 방문하지 않은 노드 추가
            visited[nextNode]=True
                
    return answer
```