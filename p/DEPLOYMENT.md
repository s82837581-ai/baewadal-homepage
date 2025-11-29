# 🚀 배포 가이드

## GitHub Pages 배포 (baewadal.co.kr)

### 1️⃣ GitHub 저장소 준비

```bash
# 새 저장소 생성 (GitHub에서 먼저 생성)
# 저장소 이름: baewadal-public (또는 원하는 이름)

# 로컬에 클론
git clone https://github.com/{your-username}/baewadal-public.git
cd baewadal-public

# public-pages 폴더의 모든 파일을 루트로 복사
# (이 프로젝트의 /public-pages 폴더 내용)
cp /path/to/modit/public-pages/* .

# 파일 구조 확인
ls -la
# 출력 예시:
# - index.html
# - script.js
# - 404.html
# - CNAME
# - _config.yml
# - README.md
# - INTEGRATION.md
# - DEPLOYMENT.md
```

### 2️⃣ Git 커밋 및 푸시

```bash
# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Modit public price list page"

# GitHub에 푸시
git push origin main
```

### 3️⃣ GitHub Pages 활성화

1. GitHub 저장소 페이지 접속
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션:
   - Branch: **main** 선택
   - Folder: **/ (root)** 선택
   - **Save** 클릭

5. **Custom domain** 섹션:
   - `baewadal.co.kr` 입력
   - **Save** 클릭

6. **Enforce HTTPS** 체크박스 활성화 (DNS 설정 후)

### 4️⃣ DNS 설정

baewadal.co.kr 도메인의 DNS 설정을 변경합니다.

#### 옵션 A: CNAME 레코드 (서브도메인용)

```
Type: CNAME
Name: www
Value: {your-username}.github.io
TTL: 3600
```

#### 옵션 B: A 레코드 (루트 도메인용)

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

#### AAAA 레코드 (IPv6, 선택사항)

```
Type: AAAA
Name: @
Value: 2606:50c0:8000::153
TTL: 3600

Type: AAAA
Name: @
Value: 2606:50c0:8001::153
TTL: 3600

Type: AAAA
Name: @
Value: 2606:50c0:8002::153
TTL: 3600

Type: AAAA
Name: @
Value: 2606:50c0:8003::153
TTL: 3600
```

### 5️⃣ DNS 전파 대기

DNS 설정 후 전파까지 최대 48시간 소요될 수 있습니다.

**진행 상황 확인:**

```bash
# DNS 조회
dig baewadal.co.kr

# 또는
nslookup baewadal.co.kr
```

### 6️⃣ HTTPS 활성화

1. DNS 전파 완료 후 GitHub Pages 설정으로 돌아감
2. **Enforce HTTPS** 체크박스가 활성화되면 체크
3. Let's Encrypt 인증서 자동 발급 (수 분 소요)

### 7️⃣ 배포 완료 확인

브라우저에서 접속:

```
https://baewadal.co.kr/p/?id=price_test123
```

**확인 사항:**
- ✅ HTTPS로 리다이렉트
- ✅ 페이지 정상 로드
- ✅ 다국어 버튼 작동
- ✅ API 호출 성공 (또는 "가격표를 찾을 수 없습니다" 에러)

---

## 🔄 업데이트 배포

코드 변경 후 업데이트하는 방법:

```bash
# 파일 수정 후
git add .
git commit -m "Update: 설명"
git push origin main

# GitHub Pages가 자동으로 1-2분 내 배포
```

---

## 🧪 테스트 URL

### 로컬 테스트

```bash
cd /path/to/baewadal-public
python3 -m http.server 8000

# 브라우저
http://localhost:8000/?id=price_test123
```

### 프로덕션 테스트

```
https://baewadal.co.kr/p/?id={실제priceListId}
```

**실제 priceListId 얻기:**
1. 모디트 앱 로그인
2. 가격표 화면 접속
3. QR 코드 생성
4. URL에서 `id=` 뒤의 값 복사

---

## 🐛 트러블슈팅

### 404 Not Found

**원인:** DNS 설정 문제 또는 GitHub Pages 비활성화

**해결:**
1. GitHub Pages 설정 확인
2. DNS 레코드 확인
3. 브라우저 캐시 삭제

### HTTPS 인증서 오류

**원인:** DNS 전파 미완료 또는 CNAME 설정 문제

**해결:**
1. DNS 전파 대기 (최대 48시간)
2. CNAME 파일 확인 (`baewadal.co.kr` 포함)
3. GitHub Pages에서 Custom domain 재설정

### API 호출 실패

**원인:** CORS 문제 또는 Supabase 설정 문제

**해결:**
1. 브라우저 콘솔에서 에러 확인
2. Supabase 대시보드에서 CORS 설정 확인
3. script.js의 API 엔드포인트 확인

### 페이지가 로드되지 않음

**원인:** JavaScript 오류

**해결:**
1. 브라우저 콘솔 확인
2. script.js 문법 오류 확인
3. index.html에 script.js가 제대로 로드되는지 확인

---

## 📊 모니터링

### GitHub Actions 워크플로우 (선택사항)

`.github/workflows/pages.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
```

### 접속 로그 확인

GitHub Pages는 자체 분석 도구를 제공하지 않습니다.

**대안:**
1. Google Analytics 추가
2. Cloudflare Analytics (DNS를 Cloudflare로 변경)
3. Supabase에서 API 호출 로그 확인

---

## 🔐 보안 권장사항

### 1. Content Security Policy (CSP)

`index.html`의 `<head>` 섹션에 추가:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src https://viwzvfkqmrzmrrqfjxld.supabase.co;">
```

### 2. Rate Limiting

Supabase Edge Functions에서 기본 제공되지만, 추가로 Cloudflare를 사용하면 더 강력한 보호 가능.

### 3. API Key 보안

- SUPABASE_ANON_KEY는 공개 키이므로 노출 가능
- 민감한 작업은 서버에서 SERVICE_ROLE_KEY 사용
- 공개 페이지는 읽기 전용 API만 사용

---

## 📞 지원

- 기술 문의: baewadal@baewadal.co.kr
- GitHub Issues: https://github.com/{username}/baewadal-public/issues

---

## ✅ 체크리스트

배포 전 확인 사항:

- [ ] GitHub 저장소 생성
- [ ] 파일 업로드 완료
- [ ] GitHub Pages 활성화
- [ ] DNS 설정 완료
- [ ] HTTPS 활성화
- [ ] 테스트 URL 접속 확인
- [ ] API 연동 테스트
- [ ] 모바일 테스트
- [ ] 다국어 테스트
- [ ] 고객 제보 기능 테스트

---

© 2025 Baewadal. All rights reserved.
