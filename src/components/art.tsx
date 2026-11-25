// 网站的插画：墨线 + 柔和平涂，全部是内联 SVG（不依赖外部图片，离线也能显示）。
// 动画都是 CSS（index.css 里的 anim-*），系统开启“减少动态效果”时会自动停止。
import type { CSSProperties, ReactNode } from "react"
import { cn } from "cn"

const INK = "var(--ink)"

/** 小机器人吉祥物。原点在两脚中间，高约 180。 */
export function Robot({ wave = true, screen = "#1769b5" }: { wave?: boolean; screen?: string }) {
  return (
    <g className="ink-art">
      <line x1="0" y1="-150" x2="0" y2="-168" />
      <circle cx="0" cy="-174" r="8" fill="var(--sun)" className="anim-glow" />
      <rect x="-62" y="-128" width="14" height="26" rx="6" fill="var(--coral-soft)" />
      <rect x="48" y="-128" width="14" height="26" rx="6" fill="var(--coral-soft)" />
      <rect x="-50" y="-152" width="100" height="78" rx="24" fill="#fff" />
      <rect x="-38" y="-140" width="76" height="52" rx="15" fill={screen} />
      <g className="anim-blink">
        <ellipse cx="-14" cy="-118" rx="5" ry="7" fill="#fff" className="no-stroke" />
        <ellipse cx="14" cy="-118" rx="5" ry="7" fill="#fff" className="no-stroke" />
      </g>
      <path d="M-10 -103 q10 8 20 0" fill="none" stroke="#fff" />
      <rect x="-12" y="-76" width="24" height="10" rx="3" fill="var(--sky)" />
      <path d="M-40 -60 q-22 14 -18 40" fill="none" strokeWidth="9" />
      <path d="M-40 -60 q-22 14 -18 40" fill="none" stroke="#fff" strokeWidth="4" />
      <g className={wave ? "anim-wave" : undefined}>
        <path d="M40 -60 q24 -10 30 -42" fill="none" strokeWidth="9" />
        <path d="M40 -60 q24 -10 30 -42" fill="none" stroke="#fff" strokeWidth="4" />
        <circle cx="71" cy="-106" r="8" fill="#fff" />
      </g>
      <rect x="-42" y="-68" width="84" height="58" rx="20" fill="var(--mint-deep)" />
      <circle cx="0" cy="-40" r="11" fill="var(--sun)" />
      <path d="M-4 -41 l3 4 l6 -8" fill="none" strokeWidth="2.5" />
      <rect x="-28" y="-12" width="20" height="12" rx="5" fill="#fff" />
      <rect x="8" y="-12" width="20" height="12" rx="5" fill="#fff" />
    </g>
  )
}

/** 学生小人：可以举手（课堂上全班举手投票）。原点在脚下，高约 100。 */
export function Kid({ shirt, hair = "#3b2f2a", hand = false, skin = "#f6d3b3" }: { shirt: string; hair?: string; hand?: boolean; skin?: string }) {
  return (
    <g className="ink-art">
      <line x1="-7" y1="-26" x2="-8" y2="0" />
      <line x1="7" y1="-26" x2="8" y2="0" />
      {hand ? (
        <g className="anim-wave" style={{ transformOrigin: "10% 100%" }}>
          <path d="M14 -52 l12 -32" fill="none" />
          <circle cx="27" cy="-87" r="5" fill={skin} />
        </g>
      ) : (
        <path d="M15 -52 l7 22" fill="none" />
      )}
      <path d="M-15 -52 l-7 22" fill="none" />
      <rect x="-17" y="-62" width="34" height="40" rx="13" fill={shirt} />
      <circle cx="0" cy="-80" r="17" fill={skin} />
      <path d="M-17 -82 q2 -18 17 -17 q16 0 17 16 q-10 -6 -18 -6 q-8 0 -16 7z" fill={hair} />
      <circle cx="-6" cy="-78" r="1.8" fill={INK} className="no-stroke" />
      <circle cx="6" cy="-78" r="1.8" fill={INK} className="no-stroke" />
      <path d="M-4 -71 q4 3 8 0" fill="none" strokeWidth="2" />
    </g>
  )
}

export function Tree({ x, y, s = 1, fill = "var(--leaf)", delay = 0 }: { x: number; y: number; s?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ink-art anim-sway" style={{ animationDelay: `${delay}s` }}>
        <line x1="0" y1="0" x2="0" y2="-30" strokeWidth="4" />
        <circle cx="0" cy="-48" r="24" fill={fill} />
        <path d="M-8 -54 q4 -6 10 -6" fill="none" strokeWidth="2" opacity="0.6" />
      </g>
    </g>
  )
}

