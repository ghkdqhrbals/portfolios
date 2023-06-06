---
layout: default
title: 퍼즐 조각 채우기
parent: 알고리즘 문제
nav_order: 8
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/84021)


### 생각할 점
1. 2D 좌표에서의 회전 알고리즘 생성(`x' = x*cos90 + y*sin90`,`y' = -x*sin90 + y*cos90`)
2. 퍼즐이 맞을 때, break!
3. Figure 들 영점 조준

### Code

```python
from collections import deque,defaultdict

dx = [0,0,1,-1]
dy = [1,-1,0,0]

# 초점 정렬
def realloc(fig):
    xMin = sorted(fig,key=lambda x:(x[0]))[0][0]
    yMin = sorted(fig,key=lambda x:(x[1]))[0][1]
    for f in fig:
        f[0] -= xMin
        f[1] -= yMin
    fig.sort(key=lambda x:(x[0],x[1]))

def rotate(fig):
    newFig=[]
    rotateFig =[]
    # 영점 조준
    realloc(fig)
    
    for f in fig:
        rotateFig.append([f[1],-f[0]])

    # 영점 조준
    realloc(rotateFig)

    return rotateFig

# 매트릭스 도형 파악
def findFigs(metrix,isTable):
    n = len(metrix)
    visited = [[False for _ in range(n)] for _ in range(n)]
    q = deque()
    results = []

    for i in range(n):
        for j in range(n):
            if visited[i][j] == True:
                continue

            # dfs start
            if metrix[i][j] == isTable:
                result = []
                q.append((i,j))
                visited[i][j]=True
                result.append([i,j])
                while q:
                    x,y = q.pop()
                    for z in range(4):
                        nx = x + dx[z]
                        ny = y + dy[z]
                        if 0 <= nx < n and 0 <= ny < n:
                            if visited[nx][ny]==False and metrix[nx][ny]==isTable:
                                visited[nx][ny] = True
                                result.append([nx,ny])
                                q.append((nx,ny))

                realloc(result)
                results.append(result)        
            # dfs end
            
    return results


def solution(game_board, table):
    answer = 0
    tableBlocks = {}
    boardBlocks = {}
    tableBlocksFinish = [] # blockIds
    boardBlocksFinish = []

    for idx, block in enumerate(findFigs(table,1)):
        tableBlocks[idx] = block

    for idx, block in enumerate(findFigs(game_board,0)):
        boardBlocks[idx] = block

    for k1,v1 in boardBlocks.items():
        for k2,v2 in tableBlocks.items():

            for i in range(4):

                v2 = rotate(v2)
                if v1 == v2 and not (k1 in boardBlocksFinish) and not (k2 in tableBlocksFinish):

                    answer+=len(v1)
                    boardBlocksFinish.append(k1)
                    tableBlocksFinish.append(k2)
                    break



    return answer
```