/* =====================================================================
   MODIT QR Price Viewer - Standalone Version
   완전히 새로 작성된 버전 (2025-01-30)
   ===================================================================== */

// ✅ API 설정
const API_BASE = "https://bauvetkqpvkaoybhcoqj.supabase.co/functions/v1/make-server-f49b8637/v2";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdXZldGtxcHZrYW95Ymhjb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjA2MTQsImV4cCI6MjA0ODE5NjYxNH0.qVCJ5xSxkN4yMXxX0X59_z8vAVlBSHmUhcU83tpImCQ";

// 전역 변수
let currentLang = 'ko';
let priceData = null;
let selectedType = null;

// 번역
const i18n = {
  ko: {
    welcome: '전통시장에 와주셔서 감사합니다',
    title: '가격표',
    price: '가격',
    unit: '단위',
    desc: '설명',
    views: '조회수',
    updated: '최종 업데이트',
    reportBtn: '🚨 제보하기',
    reportTitle: '🚨 운영 불편 제보하기',
    selectType: '제보 유형을 선택해주세요 *',
    describeIssue: '상황을 자세히 설명해주세요 *',
    anonymous: '익명으로 제보하기',
    yourName: '제보자명',
    contact: '연락처',
    submit: '제보하기',
    t1: '가격·표시 관련',
    t2: '제품·품질 관련',
    t3: '위생·안전 관련',
    t4: '서비스·응대 관련',
    t5: '결제·영수증 관련',
    t6: '불법·유해 행위 관련',
    t7: '시설·환경 관련',
    t8: '기타',
    noItems: '등록된 상품이 없습니다.'
  },
  en: {
    welcome: 'Thank you for visiting',
    title: 'Price List',
    price: 'Price',
    unit: 'Unit',
    desc: 'Description',
    views: 'Views',
    updated: 'Updated',
    reportBtn: '🚨 Report',
    reportTitle: '🚨 Report Issue',
    selectType: 'Select type *',
    describeIssue: 'Describe the issue *',
    anonymous: 'Anonymous',
    yourName: 'Name',
    contact: 'Contact',
    submit: 'Submit',
    t1: 'Price/Display',
    t2: 'Product/Quality',
    t3: 'Hygiene/Safety',
    t4: 'Service',
    t5: 'Payment',
    t6: 'Illegal',
    t7: 'Facility',
    t8: 'Other',
    noItems: 'No items.'
  },
  zh: {
    welcome: '感谢您访问',
    title: '价格表',
    price: '价格',
    unit: '单位',
    desc: '说明',
    views: '浏览',
    updated: '更新',
    reportBtn: '🚨 举报',
    reportTitle: '🚨 举报',
    selectType: '选择类型 *',
    describeIssue: '描述问题 *',
    anonymous: '匿名',
    yourName: '姓名',
    contact: '联系',
    submit: '提交',
    t1: '价格',
    t2: '质量',
    t3: '卫生',
    t4: '服务',
    t5: '付款',
    t6: '违法',
    t7: '设施',
    t8: '其他',
    noItems: '无商品。'
  },
  ja: {
    welcome: 'ご来店ありがとうございます',
    title: '価格表',
    price: '価格',
    unit: '単位',
    desc: '説明',
    views: '閲覧',
    updated: '更新',
    reportBtn: '🚨 報告',
    reportTitle: '🚨 報告',
    selectType: 'タイプ選択 *',
    describeIssue: '詳細 *',
    anonymous: '匿名',
    yourName: '名前',
    contact: '連絡先',
    submit: '送信',
    t1: '価格',
    t2: '品質',
    t3: '衛生',
    t4: 'サービス',
    t5: '決済',
    t6: '違法',
    t7: '施設',
    t8: 'その他',
    noItems: '商品なし。'
  }
};

// URL에서 ID 가져오기
function getID() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('priceListId');
}

// Toast
function toast(msg) {
  const el = document.getElementById('toast');
  const txt = document.getElementById('toast-message');
  if (el && txt) {
    txt.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
  } else {
    alert(msg);
  }
}

