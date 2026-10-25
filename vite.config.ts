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
function games(): Plugin {
  return {
    name: 'guangyu-games',
    configureServer(server) {
      server.middlewares.use('/games', (req, res, next) => {
        // Requests with a query (e.g. game.json?import) are Vite module imports — let Vite handle them.
        if (req.url?.includes('?')) return next()
        let file = path.join(GAMES_DIR, decodeURIComponent((req.url ?? '/').split('?')[0]))
        if (!file.startsWith(GAMES_DIR)) return next()
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
        if (!fs.existsSync(file)) return next()
        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream')
        fs.createReadStream(file).pipe(res)
      })
    },
    closeBundle() {
      fs.cpSync(GAMES_DIR, path.resolve(__dirname, 'dist/games'), {
        recursive: true,
        filter: (src) => src === GAMES_DIR || !path.relative(GAMES_DIR, src).split(path.sep)[0].startsWith('_'),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), games()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
