---
layout: default
title: ๐ GOTYBENCH(HTTP Benchmark Tool) ์ค๊ณ
parent: ํ ์ด ํ๋ก์ ํธ
nav_order: 1
---
# **Introduction**
![img](../../../assets/img/rds/24.gif)

Fuzzing Test๋ฅผ ํ๊ณ ์ถ์๊ฐ์? ์๋๋ฉด ์๋ฒ์ ๋ถํ๋ฅผ ํ์คํธํ๊ณ ์ถ์๊ฐ์? ๊ฒฐ๊ณผ๋ฅผ ์ ์ฅํด์ ํ๋์ ๋ณด๊ณ ์ถ์๊ฐ์?

์ด๋ฅผ ์ํ HTTP Benchmark Tool์ธ **gotybench**๋ฅผ ์ค๊ณํ์ต๋๋ค! 

* **gotybench** ๋ ์๋์ผ๋ก json object๋ฅผ ๋๋คํ๊ฒ ์์ฑํ์ฌ HTTP.post ํ๋ HTTP Benchmark Tool์๋๋ค.
> github link : [https://github.com/ghkdqhrbals/gotybench](https://github.com/ghkdqhrbals/gotybench)

* **gotybench๋ ๋ค์์ ๋ชฉํ๋ก ์ค๊ณ ๋ฐ ์ ์ํ์์ต๋๋ค.**

1. **ํ์คํธ ๋์์ฑ ๋ณด์ฅ** : goroutine ๊ฒฝ๋ ๋ฉํฐ ์ค๋ ๋๋ฅผ ์ฌ์ฉํ์์ผ๋ฉฐ, ์ฑ๋์ ํตํด ํต์ ํ๋๋ก ์ค์ ํ์์ต๋๋ค. ๊ธฐ๋ณธ net/http ๋ฅผ ์ฌ์ฉํ๊ธฐ๋๋ฌธ์ ์์ฒญ/์๋ต์ Blocking ์ผ๋ก ์งํ๋๋ฉฐ ๋๋จธ์ง ์ฒ๋ฆฌ๋ ์ฑ๋์ ํตํด ๋น๋๊ธฐ๋ก ์งํ๋ฉ๋๋ค. ๋ง์ ์์ ์ค๋ ๋๋ฅผ ๋๋ฆฌ๊ธฐ์ Thread-safe ํ๊ฒ ์ค๊ณํด์ผํฉ๋๋ค. ๊ทธ๋์ `HandleResponse`๋ฅผ ๋จ์ผ ์ค๋ ๋๋ก ๋๋ฆฌ๊ณ , ์ฑ๋์ ํตํด ๋ค๋ฅธ ์ค๋ ๋๋ก๋ถํฐ์ ์๋ต์ ๊ฐ์ ธ์์ ์ค๋ ๋ stack ์์ ์ฒ๋ฆฌํ  ์ ์๋๋ก ์ค๊ณํ์์ต๋๋ค!
2. **๋ค์ด๋๋ฏน Structure ์ ํตํ Fuzzed Json ์ค๋ธ์ ํธ ์์ฑ** : ์ฌ์ฉ์๊ฐ key์ value type๋ค๋ง ์ค์ ํด์ฃผ๋ฉด ์๋์ผ๋ก ๋๋คํ json ์ค๋ธ์ ํธ๋ฅผ ์์ฑํ๋๋ก ์ ์ํ์์ต๋๋ค.
   * ex) "gotybench -j [userId,string,userAge,int]" : userId์ value๋ฅผ ๋๋คํ string์ผ๋ก ์ค์ ํฉ๋๋ค. ๋ํ userAge์ value๋ฅผ ๋๋คํ int๋ก ์ค์ ํฉ๋๋ค.
3. **๋ฒค์น๋งํฌ ๋ก๊ทธ ์๋ฒ ๊ฐ์ค** : ์๋ต RTT๋ฅผ ์๊ฐ ์๋ฆฌ์ฆ๋ก ํ์ธํ  ์ ์๋ ๊ทธ๋ํ ๋ฐ ๊ธฐํ ์ ๋ณด๋ค์ ์ ์ฅํ๋ ๋ก์ปฌ์๋ฒ๋ฅผ ์คํํ์ต๋๋ค. (Open Port :8022)

# **Options**

