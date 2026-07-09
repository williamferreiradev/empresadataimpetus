<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStorage } from '../composables/useMapStorage'
import type { MapMeta } from '../types/canvas'
import EmojiPicker from './EmojiPicker.vue'
import { 
  PenTool, 
  PlusCircle, 
  FileText, 
  Search, 
  FolderOpen, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ArrowRight,
  Plus
} from 'lucide-vue-next'

const router = useRouter()
const { listMaps, createMap, deleteMap, renameMap, getMap } = useMapStorage()

const maps = ref<MapMeta[]>([])
const newMapName = ref('')
const editingMapId = ref<string | null>(null)
const editingMapName = ref('')
const searchQuery = ref('')
const selectedColorFilter = ref('all')

function refreshMaps() {
  maps.value = listMaps()
}

function handleCreateMap() {
  const name = newMapName.value.trim() || `Mapa ${maps.value.length + 1}`
  const id = createMap(name)
  newMapName.value = ''
  router.push(`/mapas/${id}`)
}

function handleDelete(id: string) {
  if (confirm('Tem certeza de que deseja deletar este mapa? Esta ação não pode ser desfeita.')) {
    deleteMap(id)
    refreshMaps()
  }
}

const renameInput = ref<HTMLInputElement | null>(null)

function startRename(map: MapMeta) {
  editingMapId.value = map.id
  editingMapName.value = map.name
  // Focus after DOM render
  setTimeout(() => {
    if (renameInput.value) {
      renameInput.value.focus()
      renameInput.value.select()
    }
  }, 50)
}

function handleRename(id: string) {
  const name = editingMapName.value.trim()
  if (name) {
    renameMap(id, name)
    editingMapId.value = null
    refreshMaps()
  }
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const filteredMaps = computed(() => {
  let list = maps.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    list = list.filter(m => m.name.toLowerCase().includes(query))
  }

  if (selectedColorFilter.value !== 'all') {
    list = list.filter(m => {
      const mapData = getMap(m.id)
      if (!mapData || !mapData.nodes) return false
      return mapData.nodes.some(n => n.category === selectedColorFilter.value)
    })
  }

  return list
})

onMounted(() => {
  refreshMaps()
})
</script>

<template>
  <div class="map-list-dashboard">
    <!-- Left Sidebar for Actions/Creation -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <PenTool :size="22" class="logo-icon-svg" />
          <h1>Impetus</h1>
        </div>
        <p class="subtitle">Seus mapas mentais e canvas de forma minimalista, fluida e reativa.</p>
      </div>
      
      <div class="sidebar-divider"></div>
      
      <div class="sidebar-creation-section">
        <h3><PlusCircle :size="14" class="mr-1" /> Comece do Zero</h3>
        <p class="creation-help">Digite o nome para criar um mapa mental limpo.</p>
        <div class="input-with-emoji">
          <input 
            v-model="newMapName"
            placeholder="Nome do mapa..."
            class="map-input sidebar-input"
            @keyup.enter="handleCreateMap"
          />
          <EmojiPicker @select="(emoji) => newMapName += emoji" />
        </div>
        <button class="btn btn-primary w-full mt-2" @click="handleCreateMap">
          Criar Novo Mapa
        </button>
        
        <div class="sidebar-spacer"></div>
        
        <h3><FileText :size="14" class="mr-1" /> Comece com Docs</h3>
        <p class="creation-help">Escreva um documento estruturado e gere o mapa mental.</p>
        <button class="btn btn-secondary w-full docs-nav-btn mt-2" @click="router.push('/docs')">
          <FileText :size="14" class="mr-1" /> Gerar de Documento
        </button>
      </div>
    </aside>

    <!-- Right Main Content for Maps Grid -->
    <main class="dashboard-main">
      <div class="section-header-row">
        <h2 class="section-title">Meus Mapas</h2>
        
        <!-- Search and Filter Bar -->
        <div class="filter-bar">
          <div class="search-wrapper">
            <span class="search-icon"><Search :size="14" /></span>
            <input 
              v-model="searchQuery" 
              placeholder="Buscar mapa por nome..." 
              class="map-input search-input"
            />
          </div>
          
          <div class="color-filter-wrapper">
            <label for="color-filter-select">Filtrar por Cor:</label>
            <select id="color-filter-select" v-model="selectedColorFilter" class="map-input filter-select">
              <option value="all">Todas as cores</option>
              <option value="core">Azul Celeste</option>
              <option value="vertical">Turquesa</option>
              <option value="oferta">Verde Esmeralda</option>
              <option value="outbound">Laranja Âmbar</option>
              <option value="posicionamento">Vermelho Rubi</option>
            </select>
          </div>
        </div>
      </div>
      
      <div v-if="filteredMaps.length === 0" class="empty-state">
        <div class="empty-icon"><FolderOpen :size="48" class="text-muted" /></div>
        <p>Nenhum mapa encontrado.</p>
        <span v-if="searchQuery || selectedColorFilter !== 'all'">Nenhum resultado corresponde aos filtros selecionados.</span>
        <span v-else>Crie um mapa ou documento na barra lateral para começar!</span>
      </div>

      <div v-else class="maps-grid">
        <div v-for="map in filteredMaps" :key="map.id" class="map-card">
          <div class="card-body">
            <div v-if="editingMapId === map.id" class="rename-inline">
              <input 
                v-model="editingMapName"
                class="rename-input"
                @keyup.enter="handleRename(map.id)"
                @keyup.esc="editingMapId = null"
                ref="renameInput"
              />
              <div class="rename-actions">
                <button class="btn-icon" @click="handleRename(map.id)"><Check :size="14" /></button>
                <button class="btn-icon" @click="editingMapId = null"><X :size="14" /></button>
              </div>
            </div>
            <div v-else class="card-info" @click="router.push(`/mapas/${map.id}`)">
              <h3 class="card-title">{{ map.name }}</h3>
              <span class="card-date">Criado em: {{ formatDate(map.createdAt) }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-secondary btn-icon-inline" @click="router.push(`/mapas/${map.id}`)">
              Abrir Canvas <ArrowRight :size="14" class="ml-1" />
            </button>
            <div class="action-buttons-group">
              <button class="btn-text action-icon" @click.stop="startRename(map)" title="Renomear">
                <Edit3 :size="14" />
              </button>
              <button class="btn-text action-icon-danger" @click.stop="handleDelete(map.id)" title="Deletar">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.map-list-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
  width: 100%;
}

