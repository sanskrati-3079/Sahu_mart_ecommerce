import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthLayout } from '@/components/account/AuthLayout'
import { usePageTitle } from '@/components/PageMeta'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { editorial } from '@/data/images'
import { safeRedirect } from '@/lib/redirect'
import { emailSchema } from '@/lib/validation'
import { useAuth } from '@/store/auth'

const schema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Please enter your password.').min(8, 'Passwords are at least 8 characters.'),
})
type Values = z.infer<typeof schema>

export default function Login() {
  usePageTitle('Sign in')
  const signIn = useAuth((s) => s.signIn)
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const redirect = safeRedirect(sp.get('redirect'))
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched' })

  const onSubmit = (v: Values) => {
    // The password is validated above and then discarded — it is never stored.
    const result = signIn(v.email)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`)
    navigate(redirect, { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your orders, addresses and wishlist."
      image={editorial.authSignIn}
      imageAlt="A woman in a pink Banarasi saree standing under a floral arch"
      quote="Everything You Love. All in One Place."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {formError && (
          <div role="alert" className="rounded-md border border-sale/30 bg-sale/5 px-4 py-3 text-[14px] text-sale">
            {formError}{' '}
            <Link to={`/signup${sp.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-medium underline">
              Create an account
            </Link>
          </div>
        )}
        <div>
          <Label htmlFor="login-email">Email address</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email', { onChange: () => setFormError('') })}
          />
          <FieldError id="login-email-error" message={errors.email?.message} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link to="/forgot-password" className="mb-1.5 text-[13px] text-forest underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            {...register('password')}
          />
          <FieldError id="login-password-error" message={errors.password?.message} />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sign in
        </Button>
      </form>
      <p className="mt-8 text-center text-[14px] text-muted">
        New to Sahu Marts?{' '}
        <Link
          to={`/signup${sp.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="font-medium text-forest underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
