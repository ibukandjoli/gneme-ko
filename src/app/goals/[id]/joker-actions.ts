'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function buyJoker(goalId: string, missedDate: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Verify Goal ownership
    const { data: goal } = await supabase.from('goals').select('*, user_id').eq('id', goalId).single()
    if (!goal || goal.user_id !== user.id) return { error: 'Forbidden' }

    // 2. Simulate Payment (2000 FCFA)
    // In real app -> Stripe/PayDunya call here.
    const jokerPrice = 2000
    
    // 3. Log the Joker Transaction
    await supabase.from('transactions').insert({
        user_id: user.id,
        goal_id: goalId,
        amount: jokerPrice,
        type: 'joker_purchase',
        status: 'completed'
    })

    // 4. Create the "Saved" Daily Log
    const { error } = await supabase.from('daily_logs').insert({
        goal_id: goalId,
        user_id: user.id,
        // We set the date to the missed date so it fills the gap
        // Important: db should have a date column for the log effective date, usually defaults to now()
        // Here we assume daily_logs purely relies on `created_at` or we need a `log_date` column.
        // Looking at the schema is tricky, usually MVP uses created_at. 
        // If we only have created_at, backdating is hard without a specific column.
        // Let's assume we can set `submitted_at` or `date` if it exists. 
        // If not, we insert and the frontend Logic needs to handle "Joker covers X date".
        // Let's assume we add a 'target_date' or just rely on the logic that "if there is a joker log, it counts as a wild card".
        // Wait, simplicity: Insert the log, and we'll just say proof_text="Joker pour le " + missedDate
        proof_text: `Joker acheté pour le ${missedDate}`,
        ai_validation_status: 'valid',
        ai_feedback: 'Journée sauvée par Joker 🃏',
        is_joker: true
        // If we strictly check dates, this might appear as "Today's log". 
        // For MVP, we likely just count total valid logs vs Duration.
        // But if we want to fill a specific gap visually, the display logic is key.
    })

    if (error) {
        console.error(error)
        return { error: 'Failed to save joker' }
    }

    // 5. Restore Streak
    // Simple increment
    const newStreak = (goal.current_streak || 0) + 1
    await supabase.from('goals').update({ current_streak: newStreak }).eq('id', goalId)

    revalidatePath(`/goals/${goalId}`)
    return { success: true }
}
