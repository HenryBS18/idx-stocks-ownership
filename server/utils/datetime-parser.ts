import { monthsInNumber } from "./constants"

export const datetimeParser = (datetime: string) => {
  const [_, monthNameString, yearString] = datetime.split(" ")

  const month = monthsInNumber[monthNameString!]!

  const year = parseInt(yearString!, 10)

  return { month, year }
}