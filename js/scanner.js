/**
 * SIGI-AI Scanner & AI Computer Vision Simulation Engine
 * Handles image acquisition, preset clinical cases, bounding box detections, and risk evaluation.
 */

const CLINICAL_CASES = {
  case1: {
    id: 'case1',
    title: 'Kasus 1: Gigi Susu Sehat',
    badgeText: 'Risiko Rendah',
    riskLevel: 'low',
    score: 96,
    imageSrc: 'assets/case1_healthy.svg',
    summary: 'Rongga mulut dan email gigi dalam kondisi sangat baik tanpa tanda lesi aktif.',
    confidence: '98.2%',
    findings: [
      {
        title: 'Email Gigi Intak & Bersih',
        desc: 'Tidak ditemukan lesi demineralisasi (white spot) pada gigi seri maupun molar susu.',
        type: 'safe'
      },
      {
        title: 'Gingiva Sehat (Merah Muda)',
        desc: 'Tepian gusi tidak menunjukkan tanda pembengkakan, perdarahan, maupun eritema.',
        type: 'safe'
      },
      {
        title: 'Kebersihan Mulut Optimal',
        desc: 'Akumulasi plak minimal dan tidak terdapat kalkulus supragingiva.',
        type: 'safe'
      }
    ],
    recommendations: [
      'Lanjutkan menyikat gigi 2x sehari (pagi setelah sarapan & malam sebelum tidur).',
      'Gunakan pasta gigi berfluoride seukuran biji beras/kacang polong.',
      'Jadwalkan pemeriksaan gigi berkala setiap 6 bulan sekali di Posyandu/Puskesmas.'
    ],
    deftIndex: { d: 0, e: 0, f: 0, total: 0, status: 'Bebas Karies (WHO Level 0)' },
    odontogram: {}, // all healthy by default
    boundingBoxes: [
      { x: 38, y: 32, w: 24, h: 22, label: 'Email Sehat (98%)', type: 'safe' },
      { x: 26, y: 35, w: 14, h: 18, label: 'Gingiva Normal (96%)', type: 'safe' }
    ]
  },
  case2: {
    id: 'case2',
    title: 'Kasus 2: Plak Servikal & Karies Dini',
    badgeText: 'Risiko Sedang',
    riskLevel: 'medium',
    score: 72,
    imageSrc: 'assets/case2_plaque.svg',
    summary: 'Terdeteksi akumulasi plak di leher gigi dan lesi demineralisasi awal (white spot lesion).',
    confidence: '92.6%',
    findings: [
      {
        title: 'Demineralisasi Enamel Dini (White Spot)',
        desc: 'Tanda awal karies pada interdental gigi seri atas (gigi 51 & 61). Belum terjadi kavitas terbuka.',
        type: 'warning'
      },
      {
        title: 'Akumulasi Plak Servikal',
        desc: 'Lapisan biofim kekuningan di dekat batas gusi gigi seri atas dan bawah.',
        type: 'warning'
      },
      {
        title: 'Gingivitis Ringan',
        desc: 'Tepi gusi tampak sedikit kemerahan akibat iritasi plak bakteri.',
        type: 'warning'
      }
    ],
    recommendations: [
      'Tingkatkan teknik sikat gigi dengan gerakan melingkar lembut di garis batas gusi.',
      'Aplikasikan pasta gigi berfluoride minimal 1000 ppm secara teratur untuk remineralisasi email.',
      'Kurangi konsumsi camilan manis lengket dan susu botol menjelang tidur.',
      'Konsultasikan ke Puskesmas/Dokter Gigi dalam 14 hari untuk pertimbangan aplikasi Topical Fluoride Varnish.'
    ],
    deftIndex: { d: 1, e: 0, f: 0, total: 1, status: 'Karies Dini (WHO Kategori Rendah)' },
    odontogram: {
      '51': { status: 'warning', note: 'Karies Dini (Demineralisasi Email)' },
      '61': { status: 'warning', note: 'Bercak Putih Interdental' }
    },
    boundingBoxes: [
      { x: 44, y: 36, w: 14, h: 12, label: 'Karies Dini Interdental (92%)', type: 'warning' },
      { x: 38, y: 31, w: 22, h: 8, label: 'Biofilm Plak Servikal (94%)', type: 'warning' }
    ]
  },
  case3: {
    id: 'case3',
    title: 'Kasus 3: Karies Gigi Berlubang & Gingivitis',
    badgeText: 'Risiko Tinggi',
    riskLevel: 'high',
    score: 41,
    imageSrc: 'assets/case3_caries.svg',
    summary: 'Ditemukan kavitas karies aktif pada email & dentin serta pembengkakan pada gusi sekitar.',
    confidence: '95.8%',
    findings: [
      {
        title: 'Karies Kavitas Aktif (Gigi Berlubang)',
        desc: 'Lesi karies terbuka dengan kerusakan dentin pada gigi seri atas (51) dan gigi molar sulung (54).',
        type: 'danger'
      },
      {
        title: 'Gingivitis Marginalis Akut',
        desc: 'Gusi sekitar leher gigi berwarna merah terang dan bengkak (risiko infeksi pulpa).',
        type: 'danger'
      },
      {
        title: 'Potensi Nyeri & Gangguan Makan',
        desc: 'Kavitas yang dibiarkan berisiko menyebabkan abses dan menurunkan asupan nutrisi anak.',
        type: 'danger'
      }
    ],
    recommendations: [
      'SEGERA rujuk anak ke Puskesmas / RSGM terdekat dalam waktu 3-7 hari untuk restorasi/penambalan gigi.',
      'Hindari memberikan makanan/minuman terlalu dingin atau manis yang dapat memicu ngilu.',
      'Jangan mencongkel sisa makanan di lubang gigi dengan benda tajam.',
      'Gunakan tiket rujukan digital SIGI-AI untuk prioritas antrean poli gigi Puskesmas.'
    ],
    deftIndex: { d: 2, e: 0, f: 0, total: 2, status: 'Karies Kavitas Aktif (WHO Kategori Sedang)' },
    odontogram: {
      '51': { status: 'cavity', note: 'Karies Kavitas Oklusal & Palatal (Gigi Berlubang Aktif)' },
      '54': { status: 'cavity', note: 'Karies Enamel-Dentin Molar Sulung' }
    },
    boundingBoxes: [
      { x: 42, y: 35, w: 14, h: 16, label: 'Karies Kavitas Aktif 51 (96%)', type: 'danger' },
      { x: 67, y: 34, w: 13, h: 15, label: 'Karies Molar 54 (94%)', type: 'danger' },
      { x: 41, y: 30, w: 14, h: 7, label: 'Gingivitis Eritema (91%)', type: 'danger' }
    ]
  }
};

