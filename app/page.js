import Hero from "./_components/Hero";
import FeatureSection from "./_components/FeatureSection";
import StepsSection from "./_components/StepsSection";
import TestimonialSection from "./_components/TestimonialSection";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="max-w-[1376px] px-5 md:px-8 mx-auto min-h-screen">
      <Hero />
      <FeatureSection />
      <StepsSection />
      <TestimonialSection />
      <Footer />
    </div>
  );
  s;
}
