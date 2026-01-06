import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function VerifyJokerPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string }>
}) {
    const { session_id } = await searchParams

    if (!session_id) {
        return redirect('/dashboard')
    }

    const supabase = await createClient()

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status === 'paid' && session.metadata?.type === 'joker') {
            const { goal_id, missed_date, user_id } = session.metadata

            // Deduplication check: Has this joker already been processed?
            // We check if a log exists for this specific missed date
            const { data: existingLog } = await supabase
                .from('daily_logs')
                .select('id')
                .eq('goal_id', goal_id)
                .eq('is_joker', true)
                .ilike('proof_text', `%${missed_date}%`)
                .single()

            if (!existingLog) {
                // 1. Log Transaction
                const jokerPrice = session.amount_total || 2000
                await supabase.from('transactions').insert({
                    user_id: user_id,
                    goal_id: goal_id,
                    amount: jokerPrice,
                    type: 'joker_purchase',
                    status: 'completed'
                })

                // 2. Insert Joker Log
                await supabase.from('daily_logs').insert({
                    goal_id: goal_id,
                    user_id: user_id,
                    proof_text: `Joker acheté pour le ${missed_date}`,
                    ai_validation_status: 'valid',
                    ai_feedback: 'Journée sauvée par Joker 🃏',
                    is_joker: true
                })

                // 3. Restore Streak
                // We need to fetch current streak first
                const { data: goal } = await supabase.from('goals').select('current_streak').eq('id', goal_id).single()
                if (goal) {
                    const newStreak = (goal.current_streak || 0) + 1
                    await supabase.from('goals').update({ current_streak: newStreak }).eq('id', goal_id)
                }

                // Revalidate goal page to show updated stats
                revalidatePath(`/goals/${goal_id}`)
            }

            return redirect(`/goals/${goal_id}?joker=success`)
        }

    } catch (error) {
        console.error('Joker verification failed:', error)
        return redirect('/dashboard?error=joker_verification_failed')
    }

    return redirect('/dashboard')
}
