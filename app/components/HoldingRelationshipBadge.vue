<script setup lang="ts">
import type { ControllerOrAffiliate } from '~~/shared/types'

const props = defineProps<{ value?: ControllerOrAffiliate | null }>()
const label = computed(() => props.value === 'CONTROLLER' ? 'Pengendali'
  : props.value === 'AFFILIATE' ? 'Afiliasi' : null)
</script>

<template>
  <UBadge v-if="label" :label="label" color="neutral" variant="soft" size="sm"
    class="w-fit shrink-0 text-[10px] sm:text-[11px]"
    :class="value === 'CONTROLLER'
      ? 'bg-violet-100 text-violet-800 dark:bg-violet-400/20 dark:text-violet-200'
      : undefined" />
</template>
