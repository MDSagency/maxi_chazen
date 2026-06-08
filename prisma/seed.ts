import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const DEFAULT_WEBSITE_CONTENT = {
  hero: {
    eyebrow: "Soins premium pour bébé",
    title: "L'essentiel pour une enfance apaisée.",
    description:
      "Des soins doux, sûrs et élégants — formulés pour la peau délicate de votre bébé.",
    ctaPrimary: "Découvrir la collection",
    ctaSecondary: "Notre histoire",
    imageUrl: "/images/unnamed1.jpg",
    stats: [
      { value: "4.9", label: "Note clients" },
      { value: "100%", label: "Testé dermatologiquement" },
      { value: "48h", label: "Livraison Algérie" },
    ],
  },
  banners: [
    {
      id: "banner-1",
      title: "Nouvelle collection",
      subtitle: "Soins délicats pour les premiers mois",
      imageUrl: "/images/unnamed.jpg",
      link: "/products",
      active: true,
    },
  ],
  histoire: {
    eyebrow: "Notre histoire",
    title: "Une maison née de la tendresse",
    paragraphs: [
      "Maxi Chazen est née d'une conviction simple : chaque bébé mérite des soins d'une pureté absolue.",
    ],
    imageUrl: "/images/unnamed1.jpg",
  },
  testimonials: [
    {
      id: "t1",
      name: "Amira B.",
      location: "Alger",
      quote: "Des produits d'une douceur remarquable.",
      rating: 5,
    },
  ],
  homepage_images: {
    lifestyle: ["/images/unnamed.jpg", "/images/unnamed1.jpg", "/images/unnamed2.jpg"],
  },
  footer: {
    tagline: "Soins premium pour bébé — formulés avec douceur et rigueur.",
    copyright: "© Maxi Chazen. Tous droits réservés.",
  },
  contact: {
    email: "contact@maxichazen.dz",
    phone: "+213 555 000 000",
    address: "Alger, Algérie",
    hours: "Lun–Sam, 9h–18h",
  },
};

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@maxichazen.dz").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Baby+Care2026";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name: "Administrateur" },
    create: {
      email,
      name: "Administrateur",
      passwordHash,
    },
  });

  const categories = [
    { name: "Soins Délicats", slug: "soins-delicats", sortOrder: 1 },
    { name: "Hygiène", slug: "hygiene", sortOrder: 2 },
    { name: "Protection", slug: "protection", sortOrder: 3 },
    { name: "Nouveautés", slug: "nouveautes", sortOrder: 4 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const [section, content] of Object.entries(DEFAULT_WEBSITE_CONTENT)) {
    await prisma.websiteContent.upsert({
      where: { section },
      update: { content },
      create: { section, content },
    });
  }

  console.log("Seed completed.");
  console.log(`Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
