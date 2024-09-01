---
layout: default
title: git alias 로 회사, 개인 프로젝트 구분
parent: 기타
nav_order: 1
---

created at 2024-09-01
{: .label .label-yellow }

회사용, 개인용 ssh key 따로 등록 한 뒤 아래의 명령어로 alias 설정

```bash
git config --global alias.personal '!ssh-add -D && ssh-add ~/.ssh/id_rsa && git config --global user.name "{your_git_name}" && git config --global user.email "{your_git_email}"'
git config --global alias.work '!ssh-add -D && ssh-add ~/.ssh/id_ed25519 && git config --global user.name "{your_git_name}" && git config --global user.email "{your_git_email}"'
```
 
이후에는 `git personal` 혹은 `git work` 로 alias 설정된 명령어 사용 가능!