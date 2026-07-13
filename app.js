'use strict';

// ── CONFIG ──────────────────────────────────────────────────────────────────

const TASKS = [
  { id: 'members',    label: 'Mitglieder einpflegen',  img: 'images/tasks/members.png',    type: 'count', pts: 10, perItem: 2 },
  { id: 'invoices',   label: 'Rechnungen schreiben',   img: 'images/tasks/invoices.png',   type: 'count', pts: 10, perItem: 5 },
  { id: 'mails',      label: 'Mails beantworten',      img: 'images/tasks/mails.png',      type: 'check', pts: 10 },
  { id: 'post',       label: 'Post & Briefe',           img: 'images/tasks/post.png',       type: 'check', pts: 10 },
  { id: 'receipts',   label: 'Belege scannen',          img: 'images/tasks/receipts.png',   type: 'check', pts: 10 },
  { id: 'skool_msg',  label: 'Skool Nachrichten',       img: 'images/tasks/skool_msg.png',  type: 'check', pts: 10 },
  { id: 'instagram',  label: 'Instagram Post',           img: 'images/tasks/instagram.png',  type: 'check', pts: 20 },
  { id: 'meditation', label: 'Meditation',                img: 'images/tasks/meditation.png', type: 'check', pts: 15 },
  { id: 'fotos',      label: 'Fotos sortieren',           img: 'images/tasks/fotos.png',      type: 'check', pts: 10 },
  { id: 'staff',      label: 'Freestyle Staff',          img: 'images/tasks/staff.png',      type: 'minutes', pts: 0, perMin: 1 },
  { id: 'lesen',      label: 'Lesen',                    img: 'images/tasks/lesen.png',      type: 'minutes', pts: 0, perMin: 1 },
  { id: 'course1',    label: 'Kurs 2–4 Jahre planen',   img: 'images/tasks/course1.png',    type: 'check', pts: 15, weekly: true },
  { id: 'course2',    label: 'Kurs 5–10 Jahre planen',  img: 'images/tasks/course2.png',    type: 'check', pts: 15, weekly: true },
  { id: 'course3',    label: 'Kurs 11–14 Jahre planen', img: 'images/tasks/course3.png',    type: 'check', pts: 15, weekly: true },
  { id: 'skool_up',   label: 'Skool hochladen',          img: 'images/tasks/skool_up.png',   type: 'check', pts: 10, weekly: true },
  { id: 'newsletter', label: 'Newsletter schreiben',    img: 'images/tasks/newsletter.png', type: 'check', pts: 20, weekly: true },
];

const SLEEP_TASK = { id: 'sleep', label: 'Schlafenszeit', img: 'images/tasks/sleep.png', type: 'sleep', pts: 0 };

// Monatliche Aufgaben — einmal pro Monat zu erledigen
const MONTHLY_TASKS = [
  { id: 'gehalt',    label: 'Gehalt zahlen',           img: 'images/tasks/gehalt.png',    type: 'check', pts: 30, hint: 'Anfang des Monats' },
  { id: 'geld1',     label: 'Geld anweisen (Anfang)',  img: 'images/tasks/geld1.png',     type: 'check', pts: 20, hint: 'Anfang des Monats' },
  { id: 'geld2',     label: 'Geld anweisen (Mitte)',   img: 'images/tasks/geld2.png',     type: 'check', pts: 20, hint: 'Um den 13.' },
  { id: 'vorsteuer', label: 'Vorsteuer fertig machen', img: 'images/tasks/vorsteuer.png', type: 'check', pts: 30, hint: 'Um den 13.' },
];
const SLEEP_OPTIONS = [
  { val: 22, label: '🌙 22 Uhr',           pts: 60 },
  { val: 23, label: '🌙 23 Uhr',           pts: 40 },
  { val: 24, label: '🕛 Mitternacht',       pts: 20 },
  { val: 99, label: '😴 Nach Mitternacht', pts: 0  },
];

const BONUS_TASKS = [
  { id: 'walk',  label: 'Spazieren gehen', img: 'images/tasks/walk.png',  pts: 15 },
  { id: 'dance', label: 'Tanzen',           img: 'images/tasks/dance.png', pts: 20 },
];

