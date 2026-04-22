

## Integrasi Halaman Analyze dengan API Backend (Skema Final)

User memberi source code FastAPI backend (`app.py`). Saya akan menyesuaikan `src/pages/Analyze.tsx` agar fetch ke endpoint asli dan memetakan respons sesuai skema persis yang dikembalikan backend.

### 1. Pemanggilan API

Di `src/pages/Analyze.tsx`, ganti `supabase.functions.invoke("analyze-restaurant", ...)` dengan `fetch` langsung:

- Endpoint: `POST https://dev4zz-proyek-sains-data.hf.space/analyze`
- Header: `Content-Type: application/json`
- Body: `{ "url": "<link Google Maps user>" }`
- Timeout sisi klien: `AbortController` 180 detik (Apify scraping + mDeBERTa + Gemini bisa lama)
- Cek `res.status === "success"`; kalau `"error"` → lempar `res.message`

### 2. Skema Respons Backend (Persis)

```text
{
  "status": "success",
  "analysis": {
    "overall_sentiment": { "positive": 70.5, "neutral": 20.0, "negative": 9.5 },
    "sentiment_score": [
      { "name": "Kualitas Makanan", "positive": 80, "neutral": 10, "negative": 10 },
      { "name": "Pelayanan", ... },
      { "name": "Kebersihan", ... },
      { "name": "Harga", ... },
      { "name": "Variasi Menu", ... },
      { "name": "Waktu Tunggu", ... }
    ],
    "kata_kunci": {
      "positif": ["enak", "ramah", ...],
      "negatif": ["lama", "mahal", ...]
    },
    "contoh_review": [
      { "nama": "Budi", "rating": 5, "teks": "..." }
    ],
    "rekomendasi_list": [
      { "judul": "...", "deskripsi": "...", "prioritas": "High" }
    ]
  }
}
```

### 3. Pemetaan ke Dashboard

- **Header hasil**: tampilkan `Nama Tempat` dari input user (`hint`) sebagai judul utama (fallback "Restoran Dianalisis"). URL Google Maps ditampilkan kecil di bawah.
- **Sentiment overview (3 kartu)**: pakai `overall_sentiment.positive / neutral / negative` (bertahan dari versi lama, datanya kini dari API).
- **Grafik aspek**: iterasi langsung `sentiment_score[]` (sudah array of `{name, positive, neutral, negative}`). Bar gradient warm / muted / destructive — komponen visual dipertahankan.
- **Keywords**: `kata_kunci.positif` & `kata_kunci.negatif` → render badge positif/negatif (section keywords dipertahankan).
- **Contoh review**: `contoh_review[]` → map `{ nama → author, rating → rating, teks → text }`. Sentimen kartu (border warna) dihitung dari rating: `rating >= 4` positive, `rating <= 2` negative, lainnya neutral.
- **Rekomendasi**: `rekomendasi_list[]` → map `{ judul → title, deskripsi → description, prioritas → priority }`. Priority badge warna otomatis:
  - `High` → merah (`bg-destructive/15 text-destructive`)
  - `Medium` → kuning (`bg-yellow-500/15 text-yellow-500 border-yellow-500/30`)
  - `Low` → hijau (`bg-green-500/15 text-green-500 border-green-500/30`)
  - Matching case-insensitive.
- **Dihapus** dari UI lama: kartu rating Google + total review (tidak ada di respons API).

### 4. Loading & Progress UX

- Tombol disable + spinner di dalamnya saat loading.
- Loading overlay full-screen (`fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center`) dengan spinner besar + pesan progres berganti otomatis via `setInterval`/`setTimeout`:
  - 0 dtk: **"Sedang mengekstraksi ulasan Google Maps melalui Apify..."**
  - 20 dtk: **"Sedang menganalisis sentimen aspek dengan mDeBERTa-v3..."**
  - 45 dtk: **"Sedang menyusun rekomendasi bisnis dengan Gemini AI..."**
- Dashboard hasil hanya dirender setelah fetch sukses & state `data` terisi.

### 5. Error Handling

- Validasi URL diawali `http(s)://` (sudah ada).
- Jika `!response.ok`, JSON tidak valid, `AbortError` (timeout), `res.status === "error"`, atau network error → toast destructive dengan pesan **persis**:
  `"Gagal mengambil data, pastikan link Google Maps benar atau coba lagi nanti"`
- Reset state loading & timer pesan progres di `finally`.

### 6. File yang Diubah

- `src/pages/Analyze.tsx` — rewrite logic fetch, ganti tipe `Analysis` mengikuti skema backend, mapping field baru, loading overlay 3-tahap, badge priority dinamis, hapus kartu rating/total review.

Edge function `supabase/functions/analyze-restaurant/index.ts` tidak dipanggil lagi (dibiarkan, bisa dihapus terpisah jika diinginkan).

