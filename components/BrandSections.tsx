export default function BrandSections() {
  return (
    <section className="philosophy">
      <blockquote className="philosophy__quote">
        « Nous croyons que l'enfance doit être remplie de{" "}
        <strong>simplicité</strong> et de <strong>qualité</strong>. Nos pièces
        sont conçues pour être chéries pendant des années. »
      </blockquote>

      <div className="philosophy__pillars">
        <div className="pillar">
          <h3 className="pillar__title">La Qualité Avant Tout</h3>
          <p className="pillar__text">
            Matériaux biologiques certifiés, sourcés avec respect pour la
            nature.
          </p>
        </div>
        <div className="pillar">
          <h3 className="pillar__title">Style Intemporel</h3>
          <p className="pillar__text">
            Des designs modernes et neutres qui résistent aux tendances.
          </p>
        </div>
        <div className="pillar">
          <h3 className="pillar__title">Fait par des Artisans</h3>
          <p className="pillar__text">
            Fabriqué dans des ateliers patrimoniaux pour garantir une valeur
            durable.
          </p>
        </div>
      </div>
    </section>
  );
}
