/**
 * SIGI-AI Main Application Controller
 * Handles screen transitions, navigation state, child profiles (localStorage), history logs, and referral tickets.
 * No dummy data - all data is entered and persisted by the user.
 */

// ====== TOAST NOTIFICATION SYSTEM ======
function showToast(message, type = 'info', duration = 3000) {
  const existing = document.getElementById('sigi-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'sigi-toast';

  const colors = {
    info: { bg: '#0284c7', icon: 'ℹ️' },
    success: { bg: '#10b981', icon: '✅' },
    warning: { bg: '#f59e0b', icon: '⚠️' },
    error: { bg: '#ef4444', icon: '🚫' }
  };
  const c = colors[type] || colors.info;

  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${c.bg}; color: #fff; padding: 10px 20px; border-radius: 999px;
    font-family: inherit; font-size: 0.82rem; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25); z-index: 9999;
    display: flex; align-items: center; gap: 8px;
    opacity: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 90%; text-align: center; white-space: nowrap;
  `;
  toast.innerHTML = `<span>${c.icon}</span><span>${sanitizeHTML(message)}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ====== PERSISTENT DATA (localStorage) ======
const STORAGE_KEYS = {
  profiles: 'sigi_child_profiles',
  activeProfileId: 'sigi_active_profile_id',
  history: 'sigi_screening_history'
};

function loadProfiles() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.profiles);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveProfiles(profiles) {
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
}

function loadActiveProfileId() {
  return localStorage.getItem(STORAGE_KEYS.activeProfileId) || null;
}

function saveActiveProfileId(id) {
  localStorage.setItem(STORAGE_KEYS.activeProfileId, id);
}

function loadHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.history);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

// ====== HTML SANITIZER ======
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ====== APP STATE ======
let childProfiles = loadProfiles();
let activeChild = null;
let screeningHistory = loadHistory();

function getActiveChild() {
  if (childProfiles.length === 0) return null;
  const savedId = loadActiveProfileId();
  const found = childProfiles.find(c => c.id === savedId);
  return found || childProfiles[0];
}

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
  activeChild = getActiveChild();
  
  initAppNavigation();
  initPresentationControls();
  initScanner();
  initProfileForm();
  renderHistoryTimeline();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Decide which screen to show first
  if (childProfiles.length === 0) {
    // No profiles: show setup screen
    switchScreen('screen-setup');
  } else {
    // Has profiles: show home
    updateHomeUI();
    switchScreen('screen-home');
  }
});

/**
 * Profile Form Initialization
 */
function initProfileForm() {
  const btnSave = document.getElementById('btnSaveProfile');
  const btnGoSetup = document.getElementById('btnGoToSetup');
  const btnAddNew = document.getElementById('btnAddNewChild');

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const name = document.getElementById('inputChildName').value.trim();
      const age = document.getElementById('inputChildAge').value.trim();
      const month = document.getElementById('inputChildMonth').value.trim();
      const gender = document.getElementById('inputChildGender').value;
      const posyandu = document.getElementById('inputPosyandu').value.trim();

      if (!name) {
        showToast('Nama anak wajib diisi.', 'warning');
        return;
      }
      if (!age && !month) {
        showToast('Usia anak wajib diisi.', 'warning');
        return;
      }
      if (!gender) {
        showToast('Jenis kelamin wajib dipilih.', 'warning');
        return;
      }

      const ageStr = `${age || 0} Tahun ${month || 0} Bulan`;
      const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

      const newProfile = {
        id: `child-${Date.now()}`,
        name,
        age: ageStr,
        gender,
        posyandu: posyandu || '—',
        avatar: initials
      };

      childProfiles.push(newProfile);
      saveProfiles(childProfiles);
      
      activeChild = newProfile;
      saveActiveProfileId(newProfile.id);

      // Clear form
      document.getElementById('inputChildName').value = '';
      document.getElementById('inputChildAge').value = '';
      document.getElementById('inputChildMonth').value = '';
      document.getElementById('inputChildGender').value = '';
      document.getElementById('inputPosyandu').value = '';

      updateHomeUI();
      switchScreen('screen-home');
    });
  }

  if (btnGoSetup) {
    btnGoSetup.addEventListener('click', () => {
      switchScreen('screen-setup');
    });
  }

  if (btnAddNew) {
    btnAddNew.addEventListener('click', () => {
      switchScreen('screen-setup');
    });
  }
}

