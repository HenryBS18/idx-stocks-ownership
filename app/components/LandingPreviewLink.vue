<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  to: string
  period: string | null
}>()

const dateStore = useDateStore()

const followPreview = (event: MouseEvent, navigate: (event: MouseEvent) => unknown) => {
  // Modified clicks use the real href without changing the current tab's period.
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  dateStore.selectedDate = props.period ?? dateStore.dates[0]?.value ?? ''
  navigate(event)
}
</script>

<template>
  <NuxtLink v-slot="{ href, navigate }" :to="to" custom>
    <a v-bind="$attrs" :href="href ?? undefined"
      class="ownership-link rounded-sm underline decoration-accented underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      @click="followPreview($event, navigate)"><slot /></a>
  </NuxtLink>
</template>
