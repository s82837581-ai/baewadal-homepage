/* =====================================================================
   MODIT – Public Price Viewer + Report System (script.js)
   Author: Baewadal Co., Ltd.
   Last Updated: 2025-01-30
   ===================================================================== */

/* ======================
   설정 (환경 변수)
   ====================== */

// ✅ API 엔드포인트
const API_BASE = "https://bauvetkqpvkaoybhcoqj.supabase.co/functions/v1/make-server-f49b8637/v2";

// ✅ Supabase Public Anon Key
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdXZldGtxcHZrYW95Ymhjb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2MTQsImV4cCI6MjA0ODE5NjYxNH0.qVCJ5xSxkN4yMXxX0X59_z8vAVlBSHmUhcU83tpImCQ";

/* ======================
   전역 변수
   ====================== */

let currentLanguage = 'ko';
let priceListData = null;
let selectedReportType = null;

/* ======================
   다국어 번역 테이블
   ====================== */

const TRANSLATIONS = {
  ko: {
    welcome: '전통시장에 와주셔서 감사합니다',
    title: '가격표',
    price: '가격',
    unit: '단위',
    description: '설명',
    viewCount: '조회수',
    lastUpdated: '최종 업데이트',
    reportBtn: '🚨 제보하기',
    modalTitle: '🚨 운영 불편 제보하기',
    reportTypeLabel: '제보 유형을 선택해주세요 *',
    descriptionLabel: '상황을 자세히 설명해주세요 *',
    anonymousLabel: '익명으로 제보하기',
    nameLabel: '제보자명',
    contactLabel: '연락처',
    submitBtn: '제보하기',
    typePriceDisplay: '가격·표시 관련',
    typeProductQuality: '제품·품질 관련',
    typeHygieneSafety: '위생·안전 관련',
    typeServiceResponse: '서비스·응대 관련',
    typePaymentReceipt: '결제·영수증 관련',
    typeIllegalHarmful: '불법·유해 행위 관련',
    typeFacilityEnvironment: '시설·환경 관련',
    typeOther: '기타',
    noItems: '등록된 상품이 없습니다.',
    loading: '가격표를 불러오는 중...',
    errorTitle: '가격표를 찾을 수 없습니다',
    errorDesc: '오류가 발생했습니다'
  },
  en: {
    welcome: 'Thank you for visiting the traditional market',
    title: 'Price List',
    price: 'Price',
    unit: 'Unit',
    description: 'Description',
    viewCount: 'Views',
    lastUpdated: 'Last Updated',
    reportBtn: '🚨 Report',
    modalTitle: '🚨 Report Issue',
    reportTypeLabel: 'Select report type *',
    descriptionLabel: 'Please describe the situation *',
    anonymousLabel: 'Report anonymously',
    nameLabel: 'Your name',
    contactLabel: 'Contact',
    submitBtn: 'Submit',
    typePriceDisplay: 'Price/Display',
    typeProductQuality: 'Product/Quality',
    typeHygieneSafety: 'Hygiene/Safety',
    typeServiceResponse: 'Service/Response',
    typePaymentReceipt: 'Payment/Receipt',
    typeIllegalHarmful: 'Illegal/Harmful',
    typeFacilityEnvironment: 'Facility/Environment',
    typeOther: 'Other',
    noItems: 'No items registered.',
    loading: 'Loading price list...',
    errorTitle: 'Price list not found',
    errorDesc: 'An error occurred'
  },
  zh: {
    welcome: '感谢您访问传统市场',
    title: '价格表',
    price: '价格',
    unit: '单位',
    description: '说明',
    viewCount: '浏览次数',
    lastUpdated: '最后更新',
    reportBtn: '🚨 举报',
    modalTitle: '🚨 举报问题',
    reportTypeLabel: '请选择举报类型 *',
    descriptionLabel: '请详细说明情况 *',
    anonymousLabel: '匿名举报',
    nameLabel: '您的姓名',
    contactLabel: '联系方式',
    submitBtn: '提交',
    typePriceDisplay: '价格·标示',
    typeProductQuality: '产品·质量',
    typeHygieneSafety: '卫生·安全',
    typeServiceResponse: '服务·应对',
    typePaymentReceipt: '付款·收据',
    typeIllegalHarmful: '非法·有害',
    typeFacilityEnvironment: '设施·环境',
    typeOther: '其他',
    noItems: '没有注册的商品。',
    loading: '正在加载价格表...',
    errorTitle: '找不到价格表',
    errorDesc: '发生错误'
  },
  ja: {
    welcome: '伝統市場にお越しいただきありがとうございます',
    title: '価格表',
    price: '価格',
    unit: '単位',
    description: '説明',
    viewCount: '閲覧数',
    lastUpdated: '最終更新',
    reportBtn: '🚨 報告',
    modalTitle: '🚨 問題を報告',
    reportTypeLabel: '報告タイプを選択してください *',
    descriptionLabel: '状況を詳しく説明してください *',
    anonymousLabel: '匿名で報告',
    nameLabel: 'お名前',
    contactLabel: '連絡先',
    submitBtn: '送信',
    typePriceDisplay: '価格·表示',
    typeProductQuality: '製品·品質',
    typeHygieneSafety: '衛生·安全',
    typeServiceResponse: 'サービス·対応',
    typePaymentReceipt: '決済·領収書',
    typeIllegalHarmful: '違法·有害',
    typeFacilityEnvironment: '施設·環境',
    typeOther: 'その他',
    noItems: '登録された商品がありません。',
    loading: '価格表を読み込み中...',
    errorTitle: '価格表が見つかりません',
    errorDesc: 'エラーが発生しました'
  }
};

