'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createGoal } from "../actions"
import { useState, useTransition } from "react"
import { ArrowLeft, Rocket } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function NewGoalPage() {
    const [isPending, startTransition] = useTransition()
    const [stake, setStake] = useState<number>(5000)
    const fee = Math.ceil(stake * 0.10)
    const total = stake + fee

    const [category, setCategory] = useState<string>('sport')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (formData: FormData) => {
        setError(null)
        startTransition(async () => {
            // If category is other, use the custom input
            if (formData.get('category') === 'other') {
                const custom = formData.get('custom_category') as string
                if (custom) {
                    formData.set('category', custom)
                }
            }
            const result = await createGoal(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                // Simulation Mode: Redirect directly to dashboard
                // window.location.href = result.paymentUrl
                window.location.href = '/dashboard'
            }
        })
    }

    return (
        <div className="flex min-h-screen flex-col bg-background p-4 pb-20">
            <header className="flex items-center gap-4 mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <h1 className="font-bold text-xl">Nouveau Défi</h1>
            </header>

            <form action={handleSubmit} className="flex-1 flex flex-col max-w-md mx-auto w-full gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ton Objectif</CardTitle>
                        <CardDescription>Que veux-tu accomplir dans les prochains jours ?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mon défi est de...</label>
                            <Suspense fallback={<Input name="title" placeholder="Ex: Courir 30min, Lire 10 pages..." required />}>
                                <TitleInput />
                            </Suspense>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pendant... (Jours)</label>
                            <Input name="duration" type="number" min="1" max="30" defaultValue="7" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Catégorie</label>
                            <select
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            >
                                <option value="sport">Sport / Fitness</option>
                                <option value="business">Business / Pro</option>
                                <option value="learning">Apprentissage / Lecture</option>
                                <option value="early_wake">Réveil matinal</option>
                                <option value="detox">Détox / Santé</option>
                                <option value="other">Autre (Préciser)</option>
                            </select>
                        </div>

                        {category === 'other' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium">Quelle est cette catégorie ?</label>
                                <Input name="custom_category" placeholder="Ex: Méditation, Écriture..." required />
                            </div>
                        )}


                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            Mise en jeu
                            <span className="text-2xl">💸</span>
                        </CardTitle>
                        <CardDescription>Combien es-tu prêt à perdre si tu échoues ?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Je suis prêt à perdre... (FCFA)</label>
                            <Input
                                name="stakeAmount"
                                type="number"
                                min="1000"
                                step="500"
                                value={stake}
                                onChange={(e) => setStake(Number(e.target.value))}
                                className="text-lg font-bold"
                            />
                        </div>

                        <div className="space-y-2 text-sm pt-2 border-t border-dashed border-primary/20">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Ta Caution (Remboursable)</span>
                                <span>{stake.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Frais de service (10%)</span>
                                <span>{fee.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-1">
                                <span>Total à payer</span>
                                <span className="text-primary">{total.toLocaleString()} FCFA</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 mb-4">
                        Erreur: {error}
                    </div>
                )}
                <Button type="submit" size="lg" className="w-full font-bold h-14 text-lg shadow-xl shadow-primary/20 mt-auto mb-6 bg-[#1da1f2] hover:bg-[#1da1f2]/90 text-white" disabled={isPending}>
                    {isPending ? 'Création...' : `Valider le défi (${total.toLocaleString()} F)`}
                </Button>
            </form>
        </div>
    )
}

function TitleInput() {
    const searchParams = useSearchParams()
    const initialTitle = searchParams.get('title') || ''

    return <Input name="title" defaultValue={initialTitle} placeholder="Ex: Courir 30min, Lire 10 pages..." required />
}
