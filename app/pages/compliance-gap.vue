<script setup lang="ts">
import type { ComplianceGapSummaryDataset } from '~~/shared/types/evaluation'

const { data, status } = await useFetch<ComplianceGapSummaryDataset>(
  '/api/compliance-gap',
  {
    key: 'compliance-gap',
    lazy: true
  }
)

const totalItems = computed(
  () => data.value?.reduce((sum, group) => sum + group.count, 0) ?? 0
)
</script>

<template>
  <UDashboardPanel id="compliance-gap">
    <template #header>
      <UDashboardNavbar
        title="Compliance gap summary"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UBadge
            :label="`${totalItems} open item${totalItems === 1 ? '' : 's'}`"
            color="neutral"
            variant="subtle"
          />
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        v-if="status === 'pending'"
        class="space-y-4"
      >
        <USkeleton class="h-40 w-full rounded-xl" />
        <USkeleton class="h-40 w-full rounded-xl" />
        <USkeleton class="h-40 w-full rounded-xl" />
      </div>

      <div
        v-else-if="!data || !data.length"
        class="flex min-h-80 items-center justify-center"
      >
        <UCard
          variant="subtle"
          class="w-full max-w-xl"
        >
          <div class="space-y-2 text-center">
            <p class="text-base font-semibold text-highlighted">
              No compliance gaps
            </p>
            <p class="text-sm text-muted">
              There are no failed, missing-info, or not-applicable items in this
              evaluation dataset.
            </p>
          </div>
        </UCard>
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <ComplianceGapGroupSection
          v-for="group in data"
          :key="group.status"
          :group="group"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
