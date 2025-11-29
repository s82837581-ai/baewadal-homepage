# 모디트 공개 가격표 페이지

baewadal.co.kr 도메인에서 호스팅되는 독립적인 QR 가격표 페이지입니다.

## 🎯 목적

- QR 코드 스캔 시 누구나 볼 수 있는 공개 가격표 페이지
- 모디트 앱과 API를 공유하여 실시간 데이터 연동
- 고객 제보 기능으로 가격 투명성 강화

## 🌐 URL 구조

```
https://baewadal.co.kr/p/?id={priceListId}
```

예시:
```
https://baewadal.co.kr/p/?id=price_user123
```

## 📂 파일 구조

```
public-pages/
├── index.html          # 메인 HTML 페이지
├── script.js           # JavaScript 로직
└── README.md          # 설명 문서
```

## 🚀 GitHub Pages 배포 방법

### 1. GitHub 저장소 생성

```bash
# 새 저장소 생성 또는 기존 저장소 사용
git init
git add .
git commit -m "Add public price list page"
```

### 2. GitHub에 푸시

```bash
git remote add origin https://github.com/{username}/{repo-name}.git
git push -u origin main
```

### 3. GitHub Pages 활성화

1. GitHub 저장소 → Settings → Pages
2. Source: **Deploy from a branch**
3. Branch: **main** / **public-pages**
4. Save

### 4. 커스텀 도메인 설정

1. GitHub Pages 설정에서 Custom domain: `baewadal.co.kr`
2. DNS 설정 (도메인 제공업체):
   ```
   Type: CNAME
   Name: @
   Value: {username}.github.io
   
   또는
   
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

3. `Enforce HTTPS` 체크

## 🔧 로컬 테스트

```bash
# 간단한 HTTP 서버 실행
cd public-pages
python3 -m http.server 8000

# 또는 Node.js 사용
npx serve .
```

브라우저에서 접속:
```
http://localhost:8000/?id=price_user123
```

## 🔗 모디트 앱과 연동

### QR 코드 생성 (모디트 앱)

모디트 앱에서 QR 코드를 생성할 때 다음 URL을 사용:

```javascript
// /utils/qrUrlGenerator.ts
export function generatePublicQRUrl(priceListId: string): string {
  return `https://baewadal.co.kr/p/?id=${priceListId}`;
}
```

### API 공유

공개 페이지는 모디트 앱과 동일한 Supabase API를 사용:

- **가격표 조회**: `GET /v2/price-list/public/{priceListId}`
- **고객 제보**: `POST /v2/customer-reports`

## ✨ 주요 기능

### 1. 다국어 지원
- 🇰🇷 한국어
- 🇺🇸 English
- 🇨🇳 中文
- 🇯🇵 日本語

### 2. 가격표 표시
- 상점 이름
- 상품 목록 (이름, 가격, 단위, 설명)
- 조회수
- 최종 업데이트 시간

### 3. 고객 제보
- 가격 불일치 신고
- 카드결제 거부 신고
- 품질/서비스 문제 제보

## 📱 모바일 최적화

- 반응형 디자인
- 터치 친화적 UI
- 모바일 브라우저 QR 스캔 지원

## 🎨 디자인 시스템

- **메인 컬러**: #E6A47D (살구빛)
- **배경색**: #FAF9F7 (따뜻한 아이보리)
- **폰트**: 시스템 기본 폰트 (Malgun Gothic)
- **어르신 친화**: 큰 글씨, 간단한 UI

## 🔒 보안

- 인증 불필요 (공개 페이지)
- API는 읽기 전용 (가격표 조회만)
- 고객 제보는 POST만 허용
- XSS 방지 (HTML 이스케이프)

## 📊 분석

조회수는 자동으로 증가하며, 모디트 오피스에서 확인 가능합니다.

## 🆘 문의

- 이메일: baewadal@baewadal.co.kr
- 웹사이트: https://www.baewadal.co.kr

---

© 2025 Baewadal. All rights reserved.
