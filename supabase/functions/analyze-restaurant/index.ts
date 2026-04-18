import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Anda adalah Smart-AYCE, sistem analisis Machine Learning yang menganalisis review Google Maps restoran All You Can Eat (AYCE) di Indonesia.

Tugas: Berdasarkan URL Google Maps dan/atau nama restoran yang diberikan user, hasilkan analisis komprehensif yang REALISTIS dan PROFESIONAL. Gunakan pengetahuan umum Anda tentang restoran tersebut (jika dikenal) atau buat simulasi yang masuk akal untuk restoran AYCE pada umumnya.

Hasilkan analisis berbahasa Indonesia yang mencakup:
1. Identifikasi restoran (nama, lokasi perkiraan, jenis AYCE: yakiniku/shabu/sushi/dll)
2. Estimasi total review dan rating rata-rata
3. Distribusi sentimen (positif, netral, negatif)
4. Analisis 6 aspek layanan: kualitas_makanan, pelayanan, kebersihan, harga, variasi_menu, waktu_tunggu (skor positive/neutral/negative dalam %)
5. Top kata kunci yang sering muncul (positif & negatif)
6. 3 contoh review positif dan 3 contoh review negatif yang realistis
7. 5 rekomendasi peningkatan layanan yang prioritas, actionable, dan spesifik

Gunakan tool 'return_analysis' untuk mengembalikan hasil terstruktur.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url, hint } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL diperlukan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY tidak dikonfigurasi");

    const userPrompt = `URL Google Maps: ${url}${hint ? `\nPetunjuk nama restoran: ${hint}` : ""}\n\nLakukan analisis Smart-AYCE lengkap.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_analysis",
              description: "Mengembalikan hasil analisis Smart-AYCE terstruktur",
              parameters: {
                type: "object",
                properties: {
                  restaurant: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      location: { type: "string" },
                      type: { type: "string", description: "Jenis AYCE: yakiniku/shabu/sushi/buffet/dll" },
                      estimated_rating: { type: "number", description: "Rating Google 1-5" },
                      estimated_reviews: { type: "number", description: "Estimasi total review" },
                    },
                    required: ["name", "location", "type", "estimated_rating", "estimated_reviews"],
                    additionalProperties: false,
                  },
                  sentiment: {
                    type: "object",
                    properties: {
                      positive: { type: "number" },
                      neutral: { type: "number" },
                      negative: { type: "number" },
                    },
                    required: ["positive", "neutral", "negative"],
                    additionalProperties: false,
                  },
                  aspects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        positive: { type: "number" },
                        neutral: { type: "number" },
                        negative: { type: "number" },
                        summary: { type: "string", description: "1 kalimat insight" },
                      },
                      required: ["name", "positive", "neutral", "negative", "summary"],
                      additionalProperties: false,
                    },
                  },
                  keywords: {
                    type: "object",
                    properties: {
                      positive: { type: "array", items: { type: "string" } },
                      negative: { type: "array", items: { type: "string" } },
                    },
                    required: ["positive", "negative"],
                    additionalProperties: false,
                  },
                  sample_reviews: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
                        rating: { type: "number" },
                        author: { type: "string" },
                      },
                      required: ["text", "sentiment", "rating", "author"],
                      additionalProperties: false,
                    },
                  },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        impact: { type: "string", description: "Estimasi dampak" },
                      },
                      required: ["title", "description", "priority", "impact"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["restaurant", "sentiment", "aspects", "keywords", "sample_reviews", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Terlalu banyak permintaan. Coba beberapa saat lagi." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredit AI habis. Tambahkan kredit di Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Gagal menghubungi AI." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Tidak ada hasil terstruktur dari AI." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-restaurant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
