# PANDUAN LENGKAP PROYEK DENTIFY
## (Dental Identification for Young Children)

---

## 📌 I. TENTANG PROYEK

### 1. Apa itu DENTIFY?
**DENTIFY** (*Dental Identification for Young Children*) adalah platform aplikasi web berbasis kecerdasan buatan (*AI-Powered Progressive Web App*) yang dirancang khusus untuk melakukan **skrining dini dan deteksi kesehatan gigi serta rongga mulut anak usia dini (1–12 tahun)** hanya menggunakan kamera smartphone.

Aplikasi ini mengintegrasikan model **Computer Vision & Deep Learning (RF-DETR)** yang telah dilatih dengan **4.779 citra fotografi intraoral nyata**, dilengkapi dengan standar kedokteran gigi anak internasional (**Odontogram FDI 20 Gigi Susu** dan **Indeks def-t WHO**), serta sistem rujukan cerdas berbasis lokasi perangkat (GPS) ke Posyandu dan Puskesmas terdekat.

---

### 2. Mengapa DENTIFY Dibuat? (Latar Belakang & Urgensi)
Berdasarkan data Riset Kesehatan Dasar (Riskesdas) Kementerian Kesehatan RI:
1. **Prevalensi Karies Tinggi**: Lebih dari **88,8% anak usia dini di Indonesia mengalami karies gigi (gigi berlubang)**, dengan angka keparahan rata-rata mencapai 8-9 gigi berlubang per anak.
2. **Keterlambatan Penanganan**: Orang tua umumnya baru membawa anak ke dokter gigi ketika anak sudah mengalami sakit gigi parah, pembengkakan gusi, atau abses infeksi pulpa.
3. **Rasio Dokter Gigi Belum Merata**: Ketersediaan dokter gigi anak masih terpusat di kota besar, sementara daerah perifer dan pedesaan sangat kekurangan tenaga medis gigi.
4. **Keterbatasan Kader Posyandu**: Kader kesehatan posyandu belum memiliki alat skrining gigi yang terstandarisasi, objektif, dan mudah digunakan saat kegiatan posyandu bulanan.

---

### 3. Siapa Target Penggunanya?
1. **Orang Tua (Ayah & Ibu)**: Untuk memantau kesehatan gigi anak secara mandiri di rumah kapan saja.
2. **Kader Posyandu**: Sebagai alat bantu pemeriksaan objektif gigi balita saat kegiatan penimbangan posyandu bulanan.
3. **Puskesmas & Dokter Gigi**: Memperoleh rujukan awal terstruktur dengan data triase digital yang siap ditindaklanjuti.

---

## 🚀 II. FITUR-FITUR UTAMA & FUNGSINYA

### 1. Manajemen Profil Anak Multi-User (`screen-setup` & `screen-home`)
- **Fungsi**: Memungkinkan orang tua atau kader posyandu mencatat beberapa profil anak sekaligus (misal: lebih dari satu anak dalam keluarga atau balita di posyandu).
- **Data yang Disimpan**: Nama lengkap anak, usia (tahun dan bulan), jenis kelamin, nama Posyandu/Puskesmas domisili.
- **Penyimpanan Lokal Persisten**: Tersimpan aman di memori perangkat (`localStorage`), tidak memerlukan registrasi rumit atau login.

### 2. Smart Dental Scanner (Kamera & Pemindaian Cerdas) (`screen-scan`)
- **Fungsi**: Mengambil foto rongga mulut anak secara langsung dan memprosesnya untuk analisis AI.
- **3 Pilihan Input**:
  1. **Kamera Web Langsung (Webcam)**: Streaming video langsung dengan panduan bingkai mulut (*Oral Viewfinder Guideline*).
  2. **Kamera Native HP**: Langsung memicu kamera resolusi tinggi bawaan smartphone dengan sensor belakang (*environment camera*).
  3. **Unggah dari Galeri**: Mengunggah foto yang sudah diambil sebelumnya.
- **Preset Klinis untuk Demo Presentasi**: Tersedia tombol preset demonstrasi (*Gigi Sehat* dan *Karies Berlubang*) agar dapat didemokan secara instan di hadapan dewan juri tanpa harus memotret gigi anak saat presentasi.

### 3. Model AI Computer Vision Nyata (Roboflow Cloud Inference)
- **Fungsi**: Mengidentifikasi titik lesi karies, lubang gigi, dan jaringan mulut secara otomatis.
- **Teknologi**: Menggunakan arsitektur neural network **RF-DETR (Small)** yang dilatih dengan dataset **4.779 foto fotografi intraoral mulut anak**.
- **Validasi Anti-Foto Palsu**: Jika pengguna memotret benda selain mulut (misal dinding, baju, keyboard, atau wajah tanpa membuka mulut), AI secara otomatis mendeteksi ketiadaan struktur gigi dan menolak dengan status *"⚠️ Bukan Foto Gigi (Rongga Mulut Tidak Terdeteksi)"*.
- **Koordinat Bounding Box Real-Time**: Kotak penanda warna merah (*Karies*) atau hijau (*Email Sehat*) diposisikan tepat pada piksel koordinat gigi sebenarnya di dalam foto.

