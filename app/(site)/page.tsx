import Hero from "@/components/home/Hero";
import NotreHistoire from "@/components/home/NotreHistoire";
import HashScrollHandler from "@/components/motion/HashScrollHandler";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import LifestyleGallery from "@/components/home/LifestyleGallery";
import Benefits from "@/components/home/Benefits";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HashScrollHandler />
      <Hero />
      <NotreHistoire />
      <FeaturedProducts />
      <CategoryShowcase />
      <LifestyleGallery />
      <Benefits />
      <Testimonials />
      <Newsletter />
    </>
  );
}
