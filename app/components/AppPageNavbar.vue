<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <UDashboardNavbar
    :title="props.title"
    :ui="{ right: 'gap-3' }"
  >
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>

    <template #right>
      <slot name="right" />
      <UColorModeButton />
    </template>
  </UDashboardNavbar>
</template>
