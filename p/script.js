// ⚙️ 설정 - 여기에 본인의 Supabase 정보를 입력하세요
const CONFIG = {
  SUPABASE_PROJECT_ID: 'bauvetkqpvkaoybhcoqj', // 예: 'abcdefghijklmnop'
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdXZldGtxcHZrYW95Ymhjb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2MTQsImV4cCI6MjA0ODE5NjYxNH0.qVCJ5xSxkN4yMXxX0X59_z8vAVlBSHmUhcU83tpImCQ"' // Supabase 프로젝트의 anon key
};

// 전역 변수
let currentLanguage = 'ko';
let priceListData = null;
let viewCount = 0;
let selectedReportType = null;

// 번역 데이터
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
    noItems: '등록된 상품이 없습니다.'
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
    noItems: 'No items registered.'
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
    noItems: '没有注册的商品。'
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
    noItems: '登録された商品がありません。'
  }
};

// URL에서 가격표 ID 추출
function getPriceListIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('priceListId');
}

// Toast 알림 표시
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

// 언어 변경
function changeLanguage(lang) {
  currentLanguage = lang;
  
  // 버튼 스타일 업데이트
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.remove('bg-[#E6A47D]', 'text-white');
    btn.classList.add('bg-gray-100', 'text-gray-600');
  });
  
  event.target.classList.remove('bg-gray-100', 'text-gray-600');
  event.target.classList.add('bg-[#E6A47D]', 'text-white');
  
  // UI 텍스트 업데이트
  updateUIText();
  
  // 상품 목록 다시 렌더링
  if (priceListData) {
    renderItems(priceListData.items);
  }
}

// UI 텍스트 업데이트
function updateUIText() {
  const t = TRANSLATIONS[currentLanguage];
  
  document.getElementById('welcome-message').textContent = t.welcome;
  document.getElementById('price-list-title').textContent = t.title;
  document.getElementById('view-count-label').textContent = t.viewCount + ':';
  document.getElementById('last-updated-label').textContent = t.lastUpdated + ':';
  document.getElementById('report-btn-text').innerHTML = t.reportBtn;
  document.getElementById('modal-title').textContent = t.modalTitle;
  document.getElementById('report-type-label').textContent = t.reportTypeLabel;
  document.getElementById('description-label').textContent = t.descriptionLabel;
  document.getElementById('anonymous-label').textContent = t.anonymousLabel;
  document.getElementById('name-label').textContent = t.nameLabel;
  document.getElementById('contact-label').textContent = t.contactLabel;
  document.getElementById('submit-btn').textContent = t.submitBtn;
  
  // 제보 유형 라벨
  document.getElementById('type-price').textContent = t.typePriceDisplay;
  document.getElementById('type-product').textContent = t.typeProductQuality;
  document.getElementById('type-hygiene').textContent = t.typeHygieneSafety;
  document.getElementById('type-service').textContent = t.typeServiceResponse;
  document.getElementById('type-payment').textContent = t.typePaymentReceipt;
  document.getElementById('type-illegal').textContent = t.typeIllegalHarmful;
  document.getElementById('type-facility').textContent = t.typeFacilityEnvironment;
  document.getElementById('type-other').textContent = t.typeOther;
}

