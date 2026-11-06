import { Clock, Download, Play, Presentation } from "lucide-react"
import { Link, useParams, useSearchParams } from "react-router"
import { CourseCover, GameCover } from "@/components/cover-art"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { gamesFor, getCourse } from "@/data/catalog"
import { localizeCourse, localizeGame, useI18n } from "@/lib/i18n"
import { NotFoundPage } from "@/pages/not-found"

export function ClassPage() {
  const { lang, t } = useI18n()
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

  return (
    <>
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t.allCourses}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{course.source}</Badge>
                <span className="text-sm text-muted-foreground">{course.altTitle}</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{course.summary}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {t.courseMeta(course.grades, course.sessions.length, games.length)}
              </p>
            </div>
            <CourseCover tone={course.tone} className="hidden w-full rounded-2xl border md:block" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <h2 className="text-sm font-semibold text-muted-foreground">{t.courseOutline}</h2>
          <ol className="mt-4 flex flex-col">
            {course.sessions.map((s, i) => {
              const n = i + 1
              const count = games.filter((g) => g.session === n).length
              const active = n === lesson
              return (
                <li key={s}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => setParams({ lesson: String(n) }, { replace: true })}
                    className={`flex w-full gap-3 border-l-2 py-2.5 pr-2 pl-4 text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                      active ? "border-primary bg-accent" : "hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold whitespace-nowrap tabular-nums ${
                        active ? "text-accent-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {t.sessionNumber(n)}
                    </span>
                    <span className={`flex-1 text-sm ${active ? "font-medium text-accent-foreground" : ""}`}>
                      {s}
                      <span
                        className={`mt-0.5 block text-xs font-normal ${count > 0 ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {count > 0 ? t.sessionGames(count) : t.gamesInProgress}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </aside>

        <section>
          <p className="text-sm font-medium text-primary">{t.sessionNumber(lesson)}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{course.sessions[lesson - 1]}</h2>
          {lessonGames.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed px-5 py-10 text-center text-muted-foreground">{t.noGamesYet}</p>
          ) : null}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {lessonGames.map((game) => {
              const g = localizeGame(game, lang)
              return (
                // Every row below has a fixed height, so the same content lines up across all cards.
                <Card key={g.slug} className="gap-0 py-0">
                  <GameCover game={g} tone={course.tone} className="aspect-video w-full border-b" />
                  <CardHeader className="pt-5">
                    <CardTitle className="truncate text-xl" title={g.title}>
                      {g.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 min-h-[4.875em] text-sm leading-relaxed" title={g.summary}>
                      {g.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pt-4 pb-5">
                    <div className="flex h-[3.25rem] flex-wrap content-start gap-1.5 overflow-hidden">
                      {g.concepts.map((k) => (
                        <Badge key={k} variant="outline">
                          {k}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="size-4 shrink-0" /> {g.minutes}
                      </span>
                      <span className="flex items-center gap-2" title={g.format}>
                        <Presentation className="size-4 shrink-0" /> <span className="truncate">{g.format}</span>
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/40 py-4">
                    <Button asChild size="lg">
                      <a href={g.href}>
                        <Play /> {t.startGame}
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a href={g.href} download={`光语-${game.title}.html`}>
                        <Download /> {t.downloadOffline}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t.offlineNote}</p>
        </section>
      </div>
    </>
  )
}
