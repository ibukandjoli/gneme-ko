import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Camera, Flame, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { ProofUploader } from './uploader'
import { JokerPurchase } from './joker-buy'

export default async function GoalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    const { data: goal } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single()

    if (!goal) return notFound()

    // Fetch logs
    const { data: logs } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('goal_id', id)
        .order('submitted_at', { ascending: false })

    const todayStr = new Date().toISOString().split('T')[0]
    const hasLoggedToday = logs?.some(log => {
        const logDate = new Date(log.submitted_at).toISOString().split('T')[0]
        return logDate === todayStr && log.ai_validation_status === 'valid' && !log.is_joker
    })

    // Calculate missed days logic
    const startDate = new Date(goal.start_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize today to midnight for comparison

    // Generate array of past days up to yesterday
    const missedDays = []

    // Safety check: Prevent infinite loop if start date is weird. Limit to 30 days max check.
    for (let d = new Date(startDate); d < today; d.setDate(d.getDate() + 1)) {
        const checkDateStr = d.toISOString().split('T')[0]
        // Check if log exists for this date with valid status (including jokers)
        const hasLog = logs?.some(log => {
            const logDate = new Date(log.submitted_at).toISOString().split('T')[0]
            return (logDate === checkDateStr && (log.ai_validation_status === 'valid')) ||
                (log.proof_text && log.proof_text.includes(checkDateStr)) // Detect Joker by string if needed
        })

        if (!hasLog) {
            missedDays.push(checkDateStr)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background pb-20">
            <header className="px-4 py-4 flex items-center gap-4 border-b">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <div className="flex-1 truncate">
                    <h1 className="font-bold text-lg truncate">{goal.title}</h1>
                    {goal.custom_category && <span className="text-xs text-muted-foreground">{goal.custom_category}</span>}
                </div>
                <div className="flex items-center gap-1 text-orange-600 font-bold text-sm bg-orange-100 px-2 py-1 rounded-full">
                    <Flame className="h-4 w-4 fill-orange-600" />
                    {goal.current_streak}
                </div>
            </header>

            <main className="flex-1 p-4 space-y-6 max-w-md mx-auto w-full">

                {/* Missed Days Alerts */}
                {missedDays.length > 0 && (
                    <div className="space-y-4">
                        {missedDays.map(date => (
                            <JokerPurchase
                                key={date}
                                goalId={goal.id}
                                missedDate={date}
                                price={2000}
                            />
                        ))}
                    </div>
                )}

                {/* Today's Status */}
                <Card className="border-2 border-primary/10 shadow-lg">
                    <CardHeader className="pb-2 text-center">
                        <CardTitle>Aujourd'hui</CardTitle>
                        <CardDescription>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        {hasLoggedToday ? (
                            <div className="flex flex-col items-center gap-2 text-green-600 py-4 max-w-[250px] text-center">
                                <CheckCircle className="h-16 w-16" />
                                <p className="font-bold text-lg">C'est validé !</p>
                                <p className="text-sm text-muted-foreground">Repose-toi, tu as assuré aujourd'hui.</p>
                            </div>
                        ) : (
                            <ProofUploader goalId={goal.id} category={goal.category} />
                        )}
                    </CardContent>
                </Card>

                {/* History */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Historique</h3>
                    <div className="space-y-2">
                        {logs?.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                        {new Date(log.submitted_at).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(log.submitted_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className={`text-sm font-bold flex items-center gap-2 ${log.ai_validation_status === 'valid' ? 'text-green-600' :
                                    log.ai_validation_status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                                    {log.ai_validation_status === 'valid' && "Validé"}
                                    {log.ai_validation_status === 'rejected' && "Rejeté"}
                                    {log.ai_validation_status === 'pending' && "En attente"}

                                    {log.ai_validation_status === 'valid' && <CheckCircle className="h-4 w-4" />}
                                    {log.ai_validation_status === 'rejected' && <XCircle className="h-4 w-4" />}
                                </div>
                            </div>
                        ))}
                        {!logs?.length && <p className="text-sm text-center text-muted-foreground py-4">Aucune activité.</p>}
                    </div>
                </div>

            </main>
        </div>
    )
}
