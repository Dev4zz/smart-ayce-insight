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
  { at: 20000, msg: "Sedang menganalisis sentimen aspek dengan model nlptown/bert..." },
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
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 menit timeout

    try {
      console.log("Memulai request ke backend...");
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const res = await response.json();
      console.log("Response Backend Diterima:", res);

      if (res?.status === "success" && res?.analysis) {
        const name = hint.trim() || "Restoran Dianalisis";
        setDisplayName(name);
        setDisplayUrl(trimmed);
        setData(res.analysis as Analysis);
        toast({ title: "Analisis selesai", description: `Berhasil menganalisis ${name}` });
      } else {
        // Tampilkan pesan spesifik dari backend jika ada (misal: "Link salah")
        throw new Error(res?.message || "Format data API tidak valid.");
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      let finalMessage = ERROR_MESSAGE;
      
      if (err.name === 'AbortError') {
        finalMessage = "Proses terlalu lama (Timeout). Server sedang sibuk, coba lagi nanti.";
      } else if (err.message) {
        finalMessage = err.message;
      }

      toast({ 
        title: "Gagal menganalisis", 
        description: finalMessage, 
        variant: "destructive" 
      });
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
              placeholder="https://maps.app.goo.gl/..."
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
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menganalisis review...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Mulai Analisis</>
            )}
          </Button>
        </form>

        {data && (
          <div className="max-w-6xl mx-auto mt-10 space-y-6 animate-fade-up">
            <div className="glass rounded-2xl p-6 md:p-8 shadow-elegant">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge className="bg-gradient-tech text-primary-foreground border-0 mb-3">Hasil Analisis</Badge>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">{displayName}</h2>
                  <a
                    href={displayUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs hover:text-primary break-all"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate max-w-[60ch]">{displayUrl}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Positif", value: data.overall_sentiment.positive, color: "bg-gradient-warm" },
                { label: "Netral", value: data.overall_sentiment.neutral, color: "bg-muted" },
                { label: "Negatif", value: data.overall_sentiment.negative, color: "bg-destructive" },
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

            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" /> Sentimen per Aspek Layanan
              </h3>
              <div className="space-y-5">
                {data.sentiment_score.map((a) => (
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
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold mb-4 text-primary">Kata Kunci Positif</h3>
                <div className="flex flex-wrap gap-2">
                  {data.kata_kunci.positif.map((k) => (
                    <Badge key={k} className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20">{k}</Badge>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold mb-4 text-destructive">Kata Kunci Negatif</h3>
                <div className="flex flex-wrap gap-2">
                  {data.kata_kunci.negatif.map((k) => (
                    <Badge key={k} className="bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20">{k}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary" /> Contoh Review
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.contoh_review.map((r, i) => {
                  const sentiment = reviewSentiment(r.rating);
                  return (
                    <div key={i} className={`rounded-xl p-4 border ${sentiment === "positive" ? "border-primary/30 bg-primary/5" : sentiment === "negative" ? "border-destructive/30 bg-destructive/5" : "border-border bg-secondary/30"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{r.nama}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`h-3 w-3 ${idx < r.rating ? "fill-primary text-primary" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">"{r.teks}"</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-6 md:p-8 shadow-elegant">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2 mb-6">
                <Lightbulb className="h-5 w-5 text-primary" /> Rekomendasi Peningkatan Layanan
              </h3>
              <div className="space-y-4">
                {data.rekomendasi_list.map((r, i) => (
                  <div key={i} className="rounded-xl p-5 bg-secondary/40 border border-border hover:border-primary/40 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-warm grid place-items-center font-display font-bold text-primary-foreground shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-display font-semibold">{r.judul}</h4>
                          <Badge className={`border ${priorityStyles(r.prioritas)} capitalize`}>{r.prioritas} priority</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{r.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <AlertCircle className="h-3 w-3" /> Hasil analisis dihasilkan oleh model ML berdasarkan ulasan publik dan dapat berbeda dari kondisi aktual.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center px-4">
            <div className="glass rounded-2xl p-8 md:p-10 max-w-md w-full text-center shadow-elegant">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-5" />
              <p className="font-display text-lg mb-2">Menganalisis review...</p>
              <p className="text-sm text-muted-foreground leading-relaxed transition-opacity duration-300">
                {progressMsg}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-4 font-mono">Proses dapat memakan waktu hingga 2 menit</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Analyze;
