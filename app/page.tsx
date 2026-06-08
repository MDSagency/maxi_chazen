import Hero from "@/components/Hero";
import BrandSections from "@/components/BrandSections";
import Categories from "@/components/Categories";
import Reasons from "@/components/reasons";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandSections />
      <Suspense fallback={<section className="page-loader-wrap" />}>
        <Categories />
        <Reasons />
      </Suspense>
    </>
  );
}
