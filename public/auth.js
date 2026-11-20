/* ── Firebase auth bootstrap ────────────────────────────────────────────────── */
// Exports: initAuth({ onSignedOut, onPending, onDisabled, onActive }), signOut

import { state } from "./state.js";
import { toast, esc } from "./ui.js";
import { initSync, loadMember, createMember, loadProgress, scheduleProgressSave, flushProgress } from "./sync.js";

const FV = "10.14.1";

const ERR = {
  "auth/invalid-credential":   "That email and password don't match.",
  "auth/wrong-password":       "That email and password don't match.",
  "auth/user-not-found":       "That email and password don't match.",
  "auth/invalid-email":        "That doesn't look like a valid email.",
  "auth/email-already-in-use": "There's already an account with that email. Try signing in, or reset your password.",
  "auth/weak-password":        "Use at least 8 characters.",
  "auth/missing-password":     "Enter your password.",
  "auth/too-many-requests":    "Too many attempts. Wait a few minutes, or reset your password.",
  "auth/network-request-failed": "No connection. Check your signal and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
  "auth/popup-blocked":        "Your browser blocked the Google pop-up. Allow pop-ups and try again.",
  "auth/requires-recent-login":"For security, confirm it's you first.",
  "auth/user-disabled":        "This account has been disabled.",
  "auth/account-exists-with-different-credential": "This email already uses a different sign-in method. Try email and password.",
};
const errText = e => ERR[e?.code] || "Something went wrong. Please try again.";

let _auth = null;
let _A = null;      // firebase/auth module
let _callbacks = {};
let _mode = "signin";
let _flash = null;

/* ── Firebase init ──────────────────────────────────────────────────────────── */

