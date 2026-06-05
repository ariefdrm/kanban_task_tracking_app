<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="min-h-screen bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-dark">
    <AppSidebar />

    <div class="lg:pl-64">
      <AppHeader :title="title" :description="description">
        <template v-if="$slots['header-actions']" #actions>
          <slot name="header-actions" />
        </template>
      </AppHeader>

      <main class="px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </main>
    </div>
  </div>
</template>