const AVATAR_LEVELS = [
  { min: 0,    img: 'images/avatars/avatar1.png', rank: 'Stufe 1', name: 'Auszubildende', color: '#aaa' },
  { min: 200,  img: 'images/avatars/avatar2.png', rank: 'Stufe 2', name: 'Lehrling',      color: '#cd7f32' },
  { min: 500,  img: 'images/avatars/avatar3.png', rank: 'Stufe 3', name: 'Profi',         color: '#a8a9ad' },
  { min: 1000, img: 'images/avatars/avatar4.png', rank: 'Stufe 4', name: 'Heldin',        color: '#ffd700' },
  { min: 2000, img: 'images/avatars/avatar5.png', rank: 'Stufe 5', name: 'Superheldin',   color: '#6c63ff' },
];

const REWARDS = [
  { pct: 30,  label: '30 Min YouTube',  icon: '🎬' },
  { pct: 60,  label: '+30 Min YouTube', icon: '🎬' },
  { pct: 100, label: '+1 Std YouTube',  icon: '🏆' },
];

// ── STATE ────────────────────────────────────────────────────────────────────

// Lokale Datumsformatierung (keine UTC-Verschiebung)
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayKey() {
  return localDateStr(new Date());
}

function weekKey() {
  const d = new Date();
  const dow = d.getDay(); // 0=So, 1=Mo, ..., 6=Sa
  // Zurück zum letzten Montag (oder heute wenn Montag)
  const diff = (dow === 0) ? 6 : dow - 1;
  d.setDate(d.getDate() - diff);
  return localDateStr(d);
}

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function loadState() {
  try { return JSON.parse(localStorage.getItem('starkState') || '{}'); } catch { return {}; }
}

function saveState() {
  localStorage.setItem('starkState', JSON.stringify(state));
}

function ensureToday() {
  const key = todayKey();
  const wk = weekKey();
  if (!state.days) state.days = {};
  if (!state.days[key]) {
    state.days[key] = { tasks: {}, bonus: {}, pts: 0 };
  }
  if (!state.weeks) state.weeks = {};
  if (!state.weeks[wk]) state.weeks[wk] = { tasks: {} };
  const mk = monthKey();
  if (!state.months) state.months = {};
  if (!state.months[mk]) state.months[mk] = { tasks: {} };
  state.today = key;
  state.week = wk;
  state.month = mk;
}

let state = loadState();
if (!state.totalPts) state.totalPts = 0;
if (!state.streak) state.streak = 0;
if (!state.lastStreakDate) state.lastStreakDate = null;
if (state.selectedAvatarIdx === undefined) state.selectedAvatarIdx = null; // null = auto (höchste freigeschaltete)
ensureToday();

// ── HELPERS ──────────────────────────────────────────────────────────────────

function getHighestUnlockedIdx(pts) {
  let idx = 0;
  for (let i = 0; i < AVATAR_LEVELS.length; i++) {
    if (pts >= AVATAR_LEVELS[i].min) idx = i;
  }
  return idx;
}

function getAvatar(pts) {
  // Wenn ein Avatar manuell gewählt wurde, diesen nehmen
  if (state.selectedAvatarIdx !== null && pts >= AVATAR_LEVELS[state.selectedAvatarIdx].min) {
    return AVATAR_LEVELS[state.selectedAvatarIdx];
  }
  return AVATAR_LEVELS[getHighestUnlockedIdx(pts)];
}

function selectAvatar(idx) {
  const pts = state.totalPts || 0;
  if (pts < AVATAR_LEVELS[idx].min) return; // gesperrt
  state.selectedAvatarIdx = idx;
  saveState();
  renderAll();
  showToast('✨ Avatar gewechselt: ' + AVATAR_LEVELS[idx].name);
}

function getNextLevel(pts) {
  for (const l of AVATAR_LEVELS) { if (pts < l.min) return l; }
  return null;
}

function calcDayPts() {
  const day = state.days[state.today];
  let earned = 0;
  let max = 0;
  for (const t of TASKS) {
    if (t.weekly) continue; // weekly tasks not in daily max
    max += t.pts;
    const done = day.tasks[t.id];
    if (done) {
      earned += t.pts;
      if (t.type === 'count' && done.count) earned += done.count * t.perItem;
      if (t.type === 'minutes' && done.minutes) earned += done.minutes * (t.perMin || 1);
    }
  }
  // bonus
  for (const b of BONUS_TASKS) {
    if (day.bonus[b.id]) earned += b.pts;
  }
  return { earned, max, pct: max > 0 ? Math.round((earned / max) * 100) : 0 };
}

