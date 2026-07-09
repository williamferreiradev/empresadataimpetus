<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { getBezierPath, getStraightPath, getSmoothStepPath } from '@vue-flow/core'
import rough from 'roughjs'

const props = defineProps<{
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: any
  targetPosition: any
  selected?: boolean
  label?: string
  data?: {
    routing?: 'bezier' | 'straight' | 'step'
    styleType?: 'normal' | 'dashed' | 'dotted'
    color?: string
  }
}>()

const gRef = ref<SVGGElement | null>(null)

const pathData = computed(() => {
  const routing = props.data?.routing || 'bezier'
  const params = {
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition
  }

  let result: [string, number, number, number, number] | [string, number, number]
  if (routing === 'straight') {
    result = getStraightPath(params)
  } else if (routing === 'step') {
    result = getSmoothStepPath(params)
  } else {
    result = getBezierPath(params)
  }

  return {
    path: result[0],
    labelX: result[1],
    labelY: result[2]
  }
})

function drawRoughEdge() {
  if (!gRef.value) return
  gRef.value.innerHTML = ''
  
  const rc = rough.svg(gRef.value as any)
  
  // Deterministic seed based on edge ID
  let hash = 0
  for (let i = 0; i < props.id.length; i++) {
    hash = props.id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const seed = Math.abs(hash) || 1

  const baseColor = props.data?.color || '#64748b'
  const strokeColor = props.selected ? '#0ea5e9' : baseColor

  const styleType = props.data?.styleType || 'normal'
  const strokeDasharray = styleType === 'dashed' 
    ? [6, 6] 
    : styleType === 'dotted' 
      ? [2, 5] 
      : undefined
  
  const edge = rc.path(pathData.value.path, {
    seed,
    stroke: strokeColor,
    strokeWidth: props.selected ? 2.5 : 1.5,
    roughness: 1.5,
    bowing: 1.0,
    strokeDasharray
  })
  
  gRef.value.appendChild(edge)
}

onMounted(() => {
  drawRoughEdge()
})

watch(() => [
  pathData.value.path, 
  props.selected,
  props.data?.routing,
  props.data?.styleType,
  props.data?.color
], () => {
  drawRoughEdge()
})
</script>

<template>
  <g class="custom-edge-group">
    <!-- Rough.js hand-drawn path will be injected here -->
    <g ref="gRef" class="rough-edge-container" />
    
    <!-- Thick invisible path for click interaction/selection -->
    <path 
      :d="pathData.path" 
      fill="none" 
      stroke="transparent" 
      stroke-width="12" 
      class="vue-flow__edge-interaction"
      style="cursor: pointer;"
    />
  </g>
</template>

<style scoped>
.rough-edge-container :deep(path) {
  transition: stroke var(--transition-fast), stroke-width var(--transition-fast);
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-edge 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.custom-edge-group:hover .rough-edge-container :deep(path) {
  stroke: var(--accent-primary);
  stroke-width: 2px;
}

@keyframes draw-edge {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
