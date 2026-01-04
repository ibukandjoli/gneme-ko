'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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

    // 1. Create Goal
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
            start_date: new Date().toISOString(), // Starts now
            status: 'active', // Payment simulated as success
            currency: 'XOF'
        })
        .select()
        .single()

    if (goalError) {
        console.error('Goal creation error:', goalError)
        return { error: goalError.message || 'Failed to create goal' }
    }

    // 2. Simulate Transactions
    // Deposit
    await supabase.from('transactions').insert({
        user_id: user.id,
        goal_id: goal.id,
        amount: stakeAmount,
        type: 'deposit',
        status: 'completed'
    })

    // Service Fee
    await supabase.from('transactions').insert({
        user_id: user.id,
        goal_id: goal.id,
        amount: serviceFee,
        type: 'service_fee',
        status: 'completed'
    })

    revalidatePath('/dashboard')

    // Redirect to Wave Payment Link
    // Format: https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=14000
    const waveUrl = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${totalAmount}`
    redirect(waveUrl)
}
