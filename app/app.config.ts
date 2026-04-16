const textSizeClass = 'text-[13px] md:text-sm'
const iconSizeClass = 'size-4 sm:size-5'

export default defineAppConfig({
  ui: {
    button: {
      variants: {
        size: {
          md: {
            base: 'gap-1 px-2 py-1.5 sm:gap-1.5 sm:px-2.5 sm:py-1.5',
            trailingIcon: iconSizeClass,
            leadingIcon: iconSizeClass,
            label: textSizeClass
          }
        }
      }
    },
    select: {
      variants: {
        size: {
          md: {
            value: textSizeClass,
            itemLabel: textSizeClass,
            trailingIcon: iconSizeClass
          }
        }
      }
    },
    dropdownMenu: {
      variants: {
        size: {
          md: {
            itemLabel: textSizeClass,
          }
        }
      }
    }
  },
})
