export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)

  if (!body?.length) {
    throw createError({ statusCode: 400, statusMessage: 'No data provided' })
  }

  // save data to DB and files to storage
  // run an llm call to verify the information

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { success: true }
})
