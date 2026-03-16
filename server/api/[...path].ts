export default defineEventHandler((event) => {
  setResponseStatus(event, 404)

  return {
    message: `API route not found: ${event.path}`
  }
})
