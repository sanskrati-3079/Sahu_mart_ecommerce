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
import { emailSchema, nameSchema, passwordSchema, phoneSchema } from '@/lib/validation'
import { useAuth } from '@/store/auth'

const schema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: z.union([z.literal(''), phoneSchema]),
    password: passwordSchema,
    confirm: z.string().min(1, 'Please confirm your password.'),
    terms: z.boolean().refine((v) => v, 'Please accept the terms to continue.'),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match.' })
type Values = z.infer<typeof schema>

export default function Signup() {
  usePageTitle('Create account')
  const signUp = useAuth((s) => s.signUp)
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const redirect = safeRedirect(sp.get('redirect'))
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues: { phone: '', terms: false } })

  const onSubmit = (v: Values) => {
    // Only name, email and phone are saved. The password is never stored.
    const result = signUp({ name: v.name, email: v.email, phone: v.phone || undefined })
    if (!result.ok) {
      setError('email', { message: result.error })
      return
    }
    toast.success(`Welcome to Sahu Marts, ${v.name.split(' ')[0]}!`)
    navigate(redirect, { replace: true })
  }

  const a = (name: keyof Values) => ({
    id: `su-${name}`,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `su-${name}-error` : undefined,
  })

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save addresses, track orders and keep a wishlist across visits."
      image={editorial.authSignUp}
      imageAlt="A man in a royal blue kurta pyjama smiling"
      quote="Your World. Your Style. Your Sahu Marts."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <Label htmlFor="su-name">Full name</Label>
          <Input autoComplete="name" {...a('name')} {...register('name')} />
          <FieldError id="su-name-error" message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="su-email">Email address</Label>
          <Input type="email" autoComplete="email" {...a('email')} {...register('email')} />
          <FieldError id="su-email-error" message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="su-phone">
            Mobile number <span className="font-normal text-muted">(optional)</span>
          </Label>
          <Input
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            placeholder="10-digit mobile number"
            {...a('phone')}
            {...register('phone')}
          />
          <FieldError id="su-phone-error" message={errors.phone?.message} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="su-password">Password</Label>
            <PasswordInput autoComplete="new-password" {...a('password')} {...register('password')} />
            <FieldError id="su-password-error" message={errors.password?.message} />
          </div>
          <div>
            <Label htmlFor="su-confirm">Confirm password</Label>
            <PasswordInput autoComplete="new-password" {...a('confirm')} {...register('confirm')} />
            <FieldError id="su-confirm-error" message={errors.confirm?.message} />
          </div>
        </div>
        <p className="-mt-2 text-[12px] text-muted">At least 8 characters, with a letter and a number.</p>
        <div>
          <label className="flex items-start gap-2.5 text-[14px]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-forest"
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={errors.terms ? 'su-terms-error' : undefined}
              {...register('terms')}
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-forest underline">
                Terms of use
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="text-forest underline">
                Privacy policy
              </Link>
              .
            </span>
          </label>
          <FieldError id="su-terms-error" message={errors.terms?.message} />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-8 text-center text-[14px] text-muted">
        Already have an account?{' '}
        <Link
          to={`/login${sp.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
          className="font-medium text-forest underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
