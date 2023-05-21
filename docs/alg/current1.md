---
layout: default
title: 프로세스
parent: 알고리즘 문제
nav_order: 1
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/42583)

### 생각할 점
큐에서 꺼냈을 때, 남아있는 프로세스 중 우선순위가 높은 것을 확인해야합니다. 이 때, 단순히 전부 확인한다면 확인작업의 시간복잡도는 1/2*O(N^2) 입니다. 따라서 별도의 스택으로 남아있는 우선순위를 관리하는 것이 효율적입니다. 그렇게 되면 시간복잡도는 O(1)입니다.

### Code
```python
from collections import deque
def solution(priorities, location):
    answer = 0
    stack = sorted(priorities) # 별도의 스택
    q = deque([(index,priority) for index, priority in enumerate(priorities)])
    while True:
        idx,p = q.popleft()
        if p < stack[-1]: # 남아있는 프로세스 중 큰 우선순위가 존재할 때
            q.append((idx,p))
        else:
            if idx == location: 
                answer+=1
                return answer
            else: # 정렬된 별도의 스택에서 pop 하여 우선순위 제거해주기 
                answer+=1
                stack.pop()
    
    return answer
```