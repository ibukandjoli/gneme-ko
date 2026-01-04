'use client'

import { formatCommitment, getCategoryDisplayName } from '@/lib/utils'
import { LiveChallengeCard } from './LiveChallengeCard'
import { useEffect, useState } from 'react'

interface Goal {
    id: string
    title: string
    duration_days: number
    stake_amount: number
    current_streak: number
    category: string // Assuming category exists in the fetched data
    user_name?: string // Optional if we fetch it, or we use a fallback
}

export function SocialProofCarousel({ goals }: { goals: Goal[] }) {
    // Duplicate limits for infinite loop illusion
    const extendedGoals = [...goals, ...goals, ...goals]

    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll gap-6 py-4">
                {extendedGoals.map((goal, index) => (
                    <LiveChallengeCard
                        key={`${goal.id}-${index}`}
                        user={goal.user_name || "Jambaar"}
                        category={getCategoryDisplayName(goal.category)}
                        commitment={formatCommitment(goal.title, goal.duration_days, goal.stake_amount)}
                        streak={goal.current_streak || 0}
                        amount={(goal.stake_amount || 0).toLocaleString() + " F"}
                    />
                ))}
            </div>
        </div>
    )
}
