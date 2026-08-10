import Link from "next/link";
import Container from "@/components/ui/Container";

const footerLinks = {
  boutique: [
    { href: "/products", label: "Tous les produits" },
    { href: "/#produits", label: "Nouveautés" },
    { href: "/panier", label: "Mon panier" },
  ],
  marque: [
    { href: "/#histoire", label: "Notre histoire" },
    { href: "/#engagements", label: "Nos engagements" },
    { href: "/#", label: "Contact" },
  ],
};

const socialLinks = [
  { href: "https://www.instagram.com/maxi.chazen/", label: "Instagram" },
  { href: "https://www.tiktok.com/@maxi.chazen", label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper paper-grain" id="contact">
      <Container className="py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl text-ink">Maxi Chazen</p>
            <p className="mt-5 max-w-xs text-[14px] font-light leading-[1.8] text-muted">
              Soins premium pour bébé — formulés avec exigence, testés avec
              rigueur, livrés partout en Algérie.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-6">Boutique</p>
            <ul className="space-y-4">
              {footerLinks.boutique.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-charcoal transition-colors duration-500 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-6">La marque</p>
            <ul className="space-y-4">
              {footerLinks.marque.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-charcoal transition-colors duration-500 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-6">Suivez-nous</p>
            <div className="mb-4 flex flex-col items-start gap-3">
              <a
                href="https://www.instagram.com/maxi.chazen/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-md bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] px-4 py-2 text-sm font-medium text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.2" />
                  <path d="M7.5 11.99a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0z" stroke="white" strokeWidth="1.2" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="white" />
                </svg>
                <span className="sr-only">Suivez-nous sur Instagram @MaxiChazen</span>
              </a>

              <a
                href="https://www.tiktok.com/@maxi.chazen"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9 2v9.5A4.5 4.5 0 1 0 13.5 16V7h2.5V4h-5z" fill="#ffffff" transform="translate(0,0)" />
                </svg>
                <span className="sr-only">Suivez-nous sur TikTok @maxi.chazen</span>
              </a>
            </div>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light text-charcoal transition-colors duration-500 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-light">
            © {new Date().getFullYear()} Maxi Chazen. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-[11px] uppercase tracking-[0.18em] text-muted-light transition-colors hover:text-ink"
            >
              Mentions légales
            </Link>
            <Link
              href="#"
              className="text-[11px] uppercase tracking-[0.18em] text-muted-light transition-colors hover:text-ink"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
