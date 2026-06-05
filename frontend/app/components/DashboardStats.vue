<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { KanbanSquare, ListTodo, CheckCircle2, TrendingUp } from 'lucide-vue-next'
import { formatPercent } from '~/utils/format'

const analytics = useAnalyticsStore()

onMounted(() => {
  analytics.fetchSummary()
})

const stats = computed(() => {
  const s = analytics.summary
  const totalTasks = s?.totalTasks ?? 0
  const completedTasks = s?.completedTasks ?? 0
  const pending = Math.max(totalTasks - completedTasks, 0)
  return {
    totalBoards: s?.totalBoards ?? 0,
    totalTasks,
    completedTasks,
    pending,
    completionRate: s?.completionRate ?? 0,
  }
})
</script>

<template>
  <section aria-label="Productivity overview">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Boards"
        :value="stats.totalBoards"
        :icon="KanbanSquare"
        tone="accent"
        :loading="analytics.loadingSummary && !analytics.summary"
      />
      <StatCard
        label="Total tasks"
        :value="stats.totalTasks"
        description="Across every board"
        :icon="ListTodo"
        tone="neutral"
        :loading="analytics.loadingSummary && !analytics.summary"
      />
      <StatCard
        label="Completed"
        :value="stats.completedTasks"
        :description="`${stats.pending} still pending`"
        :icon="CheckCircle2"
        tone="success"
        :loading="analytics.loadingSummary && !analytics.summary"
      />
      <StatCard
        label="Completion rate"
        :value="formatPercent(stats.completionRate)"
        description="Share of tasks in Done columns"
        :icon="TrendingUp"
        tone="warning"
        :loading="analytics.loadingSummary && !analytics.summary"
      />
    </div>
  </section>
</template>
