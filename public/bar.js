import { BUILD, RAIL, ING, AMOUNTS, FIXED, GLASSES, METHODS, RIMS, GARNISHES, GLASS_ICON, VLABEL, fmtAmt, normRim } from "./data.js";
import { state, st, pickWeighted, record, persist, esc, norm } from "./state.js";
import { announce, toast, renderMastery, drinkCard } from "./ui.js";

/* ── Bar mode constants ─────────────────────────────────────────────────────── */

const STEPS = ["Glass","Rim","Pour","Method","Garnish","Review"];
const RIM_TYPES = ["Rock salt","Pink salt","Smoked salt","Maldon rock salt","Tajín","Tajín + sugar","Chamoy + Tajín","Charred tortilla salt","Toasted coconut & Tajín sugar","Tamarind + chamoy + candied sesame"];
const METHOD_INFO = {
  "Build":"Straight into the glass",
  "Shake":"Shake hard with ice, single strain",
  "Shake & double strain":"Fine strain to catch ice chips",
  "Dry shake, wet shake, double strain":"For egg white or a coffee foam",
  "Stir":"Stir with ice, strain",
};

/* ── SVG icon helper (inline — avoids circular import of ICON) ─────────────── */

const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const CROSS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const BACK  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`;
const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const EYE   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
const ALERT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.1"/></svg>`;
const EDIT  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg>`;
const PLUS  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;
const RETRY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4v6h6"/><path d="M5.6 15a8 8 0 1 0 1.9-8.3L4 10"/></svg>`;
const SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── Bar state ──────────────────────────────────────────────────────────────── */

let bar = null;

function barPool() {
  return state.items.filter(i => i.folder === state.folderKey && BUILD[i.id]);
}

function newTicket(avoid) {
  const p = barPool();
  if (!p.length) { bar = null; return; }
  const item = pickWeighted(p.filter(i => i.id !== avoid) || p);
  const vs = Object.keys(BUILD[item.id]);
  const variant = vs[Math.random() * vs.length | 0];
  bar = {
    item, variant,
    spec: BUILD[item.id][variant],
    sel: { glass:null, noRim:false, rimCov:null, rimType:null, ings:{}, method:null, garnish:null },
    step: 0, hint: false, result: null, practice: false,
    cat: Object.keys(RAIL)[0], q: "", gq: "", attempted: false, fromReview: false,
  };
}

const selRim = s => s.noRim ? "No rim" : (s.rimCov && s.rimType ? `${s.rimCov} ${s.rimType}` : null);
const stepDone = (i, s=bar?.sel) => s ? [!!s.glass, !!selRim(s), Object.keys(s.ings).length>0, !!s.method, !!s.garnish, false][i] : false;
const allDone = () => [0,1,2,3,4].every(i => stepDone(i));

/* ── HTML helpers ───────────────────────────────────────────────────────────── */

function stripText() {
  const s = bar.sel, n = Object.keys(s.ings).length;
  return [s.glass||"Glass", selRim(s)||"Rim", n ? `${n} pour${n>1?"s":""}` : "Pours", s.method||"Method", s.garnish||"Garnish"]
    .map((t,i) => `<span class="${stepDone(i)?"":"todo"}">${esc(t)}</span>`)
    .join('<span class="dot" aria-hidden="true">·</span>');
}

function stepper() {
  return `<ol class="stepper">${STEPS.map((l,i) => {
    const done=i<5&&stepDone(i), miss=bar.attempted&&i<5&&!done, cur=bar.step===i;
    const s = cur?"current":done?"done":miss?"missing":"todo";
    return `<li class="${s}"><button type="button" data-step="${i}" ${cur?'aria-current="step"':""}><span class="st-dot" aria-hidden="true">${done&&!cur?CHECK:miss&&!cur?"!":i+1}</span><span class="st-label">${l}</span><span class="sr-only">, ${cur?"current step":done?"done":miss?"missing":"to do"}</span></button></li>`;
  }).join("")}</ol>`;
}

