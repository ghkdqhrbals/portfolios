---
layout: default
title: About Me
nav_order: 1
description: "About Me / CV"
permalink: /cv/en/
guestbook: false
nav_visible: false
---

Hello, I'm Gyumin Hwangbo, a backend engineer who designs and automates highly available systems with Spring Boot and Kotlin.

I have worked on projects such as building CDC pipelines that handle thousands of events per second, improving large-scale batch jobs by 95.4%, building per-brand CI/CD pipelines, and designing messaging systems with Redis Streams. My focus is operational automation and maximizing system efficiency.

With the mindset that "every repetitive task should eventually be automated," I design systems that reduce human intervention in deployment, monitoring, and data synchronization, and that can detect or recover from failures on their own.

## EXPERIENCE
* Backend Engineer ([**FOODDASH**](https://fooddash.co.kr/)) 2024.04.15 ~ 2025.11.30
  * Developed and operated order/payment/membership services for multi-franchise brands (including Kyochon with 770k MAU) with zero-downtime deployments.
  * Successfully migrated [Jadam](https://www.jadam.kr/) data from [Wmpo](https://www.wmpo.co.kr/) and renewed a service.
  * Optimized membership grade renewal batch for 1M+ users from 19m13s to 53s ([**95.4% improvement**]((https://ghkdqhrbals.github.io/portfolios/docs/Java/20/)))
  * Built per-brand modularization and an [**integrated CI/CD pipeline**](https://ghkdqhrbals.github.io/portfolios/docs/Java/25/)
  * Identified notification loss during retries when large batch sends overlapped with real-time notifications and server restarts occurred.
    * Introduced Redis Streams and PEL-based reprocessing to guarantee delivery after restarts, eliminating notification loss.
    * Stabilized loss rate to 0% [link](https://ghkdqhrbals.github.io/portfolios/docs/Java/30/)
  * Designed and operated a [data sync pipeline](https://ghkdqhrbals.github.io/portfolios/docs/Java/37/) handling thousands of events per second (Redis Stream backpressure, safe consumption with memory cap 85%) 
  * Stack: Kotlin/Spring Boot, MySQL, Redis Stream MQ, Kubernetes, AWS-based infrastructure
* Senior Researcher (foxee) 2023.06 ~ 2024.01
  * Built a vulnerability analysis web backend with Java/Spring Boot.
  * Conducted research on explainable AI (CNN) for malware images.
  * Refined and visualized Windows 2015 malware dataset vectors.
  * Stack: Java/Spring Boot, PostgreSQL, Docker
* Intern (Pulse Co., Ltd.) 2020.01 ~ 2020.02 (1 month)
  * Role: Internal convenience service development
  * Stack: Python

## EDUCATION
* M.S. in Computer Engineering, Pusan National University (2020.09 ~ 2022.08)
  * Thesis: [Design of a blockchain eclipse attack using the Geth vulnerability](https://ghkdqhrbals.github.io/portfolios/docs/Blockchain/)
* B.S. in Computer Engineering, Pusan National University (2014.03 ~ 2020.08)
* Bu-il Foreign Language High School (2010.03 ~ 2013.02)

## OPEN SOURCE
* 2025.10 OAuth2.0 authentication module public package
  * Lightweight OAuth2.0 module including revoke support not available in Spring Security.
  * [https://github.com/ghkdqhrbals/personal-module](https://github.com/ghkdqhrbals/personal-module)
* 2025.03 AWS account switch utility
  * Main merge to macOS xbar automation tool for frequent AWS account switching in multi-franchise operations.
  * [https://github.com/matryer/xbar-plugins/pull/2103](https://github.com/matryer/xbar-plugins/pull/2103)
* 2024.03 ~ 2024.04 Server benchmark service
  * [https://github.com/backend-tech-forge/benchmark](https://github.com/backend-tech-forge/benchmark)
* 2024.01 ~ 2024.02 Slack list notification GitHub Actions
  * [https://github.com/ghkdqhrbals/slack-list](https://github.com/ghkdqhrbals/slack-list)
* 2022.11 ~ 2024.02 Real-time chat service (47 stars)
  * Long-running personal project adopted and used by [**KT AICC**](https://www.kt.com/).
  * Up to **59x faster** (TPS p99.9 1.63 → 96.52): [link](https://ghkdqhrbals.github.io/portfolios/docs/pf/)
  * [https://github.com/ghkdqhrbals/spring-chatting-server](https://github.com/ghkdqhrbals/spring-chatting-server)
* 2022.06 ~ 2022.09 Banking server deployment automation: [link](https://ghkdqhrbals.github.io/portfolios/docs/project2/)
* 2021.09 ~ 2021.12 Malware feature extraction by Windows malware type: [link](https://ghkdqhrbals.github.io/portfolios/docs/toy/toyp8/)
* 2021.09 ~ 2021.12 PowerShell malicious script detection: [link](https://ghkdqhrbals.github.io/portfolios/docs/toy/toyp2/)
* 2021.09 ~ 2021.10 Blockchain-based green energy trading platform prototype: [link](https://ghkdqhrbals.github.io/portfolios/docs/toy/toyp4/)

## ACTIVITIES
* Patent: Blockchain client vulnerability detection method and device (2022.01 ~ 2022.12)
  * [link](https://patents.google.com/patent/KR20240019566A/ko)
* Conference: (NLP) N-gram + threat-actor-based pattern analysis for Windows malware families (2021.12)
  * [link](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE11035874)
* Software registration: Blockchain-based REC trading platform prototype for RE100 [C-2021-044149] (2021.09 ~ 2021.11)
  * [link](https://www.ntis.go.kr/outcomes/popup/srchTotlSpwr.do?cmd=view&rstId=SNW-2021-00312106034&returnURI=null&pageCode=RI_SW_RST_DTL)
* Hackathon: Convergence Security Graduate School Hackathon Competition (2021.09 ~ 2021.11)
* AI Competition (4th): 2021 Cybersecurity AI/big data challenge, KISA — fileless malware detection (2021.09 ~ 2021.12)
* Privacy Competition (3rd): 2020 K-cyber security challenge, KISA — privacy (2020.09 ~ 2020.12)
* Overseas training: San Jose State Univ., San Jose, CA, USA (2019.06 ~ 2019.09)
* Exchange student: HELP Univ., Kuala Lumpur, Malaysia (2017.12 ~ 2018.03)

## CONTACT
- GitHub: [https://github.com/ghkdqhrbals](https://github.com/ghkdqhrbals)
- Portfolio: [https://ghkdqhrbals.github.io/portfolios](https://ghkdqhrbals.github.io/portfolios)
- LinkedIn: [https://www.linkedin.com/in/gyumin-hwangbo-92382218b/](https://www.linkedin.com/in/gyumin-hwangbo-92382218b/)
- Phone: (+82) 10-5177-1967
- Email: ghkdqhrbals@gmail.com
