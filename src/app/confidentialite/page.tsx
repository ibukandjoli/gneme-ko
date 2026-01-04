import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfidentialitePage() {
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
                    <h1 className="text-3xl font-bold tracking-tight">Politique de Confidentialité</h1>
                    <p className="text-muted-foreground mt-2">Dernière mise à jour : {new Date().toLocaleDateString()}</p>
                </header>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">1. Collecte des Données</h2>
                        <p>
                            Dans le cadre de l&apos;utilisation de Gnémé Ko, nous collectons les données suivantes :
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Identité :</strong> Nom, Prénom, Age, Ville, Pays (via le profil).</li>
                            <li><strong>Contact :</strong> Adresse email (pour l&apos;authentification et les notifications).</li>
                            <li><strong>Contenu :</strong> Photos et textes soumis comme preuves de réalisation des défis.</li>
                            <li><strong>Technique :</strong> Logs de connexion, adresse IP.</li>
                        </ul>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">2. Utilisation des Données</h2>
                        <p>
                            Vos données sont utilisées pour :
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Créer et gérer votre compte utilisateur.</li>
                            <li>Vérifier la réalisation de vos défis (Analyse d&apos;images).</li>
                            <li>Traiter les paiements et remboursements.</li>
                            <li>Améliorer nos services et personnaliser votre expérience.</li>
                        </ul>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">3. Partage avec des Tiers</h2>
                        <p>
                            Nous ne vendons pas vos données. Elles peuvent être partagées avec nos prestataires techniques strictement pour les besoins du service :
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Supabase :</strong> Hébergement de la base de données et authentification.</li>
                            <li><strong>Google Gemini :</strong> Analyse des images (IA) pour la validation des preuves.</li>
                            <li><strong>Wave / Stripe :</strong> Prestataires de paiement.</li>
                            <li><strong>Resend :</strong> Envoi des emails transactionnels.</li>
                        </ul>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">4. Sécurité</h2>
                        <p>
                            Nous mettons en œuvre des mesures de sécurité conformes aux standards de l&apos;industrie (chiffrement, HTTPS) pour protéger vos données contre tout accès non autorisé.
                        </p>
                    </section>

                    <section className="mt-8 space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">5. Vos Droits</h2>
                        <p>
                            Conformément à la législation en vigueur au Sénégal (Loi 2008-12 sur la protection des données personnelles), vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données.
                        </p>
                        <p>
                            Pour exercer ces droits, contactez-nous à : <strong>jambaar@gnemeko.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