function ticketHTML() {
  const { item, variant } = bar;
  const vl = VLABEL[variant] || variant;
  const p = barPool();
  const nailed = p.filter(i => st(i.id).bar === true).length;
  return `<section class="ticket" aria-labelledby="t-name">
    <div class="row"><span class="eyebrow">Order · ${esc(item.cat)}</span><span class="meter-label"><b class="num">${nailed}</b>/${p.length} nailed</span></div>
    <div class="ticket-main"><h2 class="ticket-name" id="t-name" tabindex="-1">${esc(item.name)}</h2>${vl?`<span class="variant">${esc(vl)}</span>`:""}</div>
    ${bar.hint
      ? `<div class="hint-box"><span class="tag">Practice · hint used</span><p><strong>On the menu:</strong> ${esc(item.ingredients.join(", "))}${item.note?`. ${esc(item.note)}`:""}</p></div>`
      : bar.result ? "" : `<button type="button" class="link" id="b-hint">${EYE} Menu hint</button>`}
  </section>`;
}

function optBtn(attr, val, label, cur, extra="") {
  return `<button type="button" class="opt" ${attr}="${esc(val)}" aria-pressed="${cur===val}"><span class="opt-check" aria-hidden="true">${CHECK}</span><span class="opt-text"><span class="opt-label">${esc(label)}</span>${extra}</span></button>`;
}

