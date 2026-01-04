'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { loginWithMagicLink } from "./actions"
import { useState, useTransition } from "react"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      const result = await loginWithMagicLink(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setMessage(result.success)
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-muted/20">
      <Card className="w-full max-w-sm shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <span className="text-xl">🔥</span>
          </div>
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Rejoins la communauté Gneme Ko.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message ? (
            <div className="p-4 bg-green-50 text-green-700 text-center rounded-md text-sm">
              {message}
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="mouhamadou@gnemeko.sn" required />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full font-bold" disabled={isPending}>
                {isPending ? 'Envoi...' : 'Envoyer le lien magique'}
              </Button>
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
