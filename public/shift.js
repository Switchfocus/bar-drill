import { BUILD, ING, fmtAmt, normRim, FOLDERS, FAMILIES, FAM_OF } from "./data.js";
import { state, record, st, persist, load, save, esc, norm } from "./state.js";
import { announce, toast, renderMastery, drinkCard } from "./ui.js";

/* ── Shift mode constants ───────────────────────────────────────────────────── */

const VENUES = [["cantina","Cantina"],["cocina","Corrochio's"],["extras","House"],["classics","Top 50"],["all","All"]];
const KIND_OF = i => ({Beer:"beer",Cerveza:"beer",Wine:"wine",Vino:"wine",Softs:"soft",Shots:"shot"})[i.cat] || "cocktail";
const POUR_RANK = {"Juices":1,"Syrups & cordials":2,"Bitters, sauces & extras":3,"Liqueurs & vermouth":4,"Spirits & prebatches":5};
const METHOD_RANK = {"Dry shake, wet shake, double strain":1,"Shake & double strain":2,"Shake":3,"Stir":4,"Build":5};

const STAGES = [
  ["glass","Glassware","Line up every glass first so nothing waits."],
  ["rim","Rims","Rim before you pour so nothing drips into the drink."],
  ["pour","Pours","One bottle at a time: pour it into every tin that needs it, then put it back. Citrus and syrups first, spirit last, so a mistake wastes less."],
  ["mix","Shake, stir, build","Dry shakes first, they take longest. Then shake the rest back to back so they all land cold."],
  ["top","Top up","Top fizz last so it stays lively."],
  ["serve","Beer, wine, softs & shots","Last, so they're cold and fresh when they go out."],
  ["garnish","Garnish & send","Garnish, check the ticket, send."],
];

/* ── SVG icons (inline to avoid circular import) ───────────────────────────── */

const CHECK  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const BACK   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`;
const ARROW  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const EYE    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SUN    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const TICKET = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z"/><path d="M8.5 8h7M8.5 12h7"/></svg>`;
const MINUS  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>`;
const TRASH  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>`;
const BULB   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>`;
const RETRY  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4v6h6"/><path d="M5.6 15a8 8 0 1 0 1.9-8.3L4 10"/></svg>`;
const SEARCH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;
const PLUS   = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;

/* ── Shift state ────────────────────────────────────────────────────────────── */

let shift = load("cbd_shift", null);
let shiftTimer = null;
let wakeLock = null;
let shiftUid = 0;

function freshShift() {
  return { stage:"pick", venue:state.folderKey==="classics"?"all":state.folderKey, q:"", order:[], checks:{}, revealed:{}, view:"drink", recall:false, started:null, ended:null, memory:{} };
}
if (!shift || !Array.isArray(shift.order)) shift = freshShift();
shiftUid = shift.order.reduce((m,l) => Math.max(m, l.uid), 0);

const saveShift = () => save("cbd_shift", shift);
const itemById = id => state.items.find(i => i.id === id);
const variantsOf = i => BUILD[i.id] ? Object.keys(BUILD[i.id]).filter(Boolean) : [];
const counts = () => load("cbd_shiftcounts", {});

function famTip(item, variant) {
  if (FAM_OF[item.id]) return FAM_OF[item.id];
  const b = BUILD[item.id]; if (!b) return null;
  for (const id in FAM_OF) { const t = BUILD[id]; if (t && (t===b || t[variant]===b[variant])) return FAM_OF[id]; }
  return null;
}

function guideFor(item, variant) {
  const kind = KIND_OF(item);
  const g = { kind, glass:null, rim:null, pours:[], method:null, tops:[], garnish:null, serve:null, tips:[], source:"none" };
  const b = BUILD[item.id] && (BUILD[item.id][variant] ?? BUILD[item.id][Object.keys(BUILD[item.id])[0]]);
  if (b) {
    g.source = "house"; g.glass = b.glass.join(" or "); g.rim = normRim(b.rim)==="No rim"?null:normRim(b.rim);
    g.method = b.method; g.garnish = b.garnish==="None"?null:b.garnish;
    Object.entries(b.ings).forEach(([k,v]) => {
      const u = ING[k].unit, row = { key:k, label:ING[k].label, amt:fmtAmt(k,v), ml:u==="ml"?v:null, rank:POUR_RANK[ING[k].group]||3 };
      (u==="top"||u==="side" ? g.tops : g.pours).push(row);
    });
    g.pours.sort((a,b) => a.rank - b.rank);
  } else if (item.spec) {
    g.source = item.folder==="classics" ? "generic" : "house";
    g.glass=item.glass||null; g.rim=item.rim&&item.rim!=="None"?item.rim:null;
    g.method=item.method||null; g.garnish=item.garnish&&item.garnish!=="None"?item.garnish:null;
    item.spec.split("\n").filter(Boolean).forEach((l, n) => {
      const m = l.match(/^((?:\d+(?:\.\d+)?(?:–\d+(?:\.\d+)?)?|½)\s?(?:ml|dashes|dash|drops|drop|tsp)?|Pinch(?: of)?|Splash)\s+(.+)$/i);
      if (/^top\b/i.test(l)) g.tops.push({ key:"t"+n, label:l.replace(/^top\s*/i,""), amt:"Top" });
      else g.pours.push({ key:"s"+n, label:m?m[2]:l, amt:m?m[1]:"", ml:m&&/ml$/i.test(m[1])?parseFloat(m[1]):null, rank:guessRank(m?m[2]:l) });
    });
  } else {
    if (kind==="shot") g.pours = item.ingredients.map((x,n) => ({ key:"i"+n, label:x, amt:"", rank:n }));
    g.serve = { beer:/Draught/i.test(item.ingredients.join())?"Pour the draught":"Open the bottle and serve", wine:"Pour the size the guest asked for", soft:"Serve chilled", shot:"Serve as a caballito (shot)", cocktail:"Make as per the menu" }[kind];
  }
  const fam = famTip(item, variant);
  if (fam) g.tips.push(`${fam.fam.name}: ${fam.diff}`);
  if (item.note) g.tips.push(item.note);
  if (g.source==="generic") g.tips.push("Classic spec: check how the house makes it.");
  if (g.source==="none"&&kind==="cocktail") g.tips.push("No house spec on file yet: ask the team.");
  return g;
}

