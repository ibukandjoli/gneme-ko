import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CGUPage() {
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
                    <h1 className="text-3xl font-bold tracking-tight">Conditions Générales d&apos;Utilisation (CGU)</h1>
                    <p className="text-muted-foreground mt-2">En vigueur au {new Date().toLocaleDateString()}</p>
                </header>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">1. Objet</h2>
                        <p>
                            Les présentes CGU régissent l&apos;utilisation de la plateforme <strong>Gnémé Ko</strong>, éditée par TEKKI Studio.
                            Gnémé Ko est une application de &quot;Goal-Setting Social et Financier&quot; permettant aux utilisateurs de s&apos;engager à réaliser des objectifs personnels en mettant en jeu une somme d&apos;argent.
                        </p>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">2. Fonctionnement du Service</h2>
                        <p>
                            L&apos;Utilisateur définit un objectif (le &quot;Défi&quot;), une durée, et verse une somme d&apos;argent (la &quot;Caution&quot;) augmentée de frais de service.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Validation :</strong> L&apos;Utilisateur doit fournir des preuves photographiques quotidiennes de la réalisation de son objectif.
                            </li>
                            <li>
                                <strong>Vérification par IA :</strong> Une Intelligence Artificielle analyse les preuves pour valider ou rejeter la réussite journalière.
                            </li>
                        </ul>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">3. Engagements Financiers</h2>
                        <p>
                            En utilisant le service, l&apos;Utilisateur accepte le mécanisme de jeu suivant :
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Succès :</strong> Si l&apos;Utilisateur valide son défi (atteint le nombre de jours requis sans échec fatal), sa Caution lui est intégralement remboursée (hors frais de service).
                            </li>
                            <li>
                                <strong>Échec :</strong> Si l&apos;Utilisateur échoue à fournir les preuves valides, il perd définitivement le montant de sa Caution. Les sommes perdues sont conservées par TEKKI Studio à titre de chiffre d&apos;affaires.
                            </li>
                            <li>
                                <strong>Frais de Service :</strong> Des frais de 10% sont appliqués lors du paiement initial et ne sont jamais remboursables, quel que soit l&apos;issue du défi.
                            </li>
                        </ul>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">4. Paiements et Remboursements</h2>
                        <p>
                            Les transactions sont sécurisées et traitées par des tiers de confiance (ex: Wave, Orange Money). TEKKI Studio ne stocke pas les coordonnées bancaires complètes.
                            Les remboursements sont effectués sur le moyen de paiement d&apos;origine dans un délai de 7 à 14 jours ouvrés après la validation du succès.
                        </p>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">5. Responsabilité</h2>
                        <p>
                            TEKKI Studio fournit un outil de motivation mais n&apos;est pas responsable de la santé ou de la sécurité de l&apos;Utilisateur lors de la réalisation de ses défis (ex: défis sportifs). L&apos;Utilisateur s&apos;engage à choisir des objectifs raisonnables et sans danger.
                        </p>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
                        <p>
                            Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : <strong>jambaar@gnemeko.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
