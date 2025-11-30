/* =====================================================================
   MODIT – Public Price Viewer + Report System (script.js)
   Author: Baewadal Co., Ltd.
   ===================================================================== */

/* ======================
설정 (환경 변수)
   ====================== */

// ✅ 짧은 URL 사용 (외부 도메인용)
const API_BASE = "https://bauvetkqpvkaoybhcoqj.supabase.co/functions/v1/server/make-server-f49b8637/v2";

// ✅ Supabase Public Anon Key
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdXZldGtxcHZrYW95Ymhjb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2MTQsImV4cCI6MjA0ODE5NjYxNH0.qVCJ5xSxkN4yMXxX0X59_z8vAVlBSHmUhcU83tpImCQ";

// 다국어 번역 테이블
const translations = {
  ko: {
    tagline: "투명한 가격, 신뢰할 수 있는 거래",
    loading: "가격표를 불러오는 중...",
    error: "오류",
    priceList: "가격표",
    views: "조회수",
    updated: "최종 업데이트",
    reportTitle: "🚨 가격 불일치 신고",
    reportDesc: "실제 가격이 다르거나 카드결제를 거부하나요?",
    reportBtn: "신고하기",
    reportFormTitle: "고객 제보",
    reportType: "제보 유형 *",
    priceDiff: "가격 불일치",
    cardRefusal: "카드결제 거부",
    quality: "품질 문제",
    service: "서비스 문제",
    other: "기타",
    itemName: "상품명",
    description: "상세 내용 *",
    reporterName: "제보자명 (선택)",
    reporterContact: "연락처 (선택)",
    submit: "제출하기",
    website: "공식 웹사이트",
    contact: "문의하기",
  },
  en: {
    tagline: "Transparent pricing, trusted transactions",
    loading: "Loading price list...",
    error: "Error",
    priceList: "Price List",
    views: "Views",
    updated: "Updated At",
    reportTitle: "🚨 Report Price Issue",
    reportDesc: "Incorrect price or card refusal?",
    reportBtn: "Report",
    reportFormTitle: "Customer Report",
    reportType: "Report Type *",
    priceDiff: "Price Mismatch",
    cardRefusal: "Card Payment Refusal",
    quality: "Quality Issue",
    service: "Service Issue",
    other: "Other",
    itemName: "Item Name",
    description: "Description *",
    reporterName: "Reporter Name (optional)",
    reporterContact: "Contact (optional)",
    submit: "Submit",
    website: "Official Website",
    contact: "Contact",
  },
  zh: {
    tagline: "透明价格，可信交易",
    loading: "正在加载价格表...",
  },
  ja: {
    tagline: "透明な価格、信頼できる取引",
    loading: "価格表を読み込み中...",
  }
};


/* ======================
초기 로드
   ====================== */

document.addEventListener("DOMContentLoaded", initPage);

async function initPage() {
  applyLanguage("ko");

  const params = new URLSearchParams(window.location.search);
  const priceListId = params.get("id");

  if (!priceListId) {
    showError("유효하지 않은 접근입니다.");
    return;
  }

  try {
    const priceData = await fetchPriceList(priceListId);
    if (!priceData) {
      showError("가격표를 찾을 수 없습니다.");
      return;
    }

    renderPriceList(priceData);
  } catch (err) {
    showError("가격표를 불러오는 중 오류가 발생했습니다.");
    console.error(err);
  }
}


/* ======================
다국어 적용 함수
   ====================== */

function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    applyLanguage(btn.dataset.lang);
  });
});


/* ======================
API 호출 함수
   ====================== */

async function fetchPriceList(priceListId) {
  const url = `${API_BASE}/price-list/public/${priceListId}`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    console.error("API 호출 실패:", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  console.log("📦 서버 응답 데이터:", data);
  
  if (data.success && data.priceList) {
    let priceListData = data.priceList;
    if (typeof priceListData === 'string') {
      priceListData = JSON.parse(priceListData);
    }
    
    return {
      ...priceListData,
      views: data.viewCount || priceListData.views || 0
    };
  }
  
  return null;
}

async function submitReport(payload) {
  const res = await fetch(`${API_BASE}/report`, {
    method: "POST",
    headers: { 
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });

  return res.ok;
}


/* ======================
가격표 렌더링
   ====================== */

function renderPriceList(data) {
  console.log("🎨 렌더링 데이터:", data);
  
  document.getElementById("loading").style.display = "none";
  document.getElementById("content").style.display = "block";

  document.getElementById("storeName").textContent = data.storeName || "이름 없음";
  document.getElementById("viewCount").textContent = data.views ?? 0;
  document.getElementById("updatedAt").textContent = formatDate(data.updatedAt);

  const container = document.getElementById("priceItems");
  container.innerHTML = "";

  (data.items || []).forEach(item => {
    const el = document.createElement("div");
    el.className = "price-item";

    el.innerHTML = `
      <div class="item-name">${item.name}</div>
      <div class="item-price">${Number(item.price).toLocaleString()}원</div>
      ${item.description ? `<div class="item-description">${item.description}</div>` : ""}
    `;

    container.appendChild(el);
  });
}


/* ======================
신고 모달 제어
   ====================== */

function openReportModal() {
  document.getElementById("reportModal").classList.add("active");
}

function closeReportModal() {
  document.getElementById("reportModal").classList.remove("active");
}


/* ======================
신고 제출
   ====================== */

document.getElementById("reportForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const priceListId = params.get("id");

  const payload = {
    priceListId,
    reportType: document.getElementById("reportType").value,
    itemName: document.getElementById("itemName").value,
    description: document.getElementById("description").value,
    reporterName: document.getElementById("reporterName").value,
    reporterContact: document.getElementById("reporterContact").value,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };

  if (!payload.reportType || !payload.description) {
    alert("필수 항목을 입력해주세요.");
    return;
  }

  const ok = await submitReport(payload);

  if (ok) {
    alert("제보가 접수되었습니다. 감사합니다.");
    closeReportModal();
    document.getElementById("reportForm").reset();
  } else {
    alert("제보 제출에 실패했습니다. 다시 시도해주세요.");
  }
});


/* ======================
공용 함수
   ====================== */

function showError(msg) {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error").style.display = "block";
  document.getElementById("error-message").textContent = msg;
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleString("ko-KR");
  } catch {
    return "정보 없음";
  }
}
