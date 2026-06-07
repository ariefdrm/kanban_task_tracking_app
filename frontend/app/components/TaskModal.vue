<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import type { Task, TaskPriority } from '~/types/api'

const props = defineProps<{
  open: boolean
  task: Task | null
  columnId: string | null
  columnName: string | null
}>()

const emit = defineEmits<{
  close: []
  created: [task: Task]
  updated: [task: Task]
  deleted: [taskId: string]
}>()

const board = useBoardStore()

const submitting = ref(false)
const deleting = ref(false)
const error = ref<string | null>(null)

const mode = computed<'create' | 'edit'>(() => (props.task ? 'edit' : 'create'))
const formId = 'task-form'

watch(
  () => props.open,
  (open) => {
    if (open) {
      submitting.value = false
      deleting.value = false
      error.value = null
    }
  },
)

async function onSubmit(payload: {
  title: string
  description: string | null
  priority: TaskPriority
  dueDate: string | null
}) {
  if (submitting.value) return
  submitting.value = true
  error.value = null
  try {
    if (mode.value === 'edit' && props.task) {
      const updated = await board.updateTask(props.task.id, {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate,
      })
      emit('updated', updated)
      emit('close')
    } else if (props.columnId) {
      const created = await board.createTask(props.columnId, {
        title: payload.title,
        description: payload.description ?? undefined,
        priority: payload.priority,
        dueDate: payload.dueDate,
      })
      emit('created', created)
      emit('close')
    }
  } catch (err: unknown) {
    error.value = errorMessage(err, 'Could not save task')
  } finally {
    submitting.value = false
  }
}

async function onDelete() {
  if (!props.task || deleting.value) return
  if (!window.confirm('Delete this task? This cannot be undone.')) return
  deleting.value = true
  error.value = null
  try {
    const id = props.task.id
    await board.deleteTask(id)
    emit('deleted', id)
    emit('close')
  } catch (err: unknown) {
    error.value = errorMessage(err, 'Could not delete task')
  } finally {
    deleting.value = false
  }
}

function errorMessage(err: unknown, fallback: string): string {
  const m =
    (err as { data?: { message?: string | string[] }; message?: string })?.data
      ?.message ?? (err as { message?: string })?.message
  if (!m) return fallback
  return Array.isArray(m) ? m.join(', ') : m
}
</script>

<template>
  <AppModal
    :open="open"
    size="lg"
    :close-on-backdrop="!submitting && !deleting"
    @close="emit('close')"
  >
    <template #header>
      <div>
        <p class="eyebrow">
          {{ mode === 'edit' ? 'Editing' : 'New task' }}
          <span v-if="columnName"> · {{ columnName }}</span>
        </p>
        <h2 id="modal-title" class="mt-1 font-display text-xl text-ink dark:text-ink-dark tracking-display-tight">
          {{ mode === 'edit' ? 'Refine this task' : 'Add a task' }}
        </h2>
      </div>
    </template>

    <TaskForm :form-id="formId" :task="task" @submit="onSubmit" />

    <p v-if="error" class="mt-3 text-xs text-danger">{{ error }}</p>

    <template #footer>
      <button
        v-if="mode === 'edit'"
        type="button"
        class="mr-auto inline-flex items-center gap-1.5 text-xs text-danger hover:underline disabled:opacity-50"
        :disabled="deleting || submitting"
        @click="onDelete"
      >
        <Trash2 class="h-3.5 w-3.5" />
        Delete task
      </button>
      <AppButton variant="ghost" size="sm" :disabled="submitting || deleting" @click="emit('close')">
        Cancel
      </AppButton>
      <AppButton
        variant="primary"
        size="sm"
        type="submit"
        :form="formId"
        :loading="submitting"
        :disabled="deleting"
      >
        {{ mode === 'edit' ? 'Save changes' : 'Add task' }}
      </AppButton>
    </template>
  </AppModal>
</template>
