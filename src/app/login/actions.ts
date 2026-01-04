'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function loginWithMagicLink(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    // Basic validation
    if (!email) {
        return { error: 'Email is required' }
    }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // Should be your deployed URL provided by Vercel later, or localhost for now
            // We rely on the origin header generally if not specified, 
            // but for magic links usually best to be explicit if issues arise.
            // For now let Supabase handle the base URL or set it in dashboard.
            // But we can set the redirect to our callback route
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        console.error('Login error:', error)
        return { error: 'Could not authenticate user' }
    }

    revalidatePath('/', 'layout')
    return { success: 'Check your email for the magic link!' }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
