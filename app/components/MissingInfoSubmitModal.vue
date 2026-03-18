<script setup lang="ts">
import { z } from 'zod'
import type { ClauseStatusRecord } from '~~/shared/types/evaluation'

const props = defineProps<{
  item: ClauseStatusRecord
}>()

const open = defineModel<boolean>('open', { required: true })

const toast = useToast()

const schema = z.object({
  comment: z.string().min(1, 'Please provide a comment or explanation'),
  files: z.array(z.instanceof(File)).optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  comment: '',
  files: []
})

const submitting = ref(false)

async function onSubmit() {
  submitting.value = true

  try {
    const formData = new FormData()
    formData.append('clauseId', props.item.id)
    formData.append('comment', state.comment!)

    if (state.files?.length) {
      for (const file of state.files) {
        formData.append('files', file)
      }
    }

    await $fetch('/api/compliance-gap/submit-info', {
      method: 'POST',
      body: formData
    })

    toast.add({
      title: 'Information submitted',
      description: `Details for ${props.item.clause} have been submitted.`,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    state.comment = ''
    state.files = []
    open.value = false
  } catch {
    toast.add({
      title: 'Submission failed',
      description: 'Something went wrong. Please try again.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Submit info for ${item.clause}`"
    :description="item.title ?? 'Untitled requirement'"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          name="comment"
          label="Comment"
          required
        >
          <UTextarea
            v-model="state.comment"
            placeholder="Provide the missing information or explanation..."
            class="w-full"
            :rows="4"
          />
        </UFormField>

        <UFormField
          name="files"
          label="Supporting documents"
        >
          <UFileUpload
            v-model="state.files"
            multiple
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            color="neutral"
            label="Cancel"
            :disabled="submitting"
            @click="open = false"
          />
          <UButton
            type="submit"
            label="Submit"
            icon="i-lucide-send"
            :loading="submitting"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
