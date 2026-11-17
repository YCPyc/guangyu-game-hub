import { ArrowLeft, Clock, Play, Presentation } from "lucide-react"
import { usePostHog } from "@posthog/react"
import { Link, useParams, useSearchParams } from "react-router"
import { Pin, Robot, Squiggle, Wave } from "@/components/art"
import { GameCover, lessonColor } from "@/components/cover-art"
import { gamesFor, getCourse } from "@/data/catalog"
import { localizeCourse, localizeGame, useI18n } from "@/lib/i18n"
import { NotFoundPage } from "@/pages/not-found"

export function ClassPage() {
  const { lang, t } = useI18n()
  const posthog = usePostHog()
  const found = getCourse(useParams().id)
  const [params, setParams] = useSearchParams()
  if (!found) return <NotFoundPage />
  const course = localizeCourse(found, lang)
  const games = gamesFor(course.id)

  // The open lesson lives in the URL (?lesson=2), so going back from a game returns to it.
  // With no valid lesson in the URL, open the first lesson that has games.
  const requested = Number(params.get("lesson"))
  const lesson =
    Number.isInteger(requested) && requested >= 1 && requested <= course.sessions.length
      ? requested
      : (games[0]?.session ?? 1)
  const lessonGames = games.filter((g) => g.session === lesson)
  const color = lessonColor(lesson)

  const handleLessonSelection = (selectedLesson: number) => {
    posthog.capture("lesson_selected", {
      course_id: course.id,
      lesson_number: selectedLesson,
      game_count: games.filter((game) => game.session === selectedLesson).length,
    })
    setParams({ lesson: String(selectedLesson) }, { replace: true })
  }

  const handleGameStart = (gameSlug: string, launchSurface: "cover" | "button") => {
    // The browser leaves for the game page right away, so send this one immediately.
    posthog.capture(
      "game_started",
      { course_id: course.id, lesson_number: lesson, game_slug: gameSlug, launch_surface: launchSurface },
      { transport: "sendBeacon", send_instantly: true },
    )
  }

  return (
    <>
      <section className="mx-auto flex max-w-6xl items-center gap-6 px-4 pt-6 sm:px-5 sm:pt-10">
        <div className="anim-pop min-w-0 flex-1">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 font-semibold text-ink/70 hover:text-primary">
            <ArrowLeft className="size-5" /> {t.allCourses}
          </Link>
          <p className="mt-4 text-sm font-semibold text-ink/60">
            {course.altTitle} · {course.source} · {course.grades}
          </p>
          <h1 className="display mt-2 text-4xl leading-tight sm:text-6xl">{course.title}</h1>
        </div>
        <svg viewBox="-90 -195 180 200" className="hidden h-44 shrink-0 md:block" aria-hidden="true">
          <g className="anim-bob">
            <Robot />
          </g>
        </svg>
      </section>

      {/* 课程地图：每节课一个站点，点一下只看这节课的游戏 */}
      <section className="mx-auto mt-8 max-w-6xl px-4 sm:px-5">
        <div className="chunky px-4 pt-6 pb-6 sm:px-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="display text-2xl sm:text-3xl">
              {t.courseMapTitle} <span className="ml-1 text-sm font-bold tracking-[0.2em] text-ink/50 uppercase">{t.courseMapLabel}</span>
            </h2>
            <p className="font-medium text-ink/60">👆 {t.courseMapHint}</p>
          </div>
          <ol className="relative mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
            <span
              aria-hidden="true"
              className="absolute top-[98px] right-[12%] left-[12%] hidden border-t-[3px] border-dashed border-ink/30 sm:block"
            />
            {course.sessions.map((s, i) => {
              const n = i + 1
              const count = games.filter((g) => g.session === n).length
              const active = n === lesson
              const c = lessonColor(n)
              return (
                <li key={s} className="relative">
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => handleLessonSelection(n)}
                    className="group flex w-full flex-col items-center rounded-2xl px-1 pt-16 pb-2 text-center focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none"
                  >
                    {active ? (
                      <svg key={lesson} viewBox="-20 -52 40 56" className="absolute top-1 left-1/2 h-11 -translate-x-1/2" aria-hidden="true">
                        <Pin x={0} y={0} fill="var(--coral)" />
                      </svg>
                    ) : null}
                    <span
                      className={`display relative flex size-16 items-center justify-center rounded-full border-[2.5px] border-ink text-3xl transition-transform sm:size-[4.5rem] ${
                        active ? "shadow-[0_3px_0_0_var(--ink)]" : "group-hover:-translate-y-1"
                      }`}
                      style={{ background: active ? c.strong : c.soft }}
                    >
                      {active ? (
                        <span aria-hidden="true" className="anim-spin-slow absolute -inset-2 rounded-full border-[2.5px] border-dashed border-coral" />
                      ) : null}
                      {n}
                    </span>
                    <span className={`mt-3 text-base leading-snug sm:text-lg ${active ? "font-bold" : "font-medium text-ink/80"}`}>{s}</span>
                    <span
                      className={`mt-1.5 rounded-full px-2.5 py-0.5 text-sm font-semibold ${count > 0 ? "border-2 border-ink" : "text-ink/50"}`}
                      style={count > 0 ? { background: c.soft } : undefined}
                    >
                      {count > 0 ? t.sessionGames(count) : t.gamesInProgress}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="mt-12">
        <Wave fill={color.soft} />
        <div className="pb-14" style={{ background: color.soft }}>
          <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-5">
            <p className="display text-xl text-ink/70">{t.sessionNumber(lesson)}</p>
            <h2 className="display mt-1 text-3xl sm:text-4xl">{course.sessions[lesson - 1]}</h2>
            <Squiggle className="mt-2 text-ink/40" />

            {lessonGames.length === 0 ? (
              <div className="chunky mt-8 flex flex-col items-center px-6 py-10 text-center">
                <svg viewBox="-90 -195 180 200" className="h-32" aria-hidden="true">
                  <g className="anim-bob">
                    <Robot wave={false} />
                  </g>
                </svg>
                <p className="display mt-4 text-2xl">{t.noGamesYet}</p>
              </div>
            ) : null}

            <div key={lesson} className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {lessonGames.map((game, i) => {
                const g = localizeGame(game, lang)
                return (
                  // Every row below has a fixed height, so the same content lines up across all cards.
                  <article key={g.slug} className="chunky lift anim-pop flex flex-col overflow-hidden" style={{ animationDelay: `${i * 0.08}s` }}>
                    <a href={g.href} onClick={() => handleGameStart(g.slug, "cover")} tabIndex={-1} aria-hidden="true">
                      <GameCover game={game} className="aspect-video w-full border-b-[2.5px] border-ink" />
                    </a>
                    <div className="flex flex-1 flex-col px-5 pt-5">
                      <h3 className="display truncate text-2xl" title={g.title}>
                        {g.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 min-h-[4.875em] leading-relaxed text-ink/75" title={g.summary}>
                        {g.summary}
                      </p>
                      <div className="mt-4 flex h-[4.25rem] flex-wrap content-start gap-1.5 overflow-hidden">
                        {g.concepts.map((k) => (
                          <span key={k} className="rounded-full border-2 border-ink px-2.5 py-0.5 text-sm font-semibold" style={{ background: color.soft }}>
                            {k}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-col gap-1.5 text-sm font-medium text-ink/65">
                        <span className="flex items-center gap-2">
                          <Clock className="size-4 shrink-0" /> {g.minutes}
                        </span>
                        <span className="flex items-center gap-2" title={g.format}>
                          <Presentation className="size-4 shrink-0" /> <span className="truncate">{g.format}</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 px-5 pb-5">
                      <a
                        href={g.href}
                        onClick={() => handleGameStart(g.slug, "button")}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-[2.5px] border-ink bg-coral px-5 text-lg font-bold whitespace-nowrap text-white shadow-[0_4px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                      >
                        <Play className="size-5 fill-current" /> {t.startGame}
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