/* ======================
   유틸리티 함수
   ====================== */

// URL에서 가격표 ID 추출
function getPriceListIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('priceListId');
}

// 날짜 포맷팅
function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return '-';
  }
}

// 가격 포맷팅
function formatPrice(price) {
  const numPrice = Number(price) || 0;
  if (currentLanguage === 'ko') {
    return `${numPrice.toLocaleString('ko-KR')}원`;
  } else {
    return `₩${numPrice.toLocaleString('en-US')}`;
  }
}

// Toast 알림 표시
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  if (!toast || !toastMessage) {
    console.warn('Toast 요소를 찾을 수 없습니다');
    alert(message);
    return;
  }
  
  toastMessage.textContent = message;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

/* ======================
   언어 변경
   ====================== */

function changeLanguage(lang) {
  if (!TRANSLATIONS[lang]) {
    console.error('지원하지 않는 언어:', lang);
    return;
  }
  
  currentLanguage = lang;
  
  // 언어 버튼 스타일 업데이트
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.remove('bg-[#E6A47D]', 'text-white');
    btn.classList.add('bg-gray-100', 'text-gray-600');
  });
  
  // 클릭된 버튼 강조
  const clickedBtn = event ? event.target : document.querySelector(`.language-btn[onclick*="${lang}"]`);
  if (clickedBtn) {
    clickedBtn.classList.remove('bg-gray-100', 'text-gray-600');
    clickedBtn.classList.add('bg-[#E6A47D]', 'text-white');
  }
  
  // UI 텍스트 업데이트
  updateUIText();
  
  // 상품 목록 다시 렌더링
  if (priceListData && priceListData.items) {
    renderItems(priceListData.items);
  }
}

/* ======================
   UI 텍스트 업데이트
   ====================== */

function updateUIText() {
  const t = TRANSLATIONS[currentLanguage];
  
  const textElements = {
    'welcome-message': t.welcome,
    'price-list-title': t.title,
    'view-count-label': t.viewCount + ':',
    'last-updated-label': t.lastUpdated + ':',
    'report-btn-text': t.reportBtn,
    'modal-title': t.modalTitle,
    'report-type-label': t.reportTypeLabel,
    'description-label': t.descriptionLabel,
    'anonymous-label': t.anonymousLabel,
    'name-label': t.nameLabel,
    'contact-label': t.contactLabel,
    'submit-btn': t.submitBtn,
    'type-price': t.typePriceDisplay,
    'type-product': t.typeProductQuality,
    'type-hygiene': t.typeHygieneSafety,
    'type-service': t.typeServiceResponse,
    'type-payment': t.typePaymentReceipt,
    'type-illegal': t.typeIllegalHarmful,
    'type-facility': t.typeFacilityEnvironment,
    'type-other': t.typeOther
  };
  
  Object.entries(textElements).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text;
    }
  });
}

/* ======================
   가격표 데이터 로드
   ====================== */

