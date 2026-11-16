import type { Course, Game } from "@/data/catalog"

// 简单的扁平插画，作为课程和游戏的封面。纯 SVG，不依赖外部图片。
const TONES: Record<Course["tone"], { bg: string; a: string; b: string; c: string }> = {
  teal: { bg: "#dcefe9", a: "#1f7a68", b: "#f2b84b", c: "#ffffff" },
  amber: { bg: "#f8ecd4", a: "#c8841f", b: "#1f7a68", c: "#ffffff" },
  blue: { bg: "#dfe8f6", a: "#2f5fa7", b: "#f2b84b", c: "#ffffff" },
  coral: { bg: "#f8e1da", a: "#c8553d", b: "#2f5fa7", c: "#ffffff" },
}

/** A small classroom mascot, drawn in the hub palette (no remote art or fonts). */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 360" className={className} role="img" aria-hidden="true">
      <ellipse cx="282" cy="315" rx="160" ry="18" fill="#1f2937" opacity=".12" />
      <path d="M94 104h122a18 18 0 0 1 18 18v48a18 18 0 0 1-18 18h-54l-26 22v-22H94a18 18 0 0 1-18-18v-48a18 18 0 0 1 18-18Z" fill="#fff" />
      <circle cx="113" cy="145" r="8" fill="#1f7a68" /><circle cx="143" cy="145" r="8" fill="#f2b84b" /><circle cx="173" cy="145" r="8" fill="#1f7a68" />
      <path d="M366 76h100a16 16 0 0 1 16 16v42a16 16 0 0 1-16 16h-30l-20 18v-18h-50a16 16 0 0 1-16-16V92a16 16 0 0 1 16-16Z" fill="#fff" />
      <path d="M388 112h56" stroke="#1f7a68" strokeWidth="8" strokeLinecap="round" /><path d="M388 129h35" stroke="#1f7a68" strokeWidth="6" strokeLinecap="round" opacity=".35" />
      <path d="M249 112V85" stroke="#1f2937" strokeWidth="10" strokeLinecap="round" /><circle cx="249" cy="75" r="15" fill="#f2b84b" />
      <rect x="173" y="112" width="176" height="164" rx="52" fill="#1f7a68" />
      <rect x="194" y="136" width="134" height="92" rx="34" fill="#fff" />
      <ellipse cx="234" cy="175" rx="11" ry="15" fill="#1f2937" /><ellipse cx="289" cy="175" rx="11" ry="15" fill="#1f2937" />
      <path d="M242 202q20 18 40 0" fill="none" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" />
      <path className="hero-bot-arm" d="M176 177q-38 5-40 39" fill="none" stroke="#1f7a68" strokeWidth="17" strokeLinecap="round" />
      <path d="M348 177q38 5 40 39" fill="none" stroke="#1f7a68" strokeWidth="17" strokeLinecap="round" />
      <path d="M220 276v26m82-26v26" stroke="#1f2937" strokeWidth="16" strokeLinecap="round" />
      <path d="M206 303h30m50 0h30" stroke="#f2b84b" strokeWidth="13" strokeLinecap="round" />
      <path d="m416 216 8 17 19 2-14 12 4 19-17-9-17 9 4-19-14-12 19-2Z" fill="#f2b84b" />
      <circle cx="111" cy="252" r="12" fill="#f2b84b" /><path d="m452 240 5 10 11 1-8 7 2 11-10-5-10 5 2-11-8-7 11-1Z" fill="#1f7a68" />
    </svg>
  )
}

/** 课程封面：对话气泡 + 一个由节点连成的“大脑” */
export function CourseCover({ tone, className }: { tone: Course["tone"]; className?: string }) {
  const t = TONES[tone]
  return (
    <svg viewBox="0 0 320 200" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <rect width="320" height="200" fill={t.bg} />
      <circle cx="262" cy="42" r="70" fill={t.c} opacity="0.45" />
      <rect x="34" y="52" width="132" height="54" rx="16" fill={t.c} />
      <path d="M58 106 l0 18 l18 -18 z" fill={t.c} />
      <rect x="52" y="70" width="70" height="7" rx="3.5" fill={t.a} opacity="0.85" />
      <rect x="52" y="84" width="96" height="7" rx="3.5" fill={t.a} opacity="0.35" />
      <rect x="120" y="120" width="104" height="44" rx="14" fill={t.a} />
      <path d="M204 164 l0 16 l-16 -16 z" fill={t.a} />
      <rect x="136" y="136" width="56" height="6" rx="3" fill={t.c} opacity="0.9" />
      <rect x="136" y="148" width="36" height="6" rx="3" fill={t.c} opacity="0.55" />
      <g stroke={t.a} strokeWidth="3" opacity="0.7">
        <line x1="236" y1="70" x2="276" y2="96" />
        <line x1="276" y1="96" x2="252" y2="132" />
        <line x1="236" y1="70" x2="252" y2="132" />
        <line x1="276" y1="96" x2="296" y2="62" />
      </g>
      <circle cx="236" cy="70" r="9" fill={t.a} />
      <circle cx="276" cy="96" r="11" fill={t.b} />
      <circle cx="252" cy="132" r="8" fill={t.a} />
      <circle cx="296" cy="62" r="6" fill={t.a} />
    </svg>
  )
}

/** 游戏封面：游戏文件夹里有封面图（game.json 的 cover）就用它，否则用课程配色的通用图案 */
export function GameCover({ game, tone, className }: { game: Game; tone: Course["tone"]; className?: string }) {
  if (game.coverUrl) return <img src={game.coverUrl} alt="" className={className} style={{ objectFit: "cover" }} />
  const t = TONES[tone]
  return (
    <svg viewBox="0 0 320 180" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <rect width="320" height="180" fill={t.bg} />
      <rect x="60" y="48" width="120" height="84" rx="14" fill={t.c} />
      <rect x="76" y="66" width="70" height="8" rx="4" fill={t.a} opacity="0.8" />
      <rect x="76" y="82" width="88" height="8" rx="4" fill={t.a} opacity="0.35" />
      <rect x="76" y="98" width="52" height="8" rx="4" fill={t.a} opacity="0.35" />
      <circle cx="226" cy="90" r="34" fill={t.a} />
      <path d="M216 76 l26 14 l-26 14 z" fill={t.c} />
      <circle cx="262" cy="52" r="10" fill={t.b} />
    </svg>
  )
}
