import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTA = () => (
  <section className="py-24">
    <div className="container mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl glass p-10 md:p-16 text-center shadow-elegant">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 bg-primary/40 rounded-full blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Siap menjadikan setiap review sebagai <span className="text-gradient-warm">peluang peningkatan</span>?
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Berkolaborasi dalam riset Smart-AYCE atau implementasikan sistem ini untuk restoran Anda.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow group">
              Mulai Demo Gratis
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="glass border-border">
              <Mail className="mr-2 h-4 w-4" /> Hubungi Tim Riset
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="border-t border-border/50 py-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Smart-AYCE Research. All rights reserved.</p>
      <p className="font-mono text-xs">ML · NLP · Sentiment Analysis · Topic Modeling</p>
    </div>
  </footer>
);
