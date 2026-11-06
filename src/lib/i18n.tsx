import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Course, Game } from "@/data/catalog"

export type Lang = "zh" | "en"

const STORAGE_KEY = "guangyu-hub:lang"

const STRINGS = {
  zh: {
    siteName: "光语课堂游戏",
    allCourses: "全部课程",
    switchTo: "English",
    switchLabel: "切换到英文",
    footerOrg: "光语 · 泉心 UC Berkeley 公益项目组 × 铺路石",
    footerPrivacy: "不需要登录，不收集任何学生信息",
    kicker: "光语 × 铺路石 · AI 素养课堂",
    heroTitle: "让每一节 AI 课，都有一个可以动手玩的游戏",
    heroLead: "我们把课件里的重点概念做成了课堂小游戏。老师在教室电脑上打开、投屏给全班，学生通过一起操作、投票和讨论来理解 AI。",
    steps: [
      { title: "选一门课程", text: "找到你正在上的那门课，看看每节课配了哪些游戏。" },
      { title: "投屏开始游戏", text: "在教室电脑上打开游戏，全班一起看、一起选、一起讨论。" },
      { title: "保存课堂成果", text: "游戏结束后可以导出图片和表格，记录同学们的作品。" },
    ],
    courseCount: (n: number) => `共 ${n} 门`,
    gradesLabel: "适合",
    sessionsLabel: "课时",
    gamesLabel: "课堂游戏",
    sessionCount: (n: number) => `${n} 节课`,
    gameCount: (n: number) => `${n} 个`,
    viewGames: "查看这门课的游戏",
    moreCourses: "更多课程正在制作中。光语每周会把新的课件翻译好交给铺路石，配套游戏也会陆续上线。",
    courseMeta: (grades: string, sessions: number, games: number) =>
      `适合 ${grades} · ${sessions} 节课 · ${games} 个课堂游戏`,
    courseOutline: "课程结构",
    sessionNumber: (n: number) => `第 ${n} 节`,
    sessionGames: (n: number) => `${n} 个游戏`,
    gamesInProgress: "游戏制作中",
    noGamesYet: "这节课的游戏还在制作中。",
    startGame: "开始游戏",
    downloadOffline: "下载离线版",
    offlineNote: "教室网络不稳定时，可以提前“下载离线版”：双击文件就能在浏览器里打开，断网也能用，也可以通过微信发给其他老师。",
    notFoundTitle: "没有找到这个页面",
    notFoundText: "链接可能写错了，或者这门课程已经下线。",
    backToCourses: "返回全部课程",
  },
  en: {
    siteName: "Guangyu Classroom Games",
    allCourses: "All courses",
    switchTo: "中文",
    switchLabel: "Switch to Chinese",
    footerOrg: "Guangyu · a Quanxin (UC Berkeley) nonprofit project × Pulushi",
    footerPrivacy: "No login needed. No student data collected.",
    kicker: "Guangyu × Pulushi · AI literacy classroom",
    heroTitle: "A hands-on game for every AI lesson",
    heroLead: "We turn the key ideas from each lesson into classroom games. Teachers open them on the classroom computer and project them, and students learn about AI by playing, voting and discussing together.",
    steps: [
      { title: "Pick a course", text: "Find the course you're teaching and see which games go with each lesson." },
      { title: "Project the game", text: "Open the game on the classroom computer so the whole class can watch, choose and discuss." },
      { title: "Save the results", text: "Export an image and a spreadsheet after the game to record the class's work." },
    ],
    courseCount: (n: number) => `${n} ${n === 1 ? "course" : "courses"}`,
    gradesLabel: "For",
    sessionsLabel: "Length",
    gamesLabel: "Classroom games",
    sessionCount: (n: number) => `${n} ${n === 1 ? "lesson" : "lessons"}`,
    gameCount: (n: number) => `${n}`,
    viewGames: "See this course's games",
    moreCourses: "More courses are on the way. Guangyu translates new lesson materials for Pulushi every week, and matching games follow.",
    courseMeta: (grades: string, sessions: number, games: number) =>
      `For ${grades.toLowerCase()} · ${sessions} ${sessions === 1 ? "lesson" : "lessons"} · ${games} classroom ${games === 1 ? "game" : "games"}`,
    courseOutline: "Course outline",
    sessionNumber: (n: number) => `Lesson ${n}`,
    sessionGames: (n: number) => `${n} ${n === 1 ? "game" : "games"}`,
    gamesInProgress: "Games in progress",
    noGamesYet: "Games for this lesson are still in progress.",
    startGame: "Start game",
    downloadOffline: "Download offline",
    offlineNote: "If the classroom network is unreliable, download the offline version ahead of time: double-click the file to open it in a browser with no internet, or send it to other teachers over WeChat.",
    notFoundTitle: "Page not found",
    notFoundText: "The link may be wrong, or this course is no longer available.",
    backToCourses: "Back to all courses",
  },
}

type I18n = { lang: Lang; toggle: () => void; t: (typeof STRINGS)["zh"] }

const I18nContext = createContext<I18n | null>(null)

function savedLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh"
  } catch {
    return "zh"
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(savedLang)

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN"
    document.title = STRINGS[lang].siteName
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // Without storage the choice just lasts until the page reloads.
    }
  }, [lang])

  const toggle = () => setLang((l) => (l === "zh" ? "en" : "zh"))
  return <I18nContext.Provider value={{ lang, toggle, t: STRINGS[lang] }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error("useI18n must be used inside LanguageProvider")
  return value
}

/** A course's display text in the given language; anything untranslated stays in Chinese. */
export function localizeCourse(course: Course, lang: Lang) {
  if (lang === "zh") return { ...course, altTitle: course.titleEn }
  return { ...course, ...course.en, title: course.titleEn, altTitle: course.title }
}

/** A game's display text in the given language; anything untranslated stays in Chinese. */
export function localizeGame(game: Game, lang: Lang) {
  return lang === "en" ? { ...game, ...game.en } : game
}
