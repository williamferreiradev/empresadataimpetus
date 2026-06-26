<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Dashboard Marketing</h2>
    </div>
    
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">Visão Geral</h3>
      <p class="text-gray-500 max-w-md">Em breve os principais indicadores, métricas e análises do departamento de Marketing estarão disponíveis aqui.</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'marketing'
})
</script>
