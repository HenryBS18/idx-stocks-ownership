export const useDateStore = defineStore('date', () => {
  const dates = ref<Info[]>([])
  const selectedDate = ref<string>('')

  const fetchDates = async (token: string): Promise<void> => {
    if (dates.value.length > 0) return

    const res = await $fetch<InfoResponse>('/api/info', {
      query: { token }
    })

    dates.value = res
    selectedDate.value = res[0]?.value!
  }

  return {
    dates,
    selectedDate,
    fetchDates
  }
})