function stepBody() {
  const s = bar.sel;
  const h = t => `<h3 class="step-h" id="step-h" tabindex="-1">${t}</h3>`;

  switch (bar.step) {
    case 0:
      return h("Which glass?") + `<div class="glass-grid" role="group" aria-labelledby="step-h">${
        GLASSES.map(g => `<button type="button" class="glass" data-glass="${esc(g)}" aria-pressed="${s.glass===g}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLASS_ICON[g]}</svg><span>${esc(g)}</span></button>`).join("")
      }</div>`;

    case 1:
      return h("Rim") + `<div class="opts" role="group" aria-label="No rim">${optBtn("data-norim","1","No rim",s.noRim?"1":"")}</div>
        <p class="sub-h" id="cov-h">Or rim it: how much?</p>
        <div class="seg" role="group" aria-labelledby="cov-h">${["Half","Full"].map(c=>`<button type="button" data-cov="${c}" aria-pressed="${!s.noRim&&s.rimCov===c}">${c} rim</button>`).join("")}</div>
        <p class="sub-h" id="type-h">With what?</p>
        <div class="opts" role="group" aria-labelledby="type-h">${RIM_TYPES.map(t=>optBtn("data-rtype",t,t,s.noRim?"":s.rimType)).join("")}</div>
        ${!s.noRim&&s.rimType&&!s.rimCov?`<p class="inline-hint" role="status">Now choose half or full.</p>`:""}
        ${!s.noRim&&s.rimCov&&!s.rimType?`<p class="inline-hint" role="status">Now choose what goes on the rim.</p>`:""}`;

    case 2: {
      const ks = Object.keys(s.ings);
      const q = norm(bar.q.trim());
      const list = Object.keys(ING).filter(k => q ? norm(ING[k].label).includes(q) : ING[k].group === bar.cat);
      return h("Pour") + `
        <div class="tin" aria-label="In the tin">
          <p class="sub-h" style="margin-top:0">In the tin <span class="muted num">${ks.length||""}</span></p>
          ${ks.length
            ? `<ul class="tin-list">${ks.map(k=>`<li><button type="button" class="tin-item" data-edit-ing="${k}" aria-label="${esc(ING[k].label)}, ${esc(fmtAmt(k,s.ings[k]))}. Change or remove"><span class="tin-amt num">${esc(fmtAmt(k,s.ings[k]))}</span><span class="grow">${esc(ING[k].label)}</span>${EDIT}</button></li>`).join("")}</ul>`
            : `<p class="lede" style="margin:0">Empty. Pick an ingredient below to pour it.</p>`}
        </div>
        <div class="search">${SEARCH}<label for="rail-q" class="sr-only">Search all ingredients</label><input id="rail-q" type="search" placeholder="Search all ingredients" autocomplete="off" value="${esc(bar.q)}"></div>
        ${q ? "" : `<div class="rail-tabs" role="group" aria-label="Ingredient type">${Object.keys(RAIL).map(g=>`<button type="button" data-cat="${esc(g)}" aria-pressed="${bar.cat===g}">${esc(g.split(" ")[0].replace(",",""))}</button>`).join("")}</div>`}
        <ul class="rail-list" id="rail-list" aria-label="${q?"Search results":esc(bar.cat)}">${
          list.length
            ? list.map(k => {
                const on = k in s.ings;
                return `<li><button type="button" class="rail-item ${on?"on":""}" data-ing="${k}" aria-label="${esc(ING[k].label)}${on?", in the tin, "+esc(fmtAmt(k,s.ings[k])):""}"><span class="grow">${esc(ING[k].label)}</span>${on?`<span class="amt-badge num">${esc(fmtAmt(k,s.ings[k]))}</span>`:`<span class="add" aria-hidden="true">${PLUS}</span>`}</button></li>`;
              }).join("")
            : `<li class="lede">Nothing matches "${esc(bar.q)}".</li>`
        }</ul>`;
    }

    case 3:
      return h("Method") + `<div class="opts" role="group" aria-labelledby="step-h">${
        METHODS.map(m => optBtn("data-method", m, m, s.method, `<span class="opt-desc">${esc(METHOD_INFO[m]||"")}</span>`)).join("")
      }</div>`;

    case 4: {
      const q = norm(bar.gq.trim());
      const list = GARNISHES.filter(g => !q || norm(g).includes(q));
      return h("Garnish") + `<div class="search" style="margin-top:0">${SEARCH}<label for="g-q" class="sr-only">Search garnishes</label><input id="g-q" type="search" placeholder="Search garnishes" autocomplete="off" value="${esc(bar.gq)}"></div>
        <div class="opts" role="group" aria-labelledby="step-h" style="margin-top:var(--s-3)">${
          list.map(g => optBtn("data-garnish",g,g,s.garnish)).join("") || `<p class="lede">Nothing matches.</p>`
        }</div>`;
    }

    case 5: {
      const ks = Object.keys(s.ings);
      const row = (i,label,val) => `<li class="rv ${stepDone(i)?"":"missing"}" id="rv-${i}"><div class="grow"><span class="rv-label">${label}</span>${val||`<span class="rv-missing">${ALERT} Not chosen yet</span>`}</div><button type="button" class="link" data-step="${i}" aria-label="${stepDone(i)?"Change":"Choose"} ${label.toLowerCase()}">${stepDone(i)?"Change":"Choose"}</button></li>`;
      return h("Review your build") + `<ul class="review">
        ${row(0,"Glass",s.glass&&`<span class="rv-val">${esc(s.glass)}</span>`)}
        ${row(1,"Rim",selRim(s)&&`<span class="rv-val">${esc(selRim(s))}</span>`)}
        ${row(2,"Pour",ks.length&&`<ul class="spec-lines rv-pours">${ks.map(k=>`<li><span class="amt">${esc(fmtAmt(k,s.ings[k]))}</span><span>${esc(ING[k].label)}</span></li>`).join("")}</ul>`)}
        ${row(3,"Method",s.method&&`<span class="rv-val">${esc(s.method)}</span>`)}
        ${row(4,"Garnish",s.garnish&&`<span class="rv-val">${esc(s.garnish)}</span>`)}
      </ul>${bar.hint?`<p class="lede">You used the hint, so this ticket can't be checked. Reveal the spec or move on.</p>`:""}`;
    }
  }
}

function actionBar() {
  const b = bar.step;
  const back = `<button type="button" class="btn btn-icon-text" id="b-back" ${b===0?"disabled":""}>${BACK}<span>Back</span></button>`;
  if (b === 5) {
    return bar.hint
      ? `<div class="btns"><button type="button" class="btn" id="b-reveal">Reveal spec</button><button type="button" class="btn btn-primary" id="b-next">Next ticket</button></div>`
      : `<div class="btns">${back}<button type="button" class="btn btn-brand grow2" id="b-check">${CHECK} Check build</button></div>`;
  }
  const label = bar.fromReview ? "Back to review" : `Next: ${STEPS[b+1]}`;
  return `<div class="btns">${back}<button type="button" class="btn btn-primary grow2" id="b-fwd">${label} ${ARROW}</button></div>`;
}

/* ── Render & bind ──────────────────────────────────────────────────────────── */

export function renderBar(focusSel) {
  document.body.classList.add("bar-mode");
  if (bar && !barPool().find(i => i.id === bar.item.id)) bar = null;
  if (!bar) newTicket();
  if (!bar) {
    document.getElementById("main").innerHTML = `<h2 class="sr-only">Bar mode</h2><section class="card empty-state"><h3 class="panel-title">No house builds here</h3><p class="lede">Bar mode covers the Cantina, Corrochio's and House menus.</p><div class="btns"><button type="button" class="btn btn-primary" id="b-go">Go to Cantina</button></div></section>`;
    document.getElementById("b-go").onclick = () => { state.folderKey = "cantina"; persist(); window.render?.(); };
    return;
  }
  if (bar.result) { renderResult(); return; }
  document.getElementById("main").innerHTML = `<h2 class="sr-only">Bar mode</h2>${ticketHTML()}
    <nav aria-label="Build steps">${stepper()}</nav>
    <p class="build-strip" aria-label="Your drink so far">${stripText()}</p>
    <section class="step" aria-labelledby="step-h">${stepBody()}</section>
    <div class="actionbar">${actionBar()}</div>`;
  bindBar();
  if (focusSel) document.querySelector(focusSel)?.focus();
}

