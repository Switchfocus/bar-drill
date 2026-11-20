import { DEFAULT_ITEMS, DATA_VERSION, MENU, COCINA, EXTRAS, CLASSICS } from "./data.js";

/* ── Persistent storage ────────────────────────────────────────────────────── */

export function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
}
export function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage full */ }
}

/* ── Shared mutable state ──────────────────────────────────────────────────── */

export const state = {
  items: [],
  mastery: {},       // {id: {seen,correct,streak,easeFactor,interval,nextReview,firstSeen,lastSeen}}
  settings: {},      // {theme,notifs,...}
  user: null,        // Firebase user object
  member: null,      // Firestore members/{uid} doc
  remote: false,     // cloud sync enabled
  folderKey: "cantina",
  activeMenus: [],   // list of menu IDs accessible to this user
};

/* ── Upgrade & init ────────────────────────────────────────────────────────── */

function upgradeItems(items) {
  const defaults = DEFAULT_ITEMS();
  const byId = {};
  defaults.forEach(i => byId[i.id] = i);
  return items.map(i => ({ ...byId[i.id], ...i })).filter(i => byId[i.id]);
}

export function initState() {
  const stored = load("bar-drill-v3", null);
  if (stored && stored.version === DATA_VERSION) {
    state.items = upgradeItems(stored.items || []);
    state.mastery = stored.mastery || {};
    state.settings = stored.settings || {};
  } else {
    const legacy = load("bar-drill", null);
    state.items = DEFAULT_ITEMS();
    state.mastery = legacy?.mastery || {};
    state.settings = legacy?.settings || {};
  }
  if (!state.items.length) state.items = DEFAULT_ITEMS();
  applyTheme(state.settings.theme || "auto");
}

export function snapshot() {
  return {
    version: DATA_VERSION,
    items: state.items,
    mastery: state.mastery,
    settings: state.settings,
  };
}

export function persist() {
  save("bar-drill-v3", snapshot());
}

/* ── Theme ─────────────────────────────────────────────────────────────────── */

export function applyTheme(t) {
  state.settings.theme = t;
  const root = document.documentElement;
  if (t === "dark") { root.setAttribute("data-theme", "dark"); }
  else if (t === "light") { root.removeAttribute("data-theme"); root.style.colorScheme = "light"; }
  else { root.removeAttribute("data-theme"); root.style.colorScheme = ""; }
}

/* ── Pure helpers ──────────────────────────────────────────────────────────── */

export const esc = s => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=0|Math.random()*(i+1);[b[i],b[j]]=[b[j],b[i]];} return b; };
export const uniq = a => [...new Set(a)];
export const norm = s => s.trim().toLowerCase().replace(/[^a-z0-9]/g,"");

export const st = id => state.mastery[id] || {seen:0,correct:0,streak:0,easeFactor:2.5,interval:1,nextReview:0};

export function peek(item) {
  const s = st(item.id);
  const now = Date.now();
  return { overdue: s.nextReview <= now, s };
}

export function weight(item) {
  const { overdue, s } = peek(item);
  if (s.seen === 0) return 4;
  if (overdue) return 3 + Math.min(2, (Date.now() - s.nextReview) / 86400000);
  if (s.streak === 0) return 2;
  return Math.max(0.5, 1 / s.easeFactor);
}

export function pickWeighted(items) {
  const ws = items.map(weight);
  const total = ws.reduce((a,b)=>a+b,0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

export const level = id => {
  const s = st(id);
  if (s.seen === 0) return 0;
  if (s.correct / s.seen >= 0.85 && s.streak >= 3) return 2;
  if (s.correct / s.seen >= 0.6 || s.streak >= 1) return 1;
  return 0;
};

export const isWeak = id => { const s=st(id); return s.seen>0 && s.correct/s.seen<0.5; };

export function pool(folder, cat) {
  return state.items.filter(i => {
    if (folder && i.folder !== folder) return false;
    if (cat && cat !== "All" && i.cat !== cat) return false;
    return true;
  });
}

/* SRS record — call after answering a question */
export function record(id, correct) {
  const s = st(id);
  s.seen = (s.seen || 0) + 1;
  if (!s.firstSeen) s.firstSeen = Date.now();
  s.lastSeen = Date.now();
  if (correct) {
    s.correct = (s.correct || 0) + 1;
    s.streak = (s.streak || 0) + 1;
    // SM-2 ease/interval update
    s.easeFactor = Math.max(1.3, (s.easeFactor || 2.5) + 0.1 - (5 - 5) * (0.08 + (5 - 5) * 0.02));
    s.interval = s.streak === 1 ? 1 : s.streak === 2 ? 6 : Math.round((s.interval || 1) * s.easeFactor);
  } else {
    s.streak = 0;
    s.interval = 1;
    s.easeFactor = Math.max(1.3, (s.easeFactor || 2.5) - 0.2);
  }
  s.nextReview = Date.now() + s.interval * 86400000;
  state.mastery[id] = s;
  persist();
  return s;
}

/* ── Activity logging ──────────────────────────────────────────────────────── */

export function logActivity(type) {
  // type: "answer" | "build" | "shiftOrder"
  const today = new Date().toISOString().slice(0,10);
  if (!state.activity) state.activity = {};
  if (!state.activity[today]) state.activity[today] = {answers:0,builds:0,shiftOrders:0,sessions:0,minutes:0};
  if (type === "answer") state.activity[today].answers++;
  if (type === "build") state.activity[today].builds++;
  if (type === "shiftOrder") state.activity[today].shiftOrders++;
}

export function pruneActivity(days=90) {
  if (!state.activity) return;
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0,10);
  for (const k of Object.keys(state.activity)) { if (k < cutoff) delete state.activity[k]; }
}
