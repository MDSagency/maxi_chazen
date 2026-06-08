import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Benefits from "@/components/home/Benefits";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStory />
      <FeaturedProducts />
      <CategoryShowcase />
      <Benefits />
      <Testimonials />
      <Newsletter />
    </>
  );
}
