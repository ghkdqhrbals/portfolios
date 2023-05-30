---
layout: default
title: 모음 사전
parent: 알고리즘 문제
nav_order: 4
---

### Reference

[프로그래머스](https://school.programmers.co.kr/learn/courses/30/lessons/84512)


### 문제 설명

사전에 알파벳 모음 'A', 'E', 'I', 'O', 'U'만을 사용하여 만들 수 있는, 길이 5 이하의 모든 단어가 수록되어 있습니다. 사전에서 첫 번째 단어는 "A"이고, 그다음은 "AA"이며, 마지막 단어는 "UUUUU"입니다.

단어 하나 word가 매개변수로 주어질 때, 이 단어가 사전에서 몇 번째 단어인지 return 하도록 solution 함수를 완성해주세요.

* 제한사항
word의 길이는 1 이상 5 이하입니다. word는 알파벳 대문자 'A', 'E', 'I', 'O', 'U'로만 이루어져 있습니다.

### 생각할 점-1
1. 먼저 알파벳들을 숫자로 치환해 봅니다. 예로 A->1, E->2로 말이죠. 그리고 아무것도 매칭되지 않으면 0으로 치환해봅니다. 그러면 `AAAE` == `11120` 으로 되겠죠?
2. 효율성을 늘리기 위해서 하나씩 검색하는 것이 아닌, 건너뛰어볼까 합니다. 예로 `11120`의 `2` 이면, ((5-4)^5-1)/(5-1)*`2`+1 그렇다면 등비수열과 맞물려집니다.

### Code
```python
def solution(word):
    answer = 0
    
    for i, n in enumerate(word):
        answer += (5 ** (5 - i) - 1) / (5 - 1) * "AEIOU".index(n) + 1
    return answer
```