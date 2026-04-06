import type { Info, InfoResponse } from "~/types"

export const useDateStore = defineStore('date', () => {
  const dates = ref<Info[]>([])
  const selectedDate = ref<string>('')

  const fetchDates = async (): Promise<void> => {
    const token = useCookie('token').value

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