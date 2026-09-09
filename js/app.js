/**
 * SIGI-AI Main Application Controller
 * Handles screen transitions, navigation state, child profiles, history logs, and referral tickets.
 */

// Initial Mock Data for Child Profiles
const CHILDREN_PROFILES = [
  { id: 'c1', name: 'Ahmad Raihan', age: '4 Tahun 2 Bulan', gender: 'Laki-laki', avatar: 'AR' },
  { id: 'c2', name: 'Siti Fatimah', age: '2 Tahun 8 Bulan', gender: 'Perempuan', avatar: 'SF' }
];
let activeChild = CHILDREN_PROFILES[0];

// Initial Screening History
let screeningHistory = [
  {
    id: 'rec-1',
    childId: 'c1',
    date: '10 Agustus 2026',
    score: 88,
    riskLevel: 'low',
    badgeText: 'Risiko Rendah',
    summary: 'Email gigi bersih, plak minimal di batas gusi.',
    color: '#10b981'
  },
  {
    id: 'rec-2',
    childId: 'c1',
    date: '15 Juli 2026',
    score: 75,
    riskLevel: 'medium',
    badgeText: 'Risiko Sedang',
    summary: 'Ditemukan bercak putih awal karies di gigi seri atas.',
    color: '#f59e0b'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initAppNavigation();
  initPresentationControls();
  initScanner();
  initToothbrushingTimer();
  renderHistoryTimeline();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
});

/**
 * Screen Navigation & Bottom Bar Switcher
 */
function initAppNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.dataset.screen;
      if (targetScreen) {
        switchScreen(targetScreen);
        
        // Update nav active state (excluding standalone action buttons)
        if (!btn.classList.contains('nav-scan-cta')) {
          navButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      }
    });
  });

  // Hero Card Quick Scan CTA
  const heroScanBanner = document.getElementById('heroScanBanner');
  if (heroScanBanner) {
    heroScanBanner.addEventListener('click', () => {
      switchScreen('screen-scan');
    });
  }

  // Quick Start Brush CTA from Home Routine
  const btnStartBrushRoutine = document.getElementById('btnStartBrushRoutine');
  if (btnStartBrushRoutine) {
    btnStartBrushRoutine.addEventListener('click', () => {
      switchScreen('screen-edu');
    });
  }

  // Back buttons
  const backButtons = document.querySelectorAll('.btn-back-home');
  backButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchScreen('screen-home');
    });
  });

  // Action: Refer to Faskes from Result Screen
  const btnGoToFaskes = document.getElementById('btnGoToFaskes');
  if (btnGoToFaskes) {
    btnGoToFaskes.addEventListener('click', () => {
      switchScreen('screen-faskes');
    });
  }

  // Action: Save and Return
  const btnSaveAndHome = document.getElementById('btnSaveAndHome');
  if (btnSaveAndHome) {
    btnSaveAndHome.addEventListener('click', () => {
      alert('Data skrining gigi anak telah tersimpan aman ke Rekam Jejak Digital SIGI-AI & sinkronisasi Posyandu.');
      switchScreen('screen-home');
    });
  }
}

/**
 * Switch Active Screen View
 */
function switchScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  const targetScreen = document.getElementById(screenId);
  const viewport = document.querySelector('.screens-viewport');

  screens.forEach(s => s.classList.remove('active'));
  if (targetScreen) {
    targetScreen.classList.add('active');
    if (viewport) viewport.scrollTop = 0;
  }

  // Sync bottom nav active button
  const navButtons = document.querySelectorAll('.nav-item');
  navButtons.forEach(btn => {
    if (btn.dataset.screen === screenId) {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
}
window.switchScreen = switchScreen;

/**
 * Add New Screening Result to History
 */
function addScreeningToHistory(caseData) {
  const now = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  let dotColor = '#10b981';
  if (caseData.riskLevel === 'medium') dotColor = '#f59e0b';
  if (caseData.riskLevel === 'high') dotColor = '#ef4444';

  const newRecord = {
    id: `rec-${Date.now()}`,
    childId: activeChild.id,
    date: formattedDate,
    score: caseData.score,
    riskLevel: caseData.riskLevel,
    badgeText: caseData.badgeText,
    summary: caseData.summary,
    color: dotColor
  };

  screeningHistory.unshift(newRecord);
  renderHistoryTimeline();
  updateHomeScoreCard(caseData);
}
window.addScreeningToHistory = addScreeningToHistory;

/**
 * Update Home Dashboard with Latest Screening Stats
 */
function updateHomeScoreCard(latestData) {
  const scoreNum = document.getElementById('homeScoreNumber');
  const scoreBadge = document.getElementById('homeScoreBadge');
  const scoreDesc = document.getElementById('homeScoreDesc');
  const lastScanDate = document.getElementById('homeLastScanDate');

  if (scoreNum) scoreNum.textContent = latestData.score;
  if (scoreBadge) scoreBadge.textContent = latestData.badgeText.toUpperCase();
  if (scoreDesc) scoreDesc.textContent = latestData.summary;
  if (lastScanDate) lastScanDate.textContent = 'Hari ini';
}

/**
 * Render History Screen Timeline
 */
function renderHistoryTimeline() {
  const container = document.getElementById('timelineHistoryList');
  if (!container) return;

  container.innerHTML = '';
  screeningHistory.forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-left">
        <div class="timeline-status-dot" style="background: ${item.color};"></div>
        <div class="timeline-info">
          <h4>${item.badgeText} (Skor ${item.score}/100)</h4>
          <p>${item.date} • ${item.summary}</p>
        </div>
      </div>
      <div class="timeline-score">${item.score}</div>
    `;
    container.appendChild(el);
  });
}

/**
 * Presentation Bar Controls (Device Frame Toggle & Guide)
 */
function initPresentationControls() {
  const toggleFrameBtn = document.getElementById('btnToggleFrame');
  const quickGuideBtn = document.getElementById('btnQuickGuide');
  const modalGuide = document.getElementById('modalQuickGuide');
  const closeModalGuide = document.getElementById('btnCloseGuide');

  if (toggleFrameBtn) {
    toggleFrameBtn.addEventListener('click', () => {
      document.body.classList.toggle('fullscreen-mode');
      const isFull = document.body.classList.contains('fullscreen-mode');
      toggleFrameBtn.innerHTML = isFull
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="3"/></svg> Mode Frame Ponsel`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Mode Layar Penuh`;
    });
  }

  if (quickGuideBtn && modalGuide) {
    quickGuideBtn.addEventListener('click', () => {
      modalGuide.classList.add('active');
    });
  }

  if (closeModalGuide && modalGuide) {
    closeModalGuide.addEventListener('click', () => {
      modalGuide.classList.remove('active');
    });
  }

  // Child Profile Switcher
  const userProfileBadge = document.getElementById('userProfileBadge');
  if (userProfileBadge) {
    userProfileBadge.addEventListener('click', () => {
      const otherChild = CHILDREN_PROFILES.find(c => c.id !== activeChild.id);
      if (otherChild) {
        activeChild = otherChild;
        document.getElementById('childAvatarText').textContent = activeChild.avatar;
        document.getElementById('childProfileName').textContent = activeChild.name;
        document.getElementById('childProfileAge').textContent = activeChild.age;
        alert(`Profil beralih ke: ${activeChild.name} (${activeChild.age})`);
      }
    });
  }

  // Referral WhatsApp Button Action
  const btnWaReferrals = document.querySelectorAll('.btn-referral-wa');
  const modalTicket = document.getElementById('modalReferralTicket');
  const btnCloseTicket = document.getElementById('btnCloseTicket');

  btnWaReferrals.forEach(btn => {
    btn.addEventListener('click', () => {
      const faskesName = btn.dataset.faskes || 'Puskesmas Dayah Sehat';
      showReferralTicketModal(faskesName);
    });
  });

  if (btnCloseTicket && modalTicket) {
    btnCloseTicket.addEventListener('click', () => {
      modalTicket.classList.remove('active');
    });
  }
}

/**
 * Show Digital Referral Ticket Modal
 */
function showReferralTicketModal(faskesName) {
  const modal = document.getElementById('modalReferralTicket');
  const ticketCodeEl = document.getElementById('ticketCode');
  const ticketFaskesEl = document.getElementById('ticketFaskesName');
  const ticketPatientEl = document.getElementById('ticketPatientName');

  const randomCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
  if (ticketCodeEl) ticketCodeEl.textContent = randomCode;
  if (ticketFaskesEl) ticketFaskesEl.textContent = faskesName;
  if (ticketPatientEl) ticketPatientEl.textContent = `${activeChild.name} (${activeChild.age})`;

  if (modal) modal.classList.add('active');
}

/**
 * Live Clock in Phone Status Bar
 */
function updateLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}`;
  }
}
