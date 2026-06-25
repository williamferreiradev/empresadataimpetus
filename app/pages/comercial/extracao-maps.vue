<template>
  <div class="w-full px-6 md:px-12 mx-auto pb-28 pt-8">
    
    <!-- Breadcrumb / Header -->
    <div class="mb-6 flex items-center gap-4">
      <button @click="navigateTo('/comercial/extracao')" class="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
        <ArrowLeftIcon class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <MapIcon class="w-7 h-7 text-blue-600" />
          Google Maps
        </h1>
      </div>
    </div>

    <!-- Formulario Principal -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Parâmetros da Busca</h2>

        <div class="space-y-6">
          <!-- Nicho -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nicho de Busca</label>
            <select 
              v-model="nicho" 
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm bg-white"
            >
              <option value="" disabled>Selecione...</option>
              <option value="Cerimonialista">Cerimonialista</option>
              <option value="Imobiliaria alto padrão">Imobiliaria alto padrão</option>
              <option value="Imobiliaria Minha Casa Minha Vida">Imobiliaria Minha Casa Minha Vida</option>
              <option value="Concessionaria">Concessionaria</option>
              <option value="Clinicas odontologicas">Clinicas odontologicas</option>
              <option value="Clinicas estetica">Clinicas estetica</option>
              <option value="Estetica automotiva">Estetica automotiva</option>
              <option value="Auto Center">Auto Center</option>
              <option value="Energia solar">Energia solar</option>
              <option value="Assistência técnica">Assistência técnica</option>
              <option value="Chaveiro">Chaveiro</option>
              <option value="Eletricista">Eletricista</option>
              <option value="Contabilidade">Contabilidade</option>
            </select>
          </div>

          <!-- Região -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Região (Cidade, Estado, País)</label>
            <input 
              v-model="regiao" 
              type="text" 
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
              placeholder="ex: Brasil"
            />
          </div>

          <!-- Grid Filtros numéricos -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Avaliação Mínima</label>
              <input 
                v-model="avaliacaoMinima" 
                type="number" 
                step="0.1"
                min="0"
                max="5"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                placeholder="4"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Mínimo de Avaliações</label>
              <input 
                v-model="minAvaliacoes" 
                type="number" 
                min="0"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                placeholder="10"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Qtd Máxima de Leads</label>
              <input 
                v-model="maxLeads" 
                type="number" 
                min="1"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
                placeholder="10"
              />
            </div>
          </div>

          <div class="h-px bg-gray-100 my-8"></div>

          <!-- Checkboxes -->
          <div class="space-y-4">
            <label class="flex items-center cursor-pointer group">
              <input 
                v-model="altoPadrao"
                type="checkbox" 
                class="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <span class="ml-3 font-medium text-gray-700 group-hover:text-gray-900">Apenas leads de Alto Padrão (Tem Website e Nota mínima 4.5)</span>
            </label>

            <label class="flex items-center cursor-pointer group">
              <input 
                v-model="semSite"
                type="checkbox" 
                class="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <span class="ml-3 font-medium text-gray-700 group-hover:text-gray-900">Apenas empresas sem site (oportunidade para venda de site)</span>
            </label>
          </div>

          <div class="h-px bg-gray-100 my-8"></div>

          <!-- Action -->
          <div v-if="errorMessage" class="p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
            {{ errorMessage }}
          </div>

          <button 
            @click="iniciarExtracao"
            :disabled="isExtracting"
            class="w-full bg-orange-500 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-orange-600 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isExtracting">Iniciar Extração</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loadingText }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabela de Resultados -->
    <div v-if="leads.length > 0" class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">Resultados ({{ leads.length }})</h3>
        <button class="text-sm font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">Exportar CSV</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="p-4 font-bold text-gray-500 text-sm">Empresa</th>
              <th class="p-4 font-bold text-gray-500 text-sm">CNPJ / Info</th>
              <th class="p-4 font-bold text-gray-500 text-sm">Avaliação</th>
              <th class="p-4 font-bold text-gray-500 text-sm">Telefone</th>
              <th class="p-4 font-bold text-gray-500 text-sm">Website</th>
              <th class="p-4 font-bold text-gray-500 text-sm text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lead, idx) in leads" :key="idx" class="border-b border-gray-50 hover:bg-gray-50/50">
              <td class="p-4 font-medium text-gray-900">{{ lead.nome || lead.empresa || lead.title || 'Sem Nome' }}</td>
              <td class="p-4">
                <div v-if="lead.infoExtract?.cnpj" class="flex flex-col">
                  <span class="text-sm font-bold text-emerald-600">{{ lead.infoExtract.cnpj }}</span>
                  <span class="text-xs text-gray-500 truncate max-w-[200px]" :title="lead.infoExtract.cnae">{{ lead.infoExtract.cnae || 'CNAE não disponível' }}</span>
                </div>
                <span v-else class="text-xs text-gray-400 italic bg-gray-100 px-2 py-1 rounded-md">Pendente / Não Achou</span>
              </td>
              <td class="p-4 text-gray-600 flex items-center gap-1">
                ⭐ {{ lead.infoExtract?.totalScore || lead.totalScore || '-' }} <span class="text-xs text-gray-400">({{ lead.infoExtract?.reviewsCount || lead.reviewsCount || 0 }})</span>
              </td>
              <td class="p-4 text-gray-600">{{ lead.telefone || lead.phoneUnformatted || lead.phone || '-' }}</td>
              <td class="p-4 text-blue-500 hover:underline">
                <a v-if="lead.infoExtract?.website || lead.website" :href="lead.infoExtract?.website || lead.website" target="_blank" rel="noopener">Acessar</a>
                <span v-else class="text-gray-400 no-underline">-</span>
              </td>
              <td class="p-4 text-right">
                <button v-if="lead.id" @click="excluirLead(lead.id, idx)" class="text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeftIcon, MapIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'comercial' })

