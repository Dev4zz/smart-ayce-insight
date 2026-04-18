import { Database, Filter, Cpu, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Database,
    tag: "01 · Data Acquisition",
    title: "Scraping Review Google Maps",
    desc: "Mengumpulkan ulasan, rating, dan metadata waktu dari restoran AYCE target menggunakan Google Places API.",
  },
  {
    icon: Filter,
    tag: "02 · Preprocessing",
    title: "Cleaning & Tokenisasi",
    desc: "Normalisasi teks Bahasa Indonesia, stopword removal, stemming Sastrawi, dan deteksi bahasa.",
  },
  {
    icon: Cpu,
    tag: "03 · Modeling",
    title: "Sentiment & Topic Modeling",
    desc: "IndoBERT untuk klasifikasi sentimen + LDA / BERTopic untuk ekstraksi aspek layanan.",
  },
  {
    icon: BarChart3,
    tag: "04 · Evaluation",
    title: "Validasi Akurasi",
    desc: "Pengujian dengan F1-score, precision-recall, dan validasi pakar industri kuliner.",
  },
  {
    icon: Lightbulb,
    tag: "05 · Recommendation",
    title: "Generasi Rekomendasi",
    desc: "Rule-based + LLM untuk mengubah temuan menjadi action item peningkatan layanan.",
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
