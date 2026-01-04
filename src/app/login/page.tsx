'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { sendOtp, verifyOtp } from "./actions"
import { useSearchParams } from "next/navigation"
import { useState, useTransition, useEffect, Suspense } from "react"

function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Handle URL errors (e.g. from middleware)
  const searchParams = useSearchParams()
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) setError(decodeURIComponent(errorParam))
  }, [searchParams])

  // Step 1: Send OTP
  async function handleSendOtp(formData: FormData) {
    setError(null)
    const emailInput = formData.get('email') as string
    setEmail(emailInput)

    startTransition(async () => {
      const result = await sendOtp(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setStep('otp')
      }
    })
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(formData: FormData) {
    setError(null)
    const code = formData.get('code') as string

    startTransition(async () => {
      const result = await verifyOtp(email, code)
      if (result?.error) {
        setError(result.error)
      }
      // If success, verifyOtp redirects automatically
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-muted/20">
      <Card className="w-full max-w-sm shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-xl">🔥</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'email' ? 'Connexion' : 'Vérifiez votre email'}
          </CardTitle>
          <CardDescription>
            {step === 'email'
              ? 'Rejoins la communauté Gnémé Ko.'
              : `Un code à 8 chiffres a été envoyé à ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'email' ? (
            <form action={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="jaambaar@gmail.com" required />
              </div>
              {error && <p className="text-red-500 text-sm p-3 bg-red-500/10 rounded border border-red-500/20">{error}</p>}
              <Button type="submit" className="w-full font-bold" disabled={isPending}>
                {isPending ? 'Envoi...' : 'Continuer avec Email'}
              </Button>
            </form>
          ) : (
            <form action={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Code de vérification</label>
                <Input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="12345678"
                  className="text-center text-xl tracking-widest font-mono"
                  maxLength={8}
                  autoFocus
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm p-3 bg-red-500/10 rounded border border-red-500/20">{error}</p>}
              <Button type="submit" className="w-full font-bold" disabled={isPending}>
                {isPending ? 'Vérification...' : 'Valider'}
              </Button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-xs text-muted-foreground w-full text-center hover:underline"
              >
                Modifier l'email ou renvoyer le code
              </button>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center border-t p-4 mt-2">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Retour à l'accueil
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  )
}
