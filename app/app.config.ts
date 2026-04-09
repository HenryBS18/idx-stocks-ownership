export default defineAppConfig({
  ui: {
    button: {
      variants: {
        size: {
          md: {
            base: 'gap-1 px-2 py-2 sm:gap-1.5 sm:px-2.5 sm:py-1.5',
            trailingIcon: 'size-4 sm:size-5',
            leadingIcon: 'size-4 sm:size-5'
          }
        }
      }
    },
  }
})