let currentSelectedCase = 'case2'; // Default to medium risk demonstration
let cameraStream = null;
let isCameraActive = false;

/**
 * Initialize scanner events and preset case buttons
 */
function initScanner() {
  const presetButtons = document.querySelectorAll('.btn-preset-case');
  const previewImg = document.getElementById('scannerPreviewImg');
  const videoStream = document.getElementById('scannerVideoStream');
  const shutterBtn = document.getElementById('btnShutter');
  const uploadInput = document.getElementById('scannerFileInput');
  const uploadBtn = document.getElementById('btnUploadTrigger');
  const toggleCameraBtn = document.getElementById('btnToggleLiveCamera');

  // Preset cases click handling
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const caseKey = btn.dataset.case;
      currentSelectedCase = caseKey;
      
      stopLiveCamera();
      if (CLINICAL_CASES[caseKey]) {
        previewImg.src = CLINICAL_CASES[caseKey].imageSrc;
        previewImg.style.display = 'block';
        videoStream.style.display = 'none';
      }
    });
  });

  // Trigger file upload from device
  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener('click', () => {
      uploadInput.click();
    });

    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        stopLiveCamera();
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
          previewImg.style.display = 'block';
          videoStream.style.display = 'none';

          // Analisis citra kustom secara dinamis berbasis Canvas piksel
          analyzeCustomUploadedImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Toggle Live Webcam / Phone Camera
  if (toggleCameraBtn) {
    toggleCameraBtn.addEventListener('click', () => {
      if (isCameraActive) {
        stopLiveCamera();
      } else {
        startLiveCamera();
      }
    });
  }

  // Shutter action (starts simulated AI deep learning inference)
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      runAIScanSimulation();
    });
  }
}

/**
 * Start Live Smartphone/Webcam Video Stream
 */
