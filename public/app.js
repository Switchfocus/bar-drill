import { FOLDERS } from "./data.js";
import { state, initState, persist, snapshot, applyTheme, esc } from "./state.js";
import { renderFolders, renderChips, renderMastery, toast, announce } from "./ui.js";
import { renderLearn } from "./learn.js";
import { renderQuiz } from "./quiz.js";
import { renderBar } from "./bar.js";
import { renderShift } from "./shift.js";
import { renderManage } from "./manage.js";
import { renderAdmin } from "./admin.js";
import { initAuth } from "./auth.js";
import { scheduleProgressSave, onSyncState, getSyncState } from "./sync.js";

/* ── Tab config ─────────────────────────────────────────────────────────────── */

const TABS = [
  {id:"learn",  label:"Learn",   icon:'<path d="M4 19V5a2 2 0 0 1 2-2h11.5A2.5 2.5 0 0 1 20 5.5v0A2.5 2.5 0 0 1 17.5 8H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>'},
  {id:"quiz",   label:"Quiz",    icon:'<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>'},
  {id:"bar",    label:"Bar",     icon:'<path d="M5 3h14M5 3l3.5 9h7L19 3M5 3H3M19 3h2M8.5 12v9M15.5 12v9M8.5 21h7"/>'},
  {id:"shift",  label:"Shift",   icon:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'},
  {id:"manage", label:"Account", icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>'},
];

/* ── Active tab ─────────────────────────────────────────────────────────────── */

let activeTab = "learn";

export function render(tab) {
  if (tab) activeTab = tab;

  // Strip mode classes when not in bar/shift
  if (activeTab !== "bar")   document.body.classList.remove("bar-mode");
  if (activeTab !== "shift") document.body.classList.remove("shift-mode");

  renderNav();

  const isAdmin = state.member?.role === "admin";

  switch (activeTab) {
    case "learn":   renderLearn();  break;
    case "quiz":    renderQuiz();   break;
    case "bar":     renderBar();    break;
    case "shift":   renderShift();  break;
    case "manage":  renderManage(); break;
    case "admin":   if (isAdmin) renderAdmin(); break;
    default: renderLearn();
  }
}

window.render = render;

/* ── Nav ────────────────────────────────────────────────────────────────────── */

function renderNav() {
  const nav = document.getElementById("app-nav");
  if (!nav) return;
  const isAdmin = state.member?.role === "admin";
  const tabs = isAdmin ? [...TABS, {id:"admin",label:"Admin",icon:'<path d="M12 2l8 4v5c0 5-3.5 9.7-8 11-4.5-1.3-8-6-8-11V6z"/>'}] : TABS;
  nav.innerHTML = tabs.map(t => `
    <button class="nav-btn${activeTab===t.id?" active":""}" data-tab="${t.id}" aria-current="${activeTab===t.id?"page":"false"}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon" aria-hidden="true">${t.icon}</svg>
      <span class="nav-label">${t.label}</span>
    </button>`).join("");
  nav.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => render(b.dataset.tab));
}

/* ── Sync indicator ─────────────────────────────────────────────────────────── */

function renderSyncIndicator(s) {
  const el = document.getElementById("sync-indicator");
  if (!el) return;
  const labels = { ok:"Synced", saving:"Saving…", off:"Offline" };
  el.textContent = labels[s] || "";
  el.className = "sync-indicator " + (s || "ok");
}

/* ── Boot app after auth ────────────────────────────────────────────────────── */

export function bootApp(remote) {
  initState();

  if (remote) {
    // Merge remote progress into local state
    if (remote.mastery) Object.assign(state.mastery, remote.mastery);
    if (remote.settings) Object.assign(state.settings, remote.settings);
    if (remote.items?.length) {
      // remote items don't override local — local is truth for item data
    }
    applyTheme(state.settings.theme || "auto");
    persist();
  }

  // Start syncing progress saves
  window.cloudSave = data => scheduleProgressSave(data);
  onSyncState(renderSyncIndicator);
  renderSyncIndicator(getSyncState());

  // Show the app shell
  const gate = document.getElementById("gate");
  gate.style.display = "none";
  const app = document.getElementById("app");
  if (app) app.hidden = false;

  render("learn");
}

window.bootApp = bootApp;

/* ── Route updates (tab changes persist mastery) ───────────────────────────── */

// Whenever the user navigates away, flush progress
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && state.user) {
    scheduleProgressSave(snapshot());
  }
});

/* ── Init ───────────────────────────────────────────────────────────────────── */

initAuth({
  onSignedOut: () => {
    // gate is already shown by auth.js
  },
  onPending: (member) => {
    // waiting page shown by auth.js
  },
  onDisabled: (member) => {
    // disabled page shown by auth.js
  },
  onActive: (remote) => {
    bootApp(remote);
  },
});