/** 地图上的定位针（像参考网站那样从天上掉下来，然后时不时跳一下） */
export function Pin({ x, y, fill = "var(--coral)", delay = 0 }: { x: number; y: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ink-art anim-pin" style={{ animationDelay: `${delay}s, ${delay + 1}s` }}>
        <path d="M0 0 c-6 -10 -16 -18 -16 -30 a16 16 0 0 1 32 0 c0 12 -10 20 -16 30z" fill={fill} />
        <circle cx="0" cy="-30" r="6" fill="#fff" />
      </g>
    </g>
  )
}

/** 漂浮的字块（词元），提示“AI 把文字拆成小块来读” */
export function Tile({ x, y, ch, fill = "#fff", r = 6, delay = 0 }: { x: number; y: number; ch: string; fill?: string; r?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="anim-float" style={{ "--r": `${r}deg`, animationDelay: `${delay}s` } as CSSProperties}>
        <rect x="-22" y="-22" width="44" height="44" rx="10" fill={fill} className="ink-art" />
        <text y="9" textAnchor="middle" fontSize="24" fontWeight="700" fill={INK} fontFamily="var(--font-display)">
          {ch}
        </text>
      </g>
    </g>
  )
}

export function Sparkle({ x, y, s = 1, fill = "var(--sun)", delay = 0 }: { x: number; y: number; s?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 -12 q2 10 12 12 q-10 2 -12 12 q-2 -10 -12 -12 q10 -2 12 -12z"
        fill={fill}
        className="ink-art anim-twinkle"
        strokeWidth="2"
        style={{ animationDelay: `${delay}s` }}
      />
    </g>
  )
}

function CloudShape({ fill = "#fff" }: { fill?: string }) {
  return (
    <path
      d="M20 52 h120 a22 22 0 0 0 0 -44 a30 30 0 0 0 -54 -6 a24 24 0 0 0 -44 12 a19 19 0 0 0 -22 38z"
      fill={fill}
      className="ink-art"
    />
  )
}

