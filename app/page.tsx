import { FeaturedProducts } from "components/homepage/featured-products";
import { HeroBanner } from "components/homepage/hero-banner";
import { MissionBanner } from "components/homepage/mission-banner";
import { MissionSection } from "components/homepage/mission-section";
import { ReviewsCarousel } from "components/homepage/reviews-carousel";
import { ShopByCollection } from "components/homepage/shop-by-collection";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Sustainable, eco-friendly products and subscription plans for everyday living.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <MissionSection />
      <FeaturedProducts />
      <ShopByCollection />
      <ReviewsCarousel />
      <MissionBanner />
      <Footer />
    </>
  );
}
