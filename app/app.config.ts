const textSizeClass = 'text-[13px] md:text-sm'
const iconSizeClass = 'size-4 sm:size-5'

export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'cursor-pointer',
      },
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
      slots: {
        base: 'cursor-pointer',
        item: 'cursor-pointer',
      },
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
      slots: {
        item: 'cursor-pointer',
      },
      variants: {
        size: {
          md: {
            itemLabel: textSizeClass,
          }
        }
      }
    },
    table: {
      slots: {
        thead: 'bg-muted',
        tbody: 'divide-y divide-accented',
        tr: 'hover:bg-elevated',
        th: 'text-xs md:text-sm font-semibold text-muted max-sm:py-2',
        td: 'text-xs md:text-sm text-default',
      }
    }
  },
})
