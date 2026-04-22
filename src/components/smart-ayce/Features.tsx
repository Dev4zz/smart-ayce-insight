import { Gauge, Tags, LineChart } from "lucide-react";

const features = [
  { icon: Gauge, title: "Dashboard Real-time", desc: "Pantau sentimen pelanggan harian dengan visualisasi interaktif." },
  { icon: Tags, title: "Aspect-Based Analysis", desc: "Pisahkan opini per aspek: Kualitas Makanan, Pelayanan, Kebersihan, Harga, Variasi Menu, Waktu Tunggu." },
  { icon: LineChart, title: "Rekomendasi Aksi", desc: "Action items prioritas berbasis dampak terhadap kepuasan." },
];

export const Features = () => (
  <section id="features" className="py-24">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mb-14">
        <span className="text-xs font-mono uppercase tracking-wider text-primary">Fitur Sistem</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 tracking-tight">
          Semua yang dibutuhkan untuk <span className="text-gradient-warm">memahami pelanggan</span>.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative glass rounded-2xl p-6 overflow-hidden hover:border-primary/40 transition-all"
          >
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-warm opacity-0 group-hover:opacity-20 blur-2xl transition-opacity" />
            <div className="relative">
              <f.icon className="h-7 w-7 text-primary mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
