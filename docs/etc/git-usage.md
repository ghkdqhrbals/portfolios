---
layout: default
title: Git 명령어 정리
parent: 기타
nav_order: 1
---

* 브랜치 관리
    * 브랜치 생성 git branch [신규브랜치]
    * 독립 브랜치 생성 및 접속 > git checkout --orphan [신규브랜치]
    * 로컬/원격 브랜치 확인 > git branch -a
    * 로컬 브랜치 to 리모트 브랜치 업스트림 설정1 > git branch -u remotes/origin/[리모트 브랜치]
    * 로컬 브랜치 to 리모트 브랜치 업스트림 설정2 > git branch [from_branch] -u remotes/origin/[리모트 브랜치]
    * 브랜치 상세 뷰 > git branch -vv
    * 브랜치 제거 > git branch -d/D [기존브랜치]
    * 브랜치 이동 > git checkout [기존브랜치]
    * 리모트 브랜치 제거 > git push origin --delete [브랜치]
    * 리모트 브랜치 정보 업데이트 > git remote update
    * 현재 브랜치에서 다른 브랜치를 Fetch & Merge > git pull [저장소 심볼명] [브랜치]
    * 브랜치 이름 변경 > git branch -m [OLD_BRANCH] [NEW_BRANCH]

    * 리모트 브랜치 to 로컬 브랜치 > git checkout [브랜치] > git reset --hard origin/[리모트 브랜치]

* 리모트 브랜치 삭제 > git push 저장소 심볼명 --delete [리모트 브랜치]

* Tag(Annotated Tag)
    * commit 내역 확인 > git log --pretty=oneline
    * 특정 commit tagging > git tag -a [TAG_NAME] [HASH]
    * Tag 리모트 올리기 > git push origin --tags
    * Tag 리모트 삭제 > git push origin :[TAG_NAME]


* More Info.
    * __refs/heads/[BRANCH_NAME], refs/tags/[TAG_NAME]으로 관리가능__
    * TAG_NAME == BRANCH_NAME일 때, > git push origin :refs/heads/3.0.0