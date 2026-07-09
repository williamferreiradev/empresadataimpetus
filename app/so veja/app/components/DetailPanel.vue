<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import type { CanvasNode, CanvasEdge } from '../types/canvas'
import EmojiPicker from './EmojiPicker.vue'
import { Plus, Trash2 } from 'lucide-vue-next'

const props = defineProps<{
  node: CanvasNode | null
  edge: CanvasEdge | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateContent', content: string): void
  (e: 'updateLabel', label: string): void
  (e: 'updateCategory', category: string): void
  (e: 'updateNodeShape', shape: 'rectangle' | 'sticky' | 'circle'): void
  (e: 'updateNodeWidth', width: number): void
  (e: 'updateNodeHeight', height: number): void
  (e: 'updateEdgeRouting', routing: 'bezier' | 'straight' | 'step'): void
  (e: 'updateEdgeStyle', styleType: 'normal' | 'dashed' | 'dotted'): void
  (e: 'updateEdgeColor', color: string): void
  (e: 'addSubnode'): void
  (e: 'deleteEdge'): void
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const renderedMarkdown = computed(() => {
  if (!props.node || !props.node.content) {
    return '<p class="empty-preview"><i>Nenhum conteúdo detalhado. Use o editor abaixo para adicionar anotações em Markdown!</i></p>'
  }
  return md.render(props.node.content)
})

// Node models
const contentModel = computed({
  get: () => props.node?.content || '',
  set: (val: string) => emit('updateContent', val)
})

const labelModel = computed({
  get: () => props.node?.label || '',
  set: (val: string) => emit('updateLabel', val)
})

const categoryModel = computed({
  get: () => props.node?.category || 'core',
  set: (val: string) => emit('updateCategory', val)
})

const shapeModel = computed({
  get: () => props.node?.shape || 'rectangle',
  set: (val: 'rectangle' | 'sticky' | 'circle') => emit('updateNodeShape', val)
})

const widthModel = computed({
  get: () => props.node?.width || 180,
  set: (val: number) => emit('updateNodeWidth', Number(val))
})

const heightModel = computed({
  get: () => props.node?.height || 80,
  set: (val: number) => emit('updateNodeHeight', Number(val))
})

// Edge models
const edgeRoutingModel = computed({
  get: () => props.edge?.routing || 'bezier',
  set: (val: 'bezier' | 'straight' | 'step') => emit('updateEdgeRouting', val)
})

const edgeStyleModel = computed({
  get: () => props.edge?.styleType || 'normal',
  set: (val: 'normal' | 'dashed' | 'dotted') => emit('updateEdgeStyle', val)
})

const edgeColorModel = computed({
  get: () => props.edge?.color || '#64748b',
  set: (val: string) => emit('updateEdgeColor', val)
})
</script>

<template>
  <Transition name="slide">
    <!-- Panel for Node Editing -->
    <div v-if="isOpen && node" class="detail-panel">
      <header class="panel-header">
        <div class="header-title">
          <span class="category-badge" :style="{ backgroundColor: `var(--color-cat-${node.category}, var(--accent-primary))` }">
            {{ node.category }}
          </span>
          <h2>{{ node.label }}</h2>
        </div>
        <button class="btn-text close-btn" @click="emit('close')">✕</button>
      </header>

      <div class="panel-body">
        <!-- Edit properties section -->
        <div class="panel-section edit-properties-section">
          <div class="property-group">
            <label for="edit-node-title">Título do Bloco</label>
            <div class="input-with-emoji">
              <input 
                id="edit-node-title" 
                v-model="labelModel" 
                class="map-input edit-property-input" 
                placeholder="Digite o título..."
              />
              <EmojiPicker @select="(emoji) => labelModel += emoji" />
            </div>
          </div>
          
          <div class="property-row-split">
            <div class="property-group">
              <label for="edit-node-category">Cor</label>
              <select 
                id="edit-node-category" 
                v-model="categoryModel" 
                class="map-input edit-property-select"
              >
                <option value="core">Azul Celeste</option>
                <option value="vertical">Turquesa</option>
                <option value="oferta">Verde Esmeralda</option>
                <option value="outbound">Laranja Âmbar</option>
                <option value="posicionamento">Vermelho Rubi</option>
              </select>
            </div>

            <div class="property-group">
              <label for="edit-node-shape">Formato</label>
              <select 
                id="edit-node-shape" 
                v-model="shapeModel" 
                class="map-input edit-property-select"
              >
                <option value="rectangle">Retângulo</option>
                <option value="sticky">Nota Adesiva</option>
                <option value="circle">Círculo</option>
              </select>
            </div>
          </div>

          <!-- Dimension Resizing sliders -->
          <div class="property-row-split dimension-sliders">
            <div class="property-group">
              <label for="edit-node-width">Largura <span class="dimension-value">({{ widthModel }}px)</span></label>
              <input 
                id="edit-node-width"
                type="range"
                v-model="widthModel"
                min="120"
                max="400"
                step="10"
                class="range-slider"
              />
            </div>

            <div class="property-group">
              <label for="edit-node-height">Altura <span class="dimension-value">({{ heightModel }}px)</span></label>
              <input 
                id="edit-node-height"
                type="range"
                v-model="heightModel"
                min="60"
                max="300"
                step="10"
                class="range-slider"
              />
            </div>
          </div>
        </div>

        <!-- Node Actions (Add Subnode) -->
        <div class="panel-section node-actions-container">
          <button class="btn btn-primary add-subnode-btn text-center" @click="emit('addSubnode')">
            <Plus :size="14" class="mr-1" /> Adicionar Subnó Conectado
          </button>
        </div>

        <!-- Rendered Markdown view -->
        <div class="panel-section">
          <h3 class="section-label">Descrição (Visualização)</h3>
          <div class="markdown-preview" v-html="renderedMarkdown"></div>
        </div>

        <!-- Markdown editor -->
        <div class="panel-section editor-section">
          <h3 class="section-label">Anotações (Markdown)</h3>
          <textarea
            v-model="contentModel"
            placeholder="Escreva em markdown..."
            class="markdown-textarea"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Panel for Connection Line Editing -->
    <div v-else-if="isOpen && edge" class="detail-panel">
      <header class="panel-header">
        <div class="header-title">
          <span class="category-badge" style="background-color: #64748b;">Conexão</span>
          <h2>Aresta de Ligação</h2>
        </div>
        <button class="btn-text close-btn" @click="emit('close')">✕</button>
      </header>

      <div class="panel-body">
        <div class="panel-section edit-properties-section">
          <div class="property-group">
            <label for="edit-edge-routing">Roteamento (Formato)</label>
            <select 
              id="edit-edge-routing" 
              v-model="edgeRoutingModel" 
              class="map-input edit-property-select"
            >
              <option value="bezier">Curva (Bezier)</option>
              <option value="straight">Linha Reta</option>
              <option value="step">Ortogonal (Passo)</option>
            </select>
          </div>

          <div class="property-group">
            <label for="edit-edge-style">Estilo do Traço</label>
            <select 
              id="edit-edge-style" 
              v-model="edgeStyleModel" 
              class="map-input edit-property-select"
            >
              <option value="normal">Contínuo (Normal)</option>
              <option value="dashed">Tracejado (Dashed)</option>
              <option value="dotted">Pontilhado (Dotted)</option>
            </select>
          </div>

          <div class="property-group">
            <label for="edit-edge-color">Cor da Conexão</label>
            <select 
              id="edit-edge-color" 
              v-model="edgeColorModel" 
              class="map-input edit-property-select"
            >
              <option value="#64748b">Cinza Padrão</option>
              <option value="#0ea5e9">Azul Celeste</option>
              <option value="#10b981">Verde Esmeralda</option>
              <option value="#f59e0b">Laranja Âmbar</option>
              <option value="#ef4444">Vermelho Rubi</option>
            </select>
          </div>
        </div>

        <div class="panel-section edge-actions-container">
          <button class="btn btn-danger delete-edge-btn text-center" @click="emit('deleteEdge')">
            <Trash2 :size="14" class="mr-1" /> Excluir Linha de Conexão
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.detail-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 420px;
  height: 100%;
  background-color: rgba(13, 17, 28, 0.85);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.header-title h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-word;
}