async function loadFirebase() {
  const gate = document.getElementById("gate");
  gate.innerHTML = '<div class="spinner" role="status" aria-label="Loading"></div>';

  let firebaseConfig, cfgProblem = null;
  try {
    const mod = await import("./firebase-config.js?v=" + Date.now());
    firebaseConfig = mod.firebaseConfig || mod.default;
    if (!firebaseConfig) {
      cfgProblem = "The file loaded, but it doesn't export the config. The line must start with <code>export const firebaseConfig = {</code>.";
    } else if (!firebaseConfig.apiKey || /PASTE/.test(JSON.stringify(firebaseConfig))) {
      cfgProblem = "The file still has <code>PASTE_…</code> placeholders. Replace every value with the one from the Firebase console.";
    }
  } catch(e) {
    const m = String(e?.message || e);
    cfgProblem = /resolve|specifier/i.test(m)
      ? "The file contains <code>import … from \"firebase/app\"</code> or similar lines. Delete every line except the <code>export const firebaseConfig = { … };</code> block."
      : /Failed to fetch|404|dynamically imported/i.test(m)
        ? "The app can't find <b>firebase-config.js</b>. It must sit inside the <b>public</b> folder next to index.html."
        : "The file has a typing error. Browser error: <code>" + esc(m) + "</code>";
  }
  if (cfgProblem) {
    gate.innerHTML = `<main><h1 class="gate-h">BAR <span>DRILL</span></h1>
      <section class="card" aria-labelledby="cfg-t"><h2 class="panel-title" id="cfg-t">Firebase isn't connected yet</h2>
      <p style="margin-top:var(--s-2)">${cfgProblem}</p>
      <p class="lede">The file is <strong>public/firebase-config.js</strong>. The README has the full steps.</p></section></main>`;
    throw new Error("Firebase config problem");
  }

  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${FV}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${FV}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${FV}/firebase-firestore.js`),
  ]);

  const app = initializeApp(firebaseConfig);
  _A = A;
  _auth = A.getAuth(app);
  await A.setPersistence(_auth, A.browserLocalPersistence).catch(() => {});

  let db;
  try {
    db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) });
  } catch { db = F.getFirestore(app); }

  initSync(db, F);
  return { A, F, db };
}

/* ── Entry point ────────────────────────────────────────────────────────────── */

export async function initAuth(callbacks) {
  _callbacks = callbacks;
  const { A, F, db } = await loadFirebase();

  A.getRedirectResult(_auth).catch(err => _showFlash("error", errText(err)));

  A.onAuthStateChanged(_auth, async user => {
    state.user = user;
    if (!user) {
      document.body.classList.add("locked");
      _mode = "signin"; _flash = null;
      _renderGate();
      _callbacks.onSignedOut?.();
      return;
    }

    const gate = document.getElementById("gate");
    gate.innerHTML = '<div class="spinner" role="status" aria-label="Loading your profile"></div>';

    let member;
    try {
      member = await loadMember(user.uid);
    } catch(err) {
      console.error(err);
      gate.innerHTML = `<main><h1 class="gate-h">BAR <span>DRILL</span></h1>
        <section class="card" aria-labelledby="off-t"><h2 class="panel-title" id="off-t">Can't load your profile</h2>
        <p class="lede">You seem to be offline. Connect once on this device and your data will be available offline after that.</p>
        <div class="btns"><button type="button" class="btn btn-sm" id="g-out">Sign out</button><button type="button" class="btn btn-sm btn-dark" id="g-retry">Try again</button></div></section></main>`;
      document.getElementById("g-retry").onclick = () => location.reload();
      document.getElementById("g-out").onclick = () => A.signOut(_auth);
      return;
    }

    if (!member) {
      member = await createMember(user);
    }

    state.member = member;

    if (member.status === "disabled") {
      document.body.classList.remove("locked");
      _renderDisabled(member);
      _callbacks.onDisabled?.(member);
      return;
    }

    if (member.status === "pending") {
      document.body.classList.remove("locked");
      _renderWaiting(member, user);
      _callbacks.onPending?.(member);
      return;
    }

    // Active: load remote progress and boot
    document.body.classList.remove("locked");
    let remote = null;
    try { remote = await loadProgress(user.uid); } catch { /* offline — use local */ }

    _callbacks.onActive?.(remote);
  });
}

export function signOut() {
  if (_A && _auth) {
    flushProgress().then(() => _A.signOut(_auth));
  }
}

/* ── Sign-in screens ────────────────────────────────────────────────────────── */

const brandHead = sub => `<h1 class="gate-h">BAR <span>DRILL</span></h1><p class="eyebrow" style="margin:var(--s-2) 0 var(--s-4)">${sub||"Corrochio's bar trainer"}</p>`;

function pwField(id, label, ac) {
  const bad = _flash?.t==="error" && _flash.f?.includes(id) ? 'aria-invalid="true" aria-describedby="a-msg"' : "";
  return `<div class="field"><label class="field-label" for="${id}">${label}</label><div class="pw">
    <input class="input" id="${id}" type="password" autocomplete="${ac}" required ${bad}>
    <button type="button" data-show="${id}" aria-pressed="false" aria-label="Show password">Show</button></div></div>`;
}

function _renderGate() {
  const gate = document.getElementById("gate");
  const title = {signin:"Sign in",signup:"Create your account",reset:"Reset your password"}[_mode];
  const bad = id => _flash?.t==="error" && _flash.f?.includes(id) ? 'aria-invalid="true" aria-describedby="a-msg"' : "";
  gate.innerHTML = `<main id="gate-main">${brandHead()}
    <section class="card" aria-labelledby="a-title">
      <h2 class="panel-title" id="a-title">${title}</h2>
      ${_mode==="reset"?`<p class="lede">Enter your email and we'll send you a link to choose a new password.</p>`:""}
      <form id="af" novalidate>
        ${_mode==="signup"?`<div class="field"><label class="field-label" for="a-name">Name</label><input class="input" id="a-name" autocomplete="name"></div>`:""}
        <div class="field"><label class="field-label" for="a-email">Email</label><input class="input" id="a-email" type="email" autocomplete="email" inputmode="email" required ${bad("a-email")}></div>
        ${_mode!=="reset" ? pwField("a-pass","Password",_mode==="signup"?"new-password":"current-password") : ""}
        ${_mode==="signup" ? `<span class="field-hint">At least 8 characters.</span>${pwField("a-pass2","Confirm password","new-password")}` : ""}
        ${_flash ? `<div id="a-msg" class="msg msg-${_flash.t}" role="${_flash.t==="error"?"alert":"status"}">${esc(_flash.m)}</div>` : ""}
        <button class="btn btn-dark btn-block" style="margin-top:var(--s-4)" id="a-go">${_mode==="reset"?"Send reset link":_mode==="signup"?"Create account":"Sign in"}</button>
      </form>
      ${_mode==="signin"?`<div style="text-align:right;margin-top:var(--s-2)"><button type="button" class="link" data-m="reset">Forgot password?</button></div>`:""}
      ${_mode!=="reset"?`<div class="or">or</div><button type="button" class="btn btn-block" id="a-google">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.3 5.6c4.3-3.9 7-9.8 7-17.1z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.6c-2.1 1.4-4.9 2.3-8.6 2.3-6.2 0-11.5-4.1-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>
        Continue with Google</button>`:""}
    </section>
    <p style="text-align:center">
      ${_mode==="signin"?`New here? <button type="button" class="link" data-m="signup">Create an account</button>`:`<button type="button" class="link" data-m="signin">Back to sign in</button>`}
    </p></main>`;

  gate.querySelectorAll("[data-m]").forEach(b => b.onclick = () => {
    const em = document.getElementById("a-email")?.value;
    _mode = b.dataset.m; _flash = null; _renderGate();
    const el = document.getElementById("a-email"); if (em) el.value = em;
    document.getElementById("a-title").setAttribute("tabindex","-1");
    document.getElementById("a-title").focus();
  });

  gate.querySelectorAll("[data-show]").forEach(b => b.onclick = () => {
    const inp = document.getElementById(b.dataset.show), on = inp.type==="password";
    inp.type = on?"text":"password"; b.textContent=on?"Hide":"Show";
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on?"Hide password":"Show password");
  });

  document.getElementById("af").onsubmit = _submit;
  const g = document.getElementById("a-google"); if (g) g.onclick = _google;
}

function _busy(on) {
  const b = document.getElementById("a-go");
  if (b) { b.disabled = on; b.setAttribute("aria-busy", String(on)); }
}

function _showFlash(t, m, f) {
  _flash = { t, m, f };
  const em = document.getElementById("a-email")?.value;
  _renderGate();
  if (em) document.getElementById("a-email").value = em;
  if (f?.length) document.getElementById(f[0])?.focus();
}

async function _submit(e) {
  e.preventDefault();
  const email = document.getElementById("a-email").value.trim();
  const pass = document.getElementById("a-pass")?.value || "";
  if (!email) return _showFlash("error","Enter your email.",["a-email"]);
  _busy(true);
  try {
    if (_mode === "reset") {
      try { await _A.sendPasswordResetEmail(_auth, email); } catch(err) { if (err.code !== "auth/user-not-found") throw err; }
      _mode = "signin"; return _showFlash("success","If there's an account for that email, a reset link is on its way. Check your spam folder too.");
    }
    if (_mode === "signup") {
      const name = document.getElementById("a-name")?.value.trim() || "";
      if (pass.length < 8) return _showFlash("error","Use at least 8 characters.",["a-pass"]);
      if (pass !== document.getElementById("a-pass2").value) return _showFlash("error","The passwords don't match.",["a-pass2"]);
      const cred = await _A.createUserWithEmailAndPassword(_auth, email, pass);
      if (name) await _A.updateProfile(cred.user,{displayName:name}).catch(()=>{});
      _A.sendEmailVerification(cred.user).catch(()=>{});
      return;
    }
    await _A.signInWithEmailAndPassword(_auth, email, pass);
  } catch(err) {
    _showFlash("error", errText(err), /email/.test(err.code||"")?["a-email"]:/password|credential/.test(err.code||"")?["a-email","a-pass"]:[]);
  } finally { _busy(false); }
}

async function _google() {
  try { await _A.signInWithPopup(_auth, new _A.GoogleAuthProvider()); }
  catch(err) {
    if (err.code==="auth/popup-blocked" || err.code==="auth/operation-not-supported-in-this-environment") {
      try { await _A.signInWithRedirect(_auth, new _A.GoogleAuthProvider()); return; } catch(e2) { err=e2; }
    }
    if (err.code !== "auth/cancelled-popup-request") _showFlash("error", errText(err));
  }
}

/* ── Waiting page ───────────────────────────────────────────────────────────── */

let _unsubWait = null;

function _renderWaiting(member, user) {
  const gate = document.getElementById("gate");
  gate.innerHTML = `<main>${brandHead("Waiting for approval")}
    <section class="card" aria-labelledby="wait-t">
      <h2 class="panel-title" id="wait-t">Waiting for an admin to approve your account</h2>
      <p class="lede">Your account has been created. An admin needs to assign you a position before you can get started. Check back soon.</p>
      <p class="lede muted">${esc(user.email || "")}</p>
      <div class="btns"><button type="button" class="btn btn-ghost" id="wait-out">Sign out</button></div>
    </section></main>`;
  document.getElementById("wait-out").onclick = () => signOut();

  if (_unsubWait) { _unsubWait(); _unsubWait=null; }
  import("./sync.js").then(({ listenMember }) => {
    _unsubWait = listenMember(user.uid, updated => {
      if (!updated) return;
      state.member = updated;
      if (updated.status === "active") {
        if (_unsubWait) { _unsubWait(); _unsubWait=null; }
        location.reload();
      } else if (updated.status === "disabled") {
        if (_unsubWait) { _unsubWait(); _unsubWait=null; }
        _renderDisabled(updated);
      }
    });
  });
}

/* ── Disabled page ──────────────────────────────────────────────────────────── */

function _renderDisabled(member) {
  const gate = document.getElementById("gate");
  gate.innerHTML = `<main>${brandHead()}
    <section class="card" aria-labelledby="dis-t">
      <h2 class="panel-title" id="dis-t">Account disabled</h2>
      <p class="lede">Your account has been disabled. Contact an admin if you think this is an error.</p>
      <div class="btns"><button type="button" class="btn btn-ghost" id="dis-out">Sign out</button></div>
    </section></main>`;
  document.getElementById("dis-out").onclick = () => signOut();
}

/* ── Account panel (renderAccount for manage.js) ────────────────────────────── */

export function renderAccountPanel(el) {
  if (!state.user || !el) return;
  const user = state.user;
  const isPw = user.providerData?.some(p => p.providerId==="password");
  const isG  = user.providerData?.some(p => p.providerId==="google.com");

  el.innerHTML = `<div class="row"><h2 class="panel-title" id="h-acct">Account</h2></div>
    <p style="margin-top:var(--s-2)">${user.displayName?`<strong>${esc(user.displayName)}</strong><br>`:""}<span class="muted">${esc(user.email||"")}</span>${isG?'<span class="tag">Google</span>':""}</p>
    ${isPw&&!user.emailVerified?`<div class="msg msg-info">Verify your email so you can always get back in. <button type="button" class="link" id="ac-ver">Resend link</button></div>`:""}
    <div class="btns">${isPw?`<button type="button" class="btn btn-sm" id="ac-pw">Reset password</button>`:""}<button type="button" class="btn btn-sm btn-dark" id="ac-out">Sign out</button></div>
    <div style="margin-top:var(--s-2)"><button type="button" class="link danger" id="ac-del">Delete my account</button></div>`;

  el.querySelector("#ac-out").onclick = () => signOut();

  const ver = el.querySelector("#ac-ver");
  if (ver) ver.onclick = async () => {
    try { await _A.sendEmailVerification(user); toast("Verification email sent"); } catch(e) { toast(errText(e)); }
  };
  const pw = el.querySelector("#ac-pw");
  if (pw) pw.onclick = async () => {
    try { await _A.sendPasswordResetEmail(_auth, user.email); toast("Password link sent to your email"); } catch(e) { toast(errText(e)); }
  };
  el.querySelector("#ac-del").onclick = () => _deleteFlow(isPw, user);
}

function _deleteFlow(isPw, user) {
  const d = document.createElement("dialog");
  d.className = "dialog";
  d.innerHTML = `<h2 class="panel-title" id="dlg-title">Delete your account?</h2>
    <p class="lede">This permanently removes your account, your progress and any drinks you've edited. It can't be undone.</p>
    ${isPw?`<div class="field"><label class="field-label" for="d-pass">Confirm with your password</label><input class="input" id="d-pass" type="password" autocomplete="current-password" aria-describedby="d-msg"></div>`:`<p class="lede">You'll be asked to confirm with Google.</p>`}
    <div id="d-msg"></div>
    <div class="btns"><button type="button" class="btn" id="d-no">Cancel</button><button type="button" class="btn btn-danger" id="d-yes">Delete forever</button></div>`;
  document.body.appendChild(d);
  d.showModal();
  document.getElementById("d-no").onclick = () => d.close();
  document.getElementById("d-yes").onclick = async () => {
    const msg = document.getElementById("d-msg");
    try {
      if (isPw) await _A.reauthenticateWithCredential(user, _A.EmailAuthProvider.credential(user.email, document.getElementById("d-pass").value));
      else await _A.reauthenticateWithPopup(user, new _A.GoogleAuthProvider());
      await flushProgress();
      await import("./sync.js").then(({ deleteProgress }) => deleteProgress(user.uid));
      await _A.deleteUser(user);
      d.close();
    } catch(e) {
      msg.innerHTML = `<div class="msg msg-error" role="alert">${esc(errText(e))}</div>`;
      if (isPw) { const p=document.getElementById("d-pass"); p.setAttribute("aria-invalid","true"); p.focus(); }
    }
  };
}

/* ── Global hook for manage.js sign-in link ─────────────────────────────────── */
window.showSignIn = () => { _mode="signin"; _flash=null; _renderGate(); };
