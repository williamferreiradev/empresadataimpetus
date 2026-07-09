<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useMapStorage } from '../composables/useMapStorage'
import type { CanvasNode, CanvasEdge } from '../types/canvas'
import CustomNode from './CustomNode.vue'
import CustomEdge from './CustomEdge.vue'
import NavBar from './NavBar.vue'
import DetailPanel from './DetailPanel.vue'
import EmojiPicker from './EmojiPicker.vue'
import { 
  MousePointer, 
  Hand, 
  Square, 
  StickyNote, 
  Circle, 
  FileText, 
  Maximize, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-vue-next'

const props = defineProps<{
  mapId: string
}>()

const router = useRouter()
const { getMap, saveMap, listMaps } = useMapStorage()

const mapName = ref('')
const nodes = ref<any[]>([])
const edges = ref<any[]>([])

const activeNode = ref<CanvasNode | null>(null)
const activeEdge = ref<CanvasEdge | null>(null)
const isPanelOpen = ref(false)
const panOnDrag = ref(true)

const nodeTypes = {
  custom: CustomNode as any
}
const edgeTypes = {
  custom: CustomEdge as any
}

// Custom Modal Notifications / Confirmations state
const notificationMessage = ref<string | null>(null)
const confirmMessage = ref<string | null>(null)
let onConfirmCallback: (() => void) | null = null

function showNotification(msg: string) {
  notificationMessage.value = msg
}

function showConfirm(msg: string, callback: () => void) {
  confirmMessage.value = msg
  onConfirmCallback = callback
}

function handleConfirmYes() {
  if (onConfirmCallback) onConfirmCallback()
  confirmMessage.value = null
  onConfirmCallback = null
}

const { onConnect, addEdges, onNodeClick, onEdgeClick, fitView, project } = useVueFlow()

// Load map data on mount
onMounted(() => {
  const index = listMaps()
  const currentMap = index.find(m => m.id === props.mapId)
  if (currentMap) {
    mapName.value = currentMap.name
  } else {
    router.push('/')
    return
  }

  const mapData = getMap(props.mapId)
  
  // Transform CanvasNode to Vue Flow Node
  nodes.value = mapData.nodes.map(n => ({
    id: n.id,
    type: 'custom',
    position: n.position,
    style: {
      width: `${n.width || 180}px`,
      height: `${n.height || 80}px`
    },
    data: {
      label: n.label,
      category: n.category,
      content: n.content,
      onUpdateLabel: handleUpdateLabel,
      shape: n.shape || 'rectangle',
      width: n.width || 180,
      height: n.height || 80,
      isCollapsed: n.collapsed || false,
      emoji: n.emoji,
      onToggleCollapse: handleToggleCollapse,
      onAddSubnode: handleAddSubnode,
      onDeleteNode: handleDeleteNode
    }
  }))

  // Transform CanvasEdge to Vue Flow Edge
  edges.value = mapData.edges.map(e => ({
    id: e.id,
    type: 'custom',
    source: e.source,
    target: e.target,
    label: e.label,
    data: {
      routing: e.routing || 'bezier',
      styleType: e.styleType || 'normal',
      color: e.color || '#64748b'
    }
  }))
  // Load initial states after rendering is ready
  setTimeout(() => {
    updateHiddenStates()
  }, 150)
})

// Collapse / Hierarchy helper functions
function getDescendants(nodeId: string): string[] {
  const children = edges.value
    .filter(e => e.source === nodeId)
    .map(e => e.target)
  
  let descendants = [...children]
  children.forEach(childId => {
    descendants = [...descendants, ...getDescendants(childId)]
  })
  return descendants
}

function getCollapsedCount(nodeId: string): number {
  return getDescendants(nodeId).length
}

function isNodeHidden(nodeId: string): boolean {
  const parentEdge = edges.value.find(e => e.target === nodeId)
  if (!parentEdge) return false
  
  const parentNode = nodes.value.find(n => n.id === parentEdge.source)
  if (!parentNode) return false
  
  if (parentNode.data.isCollapsed) return true
  
  return isNodeHidden(parentNode.id)
}

function handleToggleCollapse(nodeId: string) {
  const nodeIndex = nodes.value.findIndex(n => n.id === nodeId)
  if (nodeIndex !== -1) {
    const current = nodes.value[nodeIndex].data.isCollapsed || false
    nodes.value[nodeIndex].data.isCollapsed = !current
    triggerSave()
  }
}

function updateHiddenStates() {
  nodes.value.forEach(n => {
    n.hidden = isNodeHidden(n.id)
    n.data.hasChildren = edges.value.some(e => e.source === n.id)
    n.data.collapsedCount = getCollapsedCount(n.id)
  })
  
  edges.value.forEach(e => {
    e.hidden = isNodeHidden(e.source) || isNodeHidden(e.target)
  })
}

// Watch edges or collapsed state changes to update visibility
watch(
  [edges, () => nodes.value.map(n => n.data.isCollapsed)],
  () => {
    updateHiddenStates()
  },
  { deep: true }
)

// Debounced save to localStorage
let saveTimeout: any = null
function triggerSave() {
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    const rawNodes: CanvasNode[] = nodes.value.map(n => ({
      id: n.id,
      label: n.data.label,
      category: n.data.category,
      content: n.data.content,
      position: n.position,
      shape: n.data.shape || 'rectangle',
      width: n.data.width || 180,
      height: n.data.height || 80,
      collapsed: n.data.isCollapsed || false,
      emoji: n.data.emoji
    }))
    const rawEdges: CanvasEdge[] = edges.value.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      routing: e.data?.routing || 'bezier',
      styleType: e.data?.styleType || 'normal',
      color: e.data?.color || '#64748b'
    }))
    saveMap(props.mapId, { nodes: rawNodes, edges: rawEdges })
  }, 500)
}

