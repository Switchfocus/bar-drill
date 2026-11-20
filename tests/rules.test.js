import { initializeTestEnvironment, assertFails, assertSucceeds } from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { setDoc, getDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { beforeAll, afterAll, afterEach, describe, it } from "vitest";

const PROJECT_ID = "demo-bar-drill";
const RULES = readFileSync("firestore.rules", "utf8");

let testEnv;

// ── seed helpers ──────────────────────────────────────────────────────────────

async function seedMember(env, uid, overrides = {}) {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), "members", uid), {
      email: `${uid}@test.com`,
      displayName: uid,
      role: "staff",
      status: "active",
      position: "bar",
      menus: ["cantina-drinks"],
      createdAt: Timestamp.now(),
      approvedBy: null,
      approvedAt: null,
      disabledAt: null,
      ...overrides,
    });
  });
}

async function seedAdmin(env, uid, overrides = {}) {
  return seedMember(env, uid, { role: "admin", status: "active", ...overrides });
}

async function seedConfig(env, adminCount) {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), "config", "app"), { adminCount });
  });
}

async function seedMenu(env, menuId, overrides = {}) {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), "menus", menuId), {
      name: "Test Menu",
      type: "drinks",
      published: true,
      categories: ["Cocktails"],
      order: 0,
      audiences: ["bar"],
      optionalFor: [],
      ...overrides,
    });
  });
}

async function seedItem(env, menuId, itemId, overrides = {}) {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), "menus", menuId, "items", itemId), {
      name: "Margarita",
      cat: "Cocktails",
      price: "£11",
      ingredients: ["Tequila", "Lime"],
      spec: "50ml tequila\n25ml lime",
      build: null,
      ...overrides,
    });
  });
}

async function seedProgress(env, uid, overrides = {}) {
  await env.withSecurityRulesDisabled(async ctx => {
    await setDoc(doc(ctx.firestore(), "progress", uid), {
      stats: {},
      decksBy: {},
      theme: "auto",
      ...overrides,
    });
  });
}

// ── setup ─────────────────────────────────────────────────────────────────────

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: RULES,
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

// ── members collection ────────────────────────────────────────────────────────

describe("members: create", () => {
  it("user creates their own pending staff doc", async () => {
    await seedConfig(testEnv, 1);
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(setDoc(doc(ctx.firestore(), "members", "alice"), {
      email: "alice@test.com",
      displayName: "Alice",
      role: "staff",
      status: "pending",
      position: null,
      menus: [],
      createdAt: Timestamp.now(),
      approvedBy: null,
      approvedAt: null,
      disabledAt: null,
    }));
  });

  it("user cannot create another user's member doc", async () => {
    await seedConfig(testEnv, 1);
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(setDoc(doc(ctx.firestore(), "members", "bob"), {
      email: "bob@test.com",
      displayName: "Bob",
      role: "staff",
      status: "pending",
      position: null,
      menus: [],
      createdAt: Timestamp.now(),
      approvedBy: null,
      approvedAt: null,
      disabledAt: null,
    }));
  });

  it("user cannot create a doc with role admin", async () => {
    await seedConfig(testEnv, 1);
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(setDoc(doc(ctx.firestore(), "members", "alice"), {
      email: "alice@test.com",
      displayName: "Alice",
      role: "admin",
      status: "pending",
      position: null,
      menus: [],
      createdAt: Timestamp.now(),
      approvedBy: null,
      approvedAt: null,
      disabledAt: null,
    }));
  });

  it("user cannot create a doc with status active", async () => {
    await seedConfig(testEnv, 1);
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(setDoc(doc(ctx.firestore(), "members", "alice"), {
      email: "alice@test.com",
      displayName: "Alice",
      role: "staff",
      status: "active",
      position: null,
      menus: [],
      createdAt: Timestamp.now(),
      approvedBy: null,
      approvedAt: null,
      disabledAt: null,
    }));
  });
});

describe("members: read", () => {
  it("active user reads their own doc", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "members", "alice")));
  });

  it("active user cannot read another user's doc", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    await seedMember(testEnv, "bob");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(getDoc(doc(ctx.firestore(), "members", "bob")));
  });

  it("admin reads any member doc", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "members", "alice")));
  });

  it("unauthenticated user cannot read any doc", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(ctx.firestore(), "members", "alice")));
  });
});

describe("members: update", () => {
  it("active user updates their own displayName", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "members", "alice"), {
      displayName: "Alice Updated",
    }));
  });

  it("active user cannot update their own role", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(updateDoc(doc(ctx.firestore(), "members", "alice"), {
      role: "admin",
    }));
  });

  it("active user cannot update their own status", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(updateDoc(doc(ctx.firestore(), "members", "alice"), {
      status: "pending",  // actual change — diff will include "status"
    }));
  });

  it("admin updates any member doc", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "members", "alice"), {
      position: "runner",
    }));
  });

  it("last admin cannot be demoted (adminCount=1)", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertFails(updateDoc(doc(ctx.firestore(), "members", "admin1"), {
      role: "staff",
    }));
  });

  it("second admin can be demoted (adminCount=2)", async () => {
    await seedConfig(testEnv, 2);
    await seedAdmin(testEnv, "admin1");
    await seedAdmin(testEnv, "admin2");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "members", "admin2"), {
      role: "staff",
    }));
  });
});

