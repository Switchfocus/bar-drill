import { ICON, FOLDERS, BUILD, GLASS_ICON, RIMS, GARNISHES, METHODS, GLASSES, fmtAmt, ING } from "./data.js";
import { state, st, level, isWeak, esc, pool } from "./state.js";

/* ── Announce (screen reader) ──────────────────────────────────────────────── */

export function announce(msg) {
  let el = document.getElementById("sr-announce");
  if (!el) {
    el = document.createElement("div");
    el.id = "sr-announce";
    el.setAttribute("aria-live","polite");
    el.setAttribute("aria-atomic","true");
    el.className = "sr-only";
    document.body.appendChild(el);
  }
  el.textContent = "";
  requestAnimationFrame(() => { el.textContent = msg; });
}

/* ── Toast ─────────────────────────────────────────────────────────────────── */

let _toastTimer;
export function toast(msg, duration=2500) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.setAttribute("role","status");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("visible");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove("visible"), duration);
}
window.toast = toast;

/* ── Dialog helpers ────────────────────────────────────────────────────────── */

export function openDialog(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.showModal ? el.showModal() : el.setAttribute("open","");
  el.setAttribute("aria-modal","true");
}

export function closeDialog(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.close ? el.close() : el.removeAttribute("open");
}

export function confirmDialog(msg, onYes) {
  const existing = document.getElementById("confirm-dialog");
  if (existing) existing.remove();
  const d = document.createElement("dialog");
  d.id = "confirm-dialog";
  d.innerHTML = `<p>${esc(msg)}</p><div class="dialog-actions"><button class="btn-secondary" id="confirm-no">Cancel</button><button class="btn-danger" id="confirm-yes">Confirm</button></div>`;
  document.body.appendChild(d);
  d.showModal();
  d.querySelector("#confirm-no").onclick = () => d.close();
  d.querySelector("#confirm-yes").onclick = () => { d.close(); onYes(); };
}

window.modal = openDialog;
window.closeModal = closeDialog;
window.openDialog = openDialog;

/* ── Mastery meter ─────────────────────────────────────────────────────────── */

