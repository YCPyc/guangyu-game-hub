# 光语课堂游戏 — instructions for coding agents

This repo is a game hub for 光语's AI-literacy courses (delivered to students in mainland China by our
partner 铺路石). The home page lists courses; each course page lists classroom games. Team members
build games with coding agents (Claude Code, Codex) and open one pull request per game. The team
reviews and merges PRs every Tuesday; merging to `main` deploys to our server in China.

**Most requests in this repo are "make a game for lesson X".** Follow the workflow below exactly.

## Golden rule for game PRs

A game PR adds or edits files **only inside `games/<slug>/`**. Do not modify `src/`, other games,
`games/_template/`, configs, or CI unless the user explicitly asks for that. The site discovers games
automatically from `games/*/game.json`, so no other file needs to change.

## Workflow: adding a game

1. **Pick the course and lesson.** Read `src/data/courses.json`. A game belongs to one course (`id`)
   and one lesson (`session`, 1-based index into that course's `sessions`). If the user didn't say
   which, ask. If the course doesn't exist yet, stop and tell the user — adding a course is a separate PR.
2. **Pick a slug**: short, lowercase English with dashes, describing the game (`token-sorter`,
   `bias-detective`). It must not already exist in `games/`.
3. **Copy the template**: `cp -R games/_template games/<slug>`.
4. **Fill in `games/<slug>/game.json`**:
   ```json
   {
     "title": "游戏名（中文，6–10 个字）",
     "course": "<course id>",
     "session": 1,
     "summary": "一两句话：学生在游戏里做什么、理解什么概念。",
     "minutes": "15–20 分钟",
     "format": "老师投屏，全班一起操作",
     "concepts": ["词元", "数据集"],
     "authors": ["作者名字"],
     "cover": "cover.svg"
   }
   ```
   `cover` is optional: a simple flat SVG (320×180 viewBox) in the same folder, using the palette below.
5. **Build the game in `games/<slug>/index.html`** following the requirements and style guide below.
   Keep the template's shared CSS block, header, 老师说明 modal and export modal; replace the TODOs.
6. **Verify** (see "Before you open the PR").
7. **Open the PR** on a branch named `game/<slug>`, using the PR template checklist.
   - **Title format for a game PR**: `【课程名】【第 N 节】游戏名` (for example,
     `【聊天机器人背后的大脑】【第 1 节】下一句会是什么`).
   - **Description**: explain the game's purpose and learning goal, then describe how the teacher
     should run it in class (the activity flow and suggested timing). Complete the PR template
     checklist and include 1–2 screenshots.

## Hard requirements (CI rejects games that break these)

Checked automatically by `npm run validate` (`scripts/validate-games.mjs`):

- One self-contained `index.html`: all HTML, CSS, JS and data inline. Only `index.html`, `game.json`
  and an optional cover image in the folder.
- **No external resources and no network calls.** No CDNs, no Google Fonts, no external images,
  no `fetch`/XHR/WebSocket, no AI APIs. Foreign CDNs are blocked or slow in China, and classrooms are
  often offline. Teachers also download the file and send it over WeChat — it must work by double-click.
- `<html lang="zh-CN">`.
- A back link to the hub: `<a class="back" href="/classes/<course id>">← 游戏大厅</a>`.
- A 「老师说明」 button that opens a short teacher guide.
- `game.json` fields valid; `course` exists; `session` is in range. Under 3 MB.

Not machine-checked, but required:

- Vanilla JS (ES2020+), no frameworks, no build step. Target recent Chrome, Edge, Safari and the WeChat
  in-app browser.
- **All UI text in Simplified Chinese**, written for students aged 9–15: friendly, plain, not childish.
- **Teacher-led projection is the main scenario**: a teacher drives the game on a classroom computer
  projected to ~40 students who usually have no devices. Design for "the whole class looks, discusses,
  votes by raising hands, and the teacher clicks". Body text ≥ 20px; key content (answers, results,
  vote counts) ≥ 32px; big click targets (≥ 44px).
- Must also work on a phone: no horizontal scrolling at 375px width.
- No student personal data: no names, logins, or free-text about individuals. Class name and head count
  typed by the teacher for the export are fine.
- `localStorage` only as an optional convenience, always wrapped in `try/catch`; the game must work without it.
- No `alert`/`confirm`/`prompt`; build confirmations into the page.
- **Export**: an 「导出本节课结果」 button producing a PNG (canvas, no libraries) of the class's results and
  a CSV of the raw data (date, class name, head count, results). Funders need this as evidence. The
  template has a working example.
- The 老师说明 says which lesson the game supports, what students should understand, and the classroom flow
  with suggested minutes per step.
- Content must be original and age-appropriate. Any example phone numbers, addresses, URLs or "AI outputs"
  are clearly fictional. When simplifying how AI works, say so honestly in the UI
  (e.g. "这是一个简化版……真正的 AI……").

## Style guide (match the hub)

The hub is clean and calm, like Khan Academy or Code.org — not flashy. Games should feel like part of it.

- **Copy the template's `:root` variables unchanged** and use them; don't invent new colors.
  - Background `--bg` #faf8f3 (warm white), cards `--card` #fff with a 1px `--line` border.
  - Primary `--primary` #1f7a68 (deep teal): main buttons, selected states, progress.
  - Accent `--accent` #e8a33a (amber): reveals and highlights only — use sparingly.
  - `--good` / `--bad` only for right/wrong feedback.
- **Typography**: the template's system font stack (PingFang SC / Microsoft YaHei / Noto Sans CJK SC).
  No web fonts. Bold for headings, regular for body.
- **Layout**: header (back link, title, 老师说明), a step bar if there are multiple stages, then one stage
  at a time. White cards on the warm background, 14px corner radius, generous spacing, left-aligned text.
- **Avoid the "AI-generated" look**: no gradients, glows, glassmorphism, neon colors, rainbow palettes,
  heavy drop shadows, or emoji used as icons everywhere (one or two meaningful emoji in content is fine).
  No decorative filler text.
- End each stage with a dark discussion bar (`.discuss`) holding one question that connects the game to
  the lesson's concept.

## Before you open the PR

1. `npm run validate` passes.
2. `npm run dev`, open `http://localhost:5173/games/<slug>/index.html` and play the whole game.
   Also check the course page `http://localhost:5173/classes/<course id>` shows the new card.
3. Check at ~1920×1080 (projector) and 375px wide (phone, no horizontal scroll).
4. Open `games/<slug>/index.html` directly from disk (file://) — it must still work offline.
5. `npm run build` passes.
6. Fill in the PR template checklist; include 1–2 screenshots.

## Repo layout (for non-game changes)

```
games/<slug>/            one folder per game (index.html, game.json, optional cover)
games/_template/         starter for new games (not shown on the site)
src/data/courses.json    courses and their lessons
src/data/catalog.ts      loads courses + discovers games
src/pages/               home (course list), class-page (one course + its games)
src/components/ui/       shadcn/ui components (add more with `npx shadcn@latest add <name>`)
scripts/validate-games.mjs   game rules checked in CI and before every build
```

The hub itself is React + TypeScript + Vite + Tailwind v4 + shadcn/ui, fully static. Commands:
`npm install`, `npm run dev`, `npm run validate`, `npm run build`. Deploys happen automatically when
`main` changes (`.github/workflows/deploy.yml`); don't deploy manually from a PR.
