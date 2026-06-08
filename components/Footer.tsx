export default function Footer() {
  return (
    <footer className="stay-footer" id="contact">
      <div className="stay-footer__inner">
        <h2 className="stay-footer__title">Restez connectés</h2>
        <p className="stay-footer__subtitle">
          Rejoignez notre cercle pour recevoir les nouveautés de saison et un
          accès anticipé aux nouvelles collections.
        </p>

        <p className="stay-footer__brand">Maxi Chazen</p>

        <nav className="stay-footer__social" aria-label="Réseaux sociaux">
          <a
            href="https://www.instagram.com/maxi.chazen/"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@maxi.chazen?_t=8oVTgq5B3dG&_r=1"
            aria-label="TikTok"
          >
            TikTok
          </a>
          <a href="https://www.facebook.com/maxichazen/#" aria-label="Facebook">
            Facebook
          </a>
        </nav>

        <p className="stay-footer__copy">© 2026 MAXI CHAZEN.</p>
      </div>
    </footer>
  );
}
