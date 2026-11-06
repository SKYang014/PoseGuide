(() => {
'use strict';

const $ = (s) => document.querySelector(s);
const LS = {
  get(k, d) { try { const v = localStorage.getItem('pg.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('pg.' + k, JSON.stringify(v)); } catch {} }
};
const OPACITY = [1, 0.6, 0.3, 0];          // outline strength steps
const WHO = { you: '📷 You', her: '💬 Say to her', notes: '💗 Her notes' };

const state = {
  pose: null, ref: null,
  setting: LS.get('setting', 'golden'),
  mirror: LS.get('mirror', false),
  grid: LS.get('grid', true),
  op: 0,
  tf: { x: 0, y: 0, s: 1 },
  tips: [], tipIdx: 0,
  stream: null, demo: false,
  shots: []
};

const video = $('#video'), overlay = $('#overlay'), guide = $('#guide');

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  window.scrollTo(0, 0);
}
function toast(msg, ms = 1600) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ================= Figure drawing ================= */
// Body is drawn as thick round-capped strokes. The outline is made by masking:
// (body drawn slightly fatter) minus (body) = a clean ring around the whole silhouette.
const W = { arm1: 7, arm2: 6, leg1: 13, leg2: 9, foot: 5, neck: 7, torso: 4, hand: 3.2 };
let uid = 0;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const n1 = (v) => (+v).toFixed(1);

function parts(p, d) {
  const j = p.j;
  const pt = (a) => n1(a[0]) + ',' + n1(a[1]);
  const line = (a, b, w) => `<line x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}" stroke-width="${n1(w + d)}"/>`;
  // pinch the waist in a little
  let wL = lerp(j.sL, j.pL, 0.55), wR = lerp(j.sR, j.pR, 0.55);
  const len = Math.hypot(wR[0] - wL[0], wR[1] - wL[1]) || 1;
  const dx = (wR[0] - wL[0]) / len * 2.2, dy = (wR[1] - wL[1]) / len * 2.2;
  wL = [wL[0] + dx, wL[1] + dy]; wR = [wR[0] - dx, wR[1] - dy];

  let s = `<path d="M${pt(j.sL)}L${pt(wL)}L${pt(j.pL)}L${pt(j.pR)}L${pt(wR)}L${pt(j.sR)}Z" stroke-width="${n1(W.torso + d)}"/>`;
  s += line(j.neck, j.head, W.neck) + line(j.sL, j.neck, W.arm1) + line(j.neck, j.sR, W.arm1);
  for (const k of ['L', 'R']) {
    s += line(j['p' + k], j['k' + k], W.leg1) + line(j['k' + k], j['a' + k], W.leg2) + line(j['a' + k], j['t' + k], W.foot);
    s += line(j['s' + k], j['e' + k], W.arm1) + line(j['e' + k], j['h' + k], W.arm2);
    s += `<circle cx="${n1(j['h' + k][0])}" cy="${n1(j['h' + k][1])}" r="${n1(W.hand + d / 2)}" stroke-width="0"/>`;
  }
  const [hx, hy] = j.head, rot = `rotate(${p.tilt || 0} ${hx} ${hy})`;
  s += `<ellipse cx="${hx}" cy="${hy}" rx="${n1(8 + d / 2)}" ry="${n1(10 + d / 2)}" transform="${rot}" stroke-width="0"/>`;
  if (p.face === 'left' || p.face === 'right') { // little nose shows which way she's looking
    const g = p.face === 'right' ? 1 : -1;
    s += `<path d="M${hx + g * 6.5},${hy - 1}L${hx + g * 10.5},${hy + 3.5}L${hx + g * 6.5},${hy + 5}Z" transform="${rot}" stroke-width="${n1(1 + d)}"/>`;
  }
  return s;
}

function figureSVG(p, { mirror = false, ring = 1.1 } = {}) {
  const id = 'pgm' + (++uid);
  const grp = (c, d) => `<g fill="${c}" stroke="${c}" stroke-linecap="round" stroke-linejoin="round">${parts(p, d)}</g>`;
  const props = (p.props || []).map((l) => `<line class="prop" x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}"/>`).join('');
  const flip = mirror ? ' transform="translate(100 0) scale(-1 1)"' : '';
  const box = 'x="-60" y="-60" width="220" height="320"';
  return `<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
    `<g${flip}>` +
      `<mask id="${id}" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#000"/>${grp('#fff', ring * 2)}${grp('#000', 0)}</mask>` +
      `<mask id="${id}s" maskUnits="userSpaceOnUse" ${box}><rect ${box} fill="#000"/>${grp('#fff', ring * 2 + 1.6)}${grp('#000', 0)}</mask>` +
      `<g class="fill" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${parts(p, 0)}</g>` +
      props +
      `<rect class="shade" ${box} fill="#000" mask="url(#${id}s)"/>` +
      `<rect ${box} fill="currentColor" mask="url(#${id})"/>` +
    `</g></svg>`;
}

/* ================= Home ================= */
function renderHome() {
  $('#settings').innerHTML = SETTINGS.map((s) =>
    `<button class="chip${s.id === state.setting ? ' on' : ''}" data-id="${s.id}">${s.name}</button>`).join('');
  $('#poseGrid').innerHTML = POSES.map((p) =>
    `<button class="pose-card" data-id="${p.id}"><div class="pose-art">${figureSVG(p, { ring: 1.7 })}</div>` +
    `<b>${esc(p.name)}</b><small>${esc(p.tag)} · ${esc(p.level)}</small></button>`).join('');
}
$('#settings').addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b) return;
  state.setting = b.dataset.id; LS.set('setting', state.setting); renderHome();
});
$('#poseGrid').addEventListener('click', (e) => {
  const b = e.target.closest('.pose-card'); if (!b) return;
  openCamera({ pose: POSES.find((p) => p.id === b.dataset.id) });
});
$('#refInput').addEventListener('change', (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  if (state.refUrl) URL.revokeObjectURL(state.refUrl);
  state.refUrl = URL.createObjectURL(f);
  e.target.value = '';
  openCamera({ ref: state.refUrl });
});

/* ================= Notes ================= */
const getNotes = () => LS.get('notes', []);
$('#notesBtn').addEventListener('click', () => {
  $('#notesText').value = getNotes().join('\n');
  $('#notesDlg').showModal();
});
$('#notesDlg').addEventListener('close', () => {
  if ($('#notesDlg').returnValue !== 'save') return;
  LS.set('notes', $('#notesText').value.split('\n').map((s) => s.trim()).filter(Boolean));
});

/* ================= Camera screen ================= */
function openCamera({ pose = null, ref = null }) {
  requestOrientation();            // must run inside the tap for iPhone permission
  state.pose = pose; state.ref = ref; state.op = 0;
  buildGuide(); buildTips(); renderSetup();
  showScreen('camera');
  resetTf();
  applyToggles();
  openSetup(true);
  startStream();
}

function buildGuide() {
  guide.innerHTML = state.pose ? figureSVG(state.pose, { mirror: state.mirror }) : `<img src="${state.ref}" alt="">`;
  applyOpacity();
}
function applyOpacity() {
  const o = OPACITY[state.op] * (state.ref ? 0.5 : 1);
  guide.style.opacity = o;
}
function resetTf() {
  const fr = (state.pose && state.pose.frame) || { s: 1, y: 0 };
  state.tf = { x: 0, y: fr.y * overlay.clientHeight, s: fr.s };
  applyTf();
}
function applyTf() {
  const { x, y, s } = state.tf;
  guide.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${s})`;
}
function applyToggles() {
  $('#thirds').hidden = !state.grid;
  $('#gridBtn').classList.toggle('on', state.grid);
  $('#mirrorBtn').classList.toggle('on', state.mirror);
  $('#mirrorBtn').hidden = !state.pose;
}

function buildTips() {
  const t = [];
  if (state.pose) {
    state.pose.steps.forEach((s) => t.push({ who: 'her', text: s }));
    state.pose.you.forEach((s) => t.push({ who: 'you', text: s }));
  } else t.push(...REF_TIPS);
  getNotes().forEach((s) => t.push({ who: 'notes', text: s }));
  const st = SETTINGS.find((s) => s.id === state.setting);
  if (st) t.push(...st.tips);
  const kind = (state.pose && state.pose.kind) || 'full';
  t.push(...BASICS.filter((b) => !b.only || b.only === kind));
  state.tips = t; state.tipIdx = 0; renderTip();
}
function renderTip() {
  const tip = state.tips[state.tipIdx]; if (!tip) return;
  const w = $('#tipWho'); w.textContent = WHO[tip.who]; w.className = tip.who;
  $('#tipCount').textContent = `${state.tipIdx + 1} / ${state.tips.length}`;
  $('#tipText').textContent = tip.text;
}
function stepTip(d) {
  const n = state.tips.length; state.tipIdx = (state.tipIdx + d + n) % n; renderTip();
}
$('#tipNext').addEventListener('click', () => stepTip(1));
$('#tipPrev').addEventListener('click', () => stepTip(-1));
$('#tipText').addEventListener('click', () => stepTip(1));

function renderSetup() {
  let h;
  if (state.pose) {
    const p = state.pose, c = p.camera;
    h = `<div class="sh-head"><div class="sh-fig">${figureSVG(p, { mirror: state.mirror, ring: 1.8 })}</div>` +
        `<div><h3>${esc(p.name)}</h3><p>${esc(p.why)}</p></div></div>` +
        `<div class="specs"><div><span>📏 Hold phone at</span><b>${esc(c.height)}</b></div>` +
        `<div><span>👣 Distance</span><b>${esc(c.distance)}</b></div>` +
        `<div><span>🖼️ Framing</span><b>${esc(c.frame)}</b></div></div>` +
        `<h4 class="her">💬 Read these to her, one at a time</h4><ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` +
        `<h4 class="you">📷 Your job</h4><ul>${p.you.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`;
  } else {
    h = `<div class="sh-head"><div><h3>Copy this photo</h3><p>Her example photo is shown see-through over the camera.</p></div></div>` +
        `<h4 class="you">📷 How to use it</h4><ul>${REF_TIPS.map((t) => `<li>${esc(t.text)}</li>`).join('')}` +
        `<li>The ◐ button makes the photo lighter or hides it.</li></ul>`;
  }
  h += `<button class="primary" id="startShoot">Start shooting</button>`;
  $('#setupBody').innerHTML = h;
  $('#startShoot').addEventListener('click', () => openSetup(false));
}
function openSetup(open) {
  $('#setup').classList.toggle('open', open);
  $('#setup').setAttribute('aria-hidden', String(!open));
}
$('#setup').addEventListener('click', (e) => { if (e.target.id === 'setup') openSetup(false); });
$('#setupBtn').addEventListener('click', () => openSetup(true));

$('#mirrorBtn').addEventListener('click', () => {
  state.mirror = !state.mirror; LS.set('mirror', state.mirror);
  buildGuide(); renderSetup(); applyToggles();
});
$('#opacityBtn').addEventListener('click', () => {
  state.op = (state.op + 1) % OPACITY.length; applyOpacity();
  toast(['Outline: strong', 'Outline: medium', 'Outline: light', 'Outline hidden'][state.op], 900);
});
$('#gridBtn').addEventListener('click', () => {
  state.grid = !state.grid; LS.set('grid', state.grid); applyToggles();
});
$('#backBtn').addEventListener('click', () => {
  stopStream(); showScreen('home');
});

/* ---------- drag / pinch the outline ---------- */
const ptrs = new Map();
let gStart = null, lastTap = 0;
function gestureSnapshot() {
  const ps = [...ptrs.values()];
  const mid = ps.reduce((a, p) => [a[0] + p.x / ps.length, a[1] + p.y / ps.length], [0, 0]);
  const dist = ps.length > 1 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
  gStart = { mid, dist, tf: { ...state.tf } };
}
overlay.addEventListener('pointerdown', (e) => {
  overlay.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  gestureSnapshot();
  const now = Date.now();
  if (ptrs.size === 1 && now - lastTap < 300) { resetTf(); toast('Outline reset', 800); }
  lastTap = now;
});
overlay.addEventListener('pointermove', (e) => {
  if (!ptrs.has(e.pointerId)) return;
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const ps = [...ptrs.values()];
  const mid = ps.reduce((a, p) => [a[0] + p.x / ps.length, a[1] + p.y / ps.length], [0, 0]);
  const t = state.tf, s0 = gStart.tf;
  t.x = s0.x + mid[0] - gStart.mid[0];
  t.y = s0.y + mid[1] - gStart.mid[1];
  if (ps.length > 1 && gStart.dist > 0) {
    const d = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
    t.s = Math.min(4, Math.max(0.3, s0.s * d / gStart.dist));
  }
  applyTf();
});
const endPtr = (e) => { ptrs.delete(e.pointerId); if (ptrs.size) gestureSnapshot(); };
overlay.addEventListener('pointerup', endPtr);
overlay.addEventListener('pointercancel', endPtr);
overlay.addEventListener('wheel', (e) => {     // desktop: scroll to resize
  e.preventDefault();
  state.tf.s = Math.min(4, Math.max(0.3, state.tf.s * (e.deltaY < 0 ? 1.06 : 1 / 1.06)));
  applyTf();
}, { passive: false });

/* ---------- camera stream ---------- */
async function startStream() {
  stopStream();
  try {
    if (!window.isSecureContext) throw new Error('insecure');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('nocam');
    const s = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 3840 }, height: { ideal: 2160 } }
    });
    if (!$('#camera').classList.contains('active')) { s.getTracks().forEach((t) => t.stop()); return; }
    state.stream = s; state.demo = false;
    video.srcObject = s; video.hidden = false; $('#demo').hidden = true;
    await video.play().catch(() => {});
  } catch (err) {
    state.demo = true; video.hidden = true; $('#demo').hidden = false;
    $('#demoMsg').textContent = err.message === 'insecure'
      ? 'The camera only works when the app is opened from an https:// address. This is a practice background.'
      : 'Couldn’t open the camera (no camera, or permission was blocked). This is a practice background.';
  }
}
function stopStream() {
  if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
  state.stream = null; video.srcObject = null;
}
document.addEventListener('visibilitychange', () => {
  if (!$('#camera').classList.contains('active')) return;
  if (document.hidden) stopStream(); else if (!state.demo) startStream();
});

/* ---------- level ---------- */
let orientOn = false;
function requestOrientation() {
  if (orientOn) return; orientOn = true;
  const D = window.DeviceOrientationEvent;
  if (!D) return;
  if (typeof D.requestPermission === 'function') {
    D.requestPermission().then((r) => { if (r === 'granted') addEventListener('deviceorientation', onOrient); }).catch(() => {});
  } else addEventListener('deviceorientation', onOrient);
}
function onOrient(e) {
  if (e.gamma == null || e.beta == null) return;
  const lv = $('#level');
  const g = e.gamma, aim = e.beta - 90;
  if (Math.abs(g) > 45 || Math.abs(aim) > 60) { lv.hidden = true; return; } // not held upright in portrait
  lv.hidden = false;
  $('.lv-line i').style.transform = `rotate(${-g}deg)`;
  const ok = Math.abs(g) < 2 && Math.abs(aim) < 6;
  lv.classList.toggle('ok', ok);
  $('#lvText').textContent = Math.abs(aim) < 6
    ? (Math.abs(g) < 2 ? 'Straight ✓' : 'Level it')
    : (aim < 0 ? `Tipped down ${Math.round(-aim)}°` : `Tipped up ${Math.round(aim)}°`);
}

/* ---------- capture ---------- */
$('#shutter').addEventListener('click', capture);
async function capture() {
  const c = document.createElement('canvas'), ctx = c.getContext('2d');
  if (!state.demo && video.videoWidth) {
    c.width = video.videoWidth; c.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
  } else {
    c.width = 1080; c.height = 1920;
    const g = ctx.createLinearGradient(0, 0, 0, 1920);
    g.addColorStop(0, '#8fc0ec'); g.addColorStop(.55, '#f5d9bd'); g.addColorStop(.552, '#8aa774'); g.addColorStop(1, '#5c7a4d');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
  }
  const fl = $('#flash'); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
  if (navigator.vibrate) navigator.vibrate(15);
  const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.94));
  if (!blob) { toast('Couldn’t take the photo'); return; }
  state.shots.unshift({ blob, url: URL.createObjectURL(blob), time: new Date(), saved: false });
  updateThumb();
}
function updateThumb() {
  const b = $('#shotsBtn'), n = state.shots.length;
  b.classList.toggle('has', n > 0);
  b.style.backgroundImage = n ? `url(${state.shots[0].url})` : '';
  $('#shotCount').textContent = n;
}

/* ================= Review ================= */
$('#shotsBtn').addEventListener('click', () => { renderReview(); stopStream(); showScreen('review'); });
$('#rvBack').addEventListener('click', () => { showScreen('camera'); resetTf(); startStream(); });
function renderReview() {
  const list = $('#shotList');
  if (!state.shots.length) { list.innerHTML = '<p class="empty">No photos yet.</p>'; return; }
  list.innerHTML = state.shots.map((s, i) =>
    `<div class="shot"><img src="${s.url}" alt="Photo ${i + 1}" loading="lazy">` +
    `<div class="shot-row"><button class="save" data-i="${i}">${s.saved ? 'Saved ✓' : 'Save'}</button>` +
    `<button class="del" data-i="${i}">Delete</button></div></div>`).join('');
}
$('#shotList').addEventListener('click', async (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const i = +b.dataset.i, s = state.shots[i];
  if (b.classList.contains('save')) { if (await saveFiles([s])) { s.saved = true; renderReview(); } }
  else { URL.revokeObjectURL(s.url); state.shots.splice(i, 1); renderReview(); updateThumb(); }
});
$('#saveAll').addEventListener('click', async () => {
  const todo = state.shots.filter((s) => !s.saved);
  if (!todo.length) return;
  if (await saveFiles(todo)) { todo.forEach((s) => (s.saved = true)); renderReview(); }
});
function fileName(s, i) {
  const t = s.time, p = (n) => String(n).padStart(2, '0');
  return `pose-${t.getFullYear()}${p(t.getMonth() + 1)}${p(t.getDate())}-${p(t.getHours())}${p(t.getMinutes())}${p(t.getSeconds())}-${i + 1}.jpg`;
}
async function saveFiles(shots) {
  const files = shots.map((s, i) => new File([s.blob], fileName(s, i), { type: 'image/jpeg' }));
  // On phones the share sheet has "Save Image" / "Save to Photos".
  if (navigator.canShare && navigator.canShare({ files })) {
    try { await navigator.share({ files }); return true; }
    catch (err) { if (err.name === 'AbortError') return false; }
  }
  files.forEach((f, i) => {
    const a = document.createElement('a'); a.href = shots[i].url; a.download = f.name;
    document.body.appendChild(a); a.click(); a.remove();
  });
  return true;
}
window.addEventListener('beforeunload', (e) => {
  if (state.shots.some((s) => !s.saved)) { e.preventDefault(); e.returnValue = ''; }
});
window.addEventListener('resize', () => { if ($('#camera').classList.contains('active')) applyTf(); });

/* ================= Start ================= */
renderHome();
if ('serviceWorker' in navigator && window.isSecureContext && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
})();
