// Courses come from courses.json; games are discovered from games/<slug>/game.json,
// so adding a game never requires editing a shared file.
import coursesJson from "./courses.json"

export type Course = {
  id: string
  title: string
  titleEn: string
  source: string
  grades: string
  summary: string
  /** 每节课的标题；游戏的 session 字段是这里的序号（从 1 开始） */
  sessions: string[]
  tone: "teal" | "amber" | "blue" | "coral"
}

/** games/<slug>/game.json 的内容 */
export type GameMeta = {
  title: string
  course: string
  session: number
  summary: string
  minutes: string
  format: string
  concepts: string[]
  authors?: string[]
  /** games/<slug>/ 里的封面图片文件名（可选） */
  cover?: string
}

export type Game = GameMeta & { slug: string; href: string; coverUrl?: string }

const metas = import.meta.glob<GameMeta>("../../games/*/game.json", { eager: true, import: "default" })

export const COURSES = coursesJson as Course[]

export const GAMES: Game[] = Object.entries(metas)
  .map(([file, meta]) => {
    const slug = file.split("/").at(-2)!
    return {
      ...meta,
      slug,
      href: `/games/${slug}/index.html`,
      coverUrl: meta.cover ? `/games/${slug}/${meta.cover}` : undefined,
    }
  })
  .filter((g) => !g.slug.startsWith("_"))

export const getCourse = (id: string | undefined) => COURSES.find((c) => c.id === id)

export const gamesFor = (courseId: string) =>
  GAMES.filter((g) => g.course === courseId).sort(
    (a, b) => a.session - b.session || a.title.localeCompare(b.title, "zh"),
  )