### 4. Evaluasi Diagnostik & Standar Medis Internasional (`screen-result`)
- **Indeks def-t Standar WHO**:
  - `d` (*decayed*): Jumlah gigi susu yang berlubang/karies aktif.
  - `e` (*extracted*): Jumlah gigi susu yang telah dicabut akibat karies.
  - `f` (*filled*): Jumlah gigi susu yang telah ditambal dengan baik.
- **Odontogram Interaktif 20 Gigi Susu (Notasi FDI Two-Digit)**:
  - Rahang Atas: Gigi nomor 55, 54, 53, 52, 51 (kanan) dan 61, 62, 63, 64, 65 (kiri).
  - Rahang Bawah: Gigi nomor 85, 84, 83, 82, 81 (kanan) dan 71, 72, 73, 74, 75 (kiri).
  - Interaktif: Mengklik nomor gigi akan menampilkan status klinis spesifik gigi tersebut.
- **Explainable AI (XAI Switcher)**:
  - Mode Bounding Box (kotak deteksi objek AI).
  - Mode Heatmap Grad-CAM (visualisasi area fokus perhatian neural network).
  - Mode Citra Asli (melihat foto asli tanpa overlay).

### 5. Deteksi Lokasi GPS & Rujukan Faskes Terdekat (`screen-faskes`)
- **Fungsi**: Menggunakan sensor GPS perangkat untuk mencari fasilitas kesehatan gigi terdekat (Posyandu, Puskesmas, dan RSGM).
- **Kalkulasi Jarak Real-Time**: Menghitung jarak menggunakan algoritma **Haversine Distance** dan menyortir faskes dari yang paling dekat dengan posisi pengguna saat ini.
- **Navigasi Google Maps**: Tersedia tombol satu-klik *"Buka Maps"* untuk langsung membuka rute navigasi Google Maps menuju faskes.
- **Tiket Rujukan Digital & WhatsApp**: Menghasilkan nomor tiket rujukan (misal: `REF-849102`) lengkap dengan data pasien, kondisi klinis, koordinat GPS, dan prioritas triase yang bisa dikirimkan langsung ke WhatsApp kader atau dokter gigi Puskesmas.

### 6. Timeline Rekam Jejak Skrining Digital
- **Fungsi**: Mencatat riwayat riil setiap pemeriksaan gigi anak dari waktu ke waktu secara berurutan, sehingga orang tua dan kader dapat memantau apakah kondisi gigi anak membaik atau memburuk.

### 7. Fitur Presentasi Juri & PWA (Progressive Web App)
- **Mode Frame Smartphone**: Tampilan simulasi iPhone/Android yang rapi saat dibuka di laptop/proyektor juri.
- **Mode Layar Penuh**: Tombol di pojok kanan atas untuk beralih ke tampilan layar penuh murni.
- **Install App (PWA)**: Dapat dipasang langsung ke layar utama HP Android/iOS layaknya aplikasi Play Store tanpa harus mengunduh file APK.

---

## 📖 III. PANDUAN STEP-BY-STEP CARA MENGGUNAKAN FITUR

### Skenario 1: Penggunaan Pertama Kali (Setup Profil Anak)
1. Buka tautan website: **`https://zakialf79.github.io/SIGI/`**
2. Anda akan langsung disambut oleh layar **"Tambah Profil Anak"**.
3. Masukkan:
   - Nama Lengkap Anak (contoh: *Ahmad Raihan*)
   - Usia (Tahun dan Bulan)
   - Jenis Kelamin (Laki-laki / Perempuan)
   - Nama Posyandu / Puskesmas domisili (contoh: *Posyandu Melati*)
4. Klik tombol **"Simpan Profil & Mulai"**.
5. Anda akan masuk ke Beranda Dashboard dengan kartu skor kesehatan gigi anak.

---

### Skenario 2: Melakukan Pemindaian Gigi Anak
1. Dari Beranda, klik banner **"Mulai Pindai Gigi Anak"** atau tombol bundar kamera di bilah navigasi bawah.
2. Di layar pemindaian, Anda memiliki 3 opsi:
   - **Opsi A (Kamera HP)**: Tekan tombol **"Kamera HP / Perangkat"** atau tombol kamera di kanan bawah bilah kontrol untuk membuka kamera smartphone.
   - **Opsi B (Kamera Web Langsung)**: Tekan tombol **"Kamera Web Langsung"** untuk menyalakan video streaming, posisikan mulut anak di dalam bingkai, lalu tekan **tombol bundar Shutter biru**.
   - **Opsi C (Unggah Galeri)**: Tekan tombol ikon folder/galeri di kiri bawah untuk memilih foto dari penyimpanan HP.
   - **Opsi D (Demo Juri)**: Klik salah satu tombol preset demo di atas bilah kontrol (*Gigi Sehat* atau *Karies Berlubang*), lalu tekan tombol Shutter.
