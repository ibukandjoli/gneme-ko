'use client'

import { Button } from "@/components/ui/button"
import { buyJoker } from "./joker-actions"
import { useTransition } from "react"
import { AlertCircle, CreditCard } from "lucide-react"

export function JokerPurchase({ goalId, missedDate, price }: { goalId: string, missedDate: string, price: number }) {
    const [isPending, startTransition] = useTransition()

    const handlePurchase = () => {
        if(!confirm(`Acheter un Joker pour ${price}F et sauver la journée du ${missedDate} ?`)) return;

        startTransition(async () => {
            await buyJoker(goalId, missedDate)
        })
    }

    return (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex flex-col gap-3 animate-in shake">
            <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                <div>
                    <h4 className="font-bold text-red-700">Journée manquée : {missedDate} !</h4>
                    <p className="text-sm text-red-600/90">Achète un Joker pour sauver ta caution.</p>
                </div>
            </div>
            <Button 
                onClick={handlePurchase} 
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
                {isPending ? 'Paiement...' : `🃏 Acheter Joker (${price} F)`}
                {!isPending && <CreditCard className="ml-2 h-4 w-4" />}
            </Button>
        </div>
    )
}
