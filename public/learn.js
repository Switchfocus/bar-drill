import { FOLDERS, FAMILIES, FAM_OF } from "./data.js";
import { state, pool, st, level, isWeak, pickWeighted, esc, shuffle } from "./state.js";
import { renderChips, renderFolders, drinkCard, specLines, bindEdit, announce, toast, meter, renderMastery } from "./ui.js";

/* ── Learn tab state ───────────────────────────────────────────────────────── */

const ls = {
  cat: "All",
  search: "",
  view: "cards",   // "cards" | "families" | "results"
  fc: { items:[], idx:0, flipped:false },
};

/* ── Flashcards ────────────────────────────────────────────────────────────── */

function renderCards() {
  const main = document.getElementById("main");
  const { items, idx, flipped } = ls.fc;
  if (!items.length) { renderLearn(); return; }
  const item = items[idx];
  const s = st(item.id);
  const pct = items.length ? Math.round(idx / items.length * 100) : 0;
  main.innerHTML = `
    <div class="fc-wrap">
      <div class="fc-progress">
        <div class="fc-bar" style="width:${pct}%"></div>
      </div>
      <p class="fc-counter">${idx+1} / ${items.length}</p>
      <div class="fc-card${flipped?" flipped":""}" id="fc-card" role="button" tabindex="0" aria-label="${flipped?"Hide":"Show"} answer">
        <div class="fc-front">
          <h2>${esc(item.name)}</h2>
          ${item.cat?`<p class="fc-cat">${esc(item.cat)}</p>`:""}
          <p class="fc-hint">Tap to reveal</p>
        </div>
        <div class="fc-back">
          ${item.spirit?`<p class="fc-spirit">${esc(item.spirit)}</p>`:""}
          <ul class="spec-list">${specLines(item)}</ul>
          ${item.note?`<p class="fc-note">${esc(item.note)}</p>`:""}
        </div>
      </div>
      ${flipped ? `<div class="fc-actions">
        <button class="btn-danger fc-btn" data-result="wrong">✗ Again</button>
        <button class="btn-warning fc-btn" data-result="hard">~ Hard</button>
        <button class="btn-primary fc-btn" data-result="right">✓ Got it</button>
      </div>` : ""}
      <button class="btn-ghost fc-skip" id="fc-skip">Skip →</button>
    </div>`;

  const card = main.querySelector("#fc-card");
  card.onclick = () => { ls.fc.flipped = !ls.fc.flipped; renderCards(); };
  card.onkeydown = e => { if(e.key===" "||e.key==="Enter"){e.preventDefault();card.click();} };
  main.querySelectorAll(".fc-btn").forEach(b => b.onclick = () => fcResult(b.dataset.result));
  main.querySelector("#fc-skip").onclick = () => { ls.fc.idx = (idx+1) % items.length; ls.fc.flipped=false; renderCards(); };
}

function fcResult(result) {
  const { items, idx } = ls.fc;
  const item = items[idx];
  import("./state.js").then(({record}) => { record(item.id, result==="right"); });
  renderMastery();
  ls.fc.idx = (idx + 1) % items.length;
  ls.fc.flipped = false;
  if (ls.fc.idx === 0) {
    ls.view = "results";
    renderLearn();
  } else {
    renderCards();
  }
}

/* ── Families view ─────────────────────────────────────────────────────────── */