/**
 * Update Home Dashboard UI with active profile data
 */
function updateHomeUI() {
  const emptyState = document.getElementById('emptyStateCard');
  const heroScan = document.getElementById('heroScanBanner');
  const scoreCard = document.querySelector('.health-score-card');

  if (childProfiles.length === 0 || !activeChild) {
    // Show empty state
    if (emptyState) emptyState.style.display = 'block';
    if (heroScan) heroScan.style.display = 'none';
    if (scoreCard) scoreCard.style.display = 'none';
    return;
  }

  // Has profile - show normal dashboard
  if (emptyState) emptyState.style.display = 'none';
  if (heroScan) heroScan.style.display = 'flex';
  if (scoreCard) scoreCard.style.display = 'block';

  // Update profile display
  const avatarEl = document.getElementById('childAvatarText');
  const nameEl = document.getElementById('childProfileName');
  const ageEl = document.getElementById('childProfileAge');
  const posyanduEl = document.getElementById('homePosyanduName');

  if (avatarEl) avatarEl.textContent = activeChild.avatar;
  if (nameEl) nameEl.textContent = activeChild.name;
  if (ageEl) ageEl.textContent = activeChild.age;
  if (posyanduEl) posyanduEl.textContent = activeChild.posyandu || '—';

  // Restore last screening data for this child from history
  const childHistory = screeningHistory.filter(h => h.childId === activeChild.id);
  if (childHistory.length > 0) {
    const latest = childHistory[0];
    updateHomeScoreCard(latest);
  } else {
    // Reset score card to "not yet examined"
    const scoreNum = document.getElementById('homeScoreNumber');
    const scoreBadge = document.getElementById('homeScoreBadge');
    const scoreDesc = document.getElementById('homeScoreDesc');
    const lastScanDate = document.getElementById('homeLastScanDate');
    const summaryTitle = document.getElementById('homeSummaryTitle');

    if (scoreNum) scoreNum.textContent = '—';
    if (scoreBadge) scoreBadge.textContent = 'BELUM DIPERIKSA';
    if (summaryTitle) summaryTitle.textContent = 'Mulai Periksa Gigi Anak';
    if (scoreDesc) scoreDesc.textContent = 'Tekan tombol di bawah untuk memulai pemindaian gigi anak menggunakan AI.';
    if (lastScanDate) lastScanDate.textContent = 'Belum pernah';
  }
}

/**
 * Screen Navigation & Bottom Bar Switcher
 */
function initAppNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.dataset.screen;
      if (targetScreen) {
        // Check if profile exists before going to scan
        if (targetScreen === 'screen-scan' && childProfiles.length === 0) {
          showToast('Silakan tambahkan profil anak terlebih dahulu.', 'warning');
          switchScreen('screen-setup');
          return;
        }
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
      if (childProfiles.length === 0) {
        switchScreen('screen-setup');
        return;
      }
      switchScreen('screen-scan');
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
      showToast('Data skrining gigi anak telah tersimpan ke Rekam Jejak Digital.', 'success');
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
 * Add New Screening Result to History (persisted to localStorage)
 */
function addScreeningToHistory(caseData) {
  if (!activeChild) return;

  const now = new Date();
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  let dotColor = '#10b981';
  if (caseData.riskLevel === 'medium') dotColor = '#f59e0b';
  if (caseData.riskLevel === 'high') dotColor = '#ef4444';

  const newRecord = {
    id: `rec-${Date.now()}`,
    childId: activeChild.id,
    childName: activeChild.name,
    date: formattedDate,
    score: caseData.score,
    riskLevel: caseData.riskLevel,
    badgeText: caseData.badgeText,
    summary: caseData.summary,
    color: dotColor
  };

  screeningHistory.unshift(newRecord);
  saveHistory(screeningHistory);
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
  const summaryTitle = document.getElementById('homeSummaryTitle');

  if (scoreNum) scoreNum.textContent = latestData.score;
  if (scoreBadge) scoreBadge.textContent = (latestData.badgeText || '').toUpperCase();
  if (summaryTitle) {
    if (latestData.riskLevel === 'low') {
      summaryTitle.textContent = 'Kondisi Gigi Sehat';
    } else if (latestData.riskLevel === 'high') {
      summaryTitle.textContent = 'Ditemukan Karies / Lubang Gigi';
    } else {
      summaryTitle.textContent = 'Kondisi Gigi Perlu Perhatian';
    }
  }
  if (scoreDesc) scoreDesc.textContent = latestData.summary;
  if (lastScanDate) lastScanDate.textContent = latestData.date || 'Hari ini';
}

/**
 * Render History Screen Timeline (from localStorage)
 */
function renderHistoryTimeline() {
  const container = document.getElementById('timelineHistoryList');
  const emptyMsg = document.getElementById('emptyHistoryMsg');
  const countBadge = document.getElementById('historyCountBadge');
  if (!container) return;

  // Filter to active child if exists
  const filtered = activeChild 
    ? screeningHistory.filter(h => h.childId === activeChild.id)
    : screeningHistory;

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Data`;
  }

  // Remove all timeline items (keep empty message)
  container.querySelectorAll('.timeline-item').forEach(el => el.remove());

  if (filtered.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';

  filtered.forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-left">
        <div class="timeline-status-dot" style="background: ${item.color};"></div>
        <div class="timeline-info">
          <h4>${sanitizeHTML(item.badgeText)} (Skor ${item.score}/100)</h4>
          <p>${sanitizeHTML(item.date)} • ${sanitizeHTML(item.childName || '')} • ${sanitizeHTML(item.summary)}</p>
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

  // Child Profile Switcher (click on profile badge)
  const userProfileBadge = document.getElementById('userProfileBadge');
  if (userProfileBadge) {
    userProfileBadge.addEventListener('click', () => {
      if (childProfiles.length <= 1) {
        // Only one or no profiles, go to setup
        if (childProfiles.length === 0) {
          switchScreen('screen-setup');
        }
        return;
      }
      showProfileSwitcherModal();
    });
  }

  // Profile Switcher Modal
  const btnCloseSwitcher = document.getElementById('btnCloseSwitcher');
  const modalSwitcher = document.getElementById('modalProfileSwitcher');
  const btnSwitcherAddNew = document.getElementById('btnSwitcherAddNew');

  if (btnCloseSwitcher && modalSwitcher) {
    btnCloseSwitcher.addEventListener('click', () => {
      modalSwitcher.classList.remove('active');
    });
  }

  if (btnSwitcherAddNew) {
    btnSwitcherAddNew.addEventListener('click', () => {
      if (modalSwitcher) modalSwitcher.classList.remove('active');
      switchScreen('screen-setup');
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
 * Show Profile Switcher Modal
 */
function showProfileSwitcherModal() {
  const modal = document.getElementById('modalProfileSwitcher');
  const listEl = document.getElementById('profileSwitcherList');
  if (!modal || !listEl) return;

  listEl.innerHTML = '';
  childProfiles.forEach(child => {
    const btn = document.createElement('button');
    btn.className = 'profile-switcher-item' + (activeChild && activeChild.id === child.id ? ' active-profile' : '');
    btn.innerHTML = `
      <div class="avatar-bubble">${sanitizeHTML(child.avatar)}</div>
      <div>
        <strong>${sanitizeHTML(child.name)}</strong>
        <span style="display:block; font-size:0.72rem; color:var(--text-muted);">${sanitizeHTML(child.age)} • ${sanitizeHTML(child.gender)}</span>
      </div>
    `;
    btn.addEventListener('click', () => {
      activeChild = child;
      saveActiveProfileId(child.id);
      updateHomeUI();
      renderHistoryTimeline();
      modal.classList.remove('active');
    });
    listEl.appendChild(btn);
  });

  modal.classList.add('active');
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
  if (ticketPatientEl) {
    ticketPatientEl.textContent = activeChild
      ? `${activeChild.name} (${activeChild.age})`
      : '—';
  }

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
