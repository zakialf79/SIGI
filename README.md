# SIGI-AI — Skrining Gigi Anak Berbasis Kecerdasan Buatan
### Submission: Kategori 3 — Inovasi Produk Digital
**Tema**: *AI for Health & Education Challenge — Dari Ide Mahasiswa Menuju Solusi Nyata*

---

## 📌 Ringkasan Produk
**SIGI-AI** adalah aplikasi mobile inovatif berbasis *Computer Vision (Deep Learning)* yang memungkinkan orang tua dan kader Posyandu melakukan skrining awal kesehatan rongga mulut dan deteksi dini karies gigi anak hanya melalui foto kamera smartphone.

Paket inovasi ini memenuhi seluruh kriteria luaran kompetisi:
1. **Business Process (BPD)**: Alur alur operasional skrining di lapangan (Kader/Orang Tua $\rightarrow$ Deteksi AI $\rightarrow$ Triase Risiko $\rightarrow$ Faskes).
2. **Technical Blueprint**: Arsitektur teknis sistem berlapis (*Mobile Client, API Gateway, Deep Learning Pipeline, Database & Standar HL7 FHIR SatuSehat Kemenkes*).
3. **Desain Sederhana (UI/UX)**: Desain antarmuka 5 layar utama yang dirancang ramah anak (*child-friendly UI*).
4. **Working Prototype (Interactive MVP)**: Aplikasi web interaktif yang siap didemokan secara langsung kepada dewan juri.

---

## 📂 Struktur Berkas Proyek

```
c:\SIGI DAYAH\
├── PROPOSAL_SIGI_AI.md     # Naskah Proposal Lengkap + Diagram Alur & Blueprint Sistem
├── index.html              # Aplikasi Prototype Web Interaktif SIGI-AI
├── css/
│   └── style.css           # Desain Sistem & Simulasi Frame Smartphone Modern
├── js/
│   ├── app.js              # State Controller, Router Layar, Profil & Tiket Rujukan
│   ├── scanner.js          # Simulasi Pemindaian AI, Preset Kasus Klinis, & Bounding Box
│   └── timer.js            # Timer Interaktif Sikat Gigi 2 Menit & Synthesized Audio
├── assets/
│   ├── logo.svg            # Logo Resmi SIGI-AI
│   ├── case1_healthy.svg   # Citra Klinis Kasus 1: Gigi Susu Sehat (Risiko Rendah)
│   ├── case2_plaque.svg    # Citra Klinis Kasus 2: Plak & Karies Dini (Risiko Sedang)
│   └── case3_caries.svg    # Citra Klinis Kasus 3: Karies Gigi Berlubang (Risiko Tinggi)
└── README.md               # Panduan ini
```

---

## 🚀 Cara Menjalankan Prototype

### Cara 1: Langsung Buka di Browser (Paling Mudah)
Cukup klik ganda berkas `index.html` di File Explorer, atau klik kanan $\rightarrow$ **Open with** $\rightarrow$ Google Chrome / Microsoft Edge.

### Cara 2: Menjalankan via Local Server (Rekomendasi untuk Presentasi)
Jika Anda memiliki Python atau Node.js:
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan npx serve
npx serve
```
Buka browser di `http://localhost:8000`.

---

## 🎯 Panduan Demonstrasi di Depan Dewan Juri

1. **Tampilan Presentasi Fleksibel**:
   - Secara default, aplikasi tampil dalam bingkai **Smartphone Modern (iPhone/Android Frame)** lengkap dengan notch dan status bar, sangat elegan untuk presentasi via laptop/proyektor.
   - Anda juga dapat menekan tombol **"Mode Layar Penuh"** di pojok kanan atas untuk melihat tampilan 100% responsif native mobile.
2. **Uji 3 Kasus Klinis (Preset AI)**:
   - Tekan tombol lingkaran kamera di navigasi bawah atau klik kartu **"Mulai Pindai Gigi Anak"**.
   - Di bawah kotak kamera, terdapat tombol pintas skenario klinis:
     - **Kasus 1 (Gigi Sehat)**: Menunjukkan deteksi email intak & risiko rendah (🟢).
     - **Kasus 2 (Plak & Karies Awal)**: Menunjukkan demineralisasi *white spot* & risiko sedang (🟡).
     - **Kasus 3 (Berlubang)**: Menunjukkan karies kavitas aktif & risiko tinggi (🔴).
   - Tekan tombol **Shutter biru**. Perhatikan animasi gelombang radar laser AI yang memindai citra.
3. **Evaluasi Diagnostik & Bounding Box**:
   - Layar hasil akan menampilkan foto gigi dengan **Bounding Box & Label Akurasi AI** pada area lesi.
   - Dilengkapi temuan klinis, skor risiko, dan rekomendasi langkah tindak lanjut.
4. **Alur Rujukan Faskes**:
   - Tekan tombol **"Cari Faskes / Rujukan Puskesmas"**.
   - Tunjukkan daftar Puskesmas & Posyandu terdekat berbasis radius.
   - Tekan tombol **"Rujuk WA"** untuk melihat pop-up **Tiket Rujukan Digital SIGI-AI**.
5. **Edukasi Interaktif**:
   - Buka tab **"Edukasi"** di navigasi bawah.
   - Tekan tombol **"Mulai Sikat Gigi"** pada stopwatch 2 menit. Timer akan menghitung mundur dengan panduan 4 kuadran rongga mulut dan suara audio *beep*.

---

## 📝 Cara Memindahkan Proposal ke Word / PDF
Berkas `PROPOSAL_SIGI_AI.md` telah diformat menggunakan Markdown standar. Anda dapat:
1. Membukanya di VS Code / editor Markdown dan mengekspornya ke PDF (`Markdown PDF` extension), atau
2. Menyalin teksnya ke Microsoft Word / Google Docs. Diagram alur dan arsitektur sudah disediakan dalam sintaks **Mermaid** yang bisa langsung dirender di situs [mermaid.live](https://mermaid.live) atau dimasukkan sebagai diagram gambar.
