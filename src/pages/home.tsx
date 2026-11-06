import { ArrowRight } from "lucide-react"
import { Link } from "react-router"
import { CourseCover } from "@/components/cover-art"
import { Badge } from "@/components/ui/badge"
import { COURSES, gamesFor } from "@/data/catalog"
import { localizeCourse, useI18n } from "@/lib/i18n"

export function HomePage() {
  const { lang, t } = useI18n()
  return (
    <>
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <p className="text-sm font-medium text-primary">{t.kicker}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{t.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t.heroLead}</p>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {t.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/30 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">{t.allCourses}</h2>
          <p className="text-sm text-muted-foreground">{t.courseCount(COURSES.length)}</p>
        </div>

        <ul className="mt-6 flex flex-col gap-5">
          {COURSES.map((course) => {
            const c = localizeCourse(course, lang)
            return (
              <li key={c.id}>
                <Link
                  to={`/classes/${c.id}`}
                  className="group grid grid-cols-1 overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                >
                  <CourseCover tone={c.tone} className="aspect-[16/10] h-full w-full object-cover md:aspect-auto" />
                  <div className="flex flex-col p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{c.source}</Badge>
                      <span className="text-sm text-muted-foreground">{c.altTitle}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight group-hover:text-primary">{c.title}</h3>
                    <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">{c.summary}</p>
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">{t.gradesLabel}</dt>
                        <dd className="font-medium">{c.grades}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t.sessionsLabel}</dt>
                        <dd className="font-medium">{t.sessionCount(c.sessions.length)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">{t.gamesLabel}</dt>
                        <dd className="font-medium">{t.gameCount(gamesFor(c.id).length)}</dd>
                      </div>
                    </dl>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary md:mt-auto md:pt-6">
                      {t.viewGames}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
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
