import type { Course, Game } from "@/data/catalog"
import { Pin, Robot, Sparkle, Tile } from "@/components/art"

// 每节课一个颜色，课程地图、游戏封面和标签都用它（第 5 节以后循环使用）
export const LESSON_COLORS = [
  { soft: "var(--mint)", strong: "var(--mint-deep)", screen: "#1f7a68" },
  { soft: "var(--sun-soft)", strong: "var(--sun)", screen: "#c27a12" },
  { soft: "var(--coral-soft)", strong: "var(--coral)", screen: "#c2492a" },
  { soft: "var(--sky)", strong: "var(--sky-deep)", screen: "#2f6f95" },
]
export const lessonColor = (session: number) => LESSON_COLORS[(session - 1) % LESSON_COLORS.length]

/** 课程封面：机器人和几块漂浮的字块 */
export function CourseCover({ className }: { tone?: Course["tone"]; className?: string }) {
  return (
    <svg viewBox="0 0 320 220" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <rect width="320" height="220" fill="var(--mint)" />
      <circle cx="250" cy="50" r="70" fill="#fff" opacity="0.5" />
      <path d="M0 190 q80 -30 160 -10 t160 -8 v48 h-320z" fill="var(--mint-deep)" className="ink-art" />
      <g transform="translate(160 196) scale(0.82)">
        <g className="anim-bob">
          <Robot />
        </g>
      </g>
      <Tile x={58} y={70} ch="A" fill="var(--sun-soft)" r={-8} />
      <Tile x={262} y={96} ch="词" fill="#fff" r={6} delay={0.9} />
      <Sparkle x={86} y={140} delay={0.4} />
      <Pin x={258} y={176} delay={0.3} />
    </svg>
  )
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** 游戏封面：游戏文件夹里有封面图（game.json 的 cover）就用它，否则画一张这节课颜色的机器人小图 */
export function GameCover({ game, className }: { game: Game; tone?: Course["tone"]; className?: string }) {
  if (game.coverUrl) return <img src={game.coverUrl} alt="" className={className} style={{ objectFit: "cover" }} />
  const c = lessonColor(game.session)
  const h = hash(game.slug)
  const chars = ["A", "?", "!", "词", "AI", "你", "好", "★"]
  const a = chars[h % chars.length]
  const b = chars[(h >> 3) % chars.length]
  const flip = h % 2 === 0
  return (
    <svg viewBox="0 0 320 180" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <rect width="320" height="180" fill={c.soft} />
      <circle cx={flip ? 70 : 250} cy="40" r="56" fill="#fff" opacity="0.5" />
      <path d="M0 158 q80 -22 160 -6 t160 -6 v40 h-320z" fill={c.strong} className="ink-art" />
      <g transform={`translate(${flip ? 196 : 124} 160) scale(0.66)`}>
        <Robot screen={c.screen} wave={h % 3 !== 0} />
      </g>
      <Tile x={flip ? 70 : 250} y={70} ch={a} fill="#fff" r={-6} delay={(h % 5) * 0.3} />
      <Tile x={flip ? 112 : 208} y={124} ch={b} fill="var(--cream)" r={8} delay={1 + (h % 3) * 0.4} />
      <Sparkle x={flip ? 280 : 40} y={36} delay={h % 2} />
    </svg>
  )
}