/** 全站背景：慢慢飘过的云和一闪一闪的小星星，不挡点击 */
export function SkyLayer() {
  const clouds = [
    { top: "9%", w: 150, dur: 70, delay: -10 },
    { top: "30%", w: 110, dur: 95, delay: -60 },
    { top: "58%", w: 170, dur: 85, delay: -35 },
    { top: "80%", w: 120, dur: 110, delay: -80 },
  ]
  const dots = [
    ["6%", "22%", 0], ["93%", "16%", 0.8], ["88%", "48%", 1.6], ["4%", "66%", 0.4], ["50%", "92%", 1.2], ["70%", "8%", 2],
  ] as const
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {clouds.map((c, i) => (
        <svg
          key={i}
          viewBox="4 -16 162 72"
          width={c.w}
          className="anim-drift absolute left-0 max-w-[28vw] opacity-50 sm:max-w-none sm:opacity-70"
          style={{ top: c.top, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
        >
          <CloudShape />
        </svg>
      ))}
      {dots.map(([left, top, delay], i) => (
        <svg key={i} viewBox="-14 -14 28 28" width="22" className="absolute" style={{ left, top }}>
          <Sparkle x={0} y={0} s={0.9} fill={i % 2 ? "var(--mint-deep)" : "var(--sun)"} delay={delay} />
        </svg>
      ))}
    </div>
  )
}

/** 首页大插画：一个小小的“AI 小镇”——学校、机器人、举手的同学、漂浮的字块 */
export function HeroScene({ hello, className }: { hello: string; className?: string }) {
  return (
    <svg viewBox="0 0 720 560" className={className} role="img" aria-hidden="true">
      {/* 飞过天空的纸飞机 */}
      <g className="anim-plane">
        <path d="M0 0 l38 -14 l-12 32 l-8 -12z M18 6 l20 -20" fill="#fff" className="ink-art" />
        <path d="M-6 6 q-30 10 -60 0 q-30 -10 -60 4" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="4 7" opacity="0.5" />
      </g>

      {/* 小岛和小路 */}
      <path
        d="M40 420 C 30 330 120 290 220 300 C 300 250 420 240 520 262 C 640 270 710 330 690 420 C 680 500 560 540 380 540 C 200 545 50 510 40 420z"
        fill="var(--mint)"
        className="ink-art"
      />
      <path d="M110 520 C 200 470 250 440 330 430 C 420 420 470 400 495 372" fill="none" stroke="var(--cream)" strokeWidth="26" strokeLinecap="round" />
      <path d="M110 520 C 200 470 250 440 330 430 C 420 420 470 400 495 372" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="2 14" strokeLinecap="round" opacity="0.5" />

      {/* 学校 */}
      <g className="ink-art">
        <line x1="495" y1="160" x2="495" y2="96" />
        <path d="M497 98 q20 -8 40 0 q-2 12 0 24 q-20 -8 -40 0z" fill="var(--sun)" className="anim-flag" />
        <rect x="400" y="222" width="190" height="150" rx="6" fill="#fff" />
        <path d="M388 226 L495 160 L602 226z" fill="var(--coral)" />
        <circle cx="495" cy="202" r="15" fill="#fff" />
        <path d="M495 194 v8 h6" fill="none" strokeWidth="2" />
        {[420, 470, 528].map((x) => (
          <rect key={x} x={x} y="244" width="38" height="34" rx="6" fill="var(--sky)" />
        ))}
        {[420, 528].map((x) => (
          <rect key={x} x={x} y="298" width="38" height="34" rx="6" fill="var(--sky)" />
        ))}
        <path d="M474 372 v-56 a21 21 0 0 1 42 0 v56z" fill="#1769b5" />
      </g>

      {/* 左边的小房子 */}
      <g className="ink-art">
        <rect x="82" y="282" width="104" height="80" rx="6" fill="#fff" />
        <path d="M72 286 L134 238 L196 286z" fill="var(--sun)" />
        <rect x="100" y="304" width="30" height="26" rx="5" fill="var(--sky)" />
        <rect x="146" y="316" width="24" height="46" rx="4" fill="var(--coral-soft)" />
      </g>

      <Tree x={226} y={318} s={0.9} delay={0.3} />
      <Tree x={372} y={300} s={0.7} fill="var(--mint-deep)" delay={1} />
      <Pin x={226} y={240} fill="var(--sun)" delay={0.8} />
      <Tree x={636} y={340} s={1.05} delay={0.6} />
      <Tree x={70} y={420} s={0.85} fill="var(--mint-deep)" delay={1.4} />
      <Tree x={612} y={452} s={0.8} delay={2} />

      <Pin x={134} y={228} delay={0.2} />
      <Pin x={600} y={214} fill="#1769b5" delay={0.5} />

      {/* 机器人和举手的同学 */}
      <g transform="translate(300 470)">
        <ellipse cx="0" cy="4" rx="60" ry="9" fill={INK} opacity="0.12" />
        <g className="anim-bob">
          <Robot />
        </g>
      </g>
      <g transform="translate(190 498)">
        <Kid shirt="var(--sky-deep)" hand />
      </g>
      <g transform="translate(430 500)">
        <Kid shirt="var(--sun)" hair="#5a3b2c" />
      </g>
      <g transform="translate(520 486) scale(0.92)">
        <Kid shirt="var(--coral)" hair="#2b2b33" skin="#e9bf98" hand />
      </g>

      {/* 机器人说“你好！” */}
      <g transform="translate(336 212)">
        <g className="anim-bob" style={{ animationDelay: "0.6s" }}>
        <path d="M0 0 h96 a16 16 0 0 1 16 16 v20 a16 16 0 0 1 -16 16 h-74 l-18 14 l2 -14 a16 16 0 0 1 -6 -12 v-24 a16 16 0 0 1 0 -16z" fill="#fff" className="ink-art" />
        <text x="54" y="35" textAnchor="middle" fontSize="22" fontWeight="700" fill={INK} fontFamily="var(--font-display)">
          {hello}
        </text>
        </g>
      </g>

      {/* 漂浮的字块 */}
      <Tile x={92} y={150} ch="A" fill="var(--sun-soft)" r={-8} />
      <Tile x={196} y={96} ch="猫" fill="#fff" r={6} delay={0.8} />
      <Tile x={292} y={168} ch="I" fill="var(--sky)" r={-4} delay={1.6} />
      <Tile x={640} y={150} ch="?" fill="var(--coral-soft)" r={8} delay={0.4} />
      <Sparkle x={250} y={220} delay={0.3} />
      <Sparkle x={590} y={80} fill="var(--mint-deep)" delay={1.1} />
      <Sparkle x={40} y={260} s={0.8} delay={1.8} />
    </svg>
  )
}

/** 波浪形的分隔线，用在色块区域的上边缘 */
export function Wave({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={cn("block h-8 w-full sm:h-12", className)} aria-hidden="true">
      <path d="M0 40 C 180 0 360 0 540 30 S 900 70 1080 30 S 1340 0 1440 24 V60 H0z" fill={fill} />
      <path d="M0 40 C 180 0 360 0 540 30 S 900 70 1080 30 S 1340 0 1440 24" fill="none" stroke={INK} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** 小小的手绘波浪线（标题下方的装饰） */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 12" className={cn("h-3 w-20", className)} aria-hidden="true">
      <path d="M2 6 q6 -6 12 0 t12 0 t12 0 t12 0 t12 0 t12 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** 带插画的小圆形图标框 */
export function Bubble({ children, fill, className }: { children: ReactNode; fill: string; className?: string }) {
  return (
    <span
      className={cn("flex size-16 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink", className)}
      style={{ background: fill }}
    >
      {children}
    </span>
  )
}
