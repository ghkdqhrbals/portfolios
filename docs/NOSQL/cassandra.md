---
layout: default
title: 📌 Cassandra의 구조 및 동작과정, RDB와의 차이점
parent: NO-SQL
nav_order: 1
---
{: .highlight }
> 카산드라는 대표적인 AP 시스템을 사용하는 분산 DB 중 하나입니다
>
> 해당 관련글을 찾던 와중 정말 많은 문서가 존재했지만, 한글화된 문서는 찾아보기 어려웠습니다.
>
> 따라서 이 기회를 빌어 카산드라를 상세하게 정리해볼까 합니다.

### (서론) **먼저 왜 우리는 카산드라를 알아야할까요?**

평소에 RDB를 자주 사용하신 분들은 아래와 같은 부분들에서 어려움을 느꼈을거에요.

1. DB를 수평적으로 확장하기 힘든 구조
2. 정해진 스키마만 사용할 수 있음
3. READ/WRITE가 느림
4. 데이터 특성을 고려하기 힘듬
5. 장애대응

그래서 카산드라는 위의 부분들을 아래와 같이 고려하여 설계되었습니다.

1. DB를 수평적으로 추가하기 쉬움
2. 정해진 스키마 이외에 추가가능
3. 빠른 READ/WRITE
4. 데이터의 지역적인 특성 고려
5. replica를 통한 장애대응 용이

추가적으로 아래또한 고려한답니다.
* AP 시스템이지만, 사용자를 위한 Consistency 레벨을 추가적으로 설정가능

### (서론) **그렇다면 어떤 서비스가 카산드라를 사용하면 좋을까요?**
* 데이터의 순서/정합성을 검증할 필요가 없을 경우( ex) 트위터 게시물 업로드 )
* row 별 다양한 컬럼형태가 필요할 때( 즉 테이블 내 칼럼들이 많고, 각 row들은 칼럼들을 부분적으로 뽑아서 사용할 때 )
> ![NF](../../../assets/img/db/카산드라1.png)
* 수평적으로 확장가능한 데이터 베이스가 필요할 때
* 보조 INDEX가 필요하지 않는 경우

카산드라를 설명하기에 앞서 먼저 RDB와 어떤 차이가 있는지 국가별 유저 이름을 관리하는 테이블을 예시로 말씀드릴게요.

## 1. **기존 Relational DB**

| country | id(**Primary Key**) | name  |
|---------|-----------------|-------|
| USA     | 1               | John  |
| USA     | 2               | Ann   |
| KOR     | 3               | Kim   |
| KOR     | 4               | HWANG |

위의 테이블을 만들기 위해서는 아래의 과정이 필요합니다.
1. 테이블 생성
```sql
CREATE TABLE user (country varchar, id int, name varchar, PRIMARY KEY (id));
```
2. 데이터 삽입
```sql
INSERT INTO user VALUES ('USA', 1, 'John');
```

### 1-1. **Relational DB의 부족한 점**
RDB의 부족한 점은 무엇일까요? 이전에도 말씀드렸던 부분을 예시와 함께 아래와 같이 설명하겠습니다.

* 정해진 스키마만 사용가능
  * user 테이블에 name을 지정하지 않고 값을 넣는것이 불가능합니다. 넣게 되더라도 null로 넣어야겠죠?
* 데이터 특성을 고려하지 않은 확장
  * USA 에 많은 이름이 몰릴 경우 DB를 수직적으로 늘려야합니다. 이 경우, 결과적으로 KOR을 저장하는 공간또한 늘어나는데요. 이는 불필요한 확장입니다. 즉 저는 country 별로 DB를 확장하고 싶지만, 위의 스키마를 가지는 RDB라면 불가능합니다.
* 데이터의 지역성을 고려하지 않음
  * 저는 USA 와 관련된 데이터는 미국에 데이터 센터를 따로 둠으로써 조금 더 접근이 빠르도록 설정하고싶습니다. 하지만 위와 같은 RDB의 경우 한곳에서만 관리해야되겠죠? 한다고 하더라도 테이블을 분리해야됩니다. 따라서 여러곳에 DB를 따로 떼서 설정해야하는 만큼, 유지관리가 힘들어집니다.

## 2. **Cassandra**
카산드라는 데이터를 저장하는 서버를 **노드**라고 부르며, 이 노드들은 **링**의 형태로 구성됩니다. 

그리고 데이터를 READ/WRITE 시, 각각의 데이터를 **알맞는** 노드에 분산시켜주는 역할을 수행합니다.

예제 셋업과 카산드라의 구조를 이제부터 설명드리겠습니다.

### 2-1. 예제 셋업
#### 2-1-1. Cassandra 설치와 실행

