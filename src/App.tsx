import { useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router"
import { SiteLayout } from "@/components/site-layout"
import { ClassPage } from "@/pages/class-page"
import { HomePage } from "@/pages/home"
import { NotFoundPage } from "@/pages/not-found"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="classes/:id" element={<ClassPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
