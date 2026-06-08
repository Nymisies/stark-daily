'use strict';

// ── CONFIG ──────────────────────────────────────────────────────────────────

const TASKS = [
  { id: 'members',  label: 'Mitglieder einpflegen', img: 'images/tasks/members.png',  type: 'count', pts: 10, perItem: 2 },
  { id: 'invoices', label: 'Rechnungen schreiben',  img: 'images/tasks/invoices.png', type: 'count', pts: 10, perItem: 5 },
  { id: 'mails',    label: 'Mails beantworten',     img: 'images/tasks/mails.png',    type: 'count', pts: 10, perItem: 1 },
  { id: 'post',     label: 'Post & Briefe',          img: 'images/tasks/post.png',     type: 'count', pts: 10, perItem: 2 },
  { id: 'receipts', label: 'Belege scannen',         img: 'images/tasks/receipts.png', type: 'count', pts: 10, perItem: 2 },
  { id: 'skool_msg',label: 'Skool Nachrichten',      img: 'images/tasks/skool_msg.png',type: 'count', pts: 10, perItem: 1 },
  { id: 'instagram',label: 'Instagram Post',          img: 'images/tasks/instagram.png',type: 'check', pts: 20 },
  { id: 'course1',  label: 'Kurs 2–4 Jahre planen',  img: 'images/tasks/course1.png',  type: 'check', pts: 15, weekly: true },
  { id: 'course2',  label: 'Kurs 5–10 Jahre planen', img: 'images/tasks/course2.png',  type: 'check', pts: 15, weekly: true },
  { id: 'course3',  label: 'Kurs 11–14 Jahre planen',img: 'images/tasks/course3.png',  type: 'check', pts: 15, weekly: true },
  { id: 'skool_up', label: 'Skool hochladen',         img: 'images/tasks/skool_up.png', type: 'check', pts: 10, weekly: true },
];

const SLEEP_TASK = { id: 'sleep', label: 'Schlafenszeit', img: 'images/tasks/sleep.png', type: 'sleep', pts: 0 };

// Monatliche Aufgaben — einmal pro Monat zu erledigen
const MONTHLY_TASKS = [
  { id: 'gehalt',    label: 'Gehalt zahlen',            icon: '💰', type: 'check', pts: 30, hint: 'Anfang des Monats' },
  { id: 'geld1',     label: 'Geld anweisen (Anfang)',   icon: '💸', type: 'check', pts: 20, hint: 'Anfang des Monats' },
  { id: 'geld2',     label: 'Geld anweisen (Mitte)',    icon: '💸', type: 'check', pts: 20, hint: 'Um den 13.' },
  { id: 'vorsteuer', label: 'Vorsteuer fertig machen',  icon: '📊', type: 'check', pts: 30, hint: 'Um den 13.' },
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
  { min: 0,    img: 'images/avatars/lehrling.png',  rank: 'Stufe 1', name: 'Der Lehrling',   color: '#aaa' },
  { min: 200,  img: 'images/avatars/arbeiter.png',  rank: 'Stufe 2', name: 'Der Arbeiter',   color: '#cd7f32' },
  { min: 500,  img: 'images/avatars/profi.png',     rank: 'Stufe 3', name: 'Der Profi',      color: '#a8a9ad' },
  { min: 1000, img: 'images/avatars/held.png',      rank: 'Stufe 4', name: 'Der Held',       color: '#ffd700' },
  { min: 2000, img: 'images/avatars/superheld.png', rank: 'Stufe 5', name: 'Der Superheld',  color: '#6c63ff' },
];

const REWARDS = [
  { pct: 30,  label: '30 Min YouTube',  icon: '🎬' },
  { pct: 60,  label: '+30 Min YouTube', icon: '🎬' },
  { pct: 100, label: '+1 Std YouTube',  icon: '🏆' },
];

// ── STATE ────────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function weekKey() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

function monthKey() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
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
ensureToday();

// ── HELPERS ──────────────────────────────────────────────────────────────────

