import { Languages } from "lucide-react"
import { Link, Outlet } from "react-router"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="site-logo size-10 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path d="M9 21.5c2.5-6 11.5-6 14 0" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="11.5" r="3" fill="#f2b84b" />
      <path d="m25 5 1.4 3.2L30 9l-3 2 .2 3.4-2.2-2-3.1 1 .9-3.2-2.3-2.4 3.4-.1Z" fill="white" />
    </svg>
  )
}

export function SiteLayout() {
  const { t, toggle } = useI18n()
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="site-header sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <Logo />
            <span className="truncate text-base font-semibold tracking-tight sm:text-lg">{t.siteName}</span>
          </Link>
          <nav className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hidden rounded-md px-3 py-2 hover:bg-muted hover:text-foreground sm:block">
              {t.allCourses}
            </Link>
            <Button variant="outline" size="lg" onClick={toggle} aria-label={t.switchLabel}>
              <Languages /> {t.switchTo}
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>{t.footerOrg}</p>
          <p>{t.footerPrivacy}</p>
        </div>
      </footer>
    </div>
  )
}
