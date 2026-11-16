import type { ReactNode } from "react"
import { ArrowDown, ArrowRight, Download, MonitorPlay, MousePointerClick } from "lucide-react"
import { usePostHog } from "@posthog/react"
import { Link } from "react-router"
import { Bubble, HeroScene, Squiggle, Wave } from "@/components/art"
import { CourseCover } from "@/components/cover-art"
import { COURSES, gamesFor } from "@/data/catalog"
import { localizeCourse, useI18n } from "@/lib/i18n"

const STEP_ICONS = [
  { Icon: MousePointerClick, fill: "var(--sun-soft)" },
  { Icon: MonitorPlay, fill: "var(--sky)" },
  { Icon: Download, fill: "var(--coral-soft)" },
]

export function HomePage() {
  const { lang, t } = useI18n()
  const posthog = usePostHog()
  return (
    <>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-4 pt-8 sm:px-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:pt-12">
        <div className="anim-pop">
          <p className="inline-block rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-semibold">{t.kicker}</p>
          <h1 className="display mt-6 text-5xl leading-[1.12] sm:text-6xl lg:text-7xl">
            {t.heroLines[0]}
            <br />
            <span className="relative inline-block text-primary">
              {t.heroLines[1]}
              <Squiggle className="absolute -bottom-3 left-0 w-full text-sun" />
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-xl leading-relaxed text-ink/80">{t.heroLead}</p>
          <a
            href="#courses"
            className="mt-8 inline-flex h-14 items-center gap-2 rounded-full border-[2.5px] border-ink bg-coral px-7 text-lg font-bold text-white shadow-[0_5px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          >
            {t.heroCta} <ArrowDown className="size-5" />
          </a>
        </div>
        <HeroScene hello={t.hello} className="mx-auto w-full max-w-[640px]" />
      </section>

      <ol className="mx-auto mt-4 grid max-w-4xl grid-cols-3 gap-3 px-4 sm:gap-6 sm:px-5">
        {t.steps.map((s, i) => {
          const { Icon, fill } = STEP_ICONS[i]
          return (
            <li key={s.title} className="anim-pop flex flex-col items-center text-center" style={{ animationDelay: `${0.15 * i + 0.2}s` }}>
              <Bubble fill={fill} className="hover-wiggle sm:size-20">
                <Icon className="wiggle-target size-7 sm:size-9" strokeWidth={2.2} />
              </Bubble>
              <p className="display mt-3 text-xl sm:text-2xl">
                <span className="text-primary">{i + 1}.</span> {s.title}
              </p>
              <p className="mt-1 text-sm text-ink/70 sm:text-base">{s.text}</p>
            </li>
          )
        })}
      </ol>

      <section id="courses" className="mt-16 scroll-mt-20">
        <Wave fill="var(--sun-soft)" />
        <div className="bg-sun-soft pb-16">
          <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-5">
            <h2 className="display text-4xl sm:text-5xl">{t.coursesHeading}</h2>
            <p className="mt-1 text-sm font-bold tracking-[0.2em] text-ink/60 uppercase">{t.coursesLabel}</p>

            <ul className="mt-8 flex flex-col gap-8">
              {COURSES.map((course) => {
                const c = localizeCourse(course, lang)
                const games = gamesFor(c.id).length
                return (
                  <li key={c.id}>
                    <Link
                      to={`/classes/${c.id}`}
                      onClick={() => {
                        posthog.capture("course_selected", {
                          course_id: c.id,
                          course_session_count: c.sessions.length,
                          course_game_count: games,
                        })
                      }}
                      className="chunky group grid grid-cols-1 overflow-hidden focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                    >
                      <CourseCover className="aspect-[16/10] h-full w-full border-b-[2.5px] border-ink md:aspect-auto md:border-r-[2.5px] md:border-b-0" />
                      <div className="flex flex-col p-6 sm:p-8">
                        <p className="text-sm font-semibold text-ink/60">
                          {c.altTitle} · {c.source}
                        </p>
                        <h3 className="display mt-2 text-3xl sm:text-4xl">{c.title}</h3>
                        <p className="mt-3 line-clamp-2 text-lg text-ink/75">{c.summary}</p>
                        <div className="mt-5 mb-auto flex flex-wrap gap-2">
                          <Chip fill="var(--mint)">{c.grades}</Chip>
                          <Chip fill="var(--sky)">
                            <b className="text-lg">{c.sessions.length}</b> {t.lessonsLabel}
                          </Chip>
                          <Chip fill="var(--coral-soft)">
                            <b className="text-lg">{games}</b> {t.gamesLabel}
                          </Chip>
                        </div>
                        <span className="mt-7 inline-flex h-12 items-center gap-2 self-start rounded-full border-[2.5px] border-ink bg-primary px-6 font-bold text-white shadow-[0_4px_0_0_var(--ink)] transition-transform group-hover:-translate-y-0.5">
                          {t.viewGames} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <p className="mt-10 text-center text-lg font-semibold text-ink/60">🌱 {t.moreCourses}</p>
          </div>
        </div>
      </section>
    </>
  )
}

function Chip({ children, fill }: { children: ReactNode; fill: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold" style={{ background: fill }}>
      {children}
    </span>
  )
}
