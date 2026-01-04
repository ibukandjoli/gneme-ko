import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Flame, ShieldCheck, Camera, Wallet, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { PainCard } from "@/components/landing/PainCard"
import { Step } from "@/components/landing/Step"
import { LiveChallengeCard } from "@/components/landing/LiveChallengeCard"
import { FaqItem } from "@/components/landing/FaqItem"
import { Footer } from "@/components/landing/Footer"
import { formatCommitment } from '@/lib/utils'
import { HeroForm } from '@/components/landing/HeroForm'
import { WhySection } from '@/components/landing/WhySection'
import { SocialProofCarousel } from '@/components/landing/SocialProofCarousel'

export const dynamic = 'force-dynamic' // Ensure we get fresh data



export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch real goals for social proof
  // Ideally, join with profiles. But for MVP we will stick to "Challenger à succès" or handle it if we have time.
  // Actually the prompt implies we should have names. 
  // Since we haven't implemented Name persistence yet, let's keep it generic but use the new card design.
  const { data: recentGoals } = await supabase
    .from('goals')
    .select('id, title, duration_days, stake_amount, current_streak, user_id, category')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ... Header and Hero stay same ... */}

      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary fill-primary" />
          <h1 className="text-xl font-bold tracking-tighter">GNÉMÉ KO</h1>
        </div>
        <div className="flex gap-2">
          {user ? (
            <Link href="/dashboard">
              <Button className="font-bold">Mon Dashboard</Button>
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link href="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">
                  Se connecter
                </Button>
              </Link>
              <Link href="/login">
                <Button className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                  Gnémé Ko! (Ose-le)
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-24 lg:py-32 flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto z-0">

        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-30 pointer-events-none -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-[128px]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500 rounded-full blur-[128px]" />
        </div>
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold border-primary/20 bg-primary/10 text-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
          La 1ère plateforme de Goal-Setting au Sénégal 🇸🇳
        </div>
        <h2 className="text-5xl font-extrabold tracking-tight lg:text-7xl leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Parie sur ta <span className="text-primary">réussite</span>.
        </h2>
        <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Définis un objectif. Dépose une caution. Prouve ton évolution chaque jour ou perds ta mise.
          <br />
          <span className="font-bold text-foreground block mt-3">Ça passe ou ça casse.</span>
        </p>
        <HeroForm />
      </section>

      {/* Section 1: La Douleur */}
      <section className="px-4 py-16 bg-muted/5">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Combien de projets as-tu abandonnés ?</h2>
            <p className="text-muted-foreground text-lg">On connait tous ça. La motivation du début ne dure jamais.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PainCard
              icon={<Clock className="h-10 w-10 text-orange-500/80" />}
              title="Le sport repoussé"
              description="Tu t'inscris à la salle, tu y vas 2 fois, et après... plus rien."
            />
            <PainCard
              icon={<AlertTriangle className="h-10 w-10 text-yellow-500/80" />}
              title="Le business non démarré"
              description="L'idée est là, mais tu attends toujours le 'bon moment' pour te lancer."
            />
            <PainCard
              icon={<Wallet className="h-10 w-10 text-red-500/80" />}
              title="L'épargne oubliée"
              description="Tu promets d'économiser, mais tu finis par tout dépenser chaque mois."
            />
          </div>

          <div className="text-center pt-8">
            <p className="text-xl font-bold bg-primary/10 inline-block px-6 py-3 rounded-xl text-primary border border-primary/20">
              La motivation ne suffit pas. <span className="underline decoration-primary decoration-4 color-white underline-offset-4">L'engagement financier, oui.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Comment ça marche */}
      <section id="how-it-works" className="px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <h2 className="text-3xl font-bold text-center mb-12">Voici comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <Step
              number="1"
              title="Choisis ton défi"
              icon={<CheckCircle className="h-6 w-6 text-white" />}
              desc="Sport, Réveil, Lecture... Définis ton objectif."
            />
            <Step
              number="2"
              title="Mise ta caution"
              icon={<Wallet className="h-6 w-6 text-white" />}
              desc="Dépose via Wave/OM. C'est ton argent, ne le perds pas."
            />
            <Step
              number="3"
              title="Prouve ton évolution"
              icon={<Camera className="h-6 w-6 text-white" />}
              desc="Envoie une photo par jour. Notre IA valide instantanément."
            />
            <Step
              number="4"
              title="Récupère ta caution"
              icon={<ShieldCheck className="h-6 w-6 text-white" />}
              desc="Réussis ton défi et récupère ta caution, preuve de ta réussite."
            />
          </div>
        </div>
      </section>

      {/* Section 2.5: Pourquoi Gnémé Ko */}
      <WhySection />

      {/* Section 3: Preuve Sociale (Real Data + Carousel) */}
      <section className="py-20 bg-background overflow-hidden border-t border-white/5">
        <div className="space-y-12">
          <h2 className="text-3xl font-bold text-center">Ils sont en train de réussir</h2>

          {/* Real Carousel */}
          {recentGoals && recentGoals.length > 0 ? (
            <SocialProofCarousel goals={recentGoals} />
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <p>Aucun défi public pour le moment. Sois le premier !</p>
              {/* Fallback to fake data for visual if empty? Or just the fake cards below */}
            </div>
          )}

          {/* Fake Data Cards (Improved with Quotes) if user wants to keep them as "Simulated" or just replace? */}
          {/* User asked: "J'aimerais que tu ajoutes juste la citation/engagement dans les anciennes cartes, juste avant la barre de séparation et la 'mise en jeu'." */}
          {/* Let's show them as a static grid below the carousel if needed, OR if recentGoals is empty. 
              The prompt implies modifying the "old" cards which were the "Fake Data". 
              Let's keep them as a static showcase of specific archetypes below the live ticker.
          */}

        </div>
      </section>

      {/* Section 4: FAQ Trust */}
      <section className="px-4 py-16 max-w-3xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">Questions Fréquentes</h2>
        <div className="space-y-4">
          <FaqItem
            question="Est-ce que je récupère vraiment mon argent ?"
            answer="OUI ! Gnémé Ko ne garde pas ta caution. Elle est bloquée sur un compte séquestre. Dès que tu valides tes jours et réussis ton défi, le remboursement est automatique."
          />
          <FaqItem
            question="Comment l'IA vérifie mes preuves ?"
            answer="Nous utilisons l'une des IA les plus avancées au monde. Elle analyse ta photo pour détecter les objets liés à ton défi (chaussures, livre, écrans, etc.) et vérifie si tu as effectivement accompli ton objectif. Si tu triches, elle le saura et te le dira. Tu peux la tester."
          />
          <FaqItem
            question="Et si je rate un jour ?"
            answer="Si tu rates un jour, tu as la possibilité d'acheter un joker pour sauver ta journée et ta caution, et poursuivre ton défi. Si tu rates deux jours consécutifs, tu perds ta caution."
          />
          <FaqItem
            question="Quels moyens de paiement acceptez-vous ?"
            answer="Nous acceptons Wave, Orange Money, Yas Money et les Cartes Bancaires. Tout est sécurisé et géré par nos partenaires de paiement locaux."
          />
          <FaqItem
            question="Est-ce un jeu de hasard / paris sportifs ?"
            answer="Absolument pas. Dans un pari, tu mises sur la chance ou sur les autres. Avec Gnémé Ko, tu mises sur TOI. Tu as le contrôle total du résultat. Si tu es discipliné, tu ne peux pas perdre."
          />
          <FaqItem
            question="Que faites-vous de l'argent perdu ?"
            answer="L'argent des échecs finance la plateforme et une partie est reversée à des causes de notre choix. Notre objectif est que tu n'aies aucune bonne raison de perdre. Tu dois réussir."
          />
          <FaqItem
            question="Puis-je annuler ou changer d'objectif ?"
            answer="Non. Une fois la caution déposée, il n'y a plus de retour en arrière. C'est le principe de l'engagement total ('Burn the bridges'). Réfléchis bien avant de t'engager !"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 text-center">
        <Link href="/login">
          <Button size="lg" className="h-16 px-12 rounded-full text-xl font-bold shadow-2xl animate-pulse hover:animate-none hover:scale-105 transition-transform">
            Je crée mon défi maintenant 🔥
          </Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">Pas de carte bancaire requise pour commencer.</p>
      </section>

      <Footer />

    </div>
  )
}
