---
layout: default
title: (KR) Saga 의 두 가지 패턴 설명
parent: Micro Service Architecture
nav_order: 2
---

created at 2022-09-04
{: .label .label-yellow }

# SAGA
SAGA 패턴은 MSA에서 트랜젝션의 ACID를 보장하기위해 만든 패턴입니다. SAGA는 여러 서비스들이 연결된 방식에 따라, 관리를 어떤 방식으로 진행하는지에 따라 Orchestration/Choreography 이 두 가지의 형태를 가집니다.

## Orchestration 형태

|--|-|
|![Orchestration](../../../assets/img/msa/orche.png)| Orchestration 형태는 플로우를 `composite` 서비스가 제어합니다. <br/> 예를 들어볼까요? <br/> 잔액을 가져오는 기능을 수행하기 위해서 `A`,`B`,`C` 서비스가 순차적으로 진행되어야 한다고 가정해보겠습니다. `composite` 서비스는 `A`에게 먼저 요청을 합니다. 아무 이상이 없을 때, `B`에게 다음 요청을 진행합니다. 이 때! `B`가 에러를 반환하면 어떻게 될까요? `composite` 서비스는 `B`와 `A`에게 순차적으로 롤백을 요청하게 됩니다. <br/> 여기서 우리는 한가지를 알 수 있습니다. 바로 `A`,`B`,`C`의 요청에 대한 답변이 올 때 까지 기다려야 된다는 점입니다. 이 부분은 단점으로 귀결됩니다. 기능에 필요한 서비스가 늘어날수록, 더 많은 서비스로부터의 답변을 기다려야 된다는 점입니다. 즉, 기능을 수행하기 위한 트랜젝션들의 순서를 보장하기 위해서는 딜레이가 발생할 수 밖에 없는 단점을 가지고 있습니다. |


## Choreography 형태

|--|-|
|![Choreography](../../../assets/img/msa/chor.png)| 그렇다면 Choreography는 Orchestration와 무엇이 다를까요?<br/> Choreography는 `composite` 서비스 없이, 각각의 서비스가 이벤트 브로커를 통해서 서로에게 메세지를 전달하는 방식입니다. 어떻게 보면 얘도 마찬가지로 트렌젝션 순서를 보장함에 따라(메세지 전송 순서에 따라) 딜레이를 가질 수 밖에 없긴 합니다. 하지만 Choreography 형태는 메세지 브로커를 통해 **간접적으로 메세지를 주고받기때문에, 서비스 간 디커플링 정도가 높다**라는 측면에서 장점을 가지고 있습니다. |

위의 내용들과 같이 Orchestration 장점과 단점을 Choreography와 비교하며 다음과 같이 정리할 수 있습니다.

* Orchestration 장점
  * **쉬운 모니터링** : `composite` 서비스 한군데에서 서비스 순서를 관리함에 따라 요청받은 기능수행을 위한 진행단계를 쉽게 관찰할 수 있습니다.
  > 예로 Choreography형태는 지금 어디까지 진행되었는지 확인하기 위해서는 모든 서비스가 사용하는 토픽을 하나하나 다 관찰해야합니다. 반면에 `Orchestration` 형태에서는 `composite` 서비스만 관찰하면 쉽게 볼 수 있죠.
  * **유지/보수 비용 측면**
  > 만약 `A`,`B`,`C` 서비스 다음에 `D` 서비스가 수행되도록 보수한다고 가정해 보겠습니다. `composite` 서비스에 `D` 서비스만 추가해주면 쉽게 확장시킬 수 있죠.
  >
  > 반면 Choreography형태는 어떤 면으로는 유지/보수하기 어렵습니다.
  >
  > Choreography형태는 마지막에 `D` 서비스를 붙이고 싶을 때 다음의 과정을 수행하게 됩니다. (1) 연결된 서비스들을 타고타고 들어가면서 서비스 진행 방향을 파악합니다. (2) 이 과정에서 `A`->`B`->`C`로 진행방향을 파악하고, `C` 서비스에 실제로 `D` 서비스를 붙이게 됩니다.
  >
  > 즉, Choreography형태는 (1)의 과정이 선행되어야 하며, 어떤식으로 서비스가 연결되었는지 서비스 하나하나 까보아야 된다는 점이 유지/보수를 어렵게 만듭니다. 또한 자신에게 필요한 이벤트를 구독해야 하므로 어떤 서비스에서 어떤 이벤트를 발행하는지 미리 알아야 한다는 단점이 있습니다.
  >
  > 그렇지만 이벤트 토픽 별 기능 및 서비스들이 잘 문서화되어 있다면, **오히려 Orchestration형태가 Choreography에 비해 유지/보수 비용이 높을 수 있습니다**!

* Orchestration 단점
  * **타이트한 커플링** : Orchestration 형태에서는 모든 서비스들이 `composite` 서비스와 연결되어 있습니다.즉, `composite` 서비스를 업데이트할 때, 모든 서비스들이 영향을 받게 되어 에러발생의 원인이 됩니다. 또한 직접적으로 서로 통신하기에, **확장성에 있어 불리합니다**. 
  > 이 부분은 Choreography의 장점으로 연결됩니다.
  



# References
* [https://waspro.tistory.com/735](https://waspro.tistory.com/735)
* [https://microservices.io/patterns/data/saga.html](https://microservices.io/patterns/data/saga.html)
* [https://stackoverflow.com/questions/4127241/orchestration-vs-choreography](https://stackoverflow.com/questions/4127241/orchestration-vs-choreography)
* [https://solace.com/blog/microservices-choreography-vs-orchestration/](https://solace.com/blog/microservices-choreography-vs-orchestration/)
* [https://blog.bitsrc.io/how-to-use-saga-pattern-in-microservices-9eaadde79748](https://blog.bitsrc.io/how-to-use-saga-pattern-in-microservices-9eaadde79748)
* [https://chobowarrior.tistory.com/49](https://chobowarrior.tistory.com/49)