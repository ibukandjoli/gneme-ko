'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserName() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // For now we don't have a profile table yet with names, so we return the email or a fallback.
    // In a real app we would select from 'profiles' table.
    // If the user metadata contains name (e.g. from Google Auth), use it.

    if (!user) return null

    // Fallback: extracting name from email, e.g. "john.doe@..." -> "John"
    const emailName = user.email ? user.email.split('@')[0].replace(/[0-9]/g, '') : "Challenger"
    // Title case
    return emailName.charAt(0).toUpperCase() + emailName.slice(1)
}
