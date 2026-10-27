import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

const EASE = [0.2, 0.8, 0.2, 1] as const

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li'
}

/** Fades content up gently the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 18, as = 'div' }: RevealProps) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

/** A grid whose children fade in one after another. */
export function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.ul
      className={cn('grid', className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
    >
      {children}
    </motion.ul>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.li variants={item} className={className}>
      {children}
    </motion.li>
  )
}