function guessRank(t) {
  t = norm(t);
  if (/lime|lemon|grapefruit|orange juice|pineapple|clamato|juice|cafe de olla|water/.test(t)) return 1;
  if (/syrup|gomme|simple|agave|honey|grenadine|sugar|orgeat|cordial|demerara/.test(t)) return 2;
  if (/bitters|dash|egg|salt|maggi|worcestershire|sauce|mint|cream/.test(t)) return 3;
  if (/vermouth|liqueur|cointreau|curacao|campari|chartreuse|maraschino|lillet|benedictine|aperol|kahlua|cacao|violette|sherry|montenegro|heering|applejack/.test(t)) return 4;
  return 5;
}

const canon = t => norm(t).replace(/\(.*?\)/g,"").replace(/\b(fresh|juice|top|of)\b/g,"").replace(/[^a-z0-9%]+/g," ").trim().replace(/s$/,"");

function stepsFor(g) {
  const s = [];
  if (g.glass) s.push({ key:"glass", stage:"glass", label:"Glass", val:g.glass });
  if (g.rim) s.push({ key:"rim", stage:"rim", label:"Rim", val:g.rim });
  g.pours.forEach(p => s.push({ key:"p:"+p.key, stage:g.kind==="shot"?"serve":"pour", label:p.label, val:p.amt, amt:p.amt, ml:p.ml, rank:p.rank }));
  if (g.method) s.push({ key:"method", stage:"mix", label:"Method", val:g.method, rank:METHOD_RANK[g.method]||4 });
  g.tops.forEach(t => s.push({ key:"t:"+t.key, stage:"top", label:t.label, val:t.amt, amt:t.amt }));
  if (g.garnish) s.push({ key:"garnish", stage:"garnish", label:"Garnish", val:g.garnish });
  if (g.serve) s.push({ key:"serve", stage:"serve", label:"Serve", val:g.serve });
  return s;
}

const ck = (l, k) => !!shift.checks[l.uid+"|"+k];
function lineInfo(l) { const item = itemById(l.id); if (!item) return null; const g = guideFor(item,l.variant); return { item, g, steps:stepsFor(g) }; }
function progress() { let done=0, all=0; shift.order.forEach(l => { const L=lineInfo(l); if(!L)return; all+=L.steps.length; done+=L.steps.filter(s=>ck(l,s.key)).length }); return { done, all }; }

