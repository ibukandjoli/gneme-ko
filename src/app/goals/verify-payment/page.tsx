import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default async function VerifyPaymentPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string; goal_id: string }>
}) {
    const { session_id, goal_id } = await searchParams

    if (!session_id || !goal_id) {
        return redirect('/dashboard')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    try {
        // 1. Retrieve the session from Stripe to verify payment status
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status === 'paid') {
            // 2. Initial Checks
            // Only verify if goal is still pending to avoid double crediting on refresh
            const { data: currentGoal } = await supabase
                .from('goals')
                .select('status')
                .eq('id', goal_id)
                .single()

            if (currentGoal && currentGoal.status === 'pending_payment') {
                // 3. Activate Goal
                const { error: updateError } = await supabase
                    .from('goals')
                    .update({ status: 'active' })
                    .eq('id', goal_id)

                if (updateError) throw updateError

                // 4. Create Transactions (now real)
                // Use amount_total from session (which is in cents/units)
                // For XOF zero-decimal, amount_total is exact amount
                const amountTotal = session.amount_total || 0
                // We know 10% was fee.
                // Re-calculate exactly as created
                // Stake = Total / 1.1
                const stakeAmount = Math.round(amountTotal / 1.1)
                const serviceFee = amountTotal - stakeAmount

                // Deposit
                await supabase.from('transactions').insert({
                    user_id: user.id,
                    goal_id: goal_id,
                    amount: stakeAmount,
                    type: 'deposit',
                    status: 'completed'
                })

                // Service Fee
                await supabase.from('transactions').insert({
                    user_id: user.id,
                    goal_id: goal_id,
                    amount: serviceFee,
                    type: 'service_fee',
                    status: 'completed'
                })
            }
        } else {
            // Payment failed or cancelled
            return redirect('/goals/new?error=payment_failed')
        }

    } catch (error) {
        console.error('Payment verification failed:', error)
        return redirect('/dashboard?error=verification_failed')
    }

    // Redirect to dashboard with success toast
    return redirect('/dashboard?payment=success')
}