function go(step, { focus=true }={}) {
  if (step === 5) bar.fromReview = false;
  bar.step = step; bar.q = ""; bar.gq = "";
  renderBar(focus ? "#step-h" : null);
  announce(`Step ${step+1} of 6: ${STEPS[step]}`);
  document.querySelector(".stepper")?.scrollIntoView({ block:"nearest" });
}

function advance() {
  setTimeout(() => {
    if (!bar || bar.result) return;
    if (bar.fromReview) { bar.fromReview = false; go(5); }
    else if (bar.step < 5) go(bar.step + 1);
  }, 220);
}

function markPressed(sel, btn) {
  document.querySelectorAll(sel).forEach(x => x.setAttribute("aria-pressed", String(x === btn)));
}

function updateStrip() {
  const el = document.querySelector(".build-strip");
  if (el) el.innerHTML = stripText();
  const st = document.querySelector(".stepper");
  if (st) {
    const newStepper = document.createElement("div");
    newStepper.innerHTML = stepper();
    st.replaceWith(newStepper.firstChild);
    document.querySelectorAll(".stepper [data-step]").forEach(b => b.onclick = () => go(+b.dataset.step));
  }
}

function bindBar() {
  const s = bar.sel;
  const M = document.getElementById("main");

  M.querySelectorAll(".stepper [data-step],.review [data-step]").forEach(b => b.onclick = () => {
    const to = +b.dataset.step; bar.fromReview = bar.step === 5 && to < 5; go(to);
  });

  if ($("b-hint")) $("b-hint").onclick = () => {
    openAmtDialog(
      `<h2 class="panel-title" id="dlg-title">Use the menu hint?</h2><p class="lede">You'll see the guest menu description. This ticket then becomes practice: you can reveal the spec, but it won't count towards your progress.</p><div class="btns"><button class="btn" id="h-no">Keep going</button><button class="btn btn-primary" id="h-yes">Show hint</button></div>`,
      { focus: "#h-no" }
    );
    document.getElementById("h-no").onclick = closeAmtDialog;
    document.getElementById("h-yes").onclick = () => {
      closeAmtDialog();
      bar.hint = true; bar.practice = true;
      renderBar("#t-name");
      announce("Hint shown. This ticket is now practice.");
    };
  };

  M.querySelectorAll("[data-glass]").forEach(b => b.onclick = () => { s.glass=b.dataset.glass; markPressed("[data-glass]",b); updateStrip(); advance(); });
  M.querySelectorAll("[data-norim]").forEach(b => b.onclick = () => { s.noRim=!s.noRim; if(s.noRim){s.rimCov=null;s.rimType=null} renderBar(); if(s.noRim) advance(); });
  M.querySelectorAll("[data-cov]").forEach(b => b.onclick = () => { s.noRim=false; s.rimCov=b.dataset.cov; renderBar(`[data-cov="${s.rimCov}"]`); if(selRim(s)) advance(); });
  M.querySelectorAll("[data-rtype]").forEach(b => b.onclick = () => { s.noRim=false; s.rimType=b.dataset.rtype; renderBar(`[data-rtype="${CSS.escape(s.rimType)}"]`); if(selRim(s)) advance(); });
  M.querySelectorAll("[data-method]").forEach(b => b.onclick = () => { s.method=b.dataset.method; markPressed("[data-method]",b); updateStrip(); advance(); });
  M.querySelectorAll("[data-garnish]").forEach(b => b.onclick = () => { s.garnish=b.dataset.garnish; markPressed("[data-garnish]",b); updateStrip(); advance(); });
  M.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => { bar.cat=b.dataset.cat; renderBar(`[data-cat="${CSS.escape(bar.cat)}"]`); });
  M.querySelectorAll("[data-ing]").forEach(b => b.onclick = () => pourSheet(b.dataset.ing));
  M.querySelectorAll("[data-edit-ing]").forEach(b => b.onclick = () => pourSheet(b.dataset.editIng));

  const rq = document.getElementById("rail-q");
  if (rq) rq.oninput = e => { bar.q=e.target.value; const pos=e.target.selectionStart; renderBar("#rail-q"); document.getElementById("rail-q")?.setSelectionRange(pos,pos); };
  const gq = document.getElementById("g-q");
  if (gq) gq.oninput = e => { bar.gq=e.target.value; const pos=e.target.selectionStart; renderBar("#g-q"); document.getElementById("g-q")?.setSelectionRange(pos,pos); };

  if ($("b-back")) $("b-back").onclick = () => { if(bar.step>0){bar.fromReview=false;go(bar.step-1)} };
  if ($("b-fwd")) $("b-fwd").onclick = () => { if(bar.fromReview){bar.fromReview=false;go(5)}else go(bar.step+1) };
  if ($("b-next")) $("b-next").onclick = () => { newTicket(bar.item.id); renderBar("#t-name"); window.scrollTo(0,0); };
  if ($("b-reveal")) $("b-reveal").onclick = () => { bar.result=checkBuild(bar.spec,bar.sel); renderBar(); };
  if ($("b-check")) $("b-check").onclick = () => {
    if (!allDone()) {
      bar.attempted = true; renderBar();
      const f = [0,1,2,3,4].find(i=>!stepDone(i));
      document.querySelector(`#rv-${f} [data-step]`)?.focus();
      announce(`Still missing: ${[0,1,2,3,4].filter(i=>!stepDone(i)).map(i=>STEPS[i]).join(", ")}.`);
      return;
    }
    bar.result = checkBuild(bar.spec, bar.sel);
    const ok = bar.result.every(r => r.ok);
    if (!bar.practice) { record(bar.item.id, ok); st(bar.item.id).bar = ok; persist(); }
    renderBar(); window.scrollTo(0,0);
    announce(ok ? "Nailed it." : `${bar.result.filter(r=>r.ok).length} of ${bar.result.length} right.`);
    renderMastery();
  };
}