const user = useSupabaseUser()
const nicho = ref('')
const regiao = ref('Brasil')
const avaliacaoMinima = ref(0)
const minAvaliacoes = ref(0)
const maxLeads = ref(10)

const altoPadrao = ref(false)
const semSite = ref(false)

const isExtracting = ref(false)
const loadingText = ref('')
const errorMessage = ref('')
const leads = ref([])

let pollInterval = null

async function iniciarExtracao() {
  if (!nicho.value || !regiao.value) {
    errorMessage.value = 'Preencha o nicho e a região.'
    return
  }

  isExtracting.value = true
  errorMessage.value = ''
  leads.value = []
  loadingText.value = 'Iniciando scraper no Apify...'

  try {
    const response = await $fetch('/api/extracao/iniciar', {
      method: 'POST',
      body: {
        nicho: nicho.value,
        regiao: regiao.value,
        maxLeads: maxLeads.value
      }
    })

    iniciarPolling(response.runId, response.datasetId)
  } catch (error) {
    isExtracting.value = false
    errorMessage.value = error.data?.statusMessage || 'Erro ao iniciar extração.'
  }
}

function iniciarPolling(runId, datasetId) {
  pollInterval = setInterval(async () => {
    try {
      loadingText.value = 'Extraindo dados... (pode demorar alguns minutos)'
      const response = await $fetch('/api/extracao/status', {
        params: { runId, datasetId }
      })

      if (response.finished) {
        clearInterval(pollInterval)
        processarLeads(response.items || [])
      }
    } catch (error) {
      clearInterval(pollInterval)
      isExtracting.value = false
      errorMessage.value = 'Erro ao verificar status da extração.'
    }
  }, 5000)
}

async function processarLeads(items) {
  console.log("Total de items vindos do Apify:", items?.length, items);
  loadingText.value = 'Aplicando filtros...'
  // Pré-processamento e enriquecimento de dados
  // Pré-processamento e enriquecimento de dados
  let filtrados = (items || []).map(item => {
    let site = item.website || item?.infoExtract?.website || '';
    
    // Se o site for um link do whatsapp e não tivermos o telefone, tentamos extrair o número
    if (site && (site.includes('wa.me/') || site.includes('api.whatsapp.com/send'))) {
      if (!item.phone && !item.phoneUnformatted) {
        // Busca sequências numéricas no link
        const match = site.match(/(?:wa\.me\/|phone=)(\d+)/);
        if (match && match[1]) {
          item.phoneUnformatted = '+' + match[1];
          item.phone = '+' + match[1];
        }
      }
    }
    return item;
  });

  // Avaliação mínima
  if (avaliacaoMinima.value) {
    filtrados = filtrados.filter(item => (item.totalScore || 0) >= avaliacaoMinima.value)
  }

  // Mínimo de avaliações
  if (minAvaliacoes.value) {
    filtrados = filtrados.filter(item => (item.reviewsCount || 0) >= minAvaliacoes.value)
  }

  // Apenas sem site (considera redes sociais e whatsapp como "sem site próprio")
  if (semSite.value) {
    filtrados = filtrados.filter(item => {
      const site = (item.website || item?.infoExtract?.website || '').toLowerCase();
      if (!site) return true;
      
      const isSocialOrZzap = site.includes('wa.me') || 
                             site.includes('api.whatsapp.com') || 
                             site.includes('instagram.com') || 
                             site.includes('facebook.com') || 
                             site.includes('linktr.ee');
                             
      return isSocialOrZzap;
    })
  }

  // Alto padrão
  if (altoPadrao.value) {
    filtrados = filtrados.filter(item => (item.website || item?.infoExtract?.website) && (item.totalScore || 0) >= 4.5)
  }

  leads.value = filtrados

  if (filtrados.length > 0) {
    try {
      loadingText.value = 'Salvando leads no banco de dados...'
      const responseSalvar = await $fetch('/api/extracao/salvar', {
        method: 'POST',
        body: { 
          leads: filtrados,
          responsavel: user.value?.id 
        }
      })
      
      // Atualiza a tabela para mostrar os leads que voltaram do banco (com ID)
      if (responseSalvar.leads_salvos) {
        leads.value = responseSalvar.leads_salvos
      } else {
        leads.value = filtrados
      }
      
      alert(`${filtrados.length} leads extraídos e salvos no banco com sucesso!`)
    } catch (error) {
      console.error('Erro ao salvar no banco:', error)
      leads.value = filtrados // Mantém os que vieram do apify caso o banco falhe
      errorMessage.value = 'Extração concluída, mas houve uma falha ao salvar no banco de dados.'
    }
  } else {
    leads.value = []
    alert('A extração terminou, mas nenhum lead passou nos filtros aplicados.')
  }

  isExtracting.value = false
}

async function excluirLead(id, idx) {
  if (!confirm('Deseja realmente excluir este lead do banco de dados?')) return
  
  try {
    await $fetch('/api/extracao/excluir', {
      method: 'DELETE',
      params: { id }
    })
    leads.value.splice(idx, 1)
  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao tentar excluir o lead do banco de dados.')
  }
}
</script>
