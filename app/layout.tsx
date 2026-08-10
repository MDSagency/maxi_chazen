import "./globals.css";
import InstagramSticky from "@/components/layout/InstagramSticky";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maxi Chazen — Soins premium pour bébé",
  description:
    "Découvrez des soins bébé premium, formulés avec douceur et rigueur. Livraison partout en Algérie.",
  icons: {
    icon: "/logo.jfif",
    shortcut: "/logo.jfif",
    apple: "/logo.jfif",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white">
        {children}
        <InstagramSticky />
      </body>
    </html>
  );
}
