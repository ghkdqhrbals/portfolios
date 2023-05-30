---
layout: default
title: 타겟 넘버
parent: 알고리즘 문제
nav_order: 5
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/43165)


### 문제 설명

n개의 음이 아닌 정수들이 있습니다. 이 정수들을 **순서를 바꾸지 않고** 적절히 **더하거나 빼서** 타겟 넘버를 만들려고 합니다. 예를 들어 [1, 1, 1, 1, 1]로 숫자 3을 만들려면 다음 다섯 방법을 쓸 수 있습니다.

```
-1+1+1+1+1 = 3
+1-1+1+1+1 = 3
+1+1-1+1+1 = 3
+1+1+1-1+1 = 3
+1+1+1+1-1 = 3
```

사용할 수 있는 숫자가 담긴 배열 numbers, 타겟 넘버 target이 매개변수로 주어질 때 숫자를 적절히 더하고 빼서 타겟 넘버를 만드는 방법의 수를 return 하도록 solution 함수를 작성해주세요.

* 제한사항
주어지는 숫자의 개수는 2개 이상 20개 이하입니다.
각 숫자는 1 이상 50 이하인 자연수입니다.
타겟 넘버는 1 이상 1000 이하인 자연수입니다.

### 생각할 점
1. 간단하게 dfs 로 풀면 되겠어요. `q=deque()` 만들고  초기에 (number 인덱스, 합) 형식으로 다음의 두가지를 init 할거에요. (0,num) (0,-num)
2. 그리고 while 문 내에서 dfs를 pop, append 돌리다가 인덱스가 `len(numbers)` 에 도달하고 타겟과 합이 같다면 `answer+=1` 해주면 될것같습니다. 

### Code
```python
from collections import deque
def solution(numbers, target):
    answer = 0
    q = deque()
    q.append((0,numbers[0]))
    q.append((0,-numbers[0]))
    length = len(numbers)
    
    while q:
        cur, sums = q.pop()
        
        if cur == length-1 and sums == target:
            answer+=1
            continue
        
        if cur <= length-2:
            q.append((cur+1,sums+numbers[cur+1]))
            q.append((cur+1,sums-numbers[cur+1]))
    
    return answer
```