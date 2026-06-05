<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    block?: boolean
    icon?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
    icon: false,
  },
)

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent/90 active:bg-accent/95 shadow-sm',
  secondary:
    'bg-surface text-ink hover:bg-canvas border border-border ' +
    'dark:bg-surface-dark dark:text-ink-dark dark:border-border-dark dark:hover:bg-canvas-dark',
  danger:
    'bg-danger text-white hover:bg-danger/90 active:bg-danger/95 shadow-sm',
  ghost:
    'bg-transparent text-ink hover:bg-canvas ' +
    'dark:text-ink-dark dark:hover:bg-surface-dark',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

const iconSizes: Record<Size, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center rounded-button font-medium transition-colors duration-150',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
      'dark:focus-visible:ring-offset-canvas-dark',
      icon ? iconSizes[size] : sizes[size],
      variants[variant],
      block ? 'w-full' : '',
    ]"
  >
    <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
    <slot />
  </button>
</template>
