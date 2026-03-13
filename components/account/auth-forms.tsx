'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, UserCircle2 } from 'lucide-react'

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type SignInForm = z.infer<typeof signInSchema>
type RegisterForm = z.infer<typeof registerSchema>

interface AuthFormsProps {
  callbackUrl?: string
}

export function AuthForms({ callbackUrl }: AuthFormsProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [signInError, setSignInError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const redirect = callbackUrl ?? '/'

  const onSignIn = async (data: SignInForm) => {
    setSignInError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setSignInError('Invalid email or password')
    } else {
      router.push(redirect)
      router.refresh()
    }
  }

  const onRegister = async (data: RegisterForm) => {
    setRegisterError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      }),
    })

    if (res.ok) {
      setRegisterSuccess(true)
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      router.push(redirect)
      router.refresh()
    } else {
      const body = await res.json()
      setRegisterError(body.error ?? 'Registration failed')
    }
  }

  if (registerSuccess) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <UserCircle2 className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Account created!</h1>
        <p className="mt-2 text-muted-foreground">Signing you in…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="mb-8 text-center">
        <UserCircle2 className="mx-auto mb-3 h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Welcome to TechStore</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in or create an account to get started
        </p>
      </div>

      <Tabs defaultValue="signin">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="signin" className="flex-1">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="register" className="flex-1">
            Create Account
          </TabsTrigger>
        </TabsList>

        {/* Sign In */}
        <TabsContent value="signin">
          <form className="space-y-4" onSubmit={signInForm.handleSubmit(onSignIn)}>
            <div className="space-y-1.5">
              <Label htmlFor="signin-email">Email Address</Label>
              <Input
                id="signin-email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                {...signInForm.register('email')}
              />
              {signInForm.formState.errors.email && (
                <p className="text-xs text-red-500">{signInForm.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...signInForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {signInForm.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {signInError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{signInError}</p>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <Separator className="my-5" />
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </TabsContent>

        {/* Register */}
        <TabsContent value="register">
          <form className="space-y-4" onSubmit={registerForm.handleSubmit(onRegister)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="reg-firstName">First Name</Label>
                <Input
                  id="reg-firstName"
                  placeholder="John"
                  {...registerForm.register('firstName')}
                />
                {registerForm.formState.errors.firstName && (
                  <p className="text-xs text-red-500">
                    {registerForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-lastName">Last Name</Label>
                <Input
                  id="reg-lastName"
                  placeholder="Doe"
                  {...registerForm.register('lastName')}
                />
                {registerForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500">
                    {registerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email Address</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                {...registerForm.register('email')}
              />
              {registerForm.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="pr-10"
                  {...registerForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  className="pr-10"
                  {...registerForm.register('confirm')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {registerForm.formState.errors.confirm && (
                <p className="text-xs text-red-500">
                  {registerForm.formState.errors.confirm.message}
                </p>
              )}
            </div>

            {registerError && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{registerError}</p>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-semibold"
              disabled={registerForm.formState.isSubmitting}
            >
              {registerForm.formState.isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
