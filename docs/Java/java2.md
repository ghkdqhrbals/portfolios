---
layout: default
title: Garbage Collection
parent: Java-Spring
nav_order: 2
---

## Garbage Collection
Java에서는 new로 객체 생성하면 힙에다가 저장되잖아요? 이 때 힙 내부를 여러 단계로 나뉘어 어디에 저장하고 관리할지 정해주는게 GC입니다. 얘네는 세대교체를 베이스로 동작합니다.

### Eden Space [Young Generation]
처음 생성된 모든 객체는 에덴 영역에 저장합니다. 그리고 이게 가득 차게되면 `minor gc`를 수행합니다.

#### minor gc
얘는 아래와 같이 여러 단계로 나뉘어 집니다.
1. `Eden`이 가득 차게 되면, 현재 사용중인 스레드 다 스톱시키고, 참조중인 객체가 있으면 `S0` 영역에다가 객체를 옮깁니다. `Eden`은 이 때 전부 비워집니다.
2. `Eden`이 한번더 가득 차게 되면, `S0`과 `Eden`에서 여전히 참조중인 애들을 `S1`로 옮깁니다.  `S0`과 `Eden`은 비워집니다.
3. `S0`과 `S1`를 스위칭 합니다.(스위칭 하기 전에 S1에 age가 높은 애가 있으면, `Tenured`에 옮깁니다)  `S1`와 `Eden`은 비워진 상태입니다.
4. 이제 2,3번 과정을 반복합니다.

#### major gc
이제 `Tenured` 영역이 가득차면 이게 실행됩니다.
1. `Tenured`에서 참조중이지 않으면 제거합니다.
2. 메모리를 앞으로 쭉 re-arrange해서 사이 공간이 없도록 합니다.(**다이나믹 GC**)