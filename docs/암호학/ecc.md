---
layout: default
title: (English) ECC encryption
parent: 암호학
nav_order: 6
---

E : Y^2 = X^3 + aX + b (mod p)

pub_key  = Pa, Pb

priv_key = nA, nB

Select random k value, k = Random value with range 1 to n − 1

* paintext -> grouping -> UNICODE conversion(~65536) -> = Pm

* send(Pc = {kG, Pm + k*Pb})

WHY grouping? : so the ASCII values are preserved during encryption and decryption.

ASCII is being replaced by the 16 bit Unicode with 65536 characters that represent every text character in every country in the world including those used historically. Most new operating systems software packages support Unicode.


[ECC encryption paper](https://reader.elsevier.com/reader/sd/pii/S1877050915013332?token=38CC52DBBFB99FAEF55F301E2DA73E44853FB12380A18269B71F9F4FDEF4221CE8548984FE88FD5CB72029CF0D763227&originRegion=us-east-1&originCreation=20220605083508)


<img width="837" alt="스크린샷 2022-06-05 오후 5 38 53" src="https://user-images.githubusercontent.com/29156882/172042580-e21e1583-b260-49ea-924d-ad406b21e370.png">


