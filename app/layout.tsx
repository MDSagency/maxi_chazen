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
    icon: "https://res.cloudinary.com/drfntkkhe/image/upload/v1777151440/image-removebg-preview_uuol8c.png",
    shortcut:
      "https://res.cloudinary.com/drfntkkhe/image/upload/v1777151440/image-removebg-preview_uuol8c.png",
    apple:
      "https://res.cloudinary.com/drfntkkhe/image/upload/v1777151440/image-removebg-preview_uuol8c.png",
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
