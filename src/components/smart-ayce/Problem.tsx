import { AlertCircle, MessageSquareWarning, TrendingDown, Search } from "lucide-react";

const points = [
  {
    icon: MessageSquareWarning,
    title: "Volume review yang masif",
    desc: "Ribuan ulasan Google Maps tidak mungkin dibaca manual oleh manajemen restoran setiap hari.",
  },
  {
    icon: Search,
    title: "Insight tersembunyi",
    desc: "Pola keluhan tentang antrian, kebersihan, atau variasi menu sulit dipetakan tanpa NLP.",
  },
  {
    icon: TrendingDown,
    title: "Penurunan rating senyap",
    desc: "Rating turun perlahan tanpa diketahui akar penyebabnya — sampai pelanggan benar-benar pergi.",
  },
];

export const Problem = () => (
  <section id="problem" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
          <AlertCircle className="h-4 w-4" />
          Latar Belakang
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 tracking-tight">
          Restoran AYCE kehilangan <span className="text-gradient-warm">suara pelanggan</span>.
        </h2>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Industri All You Can Eat tumbuh pesat, namun feedback pelanggan tersebar di kolom review
          tanpa sistem yang mampu menyaringnya menjadi keputusan operasional.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {points.map((p, i) => (
          <div
            key={p.title}
            className="group glass rounded-2xl p-7 hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-glow"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center mb-5 group-hover:bg-gradient-warm transition-colors">
              <p.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
