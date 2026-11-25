import { Link } from "react-router"
import { Robot } from "@/components/art"
import { useI18n } from "@/lib/i18n"

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-20 text-center">
      <svg viewBox="-90 -195 180 200" className="h-40" aria-hidden="true">
        <g className="anim-bob">
          <Robot screen="#1769b5" wave={false} />
        </g>
      </svg>
      <p className="display mt-6 text-6xl text-primary">404</p>
      <h1 className="display mt-2 text-3xl">{t.notFoundTitle}</h1>
      <p className="mt-2 text-lg text-ink/70">{t.notFoundText}</p>
      <Link
        to="/"
        className="mt-8 inline-flex h-12 items-center rounded-full border-[2.5px] border-ink bg-primary px-6 font-bold text-white shadow-[0_4px_0_0_var(--ink)] transition-transform hover:-translate-y-0.5"
      >
        {t.backToCourses}
      </Link>
    </div>
  )
}
