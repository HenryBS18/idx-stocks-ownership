<script setup lang="ts">
const questions = [
  { title: 'Dari mana data kepemilikan saham berasal?', answer: 'Data bersumber dari Pengumuman Bursa ‘Semua Emiten Saham’ yang diterbitkan Bursa Efek Indonesia (BEI). Aplikasi menyajikan nama investor, jumlah saham, dan persentase kepemilikan yang tercatat dalam data tersebut.' },
  { title: 'Kapan data kepemilikan saham diperbarui?', answer: 'Data mengikuti pengumuman bulanan BEI dan tersedia setelah dimasukkan ke aplikasi. Periode terbaru yang tersedia ditampilkan di beranda. Pilih periode di halaman Saham atau Investor untuk membaca data bulan lain.' },
  { title: 'Bagaimana menelusuri saham dan portofolio investor?', answer: 'Cari kode atau nama emiten di beranda untuk membuka rincian kepemilikannya. Klik nama investor yang memiliki tautan untuk melihat portofolionya, lalu klik kode saham untuk membuka emiten lain. Tautan pada cuplikan terbaru membuka periode yang ditampilkan. Saat berpindah antarhalaman detail, periode pilihanmu tetap digunakan.' },
  { title: 'Apa arti label Pengendali dan Afiliasi?', answer: 'Label menunjukkan klasifikasi pengendali atau afiliasi yang tercantum dalam data sumber untuk kepemilikan pada emiten dan periode tersebut. Aplikasi tidak menyimpulkannya dari nama investor atau besarnya persentase saham. Tanpa label berarti klasifikasi tidak ditampilkan, bukan kepastian bahwa investor bukan pengendali atau afiliasi.' },
  { title: 'Bagaimana membaca perubahan kepemilikan?', answer: 'Selisih dihitung terhadap periode sebelumnya yang tersedia, dalam poin persentase (pp). Misalnya, kepemilikan dari 5% menjadi 6% naik 1 pp. Baru tercatat atau tidak lagi tercatat menunjukkan perubahan keberadaan dalam dataset, bukan konfirmasi transaksi beli atau jual. Tanpa data periode pembanding, perubahan belum dapat ditampilkan.' },
  { title: 'Bagaimana aplikasi menghitung free float saham?', answer: 'Aplikasi menjumlahkan persentase kepemilikan investor yang tercatat untuk satu emiten pada periode pilihanmu, lalu menguranginya dari 100%. Hasil ditampilkan dengan pembulatan dua desimal. Angka ini merupakan perhitungan aplikasi, bukan penetapan free float resmi BEI.' },
  { title: 'Apakah cek kepemilikan saham di sini gratis?', answer: 'Ya. Kamu bisa mencari emiten, menelusuri investor, dan melihat periode data yang tersedia secara gratis tanpa membuat akun.' },
]

const open = ref<number[]>([])

const toggle = (i: number) => {
  open.value = open.value.includes(i) ? [] : [i]
}
</script>

<template>
  <div class="divide-y divide-accented border-y border-accented">
    <article v-for="(question, i) in questions" :key="question.title" class="py-1">
      <button type="button" :aria-expanded="open.includes(i)" :aria-controls="`faq-accordion-panel-${i}`"
        class="faq-question flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg py-5 text-start text-sm font-semibold text-highlighted
          lg:py-[clamp(1rem,2svh,1.25rem)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        @click="toggle(i)">
        <span>{{ question.title }}</span>
        <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 transition-transform"
          :class="{ 'rotate-180': open.includes(i) }" aria-hidden="true" />
      </button>

      <Transition enter-active-class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        enter-from-class="grid-rows-[0fr]" enter-to-class="grid-rows-[1fr]"
        leave-active-class="grid transition-[grid-template-rows] duration-250 ease-in motion-reduce:transition-none"
        leave-from-class="grid-rows-[1fr]" leave-to-class="grid-rows-[0fr]">
        <div v-show="open.includes(i)" :id="`faq-accordion-panel-${i}`" class="grid">
          <div class="min-h-0 overflow-hidden">
            <p class="pb-5 pr-5 text-sm leading-relaxed text-toned lg:text-base">{{ question.answer }}</p>
          </div>
        </div>
      </Transition>
    </article>
  </div>
</template>
