import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-8">
                <header>
                    <Link href="/">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à l'accueil
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Mentions Légales</h1>
                    <p className="text-muted-foreground mt-2">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Le site Gnémé Ko (ci-après &quot;la Plateforme&quot;) est édité par <strong>TEKKI Studio</strong>.
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li><strong>Adresse du siège social :</strong> 12, Ouest-Foire, Dakar, SÉNÉGAL</li>
                        <li><strong>Email de contact :</strong> jambaar@gnemeko.com</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">2. Hébergement</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        La Plateforme est hébergée par la société <strong>Vercel Inc.</strong>,
                        située au 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">3. Propriété intellectuelle</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Tous les éléments graphiques, la structure et, plus généralement, le contenu du site Gnémé Ko sont protégés par le droit d&apos;auteur, le droit des marques et le droit des dessins et modèles.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Toute personne qui recueille ou télécharge du contenu ou des informations diffusées sur le site ne dispose sur ceux-ci que d’un droit d’usage privé, personnel et non transmissible.
                    </p>
                </section>
            </div>
        </div>
    );
}
