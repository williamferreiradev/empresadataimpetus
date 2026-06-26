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
      <button 
        @click="changeThickness(-1)" 
        class="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-sm"
        title="Mais fina"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      
      <button 
        @click="changeThickness(1)" 
        class="w-6 h-6 flex items-center justify-center hover:bg-gray-700 rounded transition-colors text-sm"
        title="Mais grossa"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
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

const changeThickness = (delta) => {
  const edge = findEdge(props.id)
  if (edge) {
    const currentWidth = edge.style?.strokeWidth || 2
    let newWidth = currentWidth + delta
    if (newWidth < 1) newWidth = 1
    if (newWidth > 12) newWidth = 12
    
    // Atualiza o estilo reativamente
    edge.style = { ...edge.style, strokeWidth: newWidth }
  }
}
</script>
