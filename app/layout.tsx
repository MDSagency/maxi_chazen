import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";

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
        <SmoothScrollProvider>
          <Suspense fallback={<div className="h-20" />}>
            <Navbar />
          </Suspense>
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
