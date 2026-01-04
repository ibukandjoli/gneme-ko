'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Flame, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

// Needs to accept an optional className for marquee usage
export function LiveChallengeCard({
    user,
    commitment,
    streak,
    category,
    amount,
    className
}: {
    user: string,
    commitment: string,
    streak: number,
    category: string,
    amount: string,
    className?: string
}) {
    return (
        <Card className={cn("relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-background to-orange-950/10 w-[280px] md:w-[320px] shrink-0 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 h-full", className)}>
            <CardContent className="p-6 space-y-4 flex flex-col h-full justify-between">
                <div className="space-y-3">
                    {/* Header: User & Streak */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-bold text-base text-foreground truncate max-w-[140px]">{user}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{category}</div>
                        </div>
                        <div className="bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm border border-orange-500/20">
                            <Flame className="w-3 h-3 fill-orange-500 animate-pulse" /> {streak}j
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="relative">
                        <Quote className="h-4 w-4 text-primary/20 absolute -top-1 -left-1 rotate-180" />
                        <p className="text-sm font-medium italic text-foreground/90 leading-relaxed font-serif pl-3 z-10 relative">
                            "{commitment}"
                        </p>
                    </div>
                </div>

                {/* Footer: Amount */}
                <div className="pt-3 border-t border-white/5 flex justify-between items-center group-hover:border-primary/20 transition-colors">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mise en jeu</span>
                    <span className="text-lg font-mono font-bold text-primary">{amount}</span>
                </div>
            </CardContent>
        </Card>
    )
}
