import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const MESSAGES = ['Discover your new-season favourites', 'Free shipping on orders above ₹999', 'Special prices across selected collections']

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4500)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <div
      className="on-dark bg-forest text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Store announcements"
    >
      <div className="container-page relative flex h-9 items-center justify-center overflow-hidden text-center text-[12px] tracking-[0.06em]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