1. 먼저 복잡한 install 필요없이 `docker pull cassandra:latest` 을 terminal에서 실행해서 이미지를 다운받아주세요.
2. `docker run --name cass_cluster cassandra:latest` 으로 cass_cluster 이라는 이름으로 컨테이너를 실행해주세요. 
3. `docker exec -it cass_cluster /bin/bash`로 실행된 컨테이너 내 터미널을 띄워주세요.
4. 터미널 내, `notetool status` 로 현재 상태를 확인해주세요. 그러면 아래와 같이 보일거에요. 

  ```bash
  root@b5dd67bd786f:/etc/cassandra# nodetool status
  Datacenter: datacenter1
  =======================
  Status=Up/Down
  |/ State=Normal/Leaving/Joining/Moving
  --  Address     Load       Tokens  Owns (effective)  Host ID                               Rack
  UN  172.17.0.2  117.4 KiB  16      100.0%            b1ce1dd2-5f53-41a0-a10b-2cd1227f1f8b  rack1
  ```

  기본적으로 하나의 데이터 센터와 하나의 랙, 하나의 노드로 구성된 단일 클러스터로 설정됩니다. Tokens나 Owns는 따로 나중에 설명하겠습니다.

#### 2-1-2. CQL 문 작성
카산드라는 CQL이라는 문법을 통해 데이터베이스를 관리합니다. 이는 SQL 문법과 상당히 유사해요. 아래와 같이 cqlsh에 접속해서 차근차근 예제를 진행해보겠습니다.

```bash
1. 터미널에서 cqlsh 를 실행해주세요
root@b5dd67bd786f:/etc/cassandra# cqlsh
Connected to Test Cluster at 127.0.0.1:9042
[cqlsh 6.1.0 | Cassandra 4.1.0 | CQL spec 3.4.6 | Native protocol v5]
...

2. cqlsh 내부에서 KEY SPACE를 생성해주세요
간단하게 설명하자면, KEY SPACE는 여러 테이블의 집합이며 복제전략을 정의하는 네임스페이스입니다.
자세한 설명은 이후에 말씀드리겠습니다.   
cqlsh> CREATE KEYSPACE my_keyspace WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1':1} AND durable_writes = 'true';
cqlsh> DESCRIBE KEYSPACES
my_keyspace  system_auth         system_schema  system_views         
system       system_distributed  system_traces  system_virtual_schema

3. USE로 KEY SPACE를 실행해주세요
cqlsh> USE my_keyspace;

4. KEY SPACE에 접속한 이후, 새로운 테이블을 생성하세요
cqlsh:my_keyspace> CREATE TABLE user ( country text, id int, name text, PRIMARY KEY(country, id));
5. DESCRIBE로 전체 테이블을 확인할 수 있습니다
cqlsh:my_keyspace> DESCRIBE TABLES;
user

6. SELECT로 테이블을 확인하세요.
cqlsh:my_keyspace> SELECT * FROM user;
 country | id | name
---------+----+------
(0 rows)

7. 마지막으로 데이터를 추가해주세요
cqlsh:my_keyspace> INSERT INTO user (country, id, name) VALUES ('USA',1,'John');
cqlsh:my_keyspace> INSERT INTO user (country, id, name) VALUES ('USA',2,'Ann');
cqlsh:my_keyspace> INSERT INTO user (country, id, name) VALUES ('KOR', 3, 'Kim');
cqlsh:my_keyspace> INSERT INTO user (country, id, name) VALUES ('KOR', 4, 'Hwang');
cqlsh:my_keyspace> SELECT * FROM user;
 country | id | name
---------+----+-------
     KOR |  3 |   Kim
     KOR |  4 | Hwang
     USA |  1 |  John
     USA |  2 |   Ann
(4 rows)
```

### 2-2. 카산드라의 구조

#### 2-2-1. 카산드라 노드에 데이터가 삽입되는 과정
![img](../../../assets/img/db/카산드라5.png)

이전에 우리는 예제와 동일한 테이블을 만들었습니다. 이제 데이터의 READ/WRITE 방식을 자세히 말씀드리겠습니다.

이전 설명에서 **카산드라는 노드를 링의 형태로 구성**한다고 말씀드렸습니다. 조금 더 상세히 말하면 링은 **TOKEN**이라는 단위로 나뉘며, 각 노드들은 일정 범위의 토큰들을 맡게됩니다. 

#### 2-2-2. 카산드라 토큰 생성 방식
데이터들은 자신만의 토큰을 가지고 있습니다. 이 토큰은 Partition Key 가 Hash 화 된 것을 명칭합니다. `TOKEN = HASH(Partition Key)`.

예시와 함계 설명해볼까요?

