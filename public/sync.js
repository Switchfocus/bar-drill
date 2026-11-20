/* ── Firestore sync layer ───────────────────────────────────────────────────── */
// Initialized by auth.js; methods work only after initSync() is called.

import { SEED_MENUS, builtinItemsForMenu, RAIL } from "./data.js";
import { state, snapshot, persist } from "./state.js";

let db = null;
let F  = null;  // firebase/firestore module

export function initSync(firestoreDb, firestoreModule) {
  db = firestoreDb;
  F  = firestoreModule;
}

/* ── Member doc ─────────────────────────────────────────────────────────────── */

export async function loadMember(uid) {
  const snap = await F.getDoc(F.doc(db, "members", uid));
  return snap.exists() ? { id:snap.id, ...snap.data() } : null;
}

export function listenMember(uid, callback) {
  return F.onSnapshot(F.doc(db, "members", uid), snap => {
    callback(snap.exists() ? { id:snap.id, ...snap.data() } : null);
  });
}

export async function createMember(user) {
  const ref = F.doc(db, "members", user.uid);
  const data = {
    email: user.email || "",
    displayName: user.displayName || "",
    createdAt: F.serverTimestamp(),
    role: "staff",
    status: "pending",
    position: null,
    menus: [],
  };
  await F.setDoc(ref, data);
  return { id:user.uid, ...data };
}

export async function updateMember(uid, fields) {
  await F.updateDoc(F.doc(db, "members", uid), { ...fields, updatedAt:F.serverTimestamp() });
}

export async function updateDisplayName(name) {
  if (!state.user || !state.member) throw new Error("Not signed in");
  await updateMember(state.user.uid, { displayName:name });
  state.member.displayName = name;
}

/* ── Admin count guard ──────────────────────────────────────────────────────── */

async function getAdminCount() {
  const snap = await F.getDoc(F.doc(db, "config", "app"));
  return snap.exists() ? (snap.data().adminCount || 0) : 0;
}

export async function batchSetRole(uid, newRole, prevRole) {
  const batch = F.writeBatch(db);
  batch.update(F.doc(db, "members", uid), { role:newRole, updatedAt:F.serverTimestamp() });
  const configRef = F.doc(db, "config", "app");
  if (prevRole !== "admin" && newRole === "admin") {
    batch.update(configRef, { adminCount: F.increment(1) });
  } else if (prevRole === "admin" && newRole !== "admin") {
    const count = await getAdminCount();
    if (count <= 1) throw new Error("Cannot demote the last admin.");
    batch.update(configRef, { adminCount: F.increment(-1) });
  }
  await batch.commit();
}

export async function approveStaff(uid, fields) {
  await updateMember(uid, { status:"active", ...fields, updatedAt:F.serverTimestamp() });
}

export async function suspendMember(uid) {
  await updateMember(uid, { status:"disabled" });
}

/* ── Progress ───────────────────────────────────────────────────────────────── */

let _saveTimer = null;
let _pendingProgress = null;
let _syncState = "ok";
const _syncListeners = new Set();

function setSyncState(s) {
  _syncState = s;
  _syncListeners.forEach(fn => fn(s));
}

export function onSyncState(fn) { _syncListeners.add(fn); return () => _syncListeners.delete(fn); }
export const getSyncState = () => _syncState;

export function scheduleProgressSave(data) {
  if (!state.user || !db) return;
  _pendingProgress = data;
  setSyncState("saving");
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(flushProgress, 700);
}

export async function flushProgress() {
  if (!state.user || !_pendingProgress || !db) return;
  const uid = state.user.uid;
  const data = JSON.parse(JSON.stringify(_pendingProgress));
  _pendingProgress = null;
  try {
    await F.setDoc(F.doc(db, "progress", uid), { ...data, updatedAt:F.serverTimestamp() });
    setSyncState(navigator.onLine === false ? "off" : "ok");
  } catch(err) {
    console.error("Progress save failed:", err);
    setSyncState("off");
  }
}

export async function loadProgress(uid) {
  const snap = await F.getDoc(F.doc(db, "progress", uid));
  return snap.exists() ? snap.data() : null;
}

export async function deleteProgress(uid) {
  await F.deleteDoc(F.doc(db, "progress", uid));
}

addEventListener("online", () => setSyncState("ok"));
addEventListener("offline", () => setSyncState("off"));
addEventListener("pagehide", () => { if (_pendingProgress) flushProgress(); });

/* ── Menus ──────────────────────────────────────────────────────────────────── */

export async function loadMenuMeta(menuId) {
  const snap = await F.getDoc(F.doc(db, "menus", menuId));
  return snap.exists() ? { id:snap.id, ...snap.data() } : null;
}

export async function loadMenuItems(menuId) {
  const snap = await F.getDocs(F.collection(db, "menus", menuId, "items"));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}

export async function loadAllMenuItems(menuIds) {
  const all = await Promise.all(menuIds.map(loadMenuItems));
  return all.flat();
}

export function subscribeMenuItems(menuId, callback) {
  return F.onSnapshot(
    F.collection(db, "menus", menuId, "items"),
    snap => callback(snap.docs.map(d => ({ id:d.id, ...d.data() })))
  );
}

export async function listMembers() {
  const snap = await F.getDocs(F.collection(db, "members"));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}

export async function listAllProgress() {
  const snap = await F.getDocs(F.collection(db, "progress"));
  return snap.docs.map(d => ({ id:d.id, ...d.data() }));
}

/* ── Admin: menu writes ─────────────────────────────────────────────────────── */

export async function saveMenuMeta(menuId, data) {
  await F.setDoc(F.doc(db, "menus", menuId), { ...data, updatedAt:F.serverTimestamp() });
}

export async function saveMenuItem(menuId, itemId, data) {
  await F.setDoc(F.doc(db, "menus", menuId, "items", itemId), data);
}

export async function deleteMenuItem(menuId, itemId) {
  await F.deleteDoc(F.doc(db, "menus", menuId, "items", itemId));
}

export async function deleteMenu(menuId) {
  const items = await loadMenuItems(menuId);
  const batch = F.writeBatch(db);
  items.forEach(i => batch.delete(F.doc(db, "menus", menuId, "items", i.id)));
  batch.delete(F.doc(db, "menus", menuId));
  await batch.commit();
}

/* ── Admin: seed built-in menus ─────────────────────────────────────────────── */

export async function seedBuiltinMenus(onProgress) {
  for (let i = 0; i < SEED_MENUS.length; i++) {
    const meta = SEED_MENUS[i];
    onProgress?.(`Seeding menu ${i+1}/${SEED_MENUS.length}: ${meta.name}…`);
    await saveMenuMeta(meta.id, meta);
    const items = builtinItemsForMenu(meta.id);
    const CHUNK = 400;
    for (let j = 0; j < items.length; j += CHUNK) {
      const batch = F.writeBatch(db);
      items.slice(j, j+CHUNK).forEach(item => {
        batch.set(F.doc(db, "menus", meta.id, "items", item.id), item);
      });
      await batch.commit();
    }
  }
  onProgress?.("Done! All built-in menus seeded.");
}

export async function seedRailConfig() {
  await F.setDoc(F.doc(db, "config", "rail"), { rail:RAIL, updatedAt:F.serverTimestamp() });
}

export async function ensureConfigApp() {
  const ref = F.doc(db, "config", "app");
  const snap = await F.getDoc(ref);
  if (!snap.exists()) {
    await F.setDoc(ref, { adminCount:1 });
  }
}

export async function loadConfig(docId) {
  const snap = await F.getDoc(F.doc(db, "config", docId));
  return snap.exists() ? snap.data() : null;
}