async function startLiveCamera() {
  const videoStream = document.getElementById('scannerVideoStream');
  const previewImg = document.getElementById('scannerPreviewImg');
  const toggleCameraBtn = document.getElementById('btnToggleLiveCamera');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
    });
    cameraStream = stream;
    videoStream.srcObject = stream;
    videoStream.play();
    videoStream.style.display = 'block';
    previewImg.style.display = 'none';
    isCameraActive = true;
    if (toggleCameraBtn) toggleCameraBtn.style.color = 'var(--primary)';
  } catch (err) {
    console.warn('Camera access not granted or not available, using high-res clinical simulation:', err);
    alert('Kamera fisik tidak terdeteksi atau izin belum diberikan. Prototipe otomatis beralih ke Mode Simulasi Citra Klinis.');
    stopLiveCamera();
  }
}

/**
 * Stop Live Camera Stream
 */
function stopLiveCamera() {
  const videoStream = document.getElementById('scannerVideoStream');
  const previewImg = document.getElementById('scannerPreviewImg');
  const toggleCameraBtn = document.getElementById('btnToggleLiveCamera');

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  isCameraActive = false;
  if (videoStream) {
    videoStream.style.display = 'none';
    videoStream.srcObject = null;
  }
  if (previewImg) previewImg.style.display = 'block';
  if (toggleCameraBtn) toggleCameraBtn.style.color = 'var(--text-muted)';
}

/**
 * Execute AI Scanner Simulation & Animate Radar Beam
 */
function runAIScanSimulation() {
  const beam = document.getElementById('scannerBeam');
  const shutterBtn = document.getElementById('btnShutter');
  
  // Disable shutter while scanning
  shutterBtn.disabled = true;
  shutterBtn.style.opacity = '0.5';
  beam.classList.add('scanning');

  // Play scanner sound tone if audio is allowed
  playScanningAudioTone();

  // Simulate inference latency (1.6 seconds - realistic edge AI latency)
  setTimeout(() => {
    beam.classList.remove('scanning');
    shutterBtn.disabled = false;
    shutterBtn.style.opacity = '1';

    // Populate and switch to Result Screen
    populateAndShowResults(currentSelectedCase);
  }, 1600);
}

/**
 * Render Results Screen with Bounding Boxes and Triaging
 */
function populateAndShowResults(caseKey) {
  const caseData = CLINICAL_CASES[caseKey] || CLINICAL_CASES.case2;
  
  // Set images and result header
  const resultCard = document.getElementById('resultHeaderCard');
  const riskBadge = document.getElementById('resultRiskBadge');
  const riskTitle = document.getElementById('resultRiskTitle');
  const riskSub = document.getElementById('resultRiskSub');
  const aiImg = document.getElementById('aiResultImg');
  const bboxContainer = document.getElementById('boundingBoxContainer');
  const findingsList = document.getElementById('aiFindingsList');
  const recList = document.getElementById('aiRecommendationsList');
  const confidenceBadge = document.getElementById('aiConfidenceBadge');

  // Clear previous bounding boxes
  bboxContainer.innerHTML = '';

  // Update classes for risk color
  resultCard.className = `result-header-card ${caseData.riskLevel}`;
  riskTitle.textContent = caseData.badgeText.toUpperCase();
  riskSub.textContent = caseData.summary;
  confidenceBadge.textContent = `Akurasi AI: ${caseData.confidence}`;

  if (caseData.riskLevel === 'low') {
    riskBadge.textContent = '🟢';
  } else if (caseData.riskLevel === 'medium') {
    riskBadge.textContent = '🟡';
  } else {
    riskBadge.textContent = '🔴';
  }

  aiImg.src = caseData.imageSrc;

  // Render Bounding Boxes
  caseData.boundingBoxes.forEach(box => {
    const boxEl = document.createElement('div');
    boxEl.className = `bounding-box ${box.type}`;
    boxEl.style.left = `${box.x}%`;
    boxEl.style.top = `${box.y}%`;
    boxEl.style.width = `${box.w}%`;
    boxEl.style.height = `${box.h}%`;

    const tagEl = document.createElement('div');
    tagEl.className = 'box-tag';
    tagEl.textContent = box.label;
    boxEl.appendChild(tagEl);

    bboxContainer.appendChild(boxEl);
  });

  // Render Diagnostic Findings
  findingsList.innerHTML = '';
  caseData.findings.forEach(f => {
    const item = document.createElement('div');
    item.className = 'finding-item';
    
    let dotColor = '#10b981';
    if (f.type === 'warning') dotColor = '#f59e0b';
    if (f.type === 'danger') dotColor = '#ef4444';

    item.innerHTML = `
      <div class="finding-bullet" style="background: ${dotColor};"></div>
      <div class="finding-content">
        <h4>${f.title}</h4>
        <p>${f.desc}</p>
      </div>
    `;
    findingsList.appendChild(item);
  });

  // Render Clinical Recommendations
  recList.innerHTML = '';
  caseData.recommendations.forEach(r => {
    const li = document.createElement('li');
    li.style.marginBottom = '6px';
    li.style.fontSize = '0.78rem';
    li.style.lineHeight = '1.4';
    li.textContent = r;
    recList.appendChild(li);
  });

  // Render def-t Index (WHO Clinical Dental Standard)
  renderDeftIndex(caseData.deftIndex);

  // Render Interactive Pediatric Odontogram (FDI 2-Digit Notation)
  renderOdontogram(caseData.odontogram);

  // Reset view mode switcher to Bounding Box
  initViewModeSwitcher();

  // Auto-record to history
  if (window.addScreeningToHistory) {
    window.addScreeningToHistory(caseData);
  }

  // Switch screen to Result Screen
  if (window.switchScreen) {
    window.switchScreen('screen-result');
  }
}