// Watch changes to trigger save
watch([nodes, edges], () => {
  triggerSave()
}, { deep: true })

onConnect((params) => {
  addEdges([{
    ...params,
    id: `e-${crypto.randomUUID()}`,
    type: 'custom',
    data: {
      routing: 'bezier',
      styleType: 'normal',
      color: '#64748b'
    }
  }])
})

const orderedNodes = computed(() => {
  return [...nodes.value].sort((a, b) => a.position.x - b.position.x)
})

const currentSlideIndex = ref(0)

function expandAncestors(nodeId: string) {
  const parentEdge = edges.value.find(e => e.target === nodeId)
  if (parentEdge) {
    const parentNode = nodes.value.find(n => n.id === parentEdge.source)
    if (parentNode) {
      parentNode.data.isCollapsed = false
      expandAncestors(parentNode.id)
    }
  }
}

function focusSlide(index: number) {
  if (index < 0 || index >= orderedNodes.value.length) return
  currentSlideIndex.value = index
  const node = orderedNodes.value[index]

  // 1. Collapse all nodes so only root is visible initially
  nodes.value.forEach(n => {
    n.data.isCollapsed = true
  })

  // 2. Expand ancestor path to make target node visible on canvas
  expandAncestors(node.id)
  
  // Force updateHiddenStates to compute visibility immediately
  updateHiddenStates()

  // 3. Fit viewport to target node
  fitView({
    nodes: [node.id],
    duration: 800,
    padding: 0.3
  })
  
  activeEdge.value = null
  activeNode.value = {
    id: node.id,
    label: node.data.label,
    category: node.data.category,
    content: node.data.content,
    position: node.position,
    shape: node.data.shape || 'rectangle',
    width: node.data.width || 180,
    height: node.data.height || 80
  }
  isPanelOpen.value = true

  // 4. Expand target node step-by-step after viewport transition
  setTimeout(() => {
    const targetNode = nodes.value.find(n => n.id === node.id)
    if (targetNode) {
      targetNode.data.isCollapsed = false
      updateHiddenStates()
      triggerSave()
    }
  }, 900)
}

