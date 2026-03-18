<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import type { ClauseStatusRecord, ComplianceGapGroup } from '~~/shared/types/evaluation'

interface ComplianceGapAccordionItem extends AccordionItem, ClauseStatusRecord {}

const props = defineProps<{
  group: ComplianceGapGroup
}>()

const accordionItems = computed<ComplianceGapAccordionItem[]>(() => props.group.items.map(item => ({
  ...item,
  value: item.id,
  label: `${item.clause} · ${item.title ?? 'Untitled requirement'}`
})))
</script>

<template>
  <UCard
    variant="subtle"
    :ui="{
      header: 'flex items-center justify-between gap-3',
      body: 'p-0'
    }"
  >
    <template #header>
      <div class="min-w-0">
        <p class="text-sm font-semibold text-highlighted">
          {{ group.label }}
        </p>
        <p class="text-sm text-muted">
          {{ group.count }} item{{ group.count === 1 ? '' : 's' }}
        </p>
      </div>

      <UBadge
        v-bind="getStatusBadgeProps(props.group.status)"
        variant="subtle"
      />
    </template>

    <UAccordion
      :items="accordionItems"
      type="multiple"
      :unmount-on-hide="false"
      :ui="{
        item: 'border-t first:border-t-0 border-default',
        trigger: 'w-full px-4 py-4 hover:bg-muted/40 transition-colors',
        body: 'px-4 pb-4 pt-0',
        content: 'overflow-hidden'
      }"
    >
      <template #default="{ item }">
        <div class="flex min-w-0 flex-col gap-1">
          <div class="flex min-w-0 items-center gap-2">
            <span class="font-medium text-highlighted">
              {{ item.clause }}
            </span>
            <span class="truncate text-sm text-toned">
              {{ item.title ?? 'Untitled requirement' }}
            </span>
            <UBadge
              :label="item.standard.ref"
              color="neutral"
              variant="outline"
              class="ml-4"
            />
          </div>
          <p
            v-if="item.summary"
            class="line-clamp-2 text-sm text-muted"
          >
            Requirement: {{ item.summary }}
          </p>
        </div>
      </template>

      <template #body="{ item }">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                Justification
              </p>
              <p class="whitespace-pre-line text-sm text-toned">
                {{ item.justification ?? 'No justification provided.' }}
              </p>
            </div>

            <div
              v-if="item.applicable_if"
              class="space-y-1"
            >
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                Applicable if
              </p>
              <p class="whitespace-pre-line text-sm text-toned">
                {{ item.applicable_if }}
              </p>
            </div>

            <div
              v-if="item.conditions"
              class="space-y-1"
            >
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                Conditions
              </p>
              <p class="whitespace-pre-line text-sm text-toned">
                {{ item.conditions }}
              </p>
            </div>

            <div
              v-if="item.references"
              class="space-y-1 md:col-span-2"
            >
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                References
              </p>
              <p class="whitespace-pre-line text-sm text-toned">
                {{ item.references }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </UAccordion>
  </UCard>
</template>
