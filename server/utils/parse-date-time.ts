import { monthsInNumber } from "./constants"

const FORMAT_RE = /^\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/

export const parseDateTime = (datetime: string) => {
  if (!FORMAT_RE.test(datetime)) throw createError({ statusCode: 400, statusMessage: 'Invalid date format, expected "DD Mon YYYY"' })

  const [_, monthNameString, yearString] = datetime.split(" ")

  const month = monthsInNumber[monthNameString!]!

  const year = parseInt(yearString!, 10)

  return { month, year }
}
