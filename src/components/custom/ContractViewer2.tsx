import React from "react";

export interface ContractData {
  contractNumber: string;
  contractDate: {
    day: string;
    month: string;
    year: string;
  };
  firstParty: {
    companyName: string;
    address: string;
    representative: string;
    position: string;
  };
  secondParty: {
    companyName: string;
    address: string;
    representative: string;
    position: string;
  };
  pricing: {
    registrationFee: number;
    monitoringPerDevice: number;
    perTicket: number;
    onsiteInstallation: number;
    onsiteRemoval: number;
    onsiteRepair: number;
  };
  bankDetails: {
    bankName: string;
    branch: string;
    accountNumber: string;
    accountHolder: string;
  };
  contractEndDate: string;
  signingLocation: string;
  signingDate: string;
}

interface ContractViewerProps {
  data: ContractData;
  className?: string;
}

const ContractViewer2: React.FC<ContractViewerProps> = ({
  data,
  className = "",
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyText = (amount: number) => {
    const formatter = new Intl.NumberFormat("id-ID");
    return `Rp. ${formatter.format(amount)}`;
  };

  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perjanjian Kerjasama Service HUB</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .contract-number {
            font-weight: bold;
            margin-bottom: 10px;
        }
        .parties {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            text-transform: uppercase;
            margin: 25px 0 15px 0;
            text-align: center;
        }
        .article {
            margin-bottom: 25px;
        }
        .article-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
        }
        .numbered-list {
            margin-left: 20px;
        }
        .sub-list {
            margin-left: 40px;
        }
        .signature-section {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            text-align: center;
            width: 45%;
        }
        .underline {
            text-decoration: underline;
        }
        .bold {
            font-weight: bold;
        }
        .italic {
            font-style: italic;
        }
        .text-center {
            text-align: center;
        }
    </style>
</head>
<body>

<div class="header">
    <h1>PERJANJIAN KERJASAMA</h1>
    <div class="contract-number">No: 01/xx/Feb/2025/PK/xxxxxxxxx</div>
    <div class="parties">
        <strong>PT RUMAH APLIKASI KITA</strong><br>
        Dengan<br>
        <strong>PT XXXXXXXXXXXXXXXXXXXX</strong>
    </div>
    <div class="bold">Perihal: Berlangganan Service HUB</div>
</div>

<p>Pada hari ini, <strong>Senin</strong> Tanggal <strong>xx</strong> bulan <strong>xx</strong> tahun <strong>xxxx</strong>, dibuat serta di tandatangani Perjanjian Kerjasama Berlangganan Produk: <strong>Service HUB</strong> ("Perjanjian Service HUB") bertempat di <strong>Jakarta, INDONESIA</strong> oleh dan antara:</p>

<div class="numbered-list">
    <p><strong>1.</strong> PT. Rumah Aplikasi KIta, Perusahaan yang didirikan berdasarkan hukum di Indonesia, berkedudukan di Jakarta, beralamat di xxxxxxxxxxxxxx jalan Cipinang besar selatan Jakarta Timur DKI di jakarta diwakili xxxxxxxx xxxxxxxx dalam jabatannya sebagai Direktur Operasional, untuk selanjutnya disebut <strong>Pihak Pertama</strong></p>
    
    <p><strong>2.</strong> PT Rantanplan Aura, Perusahaan yang didirikan berdasarkan hukum di Indonesia, berkedudukan di Jakarta, beralamat di Jalan haji dogol 20 Jakarta selatan, diwakili Michael tanraga Sebagai Direktur, untuk selanjutnya disebut <strong>Pihak Kedua</strong>.</p>
</div>

<div class="section-title">DEFINISI</div>

<p>Berikut ini beberapa hal yang digunakan dalam kontrak ini:</p>

<div class="numbered-list">
    <p><strong>1. APLIKASI SERVICE HUB</strong> adalah produk aplikasi berbasis internet untuk menyediakan jasa teknisi di lokasi mencakup beberapa wilayah di Indonesia yang dibangun dan dijalankan oleh PIHAK PERTAMA untuk membantu layanan service ke pelanggan PIHAK KEDUA supaya lebih efektif, efisien dan termonitor. Aplikasi ini terdiri dari beberapa modul antara lain:</p>
    
    <div class="sub-list">
        <p><strong>a.</strong> APLIKASI BISNIS PARTNER adalah aplikasi monitoring yang digunakan PIHAK KEDUA memonitor status mesin serta kendala yang ada di semua perangkat yang ada pelanggan.</p>
        <p><strong>b.</strong> APLIKASI SERVIS PARTNER adalah aplikasi monitoring yang digunakan oleh SERVICE PARTNER untuk melihat tiket pekerjaan yang masuk yang dikirimkan oleh system.</p>
        <p><strong>c.</strong> APLIKASI TEKNIKAL adalah aplikasi oleh teknisi untuk menerima penugasan sekaligus mengupdate hasil pekerjaan.</p>
        <p><strong>d.</strong> APLIKASI PELANGGAN adalah aplikasi yang digunakan untuk melaporkan kendala yang ada di perangkat yang digunakan.</p>
    </div>
    
    <p><strong>2. BISNIS PATNER</strong> adalah mitra bisnis yang menggunakan produk service HUB.</p>
    
    <p><strong>3. SERVICE PARTNER</strong> adalah mitra service yang menggunakan produk service HUB.</p>
    
    <p><strong>4. MASA KONTRAK</strong> adalah periode jangka waktu yang mengatur berlaku nya dan berakhirnya kesepakatan perjajian kerjasama ini.</p>
    
    <p><strong>5. BIAYA</strong> adalah nominal yang di bayarkan setelah layanan dan fitur dalam Produk aplikasi digunakan.</p>
</div>

<p><strong>PIHAK PERTAMA</strong> dan <strong>PIHAK KEDUA</strong> selanjutnya secara bersama-sama dan sendiri sendiri disebut "<strong>KEDUA PIHAK</strong>"</p>

<p><strong>KEDUA PIHAK</strong> terlebih dahulu menerangkan hal-hal sebagai berikut:</p>

<div class="numbered-list">
    <p><strong>1.</strong> Bahwa PIHAK PERTAMA adalah perusahaan yang bergerak dibidang Pengembangan Aplikasi melalui internet yang telah terdaftar secara resmi di Dirjen HaKI Kementrian Hukum dan HAM Republik Indonesia.</p>
    
    <p><strong>2.</strong> Bahwa PIHAK KEDUA adalah perusahaan yang bergerak di bidang IT Solution yang mana membutuhkan layanan "Service HUB" untuk pelanggannya (pihak ketiga).</p>
    
    <p><strong>3.</strong> Bahwa untuk memenuhi kebutuhan tersebut PIHAK KEDUA bermaksud untuk bekerjasama dengan PIHAK PERTAMA dalam hal meningkatkan layanan kepada pelanggannya dengan layanan Service HUB yang dimiliki oleh PIHAK PERTAMA.</p>
    
    <p><strong>4.</strong> PIHAK PERTAMA memberikan produk Aplikasi dengan nama "Service HUB " dengan skema berlangganan kepada PIHAK KEDUA dengan waktu kontrak yang disepakati PARA PIHAK</p>
    
    <p><strong>5.</strong> KEDUA PIHAK menyetujui semua hal yang tersebut dengan terkait dengan hak dan kewajiban PARA PIHAK.</p>
</div>

<p>Berdasarkan hal-hal tersebut diatas, <strong>KEDUA PIHAK</strong> sepakat perjajian Kerjasama dengan syarat syarat dan ketentuan sebagai berikut</p>

<div class="article">
    <div class="article-title">PASAL 1<br>RUANG LINGKUP KERJASAMA</div>
    
    <div class="numbered-list">
        <p><strong>1.</strong> KEDUA PIHAK sepakat bahwa berdasarkan Perjanjian ini PIHAK PERTAMA wajib meyediakan produk Aplikasi Service HUB untuk PIHAK KEDUA melalui skema berlangganan yang disepakati KEDUA PIHAK.</p>
        
        <p><strong>2.</strong> PIHAK KEDUA telah setuju berkerjasama untuk Produk Aplikasi "Service HUB" sebagai layanan ke pelanggan yang terdaftar sebagai pelanggan PIHAK KEDUA.</p>
        
        <p><strong>3.</strong> Penambahan daftar pelanggan dapat dilakukan secara mandiri oleh PIHAK KEDUA / menggunakan jasa pihak pertama PERTAMA.</p>
        
        <p><strong>4.</strong> Atas penambahan daftar pelanggan yang menggunakan jasa PIHAK PERTAMA maka PIHAK KEDUA akan dikenakan tambahan biaya sesuai dengan biaya yang dicantumkan dalam Pasal 3 ayat 3.</p>
        
        <p><strong>5.</strong> Daftar Perangkat dilihat di Lampiran terpisah yang menjadi kesatuan dalam perjanjian ini.</p>
        
        <p><strong>6.</strong> Penambahan Perangkat saat berjalannya perjanjian ini akan dimasukan Addendum yang tidak terpisah dalam perjanjian ini.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 2<br>MASA BERLAKUNYA DAN BERAKHIRNYA PERJANJIAN</div>
    
    <p>Surat Perjanjian Kerjasama berlaku sejak di tanda tangani, dan berlaku minimal <strong>3 tahun</strong> sampai dengan <strong>Maret 2027</strong> dapat diperpanjang secara otomatis untuk tahun berikutnya.</p>
</div>

<div class="article">
    <div class="article-title">PASAL 3<br>TATA CARA PEMBELIAN LAYANAN DAN PEMBAYARAN</div>
    
    <div class="numbered-list">
        <p><strong>1.</strong> PIHAK KEDUA menggunakan jasa produk Aplikasi "Service HUB" kepada PIHAK PERTAMA dengan menerbitkan Surat Perintah Kerja (SPK).</p>
        
        <p><strong>2.</strong> PIHAK PERTAMA akan memberikan akses layanan berupa Produk Aplikasi "Service HUB)" untuk Teknisi, Pelanggan dan Administrator.</p>
        
        <p><strong>3.</strong> PIHAK PERTAMA akan menerima pembayaran dari PIHAK KEDUA dengan hitungan:</p>
        
        <div class="sub-list">
            <p><strong>a.</strong> Biaya daftar layanan : <strong>Rp. 2.000.000</strong> (satu kali saat pendaftaran)</p>
            <p><strong>b.</strong> Biaya monitoring per perangkat : <strong>Rp 15.000</strong> (per mesin per bulan)</p>
            <p><strong>c.</strong> Biaya per Tiket : <strong>Rp 200</strong></p>
            <p><strong>d.</strong> Biaya onsite pemasangan : <strong>Rp …..</strong> (1 kali saat instalasi)</p>
            <p><strong>e.</strong> Biaya onsite pembongkaran : <strong>Rp ……</strong> (1 kali saat pembongkaran)</p>
            <p><strong>f.</strong> Biaya onsite perbaikan : <strong>Rp …..</strong> (per mesin per bulan)</p>
        </div>
        
        <p><strong>4.</strong> Biaya biaya diatas diluar kirim dan sparepart.</p>
        
        <p><strong>5.</strong> Pembayaran layanan oleh PIHAK KEDUA melalui transfer rekening yang disediakan oleh PIHAK PERTAMA yaitu:</p>
        
        <div class="sub-list">
            <p><strong>a.</strong> Nama Bank :</p>
            <p><strong>b.</strong> Cabang :</p>
            <p><strong>c.</strong> Nomer rekening :</p>
            <p><strong>d.</strong> Atas Nama xxxxxxxx : <strong>PT. Rumah Aplikasi Kita</strong></p>
        </div>
        
        <p><strong>6.</strong> PIHAK PERTAMA akan menerbitkat tagihan berserta faktur pajak setiap tanggal I (satu) setiap bulan dilengkapi dengan detail transaksi penggunaan layanan.</p>
        
        <p><strong>7.</strong> Pembayaran paling lambat dilakukan <strong>14 hari kalender</strong> setelah tanggal faktur diterbitkan PIHAK PERTAMA.</p>
        
        <p><strong>8.</strong> Pembayaran dianggap sah setelah pembayaran sudah diterima direkening PIHAK PERTAMA.</p>
        
        <p><strong>9.</strong> Denda keterlambatan <strong>1 permil</strong> setiap hari keterlambatan.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 4<br>GARANSI LAYANAN</div>
    
    <div class="numbered-list">
        <p><strong>1.</strong> PIHAK PERTAMA memberikan garansi layanan dan perawatan system Produk Aplikasi "Service HUB" selama kerjasama berlangsung.</p>
        
        <p><strong>2.</strong> PIHAK PERTAMA menjamin uptime server <strong>99%</strong> selama <strong>7x24 jam</strong>.</p>
        
        <p><strong>3.</strong> PIHAK PERTAMA menyediakan cadangan database secara berkala.</p>
        
        <p><strong>4.</strong> PIHAK PERTAMA memastikan cadangan database dapat dipulihkan kembali yang disebabkan oleh kegagalan system bukan karena kesalahan pengguna.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 5<br>TANGUNG JAWAB PIHAK PERTAMA</div>
    
    <p>PIHAK PERTAMA bertanggung jawab kepada PIHAK KEDUA beberapa hal berikut ini selama perjanjian:</p>
    
    <div class="numbered-list">
        <p><strong>1.</strong> Membantu migrasi basis data pelanggan PIHAK KEDUA ke dalam aplikasi dengan format yang sesuai dengan produk aplikasi PIHAK PERTAMA.</p>
        
        <p><strong>2.</strong> Menyediakan fitur khusus untuk penambahan data secara mandiri untuk PIHAK KEDUA.</p>
        
        <p><strong>3.</strong> Memberikan(mengaktifkan) semua fitur layanan yang ada didalam Aplikasi.</p>
        
        <p><strong>4.</strong> Memberikan Akses layanan aplikasi baik ke Teknisi, Pelanggan dan PIHAK KEDUA.</p>
        
        <p><strong>5.</strong> Memberikan uji coba gratis selama <strong>1bulan</strong></p>
        
        <p><strong>6.</strong> Evaluasi aplikasi secara berkala dengan PIHAK KEDUA secara periodik terkait proses dan semua fitur untuk penyempurnaan layanan Aplikasi.</p>
        
        <p><strong>7.</strong> Pelatihan penggunaan Aplikasi kepada PIHAK KEDUA untuk administrator dan teknisi.</p>
        
        <p><strong>8.</strong> Menjaga Kerahasiaan basis data PIHAK KEDUA.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 6<br>TANGGUNG JAWAB PIHAK KEDUA</div>
    
    <p>PIHAK KEDUA bersedia menjalankan kewajiban, sebagai berikut:</p>
    
    <div class="numbered-list">
        <p><strong>1.</strong> Menerbitkan Surat Perintah Kerja (SPK) dan menandatangani surat Perjanjian Kerjasama ini.</p>
        
        <p><strong>2.</strong> Melakukan kewajiban pembayaran tepat waktu kepada PIHAK PERTAMA atas layanan yang sudah digunakan</p>
        
        <p><strong>3.</strong> Menjaga kerahasiaan informasi terkait username, password dan semua fitur yang tersedia didalam aplikasi kepada pihak lain sesuai Undang-undang no.28 tahun 2014 tentang Hak Cipta (Hak Kekayaan Intelektual)</p>
        
        <p><strong>4.</strong> Melaporkan semua kendala yang berkaitan dengan implementasi produk aplikasi "service HUB" kepada PIHAK PERTAMA.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 7<br>PENGAKHIRAN KERJASAMA</div>
    
    <p>PIHAK PERTAMA berhak mengahiri kerjasama ini dengan tanpa memberikan ganti rugi apapun kepada PIHAK KEDUA bila:</p>
    
    <div class="numbered-list">
        <p><strong>1.</strong> PIHAK KEDUA memberikan informasi maupun skema aplikasi kepada pihak lain.</p>
        
        <p><strong>2.</strong> PIHAK KEDUA tidak menjalankan kewajiban dan semua isi dalam perjanjian ini.</p>
        
        <p><strong>3.</strong> PIHAK KEDUA melakukan tindakan diluar kesepakatan yang dapat merugikan material maupun immaterial bagi PIHAK PERTAMA</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 8<br>KEADAAN DARURAT/BENCANA DAN KEJADIAAN YANG TIDAK TERDUGA</div>
    
    <div class="numbered-list">
        <p><strong>1.</strong> KEDUA PIHAK tidak bertanggung jawab untuk kondisi yang disebabkan oleh atau diluar kekuasaan dan kemampuannya termasuk tetapi tidak terbatas pada: Jaringan Internet terganggu, Server Down dan terkena Hack, Bencana Alam, Pertempuran, Kebakaran, Huru Hara dan segala sesuatu yang menghambat pelaksanaan Perjanjian ini serta kebijakan pemerintah yang secara langsung berpengaruh terhadap pelaksanaan Perjanjian ini.</p>
        
        <p><strong>2.</strong> Dalam Hal terjadinya Keadaan Darurat/Bencana, KEDUA PIHAK wajib memberitahu secara tertulis tentang terjadinya keadaan tersebut kepada PARA PIHAK selambat-lambatnya dalam waktu <strong>24 (Duapuluh empat) jam</strong> terhitung sejak terjadinya Darurat/Bencana tersebut dengan melampirkan pemberitaan resmi dari instansi terkait dan membuat antisipasi terkait pelakanaan perjanjian yang sudah disepakati.</p>
        
        <p><strong>3.</strong> Apabila PARA PIHAK yang terkena kondisi keadaan Darurat/Bencana tidak melaksanaan sebagaimana yang sudah ditentukan dalam Ayat 2 diatas maka kondisi tersebut tidak diakui oleh PARA PIHAK yang mengalamikeadaan Darurat/bencana.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 9<br>HUKUM YANG MENGATUR DAN PENYELESAIAN PERSELISIHAN</div>
    
    <div class="numbered-list">
        <p><strong>1.</strong> Apabila terjadi perselisihan diantara KEDUA PIHAK yang mungkin timbul akibat dan penafsiran dan atau pelaksanaan perjanjian ini, maka diupayakan untuk diselesaikan terlebih dahulu secara Musyawarah untuk Mufakat.</p>
        
        <p><strong>2.</strong> Apabila menyelesaikan perselisihan secara musyawarah untuk mufakat sebagaimana dalam Ayat I pasal ini tidak dapat menyelesaikan perselisihan dalam Jangka waktu <strong>20 (dua puluh hari) hari Kerja</strong> sejak musyawarah dilakukan, maka KEDUA PIHAK sepakat untuk menyelesaikan melalui yuridiksi non-eksklusif di pengadilan <strong>Depok Jawa Barat, Indonesia</strong>.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 10<br>KETENTUAN-KETENTUAN LAIN</div>
    
    <div class="numbered-list">
        <p><strong>1.</strong> Hal-hal yang tidak atau belum diatur atau perubahan-perubahan dalam perjanjian ini akan ditetapkan oleh KEDUA PIHAK secara musyawarah dengan membuat suatu Addendum yang merupakan satu kesatuan dan tidak dapat dipisahkan dalam perjanjian.</p>
        
        <p><strong>2.</strong> Perjanjian ini tidak dapat diubah, baik untuk seluruh nya maupun untuk sebagian, kecuali apabila perubahan tersebut dalam suatu perjanjian tertulis yang ditandatangani oleh KEDUA PIHAK dalam perjanjian ini, dengan tidak mengurangi ketentuan perundangan yang berlaku.</p>
        
        <p><strong>3.</strong> KEDUA PIHAK tidak diperkenankan untuk mengalihkan hak dan kewajiban nya berdasarakan perjanjian ini, baik sebagian maupun seluruh nya, kepada PIHAK KETIGA selama berlangsungnya perjanjian ini, tanpa persetujuan tertulis dari salah satu PARA PIHAK.</p>
    </div>
</div>

<div class="article">
    <div class="article-title">PASAL 11<br>PENUTUP</div>
    
    <p>Perjanjian ini dibuat dan ditandatangani di Jakarta pada hari ini dan tanggal sebagaimana tersebut di atas dalam rangkap <strong>2 (dua)</strong> dan bermaterai cukup serta keduanya mempunyai kekuatan hukum yang sama.</p>
</div>

<div class="text-center">
    <p><strong>DISEPAKATI DI : DEPOK, 28 February 2025</strong></p>
</div>

<div class="signature-section">
    <div class="signature-box">
        <p><strong>PIHAK PERTAMA</strong></p>
        <p><strong>PT RUMAH APLIKASI KITA</strong></p>
        <br><br><br>
        <p><strong><u>GUNAWAN SAPUTRA</u></strong><br>
        <strong>Direktur</strong></p>
    </div>
    
    <div class="signature-box">
        <p><strong>PIHAK KEDUA</strong></p>
        <p><strong>PT CUSTOMER</strong></p>
        <br><br><br>
        <p><strong><u>CUSTOMER</u></strong><br>
        <strong>Direktur</strong></p>
    </div>
</div>

</body>
</html>`;
};

export default ContractViewer2;
