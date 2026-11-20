import { FOLDERS, FAMILIES, FAM_OF } from "./data.js";
import { state, pool, st, level, isWeak, pickWeighted, record, esc, shuffle } from "./state.js";
import { renderChips, renderFolders, announce, toast, renderMastery } from "./ui.js";

/* ── Quiz state ────────────────────────────────────────────────────────────── */

const qz = {
  items: [],
  q: null,
  answered: false,
  chosen: null,
  correct: 0,
  total: 0,
  cat: "All",
};

const KIND = ["ingredients","spirit","spec","method","glass","rim","garnish","note","family"];

/* ── Question generation ───────────────────────────────────────────────────── */

export function genQuestion(items) {
  if (!items.length) return null;
  const item = pickWeighted(items);
  const kinds = KIND.filter(k => hasContent(item, k));
  if (!kinds.length) return null;
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  return buildQuestion(item, kind, items);
}

function hasContent(item, kind) {
  if (kind === "ingredients") return item.ingredients?.length > 0;
  if (kind === "spirit") return !!item.spirit;
  if (kind === "spec") return !!item.spec;
  if (kind === "method") return !!item.method;
  if (kind === "glass") return !!item.glass;
  if (kind === "rim") return !!item.rim && item.rim !== "No rim";
  if (kind === "garnish") return !!item.garnish && item.garnish !== "None";
  if (kind === "note") return !!item.note;
  if (kind === "family") return !!FAM_OF[item.id];
  if (item.qa?.length) return true;
  return false;
}

function buildQuestion(item, kind, allItems) {
  // Use item's own qa[] pairs when available
  if (item.qa?.length && Math.random() < 0.4) {
    const qa = item.qa[Math.floor(Math.random() * item.qa.length)];
    const wrongs = shuffle(qa.w).slice(0, 3);
    const opts = shuffle([qa.a, ...wrongs]);
    return { item, kind:"qa", q: qa.q, answer: qa.a, opts, hint:"" };
  }

  let q, answer, opts=[], hint="";
  const others = allItems.filter(i => i.id !== item.id);

  switch(kind) {
    case "ingredients": {
      const ings = item.ingredients || [];
      if (!ings.length) return null;
      const target = ings[Math.floor(Math.random() * ings.length)];
      q = `Which drink contains "${target}"?`;
      answer = item.name;
      opts = distractorNames(item, others, 3);
      break;
    }
    case "spirit":
      q = `What is the base spirit in ${item.name}?`;
      answer = item.spirit;
      opts = others.filter(i=>i.spirit&&i.spirit!==item.spirit).slice(0,3).map(i=>i.spirit);
      if(opts.length<3) opts.push("No spirit","Cognac","Rum");
      opts = shuffle(uniq([answer,...opts.slice(0,3)]));
      break;
    case "spec":
      q = `What goes in a ${item.name}?`;
      answer = item.spec ? item.spec.split("\n")[0] : (item.ingredients||[])[0];
      if (!answer) return null;
      opts = distractorNames(item, others, 3);
      hint = "First ingredient / spec line";
      break;
    case "method":
      q = `How is a ${item.name} prepared?`;
      answer = item.method;
      opts = shuffle(["Shake","Stir","Build","Blend"].filter(m=>m!==answer)).slice(0,3);
      opts = shuffle([answer,...opts]);
      break;
    case "glass":
      q = `What glass does a ${item.name} go in?`;
      answer = [].concat(item.glass)[0];
      opts = shuffle(["Coupette","Rocks","Highball","Wine glass","Clay vaso"].filter(g=>g!==answer)).slice(0,3);
      opts = shuffle([answer,...opts]);
      break;
    case "rim":
      q = `What rim does a ${item.name} get?`;
      answer = item.rim;
      opts = shuffle(["No rim","Half rock salt","Half Tajín","Full pink salt","Full Tajín","Full smoked salt"].filter(r=>r!==answer)).slice(0,3);
      opts = shuffle([answer,...opts]);
      break;
    case "garnish":
      q = `What garnish goes on a ${item.name}?`;
      answer = item.garnish;
      opts = distractorNames(item, others, 3);
      hint = "Garnish";
      break;
    case "note":
      q = `Which drink is described as: "${item.note.slice(0,80)}…"?`;
      answer = item.name;
      opts = distractorNames(item, others, 3);
      break;
    case "family": {
      const famData = FAM_OF[item.id];
      if (!famData) return null;
      q = `Which drink family does ${item.name} belong to?`;
      answer = famData.fam.name;
      const otherFams = Object.values(FAM_OF).map(f=>f.fam.name).filter(n=>n!==answer);
      opts = shuffle(uniq(otherFams)).slice(0,3);
      opts = shuffle([answer,...opts]);
      break;
    }
    default:
      return null;
  }

  if (!answer || !opts.length) return null;
  if (!opts.includes(answer)) opts = shuffle([answer, ...shuffle(opts).slice(0,3)]);
  return { item, kind, q, answer, opts, hint };
}