/* ── Pour sheet (amount picker dialog) ─────────────────────────────────────── */

let _dlg = null;
function openAmtDialog(html, { focus="" }={}) {
  if (_dlg) _dlg.remove();
  _dlg = document.createElement("dialog");
  _dlg.className = "dialog";
  _dlg.innerHTML = html;
  document.body.appendChild(_dlg);
  _dlg.showModal();
  if (focus) _dlg.querySelector(focus)?.focus();
}
function closeAmtDialog() { _dlg?.close(); _dlg = null; }

function pourSheet(k) {
  const s = bar.sel, u = ING[k].unit, has = k in s.ings;
  if (FIXED[u]) {
    if (has) delete s.ings[k]; else s.ings[k] = 1;
    renderBar(`[data-ing="${k}"],[data-edit-ing]`);
    announce(`${ING[k].label} ${has?"removed":"added, "+FIXED[u]}`);
    if (!has) toast(`${ING[k].label} · ${FIXED[u]}`);
    return;
  }
  openAmtDialog(
    `<h2 class="panel-title" id="dlg-title">${esc(ING[k].label)}</h2>
    <p class="lede">${has?"Change the amount, or remove it.":"How much goes in?"}</p>
    <div class="amt-grid" role="group" aria-label="Amount">${AMOUNTS[u].map(a=>`<button type="button" class="amt-btn num" data-a="${a}" aria-pressed="${s.ings[k]===a}">${esc(fmtAmt(k,a))}</button>`).join("")}</div>
    <div class="btns">${has?`<button type="button" class="btn btn-danger-outline" id="p-rm">Remove</button>`:""}<button type="button" class="btn" id="p-cancel">Cancel</button></div>`,
    { focus: has ? `.amt-btn[aria-pressed="true"]` : ".amt-btn" }
  );
  document.getElementById("p-cancel").onclick = closeAmtDialog;
  if (document.getElementById("p-rm")) document.getElementById("p-rm").onclick = () => {
    delete s.ings[k]; closeAmtDialog(); renderBar();
    document.querySelector(`[data-ing="${k}"]`)?.focus();
    announce(`${ING[k].label} removed`);
  };
  _dlg.querySelectorAll("[data-a]").forEach(b => b.onclick = () => {
    s.ings[k] = +b.dataset.a; closeAmtDialog(); renderBar();
    (document.querySelector(`[data-ing="${k}"]`) || document.querySelector(`[data-edit-ing="${k}"]`))?.focus();
    announce(`${fmtAmt(k, s.ings[k])} ${ING[k].label} ${has?"updated":"added"}`);
  });
}

