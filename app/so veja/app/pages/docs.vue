<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { useMapStorage } from '../composables/useMapStorage'
import CustomNode from '../components/CustomNode.vue'
import CustomEdge from '../components/CustomEdge.vue'
import EmojiPicker from '../components/EmojiPicker.vue'
import { ArrowLeft, Check, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const { createMap, saveMap } = useMapStorage()

const mapTitle = ref('Meu Mapa por Documento')
const showModal = ref(false)
const modalMessage = ref('')
const markdownText = ref(`# Visão Geral do Projeto Impetus Canvas
## Camada de Dados
### useMapStorage
### types/canvas.ts
## Componentes Reativos
### CanvasRoot
### CustomNode
### CustomEdge
## Estilização
### main.css
### Rough.js`)

const nodes = ref<any[]>([])
const edges = ref<any[]>([])

const nodeTypes = {
  custom: CustomNode as any
}
const edgeTypes = {
  custom: CustomEdge as any
}

// Destructure from useVueFlow
const { fitView } = useVueFlow()

interface ParsedHeader {
  id: string
  label: string
  level: number
}

function parseMarkdownToFlow(markdown: string) {
  const lines = markdown.split('\n')
  const headers: ParsedHeader[] = []
  
  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match && match[1] && match[2]) {
      headers.push({
        id: `h-${index}`,
        label: match[2].trim(),
        level: match[1].length
      })
    }
  })

  const flowNodes: any[] = []
  const flowEdges: any[] = []
  
  const lastActiveAtLevel: Record<number, string> = {}
  
  // Keep progressive Y coordinates to avoid overlays
  let currentY = 40
  
  // Horizontal layout configuration
  const startX = 60
  const columnWidth = 260
  const rowHeight = 110
  
  // Count nodes at each level to manage vertical distribution
  const countAtLevel: Record<number, number> = {}

  headers.forEach((header, index) => {
    // Parent node is the last active header at (level - 1)
    const parentId = lastActiveAtLevel[header.level - 1]
    
    // Manage Y coordinate to distribute nodes vertically
    if (countAtLevel[header.level] === undefined) {
      countAtLevel[header.level] = 0
    }
    const verticalIndex = countAtLevel[header.level]
    countAtLevel[header.level]++
    
    // Position node based on level (horizontal columns)
    const x = startX + (header.level - 1) * columnWidth
    const y = currentY + (verticalIndex * rowHeight)

    flowNodes.push({
      id: header.id,
      type: 'custom',
      position: { x, y },
      style: {
        width: '180px',
        height: '80px'
      },
      data: {
        label: header.label,
        category: header.level === 1 ? 'core' : header.level === 2 ? 'vertical' : 'oferta',
        content: '',
        shape: 'rectangle',
        width: 180,
        height: 80,
        isCollapsed: false
      }
    })

    // Create edge link to parent
    if (parentId) {
      flowEdges.push({
        id: `e-${parentId}-${header.id}`,
        source: parentId,
        target: header.id,
        type: 'custom',
        data: {
          routing: 'bezier',
          styleType: 'normal',
          color: '#64748b'
        }
      })
    }

    lastActiveAtLevel[header.level] = header.id
  })

  nodes.value = flowNodes
  edges.value = flowEdges
  
  // Auto zoom fit on changes
  setTimeout(() => {
    fitView({ duration: 500, padding: 0.15 })
  }, 100)
}

watch(markdownText, (val) => {
  parseMarkdownToFlow(val)
}, { immediate: true })

onMounted(() => {
  parseMarkdownToFlow(markdownText.value)
})

function loadTemplate(type: 'team' | 'steps') {
  if (type === 'team') {
    mapTitle.value = 'Estrutura de Equipe'
    markdownText.value = `# Diretoria Geral
## Engenharia de Software
### Squad Alpha (Frontend)
### Squad Beta (Backend)
## Marketing e Vendas
### Inbound Marketing
### Outbound Sales
## Suporte ao Cliente`
  } else {
    mapTitle.value = 'Planejamento de Estudos'
    markdownText.value = `# Jornada de Aprendizado
## Fundamentos Web
### HTML Semântico
### CSS Grid e Flexbox
### Javascript Moderno (ES6+)
## Frameworks Reativos
### Vue.js 3
### Nuxt 4
## DevOps e Infra
### Docker e Containers
### Deploy na Vercel`
  }
}

function handleExport() {
  if (nodes.value.length === 0) return
  const id = createMap(mapTitle.value)
  saveMap(id, nodes.value, edges.value)
  router.push(`/mapas/${id}`)
}

function insertHeading(level: number) {
  const el = document.getElementById('md-editor') as HTMLTextAreaElement
  if (!el) return
  
  const start = el.selectionStart
  const end = el.selectionEnd
  const text = markdownText.value
  
  const before = text.substring(0, start)
  const after = text.substring(end)
  const selectedText = text.substring(start, end) || 'Título'
  
  const hashes = '#'.repeat(level)
  const replacement = `\n${hashes} ${selectedText}\n`
  markdownText.value = before + replacement + after
  
  setTimeout(() => {
    el.focus()
    el.setSelectionRange(start + hashes.length + 2, start + hashes.length + 2 + selectedText.length)
  }, 50)
}