.category-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #fff;
}

.close-btn {
  font-size: 1.25rem;
  padding: 0.25rem;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  font-weight: 600;
}

.empty-preview {
  color: var(--text-muted);
}

.markdown-preview {
  font-size: 0.95rem;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 1rem;
  min-height: 120px;
  max-height: 220px;
  overflow-y: auto;
}

/* Styled HTML returned from markdown parser */
.markdown-preview :deep(p) {
  margin-bottom: 0.75rem;
}
.markdown-preview :deep(p:last-child) {
  margin-bottom: 0;
}
.markdown-preview :deep(h1), 
.markdown-preview :deep(h2), 
.markdown-preview :deep(h3) {
  font-family: var(--font-display);
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  color: var(--text-primary);
}
.markdown-preview :deep(ul), 
.markdown-preview :deep(ol) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}
.markdown-preview :deep(code) {
  background-color: var(--bg-secondary);
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  font-family: monospace;
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.markdown-textarea {
  flex: 1;
  min-height: 150px;
  background-color: rgba(5, 8, 17, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 1rem;
  color: var(--text-primary);
  font-family: monospace;
  font-size: 0.9rem;
  resize: none;
  outline: none;
  transition: border-color var(--transition-fast);
}

.markdown-textarea:focus {
  border-color: var(--accent-primary);
}

.edit-properties-section {
  background-color: var(--bg-primary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.property-row-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.property-group label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.edit-property-input,
.edit-property-select {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  width: 100%;
}

.edit-property-select {
  background-color: var(--bg-secondary);
  cursor: pointer;
}

.dimension-value {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.range-slider {
  width: 100%;
  accent-color: var(--accent-primary);
  height: 6px;
  outline: none;
  cursor: pointer;
}

.add-subnode-btn {
  width: 100%;
  padding: 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-edge-btn {
  width: 100%;
  padding: 0.65rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: transform var(--transition-normal);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
.input-with-emoji {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
