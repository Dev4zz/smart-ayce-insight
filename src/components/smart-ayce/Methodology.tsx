import { Database, Filter, Cpu, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Database,
    tag: "01 · Data Acquisition",
    title: "Apify Google Maps Scraper",
    desc: "Integrasi dengan Apify Google Maps Scraper untuk ekstraksi ulasan secara real-time berbasis URL yang diinput pengguna.",
  },
  {
    icon: Filter,
    tag: "02 · Preprocessing",
    title: "Normalisasi & Deteksi Bahasa",
    desc: "Normalisasi teks, pembersihan noise, dan deteksi bahasa untuk memastikan data siap diolah oleh model Transformer.",
  },
  {
    icon: Cpu,
    tag: "03 · Modeling",
    title: "mDeBERTa-v3 Zero-Shot Classification",
    desc: "Implementasi mDeBERTa-v3 dengan teknik Zero-Shot Classification untuk analisis sentimen dan pemetaan aspek layanan secara otomatis.",
  },
  {
    icon: BarChart3,
    tag: "04 · Evaluation",
    title: "Akurasi & Prioritas Masalah",
    desc: "Validasi hasil klasifikasi menggunakan matriks akurasi dan pemetaan prioritas masalah (High/Medium/Low) berdasarkan ambang batas keluhan.",
  },
  {
    icon: Lightbulb,
    tag: "05 · AI-Driven Recommendation",
    title: "Gemini 1.5 Flash Recommendation",
    desc: "Implementasi Gemini 1.5 Flash untuk menghasilkan saran bisnis kontekstual dan profesional, yang diintegrasikan dengan data prioritas dari tahap evaluasi guna menciptakan strategi perbaikan yang spesifik.",
  },
];

export const Methodology = () => (
  <section id="methodology" className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />
    <div className="container mx-auto px-4 relative">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent">
          <Cpu className="h-4 w-4" />
          Metodologi
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 tracking-tight">
          Pipeline <span className="text-gradient-warm">Machine Learning</span> end-to-end.
        </h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Dari teks mentah review hingga rekomendasi siap eksekusi — lima tahap berurutan
          yang memastikan setiap insight valid dan dapat ditindaklanjuti.
        </p>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="space-y-8">
          {steps.map((s, i) => (
            <div
              key={s.tag}
              className={`grid lg:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={`glass rounded-2xl p-7 ${i % 2 === 1 ? "lg:ml-12" : "lg:mr-12"}`}>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-tech grid place-items-center shadow-tech shrink-0">
                    <s.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-primary mb-1">{s.tag}</div>
                    <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              <div className="hidden lg:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
