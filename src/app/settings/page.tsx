import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut } from 'lucide-react'
import { ProfileForm } from './form'
import { signOut } from '../login/actions'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex flex-col min-h-screen bg-background p-4 pb-20">
            <header className="flex items-center gap-4 mb-6">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <h1 className="font-bold text-xl">Mon Profil</h1>
                <div className="ml-auto">
                    <form action={signOut}>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            Déconnexion
                        </Button>
                    </form>
                </div>
            </header>

            <main className="max-w-md mx-auto w-full space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/10 rounded-xl border border-border/50">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Membre Jambaar</p>
                    </div>
                </div>

                <ProfileForm user={user} profile={profile} />
            </main>
        </div>
    )
}
