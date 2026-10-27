import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to the top on page changes (but not when only the query string changes on the same listing). */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
