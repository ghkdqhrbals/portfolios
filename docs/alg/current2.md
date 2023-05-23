---
layout: default
title: 다리를 지나는 트럭
parent: 알고리즘 문제
nav_order: 1
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/42583)

### 생각할 점
시간을 줄이기 위해 1. 다리 위 무게 총합을 미리 계산해야하며, 2. 다리 큐에 끝나는 시간을 함께 적어 시간이 되었을 때 다리에서 제거할 수 있도록 해야합니다. 나머지는 일반 구현입니다.

### Code
```python
from collections import deque

def solution(bridge_length, weight, truck_weights):
    answer = 0
    time = 1
    waiting = deque(truck_weights[1:])
    bridge = deque([(truck_weights[0], time + bridge_length)])  # 다리 큐
    bridgeWeight = truck_weights[0]  # 다리 위 무게 총합

    while bridge or waiting:
        time += 1
        w, finish = bridge[0]  # 무게, 끝나는 시간
        # 다리 위 트럭 제거가능?
        if finish == time:
            bridgeWeight -= w
            bridge.popleft()
        # 기다리는 트럭이 존재한다면,
        if waiting:
            if bridgeWeight + waiting[0] <= weight:
                truck = waiting.popleft()
                bridge.append((truck, time + bridge_length))
                bridgeWeight += truck

    return time
```