function getAvatar(pts) {
  let level = AVATAR_LEVELS[0];
  for (const l of AVATAR_LEVELS) { if (pts >= l.min) level = l; }
  return level;
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
  const existing = state.days[state.today].tasks[task.id];
  modalCount = existing ? (existing.count || 0) : 0;

  const iconEl = document.getElementById('modal-icon');
  if (task.img) {
    iconEl.innerHTML = `<img src="${task.img}" style="width:64px;height:64px;object-fit:cover;border-radius:14px;margin:0 auto;display:block">`;
  } else {
    iconEl.textContent = task.icon;
  }
  document.getElementById('modal-title').textContent = task.label;
  document.getElementById('modal-subtitle').textContent =
    task.type === 'count'
      ? 'Wie viele hast du heute erledigt? (0 ist okay wenn du dich darum gekümmert hast)'
      : 'Hast du das heute gemacht?';
  document.getElementById('modal-count-row').style.display = task.type === 'count' ? 'flex' : 'none';
  document.getElementById('modal-check-row').style.display = task.type === 'check' ? 'block' : 'none';
  document.getElementById('modal-sleep-row').style.display = task.type === 'sleep' ? 'block' : 'none';
  selectedSleep = null;
  document.querySelectorAll('.sleep-btn').forEach(b => b.classList.remove('selected'));
  updateCountDisplay();

  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  modalTask = null;
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
  day.tasks[modalTask.id] = { done: true, count: modalCount };

  let delta = modalTask.pts;
  if (modalTask.type === 'count') delta += modalCount * modalTask.perItem;
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

// ── BONUS ────────────────────────────────────────────────────────────────────

function toggleBonus(id) {
  const day = state.days[state.today];
  if (day.bonus[id]) return; // already done, no double-count
  const task = BONUS_TASKS.find(b => b.id === id);
  day.bonus[id] = true;
  state.totalPts = (state.totalPts || 0) + task.pts;
  updateStreak();
  saveState();
  renderAll();
  showToast('🌟 Bonus: +' + task.pts + ' Punkte!');
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
  let cutoff;
  if (period === 'week') {
    cutoff = new Date(now); cutoff.setDate(now.getDate() - 7);
  } else if (period === 'month') {
    cutoff = new Date(now); cutoff.setMonth(now.getMonth() - 1);
  } else {
    cutoff = new Date(now); cutoff.setFullYear(now.getFullYear() - 1);
  }
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  return all.filter(([k]) => k >= cutoffKey);
}

function getPeriodLabel(period) {
  if (period === 'week')  return 'Letzte 7 Tage';
  if (period === 'month') return 'Letzter Monat';
  return 'Letztes Jahr';
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
    card.className = 'task-card' + (done ? ' done' : '');
    card.onclick = () => done ? null : openModal(t);

    let sub = done
      ? (t.type === 'count' ? `✓ Erledigt · ${done.count} Stk.` : '✓ Erledigt')
      : (t.type === 'count' ? 'Tippe zum Abhaken + Anzahl eingeben' : 'Tippe zum Abhaken');

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
    card.onclick = () => {
      if (done) return;
      // Monatsaufgaben direkt abhaken (kein Modal nötig)
      state.months[state.month].tasks[t.id] = { done: true };
      state.totalPts = (state.totalPts || 0) + t.pts;
      updateStreak();
      saveState();
      renderAll();
      showToast('✓ ' + t.label + ' erledigt!');
    };
    card.innerHTML = `
      <div class="task-icon" style="background:rgba(255,101,132,0.1);font-size:24px">${t.icon}</div>
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
    card.onclick = () => done ? null : toggleBonus(b.id);
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
  let sleep22 = 0, sleep23 = 0, sleep24 = 0, sleep99 = 0;
  for (const [, day] of days) {
    totalMembers  += (day.tasks.members?.count  || 0);
    totalInvoices += (day.tasks.invoices?.count || 0);
    totalMails    += (day.tasks.mails?.count    || 0);
    totalReceipts += (day.tasks.receipts?.count || 0);
    if (day.tasks.instagram?.done) totalInstagram++;
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
  document.getElementById('stat-sleep22').textContent   = sleep22;
  document.getElementById('stat-sleep23').textContent   = sleep23;
  document.getElementById('stat-sleep24').textContent   = sleep24;
  document.getElementById('stat-sleep99').textContent   = sleep99;

  // Balken
  const barContainer = document.getElementById('week-bars');
  barContainer.innerHTML = '';
  const taskIds    = ['members', 'invoices', 'mails', 'receipts', 'instagram', 'skool_msg'];
  const taskLabels = {
    members:   '👥 Mitglieder',
    invoices:  '🧾 Rechnungen',
    mails:     '📧 Mails',
    receipts:  '🗂️ Belege',
    instagram: '📸 Instagram',
    skool_msg: '💬 Skool'
  };

  for (const id of taskIds) {
    const t = TASKS.find(x => x.id === id);
    if (!t) continue;
    let total = 0;
    for (const [, day] of days) {
      if (t.type === 'count') total += (day.tasks[id]?.count || 0);
      else if (day.tasks[id]?.done) total += 1;
    }
    if (total === 0 && days.length === 0) continue;
    const maxDays = days.length || 1;
    const maxVal = t.type === 'count' ? Math.max(total, maxDays) : maxDays;
    const pct = Math.min(100, Math.round((total / maxVal) * 100));
    const unit = t.type === 'count' ? 'Stk.' : 'Tage';
    barContainer.innerHTML += `
      <div class="week-bar-row">
        <div class="week-bar-label">
          <span>${taskLabels[id]}</span>
          <span>${total} ${unit}</span>
        </div>
        <div class="week-bar-bg">
          <div class="week-bar-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
  }
}

