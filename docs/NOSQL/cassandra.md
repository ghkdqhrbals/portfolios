---
layout: default
title: ๐ Cassandra์ ๊ตฌ์กฐ ๋ฐ ๋์๊ณผ์ , RDB์์ ์ฐจ์ด์ 
parent: ๐ NO-SQL
nav_order: 6
---
{: .highlight }
> ์นด์ฐ๋๋ผ๋ ๋ํ์ ์ธ AP ์์คํ์ ์ฌ์ฉํ๋ ๋ถ์ฐ DB ์ค ํ๋์๋๋ค
>
> ํด๋น ๊ด๋ จ๊ธ์ ์ฐพ๋ ์์ค ์ ๋ง ๋ง์ ๋ฌธ์๊ฐ ์กด์ฌํ์ง๋ง, ํ๊ธํ๋ ๋ฌธ์๋ ์ฐพ์๋ณด๊ธฐ ์ด๋ ค์ ์ต๋๋ค.
>
> ๋ฐ๋ผ์ ์ด ๊ธฐํ๋ฅผ ๋น์ด ์นด์ฐ๋๋ผ๋ฅผ ์์ธํ๊ฒ ์ ๋ฆฌํด๋ณผ๊น ํฉ๋๋ค.

### (์๋ก ) **๋จผ์  ์ ์ฐ๋ฆฌ๋ ์นด์ฐ๋๋ผ๋ฅผ ์์์ผํ ๊น์?**

ํ์์ RDB๋ฅผ ์์ฃผ ์ฌ์ฉํ์  ๋ถ๋ค์ ์๋์ ๊ฐ์ ๋ถ๋ถ๋ค์์ ์ด๋ ค์์ ๋๊ผ์๊ฑฐ์์.

1. DB๋ฅผ ์ํ์ ์ผ๋ก ํ์ฅํ๊ธฐ ํ๋  ๊ตฌ์กฐ
2. ์ ํด์ง ์คํค๋ง๋ง ์ฌ์ฉํ  ์ ์์
3. READ/WRITE๊ฐ ๋๋ฆผ
4. ๋ฐ์ดํฐ ํน์ฑ์ ๊ณ ๋ คํ๊ธฐ ํ๋ฌ
5. ์ฅ์ ๋์

๊ทธ๋์ ์นด์ฐ๋๋ผ๋ ์์ ๋ถ๋ถ๋ค์ ์๋์ ๊ฐ์ด ๊ณ ๋ คํ์ฌ ์ค๊ณ๋์์ต๋๋ค.

1. DB๋ฅผ ์ํ์ ์ผ๋ก ์ถ๊ฐํ๊ธฐ ์ฌ์
2. ์ ํด์ง ์คํค๋ง ์ด์ธ์ ์ถ๊ฐ๊ฐ๋ฅ
3. ๋น ๋ฅธ READ/WRITE
4. ๋ฐ์ดํฐ์ ์ง์ญ์ ์ธ ํน์ฑ ๊ณ ๋ ค
5. replica๋ฅผ ํตํ ์ฅ์ ๋์ ์ฉ์ด

์ถ๊ฐ์ ์ผ๋ก ์๋๋ํ ๊ณ ๋ คํ๋ต๋๋ค.
* AP ์์คํ์ด์ง๋ง, ์ฌ์ฉ์๋ฅผ ์ํ Consistency ๋ ๋ฒจ์ ์ถ๊ฐ์ ์ผ๋ก ์ค์ ๊ฐ๋ฅ