3. Animasi radar laser AI akan berjalan selama 1,2 detik memindai citra.
4. Aplikasi langsung berpindah ke layar **Hasil Skrining AI**.

---

### Skenario 3: Membaca Hasil & Evaluasi Medis
1. **Periksa Status Risiko**:
   - 🟢 **Gigi Sehat**: Skor 90–98, email gigi bersih dan bebas kavitas.
   - 🟡 **Plak / Risiko Sedang**: Skor 70–85, ditemukan lapisan plak biofilm.
   - 🔴 **Karies Terdeteksi**: Skor 35–65, ditemukan lubang karies aktif.
   - ⚠️ **Bukan Foto Gigi**: Skor `—`, sistem memberi tahu foto bukan mulut anak.
2. **Ganti Tampilan AI**:
   - Klik **Bounding Box** untuk melihat kotak letak karies/email.
   - Klik **Heatmap AI (Grad-CAM)** untuk melihat gradien suhu prediksi neural network.
   - Klik **Citra Asli** untuk melihat foto murni.
3. **Cek Indeks def-t**: Perhatikan nilai `d` (gigi berlubang) dan status standar WHO.
4. **Klik Odontogram**: Klik nomor gigi di diagram rahang atas/bawah untuk membaca diagnosa gigi individual.
5. Klik **"Simpan ke Riwayat & Kembali ke Beranda"** untuk merekam hasil ke riwayat digital.

---

### Skenario 4: Mencari Faskes Terdekat & Membuat Tiket Rujukan
1. Di layar hasil, klik tombol **"Cari Faskes / Rujukan Puskesmas"** (atau buka menu *Faskes* di navigasi bawah).
2. Klik tombol hijau **"Cari Faskes Terdekat (Izin Lokasi Perangkat)"** atau **"Minta Izin GPS"**.
3. Browser akan memunculkan izin lokasi $\rightarrow$ Pilih **"Allow" / "Izinkan"**.
4. Sistem akan mendeteksi koordinat GPS perangkat Anda dan mengurutkan Puskesmas/Posyandu dari yang paling dekat (dilengkapi jarak dalam meter/km).
5. Klik **"Buka Maps"** untuk melihat rute perjalanan di Google Maps.
6. Klik **"Rujuk WA"** pada salah satu faskes untuk menerbitkan **Tiket Rujukan Digital DENTIFY**.
7. Klik **"Kirim Tiket ke WhatsApp Kader/Faskes"** untuk mengirim pesan rujukan terenkripsi langsung ke nomor WhatsApp tujuan.

---

## 🛠️ IV. ARSITEKTUR TEKNOLOGI

| Komponen | Teknologi yang Digunakan | Penjelasan |
|:---|:---|:---|
| **Frontend Framework** | HTML5, CSS3 Modern, Vanilla JavaScript (ES6+) | Ringan, responsif di semua ukuran layar, tanpa ketergantungan library berat |
| **PWA Engine** | Service Worker v7.0, Web App Manifest | Berjalan offline-first, dapat diinstall di Home Screen HP |
| **Model AI Vision** | Roboflow RF-DETR (Serverless Cloud API) | Neural network deteksi objek karies terlatih 4.779 foto intraoral |
| **Fallback Engine** | Client-Side Canvas Image Processing | Algoritma cadangan jika perangkat sedang tidak memiliki koneksi internet |
| **Geolokasi** | HTML5 Geolocation API & Haversine Formula | Kalkulasi presisi jarak radius faskes secara real-time |
| **Penyimpanan Data** | LocalStorage & SessionStorage API | Privasi data anak terjaga di perangkat pengguna tanpa server eksternal |

---

## 🏆 V. KEUNGGULAN PRODUK SAAT PRESENTASI KE DEWAN JURI

1. **Bukan Sekadar Konsep**: DENTIFY adalah produk nyata yang sudah live dan ditenagai oleh model Machine Learning yang telah dilatih secara riil.
2. **Kesesuaian Standar Klinis**: Dilengkapi standar internasional kedokteran gigi (WHO def-t & FDI Odontogram), bukan sekadar deteksi visual tanpa makna medis.
3. **Berdampak Langsung pada Pencegahan Stunting**: Kesehatan gigi anak yang buruk menghambat nutrisi balita; deteksi dini karies berkontribusi langsung pada penurunan angka stunting di Indonesia.
4. **Alur Tertutup dari Hulu ke Hilir**: Skrining $\rightarrow$ Evaluasi Triase $\rightarrow$ Rujukan Puskesmas $\rightarrow$ Rekam Jejak Digital.
