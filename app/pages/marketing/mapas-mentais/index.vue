<template>
  <div class="max-w-7xl mx-auto p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">Mapas Mentais</h1>
        <p class="text-gray-500 dark:text-zinc-400 mt-1">Gerencie e crie mapas mentais para o setor de marketing.</p>
      </div>
      <button 
        @click="criarNovoMapa" 
        :disabled="loading"
        class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors disabled:opacity-50"
      >
        <span v-if="loading" class="mr-2">...</span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Criar Novo Mapa
      </button>
    </div>

    <div v-if="fetching" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>

    <div v-else-if="mapas.length === 0" class="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-12 text-center shadow-sm">
      <div class="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-zinc-100 mb-2">Nenhum mapa mental</h3>
      <p class="text-gray-500 dark:text-zinc-400 max-w-md mx-auto mb-6">Você ainda não criou nenhum mapa mental. Clique no botão acima para começar a organizar suas ideias.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="mapa in mapas" 
        :key="mapa.id"
        @click="navigateTo(`/marketing/mapas-mentais/${mapa.id}`)"
        class="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all group relative overflow-hidden"
      >
        <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <button @click.stop="deletarMapa(mapa.id)" class="text-gray-400 dark:text-zinc-500 hover:text-red-500 transition-colors p-1" title="Excluir">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1 group-hover:text-orange-600 transition-colors">{{ mapa.nome }}</h3>
        <p class="text-sm text-gray-500 dark:text-zinc-400">
          Criado em {{ new Date(mapa.created_at).toLocaleDateString('pt-BR') }}
        </p>
      </div>
    </div>

    <!-- Custom Confirm Modal -->
    <div v-if="confirmMessage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h3 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">Atenção</h3>
        <p class="text-gray-600 dark:text-zinc-400 mb-6">{{ confirmMessage }}</p>
        <div class="flex justify-end gap-3">
          <button @click="confirmMessage = null" class="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            Cancelar
          </button>
          <button @click="handleConfirmYes" class="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-sm">
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'marketing' })

const supabase = useSupabaseClient()
const mapas = ref([])
const loading = ref(false)
const fetching = ref(true)

const fetchMapas = async () => {
  fetching.value = true
  const { data, error } = await supabase
    .from('ibeia_mapas_mentais')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (!error && data) {
    mapas.value = data
  }
  fetching.value = false
}

onMounted(() => {
  fetchMapas()
})

const criarNovoMapa = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('ibeia_mapas_mentais')
    .insert([
      { 
        nome: 'Novo Mapa Mental', 
        elementos: [
          {
            id: 'node_0',
            type: 'custom',
            position: { x: 250, y: 250 },
            data: { label: 'Ideia Central', shape: 'rectangle' }
          }
        ]
      }
    ])
    .select()
    .single()
    
  loading.value = false
  
  if (!error && data) {
    navigateTo(`/marketing/mapas-mentais/${data.id}`)
  } else {
    alert('Erro ao criar mapa mental. Tabela ibeia_mapas_mentais existe?')
  }
}

const confirmMessage = ref(null)
const mapToDelete = ref(null)

const deletarMapa = (id) => {
  mapToDelete.value = id
  confirmMessage.value = 'Tem certeza que deseja excluir este mapa?'
}

const handleConfirmYes = async () => {
  if (!mapToDelete.value) return
  
  const id = mapToDelete.value
  confirmMessage.value = null
  mapToDelete.value = null
  
  const { error } = await supabase.from('ibeia_mapas_mentais').delete().eq('id', id)
  if(!error) {
    fetchMapas()
  }
}
</script>
