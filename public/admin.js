import { SEED_MENUS } from "./data.js";
import { state, esc, st, level, isWeak } from "./state.js";
import { toast, confirmDialog, announce } from "./ui.js";
import {
  listMembers, listAllProgress, updateMember, batchSetRole, approveStaff, suspendMember,
  saveMenuMeta, saveMenuItem, deleteMenuItem, loadMenuItems,
  seedBuiltinMenus, seedRailConfig, ensureConfigApp,
} from "./sync.js";

/* ── Admin dashboard state ──────────────────────────────────────────────────── */

const adm = {
  tab: "people",         // "people" | "progress" | "menus" | "editor" | "seed"
  members: null,         // cached member list
  progress: null,        // cached progress docs
  editMenu: null,        // menuId being edited
  editItem: null,        // itemId being edited (null = new)
};

const TABS = [
  ["people",   "People"],
  ["progress", "Team Progress"],
  ["menus",    "Menus"],
  ["editor",   "Menu Editor"],
  ["seed",     "Seed & Migrate"],
];

const POSITIONS = ["Bar","Runner","Floor","Kitchen"];
const POSITION_MENUS = {
  Bar:     ["cantina-drinks","cocina","house","classics"],
  Runner:  ["cantina-drinks","cantina-food","cocina"],
  Floor:   ["cantina-drinks","cantina-food","cocina"],
  Kitchen: ["cantina-food"],
};

/* ── Main render ────────────────────────────────────────────────────────────── */

export function renderAdmin() {
  const main = document.getElementById("main");
  if (!main) return;

  main.innerHTML = `
    <div class="admin-wrap">
      <div class="admin-tabs" role="tablist">
        ${TABS.map(([k,l]) => `<button role="tab" class="admin-tab${adm.tab===k?" active":""}" data-tab="${k}" aria-selected="${adm.tab===k}">${l}</button>`).join("")}
      </div>
      <div class="admin-panel" id="admin-panel"></div>
    </div>`;

  main.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => {
    adm.tab = b.dataset.tab;
    renderAdmin();
  });

  const panel = document.getElementById("admin-panel");
  switch (adm.tab) {
    case "people":   renderPeople(panel); break;
    case "progress": renderProgress(panel); break;
    case "menus":    renderMenus(panel); break;
    case "editor":   renderEditor(panel); break;
    case "seed":     renderSeed(panel); break;
  }
}

/* ── People tab ─────────────────────────────────────────────────────────────── */

async function renderPeople(panel) {
  panel.innerHTML = `<div class="spinner" role="status" aria-label="Loading"></div>`;
  try {
    adm.members = await listMembers();
  } catch(e) {
    panel.innerHTML = `<p class="msg msg-error">Could not load members: ${esc(e.message)}</p>`;
    return;
  }

  const pending  = adm.members.filter(m => m.status === "pending");
  const active   = adm.members.filter(m => m.status === "active");
  const disabled = adm.members.filter(m => m.status === "disabled");

  panel.innerHTML = `
    ${pending.length ? `<section class="admin-section">
      <h3>Waiting for approval (${pending.length})</h3>
      <ul class="member-list">${pending.map(m => memberRow(m, true)).join("")}</ul>
    </section>` : ""}
    <section class="admin-section">
      <h3>Active (${active.length})</h3>
      <ul class="member-list">${active.map(m => memberRow(m, false)).join("")}</ul>
    </section>
    ${disabled.length ? `<section class="admin-section">
      <h3>Disabled (${disabled.length})</h3>
      <ul class="member-list">${disabled.map(m => memberRow(m, false)).join("")}</ul>
    </section>` : ""}`;

  panel.querySelectorAll("[data-approve]").forEach(b => b.onclick = () => openApproveDialog(b.dataset.approve));
  panel.querySelectorAll("[data-role-change]").forEach(b => b.onclick = () => openRoleDialog(b.dataset.roleChange));
  panel.querySelectorAll("[data-suspend]").forEach(b => b.onclick = () => {
    const m = adm.members.find(x => x.id === b.dataset.suspend);
    confirmDialog(`Suspend ${m.displayName || m.email}?`, async () => {
      await suspendMember(m.id);
      toast("Account suspended");
      adm.members = null;
      renderAdmin();
    });
  });
  panel.querySelectorAll("[data-reinstate]").forEach(b => b.onclick = async () => {
    await updateMember(b.dataset.reinstate, { status:"pending" });
    toast("Account reinstated to pending");
    adm.members = null;
    renderAdmin();
  });
}

