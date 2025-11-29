// 모디트 공개 가격표 페이지 스크립트
// Supabase 연동 및 다국어 지원

// ============================================
// 설정
// ============================================

const CONFIG = {
  // Supabase 설정 - 환경에 따라 자동 선택
  SUPABASE_URL: 'https://viwzvfkqmrzmrrqfjxld.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpd3p2ZmtxbXJ6bXJycWZqeGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODIzNjcsImV4cCI6MjA1MDg1ODM2N30.p0u47_DnJ7y2afvgUf2u9bKTZ8C7TfNaUIJKr7Nvz4o',
  API_BASE_PATH: '/functions/v1/make-server-f49b8637'
};

// ============================================
// 다국어 지원
// ============================================

const translations = {
  ko: {
    tagline: '투명한 가격, 신뢰할 수 있는 거래',
    loading: '가격표를 불러오는 중...',
    error: '오류',
    notFound: '가격표를 찾을 수 없습니다',
    views: '조회수',
    updated: '최종 업데이트',
    priceList: '가격표',
    price: '가격',
    unit: '단위',
    description: '설명',
    noDescription: '설명 없음',
    reportTitle: '🚨 가격 불일치 신고',
    reportDesc: '실제 가격이 다르거나 카드결제를 거부하나요?',
    reportBtn: '신고하기',
    reportFormTitle: '고객 제보',
    reportType: '제보 유형',
    priceDiff: '가격 불일치',
    cardRefusal: '카드결제 거부',
    quality: '품질 문제',
    service: '서비스 문제',
    other: '기타',
    itemName: '상품명',
    reporterName: '제보자명 (선택)',
    reporterContact: '연락처 (선택)',
    submit: '제출하기',
    website: '공식 웹사이트',
    contact: '문의하기',
    selectPlaceholder: '선택해주세요',
    descriptionPlaceholder: '예: 메뉴판에는 5,000원인데 계산 시 6,000원을 요구했습니다.',
    itemNamePlaceholder: '예: 김치찌개',
    namePlaceholder: '예: 홍길동',
    contactPlaceholder: '예: 010-1234-5678 또는 abc@example.com',
    submitSuccess: '제보가 접수되었습니다. 감사합니다!',
    submitError: '제보 접수 중 오류가 발생했습니다.',
  },
  en: {
    tagline: 'Transparent Prices, Trustworthy Deals',
    loading: 'Loading price list...',
    error: 'Error',
    notFound: 'Price list not found',
    views: 'Views',
    updated: 'Last Updated',
    priceList: 'Price List',
    price: 'Price',
    unit: 'Unit',
    description: 'Description',
    noDescription: 'No description',
    reportTitle: '🚨 Report Issue',
    reportDesc: 'Wrong price or card payment refused?',
    reportBtn: 'Report',
    reportFormTitle: 'Customer Report',
    reportType: 'Report Type',
    priceDiff: 'Price Difference',
    cardRefusal: 'Card Payment Refused',
    quality: 'Quality Issue',
    service: 'Service Issue',
    other: 'Other',
    itemName: 'Item Name',
    reporterName: 'Your Name (Optional)',
    reporterContact: 'Contact (Optional)',
    submit: 'Submit',
    website: 'Official Website',
    contact: 'Contact Us',
    selectPlaceholder: 'Please select',
    descriptionPlaceholder: 'e.g., Menu shows 5,000 won but charged 6,000 won',
    itemNamePlaceholder: 'e.g., Kimchi Stew',
    namePlaceholder: 'e.g., John Doe',
    contactPlaceholder: 'e.g., 010-1234-5678 or abc@example.com',
    submitSuccess: 'Report submitted. Thank you!',
    submitError: 'Error submitting report.',
  },
  zh: {
    tagline: '透明价格，可信交易',
    loading: '加载价格表中...',
    error: '错误',
    notFound: '找不到价格表',
    views: '浏览次数',
    updated: '最后更新',
    priceList: '价格表',
    price: '价格',
    unit: '单位',
    description: '说明',
    noDescription: '无说明',
    reportTitle: '🚨 举报问题',
    reportDesc: '价格不符或拒绝刷卡？',
    reportBtn: '举报',
    reportFormTitle: '客户举报',
    reportType: '举报类型',
    priceDiff: '价格不符',
    cardRefusal: '拒绝刷卡',
    quality: '质量问题',
    service: '服务问题',
    other: '其他',
    itemName: '商品名',
    reporterName: '姓名（可选）',
    reporterContact: '联系方式（可选）',
    submit: '提交',
    website: '官方网站',
    contact: '联系我们',
    selectPlaceholder: '请选择',
    descriptionPlaceholder: '例：菜单上是5000元，但收费6000元',
    itemNamePlaceholder: '例：泡菜汤',
    namePlaceholder: '例：张三',
    contactPlaceholder: '例：010-1234-5678 或 abc@example.com',
    submitSuccess: '举报已提交。谢谢！',
    submitError: '提交举报时出错。',
  },
  ja: {
    tagline: '透明な価格、信頼できる取引',
    loading: '価格表を読み込み中...',
    error: 'エラー',
    notFound: '価格表が見つかりません',
    views: '閲覧数',
    updated: '最終更新',
    priceList: '価格表',
    price: '価格',
    unit: '単位',
    description: '説明',
    noDescription: '説明なし',
    reportTitle: '🚨 問題を報告',
    reportDesc: '価格が違うかカード拒否？',
    reportBtn: '報告',
    reportFormTitle: '顧客報告',
    reportType: '報告タイプ',
    priceDiff: '価格相違',
    cardRefusal: 'カード拒否',
    quality: '品質問題',
    service: 'サービス問題',
    other: 'その他',
    itemName: '商品名',
    reporterName: 'お名前（任意）',
    reporterContact: '連絡先（任意）',
    submit: '送信',
    website: '公式サイト',
    contact: 'お問い合わせ',
    selectPlaceholder: '選択してください',
    descriptionPlaceholder: '例：メニューは5,000ウォンだが6,000ウォン請求された',
    itemNamePlaceholder: '例：キムチチゲ',
    namePlaceholder: '例：山田太郎',
    contactPlaceholder: '例：010-1234-5678 または abc@example.com',
    submitSuccess: '報告が送信されました。ありがとうございます！',
    submitError: '報告の送信中にエラーが発生しました。',
  }
};

