import fs from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const GAMES_DIR = path.resolve(__dirname, 'games')
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

// Each game lives in games/<slug>/ (index.html + game.json + optional cover).
// Dev: serve that folder at /games/*. Build: copy it to dist/games/, skipping
// folders that start with "_" (like the template).
// Both fill in each game's analytics settings (PostHog token/host from the env,
// plus the game's slug, course and lesson); a game opened from disk keeps null and sends nothing.
const ANALYTICS_SLOT = '/*GAME_ANALYTICS_CONFIG*/null'

function withAnalytics(html: string, slug: string, env: Record<string, string>) {
  const token = env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = env.VITE_PUBLIC_POSTHOG_HOST
  if (!token || !host || !html.includes(ANALYTICS_SLOT)) return html
  let meta: { course?: string; session?: number } = {}
  try {
    meta = JSON.parse(fs.readFileSync(path.join(GAMES_DIR, slug, 'game.json'), 'utf8'))
  } catch {
    // Without game.json the events just lack course and lesson.
  }
  const cfg = JSON.stringify({ token, host, slug, course: meta.course ?? null, lesson: meta.session ?? null })
  return html.replace(ANALYTICS_SLOT, () => cfg.replace(/</g, '\\u003c'))
}
function games(): Plugin {
  let env: Record<string, string> = {}
  return {
    name: 'guangyu-games',
    configResolved(config) {
      env = config.env
    },
    configureServer(server) {
      server.middlewares.use('/games', (req, res, next) => {
        // Requests with a query (e.g. game.json?import) are Vite module imports — let Vite handle them.
        if (req.url?.includes('?')) return next()
        let file = path.join(GAMES_DIR, decodeURIComponent((req.url ?? '/').split('?')[0]))
        if (!file.startsWith(GAMES_DIR)) return next()
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
        if (!fs.existsSync(file)) return next()
        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream')
        if (path.basename(file) === 'index.html') {
          const slug = path.relative(GAMES_DIR, file).split(path.sep)[0]
          return res.end(withAnalytics(fs.readFileSync(file, 'utf8'), slug, env))
        }
        fs.createReadStream(file).pipe(res)
      })
    },
    closeBundle() {
      fs.cpSync(GAMES_DIR, path.resolve(__dirname, 'dist/games'), {
        recursive: true,
        filter: (src) => src === GAMES_DIR || !path.relative(GAMES_DIR, src).split(path.sep)[0].startsWith('_'),
      })
      const out = path.resolve(__dirname, 'dist/games')
      for (const slug of fs.readdirSync(out)) {
        const file = path.join(out, slug, 'index.html')
        if (fs.existsSync(file)) fs.writeFileSync(file, withAnalytics(fs.readFileSync(file, 'utf8'), slug, env))
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), games()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
