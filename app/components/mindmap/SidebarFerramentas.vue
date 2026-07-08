<template>
  <aside class="w-16 bg-gray-900 flex flex-col items-center py-4 border-r border-gray-800 shadow-xl z-10 shrink-0">
    <div class="space-y-4">
      <!-- Shape: Rectangle -->
      <div 
        class="w-10 h-10 rounded border-2 border-gray-400 bg-gray-800 flex items-center justify-center cursor-grab hover:border-orange-500 hover:bg-gray-700 transition-colors"
        draggable="true"
        @dragstart="onDragStart($event, 'rectangle')"
        title="Retângulo"
      >
        <div class="w-5 h-3 border border-gray-300 dark:border-zinc-600 rounded-sm"></div>
      </div>
      
      <!-- Shape: Circle -->
      <div 
        class="w-10 h-10 rounded border-2 border-gray-400 bg-gray-800 flex items-center justify-center cursor-grab hover:border-orange-500 hover:bg-gray-700 transition-colors"
        draggable="true"
        @dragstart="onDragStart($event, 'circle')"
        title="Círculo"
      >
        <div class="w-4 h-4 border border-gray-300 dark:border-zinc-600 rounded-full"></div>
      </div>

      <!-- Text Node -->
      <div 
        class="w-10 h-10 rounded border-2 border-gray-400 bg-gray-800 flex items-center justify-center cursor-grab hover:border-orange-500 hover:bg-gray-700 transition-colors"
        draggable="true"
        @dragstart="onDragStart($event, 'text')"
        title="Texto"
      >
        <span class="text-gray-300 font-bold text-lg leading-none font-serif">T</span>
      </div>

      <!-- Sticky Note -->
      <div 
        class="w-10 h-10 rounded border-2 border-gray-400 bg-gray-800 flex items-center justify-center cursor-grab hover:border-orange-500 hover:bg-gray-700 transition-colors relative overflow-hidden"
        draggable="true"
        @dragstart="onDragStart($event, 'sticky')"
        title="Nota (Sticky)"
      >
        <div class="w-5 h-5 bg-yellow-300 rounded-sm relative">
          <!-- Folded corner effect -->
          <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400 border-t border-l border-yellow-500 shadow-sm"></div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
const onDragStart = (event, nodeType) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>