const fmtTime = ms => { const s=Math.max(0,Math.floor(ms/1000)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; };
const vName = v => v ? ({"classic":"Classic","spicy":"Spicy","tequila":"Tequila","mezcal":"Mezcal","vodka":"Vodka","Clásica":"Clásica"}[v]||v) : "";
const qtyTotal = () => shift.order.reduce((a,l) => a+l.qty, 0);

/* ── Main entry ─────────────────────────────────────────────────────────────── */

export function renderShift(focusSel) {
  document.body.classList.add("shift-mode");
  clearInterval(shiftTimer);
  if (shift.stage==="make") return renderMake(focusSel);
  if (shift.stage==="done") return renderDone(focusSel);
  return renderPick(focusSel);
}

/* ── 1. Take the order ──────────────────────────────────────────────────────── */

function drinksFor(venue) {
  return state.items.filter(i => ["cantina","cocina","extras","classics"].includes(i.folder) && (venue==="all"||i.folder===venue) && i.cat!=="Food" && i.cat!=="House info" && (i.ingredients.length||BUILD[i.id]) && i.id!=="x-cafeolla");
}

function renderPick(focusSel) {
  const q = norm(shift.q.trim());
  const list = drinksFor(shift.venue).filter(i => !q || norm([i.name,i.cat,...i.ingredients].join(" ")).includes(q));
  const inOrder = id => shift.order.filter(l=>l.id===id).reduce((a,l)=>a+l.qty, 0);
  const cnt = counts();
  const top = Object.keys(cnt).filter(id => itemById(id)&&(shift.venue==="all"||itemById(id).folder===shift.venue)).sort((a,b)=>cnt[b]-cnt[a]).slice(0,6);
  const row = i => {
    const n = inOrder(i.id);
    return `<li><button type="button" class="pk-row ${n?"on":""}" data-add="${esc(i.id)}" aria-label="Add ${esc(i.name)}${n?`, ${n} on the ticket`:""}">
      <span class="grow"><span class="pk-name">${esc(i.name)}</span><span class="pk-sub">${[i.price,shift.venue==="all"?FOLDERS[i.folder]?.name:"",BUILD[i.id]?"":(i.spec?"":"menu only")].filter(Boolean).map(esc).join(" · ")}</span></span>
      ${n?`<span class="qty-badge num">${n}</span>`:`<span class="add" aria-hidden="true">${PLUS}</span>`}</button></li>`;
  };
  let groups = "";
  const cats = [...new Set(list.map(i => (shift.venue==="all"?FOLDERS[i.folder]?.name+" · ":"")+i.cat))];
  cats.forEach(c => {
    const l = list.filter(i => (shift.venue==="all"?FOLDERS[i.folder]?.name+" · ":"")+i.cat===c);
    groups += `<h3 class="section-title">${esc(c)} <span class="n">${l.length}</span></h3><ul class="pk-list">${l.map(row).join("")}</ul>`;
  });
  document.getElementById("main").innerHTML = `<h2 class="sr-only">Shift: take the order</h2>
    <section class="shift-head"><span class="eyebrow">Shift mode</span><p class="step-h" style="margin:2px 0 0">What's on the ticket?</p><p class="lede">Tap each drink as it comes in. Then hit Start and I'll walk you through making it.</p></section>
    <div class="folder-tabs" role="group" aria-label="Menu" style="margin-top:var(--s-3)">${VENUES.map(([k,l])=>`<button type="button" data-venue="${k}" aria-pressed="${shift.venue===k}">${l}</button>`).join("")}</div>
    <div class="search">${SEARCH}<label for="pk-q" class="sr-only">Search drinks</label><input id="pk-q" type="search" placeholder="Search drinks" autocomplete="off" value="${esc(shift.q)}"></div>
    ${!q&&top.length?`<h3 class="section-title">Most made</h3><div class="quick">${top.map(id=>`<button type="button" class="chip" data-add="${esc(id)}">${esc(itemById(id).name)}</button>`).join("")}</div>`:""}
    ${groups||`<p class="empty">No drinks match "${esc(shift.q)}".</p>`}
    <div class="actionbar"><div class="btns">
      <button type="button" class="btn" id="sh-ticket" ${shift.order.length?"":"disabled"}>${TICKET} Ticket <span class="num">(${qtyTotal()})</span></button>
      <button type="button" class="btn btn-primary grow2" id="sh-start" ${shift.order.length?"":"disabled"}>${shift.order.length?`Start making ${ARROW}`:"Add drinks to start"}</button>
    </div></div>`;

  document.querySelectorAll("[data-venue]").forEach(b => b.onclick = () => { shift.venue=b.dataset.venue; saveShift(); renderPick(`[data-venue="${shift.venue}"]`); });
  document.querySelectorAll("[data-add]").forEach(b => b.onclick = () => addDrink(b.dataset.add, b));
  const pkq = document.getElementById("pk-q");
  pkq.oninput = e => { shift.q=e.target.value; const p=e.target.selectionStart; renderPick("#pk-q"); document.getElementById("pk-q").setSelectionRange(p,p); };
  document.getElementById("sh-ticket").onclick = ticketSheet;
  document.getElementById("sh-start").onclick = startMaking;
  if (focusSel) document.querySelector(focusSel)?.focus();
}

function addDrink(id) {
  const item = itemById(id), vs = variantsOf(item);
  const put = v => {
    const ex = shift.order.find(l => l.id===id&&l.variant===v);
    if (ex) ex.qty++; else shift.order.push({ uid:++shiftUid, id, variant:v, qty:1 });
    const c = counts(); c[id] = (c[id]||0)+1; save("cbd_shiftcounts", c); saveShift();
    renderPick(`[data-add="${CSS.escape(id)}"].pk-row`);
    toast(`Added ${item.name}${v?" · "+vName(v):""}`);
  };
  if (vs.length < 2) { put(vs[0]||""); return; }
  _openShiftDialog(`<h2 class="panel-title" id="dlg-title">${esc(item.name)}</h2><p class="lede">Which one?</p>
    <div class="opts" style="margin-top:var(--s-3)">${vs.map(v=>`<button type="button" class="opt" data-v="${esc(v)}"><span class="opt-check" aria-hidden="true">${CHECK}</span><span class="opt-text"><span class="opt-label">${esc(vName(v))}</span></span></button>`).join("")}</div>
    <div class="btns"><button type="button" class="btn" id="v-cancel">Cancel</button></div>`);
  document.getElementById("v-cancel").onclick = _closeShiftDialog;
  document.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { _closeShiftDialog(); put(b.dataset.v); });
}

