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

const sectionIntroductions: Record<string, string> = {
  'FAIL': 'These requirements did not pass compliance checks. Review each item, resolve the underlying issues, and re-evaluate to proceed with certification.',
  'MISSING': 'These requirements lack the documentation or evidence needed for evaluation. Gather the required information and submit it to complete the assessment.',
  'N/A': 'These requirements were flagged as not applicable. Verify each item to confirm it is correctly excluded or reclassify it if it should be in scope.'
}

const introduction = computed(() => sectionIntroductions[props.group.status] ?? '')

const isMissing = computed(() => props.group.status === 'MISSING')

const submitModalOpen = ref(false)
const selectedItem = ref<ClauseStatusRecord | null>(null)

function openSubmitModal(item: ClauseStatusRecord) {
  selectedItem.value = item
  submitModalOpen.value = true
}
</script>

<template>
  <div>
    <p class="mb-2 text-sm text-muted">
      {{ introduction }}
    </p>

    <UCard
    variant="subtle"
    :ui="{
      header: 'flex items-center justify-between gap-3',
    }"
  >
    <template #header>
      <div class="min-w-0">
        <p class="font-semibold text-highlighted">
          {{ group.label }}
        </p>
        <p class="text-muted">
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
    >
      <template #default="{ item }">
        <div class="flex min-w-0 flex-col gap-1">
          <div class="flex min-w-0 items-center gap-2">
            <span class="font-medium text-highlighted">
              {{ item.clause }}
            </span>
            <span class="text-toned">
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
            class="line-clamp-2 text-muted"
          >
            {{ item.summary }}
          </p>
        </div>
      </template>

      <template #body="{ item }">
        <div class="space-y-3">
          <div>
            <p class="text-xs font-medium uppercase  text-muted">Justification</p>
            <p class="whitespace-pre-line text-sm text-toned">{{ item.justification ?? 'No justification provided.' }}</p>
          </div>

          <div v-if="item.applicable_if">
            <p class="text-xs font-medium uppercase text-muted">Applicable if</p>
            <p class="whitespace-pre-line text-sm text-toned">{{ item.applicable_if }}</p>
          </div>

          <div v-if="item.conditions">
            <p class="text-xs font-medium uppercase text-muted">Conditions</p>
            <p class="whitespace-pre-line text-sm text-toned">{{ item.conditions }}</p>
          </div>

          <div v-if="item.references">
            <p class="text-xs font-medium uppercase text-muted">References</p>
            <p class="whitespace-pre-line text-sm text-toned">{{ item.references }}</p>
          </div>

          <UButton
            v-if="isMissing"
            label="Submit info"
            icon="i-lucide-upload"
            color="primary"
            variant="soft"
            class="mt-1"
            @click="openSubmitModal(item)"
          />
        </div>
      </template>
    </UAccordion>
  </UCard>

    <MissingInfoSubmitModal
      v-if="isMissing && selectedItem"
      v-model:open="submitModalOpen"
      :item="selectedItem"
    />
  </div>
</template>
