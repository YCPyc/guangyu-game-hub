# 光语课堂游戏

A game hub for 光语's AI-literacy courses: the home page lists courses, and each course page lists its
classroom games. Games are built by the team with coding agents and reviewed weekly — see
[CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and [AGENTS.md](AGENTS.md) for the rules agents follow.

React + TypeScript + Vite + Tailwind v4 + shadcn/ui. Fully static, served by Caddy on Alibaba Cloud so it
is reachable from mainland China.

```
games/<slug>/            one folder per game: index.html (standalone, offline) + game.json + cover
games/_template/         starter for new games
src/data/courses.json    courses and their lessons
src/                     the hub (React)
scripts/validate-games.mjs   game rules, run in CI and before every build
```

## Develop

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # validate games, type-check, build to dist/

## Deploy

Merging to `main` deploys automatically (`.github/workflows/deploy.yml`). Manual deploy:
`./deploy.sh root@<server ip>`.

## One-time setup (repo owner)

1. **Deploy secrets** — in GitHub: Settings → Secrets and variables → Actions, add `DEPLOY_HOST`
   (`root@<server ip>`) and `DEPLOY_SSH_KEY` (a private key authorized on the server).
2. **PR previews** — in Cloudflare: Workers & Pages → Create → Pages → Connect to Git → this repo.
   Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
   Every PR then gets a preview link. (Previews are for the team's review; the real site is in China.)
3. **Protect `main`** — Settings → Branches → add a rule for `main`: require a pull request and the
   `CI / build` check to pass before merging.
