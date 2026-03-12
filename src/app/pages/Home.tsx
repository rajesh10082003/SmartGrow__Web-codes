import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { HowItWorks } from "../components/HowItWorks";

export function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
    </>
  );
}