/* ── Check build ────────────────────────────────────────────────────────────── */

function checkBuild(spec, sel) {
  const rows = [];
  const one = (sec, label, you, want, ok) => rows.push({ sec, label, you: you||"Nothing", want, ok });
  one("Glass","Glass", sel.glass, spec.glass.join(" or "), spec.glass.includes(sel.glass));
  const want = normRim(spec.rim);
  one("Rim","Rim", selRim(sel), want, norm(selRim(sel)||"") === norm(want));
  for (const k in spec.ings) {
    const w = fmtAmt(k, spec.ings[k]);
    if (!(k in sel.ings)) rows.push({ sec:"Pour", label:ING[k].label, you:"Not poured", want:w, ok:false, kind:"missing" });
    else {
      const v = sel.ings[k], ok = FIXED[ING[k].unit] ? true : v === spec.ings[k];
      rows.push({ sec:"Pour", label:ING[k].label, you:fmtAmt(k,v), want:w, ok, kind:ok?"":" amount" });
    }
  }
  for (const k in sel.ings) {
    if (!(k in spec.ings)) rows.push({ sec:"Pour", label:ING[k].label, you:fmtAmt(k,sel.ings[k]), want:"Not in this drink", ok:false, kind:"extra" });
  }
  one("Method","Method", sel.method, spec.method, sel.method===spec.method);
  one("Garnish","Garnish", sel.garnish, spec.garnish, sel.garnish===spec.garnish);
  return rows;
}

