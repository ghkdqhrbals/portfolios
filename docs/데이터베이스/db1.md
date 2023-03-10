---
layout: default
title: ๐ ์ฟผ๋ฆฌ ์ต์ ํ ๋ฐฉ๋ฒ
parent: RDBMS
nav_order: 1
---

์ ๋ JPA, Data-JPA, JPQL๋ฅผ ์ฌ์ฉํด์ ์ฑํ ํ๋ก์ ํธ์์ ์ฌ์ฉํฉ๋๋ค. ํ์ง๋ง ์ฑ๋ฅ์ด ์๊ฐ๋ณด๋ค ๋ฎ์์ต๋๋ค.

๋ฐ๋ผ์ NativeQuery(=SQL query)๋ฅผ ์ฌ์ฉํ์ฌ ์ข ๋ ์ต์ ํ์ํค๋ ค ํฉ๋๋ค. ๊ทธ๋ฌ๊ธฐ ์ํด์ ๋ค์ํ ์ต์ ํ ๋ฐฉ์๋ค์ ์ ๋ฆฌํด๋ณด๋ ค๊ณ  ํ๋๋ฐ์. ์๋์ ๊ฐ์ด **7๊ฐ์ง ์ฟผ๋ฆฌ ์ต์ ํ ๋ฐฉ์**๋ค์ ์ ๋ฆฌํ์์ต๋๋ค.

