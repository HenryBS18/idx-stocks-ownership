<script setup lang="ts">
import { DATA_LICENSE_EFFECTIVE, DATA_LICENSE_NAME, IDX_SOURCE_URL, REPORT_EMAIL } from '~/utils/constants'

const route = useRoute()

const siteConfig = useSiteConfig()

const REPORT_URL = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent('Pertanyaan lisensi — IDX Stocks Ownership')}`

const allowed = [
  'Menyalin dan menyimpan data, sebagian maupun seluruhnya.',
  'Mengolah, menyaring, menggabungkan dengan sumber lain, dan menghitung ulang.',
  'Menerbitkan ulang dalam artikel, laporan riset, skripsi, utas media sosial, atau produk Anda sendiri.',
  'Membuat karya turunan seperti grafik, visualisasi, ringkasan, atau bahan latih model.',
  'Memakainya untuk keperluan komersial maupun non-komersial, tanpa biaya.',
]

const forbidden = [
  'Mengaku sebagai sumber asli data, atau menghilangkan jejak dari mana data berasal.',
  'Menyajikannya sebagai data resmi Bursa Efek Indonesia — ini hasil penyusunan ulang oleh pihak ketiga.',
  'Menyiratkan bahwa pemakaian Anda didukung, diperiksa, atau berafiliasi dengan Bursa Efek Indonesia maupun situs ini.',
  'Menyatakan atau menjanjikan bahwa angkanya akurat, lengkap, atau layak dijadikan dasar keputusan investasi.',
]

useHead({
  link: [
    { rel: 'canonical', key: 'canonical', href: `${siteConfig.url}${route.path}` },
  ],
})

useSeoMeta({
  title: 'Ketentuan Penggunaan Data | IDX Stocks Ownership',
  description: 'Ketentuan penggunaan data kepemilikan saham dan free float di IDX Stocks Ownership. Bebas disalin, diolah, dan diterbitkan ulang selama mencantumkan atribusi.',
  ogTitle: 'Ketentuan Penggunaan Data | IDX Stocks Ownership',
  ogDescription: 'Bebas disalin, diolah, dan diterbitkan ulang — komersial maupun tidak — selama mencantumkan atribusi.',
  ogUrl: `${siteConfig.url}/lisensi`,
})
</script>

<template>
  <main>
    <section class="px-4 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14" aria-labelledby="lisensi-heading">
      <div class="mx-auto w-full max-w-7xl">
        <h1 id="lisensi-heading"
          class="max-w-4xl text-balance font-bold text-highlighted text-[clamp(1.875rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.02em]">
          {{ DATA_LICENSE_NAME }}
        </h1>

        <p class="mt-5 sm:mt-6 max-w-[65ch] text-base text-default leading-relaxed">
          Data di situs ini disusun ulang dari pengumuman publik agar bisa dibaca. Kami ingin data itu
          dipakai, bukan dikunci — jadi Anda bebas menyalin, mengolah, dan menerbitkannya ulang, untuk
          keperluan komersial maupun tidak, selama sumbernya dicantumkan.
        </p>

        <p class="mt-3 max-w-[80ch] text-[13px] md:text-sm text-toned leading-relaxed">
          Berlaku sejak {{ DATA_LICENSE_EFFECTIVE }}.
        </p>
      </div>
    </section>

    <div class="border-t border-accented px-4 lg:px-8 py-14 sm:py-20">
      <div class="mx-auto w-full max-w-7xl flex flex-col gap-y-12 sm:gap-y-14">
        <section aria-labelledby="ruang-lingkup-heading">
          <h2 id="ruang-lingkup-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            1. Apa yang dicakup ketentuan ini
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Yang kami lisensikan adalah hasil kerja situs ini: kompilasi, perapian, penggabungan antarbulan,
            serta angka turunan seperti free float dan selisih kepemilikan — termasuk cara semuanya disajikan
            dalam tabel dan ringkasan di sini.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Yang tidak kami lisensikan adalah pengumuman asli Bursa Efek Indonesia. Berkas aslinya bukan
            milik kami dan tidak bisa kami atur pemakaiannya. Lihat pasal 6.
          </p>
        </section>

        <section aria-labelledby="boleh-heading">
          <h2 id="boleh-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            2. Yang boleh Anda lakukan
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Tanpa perlu meminta izin lebih dulu, Anda boleh:
          </p>

          <ul class="mt-4 flex flex-col gap-y-2.5">
            <li v-for="item in allowed" :key="item" class="flex max-w-[65ch] gap-x-2.5">
              <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
              <span class="text-sm sm:text-base text-default leading-relaxed">{{ item }}</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="atribusi-heading">
          <h2 id="atribusi-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            3. Satu syarat: atribusi
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Di mana pun data ini Anda pakai, sebutkan <span class="font-semibold text-highlighted">IDX Stocks
              Ownership</span> sebagai sumber dan sertakan tautan balik ke situs ini. Kalau medianya tidak
            memungkinkan tautan aktif — misalnya cetak atau video — cukup tulis alamatnya.
          </p>

          <p class="mt-4 max-w-[65ch] rounded-md border border-accented px-4 py-3 text-sm text-default leading-relaxed">
            Sumber: <span class="font-semibold text-highlighted">IDX Stocks Ownership</span>
            ({{ siteConfig.url }}), diolah dari pengumuman resmi Bursa Efek Indonesia.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Kalau Anda mengubah, menyaring, atau menghitung ulang angkanya, sebutkan juga bahwa data telah
            diolah — supaya pembaca tahu angka yang mereka lihat bukan apa adanya dari situs ini.
          </p>
        </section>

        <section aria-labelledby="tidak-boleh-heading">
          <h2 id="tidak-boleh-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            4. Yang tidak boleh
          </h2>

          <ul class="mt-4 flex flex-col gap-y-2.5">
            <li v-for="item in forbidden" :key="item" class="flex max-w-[65ch] gap-x-2.5">
              <UIcon name="i-lucide-x" class="mt-1 size-4 shrink-0 text-error" aria-hidden="true" />
              <span class="text-sm sm:text-base text-default leading-relaxed">{{ item }}</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="akurasi-heading">
          <h2 id="akurasi-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            5. Akurasi dan penafian
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Data disajikan apa adanya, tanpa jaminan apa pun. Proses penyusunan ulang bisa keliru, pengumuman
            bisa terlambat masuk, dan angka bisa berbeda dari sumber resmi. Untuk keperluan yang menuntut
            kepastian, verifikasi langsung ke pengumuman resmi Bursa Efek Indonesia.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Angka di sini bukan saran investasi. Segala keputusan yang Anda ambil berdasarkan data ini
            menjadi tanggung jawab Anda sendiri, dan kami tidak menanggung kerugian yang timbul dari
            pemakaiannya.
          </p>

          <p class="mt-3 max-w-[80ch] text-[13px] md:text-sm text-toned leading-relaxed">
            Menemukan angka yang keliru? Beri tahu kami lewat kontak di pasal 8 — laporan seperti itu yang
            membuat datanya membaik.
          </p>
        </section>

        <section aria-labelledby="sumber-lisensi-heading">
          <h2 id="sumber-lisensi-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            6. Sumber dan hak pihak ketiga
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Seluruh angka berasal dari
            <a :href="IDX_SOURCE_URL" target="_blank" rel="noopener noreferrer"
              aria-label="Data kepemilikan saham di situs IDX (buka di tab baru)"
              class="inline-flex items-center gap-x-1.5 py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">pengumuman
              kepemilikan saham bulanan Bursa Efek Indonesia
              <UIcon name="i-lucide-external-link" class="size-3.5 shrink-0" aria-hidden="true" />
            </a>, dan hak atas pengumuman itu tetap berada pada penerbitnya.
          </p>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Situs ini tidak berafiliasi dengan dan tidak didukung oleh Bursa Efek Indonesia. Ketentuan ini
            hanya mengatur apa yang kami sendiri berhak atur, dan tidak melampaui hak siapa pun atas materi
            aslinya.
          </p>
        </section>

        <section aria-labelledby="perubahan-heading">
          <h2 id="perubahan-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            7. Perubahan ketentuan
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Ketentuan ini bisa berubah sewaktu-waktu, dan versi yang berlaku adalah yang tampil di halaman
            ini. Perubahan tidak berlaku surut: apa yang sudah Anda terbitkan dengan atribusi yang benar
            tetap sah menurut ketentuan yang berlaku saat itu.
          </p>
        </section>

        <section aria-labelledby="kontak-heading">
          <h2 id="kontak-heading" class="text-xl sm:text-2xl font-bold text-highlighted text-balance">
            8. Kontak
          </h2>

          <p class="mt-3 max-w-[65ch] text-sm sm:text-base text-default leading-relaxed">
            Pertanyaan soal ketentuan ini, permintaan pemakaian di luar cakupannya, atau laporan data keliru
            bisa dikirim ke
            <a :href="REPORT_URL" aria-label="Kirim email pertanyaan lisensi"
              class="inline-block py-3.5 -my-3.5 rounded-sm font-medium text-highlighted underline decoration-current underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{{ REPORT_EMAIL }}</a>.
          </p>
        </section>
      </div>
    </div>
  </main>
</template>
