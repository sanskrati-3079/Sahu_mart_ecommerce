import { useEffect } from 'react'

/** Sets the document title for a page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Sahu Marts` : 'Sahu Marts — Everything You Love. All in One Place.'
  }, [title])
}