function nextSlide() {
  if (currentSlideIndex.value < orderedNodes.value.length - 1) {
    focusSlide(currentSlideIndex.value + 1)
  }
}

function prevSlide() {
  if (currentSlideIndex.value > 0) {
    focusSlide(currentSlideIndex.value - 1)
  }
}

onNodeClick((event) => {
  const node = event.node
  activeEdge.value = null
  activeNode.value = {
    id: node.id,
    label: node.data.label,
    category: node.data.category,
    content: node.data.content,
    position: node.position,
    shape: node.data.shape || 'rectangle',
    width: node.data.width || 180,
    height: node.data.height || 80
  }
  isPanelOpen.value = true
  
  const idx = orderedNodes.value.findIndex(n => n.id === node.id)
  if (idx !== -1) {
    currentSlideIndex.value = idx
  }
})

onEdgeClick((event) => {
  const edge = event.edge
  activeNode.value = null
  activeEdge.value = {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: typeof edge.label === 'string' ? edge.label : undefined,
    routing: edge.data?.routing || 'bezier',
    styleType: edge.data?.styleType || 'normal',
    color: edge.data?.color || '#64748b'
  }
  isPanelOpen.value = true
})

function handlePaneDblClick(event: MouseEvent) {
  const container = event.currentTarget as HTMLElement
  const bounds = container.getBoundingClientRect()
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top
  
  const projectedPosition = project({ x, y })
  const id = `n-${crypto.randomUUID()}`
  
  nodes.value.push({
    id,
    type: 'custom',
    position: projectedPosition,
    style: {
      width: '180px',
      height: '80px'
    },
    data: {
      label: 'Novo Bloco',
      category: 'core',
      content: '',
      onUpdateLabel: handleUpdateLabel,
      shape: 'rectangle',
      width: 180,
      height: 80,
      isCollapsed: false,
      onToggleCollapse: handleToggleCollapse,
      onAddSubnode: handleAddSubnode,
      onDeleteNode: handleDeleteNode
    }
  })
}

function handleAddSubnode(parentId?: string) {
  const pId = parentId || activeNode.value?.id
  if (!pId) return
  
  const parentNode = nodes.value.find(n => n.id === pId)
  if (!parentNode) return

  const id = `n-${crypto.randomUUID()}`
  const position = {
    x: parentNode.position.x + (parentNode.data.width || 180) + 60,
    y: parentNode.position.y + (Math.random() * 80 - 40)
  }

  nodes.value.push({
    id,
    type: 'custom',
    position,
    style: {
      width: `${parentNode.data.width || 180}px`,
      height: `${parentNode.data.height || 80}px`
    },
    data: {
      label: 'Novo Subnó',
      category: parentNode.data.category,
      content: '',
      onUpdateLabel: handleUpdateLabel,
      shape: parentNode.data.shape || 'rectangle',
      width: parentNode.data.width || 180,
      height: parentNode.data.height || 80,
      isCollapsed: false,
      onToggleCollapse: handleToggleCollapse,
      onAddSubnode: handleAddSubnode,
      onDeleteNode: handleDeleteNode
    }
  })

  edges.value.push({
    id: `e-${crypto.randomUUID()}`,
    type: 'custom',
    source: parentNode.id,
    target: id,
    data: {
      routing: 'bezier',
      styleType: 'normal',
      color: '#64748b'
    }
  })
}

function handleDeleteNode(nodeId: string) {
  showConfirm('Deseja realmente excluir este bloco?', () => {
    nodes.value = nodes.value.filter(n => n.id !== nodeId)
    edges.value = edges.value.filter(e => e.source !== nodeId && e.target !== nodeId)
    
    if (activeNode.value && activeNode.value.id === nodeId) {
      isPanelOpen.value = false
      activeNode.value = null
    }
  })
}

