'use server'

import { createClient } from '@/lib/supabase/server'
import { validateProofWithGemini } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'

export async function uploadProof(formData: FormData) {
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
    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const validation = await validateProofWithGemini(
        buffer,
        imageFile.type,
        goal.title,
        goal.category
    )

    // 3. Log the result
    // Note: normally we would upload the image to storage here and stick the URL in proof_image_url
    // For MVP speed/demo, we might skip the storage or handle it later if the user sets up buckets. 
    // Let's assume we don't save the image file to disk/storage yet to avoid bucket errors, 
    // but we record the log.

    const { error: logError } = await supabase.from('daily_logs').insert({
        goal_id: goalId,
        user_id: goal.user_id,
        proof_text: validation.isValid ? 'Preuve validée par IA' : 'Preuve rejetée par IA',
        ai_validation_status: validation.isValid ? 'valid' : 'rejected',
        ai_feedback: validation.feedback,
        // proof_image_url: ... (skipped for now, would need bucket setup)
    })

    if (logError) return { error: 'Erreur de sauvegarde Database' }

    // 4. Update Streak if valid
    if (validation.isValid) {
        // In a real app we'd verify if it's strictly the next day or same day to avoid double counting
        // For MVP demo, just increment.
        await supabase.rpc('increment_streak', { row_id: goalId })
        // Or simple update if RPC not defined:
        const newStreak = (goal.current_streak || 0) + 1
        await supabase.from('goals').update({ current_streak: newStreak }).eq('id', goalId)
    }

    revalidatePath(`/goals/${goalId}`)
    return {
        success: validation.isValid,
        feedback: validation.feedback
    }
}