### (์๋ก ) **๊ทธ๋ ๋ค๋ฉด ์ด๋ค ์๋น์ค๊ฐ ์นด์ฐ๋๋ผ๋ฅผ ์ฌ์ฉํ๋ฉด ์ข์๊น์?**
* ๋ฐ์ดํฐ์ ์์/์ ํฉ์ฑ์ ๊ฒ์ฆํ  ํ์๊ฐ ์์ ๊ฒฝ์ฐ( ex) ํธ์ํฐ ๊ฒ์๋ฌผ ์๋ก๋ )
* row ๋ณ ๋ค์ํ ์ปฌ๋ผํํ๊ฐ ํ์ํ  ๋( ์ฆ ํ์ด๋ธ ๋ด ์นผ๋ผ๋ค์ด ๋ง๊ณ , ๊ฐ row๋ค์ ์นผ๋ผ๋ค์ ๋ถ๋ถ์ ์ผ๋ก ๋ฝ์์ ์ฌ์ฉํ  ๋ )
> ![NF](../../../assets/img/db/์นด์ฐ๋๋ผ1.png)
* ์ํ์ ์ผ๋ก ํ์ฅ๊ฐ๋ฅํ ๋ฐ์ดํฐ ๋ฒ ์ด์ค๊ฐ ํ์ํ  ๋
* ๋ณด์กฐ INDEX๊ฐ ํ์ํ์ง ์๋ ๊ฒฝ์ฐ

์นด์ฐ๋๋ผ๋ฅผ ์ค๋ชํ๊ธฐ์ ์์ ๋จผ์  RDB์ ์ด๋ค ์ฐจ์ด๊ฐ ์๋์ง ๊ตญ๊ฐ๋ณ ์ ์  ์ด๋ฆ์ ๊ด๋ฆฌํ๋ ํ์ด๋ธ์ ์์๋ก ๋ง์๋๋ฆด๊ฒ์.

## 1. **๊ธฐ์กด Relational DB**

| country | id(**Primary Key**) | name  |
|---------|-----------------|-------|
| USA     | 1               | John  |
| USA     | 2               | Ann   |
| KOR     | 3               | Kim   |
| KOR     | 4               | HWANG |

์์ ํ์ด๋ธ์ ๋ง๋ค๊ธฐ ์ํด์๋ ์๋์ ๊ณผ์ ์ด ํ์ํฉ๋๋ค.
1. ํ์ด๋ธ ์์ฑ
```sql
CREATE TABLE user (country varchar, id int, name varchar, PRIMARY KEY (id));
```
2. ๋ฐ์ดํฐ ์ฝ์
```sql
INSERT INTO user VALUES ('USA', 1, 'John');
```

### 1-1. **Relational DB์ ๋ถ์กฑํ ์ **
RDB์ ๋ถ์กฑํ ์ ์ ๋ฌด์์ผ๊น์? ์ด์ ์๋ ๋ง์๋๋ ธ๋ ๋ถ๋ถ์ ์์์ ํจ๊ป ์๋์ ๊ฐ์ด ์ค๋ชํ๊ฒ ์ต๋๋ค.

* ์ ํด์ง ์คํค๋ง๋ง ์ฌ์ฉ๊ฐ๋ฅ
  * user ํ์ด๋ธ์ name์ ์ง์ ํ์ง ์๊ณ  ๊ฐ์ ๋ฃ๋๊ฒ์ด ๋ถ๊ฐ๋ฅํฉ๋๋ค. ๋ฃ๊ฒ ๋๋๋ผ๋ null๋ก ๋ฃ์ด์ผ๊ฒ ์ฃ ?
* ๋ฐ์ดํฐ ํน์ฑ์ ๊ณ ๋ คํ์ง ์์ ํ์ฅ
  * USA ์ ๋ง์ ์ด๋ฆ์ด ๋ชฐ๋ฆด ๊ฒฝ์ฐ DB๋ฅผ ์์ง์ ์ผ๋ก ๋๋ ค์ผํฉ๋๋ค. ์ด ๊ฒฝ์ฐ, ๊ฒฐ๊ณผ์ ์ผ๋ก KOR์ ์ ์ฅํ๋ ๊ณต๊ฐ๋ํ ๋์ด๋๋๋ฐ์. ์ด๋ ๋ถํ์ํ ํ์ฅ์๋๋ค. ์ฆ ์ ๋ country ๋ณ๋ก DB๋ฅผ ํ์ฅํ๊ณ  ์ถ์ง๋ง, ์์ ์คํค๋ง๋ฅผ ๊ฐ์ง๋ RDB๋ผ๋ฉด ๋ถ๊ฐ๋ฅํฉ๋๋ค.