| Option | Detail                                                                                                                                                                                                                        |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| -c     | ๋์์ฒ๋ฆฌ๊ฐ๋ฅํ ์ค๋ ๋ ๊ฐ์๋ฅผ ํด๋น ์ต์์ผ๋ก ์ค์ ํ  ์ ์์ต๋๋ค.                                                                                                                                                                                           |
| -h     | ์ต์๋ค์ ์ค๋ช์ ํ์ธํ  ์ ์์ต๋๋ค.                                                                                                                                                                                                          |
| -j     | ํต์ฌ์ ์ธ Fuzzing ๊ธฐ๋ฅ์๋๋ค. <br> json object๋ฅผ ํด๋น ์ต์์ผ๋ก key/type์ ์ค์ ํ๋ฉด, ๋๋คํ value์ json obejct๊ฐ ์์ฑ๋ฉ๋๋ค.<br>Fuzzing์ด ์ง์๋๋ type ์ 4๊ฐ์ง๋ก ์๋์ ๊ฐ์ต๋๋ค.<br>int, float, string, boolean<br>Usage Example<br>ex) `-j "[userId,string,userAge,int]"` |
| -r     | HTTP POST request ๊ฐ์๋ฅผ ํด๋น ์ต์์ผ๋ก ์ค์ ํ  ์ ์์ต๋๋ค.                                                                                                                                                                                     |
| -t     | ๋ฒค์น๋งํฌ ํด๋ผ์ด์ธํธ์ network connection ์ timeout์ ํด๋น ์ต์์ผ๋ก ์ค์ ํ  ์ ์์ต๋๋ค.                                                                                                                                                                 |
| -u     | ์์ฒญํ๋ URL์ ์ค์ ํ  ์ ์์ต๋๋ค.                                                                                                                                                                                                         |
| -s     | ๋ก๊น๋ ์ด์  ๋ฒค์น๋งํฌ ๋ฐ์ดํฐ ๋ฐ ๊ทธ๋ํ๋ค์ ์๋ฒ์ ๋์๋๋ค.                                                                                                                                                                                       |

**์ด์ค ํนํ `-j` ์ต์์ Dynamic Struct๋ฅผ ์ฐจ์ฉํจ์ผ๋ก์จ, ์ค๋ธ์ ํธ์ private ํ๋๋ ์ฌ์ฉ์์ ์๋ ฅ๊ฐ์ ๋ฐ๋ผ ๊ตฌ์กฐ๊ฐ ๋ณ๊ฒฝ๋ฉ๋๋ค!**

# **Before we started, we need to get ...**
1. run `go get github.com/fatih/color` for coloring your terminal
2. run `go get -v github.com/gosuri/uilive` for updating process
3. run `go get -u github.com/go-echarts/go-echarts/v2/...` to see graph with responses in timeseries.
4. run `go get github.com/ompluscator/dynamic-struct` to dynamically add field of json structs.

# **Usage**
1. run `go run main.go` in your terminal and see options

   ```bash
   Alloc = 0 MiB	TotalAlloc = 0 MiB	Sys = 8 MiB	NumGC = 0
       Properties
       - Max parallelism : 8
   Usage of /var/folders/h0/_d_zrr0j57x8wmknjb1r6hfm0000gn/T/go-build3252492082/b001/exe/main:
   -c int
           ์ค๋ ๋ ๊ฐ์ (default 100)
   -j string
           Json "[KEY1,TYPE1,KEY2,TYPE2,...]" 
   -r int
           ์์ฒญ ๊ฐ์ (default 10000)
   -t int
           ์์ฒญ ํ์์์(second) (default 30)
   -u string
           URL
   -s Opening Log Server
   ```                                                    
2. choose your options and run

# **Example**

```bash
$ go run main.go -j "[userId,string,userPw,string,mail,string,userName,string]" -r 10000 -c 1000 -u http://127.0.0.1:8080/auth/user

 [Properties]
- Max parallelism : 8
- Request url : http://127.0.0.1:8080/auth/user
- The number of HTTP Requests : 10000
- The number of threads : 100
Listening server's response .. (10000/10000)

 [Results]
---------------------------------------------------------
| Response Status 	| Count 	| Percent 	|
| 200 			| 10000/10000 	| 100.0%	|
---------------------------------------------------------
- Average response time 	: 110.66 ms
- Max response time     	: 770.32 ms
- Min response time     	: 21.46 ms

 [Memory Usage]
- Heap size = 2 MB
- Cumulative Heap size = 161 MB
- All goroutine size = 22 MB
- GC cycle ํ์ = 48

Finished! ( Total Elapsed Time : 11.4659 seconds ) 
Now you can see response time series graph in local machine => http://localhost:8022 

```

# **Results**
### **๋ฒค์น๋งํฌ ๊ฒฐ๊ณผ ํ์ธ**
![img](../../../assets/img/rds/27.png)
### **์๊ฐ์ ๋ฐ๋ฅธ ์๋ต RTT ๊ทธ๋ํ**
![img](../../../assets/img/rds/28.png)
### **๋ฒค์น๋งํฌ ๋ก๊น**
![img](../../../assets/img/rds/29.png)
