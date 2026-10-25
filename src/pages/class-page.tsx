import { Clock, Download, Play, Presentation } from "lucide-react"
import { Link, useParams } from "react-router"
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
import { NotFoundPage } from "@/pages/not-found"

export function ClassPage() {
  const course = getCourse(useParams().id)
  if (!course) return <NotFoundPage />
  const games = gamesFor(course.id)

  return (
    <>
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">全部课程</Link>
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
                <span className="text-sm text-muted-foreground">{course.titleEn}</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{course.summary}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                适合 {course.grades} · {course.sessions.length} 节课 · {games.length} 个课堂游戏
              </p>
            </div>
            <CourseCover tone={course.tone} className="hidden w-full rounded-2xl border md:block" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <h2 className="text-sm font-semibold text-muted-foreground">课程结构</h2>
          <ol className="mt-4 flex flex-col">
            {course.sessions.map((s, i) => {
              const count = games.filter((g) => g.session === i + 1).length
              return (
                <li key={s} className="flex gap-3 border-l-2 py-2.5 pl-4 data-[has=true]:border-primary" data-has={count > 0}>
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">第 {i + 1} 节</span>
                  <span className="flex-1 text-sm">
                    {s}
                    <span className={count > 0 ? "mt-0.5 block text-xs text-primary" : "mt-0.5 block text-xs text-muted-foreground"}>
                      {count > 0 ? `${count} 个游戏` : "游戏制作中"}
                    </span>
                  </span>
                </li>
              )
            })}
          </ol>
        </aside>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">课堂游戏</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {games.map((g) => {
              const href = g.href
              return (
                <Card key={g.slug} className="gap-0 py-0">
                  <GameCover game={g} tone={course.tone} className="aspect-video w-full border-b" />
                  <CardHeader className="pt-5">
                    <p className="text-xs font-medium text-primary">
                      第 {g.session} 节 · {course.sessions[g.session - 1]}
                    </p>
                    <CardTitle className="text-xl">{g.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{g.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 pb-5">
                    <div className="flex flex-wrap gap-1.5">
                      {g.concepts.map((k) => (
                        <Badge key={k} variant="outline">
                          {k}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Clock className="size-4" /> {g.minutes}
                      </span>
                      <span className="flex items-center gap-2">
                        <Presentation className="size-4" /> {g.format}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/40 py-4">
                    <Button asChild size="lg">
                      <a href={href}>
                        <Play /> 开始游戏
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a href={href} download={`光语-${g.title}.html`}>
                        <Download /> 下载离线版
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            教室网络不稳定时，可以提前“下载离线版”：双击文件就能在浏览器里打开，断网也能用，也可以通过微信发给其他老师。
          </p>
        </section>
      </div>
    </>
  )
}
