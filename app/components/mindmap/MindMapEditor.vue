<template>
  <div class="flex h-full w-full bg-[#f8f9fa] overflow-hidden" @drop="onDrop" @dragover.prevent>
    <SidebarFerramentas />
    
    <div class="flex-1 h-full relative" ref="vueFlowWrapper">
      <VueFlow
        v-model="elements"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :default-edge-options="{ type: 'customEdge', updatable: true, animated: false, style: { strokeWidth: 2, stroke: '#9ca3af' } }"
        :min-zoom="0.2"
        :max-zoom="4"
        @connect="onConnect"
        @edge-update="onEdgeUpdate"
        class="w-full h-full"
      >
        <Background pattern-color="#e5e7eb" :gap="20" />
        <Controls position="bottom-right" />
      </VueFlow>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, onMounted, watch } from 'vue'
import { VueFlow, useVueFlow, addEdge, updateEdge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import SidebarFerramentas from './SidebarFerramentas.vue'
import BaseNode from './nodes/BaseNode.vue'
import CustomEdge from './edges/CustomEdge.vue'

const props = defineProps({
  initialElements: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:elements'])

const nodeTypes = {
  custom: markRaw(BaseNode),
}

const edgeTypes = {
  customEdge: markRaw(CustomEdge),
}

const vueFlowWrapper = ref(null)
const { project, onPaneReady, toObject, onNodesChange, onEdgesChange } = useVueFlow()

// Inicializa sincronamente para não ter um milissegundo de array vazio que apaga o DB
const elements = ref(
  props.initialElements && props.initialElements.length > 0
    ? JSON.parse(JSON.stringify(props.initialElements))
    : [
        {
          id: 'node_0',
          type: 'custom',
          position: { x: 250, y: 250 },
          data: { label: 'Ideia Central', shape: 'rectangle' }
        }
      ]
)

const emitElements = () => {
  const obj = toObject()
  // Limpar propriedades internas do VueFlow (como initialized, dimensions, etc) para não quebrar o load futuro
  const cleanNodes = obj.nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data
  }))
  const cleanEdges = obj.edges.map(e => ({
    id: e.id,
    type: e.type,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    style: e.style
  }))
  
  emit('update:elements', [...cleanNodes, ...cleanEdges])
}

onNodesChange(() => emitElements())
onEdgesChange(() => emitElements())

watch(elements, () => {
  emitElements()
}, { deep: true })

let idCounter = Date.now()
const getId = () => `node_${idCounter++}`

const onConnect = (params) => {
  elements.value = addEdge({ 
    ...params, 
    updatable: true, 
    type: 'customEdge',
    animated: false,
    style: { strokeWidth: 2, stroke: '#9ca3af' }
  }, elements.value)
}

const onEdgeUpdate = ({ edge, connection }) => {
  elements.value = updateEdge(edge, connection, elements.value)
}

const onDrop = (event) => {
  event.preventDefault()
  
  const type = event.dataTransfer?.getData('application/vueflow')
  if (!type || !vueFlowWrapper.value) return
  
  const bounds = vueFlowWrapper.value.getBoundingClientRect()
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  })

  let label = 'Novo Nó'
  if (type === 'text') label = 'Escreva seu texto...'

  const newNode = {
    id: getId(),
    type: 'custom',
    position,
    data: { 
      label, 
      shape: type 
    }
  }

  elements.value.push(newNode)
}

onMounted(() => {
  // Inicialização já feita de forma síncrona no setup
})
</script>

<style>
/* Estilização para o Vue Flow imitar a vibe do Miro */
.vue-flow__edge-path {
  stroke: #9ca3af;
  stroke-width: 2px;
}
.vue-flow__handle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f97316; /* orange-500 */
  border: 2px solid white;
}
.vue-flow__handle:hover {
  transform: scale(1.5);
  transition: transform 0.1s ease;
}
</style>