function updateStreak() {
  const today = todayKey();
  const { pct } = calcDayPts();
  if (pct >= 80) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    if (state.lastStreakDate === yKey || state.lastStreakDate === today) {
      if (state.lastStreakDate !== today) {
        state.streak = (state.streak || 0) + 1;
        state.lastStreakDate = today;
      }
    } else {
      state.streak = 1;
      state.lastStreakDate = today;
    }
    saveState();
  }
}

// ── MODAL ────────────────────────────────────────────────────────────────────

let modalTask = null;
let modalCount = 0;
let selectedSleep = null;

function openModal(task) {
  modalTask = task;
  // Für additive Typen (count/minutes) immer mit 0 starten — wird addiert
  modalCount = 0;

  // Großes Bild oben im Modal
  const imgEl = document.getElementById('modal-big-img');
  const iconEl = document.getElementById('modal-icon');
  if (task.img) {
    imgEl.src = task.img;
    imgEl.style.display = 'block';
    iconEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    iconEl.style.display = 'block';
    iconEl.textContent = task.icon || '📋';
  }

  document.getElementById('modal-title').textContent = task.label;
  const existing = state.days[state.today]?.tasks[task.id];
  const alreadyCount = existing?.count || 0;
  const alreadyMins  = existing?.minutes || 0;
  document.getElementById('modal-subtitle').textContent =
    task.type === 'count'   ? (alreadyCount > 0 ? `Bereits heute: ${alreadyCount} Stk. — wie viele kommen noch dazu?` : 'Wie viele hast du heute erledigt?')
    : task.type === 'sleep' ? 'Wann gehst du heute schlafen?'
    : task.type === 'minutes' ? (alreadyMins > 0 ? `Bereits heute: ${alreadyMins} Min. — wie viele kommen noch dazu?` : 'Wie viele Minuten hast du heute gemacht?')
    : 'Hast du das heute gemacht?';

  document.getElementById('modal-count-row').style.display = (task.type === 'count' || task.type === 'minutes') ? 'flex' : 'none';
  document.getElementById('modal-check-row').style.display = task.type === 'check' ? 'block' : 'none';
  document.getElementById('modal-sleep-row').style.display = task.type === 'sleep' ? 'block' : 'none';
  // Minuten: max 99
  document.getElementById('modal-count-row').dataset.maxVal = task.type === 'minutes' ? '99' : '9999';
  selectedSleep = null;
  document.querySelectorAll('.sleep-btn').forEach(b => b.classList.remove('selected'));
  updateCountDisplay();
  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  modalTask = null;
  monthlyModalTask = null;
  bonusModalTask = null;
}

function updateCountDisplay() {
  document.getElementById('modal-count').textContent = modalCount;
}

