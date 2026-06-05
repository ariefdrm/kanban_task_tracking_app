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

    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        active-class="bg-accent-soft text-accent dark:bg-accent-softDark"
        class="group flex items-center gap-3 rounded-button px-3 h-10 text-sm font-medium text-ink-muted hover:bg-canvas hover:text-ink dark:hover:bg-canvas-dark dark:hover:text-ink-dark transition-colors"
        @click="close"
      >
        <component :is="link.icon" class="h-4 w-4 flex-shrink-0" />
        <span>{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-border dark:border-border-dark">
      <p class="text-[11px] text-ink-muted leading-relaxed">
        TaskFlow MVP · Stay focused. Ship more.
      </p>
    </div>
  </aside>
</template>
