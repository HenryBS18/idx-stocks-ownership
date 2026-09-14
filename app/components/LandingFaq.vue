<script setup lang="ts">
const questions = [
  { title: 'Dari mana data kepemilikan ini berasal?', answer: 'Data bersumber dari Pengumuman Bursa “Semua Emiten Saham” yang diterbitkan Bursa Efek Indonesia (BEI). Aplikasi menyajikan nama investor, jumlah saham, dan persentase kepemilikan dari pengumuman tersebut.' },
  { title: 'Kapan data diperbarui?', answer: 'Data mengikuti pengumuman bulanan BEI dan tersedia setelah dimasukkan ke aplikasi. Periode terbaru ditampilkan di beranda. Pilih periode di halaman Saham atau Investor untuk membaca data bulan lain.' },
  { title: 'Bagaimana aplikasi menghitung free float?', answer: 'Aplikasi menjumlahkan persentase seluruh investor yang tercatat untuk satu emiten pada periode terpilih, lalu menguranginya dari 100%. Hasil dibulatkan menjadi dua desimal. Angka ini merupakan perhitungan aplikasi dari data yang diumumkan, bukan penetapan free float resmi BEI. Grafik memakai total seluruh investor, meskipun tabel cuplikan hanya menampilkan sebagian.' },
  { title: 'Apakah saya perlu membuat akun?', answer: 'Tidak. Kamu bisa mencari emiten, menelusuri investor, dan melihat periode data yang tersedia secara gratis tanpa membuat akun.' },
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
        class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg py-5 text-start text-sm font-semibold text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        @click="toggle(i)">
        <span>{{ question.title }}</span>
        <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 transition-transform"
          :class="{ 'rotate-180': open.includes(i) }" aria-hidden="true" />
      </button>

      <Transition enter-active-class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        enter-from-class="grid-rows-[0fr]" enter-to-class="grid-rows-[1fr]"
        leave-active-class="grid transition-[grid-template-rows] duration-250 ease-in motion-reduce:transition-none"
        leave-from-class="grid-rows-[1fr]" leave-to-class="grid-rows-[0fr]">
        <div v-if="open.includes(i)" :id="`faq-accordion-panel-${i}`" class="grid">
          <div class="min-h-0 overflow-hidden">
            <p class="pb-5 pr-5 text-sm leading-relaxed text-toned">{{ question.answer }}</p>
          </div>
        </div>
      </Transition>
    </article>
  </div>
</template>
