import { test } from "@playwright/test";

// E2E stubs — run against local dev server + Firebase emulators.
// Fill these in once the app is deployed to staging.

test.todo("sign up with email creates a pending account and shows waiting page");

test.todo("sign in with existing active account shows the learn tab");

test.todo("waiting page auto-advances to app when admin approves the account");

test.todo("admin can approve a pending staff member with a position assignment");

test.todo("admin can suspend an active staff member");

test.todo("learn tab shows drink cards filtered to the user's assigned menus");

test.todo("quiz tab generates a question and records the answer");

test.todo("bar mode: completing all 6 steps for a drink marks it as correct");

test.todo("shift mode: adding a drink to the order and ticking steps to done");

test.todo("sign out clears the session and shows the sign-in gate");
