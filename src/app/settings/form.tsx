'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updateProfile } from "./actions"
import { useState, useTransition } from "react"
import type { User } from "@supabase/supabase-js"

interface ProfileFormProps {
    profile: any // avoiding strict type for now given schema flux
    user: User
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (formData: FormData) => {
        setMessage(null)
        setError(null)
        startTransition(async () => {
            const result = await updateProfile(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setMessage(result.success)
            }
        })
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>
                        Ces informations nous permettent de personnaliser ton expérience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prénom</label>
                            <Input
                                name="first_name"
                                placeholder="Moussa"
                                defaultValue={profile?.first_name || ''}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom</label>
                            <Input
                                name="last_name"
                                placeholder="Diop"
                                defaultValue={profile?.last_name || ''}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Âge</label>
                        <Input
                            name="age"
                            type="number"
                            placeholder="25"
                            defaultValue={profile?.age || ''}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ville</label>
                            <Input
                                name="city"
                                placeholder="Dakar"
                                defaultValue={profile?.city || ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pays</label>
                            <Input
                                name="country"
                                placeholder="Sénégal"
                                defaultValue={profile?.country || 'Sénégal'}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-md border border-red-500/20">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-3 bg-green-500/10 text-green-500 text-sm rounded-md border border-green-500/20">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full font-bold" disabled={isPending}>
                        {isPending ? 'Enregistrement...' : 'Sauvegarder'}
                    </Button>
                </CardContent>
            </Card>
        </form>
    )
}
