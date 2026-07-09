<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import rough from 'roughjs'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import EmojiPicker from './EmojiPicker.vue'
import { Plus, Trash2, Ban, ChevronDown, ChevronUp } from 'lucide-vue-next'
import '@vue-flow/node-resizer/dist/style.css'

const props = defineProps<{
  id: string
  data: {
    label: string
    category: string
    content: string
    onUpdateLabel?: (id: string, newLabel: string) => any
    shape?: 'rectangle' | 'sticky' | 'circle'
    width?: number
    height?: number
    isCollapsed?: boolean
    hasChildren?: boolean
    collapsedCount?: number
    emoji?: string
    onToggleCollapse?: (id: string) => void
    onAddSubnode?: (id: string) => void
    onDeleteNode?: (id: string) => void
  }
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateLabel', id: string, newLabel: string): void
}>()

const svgRef = ref<SVGSVGElement | null>(null)
const isEditing = ref(false)
const editedLabel = ref(props.data.label)
const labelInputRef = ref<HTMLInputElement | null>(null)

const shapeModel = computed({
  get: () => props.data.shape || 'rectangle',
  set: (val: 'rectangle' | 'sticky' | 'circle') => {
    props.data.shape = val
  }
})

// Sync editedLabel when props label updates
watch(() => props.data.label, (newVal) => {
  editedLabel.value = newVal
})

function emitAddSubnode() {
  if (typeof props.data.onAddSubnode === 'function') {
    props.data.onAddSubnode(props.id)
  }
}

function emitDeleteNode() {
  if (typeof props.data.onDeleteNode === 'function') {
    props.data.onDeleteNode(props.id)
  }
}

