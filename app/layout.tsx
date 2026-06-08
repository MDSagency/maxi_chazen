import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Maxi Chazen - Soins bébé",
  description: "Produits pour bébé en Algérie",
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
      <body className="site-shell">
        <Suspense fallback={<div />}>
          <Navbar />
        </Suspense>
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
