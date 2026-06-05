<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    quote?: string
    quoteAuthor?: string
  }>(),
  {
    quote: 'The secret of getting ahead is getting started.',
    quoteAuthor: 'Mark Twain',
  },
)
</script>

<template>
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-[5fr_6fr]">
    <!-- Brand panel -->
    <div class="hidden lg:flex flex-col justify-between p-12 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark relative overflow-hidden">
      <AppLogo size="lg" />

      <div class="relative z-10 max-w-sm">
        <p class="text-xl font-semibold leading-snug text-ink dark:text-ink-dark">
          "{{ quote }}"
        </p>
        <p class="mt-3 text-sm text-ink-muted">— {{ quoteAuthor }}</p>
      </div>

      <p class="relative z-10 text-xs text-ink-muted">
        TaskFlow · Visual task tracking
      </p>

      <!-- Subtle decorative shapes -->
      <div
        class="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full border border-accent/20"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent-soft/60 dark:bg-accent-softDark"
        aria-hidden="true"
      />
    </div>

    <!-- Content panel -->
    <div class="flex flex-col items-stretch justify-center px-6 py-10 sm:px-12">
      <div class="lg:hidden mb-8">
        <AppLogo />
      </div>

      <div class="w-full max-w-sm mx-auto">
        <h1 class="text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-2 text-sm text-ink-muted">
          {{ description }}
        </p>

        <div class="mt-8">
          <slot />
        </div>

        <div v-if="$slots.footer" class="mt-6 text-center text-sm text-ink-muted">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>
