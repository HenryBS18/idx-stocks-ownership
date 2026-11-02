export const useVisitorToken = () => {
  const cookie = useCookie<string>('token')
  // Cookie refs created later in the same SSR request still read the incoming
  // cookies. Share the newly issued visitor token with the page being rendered.
  return useState<string | undefined>('visitor-token', () => cookie.value)
}
