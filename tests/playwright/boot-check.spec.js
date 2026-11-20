import { test, expect } from "@playwright/test";

// Two distinct concerns:
// 1. Import errors — caught when local modules load (no CDN needed).
// 2. Firestore cache fallback — caught after the Firebase CDN loads.
//    If the CDN is unreachable (e.g. CI sandbox), test 2 is skipped cleanly.

test("app loads without import errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", err => errors.push(err.message));
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  // The spinner appears as soon as all local modules have loaded and
  // loadFirebase() starts — before any CDN request fires.
  // If it never appears, a local import failed.
  await page.waitForSelector(".spinner", { timeout: 10_000 });

  const importErrors = errors.filter(e =>
    /does not provide an export|SyntaxError.*import|Cannot find module|Failed to fetch.*app\.js/i.test(e)
  );
  expect(importErrors, "Import or load errors:\n" + importErrors.join("\n")).toHaveLength(0);
});

test("Firestore starts with persistent cache, no memory-fallback warning", async ({ page }) => {
  const warnings = [];
  page.on("console", msg => {
    const t = msg.text();
    if (/Falling back to memory cache|failed-precondition|persistence.*disabled|newer version.*previously used/i.test(t)) {
      warnings.push(t);
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Wait up to 20 s for the Firebase sign-in form (needs CDN).
  // Skip cleanly if the CDN is unreachable (sandbox / offline CI).
  const signInLoaded = await page
    .waitForSelector("#gate input[type='email']", { timeout: 20_000 })
    .then(() => true)
    .catch(() => false);

  test.skip(!signInLoaded, "Firebase CDN unreachable — cache warning check skipped");

  expect(warnings, "Firestore persistence warnings:\n" + warnings.join("\n")).toHaveLength(0);
});

// Full E2E flows (sign-in, quiz, bar mode, shift mode) — add once staging is wired up.
