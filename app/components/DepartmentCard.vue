<template>
  <div 
    @click="to ? navigateTo(to) : null"
    :class="[
      'bg-white dark:bg-zinc-800 rounded-2xl border p-6 shadow-sm flex flex-col h-full transition-all duration-300',
      to ? 'border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-md cursor-pointer group' : 'border-gray-200 dark:border-zinc-700'
    ]"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 transition-colors group-hover:bg-orange-50 group-hover:border-orange-200">
        <component :is="icon" class="h-8 w-8 text-gray-700 dark:text-zinc-300 group-hover:text-orange-500 transition-colors" />
      </div>
    </div>
    
    <h3 class="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2 group-hover:text-orange-500 transition-colors">{{ title }}</h3>
    <p class="text-gray-500 dark:text-zinc-400 text-sm flex-grow mb-6 line-clamp-3">
      {{ description }}
    </p>
    
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 group-hover:border-orange-100 transition-colors">
      <div class="flex -space-x-2">
        <!-- Placeholder for app icons, similar to the print -->
        <div class="h-8 w-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600 text-xs font-bold shadow-sm">
          A
        </div>
        <div class="h-8 w-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-orange-600 text-xs font-bold shadow-sm">
          B
        </div>
        <div class="h-8 w-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600 text-xs font-bold shadow-sm">
          C
        </div>
      </div>
      
      <div v-if="to" class="flex items-center text-sm font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Entrar
      </div>
      <div v-else class="flex items-center text-sm font-semibold text-gray-400 dark:text-zinc-500 cursor-not-allowed opacity-80">
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Em breve
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: [Object, Function],
    required: true
  },
  to: {
    type: String,
    default: ''
  }
})
</script>
