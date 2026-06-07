<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus } from 'lucide-vue-next'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({ title: 'Dashboard — TaskFlow' })

const auth = useAuthStore()

const greeting = computed(() => {
  const name = auth.user?.name || auth.user?.email?.split('@')[0] || 'there'
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}.`
  if (hour < 18) return `Good afternoon, ${name}.`
  return `Good evening, ${name}.`
})

const createOpen = ref(false)

function openCreate() {
  createOpen.value = true
}

function onCreated(boardId: string) {
  navigateTo(`/boards/${boardId}`)
}
</script>

<template>
  <NuxtLayout
    name="dashboard"
    :title="greeting"
    description="Here's a quick look at your week."
  >
    <template #header-actions>
      <AppButton variant="primary" size="sm" @click="openCreate">
        <Plus class="h-4 w-4" />
        <span class="hidden sm:inline">New board</span>
      </AppButton>
    </template>

    <div class="space-y-6">
      <DashboardStats />

      <div class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RecentBoards @create-board="openCreate" />
        <RecentActivities />
      </div>
    </div>

    <CreateBoardModal :open="createOpen" @close="createOpen = false" @created="onCreated" />
  </NuxtLayout>
</template>
