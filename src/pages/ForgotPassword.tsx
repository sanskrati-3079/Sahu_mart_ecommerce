import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { z } from 'zod'
import { AuthLayout } from '@/components/account/AuthLayout'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { editorial } from '@/data/images'
import { emailSchema } from '@/lib/validation'

const schema = z.object({ email: emailSchema })
type Values = z.infer<typeof schema>

export default function ForgotPassword() {
  usePageTitle('Forgot password')
  const [sentTo, setSentTo] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched' })

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we’ll help you get back in."
      image={editorial.authForgot}
      imageAlt="Handmade ceramic vases in soft neutral tones"
      quote="Small things, done well."
    >
      {sentTo ? (
        <div role="status" className="rounded-lg bg-sage p-6">
          <MailCheck className="h-8 w-8 text-forest" aria-hidden />
          <p className="mt-4 font-medium">Check your inbox</p>
          <p className="mt-2 text-[14px] leading-relaxed text-charcoal/80">
            If an account exists for <strong>{sentTo}</strong>, a reset link would be sent to it. This is a demo, so no email is actually
            sent — and since passwords are never stored here, you can simply sign in again with your email.
          </p>
          <Button asChild className="mt-6">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit((v) => setSentTo(v.email.trim()))} noValidate className="space-y-5">
          <div>
            <Label htmlFor="fp-email">Email address</Label>
            <Input
              id="fp-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'fp-email-error' : undefined}
              {...register('email')}
            />
            <FieldError id="fp-email-error" message={errors.email?.message} />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Send reset link
          </Button>
          <p className="text-center text-[14px] text-muted">
            Remembered it?{' '}
            <Link to="/login" className="font-medium text-forest underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