function handleUpdateContent(newContent: string) {
  if (activeNode.value) {
    activeNode.value.content = newContent
    const nodeIndex = nodes.value.findIndex(n => n.id === activeNode.value?.id)
    if (nodeIndex !== -1) {
      nodes.value[nodeIndex].data.content = newContent
    }
  }
}

function handleUpdateLabel(id: string, newLabel: string) {
  const nodeIndex = nodes.value.findIndex(n => n.id === id)
  if (nodeIndex !== -1) {
    nodes.value[nodeIndex].data.label = newLabel
    if (activeNode.value && activeNode.value.id === id) {
      activeNode.value.label = newLabel
    }
  }
}

function handleUpdateLabelFromPanel(newLabel: string) {
  if (activeNode.value) {
    handleUpdateLabel(activeNode.value.id, newLabel)
  }
}

function handleUpdateCategory(newCategory: string) {
  if (activeNode.value) {
    activeNode.value.category = newCategory
    const nodeIndex = nodes.value.findIndex(n => n.id === activeNode.value?.id)
    if (nodeIndex !== -1) {
      nodes.value[nodeIndex].data.category = newCategory
    }
  }
}

function handleUpdateNodeShape(newShape: 'rectangle' | 'sticky' | 'circle') {
  if (activeNode.value) {
    activeNode.value.shape = newShape
    const nodeIndex = nodes.value.findIndex(n => n.id === activeNode.value?.id)
    if (nodeIndex !== -1) {
      nodes.value[nodeIndex].data.shape = newShape
    }
  }
}

function handleUpdateNodeWidth(newWidth: number) {
  if (activeNode.value) {
    activeNode.value.width = newWidth
    const nodeIndex = nodes.value.findIndex(n => n.id === activeNode.value?.id)
    if (nodeIndex !== -1) {
      nodes.value[nodeIndex].data.width = newWidth
    }
  }
}

function handleUpdateNodeHeight(newHeight: number) {
  if (activeNode.value) {
    activeNode.value.height = newHeight
    const nodeIndex = nodes.value.findIndex(n => n.id === activeNode.value?.id)
    if (nodeIndex !== -1) {
      nodes.value[nodeIndex].data.height = newHeight
    }
  }
}

function handleUpdateEdgeRouting(routing: 'bezier' | 'straight' | 'step') {
  if (activeEdge.value) {
    activeEdge.value.routing = routing
    const edgeIndex = edges.value.findIndex(e => e.id === activeEdge.value?.id)
    if (edgeIndex !== -1) {
      if (!edges.value[edgeIndex].data) edges.value[edgeIndex].data = {}
      edges.value[edgeIndex].data.routing = routing
    }
  }
}

function handleUpdateEdgeStyle(styleType: 'normal' | 'dashed' | 'dotted') {
  if (activeEdge.value) {
    activeEdge.value.styleType = styleType
    const edgeIndex = edges.value.findIndex(e => e.id === activeEdge.value?.id)
    if (edgeIndex !== -1) {
      if (!edges.value[edgeIndex].data) edges.value[edgeIndex].data = {}
      edges.value[edgeIndex].data.styleType = styleType
    }
  }
}

function handleUpdateEdgeColor(color: string) {
  if (activeEdge.value) {
    activeEdge.value.color = color
    const edgeIndex = edges.value.findIndex(e => e.id === activeEdge.value?.id)
    if (edgeIndex !== -1) {
      if (!edges.value[edgeIndex].data) edges.value[edgeIndex].data = {}
      edges.value[edgeIndex].data.color = color
    }
  }
}

function handleDeleteEdge() {
  if (activeEdge.value) {
    showConfirm('Tem certeza que deseja excluir esta conexão?', () => {
      edges.value = edges.value.filter(e => e.id !== activeEdge.value?.id)
      isPanelOpen.value = false
      activeEdge.value = null
    })
  }
}

// Controls panel
const nodeLabel = ref('')
const nodeCategory = ref('core')

