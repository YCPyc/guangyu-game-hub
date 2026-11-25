import { Languages } from "lucide-react"
import { usePostHog } from "@posthog/react"
import { Link, Outlet } from "react-router"
import { Robot, SkyLayer, Wave } from "@/components/art"
import { useI18n } from "@/lib/i18n"

function Logo() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 shrink-0 transition-transform group-hover:-rotate-6" aria-hidden="true">
      <rect x="2" y="2" width="36" height="36" rx="12" fill="#1769b5" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M11 26c3-7 15-7 18 0" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="14" r="4" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2" />
    </svg>
  )
}

export function SiteLayout() {
  const { lang, t, toggle } = useI18n()
  const posthog = usePostHog()

  const handleLanguageChange = () => {
    const nextLanguage = lang === "zh" ? "en" : "zh"
    posthog.capture("language_changed", { language: nextLanguage })
    toggle()
  }

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <SkyLayer />
      <header className="sticky top-0 z-20 bg-cream/85 backdrop-blur-sm">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            <Logo />
            <span className="display truncate text-lg sm:text-xl">{t.siteName}</span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2">
            <Link to="/" className="hidden rounded-full px-4 py-2 font-medium hover:bg-mint sm:block">
              {t.allCourses}
            </Link>
            <button
              type="button"
              onClick={handleLanguageChange}
              aria-label={t.switchLabel}
              className="flex h-11 items-center gap-2 rounded-full border-[2.5px] border-ink bg-white px-4 font-semibold shadow-[0_4px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            >
              <Languages className="size-5" /> {t.switchTo}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="relative -mt-8 sm:-mt-12">
        <Wave fill="var(--primary)" />
        <div className="bg-primary">
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 pt-6 pb-8">
            <div className="flex flex-col gap-1 text-sm font-medium text-white/90">
              <p>{t.footerOrg}</p>
              <p>{t.footerPrivacy}</p>
            </div>
            <svg viewBox="-80 -190 160 200" className="hidden h-24 shrink-0 sm:block" aria-hidden="true">
              <g className="anim-bob">
                <Robot />
              </g>
            </svg>
          </div>
        </div>
      </footer>
    </div>
  )
}
