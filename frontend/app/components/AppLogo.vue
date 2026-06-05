<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    size?: Size
    to?: string
    showText?: boolean
  }>(),
  {
    size: 'md',
    to: '/',
    showText: true,
  },
)

const markSizes: Record<Size, string> = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

const textSizes: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'span'"
    :to="to"
    class="inline-flex items-center gap-2 text-ink dark:text-ink-dark hover:text-accent transition-colors"
  >
    <span
      :class="[
        'inline-flex items-center justify-center rounded-button bg-accent text-white font-semibold shadow-sm',
        markSizes[size],
      ]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        class="h-1/2 w-1/2"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="4" y="5" width="6" height="14" rx="1.5" />
        <rect x="14" y="5" width="6" height="8" rx="1.5" />
      </svg>
    </span>
    <span v-if="showText" :class="['font-semibold tracking-tight', textSizes[size]]">
      TaskFlow
    </span>
  </component>
</template>