function distractorNames(item, others, n) {
  return shuffle(others).slice(0, n).map(i => i.name).concat(
    ["Mezcalita","Tommy's","Palomita","Jalisco Mule"].filter(n => n !== item.name)
  ).slice(0, n);
}

function uniq(a) { return [...new Set(a)]; }

/* ── Quiz renderers ────────────────────────────────────────────────────────── */

function startQuiz() {
  qz.items = pool(state.folderKey, qz.cat === "All" ? null : qz.cat);
  if (!qz.items.length) { toast("No items in this category"); return; }
  qz.q = genQuestion(qz.items);
  qz.answered = false;
  qz.chosen = null;
  qz.correct = 0;
  qz.total = 0;
  renderQuiz();
}

function answer(choice) {
  if (qz.answered || !qz.q) return;
  qz.answered = true;
  qz.chosen = choice;
  const correct = choice === qz.q.answer;
  if (correct) qz.correct++;
  qz.total++;
  record(qz.q.item.id, correct);
  renderMastery();
  renderQuiz();
}

function nextQ() {
  qz.q = genQuestion(qz.items);
  qz.answered = false;
  qz.chosen = null;
  renderQuiz();
}

export function renderQuiz() {
  const main = document.getElementById("main");
  if (!main) return;

  const folder = FOLDERS[state.folderKey];
  const cats = folder?.cats || [];

  if (!qz.q) {
    main.innerHTML = `
      <div class="quiz-start">
        <div id="folder-tabs" class="chip-row"></div>
        <div id="cat-chips" class="chip-row"></div>
        <div id="mastery-overview" class="mastery-overview"></div>
        <div class="quiz-info">
          <p>Test your knowledge with randomised questions.</p>
          <button class="btn-primary btn-lg" id="btn-start-quiz">Start quiz</button>
        </div>
      </div>`;
    renderFolders(() => { qz.cat="All"; renderQuiz(); });
    renderChips(cats, qz.cat, cat => { qz.cat=cat; renderQuiz(); });
    renderMastery();
    main.querySelector("#btn-start-quiz").onclick = startQuiz;
    return;
  }

  const { q, answer: ans, opts, hint, item, kind } = qz.q;
  main.innerHTML = `
    <div class="quiz-wrap">
      <div class="quiz-score">${qz.correct}/${qz.total} correct</div>
      <div class="quiz-q">
        <p class="quiz-question">${esc(q)}</p>
        ${hint ? `<p class="quiz-hint">${esc(hint)}</p>` : ""}
        <div class="quiz-opts">
          ${opts.map(o => {
            let cls = "quiz-opt";
            if (qz.answered) {
              if (o === ans) cls += " correct";
              else if (o === qz.chosen) cls += " wrong";
            }
            return `<button class="quiz-opt${qz.answered?(o===ans?" correct":o===qz.chosen?" wrong":""):""}" data-opt="${esc(o)}"${qz.answered?" disabled":""}>${esc(o)}</button>`;
          }).join("")}
        </div>
      </div>
      ${qz.answered ? `
        <div class="quiz-feedback ${qz.chosen===ans?"quiz-right":"quiz-wrong"}">
          <strong>${qz.chosen===ans?"Correct!":"Wrong"}</strong>
          ${qz.chosen!==ans ? `<span>Answer: ${esc(ans)}</span>` : ""}
        </div>
        <button class="btn-primary" id="btn-next">Next question →</button>
        <button class="btn-ghost" id="btn-quit">Quit</button>
      ` : ""}
    </div>`;

  if (!qz.answered) {
    main.querySelectorAll(".quiz-opt").forEach(b => b.onclick = () => answer(b.dataset.opt));
  }
  if (qz.answered) {
    main.querySelector("#btn-next").onclick = nextQ;
    main.querySelector("#btn-quit").onclick = () => { qz.q=null; qz.answered=false; renderQuiz(); };
  }
}

// Keyboard shortcut: 1-4 for answer options
document.addEventListener("keydown", e => {
  if (!qz.q || qz.answered) return;
  const n = parseInt(e.key);
  if (n >= 1 && n <= qz.q.opts.length) {
    answer(qz.q.opts[n-1]);
  }
});