Partition Key는 Hash Function을 지나 **TOKEN**으로 변환되는데요. 위의 예제의 경우는 'USA'(Partition Key)는 65(TOKEN)로 변환되죠. 그리고 65(TOKEN)은 토큰의 60 ~ 69를 맡고있는 노드7에 배정됩니다. 따라서 Partition Key로 인해 노드7에 READ/WRITE를 수행하게 되는 것이죠.

**즉 정리하면, 카산드라는 데이터마다 가지고 있는 Partition Key를 통해 어느 노드에 READ/WRITE 할 지 정하게 됩니다**

{: .important }
> 여기서 중요한 점은 **카산드라는 Partition Key 에 의해 모든 쿼리가 수행됩니다.** SELECT 문으로 John이라는 이름을 가지는 사용자의 국가를 쿼리해볼까요?
>
>```bash
>cqlsh:my_keyspace> SELECT * FROM user WHERE name='John';
> InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
>```
>
> 위의 쿼리 결과, **실패**합니다. 이유는, **애초에 위의 쿼리를 어디의 노드에서 수행할 지 모르기 떄문입니다**
> 
> 대응방법으로는 name 기반 인덱싱을 따로 해주어야 하며, 카산드라에서는 **2-4. MATERIALIZED VIEW**로 새로운 뷰를 만들어서 활용해야합니다.

#### 2-2-3. 키의 종류
이전 우리는 Partition Key를 통해 데이터가 저장된 노드의 위치를 특정지을 수 있었습니다. 카산드라는 Partition Key 이외, **Composite Key** 와 **Clustering Key** 이 두가지를 제공하는데요.

* 먼저 **Composite Key**는 아래와 같이 여러 칼럼을 Partition Key로 묶어주는 키 입니다.
  
  ```cassandraql
  CREATE TABLE user ( country text, id int, name text, 
      PRIMARY KEY( 
          (country, id),
          name 
      )
  );
  ```

* **Clustering Key**는 데이터를 해당 키로 정렬해주게 됩니다.

  기존 예제에 DESCRIBE user을 통해 한번 관찰해볼까요?
  
  ```
  cqlsh:my_keyspace> DESCRIBE user;
  
  CREATE TABLE my_keyspace.user (
      country text,
      id int,
      name text,
      PRIMARY KEY (country, id)
  ) WITH CLUSTERING ORDER BY (id ASC) <-- 동일 파티션 내 id 순서대로 정렬
      ...
  ```
  
  앞서 우리는 `CREATE TABLE ... PRIMARY KEY(country, id);`로 새로운 테이블을 만들었습니다. 여기서 PRIMARY KEY(first arg, args) 의 first arg인 country는 Partition Key가 됩니다. 이후 지정하는 argument들은 전부 Clustering Key로 지정되는데요. 여기서는 id가 Clustering Key로 지정되었습니다. 자세히 보면 `ORDER BY`가 붙어있습니다. **동일한 Partition Key 내, id는 순서대로 정렬된다는 것이죠.** 그렇다면 정말 정렬되어있는지, SELECT 로 관찰해볼까요?
  
  ```bash
  cqlsh:my_keyspace> SELECT * FROM user;
  country | id | name
  ---------+----+-------
  KOR |  3 |   Kim
  KOR |  4 | Hwang
  USA |  1 |  John
  USA |  2 |   Ann
  (4 rows)
  ```
  
  `KOR` 이라는 동일 파티션 키를 가지는 내부에서는 id의 순서에 따라 자동으로 정렬된 것을 확인할 수 있습니다. 이는 `USA` 파티션에서도 마찬가지죠!

#### 2-2-4. 카산드라 복제본 전략
지금까지 과정을 요약하면 다음과 같습니다. 카산드라는 노드를 링의 형태로 구성하며, 각각의 데이터는 자신의 Partition Key를 해시화하여 토큰을 생성합니다. 그리고 이러한 토큰은 해당되는 노드와 매칭되며, 해당 노드에 데이터가 READ/WRITE 됩니다.

하지만 만약 특정 노드에 장애가 발생한다면 어떨까요? 당연한 말이지만, 해당 노드가 관리하는 데이터는 사용이 불가능해지겠죠.

카산드라는 하나의 노드에 장애가 발생하더라도 서비스 가능하도록 **복제본**을 구성합니다.

앞서 우리는 KEY SPACE 를 만들었죠? 이 **KEY SPACE 는 복제본을 몇 개 설정해주는지 정의하는 역할**을 수행합니다! 

```cassandraql
CREATE KEYSPACE my_keyspace WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1':1} AND durable_writes = 'true';
```