/**
 * Render WHO def-t Index Card
 */
function renderDeftIndex(deft) {
  const deftValEl = document.getElementById('deftScoreValue');
  const dEl = document.getElementById('deftDVal');
  const eEl = document.getElementById('deftEVal');
  const fEl = document.getElementById('deftFVal');
  const statusEl = document.getElementById('deftStatusBadge');

  if (deftValEl) deftValEl.textContent = deft.total;
  if (dEl) dEl.textContent = deft.d;
  if (eEl) eEl.textContent = deft.e;
  if (fEl) fEl.textContent = deft.f;
  if (statusEl) statusEl.textContent = deft.status;
}

/**
 * Render 20 Deciduous Teeth Interactive Odontogram
 */
function renderOdontogram(toothStatusMap = {}) {
  const upperArchEl = document.getElementById('odontogramUpperArch');
  const lowerArchEl = document.getElementById('odontogramLowerArch');
  const detailBanner = document.getElementById('toothDetailBanner');

  if (!upperArchEl || !lowerArchEl) return;

  // FDI Two-digit notation for primary/deciduous teeth:
  // Upper: 55 54 53 52 51 | 61 62 63 64 65
  // Lower: 85 84 83 82 81 | 71 72 73 74 75
  const upperTeeth = ['55', '54', '53', '52', '51', '61', '62', '63', '64', '65'];
  const lowerTeeth = ['85', '84', '83', '82', '81', '71', '72', '73', '74', '75'];

  const toothNames = {
    '55': 'Molar 2 Kanan Atas', '54': 'Molar 1 Kanan Atas', '53': 'Taring Kanan Atas', '52': 'Seri Lateral Kanan Atas', '51': 'Seri Sentral Kanan Atas',
    '61': 'Seri Sentral Kiri Atas', '62': 'Seri Lateral Kiri Atas', '63': 'Taring Kiri Atas', '64': 'Molar 1 Kiri Atas', '65': 'Molar 2 Kiri Atas',
    '85': 'Molar 2 Kanan Bawah', '84': 'Molar 1 Kanan Bawah', '83': 'Taring Kanan Bawah', '82': 'Seri Lateral Kanan Bawah', '81': 'Seri Sentral Kanan Bawah',
    '71': 'Seri Sentral Kiri Bawah', '72': 'Seri Lateral Kiri Bawah', '73': 'Taring Kiri Bawah', '74': 'Molar 1 Kiri Bawah', '75': 'Molar 2 Kiri Bawah'
  };

  const createToothEl = (num) => {
    const el = document.createElement('div');
    const info = toothStatusMap[num] || { status: 'healthy', note: 'Email Intak, Bebas Karies' };
    el.className = `tooth-item ${info.status}`;
    el.dataset.tooth = num;
    
    let icon = '🦷';
    if (info.status === 'warning') icon = '⚠️';
    if (info.status === 'cavity') icon = '🚨';

    el.innerHTML = `
      <span class="tooth-icon-mini">${icon}</span>
      <span>${num}</span>
    `;

    el.addEventListener('click', () => {
      document.querySelectorAll('.tooth-item').forEach(t => t.classList.remove('selected'));
      el.classList.add('selected');
      if (detailBanner) {
        detailBanner.innerHTML = `
          <div>
            <strong>Gigi ${num} (${toothNames[num] || 'Gigi Susu'}):</strong> 
            <span style="color: ${info.status === 'cavity' ? '#dc2626' : info.status === 'warning' ? '#d97706' : '#059669'}; font-weight: 700;">
              ${info.note}
            </span>
          </div>
        `;
      }
    });

    return el;
  };

  upperArchEl.innerHTML = '';
  lowerArchEl.innerHTML = '';

  upperTeeth.forEach(t => upperArchEl.appendChild(createToothEl(t)));
  lowerTeeth.forEach(t => lowerArchEl.appendChild(createToothEl(t)));

  // Initial select on first abnormal tooth or central incisor
  const firstAbnormal = Object.keys(toothStatusMap)[0] || '51';
  const targetToothEl = document.querySelector(`.tooth-item[data-tooth="${firstAbnormal}"]`);
  if (targetToothEl) targetToothEl.click();
}