/* ── Render result ──────────────────────────────────────────────────────────── */

function renderResult() {
  const rows = bar.result, right = rows.filter(r=>r.ok).length, all = right===rows.length, item = bar.item;
  const line = r => r.sec !== "Pour"
    ? `<li class="${r.ok?"ok":"bad"}"><span class="ck" aria-hidden="true">${r.ok?CHECK:CROSS}</span><div class="grow"><span class="sr-only">${esc(r.label)} ${r.ok?"correct":"wrong"}: </span>${r.ok?`<span class="ck-label">${esc(r.you)}</span>`:`<span class="ck-label"><s>${esc(r.you)}</s></span><span class="ck-val">Spec: <b>${esc(r.want)}</b></span>`}</div></li>`
    : `<li class="${r.ok?"ok":"bad"}"><span class="ck" aria-hidden="true">${r.ok?CHECK:CROSS}</span><div class="grow"><span class="ck-label">${esc(r.label)}<span class="sr-only">: ${r.ok?"correct":"wrong"}.</span></span>${
        r.ok ? `<span class="ck-val">${esc(r.you)}</span>`
        : r.kind==="extra" ? `<span class="ck-val"><s>${esc(r.you)}</s> · not in this drink</span>`
        : r.kind==="missing" ? `<span class="ck-val">Missing · spec is <b>${esc(r.want)}</b></span>`
        : `<span class="ck-val"><s>${esc(r.you)}</s> → <b>${esc(r.want)}</b></span>`
      }</div></li>`;
  const secs = ["Glass","Rim","Pour","Method","Garnish"];
  document.getElementById("main").innerHTML = `<h2 class="sr-only">Bar mode</h2>${ticketHTML()}
    <section class="result card" aria-labelledby="r-h">
      <div class="result-head ${all?"ok":"bad"}">
        <span class="result-score num" aria-hidden="true">${right}<small>/${rows.length}</small></span>
        <div><h3 class="panel-title" id="r-h" tabindex="-1">${bar.practice&&bar.hint?"Here's the spec":all?"Nailed it":right>=rows.length-2?"Close. A couple to fix":"Not this time"}</h3>
        <p class="lede">${bar.practice?"Practice run, so it doesn't count.":all?"Counts towards mastery.":"Marked as a weak spot. It'll come round again."}</p></div>
      </div>
      ${secs.map(sec => { const rs=rows.filter(r=>r.sec===sec); return `<div class="r-sec"><p class="sub-h">${sec}</p><ul class="checks">${rs.map(line).join("")}</ul></div>`; }).join("")}
    </section>
    <details class="member"><summary><span class="m-name">Full spec</span></summary>${drinkCard(item)}</details>
    <div class="actionbar"><div class="btns"><button type="button" class="btn" id="b-retry">${RETRY} Retry</button><button type="button" class="btn btn-primary grow2" id="b-next">Next ticket ${ARROW}</button></div></div>`;

  document.getElementById("b-next").onclick = () => { newTicket(item.id); renderBar("#t-name"); window.scrollTo(0,0); };
  document.getElementById("b-retry").onclick = () => {
    const keepHint = bar.hint;
    bar.sel = { glass:null, noRim:false, rimCov:null, rimType:null, ings:{}, method:null, garnish:null };
    bar.result = null; bar.practice = true; bar.hint = keepHint; bar.attempted = false; bar.step = 0;
    renderBar("#t-name"); window.scrollTo(0,0);
    announce("Practice run. Start with the glass.");
  };
  document.getElementById("r-h").focus();
}