function memberRow(m, isPending) {
  const isSelf = m.id === state.user?.uid;
  return `<li class="member-row">
    <div class="member-info">
      <strong>${esc(m.displayName || "(no name)")}</strong>
      <span class="muted">${esc(m.email)}</span>
      <span class="badge">${esc(m.role)}</span>
      ${m.position ? `<span class="badge badge-pos">${esc(m.position)}</span>` : ""}
      <span class="badge badge-${m.status}">${esc(m.status)}</span>
    </div>
    <div class="member-actions">
      ${isPending ? `<button class="btn btn-sm btn-primary" data-approve="${m.id}">Approve</button>` : ""}
      ${!isPending && m.status!=="disabled" && !isSelf ? `<button class="btn btn-sm btn-secondary" data-role-change="${m.id}">Edit role</button>` : ""}
      ${m.status==="active" && !isSelf ? `<button class="btn btn-sm btn-ghost" data-suspend="${m.id}">Suspend</button>` : ""}
      ${m.status==="disabled" ? `<button class="btn btn-sm btn-ghost" data-reinstate="${m.id}">Reinstate</button>` : ""}
    </div>
  </li>`;
}

function openApproveDialog(uid) {
  const m = adm.members.find(x => x.id === uid);
  const d = document.createElement("dialog");
  d.className = "dialog";
  d.innerHTML = `
    <h2 class="panel-title">Approve ${esc(m.displayName || m.email)}</h2>
    <form id="approve-form">
      <label>Position
        <select name="position" required>
          <option value="">— choose —</option>
          ${POSITIONS.map(p => `<option value="${p}">${p}</option>`).join("")}
        </select>
      </label>
      <label>Role
        <select name="role">
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" id="ap-cancel">Cancel</button>
        <button type="submit" class="btn-primary">Approve</button>
      </div>
    </form>`;
  document.body.appendChild(d);
  d.showModal();
  document.getElementById("ap-cancel").onclick = () => d.close();
  document.getElementById("approve-form").onsubmit = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const position = data.get("position");
    const role = data.get("role");
    if (!position) { toast("Choose a position"); return; }
    const menus = POSITION_MENUS[position] || [];
    try {
      await approveStaff(uid, { position, role, menus });
      if (role === "admin" && m.role !== "admin") await batchSetRole(uid, "admin", m.role);
      toast(`${m.displayName || m.email} approved as ${position}`);
      adm.members = null;
      d.close();
      renderAdmin();
    } catch(err) { toast("Error: " + err.message); }
  };
}

function openRoleDialog(uid) {
  const m = adm.members.find(x => x.id === uid);
  const d = document.createElement("dialog");
  d.className = "dialog";
  d.innerHTML = `
    <h2 class="panel-title">Edit ${esc(m.displayName || m.email)}</h2>
    <form id="role-form">
      <label>Position
        <select name="position">
          ${POSITIONS.map(p => `<option value="${p}"${m.position===p?" selected":""}>${p}</option>`).join("")}
        </select>
      </label>
      <label>Role
        <select name="role">
          <option value="staff"${m.role==="staff"?" selected":""}>Staff</option>
          <option value="admin"${m.role==="admin"?" selected":""}>Admin</option>
        </select>
      </label>
      <label>Menus (comma-separated IDs)
        <input type="text" name="menus" value="${esc((m.menus||[]).join(","))}">
      </label>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" id="role-cancel">Cancel</button>
        <button type="submit" class="btn-primary">Save</button>
      </div>
    </form>`;
  document.body.appendChild(d);
  d.showModal();
  document.getElementById("role-cancel").onclick = () => d.close();
  document.getElementById("role-form").onsubmit = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const position = data.get("position");
    const role = data.get("role");
    const menus = data.get("menus").split(",").map(x=>x.trim()).filter(Boolean);
    try {
      if (role !== m.role) await batchSetRole(uid, role, m.role);
      await updateMember(uid, { position, menus });
      toast("Saved");
      adm.members = null;
      d.close();
      renderAdmin();
    } catch(err) { toast("Error: " + err.message); }
  };
}

/* ── Team Progress tab ──────────────────────────────────────────────────────── */

