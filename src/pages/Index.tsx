import { Navbar } from "@/components/smart-ayce/Navbar";
import { Hero } from "@/components/smart-ayce/Hero";
import { Problem } from "@/components/smart-ayce/Problem";
import { Methodology } from "@/components/smart-ayce/Methodology";
import { Features } from "@/components/smart-ayce/Features";
import { Insights } from "@/components/smart-ayce/Insights";
import { CTA, Footer } from "@/components/smart-ayce/CTA";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Problem />
      <Methodology />
      <Features />
      <Insights />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
