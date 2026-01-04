import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { signOut } from '../login/actions'
import Link from 'next/link'
import { Flame, Home, LogOut, Plus, Trophy } from 'lucide-react'
import { formatCommitment } from '@/lib/utils'
import { getUserName } from '@/lib/user'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Get user name
  const userName = await getUserName() || "Challenger"

  // Fetch created goals
  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      <header className="px-4 py-4 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur z-20">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 p-2 rounded-full">
              <Home className="h-5 w-5 text-primary" />
            </div>
          </Link>
          <span className="font-bold text-lg">Mon Espace</span>
        </div>
        <form action={signOut}>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
            <LogOut className="h-5 w-5" />
          </Button>
        </form>
      </header>

      <main className="p-4 space-y-8 max-w-md mx-auto w-full flex-1">

        {/* Personalized Greeting */}
        <div className="space-y-1 pt-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Bonjour, <span className="text-primary">{userName}</span> 👋</h1>
          <p className="text-muted-foreground font-medium">Prêt à dominer ta journée ?</p>
        </div>

        {/* Stats Widget */}
        <div className="bg-gradient-to-br from-primary/10 to-orange-500/5 p-6 rounded-2xl border border-primary/10 flex flex-col items-center justify-center space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold z-10">Ta Cagnotte de Motivation</span>
          <div className="text-5xl font-black text-primary flex items-baseline gap-1 z-10 drop-shadow-sm">
            {(goals?.reduce((acc, g) => acc + (g.status === 'active' ? g.stake_amount : 0), 0) || 0).toLocaleString()} <span className="text-lg text-muted-foreground font-bold">F</span>
          </div>
          <p className="text-xs text-muted-foreground z-10">Montant total engagé sur tes défis en cours</p>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-bold text-xl">Tes défis en cours 🔥</h2>
              {(goals && goals.length > 0) && (
                <p className="text-xs text-muted-foreground">N'oublie pas de poster ta preuve aujourd'hui !</p>
              )}
            </div>
          </div>

          {(goals && goals.length > 0) ? (
            <div className="grid gap-4">
              {goals.map((goal) => (
                <Link href={`/goals/${goal.id}`} key={goal.id}>
                  <Card className="group overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer active:scale-95 duration-200 bg-card/50 hover:bg-card">
                    <CardContent className="p-5 flex items-center justify-between relative">
                      {/* Hover Effect Background */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />

                      <div className="space-y-2 relative z-10">
                        <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
                        <p className="text-sm text-muted-foreground italic line-clamp-2 border-l-2 border-primary/20 pl-2">
                          "{formatCommitment(goal.title, goal.duration_days, goal.stake_amount)}"
                        </p>
                      </div>
                      <div className="flex flex-col items-end min-w-[80px] space-y-2 relative z-10">
                        <div className="font-bold font-mono text-lg">{goal.stake_amount.toLocaleString()} F</div>
                        <div className="text-xs bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold border border-orange-500/20">
                          <Flame className="h-3 w-3 fill-orange-500" /> {goal.current_streak} j
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center border-2 border-dashed border-muted rounded-2xl bg-muted/5">
              <div className="bg-background p-4 rounded-full shadow-sm">
                <Trophy className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2 max-w-xs mx-auto px-4">
                <h3 className="text-lg font-bold">Aucun défi actif</h3>
                <p className="text-sm text-muted-foreground">La procrastination coûte cher. Lance-toi maintenant.</p>
              </div>
              <Link href="/goals/new">
                <Button className="px-6 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-orange-600 text-white rounded-full">
                  Créer mon premier défi
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button with Label */}
      {goals && goals.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-500">
          <div className="bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg hidden md:block animate-bounce">
            Nouveau défi ?
          </div>
          <Link href="/goals/new">
            <Button size="icon" className="h-16 w-16 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-orange-600 hover:scale-110 transition-transform duration-200 border-4 border-background">
              <Plus className="h-8 w-8" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