* ๋ฐ์ดํฐ์ ์ง์ญ์ฑ์ ๊ณ ๋ คํ์ง ์์
  * ์ ๋ USA ์ ๊ด๋ จ๋ ๋ฐ์ดํฐ๋ ๋ฏธ๊ตญ์ ๋ฐ์ดํฐ ์ผํฐ๋ฅผ ๋ฐ๋ก ๋ ์ผ๋ก์จ ์กฐ๊ธ ๋ ์ ๊ทผ์ด ๋น ๋ฅด๋๋ก ์ค์ ํ๊ณ ์ถ์ต๋๋ค. ํ์ง๋ง ์์ ๊ฐ์ RDB์ ๊ฒฝ์ฐ ํ๊ณณ์์๋ง ๊ด๋ฆฌํด์ผ๋๊ฒ ์ฃ ? ํ๋ค๊ณ  ํ๋๋ผ๋ ํ์ด๋ธ์ ๋ถ๋ฆฌํด์ผ๋ฉ๋๋ค. ๋ฐ๋ผ์ ์ฌ๋ฌ๊ณณ์ DB๋ฅผ ๋ฐ๋ก ๋ผ์ ์ค์ ํด์ผํ๋ ๋งํผ, ์ ์ง๊ด๋ฆฌ๊ฐ ํ๋ค์ด์ง๋๋ค.

## 2. **Cassandra**
์นด์ฐ๋๋ผ๋ ๋ฐ์ดํฐ๋ฅผ ์ ์ฅํ๋ ์๋ฒ๋ฅผ **๋ธ๋**๋ผ๊ณ  ๋ถ๋ฅด๋ฉฐ, ์ด ๋ธ๋๋ค์ **๋ง**์ ํํ๋ก ๊ตฌ์ฑ๋ฉ๋๋ค. 

๊ทธ๋ฆฌ๊ณ  ๋ฐ์ดํฐ๋ฅผ READ/WRITE ์, ๊ฐ๊ฐ์ ๋ฐ์ดํฐ๋ฅผ **์๋ง๋** ๋ธ๋์ ๋ถ์ฐ์์ผ์ฃผ๋ ์ญํ ์ ์ํํฉ๋๋ค.

์์  ์์๊ณผ ์นด์ฐ๋๋ผ์ ๊ตฌ์กฐ๋ฅผ ์ด์ ๋ถํฐ ์ค๋ช๋๋ฆฌ๊ฒ ์ต๋๋ค.

### 2-1. ์์  ์์
#### 2-1-1. Cassandra ์ค์น์ ์คํ

1. ๋จผ์  ๋ณต์กํ install ํ์์์ด `docker pull cassandra:latest` ์ terminal์์ ์คํํด์ ์ด๋ฏธ์ง๋ฅผ ๋ค์ด๋ฐ์์ฃผ์ธ์.
2. `docker run --name cass_cluster cassandra:latest` ์ผ๋ก cass_cluster ์ด๋ผ๋ ์ด๋ฆ์ผ๋ก ์ปจํ์ด๋๋ฅผ ์คํํด์ฃผ์ธ์. 
3. `docker exec -it cass_cluster /bin/bash`๋ก ์คํ๋ ์ปจํ์ด๋ ๋ด ํฐ๋ฏธ๋์ ๋์์ฃผ์ธ์.
4. ํฐ๋ฏธ๋ ๋ด, `notetool status` ๋ก ํ์ฌ ์ํ๋ฅผ ํ์ธํด์ฃผ์ธ์. ๊ทธ๋ฌ๋ฉด ์๋์ ๊ฐ์ด ๋ณด์ผ๊ฑฐ์์. 

  ```bash
  root@b5dd67bd786f:/etc/cassandra# nodetool status
  Datacenter: datacenter1
  =======================
  Status=Up/Down
  |/ State=Normal/Leaving/Joining/Moving
  --  Address     Load       Tokens  Owns (effective)  Host ID                               Rack
  UN  172.17.0.2  117.4 KiB  16      100.0%            b1ce1dd2-5f53-41a0-a10b-2cd1227f1f8b  rack1
  ```

  ๊ธฐ๋ณธ์ ์ผ๋ก ํ๋์ ๋ฐ์ดํฐ ์ผํฐ์ ํ๋์ ๋, ํ๋์ ๋ธ๋๋ก ๊ตฌ์ฑ๋ ๋จ์ผ ํด๋ฌ์คํฐ๋ก ์ค์ ๋ฉ๋๋ค. Tokens๋ Owns๋ ๋ฐ๋ก ๋์ค์ ์ค๋ชํ๊ฒ ์ต๋๋ค.