async function loadPriceList() {
  const priceListId = getPriceListIdFromUrl();
  
  if (!priceListId) {
    showError('가격표 ID가 URL에 없습니다. 올바른 QR 코드를 스캔해주세요.');
    return;
  }
  
  try {
    const url = `${API_BASE}/price-list/public/${priceListId}`;
    
    console.log('🔍 [API] 가격표 조회 요청:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 [API] 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`API 오류: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📦 [API] 서버 응답 데이터:', data);
    
    if (!data.success || !data.priceList) {
      throw new Error('가격표 데이터가 없습니다');
    }
    
    // priceList가 문자열인 경우 JSON 파싱
    let priceListObj = data.priceList;
    if (typeof priceListObj === 'string') {
      try {
        priceListObj = JSON.parse(priceListObj);
        console.log('🔄 [Parse] JSON 파싱 완료:', priceListObj);
      } catch (parseError) {
        console.error('❌ [Parse] JSON 파싱 실패:', parseError);
        throw new Error('가격표 데이터 형식 오류');
      }
    }
    
    // 전역 변수에 저장
    priceListData = {
      ...priceListObj,
      viewCount: data.viewCount || priceListObj.views || 0
    };
    
    console.log('✅ [Data] 가격표 데이터 저장 완료:', priceListData);
    
    // UI 업데이트
    updatePriceListUI();
    
  } catch (error) {
    console.error('❌ [Error] 가격표 로드 실패:', error);
    showError(error.message || '가격표를 불러오는 중 오류가 발생했습니다');
  }
}

/* ======================
   가격표 UI 업데이트
   ====================== */

function updatePriceListUI() {
  if (!priceListData) {
    console.error('가격표 데이터가 없습니다');
    return;
  }
  
  // 점포명 업데이트
  const storeNameEl = document.getElementById('store-name');
  if (storeNameEl) {
    storeNameEl.textContent = priceListData.storeName || '점포명 없음';
  }
  
  // 모달 점포명 업데이트
  const modalStoreNameEl = document.getElementById('modal-store-name');
  if (modalStoreNameEl) {
    modalStoreNameEl.textContent = priceListData.storeName || '점포명 없음';
  }
  
  // 조회수 업데이트
  const viewCountEl = document.getElementById('view-count');
  if (viewCountEl) {
    viewCountEl.textContent = priceListData.viewCount || 0;
  }
  
  // 최종 업데이트 시간 업데이트
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = formatDate(priceListData.updatedAt);
  }
  
  // 상품 목록 렌더링
  renderItems(priceListData.items || []);
  
  // 로딩 화면 숨기고 메인 콘텐츠 표시
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  
  if (loadingScreen) loadingScreen.style.display = 'none';
  if (mainContent) mainContent.style.display = 'block';
  
  console.log('✅ [UI] 가격표 UI 업데이트 완료');
}

/* ======================
   상품 목록 렌더링
   ====================== */

function renderItems(items) {
  const container = document.getElementById('items-container');
  if (!container) {
    console.error('items-container 요소를 찾을 수 없습니다');
    return;
  }
  
  const t = TRANSLATIONS[currentLanguage];
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-8 text-center border-2 border-gray-200">
        <p class="text-2xl text-gray-500">${t.noItems}</p>
      </div>
    `;
    console.log('ℹ️ [Render] 상품이 없습니다');
    return;
  }
  
  const itemsHTML = items.map((item, index) => {
    const itemName = item.name || '상품명 없음';
    const itemPrice = item.price || 0;
    const itemUnit = item.unit || '개';
    const itemDesc = item.description || '';
    
    return `
      <div class="bg-white rounded-2xl p-4 sm:p-6 border-2 border-gray-200 hover:border-[#E6A47D] transition-colors">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-xl sm:text-2xl font-bold mb-2">${itemName}</h3>
            ${itemDesc ? `
              <p class="text-base sm:text-lg text-gray-600">
                ${t.description}: ${itemDesc}
              </p>
            ` : ''}
          </div>
        </div>
        
        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <span class="text-base sm:text-lg text-gray-600">
            ${t.unit}: ${itemUnit}
          </span>
          <div class="text-right">
            <div class="text-base sm:text-xl text-gray-600 mb-1">${t.price}</div>
            <div class="text-2xl sm:text-3xl text-[#E6A47D] font-bold">
              ${formatPrice(itemPrice)}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = itemsHTML;
  console.log(`✅ [Render] ${items.length}개 상품 렌더링 완료`);
}

/* ======================
   에러 화면 표시
   ====================== */

function showError(message) {
  const loadingScreen = document.getElementById('loading-screen');
  const errorScreen = document.getElementById('error-screen');
  const errorMessage = document.getElementById('error-message');
  
  // 로딩 화면 숨기기
  if (loadingScreen) loadingScreen.style.display = 'none';
  
  // 에러 화면 표시
  if (errorScreen) errorScreen.style.display = 'flex';
  
  // 에러 메시지 표시
  if (errorMessage) {
    errorMessage.innerHTML = `
      <p class="text-lg text-red-800 mb-2 font-bold">오류 상세:</p>
      <p class="text-base text-red-600">${message}</p>
    `;
  }
  
  console.error('🚨 [Error] 에러 화면 표시:', message);
}

/* ======================
   제보 다이얼로그 열기
   ====================== */

