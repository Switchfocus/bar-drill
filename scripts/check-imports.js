#!/usr/bin/env node
// Statically checks that every named import in public/*.js resolves to a real export.
// Run: node scripts/check-imports.js  (exits 1 if anything is broken)

import { readFileSync, readdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dir, "../public");

function parseExports(src) {
  const names = new Set();
  // export function/const/let/var/class/async function Name
  for (const m of src.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)/gm))
    names.add(m[1]);
  // export { a, b as c }
  for (const m of src.matchAll(/^export\s+\{([^}]+)\}/gm))
    for (const part of m[1].split(","))
      names.add(part.trim().split(/\s+as\s+/)[0].trim());
  // export default
  if (/^export default\b/m.test(src)) names.add("default");
  return names;
}

function parseNamedImports(src) {
  const imports = [];
  for (const m of src.matchAll(/^import\s+\{([^}]+)\}\s+from\s+["'](\.[^"']+)["']/gm)) {
    const names = m[1].split(",").map(p => p.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
    imports.push({ specifier: m[2], names });
  }
  return imports;
}

const files = readdirSync(publicDir).filter(f => f.endsWith(".js") && !f.startsWith("firebase-config"));
const exportMap = {};
for (const f of files) {
  const src = readFileSync(join(publicDir, f), "utf8");
  exportMap["./" + f] = parseExports(src);
}

let errors = 0;

// Check Firebase CDN version floor (must be >= 13 to match existing IndexedDB schema)
const authSrc = readFileSync(join(publicDir, "auth.js"), "utf8");
const fvMatch = authSrc.match(/const FV\s*=\s*["']([^"']+)["']/);
if (fvMatch) {
  const major = parseInt(fvMatch[1].split(".")[0], 10);
  if (major < 13) {
    console.error(`✗  auth.js: Firebase CDN version "${fvMatch[1]}" is below 13.x — users' IndexedDB data requires 13+`);
    errors++;
  }
}
for (const f of files) {
  const src = readFileSync(join(publicDir, f), "utf8");
  for (const { specifier, names } of parseNamedImports(src)) {
    // Normalise specifier (strip ?v=... cache-busters, ignore external URLs)
    if (!specifier.startsWith(".")) continue;
    const key = specifier.replace(/\?.*$/, "").replace(/\.js$/, "") + ".js";
    const normalised = "./" + key.replace(/^\.\//, "");
    const exported = exportMap[normalised];
    if (!exported) {
      console.error(`✗  ${f}: imports from "${specifier}" but that file is not in /public`);
      errors++;
      continue;
    }
    for (const name of names) {
      if (!exported.has(name)) {
        console.error(`✗  ${f}: "${name}" imported from "${specifier}" but not exported there`);
        errors++;
      }
    }
  }
}

if (errors === 0) {
  console.log(`✓  All named imports resolve correctly (${files.length} files checked)`);
} else {
  console.error(`\n${errors} import error${errors !== 1 ? "s" : ""} found`);
  process.exit(1);
}
