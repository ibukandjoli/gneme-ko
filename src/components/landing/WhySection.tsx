import { Zap, Target, Trophy } from "lucide-react"

export function WhySection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-muted/5 to-background border-y border-white/5 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Content Left */}
                    <div className="space-y-12 relative z-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold border-yellow-500/20 bg-yellow-500/10 text-yellow-500 uppercase tracking-widest">
                                Pourquoi Gnémé Ko ?
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                                Parce qu'être motivé ne suffit pas.
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                                La motivation te fait commencer. <span className="text-primary font-bold">La discipline</span> te fait terminer.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <WhyBlock
                                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                                title="Le Piège de la Motivation"
                                text={<>On connaît tous ça. Le lundi, on est motivé. Le mercredi, on est fatigué. Le vendredi, on abandonne. Ce n'est pas ta faute. La motivation est une émotion éphémère. Pour réussir, il ne faut pas attendre d'avoir envie, il faut <span className="font-bold text-foreground">agir</span>.</>}
                            />
                            <WhyBlock
                                icon={<Target className="w-6 h-6 text-red-500" />}
                                title="La Puissance de l'Engagement"
                                text={<>En mettant ton argent en jeu, tu transformes une simple envie en une <span className="font-bold text-foreground">obligation</span>. Tu ne comptes plus sur ta motivation, mais sur ton aversion à la perte. C'est le moteur le plus fiable pour construire une discipline de fer.</>}
                            />
                            <WhyBlock
                                icon={<Trophy className="w-6 h-6 text-primary" />}
                                title="Un Pas Après l'Autre"
                                text={<>Gnémé Ko, c'est oser être discipliné. Nous ne sommes pas là pour garder ton argent, mais pour t'aider à le mériter. Chaque jour validé est une <span className="font-bold text-foreground">victoire</span> sur toi-même. C'est la somme de ces petites victoires qui crée les grands succès.</>}
                            />
                        </div>
                    </div>

                    {/* Visual Right - Abstract Illustration */}
                    <div className="relative h-[600px] hidden lg:block rounded-3xl overflow-hidden border border-white/10 bg-muted/10 shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay hover:scale-105 transition-transform duration-[20s]"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                        {/* Floating Cards Effect */}
                        <div className="absolute bottom-10 left-10 right-10 p-6 bg-background/80 backdrop-blur-md border border-white/10 rounded-2xl transform translate-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            <p className="font-serif italic text-lg text-center">"Nous sommes ce que nous faisons de manière répétée. L'excellence n'est donc pas un acte, mais une habitude."</p>
                            <p className="text-center text-xs font-bold mt-2 uppercase tracking-widest text-muted-foreground">- Aristote</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

function WhyBlock({ icon, title, text }: { icon: React.ReactNode, title: string, text: React.ReactNode }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="mt-1 bg-muted/20 p-2 rounded-lg border border-white/5 shrink-0">
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                    {text}
                </p>
            </div>
        </div>
    )
}
