---
layout: default
title: CompletableFuture 기능 별 심화이해
parent: Java
nav_order: 3
---


## thenAccept/thenRun/thenApply

`thenAccept` 는 이전에 전달받은 parameter 가 있을 때 사용되며, `thenRun` 은 없을 때 사용됩니다.

예시로 함께 보겠습니다.

### Code

```java
CompletableFuture.supplyAsync(()->{ // thenAccept에서 사용할 수 있는 값을 return으로 넘겨줍니다.
        int i = 1;
        log.info("서비스 thread-{}",i);
        return i;
        // 별도의 TaskPoolExecutor(serviceExecutor) 를 설정함으로써 원하는 스레드 풀을 직접 설정할 수 있어요.
    }, serviceExecutor).thenAccept((i) -> { // 이전 1을 받아서 1을 더한 뒤 출력합니다.
        log.info("서비스 thread-{}",++i);
    }).thenRun(() -> { // thenRun은 이렇게 아무값도 받지않고 넘기지도 않을 때 사용되요. 만약 "값 받기 + 넘기기" 둘 다 하고 싶다면 thenApply을 사용하시면 되요.
        log.info("서비스 thread-3"); 
    }).thenRunAsync(() -> { // 기존 스레드를 종료시키고 serviceExecutor 스레드풀에서 하나 새롭게 가져와서 사용합니다.
        log.info("서비스 thread-4");
    },serviceExecutor).thenRun(() -> {
        log.info("서비스 thread-5");
    }).exceptionally((e)->{
        log.info("서비스 thread 6-ERROR");
        return null;
    });
```

### Result

```
[service-thread-4] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-1
[service-thread-4] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-2
[service-thread-4] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-3
[service-thread-6] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-4
[service-thread-6] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-5
```

## thenCompose

### Code

```java
@Slf4j
public class UserServiceImpl  {
    
    private CompletableFuture<Integer> anotherService(int i) {
        CompletableFuture<Integer> cf = CompletableFuture
                .supplyAsync(() -> i+1)
                .thenApplyAsync(i2 -> {
                    log.info("다른 서비스 value:{}",i2); // 결과 [another-service-thread-1] 서비스 value:4
                    return i2;
                },serviceExecutor);
        return cf;
    }

    public void myService(User user) {
        return CompletableFuture.supplyAsync(()->{
            int i = 1;
            log.info("서비스 value:{}",i); // 결과 [service-thread-5] 서비스 value:1
            return i;
        }, serviceExecutor).thenApply((i) -> {
            log.info("서비스 value:{}",++i); // 결과 [service-thread-5] 서비스 value:2
            return i;
        }).thenCompose((i) -> {
            log.info("서비스 value:{}",++i); // 결과 [service-thread-5] 서비스 value:3
            // 기존 thenApply 같은 경우에는 값 자체를 다음 CompletionStage 에 넘겨주게 됩니다.
            // 하지만 만약에, 또 다른 CompletableFuture 객체가 다음 stage로 넘어가게 되는경우에는 어떻게 해야할까요?
            // 또 다른 CompletableFuture 내의 값을 빼내서 다음 stage로 넘겨주어야 겠죠?
            // 이 역할을 thenCompose가 수행합니다.
            // 1. 즉, thenCompose 는 CompletableFuture 를 unwrap 해서 값만 다음 stage로 넘겨주게 도와줍니다.
            // 2. 또한 thenCompose 는 anotherService 에서 사용된 스레드를 그대로 다음 thenAccept로 넘깁니다.
            // (만약 anotherService에 사용된 스레드가 빨리 반환되어야 한다면, thenAccept보다 thenAcceptAsnyc를 수행하는 것이 좋겠죠?)
            return anotherService(i); // 결과 [another-service-thread-1] 서비스 value:4
        }).thenAccept((cf) -> {
            // [another-service-thread-1] 스레드가 이후 서비스들을 실행하게 됩니다.
            log.info("서비스 value:{}",cf.intValue()+1); // 결과 [another-service-thread-1] 서비스 value:5
        }).thenRun(() -> {
            log.info("서비스 마무리"); // 결과 [another-service-thread-1] 서비스 마무리
        }).exceptionally((e)->{
            log.info(e.getMessage());
            log.info("서비스 thread 6-ERROR");
            return null;
        });
    }
}
```

### Result

```
[service-thread-5] c.c.domain.user.service.UserServiceImpl  : 서비스 value:1
[service-thread-5] c.c.domain.user.service.UserServiceImpl  : 서비스 value:2
[service-thread-5] c.c.domain.user.service.UserServiceImpl  : 서비스 value:3
[another-service-thread-1] c.c.domain.user.service.UserServiceImpl  : 다른 서비스 value:4
[another-service-thread-1] c.c.domain.user.service.UserServiceImpl  : 서비스 value:5
[another-service-thread-1] c.c.domain.user.service.UserServiceImpl  : 서비스 마무리
```

## exceptionally

### Code

```java
@Slf4j
public class UserServiceImpl  {

    private CompletableFuture<Integer> anotherService(int i) {
        CompletableFuture<Integer> cf = CompletableFuture
                .supplyAsync(() -> i+1)
                .thenApplyAsync(i2 -> {
                    log.info("다른 서비스 value:{}",i2);
                    if (i2 == 4){
                        throw new RuntimeException(); // 다른 비동기 작업에서 강제 에러 발생
                    }
                    return i2;
                },serviceExecutor).exceptionally(e->{
                    log.info("다른 서비스 에러"); // 결과 [another-service-thread-1] 서비스 에러
                    throw new RuntimeException();
                });
        return cf;
    }

    public CompletableFuture<?> myService(User user) {
        DeferredResult<ResponseEntity<?>> dr = new DeferredResult<>();
        CompletableFuture.supplyAsync(()->{
            int i = 1;
            log.info("서비스 value:{}",i); // 결과 [service-thread-3] 서비스 value:1
            return i;
        }, serviceExecutor).thenApply((i) -> {
            log.info("서비스 value:{}",++i); // 결과 [service-thread-3] 서비스 value:2
            return i;
        }).thenCompose((i) -> {
            log.info("서비스 value:{}",++i); // 결과 [service-thread-3] 서비스 value:3
            return anotherService(i);
        }).thenAccept((cf) -> {
            log.info("서비스 value:{}",cf.intValue()+1); // 비실행
        }).thenRun(() -> {
            log.info("서비스 마무리"); // 비실행
        }).exceptionally((e)->{
            log.info("서비스 에러"); // 결과 [another-service-thread-1] 서비스 에러
            return null;
        });
        return null;
    }
}
```

### Result

```
[service-thread-3] c.c.domain.user.service.UserServiceImpl  :           서비스 value:1
[service-thread-3] c.c.domain.user.service.UserServiceImpl  :           서비스 value:2
[service-thread-3] c.c.domain.user.service.UserServiceImpl  :           서비스 value:3
[another-service-thread-1] c.c.domain.user.service.UserServiceImpl  :   다른 서비스 value:4
[another-service-thread-1] c.c.domain.user.service.UserServiceImpl  :   다른 서비스 에러
[another-service-thread-1] c.c.domain.user.service.UserServiceImpl  :   서비스 에러
```