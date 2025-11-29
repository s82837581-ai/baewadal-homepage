# 📋 모디트 공개 페이지 - 요약

## 🎯 개요

baewadal.co.kr 도메인에서 호스팅되는 독립적인 QR 가격표 페이지입니다.
모디트 앱과 Supabase API를 공유하여 실시간 데이터 연동이 가능합니다.

## 📁 파일 구조

```
public-pages/
├── index.html              # 메인 HTML 페이지
├── script.js               # JavaScript 로직
├── 404.html                # 리다이렉션 처리
├── CNAME                   # GitHub Pages 도메인 설정
├── _config.yml             # Jekyll 설정
├── README.md               # 프로젝트 설명
├── INTEGRATION.md          # 통합 가이드
├── DEPLOYMENT.md           # 배포 가이드
└── SUMMARY.md              # 이 파일
```

## 🌐 URL 구조

### 프로덕션 (baewadal.co.kr)
```
https://baewadal.co.kr/p/?id={priceListId}
```

### 개발/테스트 (Figma Make)
```
https://your-app.figma.com/#/p/{priceListId}
```

### 자동 선택
- 모디트 앱의 `generatePublicQRUrl()` 함수가 환경에 따라 자동 선택
- 프로덕션: baewadal.co.kr 사용
- 개발: 앱 내부 해시 라우팅 사용

## 🔗 API 연동

### 가격표 조회 (공개)
```
GET /v2/price-list/public/{priceListId}
```

### 고객 제보 (공개)
```
POST /v2/customer-reports
```

## ✨ 주요 기능

### 1. 가격표 표시
- ✅ 상점 이름
- ✅ 상품 목록 (이름, 가격, 단위, 설명)
- ✅ 조회수 표시
- ✅ 최종 업데이트 시간

### 2. 다국어 지원
- 🇰🇷 한국어
- 🇺🇸 English
- 🇨🇳 中文
- 🇯🇵 日本語

### 3. 고객 제보
- 🚨 가격 불일치 신고
- 💳 카드결제 거부 신고
- 📦 품질/서비스 문제 제보

### 4. 모바일 최적화
- 📱 반응형 디자인
- 👆 터치 친화적 UI
- ⚡ 빠른 로딩 (순수 HTML/CSS/JS)

## 🚀 배포 방법

### 1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/{username}/baewadal-public.git
git push -u origin main
```

### 2. GitHub Pages 활성화
1. Settings → Pages
2. Source: main / (root)
3. Custom domain: baewadal.co.kr
4. Enforce HTTPS

### 3. DNS 설정
```
Type: A
Name: @
Value: 185.199.108.153 (+ 3개 더)
```

### 4. 완료!
```
https://baewadal.co.kr/p/?id=price_test123
```

## 🔧 연동 코드

### 모디트 앱 (QR 생성)

**파일:** `/utils/qrUrlGenerator.ts`

```typescript
export function generatePublicQRUrl(priceListId: string): string {
  const isProduction = window.location.hostname === 'baewadal.co.kr';
  
  if (isProduction) {
    return `https://baewadal.co.kr/p/?id=${priceListId}`;
  } else {
    return `${window.location.origin}#/p/${priceListId}`;
  }
}
```

### 공개 페이지 (데이터 로드)

**파일:** `script.js`

```javascript
const CONFIG = {
  SUPABASE_URL: 'https://viwzvfkqmrzmrrqfjxld.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGc...',
  API_BASE_PATH: '/functions/v1/make-server-f49b8637'
};

async function loadPriceList() {
  const data = await apiCall(`/v2/price-list/public/${priceListId}`);
  displayPriceList(data.priceList, data.viewCount);
}
```

## 📊 데이터 흐름

```
[상인] → [모디트 앱] → [Supabase API] → [KV Store]
                                              ↓
[고객] → [QR 스캔] → [공개 페이지] → [Supabase API] → [KV Store]
         ↓
      [제보] → [Supabase API] → [KV Store] → [모디트 앱]
```

## 🧪 테스트

### 로컬 테스트
```bash
cd public-pages
python3 -m http.server 8000
# http://localhost:8000/?id=price_test123
```

### API 테스트
```bash
# 가격표 조회
curl "https://viwzvfkqmrzmrrqfjxld.supabase.co/functions/v1/make-server-f49b8637/v2/price-list/public/price_test123" \
  -H "Authorization: Bearer {ANON_KEY}"
```

## 🔒 보안

- ✅ 공개 API는 읽기 전용
- ✅ 고객 제보는 쓰기만 가능
- ✅ 민감한 작업은 인증 필요
- ✅ XSS 방지 (HTML 이스케이프)
- ✅ HTTPS 강제

## 📱 지원 플랫폼

### 데스크톱
- ✅ Chrome
- ✅ Safari
- ✅ Firefox
- ✅ Edge

### 모바일
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Samsung Internet

### QR 스캔
- ✅ iOS 기본 카메라
- ✅ Android Google Lens
- ✅ 대부분의 QR 스캐너 앱

## 📞 문의

- **이메일:** baewadal@baewadal.co.kr
- **웹사이트:** https://www.baewadal.co.kr
- **마스터 계정:** 01082837581

## 📚 추가 문서

- **README.md** - 프로젝트 개요 및 사용법
- **INTEGRATION.md** - 모디트 앱과의 연동 상세 가이드
- **DEPLOYMENT.md** - 배포 단계별 가이드

## ✅ 완료 체크리스트

### 개발
- [x] HTML 페이지 작성
- [x] JavaScript 로직 구현
- [x] 다국어 지원 추가
- [x] 모바일 최적화
- [x] API 연동
- [x] 고객 제보 기능

### 배포
- [ ] GitHub 저장소 생성
- [ ] 파일 업로드
- [ ] GitHub Pages 활성화
- [ ] DNS 설정
- [ ] HTTPS 활성화
- [ ] 테스트 완료

### 연동
- [x] 모디트 앱 QR 생성 코드 수정
- [x] API 엔드포인트 확인
- [x] 환경별 URL 자동 선택
- [ ] 프로덕션 테스트

## 🎉 다음 단계

1. **GitHub에 배포**
   - 저장소 생성
   - 파일 업로드
   - Pages 활성화

2. **DNS 설정**
   - A 레코드 추가
   - HTTPS 활성화

3. **테스트**
   - QR 코드 생성
   - 실제 스캔 테스트
   - 고객 제보 테스트

4. **모니터링**
   - 접속 로그 확인
   - 에러 모니터링
   - 사용자 피드백 수집

---

**축하합니다! 🎊**

모디트 공개 페이지가 준비되었습니다.
이제 GitHub Pages에 배포하고 baewadal.co.kr에서 서비스를 시작하세요!

---

© 2025 Baewadal. All rights reserved.