let currentLang = 'ko';
let priceListData = null;
let priceListId = null;

// ============================================
// 초기화
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 모디트 공개 가격표 페이지 초기화');
  
  // URL에서 priceListId 추출
  priceListId = getPriceListIdFromUrl();
  console.log('📋 Price List ID:', priceListId);
  
  if (!priceListId) {
    showError('가격표 ID를 찾을 수 없습니다.');
    return;
  }
  
  // 언어 버튼 이벤트
  setupLanguageButtons();
  
  // 폼 이벤트
  setupReportForm();
  
  // 가격표 로드
  loadPriceList();
});

// ============================================
// URL 파싱
// ============================================

function getPriceListIdFromUrl() {
  // URL 패턴:
  // 1. https://baewadal.co.kr/p/index.html?id=price_abc123
  // 2. https://baewadal.co.kr/p/?id=price_abc123
  // 3. https://baewadal.co.kr/p/price_abc123 (GitHub Pages 리다이렉트)
  
  const urlParams = new URLSearchParams(window.location.search);
  const idFromQuery = urlParams.get('id');
  
  if (idFromQuery) {
    return idFromQuery;
  }
  
  // 경로에서 추출
  const pathParts = window.location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  if (lastPart && lastPart !== 'index.html' && lastPart.startsWith('price_')) {
    return lastPart;
  }
  
  return null;
}

// ============================================
// API 호출
// ============================================

