'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles } from "lucide-react"

const PLACEHOLDERS = [
    "Courir 10km chaque jour...",
    "Lancer mon business...",
    "Epargner 2000 FCFA/jour...",
    "Lire 10 pages par jour...",
    "Publier 1 vidéo par jour...",
    "Me lever à 5h..."
]

export function HeroForm() {
    const router = useRouter()
    const [goal, setGoal] = useState("")
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [placeholderText, setPlaceholderText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [typingSpeed, setTypingSpeed] = useState(100)

    // Typewriter Logic
    useEffect(() => {
        const currentFullText = PLACEHOLDERS[placeholderIndex]

        const handleTyping = () => {
            setPlaceholderText(prev => {
                if (isDeleting) {
                    return currentFullText.substring(0, prev.length - 1)
                } else {
                    return currentFullText.substring(0, prev.length + 1)
                }
            })

            // Speed Control
            setTypingSpeed(isDeleting ? 40 : 100)

            // State Transitions
            if (!isDeleting && placeholderText === currentFullText) {
                // Finished pulsing, wait then delete
                setTimeout(() => setIsDeleting(true), 2000)
            } else if (isDeleting && placeholderText === "") {
                // Finished deleting, move to next word
                setIsDeleting(false)
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
            }
        }

        const timer = setTimeout(handleTyping, typingSpeed)
        return () => clearTimeout(timer)
    }, [placeholderText, isDeleting, placeholderIndex, typingSpeed])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (goal.trim()) {
            router.push(`/goals/new?title=${encodeURIComponent(goal)}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg relative group">
            <div className="absolute inset-0 -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex p-2 bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl items-center gap-2">
                <div className="pl-3 text-muted-foreground">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <Input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={placeholderText}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg sm:text-lg lg:text-xl h-14 pl-2"
                />
                <Button size="lg" type="submit" className="h-12 px-6 rounded-lg font-bold text-base shrink-0 transition-transform hover:scale-105 active:scale-95">
                    Je l'ose <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/60">
                Ecris ton objectif et clique sur "Je l'ose" pour commencer
            </p>
        </form>
    )
}
