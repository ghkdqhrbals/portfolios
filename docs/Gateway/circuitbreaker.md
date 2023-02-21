---
layout: default
title: 서킷 브레이커
parent: 게이트웨이
nav_order: 1
---

# 서킷 브레이커
Circuit Breaker란, 원격 접속의 성공/실패를 카운트하여 에러율(failure rate)이 임계치를 넘어섰을 때 자동적으로 접속을 차단하는 시스템입니다.

![statemachine](../../../assets/img/circuit/3.png)


Timeout                int `json:"timeout"`  
MaxConcurrentRequest   int `json:"max_concurrent_requests"`  
RequestVolumeThreshold int `json:"request_volume_threshold"`  
SleepWindow            int `json:"sleep_window"`  
ErrorPercentThreshold  int `json:"error_percent_threshold"`

* ListenableFuture
ListenableFuture은 Java의 non-blocking 구현체로써,

* 채팅서버 프로젝트에서 카프카에 메세지를 보내고 성공확인여부를 반환받을 때, non-blocking으로 진행한다.


```java
private void sendToKafkaWithKey(String topic, Object req, String key) {
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

* Concurrent



* @Async
자가 호출에서는 @Async 사용이 불가

# Reference
* [https://engineering.linecorp.com/ko/blog/circuit-breakers-for-distributed-services/](https://engineering.linecorp.com/ko/blog/circuit-breakers-for-distributed-services/)