{: .highlight }
> **์ฟผ๋ฆฌ ์ต์ ํ ๋ฐฉ๋ฒ๋ค**
> * [https://blog.devart.com/how-to-optimize-sql-query.html#Non-used-indexes](https://blog.devart.com/how-to-optimize-sql-query.html#Non-used-indexes)
> * [https://developer-talk.tistory.com/420](https://developer-talk.tistory.com/420)
> * Query Optimization Techniques - Tips For Writing Efficient And Faster SQL Queries
> 
> ๋ณธ ๊ธ์ ์์ ๊ธ์ ๋ฒ์ญํ๊ณ  ์ ๋ฆฌ ๋ฐ ์ถ๊ฐํ ๊ธ์๋๋ค.

1. **SELECT * ์์ **
   * ์ด์  : ํ์์๋ ์นผ๋ผ๊น์ง ์กฐํํ๋ค๋ฉด ๋คํธ์ํฌํจํท์ ํฌ๊ธฐ๊ฐ ์ฆ๊ฐํ๋ฉฐ, ๋ถํ์ํ๊ฒ ๋ฆฌ์์ค๋ฅผ ์๋ชจํ๊ฒ ๋ฉ๋๋ค.

   ๊ฐ๋จํ ๋ฐฉ๋ฒ์ด๋ฉฐ, ์ฑ๋ฅ์ ์ฝ **120% ํฅ์**์ํฌ ์ ์์ต๋๋ค.

   ![img](../../../assets/img/db/db3.png)

2. **LIKE ๊ฒ์์ ์์ผ๋์นด๋(%)๋ ์ฌ์ฉํ์ง ์๊ฑฐ๋, ์ฌ์ฉํ๋๋ผ๋ ๋์ ์์ฑ**

    ```sql
    SELECT name FROM sys.databases
    WHERE name LIKE 'm_d%';
    ```
   * ์ด์  : `%`๋ฅผ ์์ ๋๊ฒ๋๋ค๋ฉด, ์ฌ์ค์ ๋ชจ๋  row๋ฅผ ๋๊น์ง ์ฝ์ด์ผ ํฉ๋๋ค. ๋ฐ๋ผ์ ๋ถํ์ํ๊ฒ ๋ฆฌ์์ค๋ฅผ ์๋ชจํ๊ฒ ๋ฉ๋๋ค.
3. **ORDER BY ์ฌ์ฉ ์์ **
   * ์ด์  : ๋๋ถ๋ถ์ RDB๋ค์ ์ ๋ ฌํ๋๋ฐ ๋ง์ ๋ฆฌ์์ค๋ฅผ ์๋ชจํ๊ธฐ ๋๋ฌธ์๋๋ค.
4. **OR ์ฌ์ฉ ์์ **
   * ์ด์  : OR์ ์ฌ์ฉํ๊ฒ ๋๋ค๋ฉด Index๋ฅผ ํ์ฉํ ๊ฒ์์ ํ์ง ๋ชปํ๊ณ , Full-Scan์ ํ๊ธฐ ๋๋ฌธ์๋๋ค.

   ๊ทธ๋ ๋ค๋ฉด ์ด๋ป๊ฒ ๋ฐ๊พธ์ด์ผ ํ ๊น์?
   > ์์  1
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
   >์์  2
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

5. **SELECT DISTINCT * ๋ก ๊ฒ์ํ์ง ์๊ธฐ**
   * ์ด์  : `DISTINCT`๋ ์ฃผ๋ก ์ค๋ณต์ ๋ฐฉ์งํ๊ธฐ ์ํด์ ์ฌ์ฉํฉ๋๋ค. ๋ง์ฝ `DISTINCT *`๋ก ๋ชจ๋  row์ ์ค๋ณต์ฒดํฌ๋ฅผ ์คํํ๊ฒ ๋๋ค๋ฉด, ๋ฆฌ์์ค ์๋ชจ๊ฐ ์๋นํ ์ปค์ง๋๋ค. ์ผ๋ฐ์ ์ผ๋ก ์ฐ๋ฆฌ๋ ํ์ด๋ธ์ UNIQUE, PK ์ ๊ฐ์ ์ ์ฝ์กฐ๊ฑด์ ๋ถ์ฌ ๋์ต๋๋ค. ์ฆ ์ผ๋ฐ์ ์ผ๋ก๋ ์ ๋ํฌํ ์ ์ฝ๋์ ์ค๋ณต๋๋ ๊ฐ์ด ์๋ค๋ ์๋ฆฌ๊ฑฐ๋ ์. ๋ฐ๋ผ์ ๋ถํ์ํ๊ฒ `DISTINCT *`๋ฅผ ์คํํํ๊ธฐ ๋ณด๋ค, `DISTINCT {Column}`์ผ๋ก ์ค์ง์ ์ธ ์นผ๋ผ๋ช์ ์ ๋ ๊ฒ์ด ์ฑ๋ฅ์์์ ์ด์ ์ ๊ฐ์ ธ์ฌ ์ ์์ต๋๋ค.
   
   ๋ง์ฝ ๋ ๋ค์ ๋ถํ์ํ DISTINCT๋ฅผ ์ฌ์ฉํ๊ฒ ๋๋ค๋ฉด ์๋์ ๊ฐ์ด **600% ์ฑ๋ฅ๊ฐ์๊ฐ ๋ฐ์**ํฉ๋๋ค.

   ![img](../../../assets/img/db/db1.png)
   * Original: SELECT DISTINCT * FROM SH.Sales s INNER JOIN SH.Customer c ON s.cust_id = c.cust_id WHERE c.cust_marital_status = 'single';
   * Improved: SELECT * FROM SH.Sales s INNER JOIN SH.Customer c ON s.cust_id = c.cust_id WHERE c.cust_marital_status = 'single';

6. **์ค๋ณต๊ฒ์ฌ๊ฐ ํ์ํ์ง ์๋ ๊ฒฝ์ฐ์๋ UNION ๋์  UNION ALL ์ฌ์ฉ**
   * ์ด์  : ์ค๋ณต๊ฒ์ฌ๊ฐ ํ์์๋ ๊ฒฝ์ฐ์๋ UNION ALL์ ์ฌ์ฉํจ์ผ๋ก์ ์๋์ ๊ฐ์ด **500%์ ์ฑ๋ฅํฅ์**์ด ๊ฐ๋ฅํฉ๋๋ค.

   ![img](../../../assets/img/db/db2.png)


7. **WHERE ๋์  INNER JOIN ์ฌ์ฉํ๊ธฐ**
   * ์ด์  : ์ด ๋ถ๋ถ์ ์ฑ๋ฅ์์ ์ฐจ์ด๊ฐ ์์ต๋๋ค. ๋ค๋ง SQL์ ๋ณดํธ์ ์ธ ๋ฌธ๋ฒ์ธ ANSI Query์ด๋ ์๋๋์ ๋ฐ๋ผ ๋ค๋ฆ๋๋ค(INNER JOIN์ ANSI Query์ด๋ฉฐ, WHERE์ Non-ANSI Query์๋๋ค). **๊ทธ๋ฅ ์ฐ๊ธฐ ํธํ์  ๋ฌธ๋ฒ์ผ๋ก ์ฌ์ฉํ์๋ฉด ๋ฉ๋๋ค**.

   * ์๋์ ๋๊ฐ์ง statement๋ ๋๊ฐ์ ๊ฒฐ๊ณผ๋ฅผ ์ ๊ณตํฉ๋๋ค.

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






