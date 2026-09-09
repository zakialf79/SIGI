/**
 * SIGI-AI Interactive 2-Minute Toothbrushing Coach
 * Guides children through the 4 oral quadrants with countdown and audio cues.
 */

const TOTAL_SECONDS = 120; // 2 minutes recommended by WHO / PDGI
let timerSeconds = TOTAL_SECONDS;
let timerInterval = null;
let isTimerRunning = false;

const QUADRANTS = [
  { start: 120, end: 90, label: 'Gigi Depan (Atas & Bawah)', desc: 'Gerakan memutar lembut dari gusi ke arah gigi' },
  { start: 90, end: 60, label: 'Sisi Luar Kanan (Molar)', desc: 'Sikat perlahan bagian pengunyahan samping kanan' },
  { start: 60, end: 30, label: 'Sisi Luar Kiri (Molar)', desc: 'Sikat perlahan bagian pengunyahan samping kiri' },
  { start: 30, end: 0, label: 'Bagian Dalam & Lidah', desc: 'Bersihkan permukaan dalam gigi dan sikat lidah perlahan' }
];

function initToothbrushingTimer() {
  const toggleBtn = document.getElementById('btnTimerToggle');
  const resetBtn = document.getElementById('btnTimerReset');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTimer);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }

  updateTimerUI();
}

function toggleTimer() {
  if (isTimerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (timerSeconds <= 0) {
    timerSeconds = TOTAL_SECONDS;
  }
  isTimerRunning = true;
  const toggleBtn = document.getElementById('btnTimerToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
      Jeda
    `;
    toggleBtn.style.background = '#e11d48';
  }

  playQuadrantBeep(600); // Beep start

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerUI();

    // Quadrant transition sound
    if (timerSeconds === 90 || timerSeconds === 60 || timerSeconds === 30) {
      playQuadrantBeep(800);
    }

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      playFinishChime();
      alert('Hore! Selesai menyikat gigi 2 menit! Gigi adik Ahmad bersih dan terlindungi dari kuman! ⭐');
      resetTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  const toggleBtn = document.getElementById('btnTimerToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      Lanjutkan
    `;
    toggleBtn.style.background = 'var(--primary)';
  }
}

function resetTimer() {
  pauseTimer();
  timerSeconds = TOTAL_SECONDS;
  const toggleBtn = document.getElementById('btnTimerToggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      Mulai Sikat Gigi
    `;
    toggleBtn.style.background = 'var(--primary)';
  }
  updateTimerUI();
}

function updateTimerUI() {
  const display = document.getElementById('timerCountdown');
  const stepLabel = document.getElementById('timerStepLabel');
  const quadLabel = document.getElementById('quadrantDesc');
  const ring = document.getElementById('timerProgressRing');

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  if (display) {
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Update ring progress (Circumference 2 * PI * 85 = ~534)
  if (ring) {
    const totalRing = 534;
    const offset = totalRing - (timerSeconds / TOTAL_SECONDS) * totalRing;
    ring.style.strokeDashoffset = offset;
  }

  // Identify active quadrant
  const currentQuad = QUADRANTS.find(q => timerSeconds > q.end && timerSeconds <= q.start) || QUADRANTS[0];
  if (stepLabel) stepLabel.textContent = currentQuad.label;
  if (quadLabel) quadLabel.textContent = currentQuad.desc;
}

function playQuadrantBeep(freq = 600) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {}
}

function playFinishChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch (e) {}
}
