---
layout: default
title: CompletableFuture 기능 별 심화이해
parent: Server
date: 2023-03-15
nav_order: 3
---


## 1. thenAccept/thenRun/thenApply

`thenAccept` 는 이전에 전달받은 parameter 가 있을 때 사용되며, `thenRun` 은 없을 때 사용됩니다.

예시로 함께 보겠습니다.

## 1-1. Code

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

## 1-2. Result

```
[service-thread-4] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-1
[service-thread-4] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-2
[service-thread-4] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-3
[service-thread-6] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-4
[service-thread-6] c.c.domain.user.service.UserServiceImpl  : 서비스 thread-5
```

## 1-3. thenCompose

## 1-4. Code

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

## 1-5. Result

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



## CompletableFuture 의 람다식 내 지역변수 재사용 방식 및 Thread-safe 한 변수

```java
public class SimpleTest {
    static int staticVariable = 0;
    @Test
    void test1() {

        System.out.println(Thread.currentThread().getName() + " 시작");
        ExecutorService executor = Executors.newFixedThreadPool(5);

        // Not Thread Safe
        int localVariable = 0;
        List<Integer> numbers_not_thread_safe = Arrays.asList(1, 2, 3);
        Map<Integer, Integer> maps_not_thread_safe = new HashMap<>() {{
            put(0, 0);
            put(1, 2);
            put(2, 3);
        }};
        
        // Thread Safe
        List<Integer> numbers_thread_safe = Collections.synchronizedList(new ArrayList<Integer>());
        numbers_thread_safe.add(1);
        numbers_thread_safe.add(2);
        numbers_thread_safe.add(3);
        ConcurrentMap<Integer, Integer> maps_thread_safe = new ConcurrentHashMap<>() {{
            put(0, 0);
            put(1, 2);
            put(2, 3);
        }};

        try {
            String s = CompletableFuture.runAsync(() -> {
                System.out.println(Thread.currentThread().getName() + " 시작");
                // ------ NOT THREAD SAFE
                // localVariable += 1; // 컴파일 error 발생 > capturing 한 변수에 대한 변경 권한이 없기에 발생하였습니다.
                var newLocalVariable = localVariable; // 부모 스레드에서 capturing 한 지역 변수를 람다식 내 새로운 변수로 할당합니다.
                newLocalVariable += 1;

                staticVariable += 1; // Heap에 저장된 Object 이기에 변경가능, 다만 Mutex Lock X
                numbers_not_thread_safe.set(0, 1); // Heap에 저장된 Object 이기에 변경가능, 다만 Mutex Lock X
                maps_not_thread_safe.put(0, 1); // Heap에 저장된 Object 이기에 변경가능, 다만 Mutex Lock X

                // ------ THREAD SAFE
                numbers_thread_safe.set(0, 1); // Heap에 저장된 Object 이기에 변경가능, Mutex Lock O
                maps_thread_safe.put(0, 1); // Heap에 저장된 Object 이기에 변경가능, Mutex Lock O
                
                System.out.println("not-thread-safe-localVariable=" + String.valueOf(localVariable));
                System.out.println("not-thread-safe-newlocalVariable=" + String.valueOf(newLocalVariable));
                System.out.println("not-thread-safe-staticVariable=" + String.valueOf(staticVariable));
                System.out.println("not-thread-safe-list=" + String.valueOf(numbers_not_thread_safe.get(0)));
                System.out.println("not-thread-safe-map=" + String.valueOf(maps_not_thread_safe.get(0)));
                System.out.println("thread-safe-list=" + String.valueOf(numbers_thread_safe.get(0)));
                System.out.println("thread-safe-map=" + String.valueOf(maps_thread_safe.get(0)));

            }, executor).thenApplyAsync((e1) -> {
                return "Finished";
            }, executor).get();
            System.out.println(s);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
}
```

시작 이후, 람다는 지역 변수(localVariable)를 **capturing** 해서 가지고 있도록 지원합니다. 즉, **스레드 stack 에 새롭게 복사해서 쌓아 올린 것**입니다. 그리고 우리는 여기서 새로운 스레드로 표현하였죠. 그렇다면, **새로운 스레드의 스택에 람다식이 capturing한 지역 변수가 복사**됩니다. 하지만 Java는 지역변수 수정(지역 변수을 다른 메소드에서 변경)을 미연에 방지하고자 **컴파일 단계에서 에러**를 띄웁니다. 

따라서 새로운 스레드에서 캡처링 된 지역 변수를 이리저리 바꾸기 위해서는, 따로 지역변수를 받아서 쓰거나 애초에 지역적으로 선언하지 말고 힙에 저장되도록 Object로 선언해야 합니다.