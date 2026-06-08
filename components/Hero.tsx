export default function Hero() {
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__heading">
            L'essentiel pour une enfance apaisée.
          </h1>
          <p className="hero__subtext">
            Des pièces pensées avec soin, conçues à partir de matériaux durables
            pour les familles d'aujourd'hui.
          </p>
          <a className="hero__cta" href="/products">
            Découvrir
          </a>
        </div>

        <div className="hero__image-wrapper">
          <div className="hero__image-frame">
            <img src="/hero-image.png" alt="Chambre de bébé moderne" />
            <div className="hero__badge">
              <p className="hero__badge-text">
                Pensé pour les parents modernes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
