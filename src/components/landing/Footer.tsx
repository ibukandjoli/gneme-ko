import Link from "next/link"
import { Flame, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-background border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Flame className="h-6 w-6 text-primary fill-primary" />
                            <span className="text-xl font-bold tracking-tighter">GNÉMÉ KO</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            La première plateforme de goal-setting social et financier au Sénégal.
                            Prouve ta réussite ou perds ta mise.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-4">Plateforme</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:text-primary transition-colors">Connexion</Link></li>
                            <li><Link href="/login" className="hover:text-primary transition-colors">Créer un défi</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/cgu" className="hover:text-primary transition-colors">CGU / CGV</Link></li>
                            <li><Link href="/confidentialite" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
                            <li><Link href="/mentions-legales" className="hover:text-primary transition-colors">Mentions légales</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold mb-4">Suis-nous</h4>
                        <div className="flex gap-4">
                            <Link href="https://instagram.com/ibukandjoli" className="bg-muted/10 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://twitter.com/ibukandjoli" className="bg-muted/10 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="https://linkedin.com/in/ibukandjoli" className="bg-muted/10 p-2 rounded-full hover:bg-primary/20 hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Gnémé Ko. Fait avec passion à Dakar 🇸🇳.</p>
                </div>
            </div>
        </footer>
    )
}