function openReportDialog() {
  const modal = document.getElementById('report-modal');
  if (!modal) {
    console.error('report-modal 요소를 찾을 수 없습니다');
    return;
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  console.log('✅ [Modal] 제보 다이얼로그 열림');
}

/* ======================
   제보 다이얼로그 닫기
   ====================== */

function closeReportDialog() {
  const modal = document.getElementById('report-modal');
  if (!modal) {
    console.error('report-modal 요소를 찾을 수 없습니다');
    return;
  }
  
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
  
  // 폼 초기화
  const form = document.getElementById('report-form');
  if (form) form.reset();
  
  // 선택된 제보 유형 초기화
  selectedReportType = null;
  
  // 모든 제보 유형 버튼 선택 해제
  document.querySelectorAll('.report-type-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // 제보자 정보 표시
  const reporterInfo = document.getElementById('reporter-info');
  if (reporterInfo) reporterInfo.style.display = 'block';
  
  console.log('✅ [Modal] 제보 다이얼로그 닫힘');
}

/* ======================
   제보 유형 선택
   ====================== */

function selectReportType(type) {
  selectedReportType = type;
  
  // 모든 버튼 선택 해제
  document.querySelectorAll('.report-type-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // 클릭된 버튼만 선택
  if (event && event.target) {
    const clickedBtn = event.target.closest('.report-type-btn');
    if (clickedBtn) {
      clickedBtn.classList.add('selected');
    }
  }
  
  console.log('✅ [Report] 제보 유형 선택:', type);
}

/* ======================
   익명 제보 토글
   ====================== */

function toggleAnonymous() {
  const checkbox = document.getElementById('anonymous-checkbox');
  const reporterInfo = document.getElementById('reporter-info');
  
  if (!checkbox || !reporterInfo) {
    console.error('익명 체크박스 또는 제보자 정보 요소를 찾을 수 없습니다');
    return;
  }
  
  const isAnonymous = checkbox.checked;
  reporterInfo.style.display = isAnonymous ? 'none' : 'block';
  
  console.log('✅ [Report] 익명 제보:', isAnonymous);
}

/* ======================
   제보 제출
   ====================== */

async function submitReport(event) {
  event.preventDefault();
  
  // 유효성 검사: 제보 유형
  if (!selectedReportType) {
    showToast('제보 유형을 선택해주세요');
    return;
  }
  
  // 유효성 검사: 상황 설명
  const descriptionEl = document.getElementById('report-description');
  const description = descriptionEl ? descriptionEl.value.trim() : '';
  
  if (!description) {
    showToast('상황 설명을 입력해주세요');
    return;
  }
  
  // 익명 여부 확인
  const anonymousCheckbox = document.getElementById('anonymous-checkbox');
  const isAnonymous = anonymousCheckbox ? anonymousCheckbox.checked : false;
  
  // 제보자 정보
  const reporterNameEl = document.getElementById('reporter-name');
  const reporterContactEl = document.getElementById('reporter-contact');
  
  const reporterName = isAnonymous ? null : (reporterNameEl ? reporterNameEl.value.trim() : null);
  const reporterContact = isAnonymous ? null : (reporterContactEl ? reporterContactEl.value.trim() : null);
  
  // 제보 데이터 생성
  const reportData = {
    priceListId: priceListData.id,
    storeName: priceListData.storeName,
    storeUserId: priceListData.userId,
    reportType: selectedReportType,
    description: description,
    isAnonymous: isAnonymous,
    reporterName: reporterName || null,
    reporterContact: reporterContact || null,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 [Report] 제보 제출 데이터:', reportData);
  
  try {
    const url = `${API_BASE}/report`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });
    
    console.log('📡 [Report] 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error('제보 제출 실패');
    }
    
    showToast('제보가 접수되었습니다. 감사합니다!');
    closeReportDialog();
    
    console.log('✅ [Report] 제보 제출 완료');
    
  } catch (error) {
    console.error('❌ [Report] 제보 제출 실패:', error);
    showToast('제보 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

/* ======================
   페이지 초기화
   ====================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 [Init] 페이지 초기화 시작');
  console.log('🌐 [Init] URL:', window.location.href);
  console.log('🔑 [Init] 가격표 ID:', getPriceListIdFromUrl());
  
  // 가격표 데이터 로드
  loadPriceList();
});

/* ======================
   디버깅용 전역 함수 노출
   ====================== */

window.debugInfo = function() {
  console.log('=== 디버그 정보 ===');
  console.log('현재 언어:', currentLanguage);
  console.log('가격표 데이터:', priceListData);
  console.log('선택된 제보 유형:', selectedReportType);
  console.log('API 엔드포인트:', API_BASE);
};
