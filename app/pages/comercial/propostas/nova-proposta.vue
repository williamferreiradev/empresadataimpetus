<template>
  <div class="w-full px-6 md:px-12 mx-auto pb-28">
    <!-- Header -->
    <div class="mb-8 flex items-center">
      <NuxtLink to="/comercial/propostas" class="mr-4 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Nova Proposta</h1>
        <p class="text-gray-500 text-sm">Preencha o briefing e deixa a IA gerar para você.</p>
      </div>
    </div>

    <!-- Alert de sucesso -->
    <div v-if="successMsg" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center font-medium">
      <svg class="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ successMsg }}
    </div>

    <!-- Alert de erro -->
    <div v-if="errorMsg" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-start">
      <svg class="w-5 h-5 mr-2 mt-0.5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p class="font-bold">Erro ao gerar proposta</p>
        <p class="text-sm mt-1">{{ errorMsg }}</p>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isGenerating" class="mb-6 p-6 bg-orange-50 border border-orange-200 rounded-2xl flex items-center">
      <svg class="animate-spin h-6 w-6 mr-4 text-orange-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <div>
        <p class="font-bold text-orange-800">Gemini está gerando sua proposta...</p>
        <p class="text-sm text-orange-600">Isso pode levar 10–20 segundos. Não feche esta página.</p>
      </div>
    </div>

    <form @submit.prevent="gerarComGemini">

      <!-- SEÇÃO 1: CLIENTE -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-800 flex items-center">
            <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm font-black">1</span>
            Cliente
          </h2>
          <button type="button" @click="showModal = true" class="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center transition-colors">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Criar Cliente
          </button>
        </div>

        <div class="grid grid-cols-1 gap-5">
          <!-- Dropdown de clientes com pesquisa -->
          <div class="relative" ref="dropdownRef">
            <label class="block text-sm font-bold text-gray-700 mb-2">Lead existente</label>
            <div 
              @click="dropdownOpen = !dropdownOpen" 
              class="w-full border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 p-3 bg-gray-50 cursor-pointer flex justify-between items-center"
            >
              <span class="truncate text-gray-700">{{ selectedClienteNome || '-- Preencher manualmente ou selecionar --' }}</span>
              <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            
            <div v-if="dropdownOpen" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div class="sticky top-0 bg-white p-2 border-b border-gray-100">
                <input 
                  v-model="searchCliente" 
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none" 
                  placeholder="Pesquisar cliente..." 
                  @click.stop 
                />
              </div>
              <div 
                @click="selecionarDropdown('')" 
                class="px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm text-gray-600 border-b border-gray-100"
              >
                -- Preencher manualmente ou limpar seleção --
              </div>
              <div 
                v-for="c in filteredClientes" 
                :key="c.id" 
                @click="selecionarDropdown(c)" 
                class="px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm truncate text-gray-800"
              >
                {{ c.nome }} {{ c.empresa ? `— ${c.empresa}` : '' }}
              </div>
              <div v-if="filteredClientes.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                Nenhum cliente encontrado
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Nome do contato <span class="text-red-500">*</span></label>
              <input v-model="form.cliente_nome" required type="text" placeholder="Ex: João Silva" class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Empresa <span class="text-red-500">*</span></label>
              <input v-model="form.cliente_empresa" required type="text" placeholder="Ex: Clínica Saúde+" class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Segmento</label>
            <select v-model="form.segmento" class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3">
              <option value="">Selecione...</option>
              <option>Clínica/Saúde</option>
              <option>Imobiliária</option>
              <option>Concessionária</option>
              <option>E-commerce</option>
              <option>SaaS/Tech</option>
              <option>Varejo</option>
              <option>Educação</option>
              <option>Jurídico</option>
              <option>Outro</option>
            </select>
          </div>
        </div>
      </div>

      <!-- SEÇÃO 2: BRIEFING -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-6">
        <h2 class="text-lg font-bold text-gray-800 flex items-center mb-6">
          <span class="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm font-black">2</span>
          Briefing da reunião
        </h2>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Dores identificadas <span class="text-red-500">*</span></label>
            <textarea v-model="form.dores" required rows="4" placeholder="Ex: Perde 3h/dia criando propostas manualmente. Follow-up inconsistente. CRM desatualizado..." class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 resize-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Escopo solicitado <span class="text-red-500">*</span></label>
            <textarea v-model="form.escopo" required rows="3" placeholder="Ex: Automação de propostas comerciais + follow-up via WhatsApp + integração com CRM existente" class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 resize-none"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Investimento estimado</label>
              <input v-model="form.valor_estimado" type="text" placeholder="Ex: R$ 4.800 / mês" class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Prazo de entrega</label>
              <input v-model="form.prazo_estimado" type="text" placeholder="Ex: 3 semanas" class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Contexto adicional</label>
            <textarea v-model="form.contexto" rows="3" placeholder="Ex: Cliente já usa n8n. Tem urgência pro próximo trimestre. Concorre com fornecedor X." class="w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 p-3 resize-none"></textarea>
          </div>
        </div>
      </div>
    </form>

    <!-- Barra de ações fixa no bottom -->
    <div class="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 p-4 px-8 flex justify-between items-center shadow-lg z-40">
      <div class="flex space-x-3">
        <button type="button" @click="salvarRascunho" :disabled="isSaving || isGenerating" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center">
          <svg v-if="isSaving" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Salvando...' : 'Salvar rascunho' }}
        </button>

        <button type="button" @click="copiarPrompt" :disabled="isGenerating" class="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center">
          <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copiar prompt
        </button>
      </div>

      <button
        type="button"
        @click="gerarComGemini"
        :disabled="isGenerating || isSaving"
        class="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center text-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg v-if="isGenerating" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        {{ isGenerating ? 'Gerando com IA...' : '✨ Gerar com Gemini' }}
      </button>
    </div>

    <!-- Modal Adicionar Cliente (idêntico ao clientes.vue) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" @click="showModal = false"></div>
      
      <div class="relative w-full max-w-2xl mx-auto my-6 z-50">
        <div class="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-xl outline-none focus:outline-none">
          <!-- Cabeçalho -->
          <div class="flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t-xl">
            <h3 class="text-xl font-bold text-gray-900">Adicionar Cliente</h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-gray-400 text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600" @click="showModal = false">
              <span class="h-6 w-6 text-2xl block outline-none">×</span>
            </button>
          </div>
          
          <!-- Corpo -->
          <div class="relative p-6 flex-auto">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input v-model="novoCliente.nome" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome do cliente" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input v-model="novoCliente.empresa" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="Nome da empresa" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input v-model="novoCliente.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input v-model="novoCliente.telefone" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
                  <select v-model="novoCliente.segmento" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                    <option value="">Selecione...</option>
                    <option>Cerimonialista</option>
                    <option>Imobiliaria alto padrão</option>
                    <option>Imobiliria Minha Casa Minha Vida</option>
                    <option>Concessionaria</option>
                    <option>Clinicas odontologicas</option>
                    <option>Clinicas estetica</option>
                    <option>Estetica automotiva</option>
                    <option>Auto Center</option>
                    <option>Energia solar</option>
                    <option>Assistência técnica</option>
                    <option>Chaveiro</option>
                    <option>Eletricista</option>
                    <option>Contabilidade</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                  <select v-model="novoCliente.origem" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                    <option value="">Selecione...</option>
                    <option>Facebook ads</option>
                    <option>Google ADS</option>
                    <option>Indicação</option>
                    <option>Google maps</option>
                    <option>Instagram</option>
                    <option>Receita federal</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select v-model="novoCliente.status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white">
                    <option>Novo</option>
                    <option>Em contato</option>
                    <option>Qualificado</option>
                    <option>Proposta enviada</option>
                    <option>Fechado</option>
                    <option>Perdido</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Rodapé -->
          <div class="flex items-center justify-end p-5 border-t border-solid border-gray-200 rounded-b-xl">
            <button class="text-gray-500 bg-transparent font-medium px-6 py-2 text-sm outline-none mr-2" type="button" @click="showModal = false" :disabled="criandoCliente">
              Cancelar
            </button>
            <button class="bg-orange-500 text-white font-medium text-sm px-6 py-2 rounded-lg shadow hover:bg-orange-600 outline-none" type="button" @click="criarCliente" :disabled="criandoCliente">
              {{ criandoCliente ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePropostasStore } from '~/stores/propostas'

definePageMeta({ layout: 'comercial' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const store = usePropostasStore()
const { userViewAllLeads, userId } = useUserRole()

// Estado do formulário
const form = ref({
  cliente_nome: '',
  cliente_empresa: '',
  segmento: '',
  dores: '',
  escopo: '',
  valor_estimado: '',
  prazo_estimado: '',
  contexto: '',
})

const clientes = ref([])
const selectedClienteId = ref('')

// UI state
const isGenerating = ref(false)
const isSaving = ref(false)
const showModal = ref(false)
const criandoCliente = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

const novoCliente = ref({ nome: '', empresa: '', email: '', telefone: '', segmento: '', origem: '', status: 'Novo' })

// Refs do dropdown customizado
const dropdownRef = ref(null)
const dropdownOpen = ref(false)
const searchCliente = ref('')
const selectedClienteNome = ref('')

const filteredClientes = computed(() => {
  if (!searchCliente.value) return clientes.value
  const query = searchCliente.value.toLowerCase()
  return clientes.value.filter(c => 
    c.nome.toLowerCase().includes(query) || 
    (c.empresa && c.empresa.toLowerCase().includes(query))
  )
})

function selecionarDropdown(c) {
  if (!c) {
    selectedClienteId.value = ''
    selectedClienteNome.value = ''
    form.value.cliente_nome = ''
    form.value.cliente_empresa = ''
  } else {
    selectedClienteId.value = c.id
    selectedClienteNome.value = c.nome + (c.empresa ? ` — ${c.empresa}` : '')
    form.value.cliente_nome = c.nome || ''
    form.value.cliente_empresa = c.empresa || ''
  }
  dropdownOpen.value = false
  searchCliente.value = ''
}

function closeDropdown(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  fetchClientes()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

watch([userViewAllLeads, userId], () => {
  fetchClientes()
})

async function fetchClientes() {
  let query = supabase
    .from('ibeia_clientes')
    .select('id, nome, empresa')
    .order('criado_em', { ascending: false })
    
  if (!userViewAllLeads.value && userId.value) {
    query = query.eq('responsavel', userId.value)
  }

  const { data, error } = await query
  if (error) console.warn('Erro ao buscar clientes:', error.message)
  if (data) clientes.value = data
}

async function criarCliente() {
  if (!novoCliente.value.nome) return alert('Nome é obrigatório')
  criandoCliente.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('ibeia_clientes')
      .insert({
        nome: novoCliente.value.nome,
        empresa: novoCliente.value.empresa || null,
        email: novoCliente.value.email || null,
        telefone: novoCliente.value.telefone || null,
        segmento: novoCliente.value.segmento || null,
        origem: novoCliente.value.origem || null,
        status: novoCliente.value.status || 'Novo',
        responsavel: user?.id || null
      })
      .select().single()
    if (error) throw error
    clientes.value.unshift(data)
    selectedClienteId.value = data.id
    preencherCliente()
    showModal.value = false
    novoCliente.value = { nome: '', empresa: '', email: '', telefone: '', segmento: '', origem: '', status: 'Novo' }
  } catch (e) {
    alert('Erro ao criar cliente: ' + e.message)
  } finally {
    criandoCliente.value = false
  }
}

function validarForm() {
  if (!form.value.cliente_nome.trim()) return 'Nome do contato é obrigatório'
  if (!form.value.cliente_empresa.trim()) return 'Empresa é obrigatória'
  if (!form.value.dores.trim()) return 'Dores identificadas são obrigatórias'
  if (!form.value.escopo.trim()) return 'Escopo solicitado é obrigatório'
  return null
}

function montarPrompt() {
  const CORES = {
    'Imobiliária': '#d97757',
    'Clínica/Saúde': '#3B82F6',
    'SaaS/Tech': '#8B5CF6',
    'E-commerce': '#F59E0B',
    'Concessionária': '#10B981',
    'Varejo': '#EC4899',
    'Educação': '#6366F1',
    'Jurídico': '#64748B',
  }
  const accent = CORES[form.value.segmento] || '#6366F1'
  const investimento = form.value.valor_estimado || 'a ser definido'
  const prazo = form.value.prazo_estimado || 'a ser definido'

  return `Você é o melhor especialista em propostas comerciais B2B de automação e IA do Brasil.
Trabalha para a empresa Data Impetus e vai criar uma proposta EXCLUSIVA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOME: ${form.value.cliente_nome}
EMPRESA: ${form.value.cliente_empresa}
SEGMENTO: ${form.value.segmento || 'Não informado'}
DORES DA REUNIÃO: ${form.value.dores}
ESCOPO: ${form.value.escopo}
INVESTIMENTO: ${investimento}
PRAZO: ${prazo}
CONTEXTO: ${form.value.contexto || 'Nenhum'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGRAS:
1. hero.headline = pergunta sobre a DOR PRINCIPAL de ${form.value.cliente_empresa} (máx 12 palavras)
2. diagnostico = problemas EXATOS que ${form.value.cliente_nome} mencionou (não genéricos)
3. ancoragem = calcule perdas financeiras reais baseadas nas dores descritas
4. com_solucao.roi_percentual = ((ganhos - custo) / custo) × 100 usando o investimento ${investimento}
5. investimento.valor_principal = EXATAMENTE "${investimento}"
6. investimento.prazo = EXATAMENTE "${prazo}"
7. entregas = entregáveis REAIS do escopo "${form.value.escopo}"
8. accent_color = "${accent}"
9. Português brasileiro, tom profissional e direto.

Gere o JSON completo agora.`
}

async function gerarComGemini() {
  errorMsg.value = ''
  successMsg.value = ''
  
  const erro = validarForm()
  if (erro) {
    errorMsg.value = erro
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  isGenerating.value = true

  try {
    // 1. Chama a API do Gemini (server-side)
    const response = await fetch('/api/gemini/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: montarPrompt() }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Gemini retornou erro ${response.status}: ${errText}`)
    }

    const jsonGerado = await response.json()

    // 2. Salva no banco via store (com fallback local)
    const payload = {
      cliente_nome: form.value.cliente_nome,
      cliente_empresa: form.value.cliente_empresa,
      segmento: form.value.segmento,
      dores: form.value.dores,
      escopo: form.value.escopo,
      valor_estimado: form.value.valor_estimado,
      prazo_estimado: form.value.prazo_estimado,
      contexto: form.value.contexto,
      status: 'em_revisao',
      criado_por: user.value?.email || 'Vendedor',
      responsavel: user.value?.sub || user.value?.id || null,
      conteudo: JSON.stringify(jsonGerado),
    }

    if (selectedClienteId.value) payload.cliente_id = selectedClienteId.value

    const propostaSalva = await store.createProposta(payload)

    // 3. Redireciona para a proposta
    router.push(`/p/${propostaSalva.id}`)

  } catch (err) {
    console.error('Erro ao gerar proposta:', err)
    errorMsg.value = err.message || 'Erro desconhecido. Tente novamente.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isGenerating.value = false
  }
}

async function salvarRascunho() {
  const erro = validarForm()
  if (erro) { errorMsg.value = erro; return }

  isSaving.value = true
  try {
    const payload = {
      cliente_nome: form.value.cliente_nome,
      cliente_empresa: form.value.cliente_empresa,
      segmento: form.value.segmento,
      dores: form.value.dores,
      escopo: form.value.escopo,
      valor_estimado: form.value.valor_estimado,
      prazo_estimado: form.value.prazo_estimado,
      contexto: form.value.contexto,
      status: 'rascunho',
      criado_por: user.value?.email || 'Vendedor',
      responsavel: user.value?.sub || user.value?.id || null,
    }
    if (selectedClienteId.value) payload.cliente_id = selectedClienteId.value

    await store.createProposta(payload)
    successMsg.value = 'Rascunho salvo com sucesso!'
    setTimeout(() => router.push('/comercial/propostas'), 1500)
  } catch (err) {
    errorMsg.value = 'Erro ao salvar rascunho: ' + err.message
  } finally {
    isSaving.value = false
  }
}

async function copiarPrompt() {
  const erro = validarForm()
  if (erro) { errorMsg.value = erro; return }
  try {
    await navigator.clipboard.writeText(montarPrompt())
    successMsg.value = 'Prompt copiado! Cole no Claude ou ChatGPT.'
    setTimeout(() => successMsg.value = '', 3000)
  } catch {
    alert('Não foi possível copiar.')
  }
}
</script>