async function apiCall(endpoint, options = {}) {
  const url = `${CONFIG.SUPABASE_URL}${CONFIG.API_BASE_PATH}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    ...options.headers
  };
  
  const config = {
    method: options.method || 'GET',
    headers,
    ...options
  };
  
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  console.log('📡 API 호출:', url);
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API 오류:', errorText);
    throw new Error(`API 오류: ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// 가격표 로드
// ============================================

async function loadPriceList() {
  try {
    showLoading();
    
    const data = await apiCall(`/v2/price-list/public/${priceListId}`);
    
    console.log('✅ 가격표 로드 완료:', data);
    
    if (!data.priceList) {
      throw new Error('가격표 데이터가 없습니다.');
    }
    
    priceListData = data.priceList;
    displayPriceList(data.priceList, data.viewCount || 0);
    
  } catch (error) {
    console.error('❌ 가격표 로드 실패:', error);
    showError(error.message || '가격표를 불러올 수 없습니다.');
  }
}

function displayPriceList(priceList, viewCount) {
  // 상점 정보
  document.getElementById('storeName').textContent = priceList.storeName;
  document.getElementById('viewCount').textContent = viewCount.toLocaleString();
  
  // 업데이트 시간
  const updatedDate = new Date(priceList.updatedAt);
  document.getElementById('updatedAt').textContent = formatDate(updatedDate);
  
  // 가격표 아이템
  const itemsContainer = document.getElementById('priceItems');
  itemsContainer.innerHTML = '';
  
  if (!priceList.items || priceList.items.length === 0) {
    itemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">등록된 상품이 없습니다.</p>';
  } else {
    priceList.items.forEach(item => {
      const itemEl = createPriceItemElement(item);
      itemsContainer.appendChild(itemEl);
    });
  }
  
  // 콘텐츠 표시
  hideLoading();
  showContent();
}

function createPriceItemElement(item) {
  const div = document.createElement('div');
  div.className = 'price-item';
  
  div.innerHTML = `
    <div class="item-name">${escapeHtml(item.name)}</div>
    <div class="item-price">${formatPrice(item.price)}</div>
    <div class="item-meta">
      <span><span data-i18n="unit">단위</span>: ${escapeHtml(item.unit || '개')}</span>
    </div>
    ${item.description ? `<div class="item-description">${escapeHtml(item.description)}</div>` : ''}
  `;
  
  return div;
}

// ============================================
// 고객 제보
// ============================================

function setupReportForm() {
  const form = document.getElementById('reportForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    
    try {
      const formData = {
        priceListId: priceListId,
        storeName: priceListData?.storeName || '알 수 없음',
        reportType: document.getElementById('reportType').value,
        itemName: document.getElementById('itemName').value || null,
        description: document.getElementById('description').value,
        reporterName: document.getElementById('reporterName').value || '익명',
        reporterContact: document.getElementById('reporterContact').value || null,
        timestamp: new Date().toISOString(),
        source: 'public_qr_page'
      };
      
      console.log('📤 제보 전송:', formData);
      
      await apiCall('/v2/customer-reports', {
        method: 'POST',
        body: formData
      });
      
      alert(translations[currentLang].submitSuccess);
      closeReportModal();
      form.reset();
      
    } catch (error) {
      console.error('❌ 제보 전송 실패:', error);
      alert(translations[currentLang].submitError);
    } finally {
      submitBtn.disabled = false;
      updateTranslations();
    }
  });
}

// ============================================
// 모달
// ============================================

function openReportModal() {
  const modal = document.getElementById('reportModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeReportModal() {
  const modal = document.getElementById('reportModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// 모달 외부 클릭 시 닫기
document.getElementById('reportModal').addEventListener('click', (e) => {
  if (e.target.id === 'reportModal') {
    closeReportModal();
  }
});

// ============================================
// 다국어
// ============================================

function setupLanguageButtons() {
  const buttons = document.querySelectorAll('.lang-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      
      // 버튼 활성화 상태 변경
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function setLanguage(lang) {
  currentLang = lang;
  updateTranslations();
}

function updateTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translation = translations[currentLang][key];
    
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else if (el.tagName === 'OPTION') {
        el.textContent = translation;
      } else {
        el.textContent = translation;
      }
    }
  });
  
  // placeholder 업데이트
  updatePlaceholders();
}

function updatePlaceholders() {
  const placeholders = {
    description: translations[currentLang].descriptionPlaceholder || '',
    itemName: translations[currentLang].itemNamePlaceholder || '',
    reporterName: translations[currentLang].namePlaceholder || '',
    reporterContact: translations[currentLang].contactPlaceholder || ''
  };
  
  Object.keys(placeholders).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.placeholder = placeholders[id];
    }
  });
}

// ============================================
// UI 헬퍼
// ============================================

function showLoading() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('error').style.display = 'none';
  document.getElementById('content').style.display = 'none';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function showError(message) {
  hideLoading();
  document.getElementById('error').style.display = 'block';
  document.getElementById('error-message').textContent = message;
}

function showContent() {
  document.getElementById('content').style.display = 'block';
}

// ============================================
// 유틸리티
// ============================================

function formatPrice(price) {
  if (typeof price === 'number') {
    return price.toLocaleString('ko-KR') + '원';
  }
  return price + '원';
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// 전역 함수 (HTML에서 호출)
// ============================================

window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
