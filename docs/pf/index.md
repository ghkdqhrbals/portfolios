---
layout: default
title: 성능개선 기록
nav_order: 4
description: "성능개선을 위해 떠난 여정들을 기록합니다"
---


본 기록은 성능개선 여정들에 대한 기록입니다.

> 서버 성능지표들을 수집하고 개선하는 개인적인 이유는, 제가 만든 서버가 수치화 되고 이 수치들이 향상되는 것이 매력적이라고 생각하기 때문입니다.  

초기에는 성능지표와 서버 성능테스트에 대한 이해가 부족하여 Http Benchmark Tool 을 직접 만들고, 만개의 Http 요청에 걸리는 총 소요시간을 측정하였습니다.

부족한 지식을 보충하기 위해 여러 실무자들이나 Git Discussion, 스택 오버플로우에 물어보기도 하며 다양한 성능지표들과 툴의 존재를 확인했습니다. 

**현재는 nGrinder 를 사용하여 여러 부하테스트를 진행하고 있으며 별도의 TPS, MTTFB 의 상위 지표를 뽑아내어 성능개선을 진행하고 있습니다.**


## 최적화 목록
* 2023-01-16 [도커 리소스 추가와 수동 수평확장](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-16-chatting(13)/)
  * 10K request test 시, 총 소요시간 110초 -> 49초

* 2023-01-17 [JPA Batch 적용](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-17-chatting(15)/)
  * 10K request test 시, 총 소요시간 49초 -> 23초

* 2023-01-24 [Multiple Insert JDBC Batch 적용](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-24-chatting(17)/)

* 2023-01-27 [JDBC Batch 최적화 및 Postgresql 병렬 프로세서 확장](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-01-27-chatting(18)/)
  * 10K request test 시, 총 소요시간 80초 -> 29초

* 2023-03-05 [AWS-RDS 그래프 지표 관찰 및 db connection 증가](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-03-05-chatting(21)/)
  * 10K request test 시, 총 소요시간 51초 -> 26초

* 2023-03-11 [부하 테스트를 위한 툴 제작 및 실제 테스트 결과](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-03-11-chatting(23)/)
* 2023-03-16 [RDB 인덱싱 활성화](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-03-16-chatting(25)/)

* 2023-05-01 [이벤트 전송 스레드 증가](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-05-01-chatting(35)/)
  * 1000개 동시요청 시, 평균 딜레이타임 8680ms -> 4194 ms 

* 2023-12-21 [HPA(max 3), ReadinessProbe, CPU limit, EKS NodeGroup AutoScaling O(CPU usage 50%), Caching, 톰켓 최적화](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-12-21-chatting(40)/)

    <details open><summary> 성능지표 개선수치 확인 </summary><div markdown="1">
    
    ![img](../../assets/cd/tps.png)
    ![img](../../assets/cd/mttfb.png)
    ![img](../../assets/cd/p.png)
    
    | Metric             | Before       | After        | Change      |
    |--------------------|--------------|--------------|-------------|
    | Total Tests        | 40,228       | 181,050      | **349.29% 🟢**  |
    | Error Rate         | 51.11%(20,560)| 0.00%(0)     | **No Error 🟢** |
    | TPS 평균 (Average)  | 109.27       | 312.16       | **185.94% 🟢**  |
    | TPS p50            | 69.00        | 319.00       | **362.32% 🟢**  |
    | TPS p95            | 4.00         | 217.45       | **5362.50% 🟢** |
    | TPS p99            | 2.84         | 132.28       | **4556.34% 🟢** |
    | TPS p99.9          | 1.63         | 96.52        | **5852.76% 🟢** |
    | MTTFB 평균 (Average)| 1605.44 ms   | 950.89 ms    | **-40.68% 🟢**  |
    | MTTFB p50          | 1636.55 ms   | 919.20 ms    | **-43.90% 🟢**  |
    | MTTFB p95          | 24013.28 ms  | 1322.11 ms   | **-94.47% 🟢**  |
    | MTTFB p99          | 27690.40 ms  | 1833.22 ms   | **-93.40% 🟢**  |
    | MTTFB p99.9        | 28157.50 ms  | 2099.12 ms   | **-92.52% 🟢**  |
    | MTTFB 차이 평균 (Average Difference)| 2838.38 ms | 112.52 ms | **-96.04% 🟢**  |
    | MTTFB 평균적인 변동률 (Average Variability)| 75.00% | 10.67% | **-85.77% 🟢**  |
    
    </div></details>