function selectSleep(btn) {
  document.querySelectorAll('.sleep-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSleep = parseInt(btn.dataset.val);
}

function confirmModal() {
  if (!modalTask) return;
  if (modalTask.type === 'sleep' && selectedSleep === null) {
    showToast('⚠️ Bitte eine Uhrzeit auswählen!');
    return;
  }
  const day = state.days[state.today];
  const prev = day.tasks[modalTask.id] || {};

  let delta = prev.done ? 0 : modalTask.pts; // Basis-Punkte nur beim ersten Mal
  if (modalTask.type === 'count') {
    const newCount = (prev.count || 0) + modalCount;
    day.tasks[modalTask.id] = { done: true, count: newCount };
    delta += modalCount * modalTask.perItem;
  } else if (modalTask.type === 'minutes') {
    const newMins = (prev.minutes || 0) + modalCount;
    day.tasks[modalTask.id] = { done: true, minutes: newMins, count: newMins };
    delta = modalCount * (modalTask.perMin || 1);
  } else {
    day.tasks[modalTask.id] = { done: true, count: modalCount };
  }
  if (modalTask.type === 'sleep') {
    const opt = SLEEP_OPTIONS.find(o => o.val === selectedSleep);
    delta = opt ? opt.pts : 0;
    day.tasks[modalTask.id].sleepVal = selectedSleep;
    day.tasks[modalTask.id].sleepPts = delta;
  }
  state.totalPts = (state.totalPts || 0) + delta;

  // weekly tracking
  if (modalTask.weekly) {
    state.weeks[state.week].tasks[modalTask.id] = true;
  }

  updateStreak();
  saveState();
  closeModal();
  renderAll();
  showToast('✓ ' + modalTask.label + ' abgehakt!');
}

// ── MONTHLY MODAL ─────────────────────────────────────────────────────────────

let monthlyModalTask = null;

function openMonthlyModal(task) {
  monthlyModalTask = task;
  const imgEl = document.getElementById('modal-big-img');
  const iconEl = document.getElementById('modal-icon');
  if (task.img) {
    imgEl.src = task.img; imgEl.style.display = 'block'; iconEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none'; iconEl.style.display = 'block'; iconEl.textContent = task.icon || '📅';
  }
  document.getElementById('modal-title').textContent = task.label;
  document.getElementById('modal-subtitle').textContent = '📅 ' + task.hint + ' — erledigt?';
  document.getElementById('modal-count-row').style.display = 'none';
  document.getElementById('modal-check-row').style.display = 'block';
  document.getElementById('modal-sleep-row').style.display = 'none';
  document.getElementById('modal').classList.add('open');
}

function confirmMonthlyModal() {
  if (!monthlyModalTask) return;
  state.months[state.month].tasks[monthlyModalTask.id] = { done: true };
  state.totalPts = (state.totalPts || 0) + monthlyModalTask.pts;
  updateStreak(); saveState(); closeModal(); renderAll();
  showToast('✓ ' + monthlyModalTask.label + ' erledigt!');
  monthlyModalTask = null;
}

// ── BONUS ────────────────────────────────────────────────────────────────────

let bonusModalTask = null;

function openBonusModal(task) {
  bonusModalTask = task;
  const imgEl = document.getElementById('modal-big-img');
  const iconEl = document.getElementById('modal-icon');
  if (task.img) {
    imgEl.src = task.img; imgEl.style.display = 'block'; iconEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none'; iconEl.style.display = 'block'; iconEl.textContent = task.icon || '⭐';
  }
  document.getElementById('modal-title').textContent = task.label;
  document.getElementById('modal-subtitle').textContent = '🌟 +' + task.pts + ' Bonuspunkte — gemacht?';
  document.getElementById('modal-count-row').style.display = 'none';
  document.getElementById('modal-check-row').style.display = 'block';
  document.getElementById('modal-sleep-row').style.display = 'none';
  document.getElementById('modal').classList.add('open');
}

function confirmBonusModal() {
  if (!bonusModalTask) return;
  const day = state.days[state.today];
  day.bonus[bonusModalTask.id] = true;
  state.totalPts = (state.totalPts || 0) + bonusModalTask.pts;
  updateStreak(); saveState(); closeModal(); renderAll();
  showToast('🌟 Bonus: +' + bonusModalTask.pts + ' Punkte!');
  bonusModalTask = null;
}

// ── TOAST ────────────────────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── PERIOD ───────────────────────────────────────────────────────────────────

let currentPeriod = 'week';

function setPeriod(p) {
  currentPeriod = p;
  document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + p).classList.add('active');
  renderStats();
}

function getDaysForPeriod(period) {
  const all = Object.entries(state.days || {}).sort();
  const now = new Date();
  let cutoffKey;
  if (period === 'week') {
    // Montag der aktuellen Woche (deutsche Zeitzone = lokale Zeit)
    const dow = now.getDay(); // 0=So, 1=Mo, ..., 6=Sa
    const diff = (dow === 0) ? 6 : dow - 1;
    const mon = new Date(now);
    mon.setDate(now.getDate() - diff);
    cutoffKey = localDateStr(mon);
  } else if (period === 'month') {
    // 1. des aktuellen Monats
    cutoffKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  } else {
    // 1. Januar des aktuellen Jahres
    cutoffKey = `${now.getFullYear()}-01-01`;
  }
  return all.filter(([k]) => k >= cutoffKey);
}

function getPeriodLabel(period) {
  const now = new Date();
  if (period === 'week') {
    const dow = now.getDay();
    const diff = (dow === 0) ? 6 : dow - 1;
    const mon = new Date(now); mon.setDate(now.getDate() - diff);
    return `Diese Woche (ab ${mon.getDate()}.${mon.getMonth() + 1}.)`;
  }
  if (period === 'month') {
    const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
    return months[now.getMonth()] + ' ' + now.getFullYear();
  }
  return 'Jahr ' + now.getFullYear();
}

// ── RENDER ───────────────────────────────────────────────────────────────────

function renderAll() {
  renderHeader();
  renderProgress();
  renderTasks();
  renderStats();
  renderAvatarPage();
}