.dashboard-sidebar {
  width: 320px;
  background-color: #0d111c;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
}

.dashboard-main {
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  height: 100vh;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo h1 {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.logo-icon-svg {
  color: var(--accent-primary);
  transform: rotate(-10deg);
}

.sidebar-creation-section h3 {
  display: flex;
  align-items: center;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
}

.sidebar-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 0.25rem 0;
}

.sidebar-creation-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-creation-section h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 0.5rem;
}

.creation-help {
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.sidebar-input {
  width: 100%;
}

.sidebar-spacer {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.05);
  margin: 1.25rem 0;
}

.w-full {
  width: 100%;
}

.mt-2 {
  margin-top: 0.5rem;
}

.docs-nav-btn {
  border-color: var(--accent-primary) !important;
  color: var(--accent-primary) !important;
}

.docs-nav-btn:hover {
  background-color: rgba(204, 85, 51, 0.1) !important;
  color: var(--accent-hover) !important;
}

.grid-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid var(--bg-tertiary);
  padding-bottom: 0.75rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: none;
  padding-bottom: 0;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  pointer-events: none;
}

.search-input {
  padding-left: 2.25rem !important;
  width: 250px;
  font-size: 0.875rem;
  height: 38px;
  padding: 0.5rem 1rem;
}

.color-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.filter-select {
  height: 38px;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.85rem;
  background-color: var(--bg-secondary);
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background-color: var(--bg-secondary);
  border: 2px dashed var(--bg-tertiary);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state p {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.empty-state span {
  font-size: 0.95rem;
}

.maps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.map-card {
  background-color: #0d111c;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  transition: all var(--transition-normal);
  cursor: pointer;
  box-shadow: none;
}

.map-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-hover);
  box-shadow: 0 4px 20px rgba(2, 132, 199, 0.15);
}

.card-body {
  flex: 1;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.card-date {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.rename-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rename-input {
  flex: 1;
  background-color: var(--bg-primary);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.6rem;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
}

.rename-actions {
  display: flex;
  gap: 0.25rem;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-icon {
  font-size: 0.95rem;
  opacity: 0.7;
}

.action-icon:hover {
  opacity: 1;
}

.action-icon-danger {
  font-size: 0.95rem;
  opacity: 0.7;
  color: var(--accent-danger);
}

.action-icon-danger:hover {
  opacity: 1;
  color: var(--accent-danger-hover);
}

.input-with-emoji {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.flex-grow-input {
  flex: 1;
}

.btn-icon-inline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}
</style>
