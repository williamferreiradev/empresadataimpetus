<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Calendário Editorial</h2>
    </div>
    
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">Planejamento de Conteúdo</h3>
      <p class="text-gray-500 max-w-md">O Calendário Editorial está em desenvolvimento. Logo você poderá organizar suas postagens e campanhas.</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'marketing'
})
</script>
