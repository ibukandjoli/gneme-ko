import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Coins, TrendingUp, AlertTriangle } from "lucide-react"

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default async function AdminDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        redirect('/')
    }

    // 1. Fetch Stats
    // Note: Without a profiles table linked to auth.users, we can only count users who have interactions or use a service key.
    // For this implementation, we'll count unique users in the 'goals' table as a proxy for 'Active Users'

    const { data: allGoals } = await supabase
        .from('goals')
        .select('id, user_id, status, stake_amount, service_fee, title, created_at, category')
        .order('created_at', { ascending: false })

    if (!allGoals) return <div>Erreur de chargement</div>

    // Calculate Metrics
    const totalUsers = new Set(allGoals.map(g => g.user_id)).size
    const activeGoals = allGoals.filter(g => g.status === 'active')
    const activeVolume = activeGoals.reduce((acc, g) => acc + (g.stake_amount || 0), 0)
    const totalRevenue = allGoals.reduce((acc, g) => acc + (g.service_fee || 0), 0)

    return (
        <div className="min-h-screen bg-background p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin 🛡️</h1>
                    <p className="text-muted-foreground">Vue d'ensemble de la plateforme Gnémé Ko.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-white/5">
                    <span>Admin connecté:</span>
                    <span className="font-bold text-primary">{user.email}</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs (Avec Défis)</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Ayant créé au moins 1 défi</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Défis Actifs</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeGoals.length}</div>
                        <p className="text-xs text-muted-foreground">En cours de validation</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume d'Affaires</CardTitle>
                        <Coins className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeVolume.toLocaleString()} F</div>
                        <p className="text-xs text-muted-foreground">Caution active totale</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus (Fees)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">+{totalRevenue.toLocaleString()} F</div>
                        <p className="text-xs text-muted-foreground">Frais de service cumulés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Goals Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">50 Derniers Défis</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Challenger (ID)</TableHead>
                                <TableHead>Défi</TableHead>
                                <TableHead>Mise</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allGoals.slice(0, 50).map((goal) => (
                                <TableRow key={goal.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {new Date(goal.created_at).toLocaleDateString()} <br />
                                        {new Date(goal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-mono text-xs text-muted-foreground" title={goal.user_id}>
                                                {goal.user_id.substring(0, 8)}...
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{goal.title}</div>
                                        <div className="text-xs text-muted-foreground uppercase">{goal.category}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold">{goal.stake_amount.toLocaleString()} F</div>
                                        <div className="text-xs text-muted-foreground">+{(goal.service_fee || 0).toLocaleString()} fee</div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={goal.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'active') return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">En cours</Badge>
    if (status === 'completed') return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Réussi</Badge>
    if (status === 'failed') return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Échoué</Badge>
    return <Badge variant="outline">{status}</Badge>
}
