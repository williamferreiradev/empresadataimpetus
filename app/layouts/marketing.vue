<template>
  <div class="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
    <!-- Componentized Sidebar -->
    <MarketingSidebar />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFBFC]">
      <!-- Topbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
        <h1 class="text-xl font-semibold text-gray-800 capitalize">{{ pageTitle }}</h1>
        
        <div class="flex items-center gap-6">
          <!-- Notifications & Profile -->
          <div class="flex items-center gap-4">
            <button class="relative p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
              <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 border-2 border-white"></span>
              <BellIcon class="h-6 w-6" />
            </button>
            <div class="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-sm">
              {{ userInitial }}
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto" :class="[$route.path.includes('mapas-mentais') ? '' : 'p-8']">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { BellIcon } from '@heroicons/vue/24/outline'

const user = useSupabaseUser()
const route = useRoute()

const userInitial = computed(() => {
  return user.value?.email?.charAt(0).toUpperCase() || 'U'
})

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('clientes')) return 'Clientes'
  if (path.includes('calendario')) return 'Calendário Editorial'
  if (path.includes('mapas-mentais')) return 'Mapas Mentais'
  if (path.includes('configuracoes')) return 'Configurações'
  return 'Dashboard Marketing'
})
</script>
