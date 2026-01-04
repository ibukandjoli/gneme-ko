'use server'

import { createClient } from '@/lib/supabase/server'
import { validateProofWithGemini } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'

export async function uploadProof(formData: FormData) {
    try {
        const supabase = await createClient()

        const goalId = formData.get('goalId') as string
        const imageFile = formData.get('proofImage') as File

        if (!goalId || !imageFile) {
            return { error: 'Image manquante' }
        }

        // 1. Fetch Goal Info for Context
        const { data: goal } = await supabase.from('goals').select('*').eq('id', goalId).single()
        if (!goal) return { error: 'Défi introuvable' }

        // 2. Validate with Gemini
        let validation;
        try {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            validation = await validateProofWithGemini(
                buffer,
                imageFile.type,
                goal.title,
                goal.category
            )
        } catch (geminiError: any) {
            console.error('Gemini API Error:', geminiError)
            return { error: 'Erreur Analyse IA: ' + (geminiError.message || 'Service indisponible') }
        }

        // 3. Log the result
        const { error: logError } = await supabase.from('daily_logs').insert({
            goal_id: goalId,
            user_id: goal.user_id,
            proof_text: validation.isValid ? 'Preuve validée par IA' : 'Preuve rejetée par IA',
            ai_validation_status: validation.isValid ? 'valid' : 'rejected',
            ai_feedback: validation.feedback,
        })

        if (logError) {
            console.error('Log error:', logError)
            return { error: 'Erreur de sauvegarde Database: ' + logError.message }
        }

        // 4. Update Streak if valid
        if (validation.isValid) {
            const { error: streakError } = await supabase.from('goals').update({
                current_streak: (goal.current_streak || 0) + 1
            }).eq('id', goalId)

            if (streakError) console.error('Streak update error', streakError)
        }

        revalidatePath(`/goals/${goalId}`)
        return {
            success: validation.isValid,
            feedback: validation.feedback
        }
    } catch (e: any) {
        console.error('Unhandled Server Action Error:', e)
        return { error: 'Erreur interne: ' + e.message }
    }
}