// 날짜 포맷
function fmtDate(d) {
  if (!d) return '-';
  try {
    return new Date(d).toLocaleString('ko-KR');
  } catch {
    return '-';
  }
}

// 가격 포맷
function fmtPrice(p) {
  const n = Number(p) || 0;
  return currentLang === 'ko' ? `${n.toLocaleString()}원` : `₩${n.toLocaleString()}`;
}

// 언어 변경
function changeLanguage(lang) {
  currentLang = lang;
  
  // 버튼 스타일
  document.querySelectorAll('.language-btn').forEach(b => {
    b.className = 'language-btn px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200';
  });
  
  const btn = document.querySelector(`button[onclick="changeLanguage('${lang}')"]`);
  if (btn) {
    btn.className = 'language-btn px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-colors bg-[#E6A47D] text-white';
  }
  
  updateText();
  if (priceData) renderItems(priceData.items || []);
}

// 텍스트 업데이트
function updateText() {
  const t = i18n[currentLang];
  const ids = {
    'welcome-message': t.welcome,
    'price-list-title': t.title,
    'view-count-label': t.views + ':',
    'last-updated-label': t.updated + ':',
    'report-btn-text': t.reportBtn,
    'modal-title': t.reportTitle,
    'report-type-label': t.selectType,
    'description-label': t.describeIssue,
    'anonymous-label': t.anonymous,
    'name-label': t.yourName,
    'contact-label': t.contact,
    'submit-btn': t.submit,
    'type-price': t.t1,
    'type-product': t.t2,
    'type-hygiene': t.t3,
    'type-service': t.t4,
    'type-payment': t.t5,
    'type-illegal': t.t6,
    'type-facility': t.t7,
    'type-other': t.t8
  };
  
  for (const [id, txt] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
}

// 가격표 로드
async function loadData() {
  const id = getID();
  if (!id) {
    showErr('가격표 ID가 없습니다. URL에 ?id=... 를 추가하세요.');
    return;
  }
  
  try {
    console.log('🔍 API 호출:', `${API_BASE}/price-list/public/${id}`);
    
    const res = await fetch(`${API_BASE}/price-list/public/${id}`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 응답:', res.status);
    
    if (!res.ok) throw new Error('가격표를 찾을 수 없습니다');
    
    const json = await res.json();
    console.log('📦 데이터:', json);
    
    if (!json.success || !json.priceList) throw new Error('데이터 없음');
    
    let pl = json.priceList;
    if (typeof pl === 'string') pl = JSON.parse(pl);
    
    priceData = { ...pl, viewCount: json.viewCount || 0 };
    
    console.log('✅ 저장 완료:', priceData);
    
    showData();
    
  } catch (err) {
    console.error('❌ 오류:', err);
    showErr(err.message);
  }
}

// 데이터 표시
function showData() {
  const $ = (id) => document.getElementById(id);
  
  if ($('store-name')) $('store-name').textContent = priceData.storeName || '-';
  if ($('modal-store-name')) $('modal-store-name').textContent = priceData.storeName || '-';
  if ($('view-count')) $('view-count').textContent = priceData.viewCount || 0;
  if ($('last-updated')) $('last-updated').textContent = fmtDate(priceData.updatedAt);
  
  renderItems(priceData.items || []);
  
  if ($('loading-screen')) $('loading-screen').style.display = 'none';
  if ($('main-content')) $('main-content').style.display = 'block';
  
  console.log('✅ UI 표시 완료');
}

// 상품 렌더링
function renderItems(items) {
  const con = document.getElementById('items-container');
  if (!con) return;
  
  const t = i18n[currentLang];
  
  if (!items || items.length === 0) {
    con.innerHTML = `<div class="bg-white rounded-2xl p-8 text-center border-2 border-gray-200"><p class="text-2xl text-gray-500">${t.noItems}</p></div>`;
    return;
  }
  
  con.innerHTML = items.map(item => `
    <div class="bg-white rounded-2xl p-4 sm:p-6 border-2 border-gray-200 hover:border-[#E6A47D] transition-colors">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-xl sm:text-2xl font-bold mb-2">${item.name || '-'}</h3>
          ${item.description ? `<p class="text-base sm:text-lg text-gray-600">${t.desc}: ${item.description}</p>` : ''}
        </div>
      </div>
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <span class="text-base sm:text-lg text-gray-600">${t.unit}: ${item.unit || '개'}</span>
        <div class="text-right">
          <div class="text-base sm:text-xl text-gray-600 mb-1">${t.price}</div>
          <div class="text-2xl sm:text-3xl text-[#E6A47D] font-bold">${fmtPrice(item.price)}</div>
        </div>
      </div>
    </div>
  `).join('');
  
  console.log(`✅ ${items.length}개 렌더링`);
}

// 에러 표시
function showErr(msg) {
  const $ = (id) => document.getElementById(id);
  
  const loading = $('loading-screen');
  const err = $('error-screen');
  const errMsg = $('error-message');
  
  if (loading) loading.style.display = 'none';
  if (err) err.style.display = 'flex';
  if (errMsg) errMsg.innerHTML = `<p class="text-lg text-red-800 mb-2 font-bold">오류:</p><p class="text-base text-red-600">${msg}</p>`;
  
  console.error('🚨 에러:', msg);
}

// 모달 열기
function openReportDialog() {
  const m = document.getElementById('report-modal');
  if (m) {
    m.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// 모달 닫기
function closeReportDialog() {
  const m = document.getElementById('report-modal');
  if (m) {
    m.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  
  const f = document.getElementById('report-form');
  if (f) f.reset();
  
  selectedType = null;
  document.querySelectorAll('.report-type-btn').forEach(b => b.classList.remove('selected'));
  
  const ri = document.getElementById('reporter-info');
  if (ri) ri.style.display = 'block';
}

// 유형 선택
function selectReportType(type) {
  selectedType = type;
  document.querySelectorAll('.report-type-btn').forEach(b => b.classList.remove('selected'));
  if (event && event.target) {
    const btn = event.target.closest('.report-type-btn');
    if (btn) btn.classList.add('selected');
  }
  console.log('선택:', type);
}

// 익명 토글
function toggleAnonymous() {
  const chk = document.getElementById('anonymous-checkbox');
  const info = document.getElementById('reporter-info');
  if (chk && info) {
    info.style.display = chk.checked ? 'none' : 'block';
  }
}

// 제보 제출
async function submitReport(e) {
  e.preventDefault();
  
  if (!selectedType) {
    toast('제보 유형을 선택해주세요');
    return;
  }
  
  const desc = document.getElementById('report-description');
  if (!desc || !desc.value.trim()) {
    toast('상황 설명을 입력해주세요');
    return;
  }
  
  const anon = document.getElementById('anonymous-checkbox');
  const isAnon = anon ? anon.checked : false;
  
  const name = document.getElementById('reporter-name');
  const contact = document.getElementById('reporter-contact');
  
  const data = {
    priceListId: priceData.id,
    storeName: priceData.storeName,
    storeUserId: priceData.userId,
    reportType: selectedType,
    description: desc.value.trim(),
    isAnonymous: isAnon,
    reporterName: isAnon ? null : (name ? name.value.trim() : null),
    reporterContact: isAnon ? null : (contact ? contact.value.trim() : null),
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 제보:', data);
  
  try {
    const res = await fetch(`${API_BASE}/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!res.ok) throw new Error('제출 실패');
    
    toast('제보가 접수되었습니다. 감사합니다!');
    closeReportDialog();
    
    console.log('✅ 제보 완료');
    
  } catch (err) {
    console.error('❌ 제보 실패:', err);
    toast('제출 중 오류가 발생했습니다');
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 QR Viewer 시작');
  console.log('URL:', window.location.href);
  console.log('ID:', getID());
  loadData();
});

// 디버그
window.debug = () => {
  console.log('언어:', currentLang);
  console.log('데이터:', priceData);
  console.log('선택:', selectedType);
};
