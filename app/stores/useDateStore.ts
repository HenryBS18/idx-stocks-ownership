export const useDateStore = defineStore('date', () => {
  const dates = ref<Info[]>([])
  const selectedDate = ref<string>('')
  const error = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const fetchDates = async (token: string): Promise<void> => {
    if (dates.value.length > 0) return

    error.value = false
    try {
      const infoResponse = await $fetch<InfoResponse>('/api/info', {
        query: { token }
      })

      dates.value = infoResponse
      selectedDate.value = infoResponse[0]?.value!
    } catch (e) {
      error.value = true
      errorMessage.value = 'Gagal memuat data tanggal. Periksa koneksi Anda dan coba lagi.'
    }
  }

  function clearError() {
    error.value = false
    errorMessage.value = ''
  }

  return {
    dates,
    selectedDate,
    error,
    errorMessage,
    fetchDates,
    clearError,
  }
})