// ── menus collection ──────────────────────────────────────────────────────────

describe("menus: read", () => {
  it("admin reads any menu (published or not)", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMenu(testEnv, "cantina-drinks", { published: false });
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "menus", "cantina-drinks")));
  });

  it("active user reads their published, granted menu", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { menus: ["cantina-drinks"] });
    await seedMenu(testEnv, "cantina-drinks", { published: true });
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "menus", "cantina-drinks")));
  });

  it("active user cannot read unpublished menu", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { menus: ["cantina-drinks"] });
    await seedMenu(testEnv, "cantina-drinks", { published: false });
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(getDoc(doc(ctx.firestore(), "menus", "cantina-drinks")));
  });

  it("active user cannot read published but non-granted menu", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { menus: [] });
    await seedMenu(testEnv, "cantina-drinks", { published: true });
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(getDoc(doc(ctx.firestore(), "menus", "cantina-drinks")));
  });

  it("active user cannot write a menu", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { menus: ["cantina-drinks"] });
    await seedMenu(testEnv, "cantina-drinks", { published: true });
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(updateDoc(doc(ctx.firestore(), "menus", "cantina-drinks"), {
      name: "Hacked",
    }));
  });

  it("admin writes a menu", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMenu(testEnv, "cantina-drinks");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "menus", "cantina-drinks"), {
      name: "Updated",
    }));
  });
});

// ── menus/items subcollection ─────────────────────────────────────────────────

describe("menus/items: access", () => {
  it("active user reads item in their granted published menu", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { menus: ["cantina-drinks"] });
    await seedMenu(testEnv, "cantina-drinks", { published: true });
    await seedItem(testEnv, "cantina-drinks", "margarita");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "menus", "cantina-drinks", "items", "margarita")));
  });

  it("active user cannot write an item", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { menus: ["cantina-drinks"] });
    await seedMenu(testEnv, "cantina-drinks", { published: true });
    await seedItem(testEnv, "cantina-drinks", "margarita");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(updateDoc(doc(ctx.firestore(), "menus", "cantina-drinks", "items", "margarita"), {
      name: "Hacked",
    }));
  });

  it("admin writes an item", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMenu(testEnv, "cantina-drinks");
    await seedItem(testEnv, "cantina-drinks", "margarita");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "menus", "cantina-drinks", "items", "margarita"), {
      name: "Updated Margarita",
    }));
  });
});

// ── progress collection ───────────────────────────────────────────────────────

describe("progress: access", () => {
  it("active user reads their own progress", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "progress", "alice")));
  });

  it("active user writes their own progress", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "progress", "alice"), {
      stats: { margarita: { hit: 1, miss: 0, streak: 1 } },
    }));
  });

  it("disabled user cannot write progress", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { status: "disabled" });
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(updateDoc(doc(ctx.firestore(), "progress", "alice"), {
      stats: { margarita: { hit: 1, miss: 0, streak: 1 } },
    }));
  });

  it("active user cannot read another user's progress", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    await seedMember(testEnv, "bob");
    await seedProgress(testEnv, "bob");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(getDoc(doc(ctx.firestore(), "progress", "bob")));
  });

  it("admin reads any progress", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMember(testEnv, "alice");
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "progress", "alice")));
  });

  it("admin deletes progress", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    await seedMember(testEnv, "alice");
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(deleteDoc(doc(ctx.firestore(), "progress", "alice")));
  });

  it("active user cannot delete their own progress", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(deleteDoc(doc(ctx.firestore(), "progress", "alice")));
  });

  it("pending user can write their own progress", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice", { status: "pending" });
    await seedProgress(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "progress", "alice"), {
      theme: "dark",
    }));
  });
});

// ── config collection ─────────────────────────────────────────────────────────

describe("config: access", () => {
  it("authenticated user reads config", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertSucceeds(getDoc(doc(ctx.firestore(), "config", "app")));
  });

  it("unauthenticated user cannot read config", async () => {
    await seedConfig(testEnv, 1);
    const ctx = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(ctx.firestore(), "config", "app")));
  });

  it("admin writes config", async () => {
    await seedConfig(testEnv, 1);
    await seedAdmin(testEnv, "admin1");
    const ctx = testEnv.authenticatedContext("admin1");
    await assertSucceeds(updateDoc(doc(ctx.firestore(), "config", "app"), {
      adminCount: 2,
    }));
  });

  it("non-admin cannot write config", async () => {
    await seedConfig(testEnv, 1);
    await seedMember(testEnv, "alice");
    const ctx = testEnv.authenticatedContext("alice");
    await assertFails(updateDoc(doc(ctx.firestore(), "config", "app"), {
      adminCount: 99,
    }));
  });
});
