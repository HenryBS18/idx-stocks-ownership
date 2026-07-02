export const parseStockUpload = async (event: any): Promise<{ fileBuffer: Buffer; idxLastUpdated: string }> => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Formdata is required' })

  const filePart = formData.find(p => p.name === 'file')
  const idxPart = formData.find(p => p.name === 'idxLastUpdated')

  if (!filePart) throw createError({ statusCode: 500, statusMessage: 'file missing' })
  if (!idxPart) throw createError({ statusCode: 400, statusMessage: 'idxLastUpdated missing' })

  const idxLastUpdated = idxPart.data.toString()
  if (!idxLastUpdated) throw createError({ statusCode: 400, statusMessage: 'idxLastUpdated not valid' })

  const { month, year } = parseDateTime(idxLastUpdated)
  const info = await prisma.info.findFirst({
    where: { month: month - 1, year }
  })
  if (info) throw createError({ statusCode: 409, statusMessage: 'Already Updated to the Latest Data' })

  return { fileBuffer: filePart.data, idxLastUpdated }
}