여기서 처음 보는 단어가 있죠. `'class': 'NetworkTopologyStrategy'` 와 `'datacenter1':1` 입니다.

카산드라는 복제 전략을 두 가지 가지고 있습니다.
* **SimpleStrategy**: 오직 하나의 데이터 센터와 하나의 랙, 노드를 사용하는 전략입니다. 즉, 같은 노드 내에서 복제본을 생성하는 것이죠. 이 전략을 통해 구성하는 복제본은 사실상 필요하지 않습니다. 노드 장애 시 복제본 또한 쓸모없어지기 때문이죠.
* **NetworkTopologyStrategy**: 여러 데이터 센터와 랙, 노드를 운영할 때 사용하는 전략입니다. 즉, 여러 노드에 걸쳐 복제본을 생성하는 것이죠. Highly recommended!

그리고 NetworkTopologyStrategy 전략을 사용하게 된다면, **데이터 센터** 별 복제계수를 설정해야하는데요. 여기서 데이터 센터란 무엇일까요?

![img](../../../assets/img/db/카산드라6.png)

* Data Center : Rack의 집합 
* Rack : 노드의 집합

**(작성중)**

### 2-3. MATERIALIZED VIEW
MATERIALIZED VIEW는 **테이블을 새롭게 인덱싱한 뷰**를 하나 만드는 것입니다. 그래서 원본 테이블에 변경이 일어나면, MATERIALIZED VIEW 또한 변경된 값으로 보이게 됩니다!

이 뷰를 어떻게 만드는지 말씀드릴게요.

#### 2-3-1. MATERIALIZED VIEW 설정

이를 위해선 먼저 cassandra.yaml 설정파일을 변경해야합니다. 그러기 위해서는 먼저 컨테이너에 vim을 설치해야겟죠 ㅜㅜ... 또 이를 위해선 먼저 apt를 업데이트해줘야합니다.
 
```bash
apt-get update
apt-get install apt-file
apt-file update
apt-get install vim
```

vim으로 etc/cassandra/cassandra.yaml 을 열어주세요. 그리고 vim 내에서 `/materialized_views_enabled`로 materialized_views_enabled를 찾고 엔터를 누르세요.(이후 앞 뒤로 찾는 것은 n, N으로 가능합니다)
```bash
...
# Enables materialized view creation on this node.
# Materialized views are considered experimental and are not recommended for production use.
materialized_views_enabled: true <- 이 부분을 true로 바꿔주세요!
...
```
 
#### 2-3-2. MATERIALIZED VIEW 생성 및 확인

```bash
1. 같은 key_space 내 원하는 뷰 이름을 적고, name을 Partition Key로 설정합니다.
cqlsh:my_keyspace> CREATE MATERIALIZED VIEW my_keyspace.new_table AS SELECT * FROM my_keyspace.user WHERE name IS NOT NULL AND country IS NOT NULL AND id IS NOT NULL PRIMARY KEY(name, country, id);

cqlsh:my_keyspace> SELECT * FROM my_keyspace.new_table;
 name  | country | id
-------+---------+----
  John |     USA |  1
   Ann |     USA |  2
   Kim |     KOR |  3
 Hwang |     KOR |  4
(4 rows)

cqlsh:my_keyspace> SELECT * FROM my_keyspace.new_table WHERE name='John';
 name | country | id
------+---------+----
 John |     USA |  1
(1 rows)

cqlsh:my_keyspace> SELECT * FROM user;
 country | id | name
---------+----+-------
     KOR |  3 |   Kim
     KOR |  4 | Hwang
     USA |  1 |  John
     USA |  2 |   Ann
(4 rows)

cqlsh:my_keyspace> INSERT INTO user VALUES('KOR',5,'John');
SyntaxException: line 1:17 no viable alternative at input 'VALUES' (INSERT INTO [user] VALUES...)

cqlsh:my_keyspace> INSERT INTO user (country, id, name) VALUES('KOR',5,'John');

cqlsh:my_keyspace> SELECT * FROM user;
 country | id | name
---------+----+-------
     KOR |  3 |   Kim
     KOR |  4 | Hwang
     KOR |  5 |  John
     USA |  1 |  John
     USA |  2 |   Ann
(5 rows)

cqlsh:my_keyspace>  SELECT * FROM my_keyspace.new_table WHERE name='John';
 name | country | id
------+---------+----
 John |     KOR |  5
 John |     USA |  1
(2 rows)
```














cqlsh> CONSISTENCY;
Current consistency level is ONE.

# Reference
* [https://blog.acronym.co.kr/491](https://blog.acronym.co.kr/491)
* [https://devfoxstar.github.io/database/cassandra-study-first/](https://devfoxstar.github.io/database/cassandra-study-first/)