import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-24">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">没有找到这个页面</h1>
      <p className="mt-3 text-muted-foreground">链接可能写错了，或者这门课程已经下线。</p>
      <Button asChild className="mt-6" size="lg">
        <Link to="/">返回全部课程</Link>
      </Button>
    </div>
  )
}