function drawRoughNode() {
  if (!svgRef.value) return
  svgRef.value.innerHTML = ''
  
  const rc = rough.svg(svgRef.value)
  const w = props.data.width || 180
  const h = props.data.height || 80
  
  const categoryColor = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-cat-${props.data.category}`)
    .trim() || '#0ea5e9'

  let hash = 0
  for (let i = 0; i < props.id.length; i++) {
    hash = props.id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const seed = Math.abs(hash) || 1

  const shapeType = props.data.shape || 'rectangle'

  if (shapeType === 'circle') {
    const circleShape = rc.ellipse(w / 2, h / 2, w - 12, h - 12, {
      seed,
      stroke: categoryColor,
      strokeWidth: 2.5,
      roughness: 1.8,
      bowing: 1.5,
      fill: 'rgba(30, 41, 59, 0.45)',
      fillStyle: 'hachure',
      fillWeight: 0.8,
      hachureAngle: 60,
      hachureGap: 14
    })
    svgRef.value.appendChild(circleShape)
  } else if (shapeType === 'sticky') {
    const body = rc.polygon([[2, 2], [w - 26, 2], [w - 2, 26], [w - 2, h - 2], [2, h - 2]], {
      seed,
      stroke: categoryColor,
      strokeWidth: 2.0,
      roughness: 1.4,
      bowing: 1.1,
      fill: 'rgba(253, 224, 71, 0.35)',
      fillStyle: 'solid'
    })
    const fold = rc.polygon([[w - 26, 2], [w - 26, 26], [w - 2, 26]], {
      seed: seed + 1,
      stroke: categoryColor,
      strokeWidth: 1.5,
      roughness: 1.1,
      fill: 'rgba(250, 204, 21, 0.7)',
      fillStyle: 'solid'
    })
    svgRef.value.appendChild(body)
    svgRef.value.appendChild(fold)
  } else {
    const rect = rc.rectangle(2, 2, w - 4, h - 4, {
      seed,
      stroke: categoryColor,
      strokeWidth: 2.5,
      roughness: 1.8,
      bowing: 1.5,
      fill: 'rgba(30, 41, 59, 0.45)',
      fillStyle: 'hachure',
      fillWeight: 0.8,
      hachureAngle: 60,
      hachureGap: 14
    })
    svgRef.value.appendChild(rect)
  }
}

function startEdit() {
  isEditing.value = true
  editedLabel.value = props.data.label
  setTimeout(() => {
    if (labelInputRef.value) {
      labelInputRef.value.focus()
      labelInputRef.value.select()
    }
  }, 50)
}

function saveEdit() {
  if (isEditing.value) {
    const trimmed = editedLabel.value.trim()
    if (trimmed && trimmed !== props.data.label) {
      if (typeof (props.data as any).onUpdateLabel === 'function') {
        ;(props.data as any).onUpdateLabel(props.id, trimmed)
      }
      emit('updateLabel', props.id, trimmed)
    }
    isEditing.value = false
  }
}

onMounted(() => {
  drawRoughNode()
})

function toggleCollapse() {
  if (typeof props.data.onToggleCollapse === 'function') {
    props.data.onToggleCollapse(props.id)
  }
}

const { findNode } = useVueFlow()

function handleResize(event: any) {
  props.data.width = Math.round(event.width)
  props.data.height = Math.round(event.height)
  
  const node = findNode(props.id)
  if (node) {
    node.style = {
      width: `${props.data.width}px`,
      height: `${props.data.height}px`
    }
  }
}
</script>

<template>
  <div 
    class="custom-node-wrapper" 
    :class="{ 'is-selected': selected }" 
    @dblclick="startEdit"
  >
    <NodeToolbar 
      :is-visible="selected && !isEditing" 
      :position="Position.Top"
      class="custom-node-toolbar"
    >
      <div class="toolbar-content" @click.stop>
        <!-- Shape Select -->
        <select v-model="shapeModel" class="toolbar-select" title="Formato do Bloco">
          <option value="rectangle">Retângulo</option>
          <option value="sticky">Nota</option>
          <option value="circle">Círculo</option>
        </select>
        
        <!-- Colors Grid -->
        <div class="color-dots-row">
          <button 
            v-for="cat in ['core', 'vertical', 'oferta', 'outbound', 'posicionamento']" 
            :key="cat"
            type="button"
            class="color-dot-btn"
            :class="{ 'is-active': data.category === cat }"
            :style="{ backgroundColor: `var(--color-cat-${cat})` }"
            @click="data.category = cat"
            :title="cat"
          />
        </div>

        <!-- Emoji Picker -->
        <EmojiPicker placement="bottom" @select="(emoji) => data.emoji = emoji" />

        <!-- Remove Emoji Button -->
        <button 
          v-if="data.emoji" 
          type="button" 
          class="toolbar-btn text-danger" 
          @click="data.emoji = undefined" 
          title="Remover Emoji"
        >
          <Ban :size="14" />
        </button>
        
        <!-- Subnode Add -->
        <button type="button" class="toolbar-btn" @click="emitAddSubnode" title="Adicionar Subnó">
          <Plus :size="14" />
        </button>
        
        <!-- Delete Node -->
        <button type="button" class="toolbar-btn text-danger" @click="emitDeleteNode" title="Excluir Bloco">
          <Trash2 :size="14" />
        </button>
      </div>
    </NodeToolbar>

    <NodeResizer 
      :min-width="120" 
      :min-height="60" 
      :is-visible="selected" 
      :color="'var(--accent-primary)'"
      @resize="handleResize"
    />

    <Handle type="target" :position="Position.Left" class="node-handle handle-left" />
    
    <!-- Collapse/Expand Toggle Indicator -->
    <div 
      v-if="data.hasChildren" 
      class="collapse-toggle" 
      :class="{ 'is-collapsed': data.isCollapsed }"
      @click.stop="toggleCollapse"
      :title="data.isCollapsed ? `Expandir (${data.collapsedCount} subnós)` : 'Recolher subnós'"
    >
      <span v-if="data.isCollapsed" class="collapsed-badge">+{{ data.collapsedCount }}</span>
      <ChevronUp v-else :size="12" class="expanded-icon" />
    </div>
    
    <Handle type="source" :position="Position.Right" class="node-handle handle-right" />
    
    <svg ref="svgRef" class="rough-svg" :viewBox="`0 0 ${data.width || 180} ${data.height || 80}`" preserveAspectRatio="none"></svg>
    
    <div class="node-content">
      <div v-if="data.emoji" class="node-emoji-seal">{{ data.emoji }}</div>
      <div v-if="isEditing" class="edit-mode">
        <input
          ref="labelInputRef"
          v-model="editedLabel"
          class="node-input"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.esc="isEditing = false"
        />
      </div>
      <div v-else class="view-mode" title="Dê duplo clique para editar o título">
        <span class="node-label">{{ data.label }}</span>
      </div>
    </div>

    <!-- Direct Add Subnode Button floating on the right side -->
    <button 
      type="button" 
      class="add-subnode-toggle" 
      @click.stop="emitAddSubnode" 
      title="Adicionar Subnó Conectado"
    >
      <Plus :size="12" />
    </button>
  </div>
</template>

<style scoped>
.custom-node-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  animation: node-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transition: transform var(--transition-fast);
}

@keyframes node-pop {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(15px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.custom-node-wrapper:hover {
  transform: scale(1.02);
}

.rough-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.node-content {
  z-index: 5;
  width: 100%;
  padding: 0.75rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-mode {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.node-label {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-word;
  line-height: 1.3;
}

.edit-mode {
  width: 100%;
}

.node-input {
  width: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 0.25rem;
  font-size: 0.8rem;
  font-family: var(--font-sans);
  text-align: center;
  outline: none;
}

.is-selected :deep(svg path) {
  filter: drop-shadow(0 0 4px var(--accent-primary));
}

.node-handle {
  width: 10px !important;
  height: 10px !important;
  background-color: var(--accent-primary) !important;
  border: 2px solid var(--bg-primary) !important;
  border-radius: 50% !important;
  opacity: 0;
  transition: opacity var(--transition-fast) !important;
  z-index: 20;
}

.custom-node-wrapper:hover .node-handle {
  opacity: 1;
}

.handle-left {
  left: -5px !important;
}

.handle-right {
  right: -5px !important;
}

/* Collapse Toggle Styles */
.collapse-toggle {
  position: absolute;
  bottom: -11px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  background-color: var(--accent-success);
  border: 2px solid var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 30;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.collapse-toggle:hover {
  transform: translateX(-50%) scale(1.1);
  background-color: var(--accent-primary);
}

.collapse-toggle.is-collapsed {
  background-color: var(--accent-primary);
  animation: pulse 2s infinite;
}

.collapsed-badge {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
}

.expanded-badge {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(14, 165, 233, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
  }
}

/* Float Toolbar Styles */
.custom-node-toolbar {
  z-index: 120;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 0.35rem 0.65rem;
  box-shadow: var(--shadow-lg);
  pointer-events: all;
  transform: translateY(-8px);
}

.toolbar-title-input {
  background-color: var(--bg-primary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.5rem;
  color: var(--text-primary);
  font-size: 0.8rem;
  width: 100px;
  outline: none;
}

.toolbar-title-input:focus {
  border-color: var(--accent-primary);
}

.toolbar-select {
  background-color: var(--bg-secondary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.35rem;
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
  outline: none;
}

.color-dots-row {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.color-dot-btn {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform var(--transition-fast);
}

.color-dot-btn:hover {
  transform: scale(1.2);
}

.color-dot-btn.is-active {
  border-color: #fff;
  transform: scale(1.1);
}

.toolbar-btn {
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.toolbar-btn:hover {
  background-color: var(--bg-tertiary);
}

.node-emoji-seal {
  font-size: 2.2rem;
  margin-bottom: 0.15rem;
  user-select: none;
  display: block;
  text-align: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.add-subnode-toggle {
  position: absolute;
  right: -11px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  width: 22px;
  height: 22px;
  background-color: var(--accent-primary);
  border: 2px solid var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 30;
  color: #fff;
  opacity: 0;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.custom-node-wrapper:hover .add-subnode-toggle,
.custom-node-wrapper.is-selected .add-subnode-toggle {
  transform: translateY(-50%) scale(1);
  opacity: 1;
}

.add-subnode-toggle:hover {
  transform: translateY(-50%) scale(1.15) !important;
  background-color: var(--accent-hover);
}

.expanded-icon {
  color: #fff;
}
</style>
