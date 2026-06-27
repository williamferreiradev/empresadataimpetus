<template>
  <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    
    <div class="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-gray-800">Visão Analítica</h2>
        <p class="text-sm text-gray-500 mt-1">O seu mapa mental transformado em um formato fácil de ler.</p>
      </div>
    </div>

    <div v-if="!flatNodes.length" class="text-gray-500 italic text-center py-8">
      O mapa está vazio.
    </div>
    


    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-white text-gray-500 text-xs uppercase tracking-wider border-b-2 border-gray-200">
            <th class="px-6 py-4 font-semibold w-1/3">Contexto (De onde vem)</th>
            <th class="px-6 py-4 font-semibold w-1/2">Tópico (Ideia)</th>
            <th class="px-6 py-4 font-semibold text-right">Formato</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in flatNodes" :key="item.node.id" class="hover:bg-orange-50/30 transition-colors">
            
            <!-- Caminho (Breadcrumbs) -->
            <td class="px-6 py-5 text-sm text-gray-500">
              <div v-if="item.path.length === 0" class="text-gray-400 italic">
                (Raiz principal)
              </div>
              <div v-else class="flex flex-wrap items-center gap-1">
                <template v-for="(crumb, idx) in item.path" :key="idx">
                  <span class="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs truncate max-w-[150px]" :title="crumb">
                    {{ crumb }}
                  </span>
                  <span v-if="idx < item.path.length - 1" class="text-gray-300">›</span>
                </template>
              </div>
            </td>

            <!-- Tópico -->
            <td class="px-6 py-5">
              <div 
                class="text-gray-900 break-words rich-text-node"
                v-html="item.node.data?.label || '(Sem texto)'"
              >
              </div>
            </td>

            <!-- Formato (Visual) -->
            <td class="px-6 py-5 text-right whitespace-nowrap">
              <div class="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 bg-white shadow-sm">
                <div class="w-2.5 h-2.5 rounded-full" :class="getColorClass(item.node.data?.color)"></div>
                <span class="text-xs text-gray-500 capitalize">{{ item.node.data?.shape || 'Retângulo' }}</span>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  elements: {
    type: Array,
    required: true
  }
})



const getColorClass = (color) => {
  switch (color) {
    case 'dark': return 'bg-gray-900'
    case 'navy': return 'bg-slate-800'
    case 'emerald': return 'bg-teal-800'
    case 'gold': return 'bg-amber-600'
    case 'wine': return 'bg-rose-900'
    default: return 'bg-gray-300'
  }
}

const flatNodes = computed(() => {
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

  const targetIds = new Set(edges.map(e => e.target))
  const rootNodes = nodes.filter(n => !targetIds.has(n.id)).map(n => nodeMap[n.id])

  const result = []
  
  // path armazena um array de labels de todos os nós "pais" acima deste nó
  const flatten = (list, path) => {
    list.forEach(node => {
      result.push({ node, path: [...path] })
      if (node.children && node.children.length > 0) {
        flatten(node.children, [...path, node.data?.label || '(Sem texto)'])
      }
    })
  }

  flatten(rootNodes, [])
  return result
})
</script>
