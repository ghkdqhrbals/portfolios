---
layout: default
title: Java에서의 비동기 NonBlocking, 그리고 ListenableFuture 객체
date: 2023-02-21
parent: Java-Kotlin
nav_order: 1
---

# Async, Sync + Blocking, NonBlocking

비동기와 동기, 그리고 non-blocking과 blocking방식은 어떻게 조합하냐에 따라 진행방식이 달라집니다. 이 글은 각각의 조합방식에 따른 진행방식의 차이점에 대해 설명합니다.

![img](../../../assets/img/circuit/8.png)

위의 그림과 관련하여 **에스프레소를 손님에게 제공하는 예시**로써 각각의 조합을 설명하겠습니다.

* `main work` : 에스프레소 추출 
* `sub work for main` : 컵 닦기
* `other work` : 쓰레기 치우기

* Sync-Blocking 

에스프레소 추출 버튼을 누르고 계속 기다립니다. 추출이 끝나면, 컵을 닦고 에스프레소를 담아서 손님에게 제공합니다.

* Sync-NonBlocking

에스프레소 추출 버튼을 누르고, 자리로 돌아옵니다. **틈틈히 추출이 끝났는지 확인**합니다. 추출이 끝나면, 컵을 닦고 에스프레소를 담아서 손님에게 제공합니다.

* Async-Blocking

에스프레소 추출 버튼을 누르고, 보조인원(Thread 2)에게 컵을 닦는 일을 시킵니다. 에스프레소 추출이 끝났을 때, 아직 컵이 준비가 안되어있다면 기다립니다. 컵이 준비가 되면 에스프레소를 담아서 손님에게 제공합니다.

이 부분은 Sync-Blocking과 거의 동일합니다. 다만, `main work`와 `sub work for main`을 동시에 수행할 수 있다는 점이 다릅니다.

* Async-NonBlocking

에스프레소 추출 버튼을 누르고, 보조인원(Thread 2)에게 컵을 닦는 일을 시킵니다. 에스프레소 추출이 끝나면, 보조인원이 컵을 닦는 동안 쓰레기를 치웁니다. 쓰레기를 치우는 와중에 컵이 다 닦였다고 보조인원으로부터 연락을 받으면 에스프레소를 담아 손님에게 제공합니다.

**이제 이 부분을 2개의 CPU 스레드(나, 보조인원)의 시간효율측면에서 보면 어떨까요?**

2명이 풀로 일함 >= Async-NonBlocking > Async-Blocking >= 1명이 풀로 일함 >= Sync-NonBlocking > Sync-Blocking

**Sync-Blocking**은 기다리는 와중 다른 업무를 수행할 수 없으며 인원도 부족하기에 가장 **비효율** 적이며, **Async-NonBlocking**은 여러명에서 수행하며 기다리는 와중에 각기 다른 업무를 진행할 수 있기에 가장 **효율적**입니다.

# CPU 관점에서의 차이점들

* Sync-NonBlocking과 Sync-Blocking 차이점

결론적으로 하나의 스레드는 자기가 할 수 있는 총량이 정해져 있습니다. 그래서 내부에서 일을 여러개를 수행한다고 하여도, 결국에는 하나의 스레드가 할 수 있는 일을 넘지는 못하죠.

그렇다면 Sync-NonBlocking은 딱 한가지 Blocking보다 좋은 점이 있습니다. 바로 Work의 Starvation을 막을 수 있다는 점이죠!

* Async-NonBlocking과 Async-Blocking 차이점
일단 둘 다 여러 스레드가 동시에 일을 수행할 수 있다는 점에서는 같습니다. 또한 둘 다 ListenableFuture 객체(Java의 경우)를 통해 별도로 CallBack 채널을 구성하여 계속 확인해야하는 프로세스를 제거하였죠.

그러나 비동기-Blocking로 구성된 해당 스레드는 **결국 다른 일이 끝날때까지 기다려야만 합니다**. 반면, 비동기-NonBlocking은 자신의 업무를 계속해서 수행할 수 있습니다.


{: .important }
> NonBlocking과 Blocking은 서비스 로직에 따라 달리 적용됩니다.
> 
> 만약, `A`라는 일이 `B`의 결과에 **의존적**이라면 Blocking 으로 수행하여야만 합니다. 만약 의존적이지 않다면 NonBlocking으로 설계하여 동시수행가능함으로써 CPU를 효율적으로 사용할 수 있겠죠?

* ListenableFuture란?
ListenableFuture은 Java의 non-blocking의 인터페이스인 Future을 좀 더 extend한 인터페이스입니다. 얘는 callbacks를 아래와 같이 쉽게 추가할 수 있습니다. 아래는 **채팅서버프로젝트** 에 적용된 ListenableFuture입니다.

```java
@Async
public void sendToKafkaWithKey(String topic, Object req, String key) {
    ListenableFuture<SendResult<String, Object>> future = kafkaProducerTemplate.send(topic,key, req);
    future.addCallback(new ListenableFutureCallback<SendResult<String, Object>>() {
        @Override
        public void onFailure(Throwable ex) {
            log.error("메세지 전송 실패={}", ex.getMessage());
        }
        @Override
        public void onSuccess(SendResult<String, Object> result) {
            log.info("메세지 전송 성공 topic={}, key={}, offset={}, partition={}",topic, key, result.getRecordMetadata().offset(), result.getRecordMetadata().partition());
        }
    });
}
```

저는 채팅서버 프로젝트에서 카프카에 메세지를 보내고 성공확인여부를 반환받을 때, 위와 같이 non-blocking으로 진행합니다.
그리고 이 부분은 별도의 스레드로 실행되도록 설정하였으며, 결론적으로 Async-NonBlocking 방식의 통신을 하도록 설정하였습니다.

{: .highlight }
>추가적으로 `SendResult`는 Kafka가 지원하는 결과 전달 객체입니다.
>
>Kafka는 메세지큐에 정상적으로 삽입되면, ListenableFuture의 `onSuccess`에게 토픽, 키, 오프셋값, 삽입된 파티션 넘버 등의 메타정보들(SendResult)을 전달하게됩니다.


```java
/**
* Result for a ListenableFuture after a send.
*
* @param <K> the key type.
* @param <V> the value type.
*
* @author Gary Russell
*
*/
public class SendResult<K, V> {...}
```

# Reference
* [https://github.com/google/guava/wiki/ListenableFutureExplained](https://github.com/google/guava/wiki/ListenableFutureExplained)