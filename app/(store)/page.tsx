import { HeroBanner } from "@/components/sections/hero-banner";
import { CategoryGrid } from "@/components/sections/category-grid";
import { FeaturedProducts } from "@/components/sections/featured-products";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
    </>
  );
}
