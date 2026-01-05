'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { stripe } from '@/lib/stripe'

export async function createGoal(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in' }
    }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const stakeAmount = parseInt(formData.get('stakeAmount') as string)
    const duration = parseInt(formData.get('duration') as string)

    if (!title || !category || !stakeAmount || !duration) {
        return { error: 'All fields are required' }
    }

    const serviceFee = Math.ceil(stakeAmount * 0.10)
    const totalAmount = stakeAmount + serviceFee

    // List of allowed enum values in the database (Must match DB enum exactly)
    const allowedCategories = ['sport', 'learning', 'early_wake', 'detox', 'other']

    // If the category from form is not in the allowed list, it's a custom one.
    // We must save it as 'other' in the DB to avoid the enum error.
    // We will prepend the custom category to the title so it's not lost.
    let dbCategory = category
    let dbTitle = title

    if (!allowedCategories.includes(category)) {
        dbCategory = 'other'
        dbTitle = `[${category}] ${title}`
    }

    // 1. Create Goal with pending status
    const { data: goal, error: goalError } = await supabase
        .from('goals')
        .insert({
            user_id: user.id,
            title: dbTitle,
            category: dbCategory,
            stake_amount: stakeAmount,
            service_fee: serviceFee,
            total_amount: totalAmount,
            duration_days: duration,
            start_date: new Date().toISOString(),
            status: 'pending_payment', // Changed from active
            currency: 'XOF'
        })
        .select()
        .single()

    if (goalError) {
        console.error('Goal creation error:', goalError)
        return { error: goalError.message || 'Failed to create goal' }
    }

    // 2. Create Stripe Checkout Session
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'xof',
                        product_data: {
                            name: `Caution: ${dbTitle}`,
                            description: 'Remboursable en cas de succès',
                        },
                        unit_amount: stakeAmount, // Stripe XOF is zero-decimal? No, XOF is usually normal amount but let's check docs. XOF is zero-decimal currency in Stripe? 
                        // Actually Stripe supports XOF. 1000 XOF = 1000 unit_amount usually for zero-decimal.
                        // Wait, for XOF (West African CFA frac), it IS a zero-decimal currency.
                        // So 5000 FCFA = 5000.
                        // Let's verify standard behavior. If it WASN'T zero decimal, 5000 FCFA would be 500000.
                        // Stripe API: "Zero-decimal currencies: BIF, CLP, DJF, GNF, JPY, KMF, KRW, MGA, PYG, RWF, UGX, VND, VUV, XAF, XOF, XPF."
                        // CORRECT. So passed amount is exact amount.
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: 'xof',
                        product_data: {
                            name: 'Frais de service (10%)',
                            description: 'Non remboursable',
                        },
                        unit_amount: serviceFee,
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/goals/verify-payment?session_id={CHECKOUT_SESSION_ID}&goal_id=${goal.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/goals/new`, // Or dashboard
            customer_email: user.email,
            metadata: {
                goal_id: goal.id,
                user_id: user.id
            }
        });

        if (!session.url) throw new Error('No session URL');

        return { success: true, paymentUrl: session.url }

    } catch (error: any) {
        console.error('Stripe error:', error);
        // Clean up pending goal if stripe fails?
        await supabase.from('goals').delete().eq('id', goal.id)
        return { error: 'Erreur lors de l\'initialisation du paiement: ' + error.message }
    }
}
// Remove old simulation code block down here
/* 
    // 2. Simulate Transactions...
*/
