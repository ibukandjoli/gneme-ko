'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function sendOtp(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email obligatoire' }
    }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            // No redirect needed for OTP, user stays on page
        },
    })

    if (error) {
        console.error('Login error:', error)
        return { error: error.message || 'Erreur lors de l\'envoi du code. Réessayez.' }
    }

    return { success: true }
}

export async function verifyOtp(email: string, token: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    })

    if (error) {
        console.error('Verify error:', error)
        return { error: 'Code invalide ou expiré' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