function renderAvatarPage() {
  const pts = state.totalPts || 0;
  const av = getAvatar(pts);
  const next = getNextLevel(pts);

  document.getElementById('av-emoji').innerHTML =
    `<img src="${av.img}" style="width:120px;height:120px;object-fit:cover;border-radius:50%;border:4px solid var(--accent);box-shadow:0 0 30px rgba(108,99,255,0.4)">`;
  document.getElementById('av-rank').textContent = av.rank;
  document.getElementById('av-name').textContent = av.name;
  document.getElementById('av-pts-label').textContent = pts + ' Gesamtpunkte';

  if (next) {
    const pct = Math.round(((pts - av.min) / (next.min - av.min)) * 100);
    document.getElementById('xp-bar').style.width = pct + '%';
    document.getElementById('xp-label').textContent = `Nächste Stufe: ${next.name} (${next.min - pts} Pkt. fehlen)`;
  } else {
    document.getElementById('xp-bar').style.width = '100%';
    document.getElementById('xp-label').textContent = 'Maximale Stufe erreicht! 🏆';
  }

  const rankList = document.getElementById('rank-list');
  rankList.innerHTML = '';
  for (const l of AVATAR_LEVELS) {
    const isCurrent = av.min === l.min;
    const isUnlocked = pts >= l.min;
    const el = document.createElement('div');
    el.className = 'rank-item' + (isCurrent ? ' current' : '') + (!isUnlocked ? ' locked' : '');
    el.innerHTML = `
      <img src="${l.img}" style="width:44px;height:44px;object-fit:cover;border-radius:50%;${!isUnlocked ? 'filter:grayscale(1)' : ''}">
      <div class="rank-info">
        <div class="rank-name">${l.name}</div>
        <div class="rank-req">${l.min} Punkte</div>
      </div>
      ${isCurrent ? '<span class="rank-badge current">AKTUELL</span>' : isUnlocked ? '<span class="rank-badge done">✓</span>' : '🔒'}`;
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
    // Neuer Tag! Streak prüfen bevor wir wechseln
    updateStreak();
    ensureToday();
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
  document.getElementById('btn-plus').onclick = () => { modalCount++; updateCountDisplay(); };
  document.getElementById('btn-cancel').onclick = closeModal;
  document.getElementById('btn-confirm').onclick = confirmModal;

  renderAll();
  switchView('today');

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
