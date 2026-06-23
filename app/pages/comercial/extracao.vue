<template>
  <div class="w-full px-6 md:px-12 mx-auto pb-28">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Extração de Leads</h1>
        <p class="text-gray-500 text-sm mt-1">Busque e extraia novos contatos para o seu funil de vendas.</p>
      </div>
      <button @click="showModal = true" class="bg-orange-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow hover:bg-orange-600 transition-colors flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Nova Busca
      </button>
    </div>

    <!-- Tabela de Leads Extraídos -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg font-bold text-gray-900">Últimos Leads Extraídos</h2>
        <span class="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{{ leadsExtraidos.length }} encontrados</span>
      </div>

      <div v-if="isLoading" class="p-12 text-center text-gray-500">
        <svg class="animate-spin h-8 w-8 text-orange-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Buscando leads extraídos...
      </div>

      <div v-else-if="leadsExtraidos.length === 0" class="p-16 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-6">
          <svg class="h-10 w-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Nenhum lead extraído ainda</h3>
        <p class="text-gray-500 max-w-md mx-auto mb-6">
          Utilize o botão "Nova Busca" para extrair contatos qualificados para o seu funil de vendas.
        </p>
        <button @click="showModal = true" class="bg-white border border-gray-300 text-gray-700 font-medium text-sm px-5 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          Começar Extração
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lead</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contato</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Segmento / Origem</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Extração</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="lead in leadsExtraidos" :key="lead.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-900">{{ lead.nome }}</div>
                <div class="text-sm text-gray-500">{{ lead.empresa || '-' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ lead.telefone || 'Sem telefone' }}</div>
                <div class="text-xs text-gray-500">{{ lead.email || 'Sem e-mail' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ lead.segmento || '-' }}</div>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {{ lead.origem || 'Desconhecido' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(lead.criado_em) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="abrirEnriquecimento(lead)" class="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors mr-2">
                  Enriquecer
                </button>
                <NuxtLink :to="`/comercial/clientes/${lead.id}`" class="text-orange-500 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-md transition-colors">
                  Ver detalhes
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Modal de Nova Busca -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden">

        <!-- Header do modal -->
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Nova Busca</h3>
            <p class="text-sm text-gray-500 mt-0.5">Escolha a fonte de onde você deseja extrair os leads</p>
          </div>
          <button @click="showModal = false" class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Cards de opção -->
        <div class="grid grid-cols-2 gap-5 p-8">

          <!-- Card 1: Google Maps -->
          <button @click="navigateTo('/comercial/extracao-maps')" class="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div class="w-16 h-16 rounded-2xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-5 transition-colors shadow-sm">
              <MapIcon class="w-8 h-8 text-blue-600" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Google Maps</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Busque negócios locais por nicho e localização. Extraia telefones, endereços e sites.</p>
          </button>

          <!-- Card 2: Instagram Seguidores -->
          <button @click="navigateTo('/comercial/extracao-insta')" class="group flex flex-col items-center text-center p-8 rounded-2xl border-2 border-gray-100 hover:border-pink-300 hover:bg-pink-50/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <div class="w-16 h-16 rounded-2xl bg-pink-100 group-hover:bg-pink-200 flex items-center justify-center mb-5 transition-colors shadow-sm">
              <UsersIcon class="w-8 h-8 text-pink-600" />
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2">Instagram Seguidores</h4>
            <p class="text-sm text-gray-500 leading-relaxed">Extraia seguidores de perfis específicos focados no seu nicho de atuação.</p>
          </button>

        </div>
      </div>
    </div>

    <!-- Modal de Enriquecimento de Lead -->
    <div v-if="enrichModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" @click="enrichModal = false"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
        <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Enriquecer Lead</h3>
            <p class="text-sm text-gray-500 mt-0.5">Adicione informações extras ao lead {{ selectedLead?.nome }}</p>
          </div>
          <button @click="enrichModal = false" class="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-8 space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">CNPJ</label>
            <input v-model="enrichForm.CNPJ" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="Ex: 00.000.000/0000-00" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nome do Decisor</label>
            <input v-model="enrichForm.Nome_Decisor" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="Ex: João Silva" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Telefone (Contato do Decisor)</label>
            <input v-model="enrichForm.telefone" type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="Ex: (11) 99999-9999" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
            <input v-model="enrichForm.email" type="email" class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm" placeholder="Ex: contato@empresa.com" />
          </div>
        </div>
        
        <div class="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button @click="enrichModal = false" class="px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors">
            Cancelar
          </button>
          <button @click="salvarEnriquecimento" :disabled="isSaving" class="px-5 py-2.5 rounded-xl font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSaving ? 'Salvando...' : 'Salvar Dados' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MapIcon, UsersIcon, XMarkIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'comercial' })

const supabase = useSupabaseClient()
const showModal = ref(false)

const isLoading = ref(true)
const leadsExtraidos = ref([])

// Enriquecimento refs
const enrichModal = ref(false)
const selectedLead = ref(null)
const isSaving = ref(false)
const enrichForm = ref({
  CNPJ: '',
  Nome_Decisor: '',
  telefone: '',
  email: ''
})

onMounted(() => {
  fetchLeadsExtraidos()
})

async function fetchLeadsExtraidos() {
  isLoading.value = true
  const { data, error } = await supabase
    .from('ibeia_clientes')
    .select('*')
    .eq('status', 'Extraído')
    .order('criado_em', { ascending: false })
  
  if (error) {
    console.error('Erro ao buscar leads extraídos:', error.message)
  } else {
    leadsExtraidos.value = data || []
  }
  isLoading.value = false
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('pt-BR', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  }).format(new Date(dateStr))
}

function abrirEnriquecimento(lead) {
  selectedLead.value = lead
  enrichForm.value = {
    CNPJ: lead.CNPJ || '',
    Nome_Decisor: lead.Nome_Decisor || '',
    telefone: lead.telefone || '',
    email: lead.email || ''
  }
  enrichModal.value = true
}

async function salvarEnriquecimento() {
  if (!selectedLead.value) return
  isSaving.value = true
  
  const updates = {
    CNPJ: enrichForm.value.CNPJ,
    Nome_Decisor: enrichForm.value.Nome_Decisor,
    telefone: enrichForm.value.telefone,
    email: enrichForm.value.email
  }
  
  const { error } = await supabase
    .from('ibeia_clientes')
    .update(updates)
    .eq('id', selectedLead.value.id)
    
  if (error) {
    alert('Erro ao salvar dados: ' + error.message)
  } else {
    const index = leadsExtraidos.value.findIndex(l => l.id === selectedLead.value.id)
    if (index !== -1) {
      leadsExtraidos.value[index] = { ...leadsExtraidos.value[index], ...updates }
    }
    enrichModal.value = false
  }
  isSaving.value = false
}
</script>