function handleAddNode() {
  if (!nodeLabel.value.trim()) return
  const id = `n-${crypto.randomUUID()}`
  nodes.value.push({
    id,
    type: 'custom',
    position: { 
      x: 100 + Math.random() * 250, 
      y: 150 + Math.random() * 200 
    },
    style: {
      width: '180px',
      height: '80px'
    },
    data: {
      label: nodeLabel.value.trim(),
      category: nodeCategory.value,
      content: '',
      onUpdateLabel: handleUpdateLabel,
      shape: 'rectangle',
      width: 180,
      height: 80,
      isCollapsed: false,
      onToggleCollapse: handleToggleCollapse,
      onAddSubnode: handleAddSubnode,
      onDeleteNode: handleDeleteNode
    }
  })
  nodeLabel.value = ''
}

function addShapeNode(shape: 'rectangle' | 'sticky' | 'circle') {
  const id = `n-${crypto.randomUUID()}`
  nodes.value.push({
    id,
    type: 'custom',
    position: {
      x: 150 + Math.random() * 200,
      y: 150 + Math.random() * 200
    },
    style: {
      width: '180px',
      height: '80px'
    },
    data: {
      label: shape === 'sticky' ? 'Anotação' : shape === 'circle' ? 'Ideia' : 'Novo Bloco',
      category: 'core',
      content: '',
      onUpdateLabel: handleUpdateLabel,
      shape,
      width: 180,
      height: 80,
      isCollapsed: false,
      onToggleCollapse: handleToggleCollapse,
      onAddSubnode: handleAddSubnode,
      onDeleteNode: handleDeleteNode
    }
  })
}