function renderFamilies() {
  const main = document.getElementById("main");
  const fams = FAMILIES[state.folderKey] || [];
  if (!fams.length) { main.innerHTML = `<p class="empty">No families for this menu.</p>`; return; }
  main.innerHTML = fams.map(fam => `
    <section class="family-card" data-fam="${esc(fam.id)}">
      <h3 class="family-name">${esc(fam.name)}</h3>
      <p class="family-build">${esc(fam.build)}</p>
      ${fam.rules?.length ? `<ul class="family-rules">${fam.rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>` : ""}
      <div class="family-members">${fam.members.map(([id,diff]) => {
        const item = state.items.find(i => i.id === id);
        if (!item) return "";
        return `<div class="family-member"><strong>${esc(item.name)}</strong><span>${esc(diff)}</span></div>`;
      }).join("")}</div>
    </section>`).join("");
}

/* ── Results view ──────────────────────────────────────────────────────────── */

function renderResults() {
  const main = document.getElementById("main");
  const items = ls.fc.items;
  const strong = items.filter(i => level(i.id) === 2).length;
  const weak = items.filter(i => isWeak(i.id));
  main.innerHTML = `
    <div class="results-wrap">
      <h2>Session complete</h2>
      <p>${strong} of ${items.length} strong</p>
      ${weak.length ? `<h3>Needs work</h3><div class="weak-list">${weak.map(i=>`<span class="chip">${esc(i.name)}</span>`).join("")}</div>` : "<p>No weak spots — nice!</p>"}
      <div class="results-actions">
        <button class="btn-primary" id="res-again">Go again</button>
        <button class="btn-secondary" id="res-back">Back to menu</button>
      </div>
    </div>`;
  main.querySelector("#res-again").onclick = () => {
    ls.fc = { items: shuffle(ls.fc.items), idx:0, flipped:false };
    ls.view = "cards";
    renderCards();
  };
  main.querySelector("#res-back").onclick = () => { ls.view="cards"; renderLearn(); };
}

/* ── Main learn renderer ───────────────────────────────────────────────────── */

export function renderLearn() {
  const main = document.getElementById("main");
  if (!main) return;

  if (ls.view === "cards" && ls.fc.items.length && ls.fc.idx > 0) { renderCards(); return; }
  if (ls.view === "families") { renderFamilies(); return; }
  if (ls.view === "results") { renderResults(); return; }

  const folder = FOLDERS[state.folderKey];
  const cats = folder?.cats || [];
  const items = pool(state.folderKey, ls.cat === "All" ? null : ls.cat)
    .filter(i => !ls.search || norm(i.name).includes(norm(ls.search)) || norm(i.spirit||"").includes(norm(ls.search)));

  main.innerHTML = `
    <div class="learn-controls">
      <div id="folder-tabs" class="chip-row"></div>
      <div id="cat-chips" class="chip-row"></div>
      <div class="search-row">
        <input type="search" id="learn-search" placeholder="Search drinks…" value="${esc(ls.search)}" class="search-input">
        <button class="btn-secondary" id="btn-families">Families</button>
        <button class="btn-primary" id="btn-flashcards">Flashcards</button>
      </div>
    </div>
    <div id="mastery-overview" class="mastery-overview"></div>
    <div class="card-grid" id="card-grid">${items.map(i=>drinkCard(i,{edit:true})).join("")}</div>`;

  renderFolders(key => { ls.cat="All"; renderLearn(); });
  renderChips(cats, ls.cat, cat => { ls.cat=cat; renderLearn(); });
  renderMastery();

  const search = main.querySelector("#learn-search");
  search.oninput = () => { ls.search = search.value; renderLearn(); };

  main.querySelector("#btn-families").onclick = () => { ls.view="families"; renderFamilies(); };
  main.querySelector("#btn-flashcards").onclick = () => {
    const pool_ = items.length ? items : pool(state.folderKey, null);
    ls.fc = { items: shuffle(pool_), idx:0, flipped:false };
    ls.view = "cards";
    renderCards();
  };

  import("./state.js").then(({persist}) => {
    bindEdit(main.querySelector("#card-grid"), item => {
      const idx = state.items.findIndex(i => i.id === item.id);
      if (idx >= 0) state.items[idx] = item;
      persist();
      renderLearn();
      toast("Saved");
    });
  });
}

function norm(s) { return s.trim().toLowerCase().replace(/[^a-z0-9]/g,""); }
