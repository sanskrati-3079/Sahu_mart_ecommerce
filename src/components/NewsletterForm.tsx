import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface NewsletterFormProps {
  tone?: 'light' | 'dark'
  className?: string
}

/** Demo newsletter sign-up: validates the email and shows a confirmation. Nothing is sent anywhere. */
export function NewsletterForm({ tone = 'light', className }: NewsletterFormProps) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const dark = tone === 'dark'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(EMAIL.test(email.trim()) ? 'success' : 'error')
  }

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.p
            key="ok"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('flex items-start gap-2 text-sm', dark ? 'text-ivory' : 'text-forest')}
            role="status"
          >
            <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <span>
              Thank you! <strong>{email.trim()}</strong> is on the list. (Demo — no email will actually be sent.)
            </span>
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={false} exit={{ opacity: 0 }}>
            <label htmlFor={id} className={cn('sr-only')}>
              Email address
            </label>
            <div className="flex gap-2">
              <input
                id={id}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                aria-invalid={status === 'error'}
                aria-describedby={`${id}-msg`}
                className={cn(
                  'h-11 min-w-0 flex-1 rounded-md border px-3.5 text-[14px] focus:outline-none',
                  dark
                    ? 'border-ivory/30 bg-forest-dark text-ivory placeholder:text-ivory/60 focus:border-gold'
                    : 'border-line bg-white text-charcoal placeholder:text-muted focus:border-forest',
                  status === 'error' && (dark ? 'border-[#f0a597]' : 'border-sale'),
                )}
              />
              <button
                type="submit"
                className={cn(
                  'h-11 shrink-0 rounded-md px-5 text-sm font-medium transition-colors',
                  dark ? 'bg-ivory text-forest hover:bg-white' : 'bg-forest text-ivory hover:bg-forest-dark',
                )}
              >
                Subscribe
              </button>
            </div>
            <p
              id={`${id}-msg`}
              className={cn('mt-2 text-[12px]', dark ? 'text-ivory/70' : 'text-muted')}
              role={status === 'error' ? 'alert' : undefined}
            >
              {status === 'error' ? (
                <span className={dark ? 'text-[#f6c1b7]' : 'text-sale'}>Please enter a valid email address, like name@example.com.</span>
              ) : (
                'Demo sign-up — your email stays in this browser and nothing is sent.'
              )}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
