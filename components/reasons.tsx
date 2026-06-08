const reasons = [
  {
    heading: "Qualité premium",
    text: "Des produits soigneusement sélectionnés, fiables et durables pour votre bébé.",
    image: "/hero-image.png",
    alt: "Produits de soin pour bébé",
  },
  {
    heading: "Livraison rapide",
    text: "Expédition rapide partout en Algérie pour vous simplifier le quotidien.",
    image: "/reasons.png",
    alt: "Main de bébé sur un textile doux",
  },
  {
    heading: "Service humain",
    text: "Une équipe disponible pour vous conseiller avant et après votre commande.",
    image: "/reason2.png",
    alt: "Chambre bébé calme et rassurante",
  },
  {
    heading: "Paiement sécurisé",
    text: "Un parcours d'achat simple et sécurisé, pensé pour votre tranquillité.",
    image: "/reason3.jpg",
    alt: "Produits alignés représentant la confiance",
  },
];

export default function Reasons() {
  return (
    <section className="reasons" aria-labelledby="reasons-title">
      <h2 id="reasons-title" className="reasons__title">
        Pourquoi choisir Maxi Chazen ?
      </h2>

      <div className="reasons__grid">
        {reasons.map((reason) => (
          <article key={reason.heading} className="reason-card">
            <img
              className="reason-card__image"
              src={reason.image}
              alt={reason.alt}
            />
            <div className="reason-card__overlay" />
            <div className="reason-card__content">
              <h3 className="reason-card__title">{reason.heading}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
