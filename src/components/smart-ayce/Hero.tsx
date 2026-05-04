import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-smart-ayce.jpg";

export const Hero = () => (
  <section id="top" className="relative pt-36 pb-24 overflow-hidden">
    <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
    <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

    <div className="container mx-auto px-4 relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Riset Machine Learning · NLP · Sentiment Analysis
          </span>

          <h1 className="font-display mt-6 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Mengubah <span className="text-gradient-warm">Review Google Maps</span> menjadi Rekomendasi Layanan AYCE.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Smart-AYCE memanfaatkan Machine Learning untuk menambang ribuan ulasan pelanggan
            restoran All You Can Eat — mengidentifikasi pola keluhan, kekuatan layanan,
            dan rekomendasi peningkatan yang dapat ditindaklanjuti.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow group">
              <Link to="/analyze">
                Coba Analyzer Sekarang
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass border-border">
              <a href="#methodology">Baca Metodologi</a>
            </Button>
          </div>

        <div className="relative animate-fade-up [animation-delay:200ms]">
          <div className="absolute -inset-6 bg-gradient-hero opacity-30 blur-3xl rounded-full animate-pulse-glow" />
          <div className="relative glass rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={heroImage}
              alt="Visualisasi machine learning menganalisis review restoran AYCE"
              width={1536}
              height={1024}
              className="w-full h-auto"
            />
            <div className="absolute top-4 left-4 glass rounded-xl px-3 py-2 flex items-center gap-2 animate-float-slow">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-xs font-medium">Sentiment: Positive 78%</span>
            </div>
            <div className="absolute bottom-4 right-4 glass rounded-xl px-3 py-2 animate-float-slow [animation-delay:1.5s]">
              <span className="text-xs text-muted-foreground">Topic:</span>{" "}
              <span className="text-xs font-mono font-medium text-accent">#kualitas-makanan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
