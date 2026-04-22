import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Sparkles, Loader2, Star, AlertCircle, TrendingUp, MessageSquare, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const API_ENDPOINT = "https://dev4zz-proyek-sains-data.hf.space/analyze";
const ERROR_MESSAGE = "Gagal mengambil data, pastikan link Google Maps benar atau coba lagi nanti";

type AspectScore = { name: string; positive: number; neutral: number; negative: number };
type ApiReview = { nama: string; rating: number; teks: string };
type ApiRecommendation = { judul: string; deskripsi: string; prioritas: string };
type Analysis = {
  overall_sentiment: { positive: number; neutral: number; negative: number };
  sentiment_score: AspectScore[];
  kata_kunci: { positif: string[]; negatif: string[] };
  contoh_review: ApiReview[];
  rekomendasi_list: ApiRecommendation[];
};

const priorityStyles = (priority: string): string => {
  const p = priority.toLowerCase();
  if (p === "high") return "bg-destructive/15 text-destructive border-destructive/30";
  if (p === "medium") return "bg-yellow-500/15 text-yellow-500 border-yellow-500/30";
  if (p === "low") return "bg-green-500/15 text-green-500 border-green-500/30";
  return "bg-muted text-muted-foreground border-border";
};

const reviewSentiment = (rating: number): "positive" | "negative" | "neutral" => {
  if (rating >= 4) return "positive";
  if (rating <= 2) return "negative";
  return "neutral";
};

const PROGRESS_STEPS = [
  { at: 0, msg: "Sedang mengekstraksi ulasan Google Maps melalui Apify..." },
  { at: 20000, msg: "Sedang menganalisis sentimen aspek dengan mDeBERTa-v3..." },
  { at: 45000, msg: "Sedang menyusun rekomendasi bisnis dengan Gemini AI..." },
];

const Analyze = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Analysis | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const [progressMsg, setProgressMsg] = useState(PROGRESS_STEPS[0].msg);

  useEffect(() => {
    if (!loading) return;
    setProgressMsg(PROGRESS_STEPS[0].msg);
    const timers = PROGRESS_STEPS.slice(1).map((s) =>
      setTimeout(() => setProgressMsg(s.msg), s.at)
    );
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed.match(/^https?:\/\//)) {
      toast({ title: "URL tidak valid", description: "Mohon masukkan link Google Maps yang benar.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setData(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("HTTP error");
      const res = await response.json();
      if (res?.status !== "success" || !res?.analysis) {
        throw new Error(res?.message || "API error");
      }
      const name = hint.trim() || "Restoran Dianalisis";
      setDisplayName(name);
      setDisplayUrl(trimmed);
      setData(res.analysis as Analysis);
      toast({ title: "Analisis selesai", description: `Berhasil menganalisis ${name}` });
    } catch (err) {
      toast({ title: "Gagal menganalisis", description: ERROR_MESSAGE, variant: "destructive" });
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="container mx-auto px-4 py-10 relative">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
        </Link>

        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Smart-AYCE Analyzer · Powered by ML
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-5 tracking-tight">
            Analisis <span className="text-gradient-warm">Review Google Maps</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Tempel link Google Maps restoran AYCE — sistem akan menganalisis sentimen, aspek layanan, dan menyusun rekomendasi peningkatan.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto glass rounded-2xl p-6 shadow-elegant space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Link Google Maps
            </label>
            <Input
              type="url"
              required
              placeholder="https://maps.app.goo.gl/1nEqRC3zkvtWT3vN8"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-secondary/50 border-border h-12"
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 block">
              Nama restoran (opsional, untuk akurasi)
            </label>
            <Input
              placeholder="Contoh: Mr Sumo - Merr Surabaya"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              className="bg-secondary/50 border-border h-12"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-warm text-primary-foreground hover:opacity-90 shadow-glow">
            {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menganalisis review...</>) : (<><Sparkles className="mr-2 h-4 w-4" /> Mulai Analisis</>)}
          </Button>
        </form>

        {loading && !data && (
          <div className="max-w-3xl mx-auto mt-8 glass rounded-2xl p-8 text-center">
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary mb-4" />
            <p className="font-display text-lg">Sedang memproses...</p>
            <p className="text-sm text-muted-foreground mt-2">Model ML sedang menganalisis sentimen, ekstraksi aspek, dan menyusun rekomendasi.</p>
          </div>
        )}

        {data && (
          <div className="max-w-6xl mx-auto mt-10 space-y-6 animate-fade-up">
            {/* Restaurant header */}
            <div className="glass rounded-2xl p-6 md:p-8 shadow-elegant">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge className="bg-gradient-tech text-primary-foreground border-0 mb-3">{data.restaurant.type}</Badge>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">{data.restaurant.name}</h2>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1.5"><MapPin className="h-4 w-4" />{data.restaurant.location}</p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-display text-3xl font-bold">{data.restaurant.estimated_rating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Rating Google</p>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold text-gradient-warm">{data.restaurant.estimated_reviews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total review</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment overview */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Positif", value: data.sentiment.positive, color: "bg-gradient-warm" },
                { label: "Netral", value: data.sentiment.neutral, color: "bg-muted" },
                { label: "Negatif", value: data.sentiment.negative, color: "bg-destructive" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-6">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="font-display text-4xl font-bold mt-2">{s.value}%</p>
                  <div className="h-2 rounded-full bg-secondary mt-3 overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Aspects */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" /> Sentimen per Aspek Layanan
              </h3>
              <div className="space-y-5">
                {data.aspects.map((a) => (
                  <div key={a.name}>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <span className="font-medium capitalize">{a.name.replace(/_/g, " ")}</span>
                      <span className="font-mono text-xs text-muted-foreground">{a.positive}% positif · {a.negative}% negatif</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden flex bg-secondary">
                      <div className="bg-gradient-warm h-full" style={{ width: `${a.positive}%` }} />
                      <div className="bg-muted h-full" style={{ width: `${a.neutral}%` }} />
                      <div className="bg-destructive h-full" style={{ width: `${a.negative}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 italic">{a.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold mb-4 text-primary">Kata Kunci Positif</h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.positive.map((k) => (
                    <Badge key={k} className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20">{k}</Badge>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold mb-4 text-destructive">Kata Kunci Negatif</h3>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.negative.map((k) => (
                    <Badge key={k} className="bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20">{k}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample reviews */}
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary" /> Contoh Review
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.sample_reviews.map((r, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${r.sentiment === "positive" ? "border-primary/30 bg-primary/5" : r.sentiment === "negative" ? "border-destructive/30 bg-destructive/5" : "border-border bg-secondary/30"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{r.author}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-3 w-3 ${idx < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass rounded-2xl p-6 md:p-8 shadow-elegant">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                <Lightbulb className="h-5 w-5 text-primary" /> Rekomendasi Peningkatan Layanan
              </h3>
              <div className="space-y-4">
                {data.recommendations.map((r, i) => (
                  <div key={i} className="rounded-xl p-5 bg-secondary/40 border border-border hover:border-primary/40 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-warm grid place-items-center font-display font-bold text-primary-foreground shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-display font-semibold">{r.title}</h4>
                          <Badge className={`border ${priorityStyles[r.priority]} capitalize`}>{r.priority} priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                        <p className="text-xs text-primary mt-2 flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> {r.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <AlertCircle className="h-3 w-3" /> Hasil analisis dihasilkan oleh model ML berdasarkan pola review publik dan dapat berbeda dari kondisi aktual.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Analyze;
