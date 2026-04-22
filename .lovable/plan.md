

## Bersihkan Sisa Kode Dummy + Panduan GitHub Baru

### Bagian 1 — Hapus edge function lama yang sudah tidak dipakai

File `supabase/functions/analyze-restaurant/index.ts` adalah edge function dummy lama (generate data fiktif via Gemini). Halaman `Analyze.tsx` **sudah tidak memanggilnya lagi** sejak integrasi ke API Hugging Face Space. File ini cuma "nyantol" di codebase dan tetap ke-deploy ke Lovable Cloud.

**Yang akan dilakukan:**
- Hapus edge function `analyze-restaurant` dari Lovable Cloud (sekaligus menghapus folder `supabase/functions/analyze-restaurant/` dari kode).
- Tidak ada referensi lain yang perlu diubah — sudah dikonfirmasi via search bahwa string `analyze-restaurant` hanya muncul di file itu sendiri.

**Hasil:** Codebase bersih, hanya ada 1 sumber kebenaran untuk analisis (API Hugging Face Space asli).

### Bagian 2 — Panduan membuat GitHub repo baru (tidak butuh perubahan kode)

Lovable saat ini **belum mendukung "ganti repo" otomatis** dari satu project. Tapi ada 2 cara supaya code lama tidak menumpuk:

**Opsi A — Disconnect & Connect ulang ke repo baru (rekomendasi)**
1. Di Lovable, buka **Connectors** (sidebar kiri root) → **GitHub**.
2. Klik **Disconnect** dari repo lama.
3. Klik **Connect** lagi → pilih akun/organisasi GitHub → **Create Repository** dengan nama baru (misal `smart-ayce-v2`).
4. Lovable akan push snapshot terbaru (sudah bersih tanpa edge function dummy) ke repo baru tersebut. Repo lama tetap ada di GitHub Anda tapi tidak lagi ter-sync.

**Opsi B — Repo baru manual via GitHub**
1. Buat repo kosong baru di github.com.
2. Di repo lama: **Code → Download ZIP**, atau `git clone` lalu hapus folder `.git`.
3. Push ke repo baru sebagai commit pertama yang bersih (tanpa history lama).
4. Connect Lovable ke repo baru tersebut lewat **Connectors → GitHub**.

**Catatan penting:**
- Lovable belum bisa import repo GitHub yang sudah ada langsung sebagai project baru. Jadi project Lovable tetap yang ini, hanya repo GitHub-nya yang diganti.
- History versi di Lovable (untuk rollback) tetap utuh, terpisah dari history Git.
- Setelah cleanup Bagian 1 dijalankan dan Anda re-connect ke repo baru, repo baru akan berisi snapshot yang sudah benar-benar bersih tanpa file dummy.

### File yang Diubah

- `supabase/functions/analyze-restaurant/index.ts` — **dihapus** (lewat tool delete edge function).

