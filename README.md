# 🧠 Memory Management Simulator

Simulator interaktif untuk memahami konsep **Memory Management** dan **Process Synchronization** dalam Sistem Operasi.

> 📚 **Dibuat untuk Ujian Akhir Semester (UAS) - Mata Kuliah Sistem Operasi**

---

## 📋 Daftar Isi

1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Simulator](#-fitur-simulator)
3. [Cara Menjalankan](#-cara-menjalankan)
4. [Struktur Folder](#-struktur-folder)
5. [Penjelasan Tiap Simulator](#-penjelasan-tiap-simulator)
6. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
7. [Kontributor](#-kontributor)

---

## 📖 Tentang Proyek

Memory Management Simulator adalah aplikasi web yang memvisualisasikan berbagai konsep manajemen memori dalam sistem operasi:

- **Alokasi Memori Kontinu** (Contiguous Allocation)
- **Alokasi Memori Non-Kontinu** (Paging)
- **Hierarki Memori** (Register, Cache, RAM, Disk)
- **Deadlock Detection**
- **Memory Leak Detection**

### 🎯 Tujuan
Membantu mahasiswa memahami konsep-konsep abstract dalam sistem operasi melalui visualisasi interaktif.

---

## ✨ Fitur Simulator

### 1. Contiguous Allocation
- Simulasi alokasi memori kontinu
- **3 Algoritma**: First-Fit, Best-Fit, Worst-Fit
- Visualisasi fragmentasi eksternal
- Statistik penggunaan memori real-time

### 2. Paging (Non-Contiguous)
- Simulasi alokasi berbasis page/frame
- **Page Table** untuk setiap proses
- **Address Translation** dengan rumus:
  ```
  Physical Address = (Frame × Page Size) + Offset
  Page Number = Logical Address ÷ Page Size
  Offset = Logical Address mod Page Size
  ```

### 3. Memory Hierarchy
- 4 Level: Register → Cache (L1, L2) → RAM → Disk
- Simulasi cache hit/miss
- Visualisasi access time berbeda tiap level

### 4. Deadlock Detection
- Resource Allocation Graph
- Visualisasi circular wait
- Penjelasan 4 kondisi Coffman

### 5. Memory Leak Detector
- Simulasi kebocoran memori
- Visualisasi blok allocated vs leaked
- Garbage collection

---

## 🚀 Cara Menjalankan

### Prasyarat
- Browser modern (Chrome, Firefox, Edge)
- Tidak perlu instalasi tambahan!

### Langkah-langkah

1. **Download/Clone repository**
   ```bash
   git clone <repository-url>
   ```

2. **Buka file `index.html`**
   - Klik kanan pada `index.html`
   - Pilih "Open with" → Browser pilihan Anda
   
   Atau gunakan Live Server di VS Code:
   - Install extension "Live Server"
   - Klik kanan `index.html` → "Open with Live Server"

3. **Pilih simulator** dari dashboard

---

## 📁 Struktur Folder

```
management-memory-simulator/
│
├── index.html              # Halaman utama (Dashboard)
├── contiguous.html         # Simulator Alokasi Kontinu
├── noncontiguous.html      # Simulator Paging
├── hierarchy.html          # Simulator Hierarki Memori
├── deadlock.html           # Simulator Deadlock
├── memory-leak.html        # Simulator Memory Leak
│
├── styles.css              # Styling Material Design 3
│
└── js/
    ├── contiguous.js       # Logic alokasi kontinu
    ├── noncontiguous.js    # Logic paging
    ├── hierarchy.js        # Logic hierarki memori
    ├── deadlock.js         # Logic deadlock
    └── memory-leak.js      # Logic memory leak
```

---

## 📚 Penjelasan Tiap Simulator

### 1️⃣ Contiguous Allocation (`contiguous.html`)

**Konsep**: Setiap proses dialokasikan dalam satu blok memori yang berurutan (contiguous).

**Algoritma yang tersedia**:

| Algoritma | Deskripsi |
|-----------|-----------|
| **First-Fit** | Alokasi di hole pertama yang cukup besar |
| **Best-Fit** | Alokasi di hole terkecil yang cukup besar |
| **Worst-Fit** | Alokasi di hole terbesar yang tersedia |

**Cara menggunakan**:
1. Pilih algoritma dari dropdown
2. Masukkan ukuran proses (KB)
3. Klik "Tambah Proses"
4. Amati perubahan di memory grid

**Konsep penting**:
- **External Fragmentation**: Ruang kosong tersebar, tidak bisa digunakan
- **Compaction**: Menggabungkan hole-hole kecil menjadi besar

---

### 2️⃣ Paging (`noncontiguous.html`)

**Konsep**: Memori fisik dibagi menjadi **frames**, memori logis dibagi menjadi **pages** dengan ukuran sama.

**Komponen penting**:
- **Page Table**: Memetakan page number → frame number
- **Page Size**: Ukuran tiap halaman (dalam simulator: 4 KB)
- **Address Translation**: Mengubah alamat logis ke alamat fisik

**Rumus Address Translation**:
```
Page Number = ⌊Logical Address / Page Size⌋
Offset = Logical Address mod Page Size
Physical Address = (Frame Number × Page Size) + Offset
```

**Cara menggunakan**:
1. Masukkan ukuran proses
2. Klik "Tambah Proses"
3. Lihat page table yang terbentuk
4. Coba translasi alamat di bagian bawah

---

### 3️⃣ Memory Hierarchy (`hierarchy.html`)

**Konsep**: Memori disusun dalam hierarki berdasarkan kecepatan dan kapasitas.

| Level | Nama | Kecepatan | Kapasitas |
|-------|------|-----------|-----------|
| 1 | Register | < 1 ns | Bytes |
| 2 | Cache (L1, L2) | 1-10 ns | KB - MB |
| 3 | RAM | ~100 ns | GB |
| 4 | Disk | ~10 ms | TB |

**Konsep penting**:
- **Cache Hit**: Data ditemukan di cache
- **Cache Miss**: Data tidak ada di cache, harus ambil dari level bawah
- **Locality**: Temporal dan Spatial locality

---

### 4️⃣ Deadlock Detection (`deadlock.html`)

**Konsep**: Deadlock terjadi ketika proses saling menunggu resource yang dipegang proses lain.

**4 Kondisi Coffman** (harus terpenuhi semua):
1. **Mutual Exclusion**: Resource hanya bisa dipakai 1 proses
2. **Hold and Wait**: Proses memegang resource sambil menunggu yang lain
3. **No Preemption**: Resource tidak bisa dipaksa diambil
4. **Circular Wait**: Ada cycle dalam waiting chain

**Cara menggunakan**:
1. Pilih skenario dari dropdown
2. Klik "Run Scenario"
3. Amati Resource Allocation Graph
4. Lihat apakah terjadi circular wait

---

### 5️⃣ Memory Leak Detector (`memory-leak.html`)

**Konsep**: Memory leak terjadi ketika memori yang dialokasikan tidak pernah dibebaskan.

**Komponen**:
- **Allocated (Hijau)**: Memori yang dialokasikan normal
- **Leaked (Merah)**: Memori yang bocor (tidak bisa di-free)
- **Garbage Collection**: Membersihkan memori yang bocor

**Cara menggunakan**:
1. Klik "Allocate Memory" untuk mengalokasikan
2. Klik "Simulate Leak" untuk mensimulasikan kebocoran
3. Amati perubahan warna di grid
4. Klik "Garbage Collect" untuk membersihkan

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|-----------|----------|
| HTML5 | Struktur halaman |
| CSS3 | Styling (Material Design 3) |
| JavaScript | Logic simulasi |
| Font Awesome | Icons |
| Google Fonts (Roboto) | Typography |

### Design System
- **Material Design 3** dengan dark theme
- **Warna utama**: Teal/Cyan (`#4FD8EB`)
- **Warna surface**: Dark gray (`#121316`)
- Dipilih untuk **visibility tinggi** saat presentasi

---

## 👥 Kontributor

| Nama | NIM | Role |
|------|-----|------|
| Gusti Aditya Muzaky | 312310193 | Website Developer |
| Arippudin | 312310151 | Logic Project |
| Silvia Nirmalasari | 312310145 | Presentation Maker |
| Dini Siti Masluhah | 312310197 | Presentation Maker |
| Melisah | 312310220 | Presentation Maker |
| Galang Rambuanarki | 312310164 | Presentation |
| Rizky Fadil Hanif | 312310205 | Presentation |
| Chandra Rasmita Putra | 312310175 | Presentation |

---

## 📝 Catatan Pengembangan

### Changelog
- **v2.0** - Redesign dengan Material Design 3
  - Menambahkan algoritma Best-Fit dan Worst-Fit
  - Menambahkan formula address translation
  - Memperbaiki visualisasi warna
  - Dark theme untuk visibility presentasi

- **v1.0** - Versi awal
  - Implementasi dasar semua simulator

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik (UAS Sistem Operasi).

---

<p align="center">
  <b>Memory Management Simulator © 2025</b><br>
    Ujian Akhir Semester Sistem Operasi
</p>