function renderHeader() {
  const av = getAvatar(state.totalPts || 0);
  const el = document.getElementById('hdr-emoji');
  el.innerHTML = `<img src="${av.img}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
  document.getElementById('hdr-rank').textContent = av.rank;
  document.getElementById('hdr-name').textContent = av.name;
  document.getElementById('hdr-pts').textContent = (state.totalPts || 0) + ' Gesamtpunkte';
  document.getElementById('hdr-streak').textContent = '🔥 ' + (state.streak || 0) + ' Tage';
}

function renderProgress() {
  const { earned, max, pct } = calcDayPts();
  document.getElementById('prog-pct').textContent = pct + '%';
  document.getElementById('prog-bar').style.width = pct + '%';

  const chips = document.querySelectorAll('.reward-chip');
  chips.forEach((chip, i) => {
    chip.classList.toggle('unlocked', pct >= REWARDS[i].pct);
  });

  // Großes Fortschrittsbild
  const rewardImg = document.getElementById('reward-img');
  let imgSrc = '';
  if (pct >= 100) imgSrc = 'images/rewards/erfolg3.png';
  else if (pct >= 60) imgSrc = 'images/rewards/erfolg2.png';
  else if (pct >= 30) imgSrc = 'images/rewards/erfolg1.png';

  if (imgSrc) {
    if (rewardImg.src !== imgSrc) rewardImg.src = imgSrc;
    rewardImg.style.display = 'block';
  } else {
    rewardImg.style.display = 'none';
  }
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const day = state.days[state.today];

  list.innerHTML = '';

  // Date label
  const dl = document.createElement('div');
  dl.className = 'date-label';
  const d = new Date();
  dl.textContent = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  list.appendChild(dl);

  // Section: Pflichtaufgaben
  const pt = document.createElement('div');
  pt.className = 'section-title';
  pt.textContent = 'Pflichtaufgaben';
  list.appendChild(pt);

  for (const t of TASKS.filter(x => !x.weekly)) {
    const done = day.tasks[t.id];
    const card = document.createElement('div');
    const isAdditive = t.type === 'count' || t.type === 'minutes';
    card.className = 'task-card' + (done ? ' done' : '');
    card.onclick = () => (done && !isAdditive) ? null : openModal(t);

    let sub = done
      ? (t.type === 'count' ? `✓ ${done.count} Stk. · + weitere hinzufügen` : t.type === 'minutes' ? `✓ ${done.minutes} Min. · + weitere hinzufügen` : '✓ Erledigt')
      : (t.type === 'count' ? 'Tippe zum Abhaken + Anzahl eingeben' : t.type === 'minutes' ? 'Tippe zum Eintragen (1–99 Min.)' : 'Tippe zum Abhaken');

    const iconHtml = t.img
      ? `<img src="${t.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;flex-shrink:0">`
      : `<div class="task-icon">${t.icon}</div>`;

    card.innerHTML = `
      ${iconHtml}
      <div class="task-info">
        <div class="task-label">${t.label}</div>
        <div class="task-sub">${sub}</div>
      </div>
      <div class="task-right">
        <div class="task-pts">+${t.pts} Pkt</div>
        <div class="task-check">${done ? '✓' : ''}</div>
      </div>`;
    list.appendChild(card);
  }

  // Section: Wöchentlich
  const wt = document.createElement('div');
  wt.className = 'section-title';
  wt.textContent = 'Wöchentlich';
  list.appendChild(wt);

  for (const t of TASKS.filter(x => x.weekly)) {
    const done = day.tasks[t.id] || state.weeks[state.week].tasks[t.id];
    const card = document.createElement('div');
    card.className = 'task-card' + (done ? ' done' : '');
    card.onclick = () => done ? null : openModal(t);

    const weeklyIconHtml = t.img
      ? `<img src="${t.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;flex-shrink:0">`
      : `<div class="task-icon">${t.icon}</div>`;
    card.innerHTML = `
      ${weeklyIconHtml}
      <div class="task-info">
        <div class="task-label">${t.label} <span class="weekly-tag">Woche</span></div>
        <div class="task-sub">${done ? '✓ Diese Woche erledigt' : 'Tippe zum Abhaken'}</div>
      </div>
      <div class="task-right">
        <div class="task-pts">+${t.pts} Pkt</div>
        <div class="task-check">${done ? '✓' : ''}</div>
      </div>`;
    list.appendChild(card);
  }

  // Section: Monatlich
  const mTitle = document.createElement('div');
  mTitle.className = 'section-title';
  mTitle.textContent = 'Monatlich';
  list.appendChild(mTitle);

  for (const t of MONTHLY_TASKS) {
    const done = state.months[state.month].tasks[t.id];
    const card = document.createElement('div');
    card.className = 'task-card' + (done ? ' done' : '');
    card.onclick = () => { if (!done) openMonthlyModal(t); };
    const monthIconHtml = t.img
      ? `<img src="${t.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;flex-shrink:0">`
      : `<div class="task-icon" style="background:rgba(255,101,132,0.1)">${t.icon||'📅'}</div>`;
    card.innerHTML = `
      ${monthIconHtml}
      <div class="task-info">
        <div class="task-label">${t.label}</div>
        <div class="task-sub">${done ? '✓ Diesen Monat erledigt' : '📅 ' + t.hint}</div>
      </div>
      <div class="task-right">
        <div class="task-pts" style="color:var(--accent2)">+${t.pts} Pkt</div>
        <div class="task-check">${done ? '✓' : ''}</div>
      </div>`;
    list.appendChild(card);
  }

  // Section: Schlafenszeit
  const st2 = document.createElement('div');
  st2.className = 'section-title';
  st2.textContent = 'Schlafenszeit';
  list.appendChild(st2);

  {
    const t = SLEEP_TASK;
    const done = day.tasks[t.id];
    const card = document.createElement('div');
    card.className = 'task-card' + (done ? ' done' : '');
    card.onclick = () => done ? null : openModal(t);
    let sleepLabel = '';
    if (done && done.sleepVal) {
      const opt = SLEEP_OPTIONS.find(o => o.val === done.sleepVal);
      sleepLabel = opt ? `✓ ${opt.label} · +${done.sleepPts} Pkt.` : '✓ Erledigt';
    }
    const sleepIconHtml = t.img
      ? `<img src="${t.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;flex-shrink:0">`
      : `<div class="task-icon">${t.icon}</div>`;
    card.innerHTML = `
      ${sleepIconHtml}
      <div class="task-info">
        <div class="task-label">${t.label}</div>
        <div class="task-sub">${done ? sleepLabel : 'Wann gehst du schlafen?'}</div>
      </div>
      <div class="task-right">
        <div class="task-pts">bis +60 Pkt</div>
        <div class="task-check">${done ? '✓' : ''}</div>
      </div>`;
    list.appendChild(card);
  }

  // Section: Bonus
  const bt = document.createElement('div');
  bt.className = 'section-title';
  bt.textContent = 'Bonus — Extra Punkte';
  list.appendChild(bt);

  for (const b of BONUS_TASKS) {
    const done = day.bonus[b.id];
    const card = document.createElement('div');
    card.className = 'bonus-card' + (done ? ' done' : '');
    card.onclick = () => done ? null : openBonusModal(b);
    const bonusIcon = b.img
      ? `<img src="${b.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;flex-shrink:0">`
      : `<div class="task-icon">${b.icon}</div>`;
    card.innerHTML = `
      ${bonusIcon}
      <div class="task-info">
        <div class="bonus-label">${b.label}</div>
        <div class="bonus-pts">+${b.pts} Bonuspunkte</div>
      </div>
      <div style="width:28px;height:28px;border-radius:50%;border:2px solid ${done ? 'var(--green)' : 'var(--muted)'};display:flex;align-items:center;justify-content:center;background:${done ? 'var(--green)' : 'transparent'};color:white;flex-shrink:0">${done ? '✓' : ''}</div>`;
    list.appendChild(card);
  }
}

function renderStats() {
  const days = getDaysForPeriod(currentPeriod);
  document.getElementById('stats-period-label').textContent = getPeriodLabel(currentPeriod);

  let totalMembers = 0, totalInvoices = 0, totalMails = 0, totalInstagram = 0, totalReceipts = 0;
  let totalStaff = 0, totalLesen = 0, totalMeditation = 0, totalFotos = 0;
  let sleep22 = 0, sleep23 = 0, sleep24 = 0, sleep99 = 0;
  for (const [, day] of days) {
    totalMembers  += (day.tasks.members?.count  || 0);
    totalInvoices += (day.tasks.invoices?.count || 0);
    totalMails    += (day.tasks.mails?.count    || 0);
    totalReceipts += (day.tasks.receipts?.count || 0);
    totalStaff    += (day.tasks.staff?.minutes  || 0);
    totalLesen    += (day.tasks.lesen?.minutes  || 0);
    if (day.tasks.instagram?.done) totalInstagram++;
    if (day.tasks.meditation?.done) totalMeditation++;
    if (day.tasks.fotos?.done) totalFotos++;
    const sv = day.tasks.sleep?.sleepVal;
    if (sv === 22) sleep22++;
    else if (sv === 23) sleep23++;
    else if (sv === 24) sleep24++;
    else if (sv === 99) sleep99++;
  }

  document.getElementById('stat-members').textContent   = totalMembers;
  document.getElementById('stat-invoices').textContent  = totalInvoices;
  document.getElementById('stat-mails').textContent     = totalMails;
  document.getElementById('stat-streak').textContent    = state.streak || 0;
  document.getElementById('stat-instagram').textContent = totalInstagram;
  document.getElementById('stat-receipts').textContent  = totalReceipts;
  document.getElementById('stat-staff').textContent     = totalStaff + ' Min';
  document.getElementById('stat-lesen').textContent      = totalLesen + ' Min';
  document.getElementById('stat-meditation').textContent = totalMeditation;
  document.getElementById('stat-fotos').textContent     = totalFotos;
  document.getElementById('stat-sleep22').textContent   = sleep22;
  document.getElementById('stat-sleep23').textContent   = sleep23;
  document.getElementById('stat-sleep24').textContent   = sleep24;
  document.getElementById('stat-sleep99').textContent   = sleep99;

  // Tägliche Balken
  function makeBar(container, label, value, max, unit) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    container.innerHTML += `
      <div class="week-bar-row">
        <div class="week-bar-label"><span>${label}</span><span>${value} ${unit}</span></div>
        <div class="week-bar-bg"><div class="week-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
  }

  const barContainer = document.getElementById('week-bars');
  barContainer.innerHTML = '';
  const dailyIds = ['members','invoices','mails','receipts','instagram','skool_msg','meditation','fotos','staff','lesen'];
  const dailyLabels = { members:'👥 Mitglieder', invoices:'🧾 Rechnungen', mails:'📧 Mails', receipts:'🗂️ Belege', instagram:'📸 Instagram', skool_msg:'💬 Skool', meditation:'🧘 Meditation', fotos:'📷 Fotos sortieren', staff:'🥢 Freestyle Staff', lesen:'📖 Lesen' };
  const maxDays = days.length || 1;
  for (const id of dailyIds) {
    const t = TASKS.find(x => x.id === id); if (!t) continue;
    let total = 0;
    for (const [, day] of days) {
      if (t.type === 'count') total += (day.tasks[id]?.count || 0);
      else if (t.type === 'minutes') total += (day.tasks[id]?.minutes || 0);
      else if (day.tasks[id]?.done) total += 1;
    }
    const unit = t.type === 'count' ? 'Stk.' : t.type === 'minutes' ? 'Min.' : 'Tage';
    const maxVal = t.type === 'count' ? Math.max(total, maxDays) : t.type === 'minutes' ? Math.max(total, 99) : maxDays;
    makeBar(barContainer, dailyLabels[id], total, maxVal, unit);
  }

  // Wöchentliche Balken
  const weeklyContainer = document.getElementById('weekly-bars');
  weeklyContainer.innerHTML = '';
  const weeks = Object.entries(state.weeks || {});
  const weeklyIds = ['course1','course2','course3','skool_up','newsletter'];
  const weeklyLabels = { course1:'🎓 Kurs 2–4', course2:'🎓 Kurs 5–10', course3:'🎓 Kurs 11–14', skool_up:'⬆️ Skool Upload', newsletter:'📰 Newsletter' };
  for (const id of weeklyIds) {
    let done = 0;
    for (const [, wk] of weeks) { if (wk.tasks[id]) done++; }
    makeBar(weeklyContainer, weeklyLabels[id], done, Math.max(done, 4), 'Wochen');
  }

  // Monatliche Balken
  const monthlyContainer = document.getElementById('monthly-bars');
  monthlyContainer.innerHTML = '';
  const months = Object.entries(state.months || {});
  const monthlyIds = ['gehalt','geld1','geld2','vorsteuer'];
  const monthlyLabels = { gehalt:'💰 Gehalt', geld1:'💸 Geld (Anfang)', geld2:'💸 Geld (Mitte)', vorsteuer:'📊 Vorsteuer' };
  for (const id of monthlyIds) {
    let done = 0;
    for (const [, mo] of months) { if (mo.tasks[id]) done++; }
    makeBar(monthlyContainer, monthlyLabels[id], done, Math.max(done, 3), 'Monate');
  }
}

