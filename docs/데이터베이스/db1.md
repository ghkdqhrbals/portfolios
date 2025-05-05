---
layout: default
title: 📌 쿼리 최적화 방법
parent: RDBMS
date: 2023-06-26
nav_order: 1
---

created at 2023-06-26
{: .label .label-yellow }

저는 JPA, Data-JPA, JPQL를 사용해서 채팅 프로젝트에서 사용합니다. 하지만 성능이 생각보다 낮았습니다.

따라서 NativeQuery(=SQL query)를 사용하여 좀 더 최적화시키려 합니다. 그러기 위해서 다양한 최적화 방식들을 정리해보려고 하는데요. 아래와 같이 **7가지 쿼리 최적화 방식**들을 정리하였습니다.

{: .highlight }
> **쿼리 최적화 방법들**
> * [https://blog.devart.com/how-to-optimize-sql-query.html#Non-used-indexes](https://blog.devart.com/how-to-optimize-sql-query.html#Non-used-indexes)
> * [https://developer-talk.tistory.com/420](https://developer-talk.tistory.com/420)
> * Query Optimization Techniques - Tips For Writing Efficient And Faster SQL Queries
> 
> 본 글은 위의 글을 번역하고 정리 및 추가한 글입니다.

1. **SELECT * 자제**
   * 이유 : 필요없는 칼럼까지 조회한다면 네트워크패킷의 크기가 증가하며, 불필요하게 리소스를 소모하게 됩니다.

   간단한 방법이며, 성능을 약 **120% 향상**시킬 수 있습니다.

   ![img](../../../assets/img/db/db3.png)

2. **LIKE 검색시 와일드카드(%)는 사용하지 않거나, 사용하더라도 끝에 작성**

    ```sql
    SELECT name FROM sys.databases
    WHERE name LIKE 'm_d%';
    ```
   * 이유 : `%`를 앞에 두게된다면, 사실상 모든 row를 끝까지 읽어야 합니다. 따라서 불필요하게 리소스를 소모하게 됩니다.
3. **ORDER BY 사용 자제**
   * 이유 : 대부분의 RDB들은 정렬하는데 많은 리소스를 소모하기 떄문입니다.
4. **OR 사용 자제**
   * 이유 : OR을 사용하게 된다면 Index를 활용한 검색을 하지 못하고, Full-Scan을 하기 때문입니다.

   그렇다면 어떻게 바꾸어야 할까요?
   > 예제 1
   > #### FROM
   >```sql
   >SELECT
   >*
   >FROM USER
   >WHERE Name = "a"
   >OR Email LIKE "a@%";
   >```
   >
   > #### TO
   >```sql
   >SELECT * FROM USER
   >WHERE Name = "a"
   >UNION
   >SELECT * FROM USER
   >WHERE Email LIKE "a@%";
   >```
   >
   >예제 2
   > #### FROM
   >```sql
   >SELECT * 
   >FROM SH.costs c 
   >    INNER JOIN SH.products p 
   >        ON c.unit_price = p.prod_min_price OR c.unit_price = p.prod_list_price;
   >```
   >#### TO
   >```sql
   >SELECT * 
   >FROM SH.costs c 
   >    INNER JOIN SH.products p 
   >        ON c.unit_price = p.prod_min_price 
   >UNION
   >SELECT * 
   >FROM SH.costs c 
   >  INNER JOIN SH.products p 
   >      ON c.unit_price = p.prod_list_price;
   >```

5. **SELECT DISTINCT * 로 검색하지 않기**
   * 이유 : `DISTINCT`는 주로 중복을 방지하기 위해서 사용합니다. 만약 `DISTINCT *`로 모든 row의 중복체크를 실행하게 된다면, 리소스 소모가 상당히 커집니다. 일반적으로 우리는 테이블에 UNIQUE, PK 와 같은 제약조건을 붙여 놓습니다. 즉 일반적으로는 유니크한 제약덕에 중복되는 값이 없다는 소리거든요. 따라서 불필요하게 `DISTINCT *`를 실행행하기 보다, `DISTINCT {Column}`으로 실질적인 칼럼명을 적는 것이 성능상에서 이점을 가져올 수 있습니다.
   
   만약 또 다시 불필요한 DISTINCT를 사용하게 된다면 아래와 같이 **600% 성능감소가 발생**합니다.

   ![img](../../../assets/img/db/db1.png)
   * Original: SELECT DISTINCT * FROM SH.Sales s INNER JOIN SH.Customer c ON s.cust_id = c.cust_id WHERE c.cust_marital_status = 'single';
   * Improved: SELECT * FROM SH.Sales s INNER JOIN SH.Customer c ON s.cust_id = c.cust_id WHERE c.cust_marital_status = 'single';

6. **중복검사가 필요하지 않는 경우에는 UNION 대신 UNION ALL 사용**
   * 이유 : 중복검사가 필요없는 경우에는 UNION ALL을 사용함으로서 아래와 같이 **500%의 성능향상**이 가능합니다.

   ![img](../../../assets/img/db/db2.png)


7. **WHERE 대신 INNER JOIN 사용하기**
   * 이유 : 이 부분은 성능상의 차이가 없습니다. 다만 SQL의 보편적인 문법인 ANSI Query이냐 아니냐에 따라 다릅니다(INNER JOIN은 ANSI Query이며, WHERE은 Non-ANSI Query입니다). **그냥 쓰기 편하신 문법으로 사용하시면 됩니다**.

   * 아래의 두가지 statement는 똑같은 결과를 제공합니다.

   ```sql
   SELECT
   d.DepartmentID
   ,d.Name
   ,d.GroupName
   FROM HumanResources.Department d
   INNER JOIN HumanResources.EmployeeDepartmentHistory edh
   ON d.DepartmentID = edh.DepartmentID
   ```
   
   ```sql
   SELECT
   d.Name
   ,d.GroupName
   ,d.DepartmentID
   FROM HumanResources.Department d
   ,HumanResources.EmployeeDepartmentHistory edh
   WHERE d.DepartmentID = edh.DepartmentID
   ```






