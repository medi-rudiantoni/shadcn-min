import React from "react";

export interface ContractData {
  contractNumber: string;
  contractDate: {
    day: string;
    date: string;
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
    onsiteInstallation?: number;
    onsiteRemoval?: number;
    onsiteRepair?: number;
  };
  bankDetails: {
    bankName?: string;
    branch?: string;
    accountNumber?: string;
    accountHolder: string;
  };
  contractEndDate: {
    date: string;
    month: string;
    year: string;
  };
  signingLocation: string;
  signingDate: string;
  regionalCourt: string;
}

interface ContractViewerProps {
  data: ContractData;
  className?: string;
}

const ContractViewer: React.FC<ContractViewerProps> = ({
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

  return (
    <div
      className={`max-w-4xl mx-auto p-20 bg-white shadow-lg print-wrapper text-sm ${className}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-base font-bold mb-2">PERJANJIAN KERJASAMA</h1>
          <p className="text-base">
            No:{" "}
            <span className="bg-yellow-20 px-1">{data?.contractNumber}</span>
          </p>
          <div className="mt-4">
            <p className="text-base font-semibold mb-2">
              PT RUMAH APLIKASI KITA
            </p>
            <p className="text-base mb-2">Dengan</p>
            <p className="text-base font-semibold bg-yellow-20 px-1 inline-block">
              {data?.secondParty.companyName}
            </p>
          </div>
          <p className="text-base mt-4 font-semibold">Perihal</p>
          <p className="text-base">Berlangganan Service HUB</p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p className="text-justify leading-relaxed">
            Pada hari ini,{" "}
            <span className="bg-yellow-20 px-1">{data?.contractDate.day}</span>{" "}
            Tanggal{" "}
            <span className="bg-yellow-20 px-1">{data?.contractDate.day}</span>{" "}
            bulan{" "}
            <span className="bg-yellow-20 px-1">
              {data?.contractDate.month}
            </span>{" "}
            tahun{" "}
            <span className="bg-yellow-20 px-1">{data?.contractDate.year}</span>
            , dibuat serta di tandatangani Perjanjian Kerjasama Berlangganan
            Produk: Service HUB (&quot;Perjanjian Service HUB&quot;) bertempat
            di Jakarta, INDONESIA oleh dan antara:
          </p>

          <table className="w-full border-collapse mt-4 ">
            <tbody>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">1.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  PT. Rumah Aplikasi KIta, Perusahaan yang didirikan berdasarkan
                  hukum di Indonesia, berkedudukan di Jakarta, beralamat di{" "}
                  <span className="bg-yellow-20 px-1">
                    {data?.firstParty.address}
                  </span>{" "}
                  jalan Cipinang besar selatan Jakarta Timur DKI di jakarta
                  diwakili{" "}
                  <span className="bg-yellow-20 px-1">
                    {data?.firstParty.representative}
                  </span>{" "}
                  dalam jabatannya sebagai{" "}
                  <span className="bg-yellow-20 px-1">
                    {data?.firstParty.position}
                  </span>
                  , untuk selanjutnya disebut <strong>Pihak Pertama</strong>
                </td>
              </tr>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">2.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  <span className="bg-yellow-20 px-1">
                    {data?.secondParty.companyName}
                  </span>
                  , Perusahaan yang didirikan berdasarkan hukum di Indonesia,
                  berkedudukan di Jakarta, beralamat di{" "}
                  <span className="bg-yellow-20 px-1">
                    {data?.secondParty.address}
                  </span>
                  , diwakili{" "}
                  <span className="bg-yellow-20 px-1">
                    {data?.secondParty.representative}
                  </span>{" "}
                  Sebagai{" "}
                  <span className="bg-yellow-20 px-1">
                    {data?.secondParty.position}
                  </span>
                  , untuk selanjutnya disebut <strong>Pihak Kedua</strong>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Definitions Section */}
        <div className="">
          <h2 className="text-base font-bold mb-4">DEFINISI</h2>
          <p className="mb-4">
            Berikut ini beberapa hal yang digunakan dalam kontrak ini:
          </p>

          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">1.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  <strong>APLIKASI SERVICE HUB</strong> adalah produk aplikasi
                  berbasis internet untuk menyediakan jasa teknisi di lokasi
                  mencakup beberapa wilayah di Indonesia yang dibangun dan
                  dijalankan oleh PIHAK PERTAMA untuk membantu layanan service
                  ke pelanggan PIHAK KEDUA supaya lebih efektif, efisien dan
                  termonitor. Aplikasi ini terdiri dari beberapa modul antara
                  lain:
                  <table className="w-full border-collapse mt-2 ml-4">
                    <tbody>
                      <tr>
                        <td className="align-top p-1 w-8 font-semibold">a.</td>
                        <td className="align-top p-1 text-justify leading-relaxed">
                          <strong>APLIKASI BISNIS PARTNER</strong> adalah
                          aplikasi monitoring yang digunakan PIHAK KEDUA
                          memonitor status mesin serta kendala yang ada di semua
                          perangkat yang ada pelanggan.
                        </td>
                      </tr>
                      <tr className="">
                        <td className="align-top p-1 w-8 font-semibold">b.</td>
                        <td className="align-top p-1 text-justify leading-relaxed">
                          <strong>APLIKASI SERVIS PARTNER</strong> adalah
                          aplikasi monitoring yang digunakan oleh SERVICE
                          PARTNER untuk melihat tiket pekerjaan yang masuk yang
                          dikirimkan oleh system.
                        </td>
                      </tr>
                      <tr>
                        <td className="align-top p-1 w-8 font-semibold">c.</td>
                        <td className="align-top p-1 text-justify leading-relaxed">
                          <strong>APLIKASI TEKNIKAL</strong> adalah aplikasi
                          oleh teknisi untuk menerima penugasan sekaligus
                          mengupdate hasil pekerjaan.
                        </td>
                      </tr>
                      <tr>
                        <td className="align-top p-1 w-8 font-semibold">d.</td>
                        <td className="align-top p-1 text-justify leading-relaxed">
                          <strong>APLIKASI PELANGGAN</strong> adalah aplikasi
                          yang digunakan untuk melaporkan kendala yang ada di
                          perangkat yang digunakan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">2.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  <strong>BISNIS PATNER</strong> adalah mitra bisnis yang
                  menggunakan produk service HUB.
                </td>
              </tr>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">3.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  <strong>SERVICE PARTNER</strong> adalah mitra service yang
                  menggunakan produk service HUB.
                </td>
              </tr>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">4.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  <strong>MASA KONTRAK</strong> adalah periode jangka waktu yang
                  mengatur berlaku nya dan berakhirnya kesepakatan perjanjian
                  kerjasama ini.
                </td>
              </tr>
              <tr>
                <td className="align-top p-2 w-8 font-semibold">5.</td>
                <td className="align-top p-2 text-justify leading-relaxed">
                  <strong>BIAYA</strong> adalah nominal yang di bayarkan setelah
                  layanan dan fitur dalam Produk aplikasi digunakan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contract Articles */}
        <div className="space-y-6">
          {/* Article 1 */}
          <div className="w-full">
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 1<br />
              RUANG LINGKUP KERJASAMA
            </h3>

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    KEDUA PIHAK sepakat bahwa berdasarkan Perjanjian ini PIHAK
                    PERTAMA wajib meyediakan produk Aplikasi Service HUB untuk
                    PIHAK KEDUA melalui skema berlangganan yang disepakati KEDUA
                    PIHAK.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK KEDUA telah setuju berkerjasama untuk Produk Aplikasi
                    &quot;Service HUB&quot; sebagai layanan ke pelanggan yang
                    terdaftar sebagai pelanggan PIHAK KEDUA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Penambahan daftar pelanggan dapat dilakukan secara mandiri
                    oleh PIHAK KEDUA / menggunakan jasa pihak pertama PERTAMA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    4.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Atas penambahan daftar pelanggan yang menggunakan jasa PIHAK
                    PERTAMA maka PIHAK KEDUA akan dikenakan tambahan biaya
                    sesuai dengan biaya yang dicantumkan dalam Pasal 3 ayat 3.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    5.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Daftar Perangkat dilihat di Lampiran terpisah yang menjadi
                    kesatuan dalam perjanjian ini.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    6.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Penambahan Perangkat saat berjalannya perjanjian ini akan
                    dimasukan Addendum yang tidak terpisah dalam perjanjian ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 2 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 2<br />
              MASA BERLAKUNYA DAN BERAKHIRNYA PERJANJIAN
            </h3>
            <p className="pl-4">
              Surat Perjanjian Kerjasama berlaku sejak di tanda tangani, dan
              berlaku minimal 3 tahun sampai dengan{" "}
              <span className="bg-yellow-20 px-1">
                {data?.contractEndDate.month}
              </span>{" "}
              dapat diperpanjang secara otomatis untuk tahun berikutnya.
            </p>
          </div>

          {/* Article 3 */}
          <div className="w-full">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK KEDUA menggunakan jasa produk Aplikasi &quot;Service
                    HUB&quot; kepada PIHAK PERTAMA dengan menerbitkan Surat
                    Perintah Kerja (SPK).
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK PERTAMA akan memberikan akses layanan berupa Produk
                    Aplikasi &quot;Service HUB&quot; untuk Teknisi, Pelanggan
                    dan Administrator.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2">
                    <div>
                      <p className="text-justify mb-2">
                        PIHAK PERTAMA akan menerima pembayaran dari PIHAK KEDUA
                        dengan hitungan:
                      </p>
                      <table className="w-full ml-4">
                        <tbody>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              a.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Biaya daftar layanan :{" "}
                              <span className="bg-yellow-20 px-1">
                                {formatCurrencyText(
                                  data?.pricing.registrationFee,
                                )}
                              </span>{" "}
                              (satu kali saat pendaftaran)
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              b.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Biaya monitoring per perangkat :{" "}
                              <span className="bg-yellow-20 px-1">
                                Rp{" "}
                                {data?.pricing.monitoringPerDevice?.toLocaleString(
                                  "id-ID",
                                )}
                              </span>{" "}
                              (per mesin per bulan)
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              c.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Biaya per Tiket :{" "}
                              <span className="bg-yellow-20 px-1">
                                Rp{" "}
                                {data?.pricing.perTicket?.toLocaleString(
                                  "id-ID",
                                )}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              d.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Biaya onsite pemasangan :{" "}
                              <span className="bg-yellow-20 px-1">
                                Rp{" "}
                                {data?.pricing.onsiteInstallation?.toLocaleString(
                                  "id-ID",
                                )}
                              </span>{" "}
                              (1 kali saat instalasi)
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              e.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Biaya onsite pembongkaran :{" "}
                              <span className="bg-yellow-20 px-1">
                                Rp{" "}
                                {data?.pricing.onsiteRemoval?.toLocaleString(
                                  "id-ID",
                                )}
                              </span>{" "}
                              (1 kali saat pembongkaran)
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              f.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Biaya onsite perbaikan :{" "}
                              <span className="bg-yellow-20 px-1">
                                Rp{" "}
                                {data?.pricing.onsiteRepair?.toLocaleString(
                                  "id-ID",
                                )}
                              </span>{" "}
                              (per mesin per bulan)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    4.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Biaya biaya diatas diluar kirim dan sparepart.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    5.
                  </td>
                  <td className="align-top py-2">
                    <div>
                      <p className="text-justify mb-2">
                        Pembayaran layanan oleh PIHAK KEDUA melalui transfer
                        rekening yang disediakan oleh PIHAK PERTAMA yaitu:
                      </p>
                      <table className="w-full ml-4">
                        <tbody>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              a.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Nama Bank :{" "}
                              <span className="bg-yellow-20 px-1">
                                {data?.bankDetails.bankName}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              b.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Cabang :{" "}
                              <span className="bg-yellow-20 px-1">
                                {data?.bankDetails.branch}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              c.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Nomer rekening :{" "}
                              <span className="bg-yellow-20 px-1">
                                {data?.bankDetails.accountNumber}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top py-1 pr-3 w-6 text-right">
                              d.
                            </td>
                            <td className="align-top py-1 text-justify">
                              Atas Nama :{" "}
                              <span className="bg-yellow-20 px-1">
                                {data?.bankDetails.accountHolder}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    6.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK PERTAMA akan menerbitkat tagihan berserta faktur pajak
                    setiap tanggal I (satu) setiap bulan dilengkapi dengan
                    detail transaksi penggunaan layanan.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    7.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Pembayaran paling lambat dilakukan 14 hari kalender setelah
                    tanggal faktur diterbitkan PIHAK PERTAMA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    8.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Pembayaran dianggap sah setelah pembayaran sudah diterima
                    direkening PIHAK PERTAMA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    9.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Denda keterlambatan 1 permil setiap hari keterlambatan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 4 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 4<br />
              GARANSI LAYANAN
            </h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK PERTAMA memberikan garansi layanan dan perawatan
                    system Produk Aplikasi &quot;Service HUB&quot; selama
                    kerjasama berlangsung.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK PERTAMA menjamin uptime server 99% selama 7x24 jam.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK PERTAMA menyediakan cadangan database secara berkala.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    4.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK PERTAMA memastikan cadangan database dapat dipulihkan
                    kembali yang disebabkan oleh kegagalan system bukan karena
                    kesalahan pengguna.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 5 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 5<br />
              TANGUNG JAWAB PIHAK PERTAMA
            </h3>
            <div className="mb-3">
              <p className="text-justify">
                PIHAK PERTAMA bertanggung jawab kepada PIHAK KEDUA beberapa hal
                berikut ini selama perjanjian:
              </p>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Membantu migrasi basis data pelanggan PIHAK KEDUA ke dalam
                    aplikasi dengan format yang sesuai dengan produk aplikasi
                    PIHAK PERTAMA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Menyediakan fitur khusus untuk penambahan data secara
                    mandiri untuk PIHAK KEDUA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Memberikan(mengaktifkan) semua fitur layanan yang ada
                    didalam Aplikasi.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    4.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Memberikan Akses layanan aplikasi baik ke Teknisi, Pelanggan
                    dan PIHAK KEDUA.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    5.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Memberikan uji coba gratis selama 1bulan
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    6.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Evaluasi aplikasi secara berkala dengan PIHAK KEDUA secara
                    periodik terkait proses dan semua fitur untuk penyempurnaan
                    layanan Aplikasi.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    7.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Pelatihan penggunaan Aplikasi kepada PIHAK KEDUA untuk
                    administrator dan teknisi.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    8.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Menjaga Kerahasiaan basis data PIHAK KEDUA.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 6 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 6<br />
              TANGGUNG JAWAB PIHAK KEDUA
            </h3>
            <div className="mb-3">
              <p className="text-justify">
                PIHAK KEDUA bersedia menjalankan kewajiban, sebagai berikut:
              </p>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Menerbitkan Surat Perintah Kerja (SPK) dan menandatangani
                    surat Perjanjian Kerjasama ini.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Melakukan kewajiban pembayaran tepat waktu kepada PIHAK
                    PERTAMA atas layanan yang sudah digunakan
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Menjaga kerahasiaan informasi terkait username, password dan
                    semua fitur yang tersedia didalam aplikasi kepada pihak lain
                    sesuai Undang-undang no.28 tahun 2014 tentang Hak Cipta (Hak
                    Kekayaan Intelektual)
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    4.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Melaporkan semua kendala yang berkaitan dengan implementasi
                    produk aplikasi &quot;Service HUB&quot; kepada PIHAK
                    PERTAMA.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 7 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 7<br />
              PENGAKHIRAN KERJASAMA
            </h3>
            <div className="mb-3">
              <p className="text-justify">
                PIHAK PERTAMA berhak mengahiri kerjasama ini dengan tanpa
                memberikan ganti rugi apapun kepada PIHAK KEDUA bila:
              </p>
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK KEDUA memberikan informasi maupun skema aplikasi
                    kepada pihak lain.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK KEDUA tidak menjalankan kewajiban dan semua isi dalam
                    perjanjian ini.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    PIHAK KEDUA melakukan tindakan diluar kesepakatan yang dapat
                    merugikan material maupun immaterial bagi PIHAK PERTAMA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 8 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 8<br />
              KEADAAN DARURAT/BENCANA DAN KEJADIAAN YANG TIDAK TERDUGA
            </h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    KEDUA PIHAK tidak bertanggung jawab untuk kondisi yang
                    disebabkan oleh atau diluar kekuasaan dan kemampuannya
                    termasuk tetapi tidak terbatas pada: Jaringan Internet
                    terganggu, Server Down dan terkena Hack, Bencana Alam,
                    Pertempuran, Kebakaran, Huru Hara dan segala sesuatu yang
                    menghambat pelaksanaan Perjanjian ini serta kebijakan
                    pemerintah yang secara langsung berpengaruh terhadap
                    pelaksanaan Perjanjian ini.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Dalam Hal terjadinya Keadaan Darurat/Bencana, KEDUA PIHAK
                    wajib memberitahu secara tertulis tentang terjadinya keadaan
                    tersebut kepada PARA PIHAK selambat-lambatnya dalam waktu 24
                    (Duapuluh empat) jam terhitung sejak terjadinya
                    Darurat/Bencana tersebut dengan melampirkan pemberitaan
                    resmi dari instansi terkait dan membuat antisipasi terkait
                    pelakanaan perjanjian yang sudah disepakati.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Apabila PARA PIHAK yang terkena kondisi keadaan
                    Darurat/Bencana tidak melaksanaan sebagaimana yang sudah
                    ditentukan dalam Ayat 2 diatas maka kondisi tersebut tidak
                    diakui oleh PARA PIHAK yang mengalamikeadaan
                    Darurat/bencana.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 9 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 9<br />
              HUKUM YANG MENGATUR DAN PENYELESAIAN PERSELISIHAN
            </h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Apabila terjadi perselisihan diantara KEDUA PIHAK yang
                    mungkin timbul akibat dan penafsiran dan atau pelaksanaan
                    perjanjian ini, maka diupayakan untuk diselesaikan terlebih
                    dahulu secara Musyawarah untuk Mufakat.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Apabila menyelesaikan perselisihan secara musyawarah untuk
                    mufakat sebagaimana dalam Ayat I pasal ini tidak dapat
                    menyelesaikan perselisihan dalam Jangka waktu 20 (dua puluh
                    hari) hari Kerja sejak musyawarah dilakukan, maka KEDUA
                    PIHAK sepakat untuk menyelesaikan melalui yuridiksi
                    non-eksklusif di pengadilan Depok Jawa Barat, Indonesia.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 10 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 10
              <br />
              KETENTUAN-KETENTUAN LAIN
            </h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    1.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Hal-hal yang tidak atau belum diatur atau
                    perubahan-perubahan dalam perjanjian ini akan ditetapkan
                    oleh KEDUA PIHAK secara musyawarah dengan membuat suatu
                    Addendum yang merupakan satu kesatuan dan tidak dapat
                    dipisahkan dalam perjanjian.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    2.
                  </td>
                  <td className="align-top py-2 text-justify">
                    Perjanjian ini tidak dapat diubah, baik untuk seluruh nya
                    maupun untuk sebagian, kecuali apabila perubahan tersebut
                    dalam suatu perjanjian tertulis yang ditandatangani oleh
                    KEDUA PIHAK dalam perjanjian ini, dengan tidak mengurangi
                    ketentuan perundangan yang berlaku.
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-2 pr-4 w-8 text-right font-medium">
                    3.
                  </td>
                  <td className="align-top py-2 text-justify">
                    KEDUA PIHAK tidak diperkenankan untuk mengalihkan hak dan
                    kewajiban nya kecuali apabila perubahan tersebut dibuat
                    dalam suatu perjanjian tertulis yang ditandatangani
                    berdasarakan perjanjian ini, baik sebagian maupun seluruh
                    nya, kepada PIHAK KETIGA selama berlangsungnya perjanjian
                    ini, tanpa persetujuan tertulis dari salah satu PARA PIHAK.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Article 11 */}
          <div>
            <h3 className="text-base font-bold mb-3 text-center">
              PASAL 11
              <br />
              PENUTUP
            </h3>
            <p className="pl-4">
              Perjanjian ini dibuat dan ditandatangani di Jakarta pada hari ini
              dan tanggal sebagaimana tersebut di atas dalam rangkap 2 (dua) dan
              bermaterai cukup serta keduanya mempunyai kekuatan hukum yang
              sama.
            </p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-20 pt-20">
          <p className="font-bold mb-12">
            DISEPAKATI DI :{" "}
            <span className="bg-yellow-20 px-1">{data?.signingLocation}</span>,{" "}
            <span className="bg-yellow-20 px-1">{data?.signingDate}</span>
          </p>

          <div className="flex justify-between mt-8">
            <div className="text-center">
              <p className="font-bold mb-1.5">PIHAK PERTAMA</p>
              <p className="font-bold">{data?.firstParty.companyName}</p>
              <div className="mt-20 w-48 mb-2"></div>
              <p className="bg-yellow-20 px-1 inline-block">
                {data?.firstParty.representative}
              </p>
              <p>{data?.firstParty.position}</p>
            </div>

            <div className="text-center">
              <p className="font-bold mb-1.5">PIHAK KEDUA</p>
              <p className="font-bold bg-yellow-20 px-1">
                {data?.secondParty.companyName}
              </p>
              <div className="mt-20 w-48 mb-2"></div>
              <p className="bg-yellow-20 px-1 inline-block">
                {data?.secondParty.representative}
              </p>
              <p className="bg-yellow-20 px-1 inline-block">
                {data?.secondParty.position}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractViewer;