/**
 * Initialize View Mode Switcher (BBox vs Heatmap Grad-CAM vs Original)
 */
function initViewModeSwitcher() {
  const btnBBox = document.getElementById('btnModeBBox');
  const btnHeatmap = document.getElementById('btnModeHeatmap');
  const btnOriginal = document.getElementById('btnModeOriginal');
  const bboxContainer = document.getElementById('boundingBoxContainer');
  const heatmapOverlay = document.getElementById('aiHeatmapOverlay');

  const setMode = (mode) => {
    [btnBBox, btnHeatmap, btnOriginal].forEach(b => b && b.classList.remove('active'));
    if (mode === 'bbox') {
      if (btnBBox) btnBBox.classList.add('active');
      if (bboxContainer) bboxContainer.style.display = 'block';
      if (heatmapOverlay) heatmapOverlay.classList.remove('active');
    } else if (mode === 'heatmap') {
      if (btnHeatmap) btnHeatmap.classList.add('active');
      if (bboxContainer) bboxContainer.style.display = 'none';
      if (heatmapOverlay) heatmapOverlay.classList.add('active');
    } else {
      if (btnOriginal) btnOriginal.classList.add('active');
      if (bboxContainer) bboxContainer.style.display = 'none';
      if (heatmapOverlay) heatmapOverlay.classList.remove('active');
    }
  };

  if (btnBBox) btnBBox.onclick = () => setMode('bbox');
  if (btnHeatmap) btnHeatmap.onclick = () => setMode('heatmap');
  if (btnOriginal) btnOriginal.onclick = () => setMode('original');

  // Default to Bounding Box
  setMode('bbox');
}

/**
 * Subtle sound effect for AI scanning using Web Audio API
 */
function playScanningAudioTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Audio context may be restricted by browser policy
  }
}

/**
 * Real-time Dynamic Image Processing via Canvas for Custom Uploads
 * Computes luminance, red-inflammation ratio, and dark-spot cavitation
 */
function analyzeCustomUploadedImage(imgDataUrl) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 120;
    ctx.drawImage(img, 0, 0, 120, 120);

    const imgData = ctx.getImageData(0, 0, 120, 120);
    const data = imgData.data;
    let darkPixels = 0;
    let redInflamedPixels = 0;
    let totalSamples = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Dark cavity threshold
      if (luminance < 60) {
        darkPixels++;
      }
      // Red/Gingival inflammation threshold
      if (r > 160 && r > g * 1.4 && r > b * 1.4) {
        redInflamedPixels++;
      }
    }

    const darkRatio = (darkPixels / totalSamples) * 100;
    const redRatio = (redInflamedPixels / totalSamples) * 100;

    let computedCase;
    if (darkRatio > 5.0 || redRatio > 8.0) {
      computedCase = 'case3'; // High risk
    } else if (darkRatio > 1.5 || redRatio > 3.0) {
      computedCase = 'case2'; // Medium risk
    } else {
      computedCase = 'case1'; // Low risk
    }

    currentSelectedCase = computedCase;
    console.log(`Dynamic Image Analysis: DarkRatio=${darkRatio.toFixed(1)}%, RedRatio=${redRatio.toFixed(1)}% => Classified as ${computedCase}`);
  };
  img.src = imgDataUrl;
}