function renderAvatarPage() {
  const pts = state.totalPts || 0;
  const av = getAvatar(pts);
  const next = getNextLevel(pts);

  // Großes Bild oben — volle Breite
  document.getElementById('av-big-img').src = av.img;
  document.getElementById('av-rank').textContent = av.rank;
  document.getElementById('av-name').textContent = av.name;
  document.getElementById('av-pts-label').textContent = pts + ' Gesamtpunkte';

  if (next) {
    const highestAv = AVATAR_LEVELS[getHighestUnlockedIdx(pts)];
    const pct = Math.round(((pts - highestAv.min) / (next.min - highestAv.min)) * 100);
    document.getElementById('xp-bar').style.width = pct + '%';
    document.getElementById('xp-label').textContent = `Nächste Stufe: ${next.name} (${next.min - pts} Pkt. fehlen)`;
  } else {
    document.getElementById('xp-bar').style.width = '100%';
    document.getElementById('xp-label').textContent = 'Maximale Stufe erreicht! 🏆';
  }

  // Auswählbare Avatar-Kacheln
  const rankList = document.getElementById('rank-list');
  rankList.innerHTML = '';
  for (let i = 0; i < AVATAR_LEVELS.length; i++) {
    const l = AVATAR_LEVELS[i];
    const isUnlocked = pts >= l.min;
    const isSelected = av.img === l.img;
    const el = document.createElement('div');
    el.className = 'rank-item' + (isSelected ? ' current' : '') + (!isUnlocked ? ' locked' : '');
    if (isUnlocked) el.onclick = () => selectAvatar(i);
    el.style.cursor = isUnlocked ? 'pointer' : 'default';
    el.innerHTML = `
      <img src="${l.img}" style="width:56px;height:56px;object-fit:contain;border-radius:12px;${!isUnlocked ? 'filter:grayscale(1);opacity:0.4' : ''}${isSelected ? ';outline:3px solid var(--accent)' : ''}">
      <div class="rank-info">
        <div class="rank-name">${l.name}</div>
        <div class="rank-req">${l.min > 0 ? l.min + ' Punkte' : 'Startavatar'}</div>
      </div>
      ${isSelected ? '<span class="rank-badge current">AKTIV</span>' : isUnlocked ? '<span class="rank-badge done">Wählen</span>' : '🔒'}`;
    rankList.appendChild(el);
  }
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────

function switchView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
}

