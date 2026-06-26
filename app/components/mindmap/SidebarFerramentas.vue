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
        <div class="w-5 h-3 border border-gray-300 rounded-sm"></div>
      </div>
      
      <!-- Shape: Circle -->
      <div 
        class="w-10 h-10 rounded border-2 border-gray-400 bg-gray-800 flex items-center justify-center cursor-grab hover:border-orange-500 hover:bg-gray-700 transition-colors"
        draggable="true"
        @dragstart="onDragStart($event, 'circle')"
        title="Círculo"
      >
        <div class="w-4 h-4 border border-gray-300 rounded-full"></div>
      </div>

      <!-- Text Node (acts like a rectangle with no border initially, but let's stick to standard shapes for now) -->
      <div 
        class="w-10 h-10 rounded border-2 border-gray-400 bg-gray-800 flex items-center justify-center cursor-grab hover:border-orange-500 hover:bg-gray-700 transition-colors"
        draggable="true"
        @dragstart="onDragStart($event, 'text')"
        title="Texto"
      >
        <span class="text-gray-300 font-bold text-lg leading-none font-serif">T</span>
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
