import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Modern & Dynamic font
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gnémé Ko | Parie sur ta réussite",
  description: "Ne compte plus sur la motivation. Misez sur ta discipline. Gnémé Ko est la 1ère plateforme au Sénégal qui t'aide à tenir tes engagements grâce à l'enjeu financier.",
  keywords: ["développement personnel", "discipline", "sénégal", "goal setting", "productivité", "challenges", "gnémé ko", "sport", "lecture", "habitudes"],
  openGraph: {
    title: "Gnémé Ko | Parie sur ta réussite",
    description: "La motivation est éphémère, la discipline paie. Lance-toi un défi financier et atteints enfin tes objectifs.",
    type: "website",
    locale: "fr_SN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gnémé Ko | Ose le défi",
    description: "Arrête de remettre à demain. Parie sur toi aujourd'hui.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
