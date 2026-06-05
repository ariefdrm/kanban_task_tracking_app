<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label?: string
    hint?: string
    error?: string
    type?: string
    placeholder?: string
    autocomplete?: string
    disabled?: boolean
    required?: boolean
    id?: string
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
  },
)

defineEmits<{
  'update:modelValue': [value: string]
}>()

const autoId = useId()
const inputId = computed(() => props.id ?? `input-${autoId}`)
</script>

<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-ink dark:text-ink-dark"
    >
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>

    <div class="relative">
      <slot name="prefix" />
      <input
        :id="inputId"
        :type="type"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        :class="[
          'block w-full h-10 px-3 rounded-input border bg-surface text-ink text-sm placeholder:text-ink-muted',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-ink-muted',
          error
            ? 'border-danger focus:border-danger focus:ring-danger'
            : 'border-border dark:border-border-dark',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <slot name="suffix" />
    </div>

    <p v-if="error" :id="`${inputId}-error`" class="text-xs text-danger">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="text-xs text-ink-muted">
      {{ hint }}
    </p>
  </div>
</template>
