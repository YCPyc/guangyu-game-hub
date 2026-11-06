import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n"

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-6xl px-5 py-24">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t.notFoundTitle}</h1>
      <p className="mt-3 text-muted-foreground">{t.notFoundText}</p>
      <Button asChild className="mt-6" size="lg">
        <Link to="/">{t.backToCourses}</Link>
      </Button>
    </div>
  )
}
