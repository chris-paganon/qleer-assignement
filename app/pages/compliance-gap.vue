<script setup lang="ts">
import type { ComplianceGapSummaryDataset } from '~~/shared/types/evaluation'

const { data, status } = await useFetch<ComplianceGapSummaryDataset>(
  '/api/compliance-gap',
  {
    key: 'compliance-gap',
    lazy: true
  }
)

const stats = computed(() => {
  if (!data.value?.length) return null

  const totalItems = data.value.reduce((sum, g) => sum + g.count, 0)
  const byStatus = Object.fromEntries(data.value.map(g => [g.status, g])) as Partial<Record<string, (typeof data.value)[number]>>

  return [
    {
      label: 'Total issues',
      value: totalItems,
      icon: 'i-lucide-alert-triangle',
      color: 'primary' as const
    },
    {
      label: 'Fails',
      value: byStatus.FAIL?.count ?? 0,
      icon: 'i-lucide-x-circle',
      color: 'error' as const
    },
    {
      label: 'Missing info',
      value: byStatus.MISSING?.count ?? 0,
      icon: 'i-lucide-alert-circle',
      color: 'warning' as const
    },
    {
      label: 'Not applicable',
      value: byStatus['N/A']?.count ?? 0,
      icon: 'i-lucide-minus-circle',
      color: 'neutral' as const
    }
  ]
})
</script>

<template>
  <UDashboardPanel id="compliance-gap">
    <template #header>
      <AppPageNavbar title="Compliance gap summary" />
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
        <div
          v-if="stats"
          class="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <UCard
            v-for="stat in stats"
            :key="stat.label"
            variant="subtle"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-12 shrink-0 items-center justify-center rounded-lg"
                :class="{
                  'bg-primary/10 text-primary': stat.color === 'primary',
                  'bg-error/10 text-error': stat.color === 'error',
                  'bg-warning/10 text-warning': stat.color === 'warning',
                  'bg-muted text-muted': stat.color === 'neutral'
                }"
              >
                <UIcon
                  :name="stat.icon"
                  class="size-5"
                />
              </div>
              <div>
                <p class="text-2xl font-bold text-highlighted">
                  {{ stat.value }}
                </p>
                <p class="text-sm text-muted">
                  {{ stat.label }}
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <ComplianceGapGroupSection
          v-for="group in data"
          :key="group.status"
          :group="group"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
