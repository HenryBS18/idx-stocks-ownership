import { monthsInNumber } from "./constants"

const FORMAT_RE = new RegExp(`^\\d{1,2} (${Object.keys(monthsInNumber).join("|")}) \\d{4}$`)

export const parseDateTime = (datetime: string) => {
  if (!FORMAT_RE.test(datetime)) throw createError({ statusCode: 400, statusMessage: 'Invalid date format, expected "DD Mon YYYY" (example: "31 Agt 2026")' })

  const [_, monthNameString, yearString] = datetime.split(" ")

  const month = monthsInNumber[monthNameString!]!

  const year = parseInt(yearString!, 10)

  return { month, year }
}