function ticketSheet() {
  const draw = () => {
    const dlg = document.querySelector(".dialog");
    dlg.innerHTML = `<h2 class="panel-title" id="dlg-title">Ticket · <span class="num">${qtyTotal()}</span> drinks</h2>
      ${shift.order.length ? `<ul class="tk-list">${shift.order.map(l => {
        const i = itemById(l.id);
        return `<li><span class="grow"><strong>${esc(i?i.name:l.id)}</strong>${l.variant?` <span class="variant">${esc(vName(l.variant))}</span>`:""}</span>
          <span class="stepper-qty"><button type="button" class="btn btn-icon" data-dec="${l.uid}" aria-label="One less ${esc(i?i.name:"")}">${l.qty>1?MINUS:TRASH}</button><span class="num" aria-live="polite">${l.qty}</span><button type="button" class="btn btn-icon" data-inc="${l.uid}" aria-label="One more ${esc(i?i.name:"")}">${PLUS}</button></span></li>`;
      }).join("")}</ul>` : `<p class="empty">The ticket's empty.</p>`}
      <div class="btns">${shift.order.length?`<button type="button" class="btn btn-danger-outline" id="tk-clear">Clear</button>`:""}<button type="button" class="btn btn-primary" id="tk-done">Done</button></div>`;
    dlg.querySelectorAll("[data-inc]").forEach(b => b.onclick = () => { shift.order.find(l=>l.uid==b.dataset.inc).qty++; saveShift(); draw(); dlg.querySelector(`[data-inc="${b.dataset.inc}"]`).focus(); });
    dlg.querySelectorAll("[data-dec]").forEach(b => b.onclick = () => { const l=shift.order.find(x=>x.uid==b.dataset.dec); l.qty--; if(l.qty<1) shift.order=shift.order.filter(x=>x!==l); saveShift(); draw(); (dlg.querySelector(`[data-dec="${b.dataset.dec}"]`)||dlg.querySelector("#tk-done")).focus(); });
    if (document.getElementById("tk-clear")) document.getElementById("tk-clear").onclick = () => { shift.order=[]; shift.checks={}; saveShift(); draw(); document.getElementById("tk-done").focus(); };
    document.getElementById("tk-done").onclick = () => { _closeShiftDialog(); window.render?.(); };
  };
  _openShiftDialog("<div></div>"); draw(); document.getElementById("tk-done")?.focus();
}

function startMaking() {
  if (!shift.order.length) return;
  if (!shift.started) shift.view = new Set(shift.order.map(l=>l.id+l.variant)).size > 1 ? "run" : "drink";
  shift.stage = "make"; if (!shift.started) shift.started = Date.now();
  saveShift(); renderShift("#mk-title"); window.scrollTo(0,0);
  announce(`Making ${qtyTotal()} drinks.`);
}

/* ── 2. Make it ─────────────────────────────────────────────────────────────── */

function stepBtn(l, s, tag="") {
  const on = ck(l, s.key), hide = shift.recall && s.amt && !shift.revealed[l.uid+"|"+s.key] && !on;
  const isPour = s.key.startsWith("p:") || s.key.startsWith("t:");
  const extra = l.qty>1&&s.ml ? ` <span class="x2 num">×${l.qty} = ${s.ml*l.qty}ml</span>` : "";
  const main = isPour
    ? `${hide?`<span class="amt-hide">? ml</span>`:`<span class="mk-amt num">${esc(s.amt)}</span>`} ${esc(s.label)}${hide?"":extra}`
    : `<span class="mk-k">${esc(s.label)}</span> ${esc(s.val)}`;
  return `<li><button type="button" class="mk-step ${on?"done":""}" data-l="${l.uid}" data-k="${esc(s.key)}" aria-pressed="${on}">
    <span class="opt-check" aria-hidden="true">${CHECK}</span><span class="grow">${tag?`<span class="mk-tag">${esc(tag)}</span>`:""}<span class="mk-main">${main}</span>${hide?`<span class="sr-only">. Amount hidden: tap to reveal</span>`:""}</span></button></li>`;
}

function drinkCardMake(l) {
  const L = lineInfo(l); if (!L) return "";
  const { item, g, steps } = L;
  const done = steps.filter(s=>ck(l,s.key)).length, all = done===steps.length;
  const src = {house:"House spec",generic:"Classic spec",none:"Menu only"}[g.source];
  return `<article class="mk-card ${all?"complete":""}" aria-labelledby="mk-${l.uid}">
    <header class="mk-head">
      ${l.qty>1?`<span class="qty-badge num" aria-label="${l.qty} of these">×${l.qty}</span>`:""}
      <div class="grow"><h3 class="card-title" id="mk-${l.uid}">${esc(item.name)}${l.variant?` <span class="variant">${esc(vName(l.variant))}</span>`:""}</h3><span class="pk-sub">${esc(src)} · ${esc(FOLDERS[item.folder]?.name||item.folder)}</span></div>
      <span class="mk-count num" aria-label="${done} of ${steps.length} steps done">${all?CHECK:`${done}/${steps.length}`}</span>
    </header>
    ${all ? `<button type="button" class="link" data-reopen="${l.uid}">Done. Show steps again</button>` : `
    ${g.tips.length?`<details class="tips" ${shift.recall?"":"open"}><summary>${BULB} Remember</summary><ul>${g.tips.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></details>`:""}
    <ol class="mk-steps">${steps.map(s=>stepBtn(l,s)).join("")}</ol>`}
  </article>`;
}

function buildGroups() {
  const out = [];
  STAGES.forEach(([st, title, tip]) => {
    const rows = [];
    shift.order.forEach(l => {
      const L = lineInfo(l); if (!L) return;
      L.steps.filter(s=>s.stage===st).forEach(s => rows.push({ l, s, name:lineName(L,l) }));
    });
    if (!rows.length) return;
    const by = new Map();
    rows.forEach(r => {
      const k = st==="pour"||st==="top" ? canon(r.s.label) : st==="serve" ? "u"+r.l.uid+r.s.key : r.s.val;
      if (!by.has(k)) by.set(k,[]);
      by.get(k).push(r);
    });
    let groups = [...by.entries()].map(([k,rs], i) => ({
      key: st+"|"+k, stage:st, rows:rs, i,
      title: st==="pour"||st==="top" ? rs[0].s.label : st==="serve" ? rs[0].name : rs[0].s.val,
      rank: st==="pour" ? Math.min(...rs.map(r=>r.s.rank??3)) : st==="mix" ? (METHOD_RANK[rs[0].s.val]||4) : 0,
      units: rs.reduce((a,r)=>a+r.l.qty, 0),
    }));
    groups.sort((a,b) => a.rank-b.rank || b.units-a.units || a.i-b.i);
    out.push({ st, title, tip, groups });
  });
  return out;
}

const lineName = (L, l) => L.item.name + (l.variant?` (${vName(l.variant)})`:"") + (l.qty>1?` ×${l.qty}`:"");
const gDone = g => g.rows.filter(r=>ck(r.l,r.s.key)).length;

function groupMeta(g) {
  const n = g.units, d = n===1 ? "1 drink" : `${n} drinks`;
  if (g.stage==="glass") return n===1 ? "1 glass" : `${n} glasses`;
  if (g.stage==="pour") { const mls = g.rows.map(r=>r.s.ml!=null?r.s.ml*r.l.qty:null); return mls.every(x=>x!=null)?`${d} · ${mls.reduce((a,b)=>a+b,0)}ml total`:d; }
  if (g.stage==="mix") return n>1 ? `${d}, back to back` : d;
  return d;
}

function subBtn(r) {
  const { l, s } = r, on = ck(l,s.key), hide = shift.recall&&s.amt&&!shift.revealed[l.uid+"|"+s.key]&&!on;
  const amt = s.amt ? (hide?`<span class="amt-hide">? ml</span>`:`<span class="mk-amt num">${esc(s.amt)}${l.qty>1?" each":""}</span>${l.qty>1&&s.ml?` <span class="x2 num">= ${s.ml*l.qty}ml</span>`:""}`) : "";
  return `<li><button type="button" class="mk-step sub ${on?"done":""}" data-l="${l.uid}" data-k="${esc(s.key)}" aria-pressed="${on}">
    <span class="opt-check" aria-hidden="true">${CHECK}</span><span class="grow mk-main"><span class="sub-name">${esc(r.name)}</span>${amt?`<span class="sub-amt">${amt}</span>`:""}</span>${hide?`<span class="sr-only">. Amount hidden: tap to reveal</span>`:""}</button></li>`;
}

function groupHTML(g, isNext) {
  const done = gDone(g), all = g.rows.length, gstate = done===all?"true":done?"mixed":"false";
  const single = all === 1;
  if (single && g.stage!=="pour" && g.stage!=="top") {
    const r = g.rows[0];
    return `<li class="grp ${gstate==="true"?"complete":""} ${isNext?"next":""}">${isNext?`<span class="next-tag">Up next</span>`:""}<ol class="mk-steps flat">${stepBtn(r.l,{...r.s,label:"",val:r.s.val},r.name)}</ol></li>`;
  }
  if (single) {
    const r = g.rows[0], on = ck(r.l,r.s.key), hide = shift.recall&&r.s.amt&&!shift.revealed[r.l.uid+"|"+r.s.key]&&!on;
    const amt = r.s.amt ? (hide?`<span class="amt-hide">? ml</span>`:`<span class="mk-amt num">${esc(r.s.amt)}${r.l.qty>1?" each":""}</span>${r.l.qty>1&&r.s.ml?` <span class="x2 num">= ${r.s.ml*r.l.qty}ml</span>`:""}`) : "";
    return `<li class="grp ${on?"complete":""} ${isNext?"next":""}">${isNext?`<span class="next-tag">Up next</span>`:""}<button type="button" class="mk-step grp-head ${on?"done":""}" data-l="${r.l.uid}" data-k="${esc(r.s.key)}" aria-pressed="${on}">
      <span class="opt-check" aria-hidden="true">${CHECK}</span><span class="grow"><span class="grp-title">${esc(g.title)}</span><span class="grp-meta">${esc(r.name)}${amt?" · ":""}${amt}</span></span>${hide?`<span class="sr-only">. Amount hidden: tap to reveal</span>`:""}</button></li>`;
  }
  const hideAll = shift.recall && g.rows.some(r=>r.s.amt&&!shift.revealed[r.l.uid+"|"+r.s.key]&&!ck(r.l,r.s.key));
  const safeKey = esc(g.key).replace(/[^a-zA-Z0-9]/g,"_");
  return `<li class="grp ${gstate==="true"?"complete":""} ${isNext?"next":""}">${isNext?`<span class="next-tag">Up next</span>`:""}
    <button type="button" class="mk-step grp-head ${gstate==="true"?"done":gstate==="mixed"?"part":""}" data-g="${esc(g.key)}" aria-pressed="${gstate}" aria-describedby="gm-${safeKey}">
      <span class="opt-check" aria-hidden="true">${gstate==="mixed"?MINUS:CHECK}</span>
      <span class="grow"><span class="grp-title">${esc(g.title)}</span><span class="grp-meta" id="gm-${safeKey}">${hideAll?groupMeta(g).replace(/ · \d+ml total/,""):groupMeta(g)}${gstate==="mixed"?` · ${done}/${all} done`:""}</span></span>
      <span class="grp-action" aria-hidden="true">${gstate==="true"?"Undo":hideAll?"Reveal":"All"}</span>
    </button>
    ${gstate==="true"?"":`<ul class="grp-subs" aria-label="${esc(g.title)}: each drink">${g.rows.map(subBtn).join("")}</ul>`}
  </li>`;
}

function runSheet() {
  const stages = buildGroups(); let nextKey = null;
  for (const S of stages) { const g=S.groups.find(g=>gDone(g)<g.rows.length); if(g){nextKey=g.key;break} }
  return stages.map(S => {
    const done = S.groups.filter(g=>gDone(g)===g.rows.length).length;
    return `<section class="rs-stage ${done===S.groups.length?"complete":""}" aria-labelledby="rs-${S.st}"><div class="row"><h3 class="rs-title" id="rs-${S.st}">${esc(S.title)}</h3><span class="mk-count num" aria-label="${done} of ${S.groups.length} done">${done===S.groups.length?CHECK:`${done}/${S.groups.length}`}</span></div>
      ${done===S.groups.length?"":`<p class="rs-tip">${esc(S.tip)}</p>`}<ul class="grp-list">${S.groups.map(g=>groupHTML(g,g.key===nextKey)).join("")}</ul></section>`;
  }).join("");
}

function tickGroup(key) {
  const g = buildGroups().flatMap(S=>S.groups).find(x=>x.key===key); if (!g) return;
  const hidden = g.rows.filter(r=>shift.recall&&r.s.amt&&!shift.revealed[r.l.uid+"|"+r.s.key]&&!ck(r.l,r.s.key));
  if (hidden.length) {
    hidden.forEach(r => shift.revealed[r.l.uid+"|"+r.s.key]=true);
    saveShift(); renderMake(`[data-g="${CSS.escape(key)}"]`);
    announce(g.rows.map(r=>`${r.name}: ${r.s.amt}`).join(". ")); return;
  }
  const allOn = gDone(g) === g.rows.length;
  g.rows.forEach(r => { const k=r.l.uid+"|"+r.s.key; if(allOn) delete shift.checks[k]; else shift.checks[k]=true; });
  saveShift();
  const { done, all } = progress();
  if (allOn) { renderMake(`[data-g="${CSS.escape(key)}"]`); return; }
  const groups = buildGroups().flatMap(S=>S.groups), nx = groups.find(x=>gDone(x)<x.rows.length);
  renderMake(nx ? (nx.rows.length>1||nx.stage==="pour"||nx.stage==="top" ? `[data-g="${CSS.escape(nx.key)}"]` : `.mk-step[data-l="${nx.rows[0].l.uid}"][data-k="${CSS.escape(nx.rows[0].s.key)}"]`) : "#mk-finish");
  announce(`${g.title} done for ${g.units===1?"1 drink":g.units+" drinks"}.`);
  if (done===all) toast("All done. Send it!");
}

function renderMake(focusSel) {
  const { done, all } = progress();
  document.getElementById("main").innerHTML = `<h2 class="sr-only">Shift: make the order</h2>
    <section class="shift-head"><div class="row"><span class="eyebrow">Making · <span class="num">${qtyTotal()}</span> drinks</span><span class="timer num" id="mk-timer" aria-label="Time on this order">${fmtTime(Date.now()-shift.started)}</span></div>
      <p class="step-h" id="mk-title" tabindex="-1" style="margin:2px 0 0">${done===all?"All done. Send it!":`${all-done} step${all-done===1?"":"s"} to go`}</p>
      <div class="bar quiz" role="progressbar" aria-label="Order progress" aria-valuemin="0" aria-valuemax="${all}" aria-valuenow="${done}"><span style="width:${all?done/all*100:0}%"></span></div></section>
    <div class="mk-tools">
      <div class="seg grow" role="group" aria-label="View"><button type="button" data-view="drink" aria-pressed="${shift.view==="drink"}">By drink</button><button type="button" data-view="run" aria-pressed="${shift.view==="run"}">Run sheet</button></div>
      <button type="button" class="tool" id="mk-recall" aria-pressed="${shift.recall}" title="Hide amounts until you tap">${EYE}<span>Recall</span></button>
      <button type="button" class="tool" id="mk-wake" aria-pressed="${!!wakeLock}" title="Keep the screen on">${SUN}<span>Awake</span></button>
    </div>
    ${shift.recall?`<p class="lede">Recall mode: say the amount, then tap to check it. Tap again to tick it off.</p>`:""}
    ${shift.view==="run" ? runSheet() : shift.order.map(drinkCardMake).join("")}
    <div class="actionbar"><div class="btns"><button type="button" class="btn" id="mk-edit">${BACK} Ticket</button><button type="button" class="btn ${done===all?"btn-brand":"btn-primary"} grow2" id="mk-finish">${done===all?CHECK+" Order sent":"Finish order"}</button></div></div>`;

  shiftTimer = setInterval(() => { const t=document.getElementById("mk-timer"); if(!t||shift.stage!=="make") return clearInterval(shiftTimer); t.textContent=fmtTime(Date.now()-shift.started); }, 1000);
  document.querySelectorAll("[data-view]").forEach(b => b.onclick = () => { shift.view=b.dataset.view; saveShift(); renderMake(`[data-view="${shift.view}"]`); });
  document.getElementById("mk-recall").onclick = () => { shift.recall=!shift.recall; saveShift(); renderMake("#mk-recall"); };
  document.getElementById("mk-wake").onclick = toggleWake;
  document.querySelectorAll("[data-reopen]").forEach(b => b.onclick = () => { const l=shift.order.find(x=>x.uid==b.dataset.reopen); lineInfo(l).steps.forEach(s=>delete shift.checks[l.uid+"|"+s.key]); saveShift(); renderMake(`#mk-${l.uid}`); });
  document.querySelectorAll(".mk-step[data-l]").forEach(b => b.onclick = () => tickStep(+b.dataset.l, b.dataset.k));
  document.querySelectorAll("[data-g]").forEach(b => b.onclick = () => tickGroup(b.dataset.g));
  document.getElementById("mk-edit").onclick = () => { shift.stage="pick"; saveShift(); renderShift(); window.scrollTo(0,0); };
  document.getElementById("mk-finish").onclick = () => {
    const go = () => { shift.stage="done"; shift.ended=Date.now(); saveShift(); renderShift("#dn-title"); window.scrollTo(0,0); };
    if (done < all) {
      _openShiftDialog(`<h2 class="panel-title">Finish with steps unticked?</h2><p class="lede">That's fine if you made it anyway. The ticks are only there to guide you.</p><div class="btns"><button class="btn" id="fin-no">Keep going</button><button class="btn btn-primary" id="fin-yes">Finish</button></div>`);
      document.getElementById("fin-no").onclick = _closeShiftDialog;
      document.getElementById("fin-yes").onclick = () => { _closeShiftDialog(); go(); };
    } else go();
  };
  if (focusSel) document.querySelector(focusSel)?.focus();
}

function tickStep(uid, key) {
  const l = shift.order.find(x => x.uid===uid);
  const k = uid+"|"+key, L = lineInfo(l), s = L.steps.find(x=>x.key===key);
  if (shift.recall && s.amt && !shift.revealed[k] && !shift.checks[k]) {
    shift.revealed[k]=true; saveShift();
    renderMake(`.mk-step[data-l="${uid}"][data-k="${CSS.escape(key)}"]`);
    announce(`${s.amt} ${s.label}`); return;
  }
  if (shift.checks[k]) delete shift.checks[k]; else shift.checks[k] = true;
  saveShift();
  const lineDone = L.steps.every(x=>ck(l,x.key)), { done, all } = progress();
  const btns = [...document.querySelectorAll(".mk-step[data-l]")];
  const i = btns.findIndex(b => b.dataset.l==uid && b.dataset.k===key);
  const nextBtn = btns.slice(i+1).find(b => b.getAttribute("aria-pressed")!=="true");
  const nextSel = nextBtn ? `.mk-step[data-l="${nextBtn.dataset.l}"][data-k="${CSS.escape(nextBtn.dataset.k)}"]` : "#mk-finish";
  renderMake(shift.checks[k] ? (lineDone&&shift.view==="drink" ? `#mk-${uid}` : nextSel) : `.mk-step[data-l="${uid}"][data-k="${CSS.escape(key)}"]`);
  if (done===all) { announce("Every step done. Send it."); toast("All done. Send it!"); }
  else if (lineDone&&shift.checks[k]) announce(`${L.item.name} done.`);
}

async function toggleWake() {
  try {
    if (wakeLock) { await wakeLock.release(); wakeLock=null; toast("Screen can sleep again"); }
    else { wakeLock=await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release",()=>{wakeLock=null;}); toast("Screen will stay on"); }
  } catch { wakeLock=null; toast("This browser can't keep the screen on here"); }
  if (shift.stage==="make") renderMake("#mk-wake");
}

/* ── 3. Done: quick self-check feeds mastery ────────────────────────────────── */

function renderDone(focusSel) {
  const t = fmtTime((shift.ended||Date.now())-shift.started), n = qtyTotal();
  const lines = shift.order.map(l => ({ l, item:itemById(l.id) })).filter(x => x.item);
  document.getElementById("main").innerHTML = `<h2 class="sr-only">Shift: order done</h2>
    <section class="card result" aria-labelledby="dn-title"><div class="result-head ok"><span class="result-score num" aria-hidden="true">${t}</span>
      <div><h3 class="panel-title" id="dn-title" tabindex="-1">Order sent</h3><p class="lede">${n} drink${n>1?"s":""} in ${t}.</p></div></div>
      <div class="r-sec"><p class="sub-h">Did you make these from memory?</p>
      <ul class="dn-list">${lines.map(({l,item}) => {
        const m = shift.memory[l.uid];
        return `<li><span class="grow"><strong>${esc(item.name)}</strong>${l.variant?` <span class="variant">${esc(vName(l.variant))}</span>`:""}</span>
          <span class="seg dn-seg" role="group" aria-label="${esc(item.name)} from memory?"><button type="button" data-mem="${l.uid}" data-v="1" aria-pressed="${m===true}">Yes</button><button type="button" data-mem="${l.uid}" data-v="0" aria-pressed="${m===false}">Peeked</button></span></li>`;
      }).join("")}</ul>
      <p class="lede" style="padding-bottom:var(--s-3)">Your answers count towards mastery, so the drinks you peeked at come up more in Quiz and Bar.</p></div>
    </section>
    <div class="actionbar"><div class="btns"><button type="button" class="btn" id="dn-again">${RETRY} Repeat</button><button type="button" class="btn btn-primary grow2" id="dn-new">New order ${ARROW}</button></div></div>`;

  document.querySelectorAll("[data-mem]").forEach(b => b.onclick = () => {
    const uid = +b.dataset.mem, ok = b.dataset.v==="1", l = shift.order.find(x=>x.uid===uid), prev = shift.memory[uid];
    if (prev===ok) return;
    shift.memory[uid] = ok;
    if (prev===undefined) record(l.id, ok);
    else { const s=st(l.id); if(ok){s.correct++;s.streak++}else{s.correct=Math.max(0,s.correct-1);s.streak=0} persist(); renderMastery(); }
    saveShift(); renderDone(`[data-mem="${uid}"][data-v="${b.dataset.v}"]`);
  });

  const reset = keep => {
    const o = keep ? shift.order.map(l=>({...l,uid:++shiftUid})) : [];
    const v=shift.venue, view=shift.view, rc=shift.recall;
    shift=freshShift(); shift.venue=v; shift.view=view; shift.recall=rc; shift.order=o; saveShift();
  };
  document.getElementById("dn-again").onclick = () => { reset(true); startMaking(); };
  document.getElementById("dn-new").onclick = () => { reset(false); renderShift("#pk-q"); window.scrollTo(0,0); };
  if (focusSel) document.querySelector(focusSel)?.focus();
}

/* ── Inline dialog helper (shift-specific) ──────────────────────────────────── */

let _shiftDlg = null;
function _openShiftDialog(html) {
  if (_shiftDlg) _shiftDlg.remove();
  _shiftDlg = document.createElement("dialog");
  _shiftDlg.className = "dialog";
  _shiftDlg.innerHTML = html;
  document.body.appendChild(_shiftDlg);
  _shiftDlg.showModal();
}
function _closeShiftDialog() { _shiftDlg?.close(); _shiftDlg = null; }
