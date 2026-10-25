#!/usr/bin/env node
// Checks every game in games/<slug>/ against the rules in AGENTS.md.
// Runs before every build (npm run build) and in CI on every pull request.
// Usage: node scripts/validate-games.mjs
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const GAMES = path.join(ROOT, "games")
const courses = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/courses.json"), "utf8"))
const MAX_BYTES = 3 * 1024 * 1024

// Anything that would make the browser load something from another host.
const EXTERNAL = [
  [/\s(?:src|srcset)\s*=\s*["']?\s*(?:https?:)?\/\//i, "loads a file from another site (src=)"],
  [/<link\b[^>]*href\s*=\s*["']?\s*(?:https?:)?\/\//i, "loads a stylesheet/font from another site (<link href>)"],
  [/url\(\s*["']?\s*(?:https?:)?\/\//i, "loads a file from another site (CSS url())"],
  [/@import\s+(?:url\()?\s*["']?(?:https?:)?\/\//i, "imports CSS from another site (@import)"],
  [/\bimport\s*(?:\(|[^;]*?\bfrom)\s*["'](?:https?:)?\/\//i, "imports a JS module from another site"],
  [/\bfetch\s*\(\s*["'`](?:https?:)?\/\//i, "calls a web API (fetch)"],
  [/\bnew\s+(?:XMLHttpRequest|WebSocket|EventSource)\b/, "makes network requests (XMLHttpRequest/WebSocket)"],
]

const errors = []
const fail = (slug, msg) => errors.push(`games/${slug}: ${msg}`)

const slugs = fs
  .readdirSync(GAMES, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name)

for (const slug of slugs) {
  const dir = path.join(GAMES, slug)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(slug, "folder name must be lowercase letters, digits and dashes (e.g. token-sorter)")

  // game.json
  let meta
  try {
    meta = JSON.parse(fs.readFileSync(path.join(dir, "game.json"), "utf8"))
  } catch (e) {
    fail(slug, `game.json is missing or not valid JSON (${e.message})`)
    continue
  }
  for (const key of ["title", "course", "summary", "minutes", "format"]) {
    if (typeof meta[key] !== "string" || !meta[key].trim()) fail(slug, `game.json: "${key}" must be a non-empty string`)
  }
  if (!Array.isArray(meta.concepts) || !meta.concepts.length || !meta.concepts.every((c) => typeof c === "string" && c.trim()))
    fail(slug, 'game.json: "concepts" must be a non-empty list of strings')
  const course = courses.find((c) => c.id === meta.course)
  if (!course) fail(slug, `game.json: course "${meta.course}" does not exist (see src/data/courses.json: ${courses.map((c) => c.id).join(", ")})`)
  else if (!Number.isInteger(meta.session) || meta.session < 1 || meta.session > course.sessions.length)
    fail(slug, `game.json: "session" must be a whole number from 1 to ${course.sessions.length} for course "${course.id}"`)
  if (meta.cover !== undefined && !fs.existsSync(path.join(dir, meta.cover))) fail(slug, `game.json: cover file "${meta.cover}" not found`)

  // index.html
  const htmlPath = path.join(dir, "index.html")
  if (!fs.existsSync(htmlPath)) {
    fail(slug, "index.html is missing")
    continue
  }
  if (fs.statSync(htmlPath).size > MAX_BYTES) fail(slug, "index.html is larger than 3 MB")
  const html = fs.readFileSync(htmlPath, "utf8")
  if (!/<html[^>]*\slang=["']zh-CN["']/i.test(html)) fail(slug, 'index.html: <html> must have lang="zh-CN"')
  if (!html.includes("老师说明")) fail(slug, "index.html: needs a 「老师说明」 (teacher guide) button")
  if (meta.course && !html.includes(`href="/classes/${meta.course}"`))
    fail(slug, `index.html: needs a back link to the hub: <a class="back" href="/classes/${meta.course}">← 游戏大厅</a>`)
  for (const [re, why] of EXTERNAL) if (re.test(html)) fail(slug, `index.html ${why} — games must work fully offline`)

  // Only the game's own files belong in the folder.
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(html|json|svg|png|jpe?g|webp)$/i.test(f)) fail(slug, `unexpected file "${f}" (allowed: index.html, game.json, cover image)`)
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) in games/:\n` + errors.map((e) => "  - " + e).join("\n"))
  process.exit(1)
}
console.log(`✓ ${slugs.length} game(s) passed validation: ${slugs.join(", ")}`)