// ── TAGESRESET ───────────────────────────────────────────────────────────────

function checkDayChange() {
  const currentKey = todayKey();
  if (state.today !== currentKey) {
    // Schlafenszeit nachholen falls nicht eingetragen
    const prevDay = state.days[state.today];
    if (prevDay && !prevDay.tasks.sleep) {
      prevDay.tasks.sleep = { done: true, sleepVal: 99, sleepPts: 0 };
      // Keine Punkte — 0 Punkte für "Nach Mitternacht"
    }
    updateStreak();
    ensureToday();
    saveState();
    renderAll();
    showToast('🌅 Neuer Tag – frisch durchstarten!');
  }
}

// Jede Minute prüfen ob Mitternacht überschritten wurde
setInterval(checkDayChange, 60 * 1000);

// Auch beim Zurückkehren zur App (Tab/App wieder in den Vordergrund)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) checkDayChange();
});

// ── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Modal buttons
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) closeModal();
  });
  document.getElementById('btn-minus').onclick = () => { if (modalCount > 0) { modalCount--; updateCountDisplay(); } };
  document.getElementById('btn-plus').onclick = () => {
    const maxVal = parseInt(document.getElementById('modal-count-row').dataset.maxVal || '9999');
    if (modalCount < maxVal) { modalCount++; updateCountDisplay(); }
  };
  document.getElementById('btn-cancel').onclick = closeModal;
  document.getElementById('btn-confirm').onclick = () => {
    if (monthlyModalTask) confirmMonthlyModal();
    else if (bonusModalTask) confirmBonusModal();
    else confirmModal();
  };

  renderAll();
  switchView('today');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