// 가격표 데이터 로드
async function loadPriceList() {
  const priceListId = getPriceListIdFromUrl();
  
  if (!priceListId) {
    showError('가격표 ID가 URL에 없습니다. 예: ?id=YOUR_PRICE_LIST_ID');
    return;
  }
  
  try {
    const url = `https://${CONFIG.SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-f49b8637/modit-api-v2/price-lists/public/${priceListId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('가격표를 찾을 수 없습니다.');
    }
    
    const data = await response.json();
    
    priceListData = data.priceList;
    viewCount = data.viewCount || 0;
    
    // UI 업데이트
    document.getElementById('store-name').textContent = priceListData.storeName || '점포명';
    document.getElementById('view-count').textContent = viewCount;
    document.getElementById('last-updated').textContent = new Date(priceListData.updatedAt).toLocaleDateString();
    document.getElementById('modal-store-name').textContent = priceListData.storeName || '점포명';
    
    renderItems(priceListData.items || []);
    
    // 로딩 화면 숨기고 메인 콘텐츠 표시
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
  } catch (error) {
    console.error('가격표 로드 실패:', error);
    showError(error.message);
  }
}

// 상품 목록 렌더링
function renderItems(items) {
  const container = document.getElementById('items-container');
  const t = TRANSLATIONS[currentLanguage];
  
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-8 text-center border-2 border-gray-200">
        <p class="text-2xl text-gray-500">${t.noItems}</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="bg-white rounded-2xl p-4 sm:p-6 border-2 border-gray-200 hover:border-[#E6A47D] transition-colors">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-xl sm:text-2xl mb-2">${item.name}</h3>
          ${item.description ? `
            <p class="text-base sm:text-lg text-gray-600">
              ${t.description}: ${item.description}
            </p>
          ` : ''}
        </div>
      </div>
      
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <span class="text-base sm:text-lg text-gray-600">
          ${t.unit}: ${item.unit}
        </span>
        <div class="text-right">
          <div class="text-base sm:text-xl text-gray-600 mb-1">${t.price}</div>
          <div class="text-2xl sm:text-3xl text-[#E6A47D]">
            ${formatPrice(item.price)}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// 가격 포맷팅
function formatPrice(price) {
  if (currentLanguage === 'ko') {
    return `${price.toLocaleString()}원`;
  } else {
    return `₩${price.toLocaleString()}`;
  }
}

// 에러 화면 표시
function showError(message) {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('error-screen').style.display = 'flex';
  document.getElementById('error-message').innerHTML = `
    <p class="text-lg text-red-800 mb-2">오류 상세:</p>
    <p class="text-base text-red-600">${message}</p>
  `;
}

// 제보 다이얼로그 열기
function openReportDialog() {
  document.getElementById('report-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// 제보 다이얼로그 닫기
function closeReportDialog() {
  document.getElementById('report-modal').classList.remove('active');
  document.body.style.overflow = 'auto';
  
  // 폼 초기화
  document.getElementById('report-form').reset();
  selectedReportType = null;
  document.querySelectorAll('.report-type-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.getElementById('reporter-info').style.display = 'block';
}

// 제보 유형 선택
function selectReportType(type) {
  selectedReportType = type;
  
  // 모든 버튼 선택 해제
  document.querySelectorAll('.report-type-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  // 선택한 버튼 강조
  event.target.closest('.report-type-btn').classList.add('selected');
}

// 익명 토글
function toggleAnonymous() {
  const isAnonymous = document.getElementById('anonymous-checkbox').checked;
  const reporterInfo = document.getElementById('reporter-info');
  
  if (isAnonymous) {
    reporterInfo.style.display = 'none';
  } else {
    reporterInfo.style.display = 'block';
  }
}

// 제보 제출
async function submitReport(event) {
  event.preventDefault();
  
  // 유효성 검사
  if (!selectedReportType) {
    showToast('제보 유형을 선택해주세요.');
    return;
  }
  
  const description = document.getElementById('report-description').value.trim();
  if (!description) {
    showToast('상황 설명을 입력해주세요.');
    return;
  }
  
  const isAnonymous = document.getElementById('anonymous-checkbox').checked;
  const reporterName = isAnonymous ? null : document.getElementById('reporter-name').value.trim();
  const reporterContact = isAnonymous ? null : document.getElementById('reporter-contact').value.trim();
  
  // 제보 데이터 생성
  const reportData = {
    priceListId: priceListData.id,
    storeName: priceListData.storeName,
    storeUserId: priceListData.userId,
    reportType: selectedReportType,
    description: description,
    isAnonymous: isAnonymous,
    reporterName: reporterName,
    reporterContact: reporterContact,
    submittedAt: new Date().toISOString()
  };
  
  try {
    const url = `https://${CONFIG.SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-f49b8637/modit-api-v2/customer-reports`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });
    
    if (!response.ok) {
      throw new Error('제보 제출 실패');
    }
    
    showToast('제보가 접수되었습니다. 감사합니다!');
    closeReportDialog();
    
  } catch (error) {
    console.error('제보 제출 실패:', error);
    showToast('제보 제출 중 오류가 발생했습니다.');
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  // Lucide 아이콘 초기화
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // 가격표 데이터 로드
  loadPriceList();
});