function insertBullet() {
  const el = document.getElementById('md-editor') as HTMLTextAreaElement
  if (!el) return
  
  const start = el.selectionStart
  const end = el.selectionEnd
  const text = markdownText.value
  
  const before = text.substring(0, start)
  const after = text.substring(end)
  const selectedText = text.substring(start, end) || 'Item'
  
  const replacement = `\n- ${selectedText}\n`
  markdownText.value = before + replacement + after
  
  setTimeout(() => {
    el.focus()
    el.setSelectionRange(start + 3, start + 3 + selectedText.length)
  }, 50)
}
</script>

<template>
  <div class="docs-section-container">
    <!-- Left panel (Editor) -->
    <aside class="editor-aside">
      <header class="editor-header">
        <button class="btn btn-secondary back-btn" @click="router.push('/')">
          <ArrowLeft :size="16" class="mr-1" /> Início
        </button>
        <span class="editor-header-title">Documento para Mapa</span>
      </header>

      <div class="editor-body">
        <div class="input-field-group">
          <label for="map-name-input">Título do Mapa Mental</label>
          <div class="input-with-emoji">
            <input 
              id="map-name-input"
              v-model="mapTitle"
              placeholder="Nome do mapa mental..."
              class="map-input full-width-input"
            />
            <EmojiPicker @select="(emoji) => mapTitle += emoji" />
          </div>
        </div>

        <div class="templates-row">
          <span>Exemplos:</span>
          <button class="btn-text template-lnk" @click="loadTemplate('team')">🏢 Equipe</button>
          <button class="btn-text template-lnk" @click="loadTemplate('steps')">📚 Estudos</button>
        </div>

        <div class="input-field-group textarea-group">
          <label for="md-editor">Escreva seu documento (use a barra de formatação)</label>
          <div class="editor-toolbar">
            <button type="button" class="format-btn" @click="insertHeading(1)" title="Título Principal (H1)">H1</button>
            <button type="button" class="format-btn" @click="insertHeading(2)" title="Subtítulo (H2)">H2</button>
            <button type="button" class="format-btn" @click="insertHeading(3)" title="Subtópico (H3)">H3</button>
            <span class="toolbar-divider"></span>
            <button type="button" class="format-btn" @click="insertBullet" title="Lista/Marcador">• Marcador</button>
          </div>
          <textarea
            id="md-editor"
            v-model="markdownText"
            placeholder="# Título Principal&#10;## Subtópico..."
            class="document-textarea"
          ></textarea>
        </div>

        <button class="btn btn-primary export-btn" @click="handleExport">
          <Check :size="16" class="mr-1" /> Salvar e Editar no Canvas
        </button>
      </div>
    </aside>

    <!-- Right panel (Live VueFlow visualization) -->
    <main class="visualizer-main">
      <header class="visualizer-header">
        <span class="preview-badge">Visualização em Tempo Real</span>
      </header>

      <div class="visualizer-canvas-wrapper">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :node-types="nodeTypes"
          :edge-types="edgeTypes"
          fit-view-on-init
          class="live-preview-flow"
        />
      </div>
    </main>

    <!-- Notification Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-card" @click.stop>
          <div class="modal-icon icon-danger">
            <AlertTriangle :size="48" />
          </div>
          <p class="modal-message">{{ modalMessage }}</p>
          <button class="btn btn-primary modal-close-btn" @click="showModal = false">Entendido</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.docs-section-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.editor-aside {
  width: 420px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background-color: #0d111c;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-header {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
}

.editor-header-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}

.editor-body {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.input-field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-field-group label {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.full-width-input {
  width: 100%;
  padding: 0.6rem 0.9rem;
}

.templates-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.template-lnk {
  font-weight: 600;
  color: var(--accent-primary);
}

.template-lnk:hover {
  text-decoration: underline;
}

.textarea-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 0.25rem;
}

.format-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.format-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.toolbar-divider {
  width: 1px;
  height: 16px;
  background-color: var(--bg-tertiary);
  margin: 0 0.25rem;
}

.document-textarea {
  flex: 1;
  min-height: 250px;
  background-color: var(--bg-primary);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-md);
  padding: 1rem;
  color: var(--text-primary);
  font-family: monospace;
  font-size: 0.9rem;
  resize: none;
  outline: none;
  transition: border-color var(--transition-fast);
}

.document-textarea:focus {
  border-color: var(--accent-primary);
}

.export-btn {
  width: 100%;
  padding: 0.85rem;
  font-weight: 600;
}

.visualizer-main {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.visualizer-header {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background-color: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.75rem;
}

.preview-badge {
  font-size: 0.75rem;
  color: var(--accent-success);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.visualizer-canvas-wrapper {
  width: 100%;
  height: 100%;
}

.live-preview-flow {
  background-color: var(--bg-primary);
  background-image: radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0);
  background-size: 24px 24px;
}

/* Modal Overlay Styles */
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
</style>