export function meter(pct, size=40) {
  const r = (size/2)-4;
  const circ = 2*Math.PI*r;
  const dash = circ * Math.min(1, pct/100);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="meter-svg" aria-hidden="true">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" class="meter-bg"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" class="meter-fg" stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ/4}" transform="rotate(-90 ${size/2} ${size/2})"/>
  </svg>`;
}

export function renderMastery() {
  const all = state.items;
  if (!all.length) return;
  const seen = all.filter(i => st(i.id).seen > 0).length;
  const strong = all.filter(i => level(i.id) === 2).length;
  const pct = all.length ? Math.round(strong / all.length * 100) : 0;
  const el = document.getElementById("mastery-overview");
  if (el) {
    el.innerHTML = `${meter(pct,48)}<div class="mastery-stats"><span class="mastery-pct">${pct}%</span><span class="mastery-sub">${strong} strong · ${seen} seen · ${all.length} total</span></div>`;
  }
}

/* ── Folder chips ──────────────────────────────────────────────────────────── */

export function renderFolders(onSelect) {
  const el = document.getElementById("folder-tabs");
  if (!el) return;
  el.innerHTML = Object.entries(FOLDERS).map(([k,f]) =>
    `<button class="chip${state.folderKey===k?" active":""}" data-folder="${k}">${esc(f.name)}</button>`
  ).join("");
  el.querySelectorAll(".chip").forEach(b => b.onclick = () => {
    state.folderKey = b.dataset.folder;
    onSelect(state.folderKey);
  });
}

export function renderChips(cats, activeCat, onSelect) {
  const el = document.getElementById("cat-chips");
  if (!el) return;
  const all = ["All", ...cats];
  el.innerHTML = all.map(c =>
    `<button class="chip${activeCat===c?" active":""}" data-cat="${esc(c)}">${esc(c)}</button>`
  ).join("");
  el.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => onSelect(b.dataset.cat));
}

/* ── Drink card ────────────────────────────────────────────────────────────── */

export function specLines(item) {
  if (item.spec) return item.spec.split("\n").map(l => `<li>${esc(l)}</li>`).join("");
  if (item.ingredients?.length) return item.ingredients.map(l => `<li>${esc(l)}</li>`).join("");
  return "";
}

export function buildSummary(item) {
  const b = BUILD[item.id];
  if (!b) return "";
  const variants = Object.keys(b);
  if (!variants.length) return "";
  const v = b[variants[0]];
  const glasses = [].concat(v.glass);
  const glassIcon = GLASS_ICON[glasses[0]] || "";
  return `<div class="build-summary">
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" class="glass-icon" aria-hidden="true">${glassIcon}</svg>
    <span>${esc(v.method)}</span>
    ${v.rim && v.rim !== "No rim" ? `<span class="rim-tag">${esc(v.rim)}</span>` : ""}
    ${variants.length>1 ? `<span class="variant-count">${variants.length} variants</span>` : ""}
  </div>`;
}

export function drinkCard(item, opts={}) {
  const s = st(item.id);
  const lv = level(item.id);
  const weak = isWeak(item.id);
  const lines = specLines(item);
  const bs = buildSummary(item);
  const hasNote = item.note;
  return `<article class="drink-card${weak?" weak":""}" data-id="${esc(item.id)}" data-folder="${esc(item.folder||"")}">
    <header class="card-header">
      <div class="card-title-row">
        <h3 class="card-name">${esc(item.name)}</h3>
        ${item.price?`<span class="price-tag">${esc(item.price)}</span>`:""}
      </div>
      ${item.spirit?`<p class="card-spirit">${esc(item.spirit)}</p>`:""}
      <div class="card-meta">
        ${lv===2?`<span class="badge badge-strong">Strong</span>`:""}
        ${weak?`<span class="badge badge-weak">Weak</span>`:""}
        ${s.seen>0?`<span class="badge badge-seen">${s.seen} seen</span>`:""}
      </div>
    </header>
    ${lines?`<ul class="spec-list">${lines}</ul>`:""}
    ${bs}
    ${hasNote?`<p class="card-note">${esc(item.note)}</p>`:""}
    ${opts.edit?`<div class="card-actions"><button class="icon-btn" data-edit="${esc(item.id)}" aria-label="Edit ${esc(item.name)}">${ICON.edit}</button></div>`:""}
  </article>`;
}

/* ── Inline spec editor (bindEdit) ────────────────────────────────────────── */

export function bindEdit(container, onSave) {
  container.querySelectorAll("[data-edit]").forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const id = btn.dataset.edit;
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      openTextEditor(item, onSave);
    };
  });
}

function openTextEditor(item, onSave) {
  const existing = document.getElementById("text-editor-dialog");
  if (existing) existing.remove();
  const d = document.createElement("dialog");
  d.id = "text-editor-dialog";
  d.innerHTML = `
    <form method="dialog" class="editor-form">
      <h2>Edit: ${esc(item.name)}</h2>
      <label>Note<textarea name="note" rows="3">${esc(item.note||"")}</textarea></label>
      <label>Spec<textarea name="spec" rows="6">${esc(item.spec||"")}</textarea></label>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" id="editor-cancel">Cancel</button>
        <button type="submit" class="btn-primary">Save</button>
      </div>
    </form>`;
  document.body.appendChild(d);
  d.showModal();
  d.querySelector("#editor-cancel").onclick = () => d.close();
  d.querySelector("form").onsubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    item.note = data.get("note").trim();
    item.spec = data.get("spec").trim();
    onSave(item);
    d.close();
  };
}

/* ── Build editor (openEditor) ─────────────────────────────────────────────── */

export function openEditor(item, onSave) {
  const existing = document.getElementById("build-editor-dialog");
  if (existing) existing.remove();
  const d = document.createElement("dialog");
  d.id = "build-editor-dialog";
  const b = BUILD[item.id];
  const variants = b ? Object.keys(b) : [""];
  const firstVar = b ? b[variants[0]] : null;

  d.innerHTML = `
    <form method="dialog" class="editor-form build-editor">
      <h2>Build: ${esc(item.name)}</h2>
      <label>Glass
        <select name="glass">${GLASSES.map(g=>`<option${firstVar?.glass?.includes(g)?" selected":""}>${esc(g)}</option>`).join("")}</select>
      </label>
      <label>Method
        <select name="method">${METHODS.map(m=>`<option${firstVar?.method===m?" selected":""}>${esc(m)}</option>`).join("")}</select>
      </label>
      <label>Rim
        <select name="rim">${RIMS.map(r=>`<option${(firstVar?.rim||"No rim")===r?" selected":""}>${esc(r)}</option>`).join("")}</select>
      </label>
      <label>Garnish
        <select name="garnish">${GARNISHES.map(g=>`<option${(firstVar?.garnish||"None")===g?" selected":""}>${esc(g)}</option>`).join("")}</select>
      </label>
      <label>Spec<textarea name="spec" rows="6">${esc(item.spec||"")}</textarea></label>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" id="build-cancel">Cancel</button>
        <button type="submit" class="btn-primary">Save</button>
      </div>
    </form>`;
  document.body.appendChild(d);
  d.showModal();
  d.querySelector("#build-cancel").onclick = () => d.close();
  d.querySelector("form").onsubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    item.glass = data.get("glass");
    item.method = data.get("method");
    item.rim = data.get("rim");
    item.garnish = data.get("garnish");
    item.spec = data.get("spec").trim();
    onSave(item);
    d.close();
  };
}

/* ── Import dialog ─────────────────────────────────────────────────────────── */

export function openImport(onImport) {
  const existing = document.getElementById("import-dialog");
  if (existing) existing.remove();
  const d = document.createElement("dialog");
  d.id = "import-dialog";
  d.innerHTML = `
    <form method="dialog" class="editor-form">
      <h2>Import items</h2>
      <label>Paste JSON array<textarea name="json" rows="10" placeholder='[{"id":"...","name":"...","cat":"..."}]'></textarea></label>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" id="import-cancel">Cancel</button>
        <button type="submit" class="btn-primary">Import</button>
      </div>
    </form>`;
  document.body.appendChild(d);
  d.showModal();
  d.querySelector("#import-cancel").onclick = () => d.close();
  d.querySelector("form").onsubmit = e => {
    e.preventDefault();
    const raw = new FormData(e.target).get("json");
    try {
      const items = JSON.parse(raw);
      if (!Array.isArray(items)) throw new Error("Not an array");
      onImport(items);
      d.close();
    } catch(err) {
      toast("Invalid JSON: " + err.message);
    }
  };
}
