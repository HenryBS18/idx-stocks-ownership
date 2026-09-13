<script setup lang="ts">
import { DATA_LICENSE_PATH, IDX_SOURCE_URL, PRIVACY_EFFECTIVE, PRIVACY_NAME, REPORT_EMAIL } from '~/utils/constants'

const route = useRoute()

const siteConfig = useSiteConfig()

const REPORT_URL = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent('Pertanyaan privasi — IDX Stocks Ownership')}`

const collected = [
  'Cookie teknis bernama token di halaman Saham dan Investor — berisi pengenal acak yang berganti tiap hari, bukan identitas Anda.',
  'Statistik kunjungan lewat Google Analytics: halaman yang dibuka, jenis perangkat dan peramban, serta perkiraan lokasi setingkat kota.',
  'Alamat IP Anda selama 60 detik untuk membatasi jumlah permintaan ke API.',
  'Pilihan tema terang atau gelap, tersimpan di peramban Anda sendiri.',
]

const notCollected = [
  'Nama, alamat email, nomor telepon, atau data pengenal lain — tidak ada formulir yang meminta semua itu.',
  'Akun atau kata sandi. Situs ini memang tidak punya sistem akun.',
  'Teks yang Anda ketik di kolom pencarian Saham dan Investor — penyaringan terjadi di peramban, tidak pernah dikirim ke server kami.',
  'Catatan pengunjung di basis data. Basis data kami hanya berisi data kepemilikan saham.',
]

useHead({
  link: [
    { rel: 'canonical', key: 'canonical', href: `${siteConfig.url}${route.path}` },
  ],
})

useSeoMeta({
  title: 'Kebijakan Privasi | IDX Stocks Ownership',
  description: 'Apa yang dikumpulkan dan tidak dikumpulkan IDX Stocks Ownership: cookie teknis, statistik kunjungan, dan alamat IP untuk pembatasan laju. Tanpa akun, tanpa formulir.',
  ogTitle: 'Kebijakan Privasi | IDX Stocks Ownership',
  ogDescription: 'Tanpa akun, tanpa formulir, tanpa catatan pengunjung di basis data. Ini rincian jujur sisanya.',
  ogUrl: `${siteConfig.url}/privasi`,
})
</script>

<template>
  <main>
    <section class="px-4 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14" aria-labelledby="privasi-heading">
      <div class="mx-auto w-full max-w-7xl">
        <h1 id="privasi-heading"
          class="max-w-4xl text-balance font-bold text-highlighted text-[clamp(1.875rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.02em]">
          {{ PRIVACY_NAME }}
        </h1>

        <p class="mt-5 sm:mt-6 max-w-[65ch] text-base text-default leading-relaxed">
          Situs ini tidak punya sistem akun dan tidak punya satu pun formulir yang meminta data pribadi.
          Basis data kami hanya berisi data kepemilikan saham — tidak ada satu pun tabel tentang pengunjung.
          Sisanya, yang memang tetap terjadi, dijelaskan apa adanya di bawah ini.
        </p>

        <p class="mt-3 max-w-[80ch] text-[13px] md:text-sm text-toned leading-relaxed">
          Berlaku sejak {{ PRIVACY_EFFECTIVE }}.
        </p>
      </div>
    </section>

    <div class="border-t border-accented px-4 lg:px-8 py-14 sm:py-20">
      <div class="mx-auto w-full max-w-7xl flex flex-col gap-y-12 sm:gap-y-14">
        <section aria-labelledby="dikumpulkan-heading">
          <h2 id="dikumpulkan-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            1. Yang dikumpulkan
          </h2>

          <ul class="mt-4 flex flex-col gap-y-2.5">
            <li v-for="item in collected" :key="item" class="flex max-w-[65ch] gap-x-2.5">
              <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-toned" aria-hidden="true" />
              <span class="text-sm sm:text-base text-default leading-relaxed">{{ item }}</span>
            </li>
          </ul>

          <p class="mt-4 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Cookie <span class="font-semibold text-highlighted">token</span> hanya muncul kalau Anda membuka
            halaman Saham atau Investor. Kalau Anda hanya membaca beranda, halaman lisensi, atau halaman ini,
            situs tidak menaruh cookie apa pun dari pihak kami.
          </p>
        </section>

        <section aria-labelledby="tidak-dikumpulkan-heading">
          <h2 id="tidak-dikumpulkan-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            2. Yang tidak dikumpulkan
          </h2>

          <ul class="mt-4 flex flex-col gap-y-2.5">
            <li v-for="item in notCollected" :key="item" class="flex max-w-[65ch] gap-x-2.5">
              <UIcon name="i-lucide-x" class="mt-1 size-4 shrink-0 text-toned" aria-hidden="true" />
              <span class="text-sm sm:text-base text-default leading-relaxed">{{ item }}</span>
            </li>
          </ul>

          <p class="mt-4 max-w-[80ch] text-[13px] md:text-sm text-toned leading-relaxed">
            Kode situs ini juga tidak menulis catatan apa pun ke log aplikasi — tidak ada IP, alamat halaman,
            maupun isi permintaan yang kami simpan sendiri.
          </p>
        </section>

        <section aria-labelledby="analytics-heading">
          <h2 id="analytics-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            3. Soal Google Analytics
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Analytics hanya berjalan di situs versi publik, tidak saat pengembangan. Google menyetel cookie
            miliknya sendiri (bernama <span class="font-semibold text-highlighted">_ga</span> dan sejenisnya,
            umumnya bertahan dua tahun) untuk membedakan satu kunjungan dari kunjungan lain.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Google menerima alamat IP Anda dan memakainya untuk memperkirakan lokasi setingkat kota. Google
            menyatakan IP pengunjung dari Uni Eropa, Inggris, dan Swiss dibuang sebelum dicatat; untuk wilayah
            lain Google tidak merinci hal yang sama. Kami sendiri tidak memasang penyamaran IP tambahan, dan
            tidak memasang mekanisme persetujuan cookie — jadi Analytics aktif sejak halaman dibuka.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Satu hal yang perlu Anda tahu terus terang: ketika Anda memilih sebuah emiten dari kolom pencarian
            di beranda, kode emiten itu ikut masuk ke alamat halaman tujuan. Karena Analytics mencatat alamat
            halaman, kode emiten yang Anda pilih ikut terekam di sana. Teks yang Anda ketik sendiri tidak ikut.
          </p>
        </section>

        <section aria-labelledby="ip-heading">
          <h2 id="ip-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            4. Alamat IP dan pembatasan laju
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Supaya layanan tidak tumbang karena permintaan bertubi-tubi, setiap permintaan ke API dihitung per
            alamat IP. Alamat IP Anda dipakai sebagai penanda hitungan itu dan hilang dengan sendirinya
            <span class="font-semibold text-highlighted">60 detik</span> setelah permintaan terakhir. Yang
            tersimpan bersama penanda itu hanya satu angka: berapa kali permintaan datang. Tidak ada halaman
            yang Anda buka, tidak ada isi permintaan.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Identitas peramban (User-Agent) dibaca sekilas untuk menolak permintaan tanpa identitas, tapi tidak
            kami simpan. Khusus permintaan yang mengaku sebagai perayap Google, alamat IP-nya diperiksa balik
            ke layanan DNS untuk memastikan pengakuan itu benar.
          </p>
        </section>

        <section aria-labelledby="pihak-ketiga-heading">
          <h2 id="pihak-ketiga-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            5. Pihak ketiga
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Situs ini tidak memuat font dari luar, tidak memuat gambar dari jaringan pengantar konten, dan
            tidak memuat skrip pihak ketiga selain yang disebut di sini.
          </p>

          <dl class="mt-5 divide-y divide-accented border-y border-accented">
            <div class="flex flex-col gap-y-0.5 py-3 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">GOOGLE ANALYTICS</dt>
              <dd class="max-w-[60ch] text-sm text-default leading-relaxed">
                Menerima alamat IP, identitas peramban, alamat halaman, dan halaman perujuk.
              </dd>
            </div>

            <div class="flex flex-col gap-y-0.5 py-3 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">VERCEL</dt>
              <dd class="max-w-[60ch] text-sm text-default leading-relaxed">
                Tempat situs ini ditumpangkan. Log akses penyedia hosting lazimnya memuat alamat IP, identitas
                peramban, dan alamat lengkap yang diminta.
              </dd>
            </div>

            <div class="flex flex-col gap-y-0.5 py-3 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">LAYANAN IKON</dt>
              <dd class="max-w-[60ch] text-sm text-default leading-relaxed">
                Ikon disajikan dari server kami sendiri. Sebuah layanan ikon pihak ketiga terdaftar sebagai
                cadangan dan baru dihubungi bila penyajian dari sisi kami gagal.
              </dd>
            </div>
          </dl>

          <p class="mt-4 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Tautan keluar ke situs Bursa Efek Indonesia dan ke akun media sosial pengelola baru menghubungi
            pihak tersebut kalau Anda mengekliknya.
          </p>
        </section>

        <section aria-labelledby="dasar-heading">
          <h2 id="dasar-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            6. Dasar dan tujuan pemrosesan
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Mengacu Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, pemrosesan yang
            dijelaskan di atas dilakukan untuk dua kepentingan yang sah: menjaga layanan tetap dapat diakses
            semua orang (pembatasan laju), dan memahami bagian mana dari situs yang berguna sehingga bisa
            diperbaiki (statistik kunjungan). Tidak ada data yang diperjualbelikan, dan tidak ada profil
            pribadi yang disusun.
          </p>
        </section>

        <section aria-labelledby="masa-simpan-heading">
          <h2 id="masa-simpan-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            7. Berapa lama disimpan
          </h2>

          <dl class="mt-4 divide-y divide-accented border-y border-accented">
            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">COOKIE TOKEN</dt>
              <dd class="text-sm text-default">1 hari</dd>
            </div>

            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">PENANDA LAJU (IP)</dt>
              <dd class="text-sm text-default">60 detik sejak permintaan terakhir</dd>
            </div>

            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">DATA ANALYTICS</dt>
              <dd class="text-sm text-default">Mengikuti masa simpan yang ditetapkan Google</dd>
            </div>

            <div class="flex flex-col gap-y-0.5 py-2.5 sm:grid sm:grid-cols-[11rem_1fr] sm:items-baseline sm:gap-x-6">
              <dt class="text-[13px] font-medium text-muted">PILIHAN TEMA</dt>
              <dd class="text-sm text-default">Sampai Anda membersihkan data peramban</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="hak-heading">
          <h2 id="hak-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            8. Hak Anda
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            UU PDP memberi Anda hak untuk mengetahui, mengakses, memperbaiki, menghapus, menarik persetujuan,
            dan mengajukan keberatan atas pemrosesan data pribadi Anda.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Perlu dikatakan terus terang bagaimana hak itu bekerja di sini: kami tidak menyimpan identitas
            pengunjung sama sekali, sehingga kami juga tidak punya cara untuk menemukan "data Anda" lalu
            menunjukkan atau menghapusnya — sebab memang tidak ada yang tersimpan atas nama siapa pun. Untuk
            data yang berada di Google Analytics, permintaan semacam itu perlu diajukan ke Google sebagai
            pihak yang menyimpannya. Cara paling langsung menghentikan pengumpulan dari sisi Anda ada di
            pasal berikutnya.
          </p>
        </section>

        <section aria-labelledby="menolak-heading">
          <h2 id="menolak-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            9. Cara menolak pelacakan
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Situs ini belum menyediakan tombol penolakan sendiri. Yang bisa Anda lakukan sekarang: memblokir
            atau menghapus cookie lewat pengaturan peramban, memasang pengaya penolakan Google Analytics dari
            Google, atau memakai pemblokir skrip. Menolak Analytics tidak mengurangi apa pun dari isi situs —
            seluruh data tetap bisa dibaca seperti biasa.
          </p>
        </section>

        <section aria-labelledby="data-orang-heading">
          <h2 id="data-orang-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            10. Nama orang di dalam data
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Perlu dibedakan dari semua di atas: data kepemilikan saham yang ditampilkan situs ini memuat nama
            pemegang saham, termasuk perorangan. Nama-nama itu bukan berasal dari pengunjung, melainkan dari
            <a :href="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer"
              aria-label="Pengumuman kepemilikan saham di situs IDX (buka di tab baru)"
              class="inline-flex items-center gap-x-1.5 py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">pengumuman
              resmi Bursa Efek Indonesia
              <UIcon name="i-lucide-external-link" class="size-3.5 shrink-0" aria-hidden="true" />
            </a>
            yang memang diterbitkan untuk umum, dan disajikan ulang tanpa ditambah keterangan apa pun dari kami.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Kalau Anda merasa nama Anda muncul secara keliru, atau ingin mengajukan keberatan atas
            penyajiannya di situs ini, hubungi kami lewat surel di pasal 12. Perlu diingat bahwa pengumuman
            aslinya tetap ada di Bursa Efek Indonesia dan berada di luar kendali kami — ketentuan pemakaian
            data selengkapnya ada di
            <NuxtLink :to="DATA_LICENSE_PATH"
              class="inline-block py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Ketentuan Penggunaan Data</NuxtLink>.
          </p>
        </section>

        <section aria-labelledby="perubahan-privasi-heading">
          <h2 id="perubahan-privasi-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            11. Perubahan kebijakan
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Kalau cara situs ini memperlakukan data berubah, halaman ini yang diperbarui lebih dulu, beserta
            tanggal berlakunya. Versi yang berlaku adalah yang sedang Anda baca.
          </p>
        </section>

        <section aria-labelledby="kontak-privasi-heading">
          <h2 id="kontak-privasi-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            12. Kontak
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Pengendali data untuk situs ini adalah pengelola IDX Stocks Ownership. Pertanyaan, keberatan, atau
            permintaan terkait privasi bisa dikirim ke
            <a :href="REPORT_URL" aria-label="Kirim email pertanyaan privasi"
              class="inline-block py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{{ REPORT_EMAIL }}</a>.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>
