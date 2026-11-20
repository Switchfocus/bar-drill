import { DEFAULT_ITEMS } from "./data.js";
import { state, persist, applyTheme, esc } from "./state.js";
import { toast, confirmDialog, openImport } from "./ui.js";

/* ── Manage tab (personal settings for staff) ──────────────────────────────── */

export function renderManage() {
  const main = document.getElementById("main");
  if (!main) return;

  const user = state.user;
  const member = state.member;

  main.innerHTML = `
    <div class="manage-wrap">

      <section class="manage-section">
        <h2>Account</h2>
        ${user ? `
          <p class="manage-email">${esc(user.email || "")}</p>
          ${member ? `<p class="manage-role"><span class="badge">${esc(member.role)}</span> <span class="badge">${esc(member.status)}</span></p>` : ""}
          <div class="manage-row">
            <label>Display name
              <input type="text" id="display-name" value="${esc(member?.displayName || user.displayName || "")}" placeholder="Your name">
            </label>
            <button class="btn-secondary" id="btn-save-name">Save</button>
          </div>
          <button class="btn-ghost" id="btn-sign-out">Sign out</button>
        ` : `<p><a href="#" id="link-sign-in">Sign in to sync progress</a></p>`}
      </section>

      <section class="manage-section">
        <h2>Appearance</h2>
        <div class="theme-row">
          <button class="btn-secondary${state.settings.theme==="light"?" active":""}" data-theme="light">Light</button>
          <button class="btn-secondary${!state.settings.theme||state.settings.theme==="auto"?" active":""}" data-theme="auto">Auto</button>
          <button class="btn-secondary${state.settings.theme==="dark"?" active":""}" data-theme="dark">Dark</button>
        </div>
      </section>

      <section class="manage-section">
        <h2>Progress</h2>
        <p class="manage-info">Your quiz scores, streaks, and mastery data are stored locally and synced to the cloud when signed in.</p>
        <button class="btn-danger" id="btn-reset-progress">Reset progress</button>
      </section>

      <section class="manage-section">
        <h2>Data</h2>
        <div class="manage-actions">
          <button class="btn-secondary" id="btn-export">Export items</button>
          <button class="btn-secondary" id="btn-import">Import items</button>
          <button class="btn-ghost" id="btn-reset-items">Reset to defaults</button>
        </div>
      </section>

      <section class="manage-section manage-privacy">
        <h2>Transparency notice</h2>
        <p>When you are signed in, Bar Drill stores:</p>
        <ul>
          <li>Your email address and display name</li>
          <li>Your role and assigned menus (set by an admin)</li>
          <li>Quiz scores, mastery data, and activity (last 90 days)</li>
        </ul>
        <p>Admins can see your team progress summary. Your quiz scores and answers are not shared with other staff.</p>
        <p>Data is stored in Firebase (Google Cloud) and is not shared outside the team.</p>
      </section>

    </div>`;

  // Theme buttons
  main.querySelectorAll("[data-theme]").forEach(b => b.onclick = () => {
    applyTheme(b.dataset.theme);
    persist();
    renderManage();
  });

  // Save display name
  main.querySelector("#btn-save-name")?.addEventListener("click", async () => {
    const name = main.querySelector("#display-name").value.trim();
    if (!name) { toast("Name cannot be empty"); return; }
    try {
      const { updateDisplayName } = await import("./sync.js");
      await updateDisplayName(name);
      toast("Name saved");
    } catch(e) { toast("Could not save: " + e.message); }
  });

  // Sign out
  main.querySelector("#btn-sign-out")?.addEventListener("click", async () => {
    const { signOut } = await import("./auth.js");
    signOut();
  });

  // Sign in link
  main.querySelector("#link-sign-in")?.addEventListener("click", e => {
    e.preventDefault();
    window.showSignIn?.();
  });

  // Reset progress
  main.querySelector("#btn-reset-progress").onclick = () => {
    confirmDialog("Reset all quiz progress and mastery? This cannot be undone.", () => {
      state.mastery = {};
      state.activity = {};
      persist();
      toast("Progress reset");
      renderManage();
    });
  };

  // Export items
  main.querySelector("#btn-export").onclick = () => {
    const json = JSON.stringify(state.items, null, 2);
    const blob = new Blob([json], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bar-drill-items.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // Import items
  main.querySelector("#btn-import").onclick = () => {
    openImport(imported => {
      state.items = [...state.items, ...imported.filter(i => !state.items.find(x=>x.id===i.id))];
      persist();
      toast(`Imported ${imported.length} items`);
      renderManage();
    });
  };

  // Reset items to defaults
  main.querySelector("#btn-reset-items").onclick = () => {
    confirmDialog("Reset all items to built-in defaults? Custom changes will be lost.", () => {
      state.items = DEFAULT_ITEMS();
      persist();
      toast("Items reset to defaults");
      renderManage();
    });
  };
}
