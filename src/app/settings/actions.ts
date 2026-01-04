'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Non connecté' }
    }

    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const age = formData.get('age') ? parseInt(formData.get('age') as string) : null
    const city = formData.get('city') as string
    const country = formData.get('country') as string

    // Validate minimal info if needed
    if (!first_name) {
        return { error: 'Le prénom est obligatoire' }
    }

    const updates = {
        id: user.id,
        first_name,
        last_name,
        age,
        city,
        country,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('profiles')
        .upsert(updates)

    if (error) {
        console.error('Profile update error:', error)
        return { error: 'Erreur lors de la mise à jour du profil' }
    }

    revalidatePath('/settings')
    revalidatePath('/dashboard')

    return { success: 'Profil mis à jour avec succès !' }
}
