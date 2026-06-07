<script setup lang="ts">
import { onMounted } from 'vue'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({ title: 'Activities — TaskFlow' })

const activities = useActivitiesStore()

onMounted(() => {
  if (!activities.items.length) {
    activities.fetchInitial().catch(() => {})
  }
})

function loadMore() {
  activities.fetchMore().catch(() => {})
}
</script>

<template>
  <NuxtLayout name="dashboard">
    <div class="space-y-8">
      <div class="border-b border-border dark:border-border-dark pb-5">
        <p class="eyebrow">The log</p>
        <h1 class="mt-2 font-display text-3xl sm:text-4xl font-normal leading-tight tracking-display-tight text-ink dark:text-ink-dark">
          A timeline of small wins
        </h1>
        <p class="mt-2 text-sm text-ink-muted max-w-2xl">
          Everything you've moved, edited, finished, or scrapped — newest first, grouped by day.
        </p>
      </div>

      <p v-if="activities.error" class="text-sm text-danger">{{ activities.error }}</p>

      <ActivityTimeline
        :activities="activities.items"
        :loading="activities.loading"
        :loading-more="activities.loadingMore"
        :has-more="activities.hasMore"
        @load-more="loadMore"
      />
    </div>
  </NuxtLayout>
</template>
