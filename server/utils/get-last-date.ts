export const getLastDate = (month: number, year: number): string => {
  const date = new Date(year, month, 0)

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}