function onDragStart(event: DragEvent, nodeType: 'rectangle' | 'sticky' | 'circle') {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDrop(event: DragEvent) {
  const nodeType = event.dataTransfer?.getData('application/vueflow') as 'rectangle' | 'sticky' | 'circle'
  if (!nodeType) return

  const container = event.currentTarget as HTMLElement
  const rect = container.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const projectedPosition = project({ x, y })
  const id = `n-${crypto.randomUUID()}`

  nodes.value.push({
    id,
    type: 'custom',
    position: projectedPosition,
    style: {
      width: '180px',
      height: '80px'
    },
    data: {
      label: nodeType === 'sticky' ? 'Anotação' : nodeType === 'circle' ? 'Ideia' : 'Novo Bloco',
      category: 'core',
      content: '',
      onUpdateLabel: handleUpdateLabel,
      shape: nodeType,
      width: 180,
      height: 80,
      isCollapsed: false,
      onToggleCollapse: handleToggleCollapse,
      onAddSubnode: handleAddSubnode,
      onDeleteNode: handleDeleteNode
    }
  })
}

function handleDeleteSelected() {
  const selectedNodes = nodes.value.filter(n => n.selected).map(n => n.id)
  const hasSelection = nodes.value.some(n => n.selected) || edges.value.some(e => e.selected)
  
  if (!hasSelection) {
    showNotification('Selecione um nó ou uma aresta clicando sobre ele antes de excluir.')
    return
  }

  showConfirm('Deseja excluir os itens selecionados no canvas?', () => {
    nodes.value = nodes.value.filter(n => !n.selected)
    edges.value = edges.value.filter(e => !e.selected && !selectedNodes.includes(e.source) && !selectedNodes.includes(e.target))
    
    if (activeNode.value && selectedNodes.includes(activeNode.value.id)) {
      isPanelOpen.value = false
      activeNode.value = null
    }
  })
}
</script>

<template>
  <div class="canvas-container">
    <!-- Top dynamic navbar -->
    <NavBar :nodes="nodes" :map-name="mapName" @back="router.push('/')" />

    <!-- Vue Flow Editor -->
    <div class="flow-wrapper" @dragover.prevent @drop="onDrop">
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :pan-on-drag="panOnDrag"
        fit-view-on-init
        class="rough-canvas-flow"
        @dblclick="handlePaneDblClick"
      />
    </div>

    <!-- Left vertical toolbox capsule -->
    <div class="vertical-toolbar">
      <!-- Drag & Marquee Selection Modes -->
      <button 
        class="tool-btn" 
        :class="{ 'is-active-tool': !panOnDrag }"
        @click="panOnDrag = false" 
        title="Modo Seleção (Clique e arraste para selecionar múltiplos)"
      >
        <MousePointer :size="16" />
      </button>
      <button 
        class="tool-btn" 
        :class="{ 'is-active-tool': panOnDrag }"
        @click="panOnDrag = true" 
        title="Modo Navegação (Arraste para mover o canvas)"
      >
        <Hand :size="16" />
      </button>

      <div class="toolbar-divider"></div>

      <button 
        class="tool-btn" 
        @click="addShapeNode('rectangle')" 
        draggable="true"
        @dragstart="onDragStart($event, 'rectangle')"
        title="Adicionar/Arrastar Retângulo"
      >
        <Square :size="16" />
      </button>
      <button 
        class="tool-btn" 
        @click="addShapeNode('sticky')" 
        draggable="true"
        @dragstart="onDragStart($event, 'sticky')"
        title="Adicionar/Arrastar Nota Adesiva"
      >
        <StickyNote :size="16" />
      </button>
      <button 
        class="tool-btn" 
        @click="addShapeNode('circle')" 
        draggable="true"
        @dragstart="onDragStart($event, 'circle')"
        title="Adicionar/Arrastar Círculo"
      >
        <Circle :size="16" />
      </button>
      <button class="tool-btn" @click="router.push('/docs')" title="Escrever e Gerar de Documento">
        <FileText :size="16" />
      </button>
      <button class="tool-btn" @click="fitView({ duration: 800 })" title="Enquadrar Visualização">
        <Maximize :size="16" />
      </button>
    </div>

    <!-- Floating bottom toolbox -->
    <div class="canvas-controls">
      <div class="control-card">
        <div class="card-header-row">
          <h4>Painel de Controle</h4>
          <button class="btn btn-danger delete-selected-btn-inline" @click="handleDeleteSelected" title="Excluir selecionados">
            <Trash2 :size="14" class="mr-1" /> Excluir Selecionado
          </button>
        </div>
        <div class="control-row">
          <div class="input-with-emoji">
            <input
              v-model="nodeLabel"
              placeholder="Título..."
              class="map-input node-title-input"
              @keyup.enter="handleAddNode"
            />
            <EmojiPicker @select="(emoji) => nodeLabel += emoji" />
          </div>
          <select v-model="nodeCategory" class="map-input category-select">
            <option value="core">Azul Celeste</option>
            <option value="vertical">Turquesa</option>
            <option value="oferta">Verde Esmeralda</option>
            <option value="outbound">Laranja Âmbar</option>
            <option value="posicionamento">Vermelho Rubi</option>
          </select>
          <button class="btn btn-primary" @click="handleAddNode">Adicionar</button>
        </div>
      </div>
    </div>

    <!-- Slide Mode Navigator -->
    <div v-if="orderedNodes.length > 0" class="slides-navigator">
      <button 
        class="btn btn-secondary slide-btn" 
        @click="prevSlide" 
        :disabled="currentSlideIndex <= 0"
        title="Slide Anterior"
      >
        <ChevronLeft :size="16" />
      </button>
      <div class="slide-indicator-card" @click="focusSlide(currentSlideIndex)" title="Re-focar slide atual">
        <span class="slide-badge">Slide {{ currentSlideIndex + 1 }} de {{ orderedNodes.length }}</span>
        <span class="slide-title-text">{{ orderedNodes[currentSlideIndex]?.data.label }}</span>
      </div>
      <button 
        class="btn btn-secondary slide-btn" 
        @click="nextSlide" 
        :disabled="currentSlideIndex >= orderedNodes.length - 1"
        title="Próximo Slide"
      >
        <ChevronRight :size="16" />
      </button>
    </div>

    <!-- Right details slide panel -->
    <DetailPanel
      :node="activeNode"
      :edge="activeEdge"
      :is-open="isPanelOpen"
      @close="isPanelOpen = false"
      @update-content="handleUpdateContent"
      @update-label="handleUpdateLabelFromPanel"
      @update-category="handleUpdateCategory"
      @update-node-shape="handleUpdateNodeShape"
      @update-node-width="handleUpdateNodeWidth"
      @update-node-height="handleUpdateNodeHeight"
      @update-edge-routing="handleUpdateEdgeRouting"
      @update-edge-style="handleUpdateEdgeStyle"
      @update-edge-color="handleUpdateEdgeColor"
      @add-subnode="handleAddSubnode"
      @delete-edge="handleDeleteEdge"
    />

    <!-- Custom Modal Notifications Overlay -->
    <Transition name="fade">
      <div v-if="notificationMessage" class="modal-overlay" @click="notificationMessage = null">
        <div class="modal-card" @click.stop>
          <div class="modal-icon">⚠️</div>
          <p class="modal-message">{{ notificationMessage }}</p>
          <button class="btn btn-primary modal-close-btn" @click="notificationMessage = null">Entendido</button>
        </div>
      </div>
    </Transition>

    <!-- Custom Modal Confirmations Overlay -->
    <Transition name="fade">
      <div v-if="confirmMessage" class="modal-overlay" @click="confirmMessage = null">
        <div class="modal-card" @click.stop>
          <div class="modal-icon icon-danger">🗑️</div>
          <p class="modal-message">{{ confirmMessage }}</p>
          <div class="modal-actions-row">
            <button class="btn btn-secondary" @click="confirmMessage = null">Cancelar</button>
            <button class="btn btn-danger" @click="handleConfirmYes">Confirmar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.flow-wrapper {
  width: 100%;
  height: 100%;
}

.rough-canvas-flow {
  background-color: var(--bg-primary);
  background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 24px 24px;
}

.canvas-controls {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  z-index: 50;
}

.control-card {
  background-color: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: var(--shadow-lg);
}

.control-card h4 {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.node-title-input {
  padding: 0.45rem 0.75rem;
  font-size: 0.85rem;
  width: 160px;
}

.category-select {
  padding: 0.45rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  background-color: var(--bg-secondary);
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.delete-selected-btn-inline {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  color: var(--accent-danger);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all var(--transition-fast);
}

.delete-selected-btn-inline:hover {
  background-color: var(--accent-danger);
  color: #fff;
  border-color: transparent;
}

.slides-navigator {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 60;
  background-color: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.slide-btn {
  padding: 0.5rem 0.8rem;
  font-size: 0.9rem;
  height: 38px;
}

.slide-indicator-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1.25rem;
  min-width: 180px;
  max-width: 280px;
  cursor: pointer;
  user-select: none;
}

.slide-badge {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.slide-title-text {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
}

/* Custom Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
}

.modal-icon {
  font-size: 3rem;
}

.modal-icon.icon-danger {
  color: var(--accent-danger);
}

.modal-message {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.5;
}

.modal-close-btn {
  width: 100%;
  padding: 0.6rem;
  font-weight: 600;
}

.modal-actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.input-with-emoji {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Vertical Left Toolbar Capsule */
.vertical-toolbar {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(13, 17, 28, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: var(--shadow-lg);
  z-index: 50;
}

.tool-btn {
  background: none;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  font-size: 1.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
  color: var(--text-primary);
}

.tool-btn:hover {
  background-color: var(--bg-tertiary);
  transform: scale(1.05);
}

.tool-btn.is-active-tool {
  background-color: var(--accent-primary);
  color: #fff;
}

.tool-btn.is-active-tool:hover {
  background-color: var(--accent-hover);
}

.toolbar-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 0.25rem 0;
}
</style>