async function renderProgress(panel) {
  panel.innerHTML = `<div class="spinner" role="status" aria-label="Loading"></div>`;
  try {
    if (!adm.members) adm.members = await listMembers();
    adm.progress = await listAllProgress();
  } catch(e) {
    panel.innerHTML = `<p class="msg msg-error">Could not load data: ${esc(e.message)}</p>`;
    return;
  }

  const rows = adm.members.filter(m => m.status === "active").map(m => {
    const prog = adm.progress.find(p => p.id === m.id);
    const mastery = prog?.mastery || {};
    const ids = Object.keys(mastery);
    const seen = ids.filter(id => mastery[id]?.seen > 0).length;
    const strong = ids.filter(id => {
      const s = mastery[id] || {};
      return s.seen > 0 && s.correct / s.seen >= 0.85 && s.streak >= 3;
    }).length;
    const weak = ids.filter(id => {
      const s = mastery[id] || {};
      return s.seen > 0 && s.correct / s.seen < 0.5;
    });
    const lastActive = prog?.lastActive ? new Date(prog.lastActive).toLocaleDateString() : "—";
    return { m, seen, strong, weak, lastActive };
  });

  panel.innerHTML = `
    <section class="admin-section">
      <h3>Active staff (${rows.length})</h3>
      <table class="progress-table">
        <thead><tr><th>Name</th><th>Position</th><th>Seen</th><th>Strong</th><th>Weak spots</th><th>Last active</th></tr></thead>
        <tbody>${rows.map(r => `<tr>
          <td>${esc(r.m.displayName||r.m.email)}</td>
          <td>${esc(r.m.position||"—")}</td>
          <td class="num">${r.seen}</td>
          <td class="num">${r.strong}</td>
          <td class="weak-list">${r.weak.slice(0,5).map(id => {
            const item = state.items.find(i=>i.id===id);
            return item ? `<span class="chip">${esc(item.name)}</span>` : "";
          }).join("")}${r.weak.length>5?`<span class="muted">+${r.weak.length-5}</span>`:""}</td>
          <td>${r.lastActive}</td>
        </tr>`).join("")}</tbody>
      </table>
    </section>`;
}

/* ── Menus tab ──────────────────────────────────────────────────────────────── */

async function renderMenus(panel) {
  panel.innerHTML = `
    <section class="admin-section">
      <h3>Menus</h3>
      <ul class="menu-list">${SEED_MENUS.map(m => `<li class="menu-row">
        <div>
          <strong>${esc(m.name)}</strong>
          <span class="muted">${esc(m.id)}</span>
          <span class="badge">${esc(m.type)}</span>
        </div>
        <div class="menu-actions">
          <button class="btn btn-sm btn-secondary" data-edit-menu="${esc(m.id)}">Edit items</button>
        </div>
      </li>`).join("")}</ul>
    </section>`;

  panel.querySelectorAll("[data-edit-menu]").forEach(b => b.onclick = () => {
    adm.editMenu = b.dataset.editMenu;
    adm.tab = "editor";
    renderAdmin();
  });
}

/* ── Menu Editor tab ────────────────────────────────────────────────────────── */

async function renderEditor(panel) {
  if (!adm.editMenu) {
    panel.innerHTML = `<p class="lede">Select a menu from the Menus tab.</p>`;
    return;
  }
  panel.innerHTML = `<div class="spinner" role="status" aria-label="Loading"></div>`;
  let items;
  try {
    items = await loadMenuItems(adm.editMenu);
  } catch(e) {
    panel.innerHTML = `<p class="msg msg-error">Could not load items: ${esc(e.message)}</p>`;
    return;
  }

  const menuMeta = SEED_MENUS.find(m => m.id === adm.editMenu);
  panel.innerHTML = `
    <section class="admin-section">
      <div class="row">
        <h3>${esc(menuMeta?.name||adm.editMenu)} · ${items.length} items</h3>
        <button class="btn btn-sm btn-primary" id="btn-new-item">+ New item</button>
      </div>
      <ul class="item-list">${items.map(item => `<li class="item-row">
        <span class="grow"><strong>${esc(item.name)}</strong> <span class="muted">${esc(item.cat||"")}</span></span>
        <button class="btn btn-sm btn-secondary" data-edit-item="${esc(item.id)}">Edit</button>
        <button class="btn btn-sm btn-ghost" data-delete-item="${esc(item.id)}">Delete</button>
      </li>`).join("")}</ul>
    </section>`;

  document.getElementById("btn-new-item").onclick = () => openItemEditor(null, {});
  panel.querySelectorAll("[data-edit-item]").forEach(b => {
    b.onclick = () => {
      const item = items.find(i => i.id === b.dataset.editItem);
      openItemEditor(item.id, item);
    };
  });
  panel.querySelectorAll("[data-delete-item]").forEach(b => {
    b.onclick = () => {
      const item = items.find(i => i.id === b.dataset.deleteItem);
      confirmDialog(`Delete "${item.name}"?`, async () => {
        await deleteMenuItem(adm.editMenu, item.id);
        toast("Item deleted");
        renderAdmin();
      });
    };
  });
}