#### 2-1-2. CQL ๋ฌธ ์์ฑ
์นด์ฐ๋๋ผ๋ CQL์ด๋ผ๋ ๋ฌธ๋ฒ์ ํตํด ๋ฐ์ดํฐ๋ฒ ์ด์ค๋ฅผ ๊ด๋ฆฌํฉ๋๋ค. ์ด๋ SQL ๋ฌธ๋ฒ๊ณผ ์๋นํ ์ ์ฌํด์. ์๋์ ๊ฐ์ด cqlsh์ ์ ์ํด์ ์ฐจ๊ทผ์ฐจ๊ทผ ์์ ๋ฅผ ์งํํด๋ณด๊ฒ ์ต๋๋ค.

```bash
1. ํฐ๋ฏธ๋์์ cqlsh ๋ฅผ ์คํํด์ฃผ์ธ์
root@b5dd67bd786f:/etc/cassandra# cqlsh
Connected to Test Cluster at 127.0.0.1:9042
[cqlsh 6.1.0 | Cassandra 4.1.0 | CQL spec 3.4.6 | Native protocol v5]
...

2. cqlsh ๋ด๋ถ์์ KEY SPACE๋ฅผ ์์ฑํด์ฃผ์ธ์
๊ฐ๋จํ๊ฒ ์ค๋ชํ์๋ฉด, KEY SPACE๋ ์ฌ๋ฌ ํ์ด๋ธ์ ์งํฉ์ด๋ฉฐ ๋ณต์ ์ ๋ต์ ์ ์ํ๋ ๋ค์์คํ์ด์ค์๋๋ค.
์์ธํ ์ค๋ช์ ์ดํ์ ๋ง์๋๋ฆฌ๊ฒ ์ต๋๋ค.   
cqlsh> CREATE KEYSPACE my_keyspace WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1':1} AND durable_writes = 'true';
cqlsh> DESCRIBE KEYSPACES
my_keyspace  system_auth         system_schema  system_views         
system       system_distributed  system_traces  system_virtual_schema

3. USE๋ก KEY SPACE๋ฅผ ์คํํด์ฃผ์ธ์
cqlsh> USE my_keyspace;

4. KEY SPACE์ ์ ์ํ ์ดํ, ์๋ก์ด ํ์ด๋ธ์ ์์ฑํ์ธ์
cqlsh:my_keyspace> CREATE TABLE user ( country text, id int, name text, PRIMARY KEY(country, id));
5. DESCRIBE๋ก ์ ์ฒด ํ์ด๋ธ์ ํ์ธํ  ์ ์์ต๋๋ค
cqlsh:my_keyspace> DESCRIBE TABLES;
user

6. SELECT๋ก ํ์ด๋ธ์ ํ์ธํ์ธ์.
cqlsh:my_keyspace> SELECT * FROM user;
 country | id | name
---------+----+------
(0 rows)

7. ๋ง์ง๋ง์ผ๋ก ๋ฐ์ดํฐ๋ฅผ ์ถ๊ฐํด์ฃผ์ธ์
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

### 2-2. ์นด์ฐ๋๋ผ์ ๊ตฌ์กฐ

#### 2-2-1. ์นด์ฐ๋๋ผ ๋ธ๋์ ๋ฐ์ดํฐ๊ฐ ์ฝ์๋๋ ๊ณผ์ 
![img](../../../assets/img/db/์นด์ฐ๋๋ผ5.png)

์ด์ ์ ์ฐ๋ฆฌ๋ ์์ ์ ๋์ผํ ํ์ด๋ธ์ ๋ง๋ค์์ต๋๋ค. ์ด์  ๋ฐ์ดํฐ์ READ/WRITE ๋ฐฉ์์ ์์ธํ ๋ง์๋๋ฆฌ๊ฒ ์ต๋๋ค.

์ด์  ์ค๋ช์์ **์นด์ฐ๋๋ผ๋ ๋ธ๋๋ฅผ ๋ง์ ํํ๋ก ๊ตฌ์ฑ**ํ๋ค๊ณ  ๋ง์๋๋ ธ์ต๋๋ค. ์กฐ๊ธ ๋ ์์ธํ ๋งํ๋ฉด ๋ง์ **TOKEN**์ด๋ผ๋ ๋จ์๋ก ๋๋๋ฉฐ, ๊ฐ ๋ธ๋๋ค์ ์ผ์  ๋ฒ์์ ํ ํฐ๋ค์ ๋งก๊ฒ๋ฉ๋๋ค. 

#### 2-2-2. ์นด์ฐ๋๋ผ ํ ํฐ ์์ฑ ๋ฐฉ์
๋ฐ์ดํฐ๋ค์ ์์ ๋ง์ ํ ํฐ์ ๊ฐ์ง๊ณ  ์์ต๋๋ค. ์ด ํ ํฐ์ Partition Key ๊ฐ Hash ํ ๋ ๊ฒ์ ๋ช์นญํฉ๋๋ค. `TOKEN = HASH(Partition Key)`.

์์์ ํจ๊ณ ์ค๋ชํด๋ณผ๊น์?

Partition Key๋ Hash Function์ ์ง๋ **TOKEN**์ผ๋ก ๋ณํ๋๋๋ฐ์. ์์ ์์ ์ ๊ฒฝ์ฐ๋ 'USA'(Partition Key)๋ 65(TOKEN)๋ก ๋ณํ๋์ฃ . ๊ทธ๋ฆฌ๊ณ  65(TOKEN)์ ํ ํฐ์ 60 ~ 69๋ฅผ ๋งก๊ณ ์๋ ๋ธ๋7์ ๋ฐฐ์ ๋ฉ๋๋ค. ๋ฐ๋ผ์ Partition Key๋ก ์ธํด ๋ธ๋7์ READ/WRITE๋ฅผ ์ํํ๊ฒ ๋๋ ๊ฒ์ด์ฃ .

**์ฆ ์ ๋ฆฌํ๋ฉด, ์นด์ฐ๋๋ผ๋ ๋ฐ์ดํฐ๋ง๋ค ๊ฐ์ง๊ณ  ์๋ Partition Key๋ฅผ ํตํด ์ด๋ ๋ธ๋์ READ/WRITE ํ  ์ง ์ ํ๊ฒ ๋ฉ๋๋ค**

{: .important }
> ์ฌ๊ธฐ์ ์ค์ํ ์ ์ **์นด์ฐ๋๋ผ๋ Partition Key ์ ์ํด ๋ชจ๋  ์ฟผ๋ฆฌ๊ฐ ์ํ๋ฉ๋๋ค.** SELECT ๋ฌธ์ผ๋ก John์ด๋ผ๋ ์ด๋ฆ์ ๊ฐ์ง๋ ์ฌ์ฉ์์ ๊ตญ๊ฐ๋ฅผ ์ฟผ๋ฆฌํด๋ณผ๊น์?
>
>```bash
>cqlsh:my_keyspace> SELECT * FROM user WHERE name='John';
> InvalidRequest: Error from server: code=2200 [Invalid query] message="Cannot execute this query as it might involve data filtering and thus may have unpredictable performance. If you want to execute this query despite the performance unpredictability, use ALLOW FILTERING"
>```
>
> ์์ ์ฟผ๋ฆฌ ๊ฒฐ๊ณผ, **์คํจ**ํฉ๋๋ค. ์ด์ ๋, **์ ์ด์ ์์ ์ฟผ๋ฆฌ๋ฅผ ์ด๋์ ๋ธ๋์์ ์ํํ  ์ง ๋ชจ๋ฅด๊ธฐ ๋๋ฌธ์๋๋ค**
> 
> ๋์๋ฐฉ๋ฒ์ผ๋ก๋ name ๊ธฐ๋ฐ ์ธ๋ฑ์ฑ์ ๋ฐ๋ก ํด์ฃผ์ด์ผ ํ๋ฉฐ, ์นด์ฐ๋๋ผ์์๋ **2-4. MATERIALIZED VIEW**๋ก ์๋ก์ด ๋ทฐ๋ฅผ ๋ง๋ค์ด์ ํ์ฉํด์ผํฉ๋๋ค.

#### 2-2-3. ํค์ ์ข๋ฅ
์ด์  ์ฐ๋ฆฌ๋ Partition Key๋ฅผ ํตํด ๋ฐ์ดํฐ๊ฐ ์ ์ฅ๋ ๋ธ๋์ ์์น๋ฅผ ํน์ ์ง์ ์ ์์์ต๋๋ค. ์นด์ฐ๋๋ผ๋ Partition Key ์ด์ธ, **Composite Key** ์ **Clustering Key** ์ด ๋๊ฐ์ง๋ฅผ ์ ๊ณตํ๋๋ฐ์.

* ๋จผ์  **Composite Key**๋ ์๋์ ๊ฐ์ด ์ฌ๋ฌ ์นผ๋ผ์ Partition Key๋ก ๋ฌถ์ด์ฃผ๋ ํค ์๋๋ค.
  
  ```cassandraql
  CREATE TABLE user ( country text, id int, name text, 
      PRIMARY KEY( 
          (country, id),
          name 
      )
  );
  ```

* **Clustering Key**๋ ๋ฐ์ดํฐ๋ฅผ ํด๋น ํค๋ก ์ ๋ ฌํด์ฃผ๊ฒ ๋ฉ๋๋ค.

  ๊ธฐ์กด ์์ ์ DESCRIBE user์ ํตํด ํ๋ฒ ๊ด์ฐฐํด๋ณผ๊น์?
  
  ```
  cqlsh:my_keyspace> DESCRIBE user;
  
  CREATE TABLE my_keyspace.user (
      country text,
      id int,
      name text,
      PRIMARY KEY (country, id)
  ) WITH CLUSTERING ORDER BY (id ASC) <-- ๋์ผ ํํฐ์ ๋ด id ์์๋๋ก ์ ๋ ฌ
      ...
  ```
  
  ์์ ์ฐ๋ฆฌ๋ `CREATE TABLE ... PRIMARY KEY(country, id);`๋ก ์๋ก์ด ํ์ด๋ธ์ ๋ง๋ค์์ต๋๋ค. ์ฌ๊ธฐ์ PRIMARY KEY(first arg, args) ์ first arg์ธ country๋ Partition Key๊ฐ ๋ฉ๋๋ค. ์ดํ ์ง์ ํ๋ argument๋ค์ ์ ๋ถ Clustering Key๋ก ์ง์ ๋๋๋ฐ์. ์ฌ๊ธฐ์๋ id๊ฐ Clustering Key๋ก ์ง์ ๋์์ต๋๋ค. ์์ธํ ๋ณด๋ฉด `ORDER BY`๊ฐ ๋ถ์ด์์ต๋๋ค. **๋์ผํ Partition Key ๋ด, id๋ ์์๋๋ก ์ ๋ ฌ๋๋ค๋ ๊ฒ์ด์ฃ .** ๊ทธ๋ ๋ค๋ฉด ์ ๋ง ์ ๋ ฌ๋์ด์๋์ง, SELECT ๋ก ๊ด์ฐฐํด๋ณผ๊น์?
  
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
  
  `KOR` ์ด๋ผ๋ ๋์ผ ํํฐ์ ํค๋ฅผ ๊ฐ์ง๋ ๋ด๋ถ์์๋ id์ ์์์ ๋ฐ๋ผ ์๋์ผ๋ก ์ ๋ ฌ๋ ๊ฒ์ ํ์ธํ  ์ ์์ต๋๋ค. ์ด๋ `USA` ํํฐ์์์๋ ๋ง์ฐฌ๊ฐ์ง์ฃ !

#### 2-2-4. ์นด์ฐ๋๋ผ ๋ณต์ ๋ณธ ์ ๋ต
์ง๊ธ๊น์ง ๊ณผ์ ์ ์์ฝํ๋ฉด ๋ค์๊ณผ ๊ฐ์ต๋๋ค. ์นด์ฐ๋๋ผ๋ ๋ธ๋๋ฅผ ๋ง์ ํํ๋ก ๊ตฌ์ฑํ๋ฉฐ, ๊ฐ๊ฐ์ ๋ฐ์ดํฐ๋ ์์ ์ Partition Key๋ฅผ ํด์ํํ์ฌ ํ ํฐ์ ์์ฑํฉ๋๋ค. ๊ทธ๋ฆฌ๊ณ  ์ด๋ฌํ ํ ํฐ์ ํด๋น๋๋ ๋ธ๋์ ๋งค์นญ๋๋ฉฐ, ํด๋น ๋ธ๋์ ๋ฐ์ดํฐ๊ฐ READ/WRITE ๋ฉ๋๋ค.

ํ์ง๋ง ๋ง์ฝ ํน์  ๋ธ๋์ ์ฅ์ ๊ฐ ๋ฐ์ํ๋ค๋ฉด ์ด๋จ๊น์? ๋น์ฐํ ๋ง์ด์ง๋ง, ํด๋น ๋ธ๋๊ฐ ๊ด๋ฆฌํ๋ ๋ฐ์ดํฐ๋ ์ฌ์ฉ์ด ๋ถ๊ฐ๋ฅํด์ง๊ฒ ์ฃ .

์นด์ฐ๋๋ผ๋ ํ๋์ ๋ธ๋์ ์ฅ์ ๊ฐ ๋ฐ์ํ๋๋ผ๋ ์๋น์ค ๊ฐ๋ฅํ๋๋ก **๋ณต์ ๋ณธ**์ ๊ตฌ์ฑํฉ๋๋ค.

์์ ์ฐ๋ฆฌ๋ KEY SPACE ๋ฅผ ๋ง๋ค์์ฃ ? ์ด **KEY SPACE ๋ ๋ณต์ ๋ณธ์ ๋ช ๊ฐ ์ค์ ํด์ฃผ๋์ง ์ ์ํ๋ ์ญํ **์ ์ํํฉ๋๋ค! 

```cassandraql
CREATE KEYSPACE my_keyspace WITH replication = {'class': 'NetworkTopologyStrategy', 'datacenter1':1} AND durable_writes = 'true';
```

์ฌ๊ธฐ์ ์ฒ์ ๋ณด๋ ๋จ์ด๊ฐ ์์ฃ . `'class': 'NetworkTopologyStrategy'` ์ `'datacenter1':1` ์๋๋ค.

์นด์ฐ๋๋ผ๋ ๋ณต์  ์ ๋ต์ ๋ ๊ฐ์ง ๊ฐ์ง๊ณ  ์์ต๋๋ค.
* **SimpleStrategy**: ์ค์ง ํ๋์ ๋ฐ์ดํฐ ์ผํฐ์ ํ๋์ ๋, ๋ธ๋๋ฅผ ์ฌ์ฉํ๋ ์ ๋ต์๋๋ค. ์ฆ, ๊ฐ์ ๋ธ๋ ๋ด์์ ๋ณต์ ๋ณธ์ ์์ฑํ๋ ๊ฒ์ด์ฃ . ์ด ์ ๋ต์ ํตํด ๊ตฌ์ฑํ๋ ๋ณต์ ๋ณธ์ ์ฌ์ค์ ํ์ํ์ง ์์ต๋๋ค. ๋ธ๋ ์ฅ์  ์ ๋ณต์ ๋ณธ ๋ํ ์ธ๋ชจ์์ด์ง๊ธฐ ๋๋ฌธ์ด์ฃ .
* **NetworkTopologyStrategy**: ์ฌ๋ฌ ๋ฐ์ดํฐ ์ผํฐ์ ๋, ๋ธ๋๋ฅผ ์ด์ํ  ๋ ์ฌ์ฉํ๋ ์ ๋ต์๋๋ค. ์ฆ, ์ฌ๋ฌ ๋ธ๋์ ๊ฑธ์ณ ๋ณต์ ๋ณธ์ ์์ฑํ๋ ๊ฒ์ด์ฃ . Highly recommended!

๊ทธ๋ฆฌ๊ณ  NetworkTopologyStrategy ์ ๋ต์ ์ฌ์ฉํ๊ฒ ๋๋ค๋ฉด, **๋ฐ์ดํฐ ์ผํฐ** ๋ณ ๋ณต์ ๊ณ์๋ฅผ ์ค์ ํด์ผํ๋๋ฐ์. ์ฌ๊ธฐ์ ๋ฐ์ดํฐ ์ผํฐ๋ ๋ฌด์์ผ๊น์?

![img](../../../assets/img/db/์นด์ฐ๋๋ผ6.png)

* Data Center : Rack์ ์งํฉ 
* Rack : ๋ธ๋์ ์งํฉ

**(์์ฑ์ค)**

### 2-3. MATERIALIZED VIEW
MATERIALIZED VIEW๋ **ํ์ด๋ธ์ ์๋กญ๊ฒ ์ธ๋ฑ์ฑํ ๋ทฐ**๋ฅผ ํ๋ ๋ง๋๋ ๊ฒ์๋๋ค. ๊ทธ๋์ ์๋ณธ ํ์ด๋ธ์ ๋ณ๊ฒฝ์ด ์ผ์ด๋๋ฉด, MATERIALIZED VIEW ๋ํ ๋ณ๊ฒฝ๋ ๊ฐ์ผ๋ก ๋ณด์ด๊ฒ ๋ฉ๋๋ค!

์ด ๋ทฐ๋ฅผ ์ด๋ป๊ฒ ๋ง๋๋์ง ๋ง์๋๋ฆด๊ฒ์.

#### 2-3-1. MATERIALIZED VIEW ์ค์ 

์ด๋ฅผ ์ํด์  ๋จผ์  cassandra.yaml ์ค์ ํ์ผ์ ๋ณ๊ฒฝํด์ผํฉ๋๋ค. ๊ทธ๋ฌ๊ธฐ ์ํด์๋ ๋จผ์  ์ปจํ์ด๋์ vim์ ์ค์นํด์ผ๊ฒ์ฃ  ใใ... ๋ ์ด๋ฅผ ์ํด์  ๋จผ์  apt๋ฅผ ์๋ฐ์ดํธํด์ค์ผํฉ๋๋ค.
 
```bash
apt-get update
apt-get install apt-file
apt-file update
apt-get install vim
```

vim์ผ๋ก etc/cassandra/cassandra.yaml ์ ์ด์ด์ฃผ์ธ์. ๊ทธ๋ฆฌ๊ณ  vim ๋ด์์ `/materialized_views_enabled`๋ก materialized_views_enabled๋ฅผ ์ฐพ๊ณ  ์ํฐ๋ฅผ ๋๋ฅด์ธ์.(์ดํ ์ ๋ค๋ก ์ฐพ๋ ๊ฒ์ n, N์ผ๋ก ๊ฐ๋ฅํฉ๋๋ค)
```bash
...
# Enables materialized view creation on this node.
# Materialized views are considered experimental and are not recommended for production use.
materialized_views_enabled: true <- ์ด ๋ถ๋ถ์ true๋ก ๋ฐ๊ฟ์ฃผ์ธ์!
...
```
 
#### 2-3-2. MATERIALIZED VIEW ์์ฑ ๋ฐ ํ์ธ

```bash
1. ๊ฐ์ key_space ๋ด ์ํ๋ ๋ทฐ ์ด๋ฆ์ ์ ๊ณ , name์ Partition Key๋ก ์ค์ ํฉ๋๋ค.
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