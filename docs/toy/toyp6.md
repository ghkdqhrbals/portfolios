---
layout: default
title: 간단한 포트폴리오 웹 제작
date: 2022-08-01
parent: 토이 프로젝트
nav_order: 6
---

**해당 프로젝트는 취업준비 진행 중, 간단하게 react를 사용하여 제작한 웹 포트폴리오입니다.**

* 참여인원 : 1인 프로젝트
* 기간 : 2022년 08월 ~ 2022년 09월(1개월)
* 나의 역할
  * ✍️ 프론트 엔드 개발
  * ✍️ 리버스 프록시 설정 및 AWS 배포
* Github : [https://github.com/ghkdqhrbals/portfolio](https://github.com/ghkdqhrbals/portfolio) 

### 📃 **✍️ 프론트 엔드 개발(SCSS/HTML)**

<details><summary> 프론트 엔드 </summary><div markdown="1">

### About Me
![img](../../../assets/img/terms/aboutme.png)

### Homepage
![img](../../../assets/img/terms/homepage.png)

### Projects
![img](../../../assets/img/terms/project.png)

### Contact Me
![img](../../../assets/img/terms/contactme.png)

</div></details>

### 📃 **✍️ 리버스 프록시 설정 및 AWS 배포**

<details><summary> 설정 코드 </summary><div markdown="1">

### 도커 설정

<details><summary> Docker-compose.yaml </summary><div markdown="1">

```dockerfile
version: "3.7"

services:
  nginx:
    restart: always
    container_name: nginx
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "80:80"
    networks:
      - frontend
      
  client:
    container_name: client
    expose:
      - "3000"
    restart: "on-failure"
    environment:
      - PORT=3000
      - NODE_ENV=development 
      - CHOKIDAR_USEPOLLING=true
    build:
      context: ./client
      dockerfile: Dockerfile
    volumes:
      - "./client/:/app"
      - "/app/node_modules"
    stdin_open: true
    networks:
      - frontend

networks: 
  frontend:
    driver: bridge
```

</div></details>

### 리버스 프록시 설정

<details><summary> NGINX.conf </summary><div markdown="1">

```
user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
events {                     
    worker_connections  1024;
}
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    upstream docker-client {
        server client:3000;
    }
    server {
        listen 80;
        # server_name portfolio.hwangbogyumin.com;
        server_name localhost;

        # Frontend React Page
        location / {
            proxy_pass         http://docker-client;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # TODO for backend

    }
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
                                                
    sendfile        on;                                                                         
    keepalive_timeout  65;                                                                      
    include /etc/nginx/conf.d/*.conf;           
}
```

</div></details>

### AWS 배포

> 현재는 EC2 및 Route 비용문제로 인해 다운시켰습니다.

플로우 : AWS-Route-53 ---> AWS-EC2 ---> Nginx ---> WAS

</div></details>

