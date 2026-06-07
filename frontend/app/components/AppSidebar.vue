<script setup lang="ts">
import { LayoutDashboard, KanbanSquare, BarChart3, History, UserCircle2 } from 'lucide-vue-next'

const { open, close } = useSidebar()

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/boards', label: 'Boards', icon: KanbanSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/activities', label: 'Activities', icon: History },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
]
</script>

<template>
  <!-- Backdrop on mobile -->
  <Transition
    enter-active-class="transition-opacity duration-150"
    leave-active-class="transition-opacity duration-150"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-30 bg-ink/40 lg:hidden"
      @click="close"
    />
  </Transition>

  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200',
      'dark:bg-surface-dark dark:border-border-dark',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
    aria-label="Primary navigation"
  >
    <div class="h-16 flex items-center px-6 border-b border-border dark:border-border-dark">
      <AppLogo />
    </div>

    <div class="px-6 pt-5 pb-2">
      <p class="eyebrow">Workspace</p>
    </div>
    <nav class="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto scrollbar-thin">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        active-class="!text-ink dark:!text-ink-dark bg-accent-soft/60 dark:bg-accent-softDark"
        class="group relative flex items-center gap-3 rounded-button px-3 h-10 text-sm font-medium text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors duration-200 ease-out-expo"
        @click="close"
      >
        <component :is="link.icon" class="h-4 w-4 flex-shrink-0 transition-transform duration-300 ease-out-expo group-hover:scale-110" />
        <span>{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <div class="px-6 py-5 border-t border-border dark:border-border-dark">
      <p class="font-display italic text-sm text-ink dark:text-ink-dark leading-snug">
        Stay focused.<br>Ship more.
      </p>
      <p class="mt-2 eyebrow">TaskFlow · MVP 1.0</p>
    </div>
  </aside>
</template>
