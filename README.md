## Gyumin Hwangbo
as **Java/Kotlin Backend Developer**

**Email**      : ghkdqhrbals@gmail.com   
**Blog**       : [/](/)   
**LinkedIn**   : [https://www.linkedin.com/in/gyumin-hwangbo-92382218b/](https://www.linkedin.com/in/gyumin-hwangbo-92382218b/)    
**Instagram**  : [https://www.instagram.com/hb_traveller/](https://www.instagram.com/hb_traveller/)

## Cloudflare Pages + D1 댓글 API 배포 설정

### 필요 시크릿/환경변수
- `CF_PAGES_PROJECT_NAME`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `COMMENTS_D1_DB_ID` (필수; D1 마이그레이션/바인딩용)
- `CF_SITE_ORIGIN` (필수; Cloudflare 배포 및 GitHub → Cloudflare 리디렉트 대상 URL)
- `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_JSON` (선택)
- `SLACK_WEBHOOK_URL` (선택, 신고 알림용)
- `COMMENT_ADMIN_PASSWORD` (선택, 관리자 삭제 전용)

### 설정값 필수 입력
- `CF_SITE_ORIGIN` 시크릿 값은 `https://<Cloudflare Pages 도메인>` 또는 커스텀 도메인으로 입력해야 하며,
  워크플로우에서 배포 타임에 `_config.yml`, `_config_cf.yml`의 placeholder를 대체합니다.

### API 엔드포인트(Cloudflare Pages Functions)
- `GET /api/comments?post_path=...`
- `POST /api/comments`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`
- `POST /api/comments/:id/report`

### 운영 배포 체크리스트
1. Cloudflare Pages 프로젝트 생성 후 `CF_PAGES_PROJECT_NAME`(예: `portfolios`) 등록
2. Cloudflare D1 데이터베이스 생성 후 `COMMENTS_D1_DB_ID` 등록
3. GitHub Secrets 등록 (`CF_PAGES_PROJECT_NAME`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `COMMENTS_D1_DB_ID`, `CF_SITE_ORIGIN`)
4. `CF_SITE_ORIGIN` 값은 `https://<Cloudflare pages 도메인>` 형태(또는 커스텀 도메인)으로 등록
5. Cloudflare Pages 대시보드에서 Function env/secret 등록
   - `COMMENT_ADMIN_PASSWORD` (선택)
   - `SLACK_WEBHOOK_URL` (선택)
6. `main` 브랜치에 push 하면 `deploy-cloudflare-pages`가 `_config_cf.yml` 기준으로 CF에 배포

### 배포 후 즉시 점검
GitHub Actions 배포 성공 후 아래 항목만 빠르게 점검하세요.

1. 기본 경로 접속
   - `CF_SITE_ORIGIN`
2. GH 레거시 호스트에서 리디렉션 확인
   - `https://ghkdqhrbals.github.io/portfolios/` 접속 시 `CF_SITE_ORIGIN`로 이동하는지 확인
3. CF 정적 라우트 보정 확인
   - `$CF_SITE_ORIGIN/portfolios/docs/`가 `$CF_SITE_ORIGIN/docs/`로 이동하는지 확인
4. 댓글 API 스모크 테스트
   - `CF_BASE_URL=$CF_SITE_ORIGIN node scripts/smoke_test_cf_comments.mjs`
   - 관리자 삭제도 검증하려면
     `CF_BASE_URL=$CF_SITE_ORIGIN CF_ADMIN_PASSWORD=<관리자 비밀번호> node scripts/smoke_test_cf_comments.mjs`

예시
```bash
export CF_BASE_URL=https://your-project.pages.dev
node scripts/smoke_test_cf_comments.mjs
```

## 운영 배포 최종 실행 방법 (로컬 기준)

현재 브랜치 기준 워크플로우까지 모두 반영된 상태에서 운영 배포는 아래 순서로 진행하세요.

1. 변경 사항 점검
```bash
git status --short
```
   - 아래 항목이 변경되어 있어야 합니다.
     - `.github/workflows/deploy-cloudflare-pages.yml`
     - `.github/workflows/deploy.yml`
     - `_config_cf.yml`
     - `functions/*` (comments API + middleware)
     - `migrations/001_create_comments.sql`
     - `wrangler.toml`
     - 댓글 위젯/스크립트 파일들

2. GitHub 저장소에 반영
```bash
git add .github/workflows/deploy-cloudflare-pages.yml .github/workflows/deploy.yml _config.yml _config_cf.yml \
  _includes/head.html _includes/head_custom.html _layouts/default.html _sass/custom/custom.scss \
  _includes/comments_widget.html assets/js/comments.js functions scripts/smoke_test_cf_comments.mjs \
  wrangler.toml README.md
git commit -m "feat: migrate blog to Cloudflare Pages with GA sync and comment API"
git push origin main
```

3. Actions에서 배포 실행
   - GitHub UI: `Actions > Deploy to Cloudflare Pages > Run workflow`
   - 또는 수동 실행:
```bash
gh workflow run "Deploy to Cloudflare Pages"
```

4. 배포 후 검증
```bash
export CF_SITE_ORIGIN=https://your-cloudflare-project.pages.dev

# 본문 페이지 접속 확인
curl -I "$CF_SITE_ORIGIN" | head -n 1

# 댓글 API 스모크 테스트
export CF_BASE_URL="$CF_SITE_ORIGIN"
node scripts/smoke_test_cf_comments.mjs
```

### EDUCATION
* Master's degree in Computer Science and Engineering, Pusan National University, 2022.
> check paper : [https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502#](https://scienceon.kisti.re.kr/srch/selectPORSrchArticleOrgnl.do?cn=DIKO0016457502#)
* Bachelor's degree in Computer Science and Engineering, Pusan National University, 2020.

### INTEREST
* Automation for everything
* Backend Development
