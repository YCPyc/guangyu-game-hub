import posthog from "posthog-js"
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
    footerPrivacy: "不需要登录，不收集学生信息，只匿名统计游戏的使用情况",
    kicker: "光语 × 铺路石 · AI 素养课堂",
    heroLines: ["一起玩游戏，", "一起弄懂 AI"],
    heroLead: "投屏到大屏幕，全班一起看、一起举手、一起讨论。",
    hello: "你好！",
    heroCta: "选一门课",
    steps: [
      { title: "选课程", text: "找到正在上的课" },
      { title: "投屏玩", text: "全班一起举手" },
      { title: "存成果", text: "导出图片和表格" },
    ],
    coursesHeading: "选一门课",
    coursesLabel: "Courses",
    gamesLabel: "个游戏",
    lessonsLabel: "节课",
    viewGames: "去看看",
    moreCourses: "更多课程制作中，敬请期待！",
    courseMapTitle: "课程地图",
    courseMapLabel: "Course map",
    courseMapHint: "点一节课，看看它的游戏",
    sessionNumber: (n: number) => `第 ${n} 节`,
    sessionGames: (n: number) => `${n} 个游戏`,
    gamesInProgress: "制作中",
    noGamesYet: "这节课的游戏还在制作中，敬请期待！",
    startGame: "开始游戏",
    notFoundTitle: "哎呀，迷路了！",
    notFoundText: "没有找到这个页面。",
    backToCourses: "回到全部课程",
  },
  en: {
    siteName: "Guangyu Classroom Games",
    allCourses: "All courses",
    switchTo: "中文",
    switchLabel: "Switch to Chinese",
    footerOrg: "Guangyu · a Quanxin (UC Berkeley) nonprofit project × Pulushi",
    footerPrivacy: "No login needed. No student data, only anonymous usage stats.",
    kicker: "Guangyu × Pulushi · AI literacy classroom",
    heroLines: ["Play games,", "understand AI!"],
    heroLead: "Put a game on the big screen. The whole class watches, votes and talks it over.",
    hello: "Hi!",
    heroCta: "Pick a course",
    steps: [
      { title: "Pick", text: "Find your lesson" },
      { title: "Play", text: "Whole class votes" },
      { title: "Save", text: "Image + spreadsheet" },
    ],
    coursesHeading: "Pick a course",
    coursesLabel: "课程",
    gamesLabel: "games",
    lessonsLabel: "lessons",
    viewGames: "Let's go",
    moreCourses: "More courses coming soon!",
    courseMapTitle: "Course map",
    courseMapLabel: "课程地图",
    courseMapHint: "Tap a lesson to see its games",
    sessionNumber: (n: number) => `Lesson ${n}`,
    sessionGames: (n: number) => `${n} ${n === 1 ? "game" : "games"}`,
    gamesInProgress: "Coming soon",
    noGamesYet: "Games for this lesson are on the way!",
    startGame: "Start game",
    notFoundTitle: "Oops, we got lost!",
    notFoundText: "We couldn't find this page.",
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
    // Every analytics event carries the current language.
    if (posthog.__loaded) posthog.register({ language: lang })
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
