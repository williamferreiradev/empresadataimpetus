<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-8 min-h-[60vh]">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-zinc-100 mb-6 border-b pb-4">Visão em Texto (Outline)</h2>
    
    <div v-if="!rootNodes.length" class="text-gray-500 dark:text-zinc-400 italic text-center py-8">
      O mapa está vazio.
    </div>

    <div v-else class="space-y-6">
      <!-- Renderiza cada árvore a partir da raiz -->
      <div v-for="root in rootNodes" :key="root.id">
        <TreeNode :node="root" :level="0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  elements: {
    type: Array,
    required: true
  }
})

// Computa a estrutura de árvore a partir dos elementos do mapa mental
const rootNodes = computed(() => {
  if (!props.elements || !props.elements.length) return []

  const nodes = props.elements.filter(e => !e.source && !e.target)
  const edges = props.elements.filter(e => e.source && e.target)

  const nodeMap = {}
  nodes.forEach(n => {
    nodeMap[n.id] = { ...n, children: [] }
  })

  edges.forEach(edge => {
    if (nodeMap[edge.source] && nodeMap[edge.target]) {
      nodeMap[edge.source].children.push(nodeMap[edge.target])
    }
  })

  // Encontra os nós raiz (que não são destino de nenhuma aresta)
  const targetIds = new Set(edges.map(e => e.target))
  return nodes.filter(n => !targetIds.has(n.id)).map(n => nodeMap[n.id])
})
</script>
