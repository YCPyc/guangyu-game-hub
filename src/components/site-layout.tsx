import { Link, Outlet } from "react-router"

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path d="M9 21.5c2.5-6 11.5-6 14 0" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="11.5" r="3" fill="#f2b84b" />
    </svg>
  )
}

export function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">光语课堂游戏</span>
          </Link>
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="rounded-md px-3 py-2 hover:bg-muted hover:text-foreground">
              全部课程
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>光语 · 泉心 UC Berkeley 公益项目组 × 铺路石</p>
          <p>不需要登录，不收集任何学生信息</p>
        </div>
      </footer>
    </div>
  )
}
