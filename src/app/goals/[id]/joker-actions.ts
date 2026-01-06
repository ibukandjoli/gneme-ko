'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'

export async function buyJoker(goalId: string, missedDate: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // 1. Verify Goal ownership
    const { data: goal } = await supabase.from('goals').select('*, user_id').eq('id', goalId).single()
    if (!goal || goal.user_id !== user.id) return { error: 'Forbidden' }

    // 2. Create Stripe Checkout Session for Joker (2000 FCFA)
    const jokerPrice = 2000

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'xof',
                        product_data: {
                            name: `Joker de Sauvetage`,
                            description: `Pour sauver la journée du ${missedDate}`,
                        },
                        unit_amount: jokerPrice,
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/goals/verify-joker?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/goals/${goalId}`,
            customer_email: user.email,
            metadata: {
                type: 'joker',
                goal_id: goalId,
                user_id: user.id,
                missed_date: missedDate
            }
        });

        if (!session.url) throw new Error('No session URL');

        return { success: true, paymentUrl: session.url }

    } catch (error: any) {
        console.error('Stripe Joker error:', error);
        return { error: 'Erreur lors du paiement du Joker: ' + error.message }
    }
}
