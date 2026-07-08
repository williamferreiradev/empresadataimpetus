<template>
  <div class="w-screen h-screen relative overflow-hidden bg-[#f8f9fa]">
    <!-- Header flutuante para controle do mapa -->
    <div class="absolute top-4 left-24 z-50 flex items-center bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-200 dark:border-zinc-700 px-4 py-2 gap-4">
      <button 
        @click="navigateTo('/marketing/mapas-mentais')"
        class="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100 transition-colors"
        title="Voltar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      
      <div class="h-6 w-px bg-gray-300"></div>
      
      <div v-if="loading" class="text-sm text-gray-500 dark:text-zinc-400">Carregando...</div>
      <input 
        v-else
        v-model="mapa.nome" 
        class="font-semibold text-gray-900 dark:text-zinc-100 bg-transparent border-none outline-none focus:ring-2 focus:ring-orange-500 rounded px-1"
        placeholder="Nome do mapa"
      />
      <div class="h-6 w-px bg-gray-300 mx-2"></div>
      
      <!-- Visualização -->
      <div class="flex items-center bg-gray-100 dark:bg-zinc-800 rounded p-1">
        <button 
          @click="currentView = 'map'"
          class="px-3 py-1 text-sm font-medium rounded transition-colors"
          :class="currentView === 'map' ? 'bg-white dark:bg-zinc-800 shadow text-orange-600' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100'"
        >Mapa</button>
        <button 
          @click="currentView = 'text'"
          class="px-3 py-1 text-sm font-medium rounded transition-colors"
          :class="currentView === 'text' ? 'bg-white dark:bg-zinc-800 shadow text-orange-600' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100'"
        >Texto</button>
        <button 
          @click="currentView = 'table'"
          class="px-3 py-1 text-sm font-medium rounded transition-colors"
          :class="currentView === 'table' ? 'bg-white dark:bg-zinc-800 shadow text-orange-600' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 dark:text-zinc-100'"
        >Tabela</button>
      </div>
      
      <div class="h-6 w-px bg-gray-300 mx-2"></div>
      
      <button 
        @click="salvarMapa" 
        :disabled="saving"
        class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-4 rounded flex items-center transition-colors disabled:opacity-80"
      >
        <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span v-else class="w-4 h-4 mr-1 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
        </span>
        {{ saving ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>

    <template v-if="!loading">
      <MindMapEditor 
        v-show="currentView === 'map'"
        :initial-elements="mapa.elementos" 
        @update:elements="updateElementos"
      />
      
      <div v-if="currentView === 'text'" class="pt-24 px-8 w-full h-full overflow-y-auto pb-8">
        <MindMapTextView :elements="elementosAtuais.length ? elementosAtuais : mapa.elementos" />
      </div>

      <div v-if="currentView === 'table'" class="pt-24 px-8 w-full h-full overflow-y-auto pb-8">
        <MindMapTableView :elements="elementosAtuais.length ? elementosAtuais : mapa.elementos" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MindMapEditor from '~/components/mindmap/MindMapEditor.vue'
import MindMapTextView from '~/components/mindmap/views/MindMapTextView.vue'
import MindMapTableView from '~/components/mindmap/views/MindMapTableView.vue'

definePageMeta({ layout: false })

const currentView = ref('map')

const route = useRoute()
const supabase = useSupabaseClient()
const mapa = ref({ nome: '', elementos: [] })
const loading = ref(true)
const saving = ref(false)
const elementosAtuais = ref([])

onMounted(async () => {
  const { data, error } = await supabase
    .from('ibeia_mapas_mentais')
    .select('*')
    .eq('id', route.params.id)
    .single()
    
  if (data) {
    mapa.value = data
    if (!mapa.value.elementos) mapa.value.elementos = []
    elementosAtuais.value = JSON.parse(JSON.stringify(mapa.value.elementos)) // Setup initial state
  }
  loading.value = false
})

let debounceTimer = null
const triggerAutoSave = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    salvarMapa()
  }, 800) // Salva automaticamente após 800ms sem edições
}

const updateElementos = (els) => {
  elementosAtuais.value = els
  triggerAutoSave()
}

watch(() => mapa.value.nome, () => {
  if (!loading.value) triggerAutoSave()
})

const salvarMapa = async () => {
  saving.value = true
  const payload = {
    nome: mapa.value.nome,
    elementos: elementosAtuais.value
  }
  
  await supabase
    .from('ibeia_mapas_mentais')
    .update(payload)
    .eq('id', route.params.id)
    
  saving.value = false
}
</script>