* 2023-12-29 [Nginx Ingress replicaSet=2~3](https://ghkdqhrbals.github.io/portfolios/docs/project/2023-12-29-chatting(41)/)

  <details><summary> 성능지표 개선수치 확인 </summary><div markdown="1">

  ![img](../../assets/ingresspod/Untitled.png)
  ![img](../../assets/ingresspod/Untitled2.png)
  ![img](../../assets/ingresspod/Untitled3.png)

  | Metric                               | Ingress Pod 1 | Ingress Pod 2 | Change     |
  |--------------------|---------------|------------|-------------------|-------------|
  | Total Tests                          | 181,050       | 240,587       | 32.93% 🟢  |
  | Error Rate                          | 0.00%(0)      | 0.00%(3)      | N/A        |
  | TPS 평균 (Average)                     | 312.16        | 410.55        | 31.51% 🟢  |
  | TPS p50                              | 319.00        | 422.50        | 32.38% 🟢  |
  | TPS p95                              | 217.45        | 288.60        | 32.69% 🟢  |
  | TPS p99                              | 132.28        | 147.62        | 11.62% 🟢  |
  | TPS p99.9                            | 96.52         | 37.04         | -61.68% 🔴 |
  | MTTFB 평균 (Average)                   | 950.89 ms     | 709.86 ms     | -25.29% 🟢 |
  | MTTFB p50                            | 919.20 ms     | 693.65 ms     | -24.54% 🟢 |
  | MTTFB p95                            | 1322.11 ms    | 958.64 ms     | -27.49% 🟢 |
  | MTTFB p99                            | 1833.22 ms    | 1117.45 ms    | -39.05% 🟢 |
  | MTTFB p99.9                          | 2099.12 ms    | 1396.80 ms    | -33.54% 🟢 |
  | MTTFB 차이 평균 (Average Difference)     | 112.52 ms     | 58.82 ms      | -47.66% 🟢 |
  | MTTFB 평균적인 변동률 (Average Variability) | 10.67%        | 7.67%         | -28.09% 🟢 |

  </div></details>

* 2024-01-03 [RDB b-tree Long type PK indexing](https://ghkdqhrbals.github.io/portfolios/docs/project/2024-01-03-chatting(42)/)

  <details><summary> 성능지표 개선수치 확인 </summary><div markdown="1">

  | Metric          | Before     | After      | Change            |
  |-----------------|------------|------------|-------------------|
  | Total Tests     | 220,313    | 236,957    | 7.54% 🟢          |
  | Error Rate      | 0.00%(7)   | 0.00%(0)   | -                 |
  | TPS 평균          | 377.24     | 404.36     | 7.18% 🟢          |
  | TPS p50         | 390.25     | 420.50     | 7.76% 🟢          |
  | TPS p95         | 270.60     | 277.90     | 2.69% 🟢          |
  | TPS p99         | 92.58      | 64.34      | -30.53% 🔴        |
  | TPS p99.9       | 34.05      | 43.17      | 26.74% 🟢         |
  | MTTFB 평균        | 496.27 ms  | 456.42 ms  | -8.03% 🟢         |
  | MTTFB p50       | 480.31 ms  | 431.84 ms  | -10.07% 🟢        |
  | MTTFB p95       | 882.81 ms  | 799.67 ms  | -9.41% 🟢         |
  | MTTFB p99       | 1163.81 ms | 1130.67 ms | -2.84% 🟢         |
  | MTTFB p99.9     | 1225.86 ms | 1275.62 ms | 4.06% 🔴          |
  | MTTFB 차이 평균     | 106.51 ms  | 74.02 ms   | -30.46% 🟢        |
  | MTTFB 평균적인 변동률  | 20.77%     | 15.27%     | -26.60% 🟢        |

  </div></details>

* [RDB Look-Aside + Write-Around caching](https://ghkdqhrbals.github.io/portfolios/docs/project/2024-02-04-chatting(47)/)

  <details><summary> 성능지표 개선수치 확인 </summary><div markdown="1">

  ![img](../../assets/caching/Untitled.png)
  ![img](../../assets/caching/Untitled2.png)
  ![img](../../assets/caching/Untitled3.png)

  | Metric                               | Before       | After        | Change     |
  |--------------------|--------------|--------------|------------|
  | Total Tests                          | 12,356       | 16,788       | 36.00% 🟢  |
  | Error Rate                           | 0.00%(0)     | 0.00%(0)     | 0 ⚪        |
  | TPS 평균 (Average)                     | 228.81       | 310.89       | 35.87% 🟢  |
  |  TPS p50                             | 240.50       | 307.50       | 27.84% 🟢  |
  | TPS p95                              | 162.40       | 282.85       | 74.20% 🟢  |
  | TPS p99                              | 107.09       | 237.47       | 121.77% 🟢 |
  | TPS p99.9                            | 90.36        | 223.55       | 147.24% 🟢 |
  | MTTFB 평균 (Average)                   | 438.32 ms   | 324.82 ms   | -25.93% 🟢 |
  | MTTFB p50                            | 432.94 ms   | 323.11 ms   | -25.27% 🟢 |
  | MTTFB p95                            | 733.43 ms   | 380.09 ms   | -48.14% 🟢 |
  | MTTFB p99                            | 912.43 ms   | 471.73 ms   | -48.31% 🟢 |
  | MTTFB p99.9                          | 951.93 ms   | 496.67 ms   | -47.85% 🟢 |
  | MTTFB 차이 평균 (Average Difference)     | 65.06 ms | 24.31 ms | -62.68% 🟢 |
  | MTTFB 평균적인 변동률 (Average Variability) | 13.73% | 7.67% | -44.11% 🟢 |

  </div></details>




