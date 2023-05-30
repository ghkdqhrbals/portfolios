---
layout: default
title: 전력망을 둘로 나누기
parent: 알고리즘 문제
nav_order: 3
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/86971)


### 문제 설명

n개의 송전탑이 전선을 통해 하나의 트리 형태로 연결되어 있습니다. 당신은 이 전선들 중 하나를 끊어서 현재의 전력망 네트워크를 2개로 분할하려고 합니다. 이때, 두 전력망이 갖게 되는 송전탑의 개수를 최대한 비슷하게 맞추고자 합니다.
송전탑의 개수 n, 그리고 전선 정보 wires가 매개변수로 주어집니다. 전선들 중 하나를 끊어서 송전탑 개수가 가능한 비슷하도록 두 전력망으로 나누었을 때, 두 전력망이 가지고 있는 송전탑 개수의 차이(절대값)를 return 하도록 solution 함수를 완성해주세요.

### 생각할 점
1. 트리 형태는 Cycle이 없습니다. 따라서 단순히 엣지를 끊으면 자연스럽게 두 개의 트리가 생깁니다. 또한 트리의 특성 상 엣지로 다 연결되어있기에 독립적인 노드가 없습니다. 따라서 시작은 하나의 트리입니다.
2. 송전탑 분배를 비슷하게 맞추는 것이 중요합니다. (`노드-1`,`노드-2`) 엣지를 끊었을 때, `노드-1`과 연결된 노드개수와 `노드-2`와 연결된 노드 개수차이가 작아야된다는 뜻이죠. 그렇다면 먼저 노드와 엣지리스트를 넣어주면 그와 연결된 노드개수를 반환하는 알고리즘을 생성해야합니다. 저는 bfs로 탐색할거에요.

### Code
```python
from collections import defaultdict, deque
import math

# 노드와 연결된 트리의 노드개수 구하기
# insert (노드개수, 분리된 노드, 분리된 엣지들)
def getNodeSum(numNode,node,edges):
    visited = [False for _ in range(numNode)]
    q = deque([node])
    visited[node-1] = True
    sums = 1
    while q:
        cur = q.pop()
        for nexts in edges[cur]:
            if visited[nexts-1] == False:
                sums+=1
                visited[nexts-1] = True
                q.append(nexts)
    return sums
        
        
def solution(n, wires):
    mins = n
    edges = defaultdict(list)
    
    # 엣지 dict 생성
    for wire in wires:
        edges[wire[0]].append(wire[1])
        edges[wire[1]].append(wire[0])
    
    # 엣지 dict 하나씩 빼면서 최소 절대값 구하기
    for wire in wires:
        edges[wire[0]].remove(wire[1])
        edges[wire[1]].remove(wire[0])
        
        # 방정식
        # x + y = n
        # => answer = min( |x - y| )
        # =>        = min( |2x - n| ) 
        mins = min(mins,abs(2*getNodeSum(n,wire[0],edges) - n))
        
        if mins == 0:
            return mins
        edges[wire[0]].append(wire[1])
        edges[wire[1]].append(wire[0])
    return mins
    
```