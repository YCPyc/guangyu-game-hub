import { ArrowDown, ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router"
import { CourseCover, HeroIllustration } from "@/components/cover-art"
import { Badge } from "@/components/ui/badge"
import { COURSES, gamesFor } from "@/data/catalog"
import { localizeCourse, useI18n } from "@/lib/i18n"

export function HomePage() {
  const { lang, t } = useI18n()
  return (
    <>
      <section className="hero-scene relative overflow-hidden border-b">
        <div className="hero-inner mx-auto grid max-w-6xl items-center gap-8 px-5 py-12 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
          <div className="hero-copy relative z-10">
            <p className="hero-kicker inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-semibold text-primary"><Sparkles className="size-4" />{t.kicker}</p>
            <h1 className="mt-5 max-w-2xl text-4xl leading-[1.18] font-black tracking-tight sm:text-6xl">{t.heroTitle}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{t.heroLead}</p>
            <a className="hero-cta mt-7 inline-flex min-h-14 items-center gap-3 rounded-full bg-primary px-7 py-3 text-lg font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-lg" href="#courses">
              {t.allCourses}<ArrowDown className="size-5" />
            </a>
            <div className="hero-stats mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/80 px-4 py-2">{t.courseCount(COURSES.length)}</span>
              <span className="rounded-full bg-white/80 px-4 py-2">{t.gameCount(COURSES.reduce((n, c) => n + gamesFor(c.id).length, 0))} {t.gamesLabel}</span>
              <span className="rounded-full bg-white/80 px-4 py-2">{t.heroTogether}</span>
            </div>
          </div>
          <div className="hero-art-wrap relative mx-auto w-full max-w-[560px]" aria-hidden="true">
            <div className="hero-sun" />
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />
            <HeroIllustration className="hero-art relative z-10 w-full overflow-visible" />
            <div className="hero-note hero-note-top">{t.heroTagOne}</div>
            <div className="hero-note hero-note-bottom">{t.heroTagTwo}</div>
            <span className="hero-star hero-star-one" aria-hidden="true">✳</span><span className="hero-star hero-star-two" aria-hidden="true">✦</span>
          </div>
        </div>
        <div className="hero-wave" aria-hidden="true"><svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0,42 C220,100 420,0 680,44 C930,88 1155,14 1440,52 L1440,90 L0,90 Z" /></svg></div>
      </section>

      <section id="courses" className="course-section mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="section-heading flex items-end justify-between gap-4">
          <div><p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-primary">{t.courseEyebrow}</p><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t.allCourses}</h2></div>
          <p className="rounded-full border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">{t.courseCount(COURSES.length)}</p>
        </div>

        <ul className={`mt-8 grid grid-cols-1 gap-6 ${COURSES.length === 1 ? "single-course-list" : "md:grid-cols-2"}`}>
          {COURSES.map((course) => {
            const c = localizeCourse(course, lang)
            return (
              <li key={c.id} className="course-item">
                <Link
                  to={`/classes/${c.id}`}
                  className={`course-tile group flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-card focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${COURSES.length === 1 ? "course-tile-wide" : ""}`}
                >
                  <div className="course-art relative">
                    <CourseCover tone={c.tone} className="aspect-[16/9] w-full object-cover" />
                    <Badge variant="secondary" className="course-source absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1">{c.source}</Badge>
                    <span className="course-number absolute bottom-3 right-5">0{COURSES.indexOf(course) + 1}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-sm font-semibold text-muted-foreground">{c.altTitle}</p>
                    <h3 className="mt-1 text-2xl leading-snug font-black tracking-tight group-hover:text-primary">{c.title}</h3>
                    <p className="mt-3 line-clamp-2 leading-relaxed text-muted-foreground">{c.summary}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                      <span className="rounded-full bg-muted px-4 py-2 text-sm font-semibold">{t.sessionCount(c.sessions.length)} · {t.gameCount(gamesFor(c.id).length)} {t.gamesLabel}</span>
                      <span className="course-arrow grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><ArrowRight className="size-5 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="mt-8 rounded-xl border border-dashed px-5 py-4 text-sm text-muted-foreground">{t.moreCourses}</p>
      </section>
    </>
  )
}
