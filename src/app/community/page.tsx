import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Quote, Trophy, XCircle } from 'lucide-react'
import { formatCommitment } from '@/lib/utils'
import { Footer } from "@/components/landing/Footer"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
    const supabase = await createClient()

    // Fetch all started goals
    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="px-4 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Flame className="h-6 w-6 text-primary fill-primary" />
                            <h1 className="text-xl font-bold tracking-tighter">GNÉMÉ KO</h1>
                        </div>
                    </Link>
                </div>
                <div className="flex gap-2">
                    <Link href="/login">
                        <Button>Créer mon défi</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 py-12 px-4 max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">Le Mur des Challengers 🏆</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Ils ont osé parier sur eux-mêmes. Certains ont réussi, d'autres ont appris.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals?.map((goal) => (
                        <Card key={goal.id} className="relative overflow-hidden border-white/10 hover:border-primary/50 transition-colors group">
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                {goal.status === 'active' && <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Flame className="w-3 h-3" /> En cours</span>}
                                {goal.status === 'completed' && <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Trophy className="w-3 h-3" /> Réussi</span>}
                                {goal.status === 'failed' && <span className="bg-red-500/10 text-red-500 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Échoué</span>}
                            </div>

                            <CardContent className="p-8 space-y-6 flex flex-col h-full justify-between">
                                <div className="space-y-4">
                                    <Quote className="h-8 w-8 text-primary/40 rotate-180" />
                                    <p className="text-lg font-medium italic text-foreground/90 leading-relaxed font-serif">
                                        "{formatCommitment(goal.title, goal.duration_days, goal.stake_amount)}"
                                    </p>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        Challenger
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {new Date(goal.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
