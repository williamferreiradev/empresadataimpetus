<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
    <div class="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-8">
      <svg class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    </div>
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight sm:text-4xl mb-4">
      Departamento de {{ title }}
    </h2>
    <p class="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
      Estamos construindo a dashboard para este departamento. Em breve você terá acesso a todas as ferramentas e indicadores aqui.
    </p>
    <NuxtLink to="/" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
      Voltar para o Hub
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => {
  const path = route.path.replace('/', '')
  return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ')
})
</script>