function openItemEditor(itemId, item) {
  const d = document.createElement("dialog");
  d.className = "dialog editor-dialog";
  d.innerHTML = `
    <form id="item-form">
      <h2 class="panel-title">${itemId ? "Edit item" : "New item"}</h2>
      <label>ID (slug, no spaces)<input type="text" name="id" value="${esc(itemId||"")}" ${itemId?"readonly":"required"}></label>
      <label>Name<input type="text" name="name" value="${esc(item.name||"")}" required></label>
      <label>Category<input type="text" name="cat" value="${esc(item.cat||"")}"></label>
      <label>Price<input type="text" name="price" value="${esc(item.price||"")}"></label>
      <label>Spirit<input type="text" name="spirit" value="${esc(item.spirit||"")}"></label>
      <label>Ingredients (one per line)<textarea name="ingredients" rows="4">${esc((item.ingredients||[]).join("\n"))}</textarea></label>
      <label>Spec<textarea name="spec" rows="6">${esc(item.spec||"")}</textarea></label>
      <label>Note<textarea name="note" rows="2">${esc(item.note||"")}</textarea></label>
      <div class="dialog-actions">
        <button type="button" class="btn-secondary" id="item-cancel">Cancel</button>
        <button type="submit" class="btn-primary">Save</button>
      </div>
    </form>`;
  document.body.appendChild(d);
  d.showModal();
  document.getElementById("item-cancel").onclick = () => d.close();
  document.getElementById("item-form").onsubmit = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const id = data.get("id").trim();
    if (!id) { toast("ID is required"); return; }
    const updated = {
      id,
      name: data.get("name").trim(),
      cat: data.get("cat").trim(),
      price: data.get("price").trim(),
      spirit: data.get("spirit").trim(),
      ingredients: data.get("ingredients").split("\n").map(x=>x.trim()).filter(Boolean),
      spec: data.get("spec").trim(),
      note: data.get("note").trim(),
      folder: adm.editMenu.split("-")[0],
    };
    try {
      await saveMenuItem(adm.editMenu, id, updated);
      toast("Saved");
      d.close();
      renderAdmin();
    } catch(err) { toast("Error: " + err.message); }
  };
}

/* ── Seed & Migrate tab ─────────────────────────────────────────────────────── */

function renderSeed(panel) {
  panel.innerHTML = `
    <section class="admin-section">
      <h3>Seed built-in menus</h3>
      <p class="lede">This writes all built-in Cantina, Corrochio's, House, and Top 50 items to Firestore. Run this once after deploying, before staff sign in. Existing items in Firestore will be overwritten.</p>
      <button class="btn btn-primary" id="btn-seed-menus">Import built-in menus</button>
      <div id="seed-log" class="seed-log" aria-live="polite"></div>
    </section>
    <section class="admin-section">
      <h3>Seed rail config</h3>
      <p class="lede">Write the RAIL ingredient reference to <code>config/rail</code> in Firestore.</p>
      <button class="btn btn-secondary" id="btn-seed-rail">Seed rail</button>
    </section>
    <section class="admin-section">
      <h3>Bootstrap admin config</h3>
      <p class="lede">Create the <code>config/app</code> document with <code>adminCount: 1</code> if it doesn't exist.</p>
      <button class="btn btn-secondary" id="btn-seed-config">Ensure config/app</button>
    </section>`;

  document.getElementById("btn-seed-menus").onclick = async () => {
    const log = document.getElementById("seed-log");
    const btn = document.getElementById("btn-seed-menus");
    btn.disabled = true;
    log.textContent = "";
    try {
      await seedBuiltinMenus(msg => { log.textContent = msg; announce(msg); });
      toast("All menus seeded!");
    } catch(e) { log.textContent = "Error: " + e.message; toast("Failed: " + e.message); }
    btn.disabled = false;
  };

  document.getElementById("btn-seed-rail").onclick = async () => {
    try { await seedRailConfig(); toast("Rail config seeded"); } catch(e) { toast("Error: " + e.message); }
  };

  document.getElementById("btn-seed-config").onclick = async () => {
    try { await ensureConfigApp(); toast("config/app ready"); } catch(e) { toast("Error: " + e.message); }
  };
}
