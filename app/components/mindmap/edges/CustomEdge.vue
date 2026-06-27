<template>
  <g @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Linha invisível mais grossa para facilitar o hover -->
    <path
      :d="path[0]"
      fill="none"
      stroke="transparent"
      stroke-width="20"
      class="vue-flow__edge-interaction"
    />
    
    <!-- Linha visual real -->
    <path
      :id="id"
      :style="style"
      class="vue-flow__edge-path transition-all"
      :class="{ 'stroke-orange-500': selected || isHovered, 'stroke-gray-400': !selected && !isHovered }"
      :d="path[0]"
      :marker-end="markerEnd"
    />
  </g>

  <EdgeLabelRenderer>
    <div
      v-if="selected || isHovered"
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
      }"
      class="nodrag nopan z-50 flex items-center gap-1 bg-gray-800 text-white rounded shadow-lg px-2 py-1"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="flex items-center gap-2 border-r border-gray-600 pr-2">
        <button 
          @click="changeThickness(-1)" 
          class="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-sm font-bold"
          title="Mais fina"
        >-</button>
        
        <span class="text-xs font-mono w-4 text-center">{{ computedThickness }}</span>
        
        <button 
          @click="changeThickness(1)" 
          class="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-sm font-bold"
          title="Mais grossa"
        >+</button>
      </div>

      <!-- Colors -->
      <div class="flex items-center gap-1 px-1">
        <button @click="changeColor('#9ca3af')" class="w-4 h-4 rounded-full bg-gray-400 border border-gray-500 hover:ring-2 ring-gray-400"></button>
        <button @click="changeColor('#111827')" class="w-4 h-4 rounded-full bg-gray-900 border border-gray-700 hover:ring-2 ring-gray-900"></button>
        <button @click="changeColor('#1e293b')" class="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 hover:ring-2 ring-slate-800"></button>
        <button @click="changeColor('#115e59')" class="w-4 h-4 rounded-full bg-teal-800 border border-teal-600 hover:ring-2 ring-teal-800"></button>
        <button @click="changeColor('#d97706')" class="w-4 h-4 rounded-full bg-amber-600 border border-amber-500 hover:ring-2 ring-amber-600"></button>
        <button @click="changeColor('#881337')" class="w-4 h-4 rounded-full bg-rose-900 border border-rose-700 hover:ring-2 ring-rose-900"></button>
      </div>
      
      <div class="w-px h-4 bg-gray-600 mx-1"></div>
      
      <button 
        @click="removeEdge" 
        class="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-red-400 hover:text-red-300"
        title="Excluir linha"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </EdgeLabelRenderer>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getSmoothStepPath, EdgeLabelRenderer, useVueFlow } from '@vue-flow/core'

const props = defineProps({
  id: { type: String, required: true },
  sourceX: { type: Number, required: true },
  sourceY: { type: Number, required: true },
  targetX: { type: Number, required: true },
  targetY: { type: Number, required: true },
  sourcePosition: { type: String, required: true },
  targetPosition: { type: String, required: true },
  style: { type: Object, default: () => ({}) },
  markerEnd: { type: String },
  selected: { type: Boolean, default: false }
})

const isHovered = ref(false)
const { removeEdges, findEdge } = useVueFlow()

const path = computed(() => getSmoothStepPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  targetX: props.targetX,
  targetY: props.targetY,
  sourcePosition: props.sourcePosition,
  targetPosition: props.targetPosition,
}))

const removeEdge = () => {
  removeEdges([props.id])
}

const computedThickness = computed(() => {
  const edge = findEdge(props.id)
  return edge?.style?.strokeWidth || 2
})

const changeColor = (color) => {
  const edge = findEdge(props.id)
  if (edge) {
    edge.style = { ...edge.style, stroke: color }
  }
}

const changeThickness = (delta) => {
  const edge = findEdge(props.id)
  if (edge) {
    const currentWidth = edge.style?.strokeWidth || 2
    let newWidth = currentWidth + delta
    if (newWidth < 1) newWidth = 1
    if (newWidth > 20) newWidth = 20
    
    // Atualiza o estilo reativamente
    edge.style = { ...edge.style, strokeWidth: newWidth }
  }
}
</script>
