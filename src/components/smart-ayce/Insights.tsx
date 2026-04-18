import { TrendingUp } from "lucide-react";

const aspects = [
  { name: "Kualitas Makanan", positive: 82, neutral: 12, negative: 6 },
  { name: "Pelayanan Staff", positive: 71, neutral: 18, negative: 11 },
  { name: "Kebersihan", positive: 68, neutral: 20, negative: 12 },
  { name: "Variasi Menu", positive: 76, neutral: 15, negative: 9 },
  { name: "Waktu Tunggu", positive: 48, neutral: 22, negative: 30 },
  { name: "Harga", positive: 65, neutral: 23, negative: 12 },
];

export const Insights = () => (
  <section id="insights" className="py-24 relative">
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
          <TrendingUp className="h-4 w-4" />
          Contoh Insight
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 tracking-tight">
          Sentimen per <span className="text-gradient-warm">aspek layanan</span>.
        </h2>
        <p className="mt-5 text-muted-foreground">
          Data simulasi hasil model Smart-AYCE pada dataset 12.000+ ulasan restoran AYCE di Jakarta.
        </p>
      </div>

      <div className="glass rounded-3xl p-8 md:p-10 max-w-4xl mx-auto shadow-elegant">
        <div className="space-y-6">
          {aspects.map((a) => (
            <div key={a.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{a.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {a.positive}% positif · {a.negative}% negatif
                </span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
                <div className="bg-gradient-warm h-full transition-all" style={{ width: `${a.positive}%` }} />
                <div className="bg-muted h-full" style={{ width: `${a.neutral}%` }} />
                <div className="bg-destructive h-full" style={{ width: `${a.negative}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="font-display text-3xl font-bold text-gradient-warm">+18%</div>
            <div className="text-xs text-muted-foreground mt-1">peningkatan rating setelah implementasi</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-gradient-warm">-42%</div>
            <div className="text-xs text-muted-foreground mt-1">keluhan waktu tunggu</div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-gradient-warm">3x</div>
            <div className="text-xs text-muted-foreground mt-1">lebih cepat respons review</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
